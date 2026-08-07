require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const net = require('net');
const os = require('os');
const selfsigned = require('selfsigned');
const db = require('./db/database');

const app = express();
const PORT = parseInt(process.env.PORT || '3002', 10);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- REST API ENDPOINTS ---

// Get stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, ...stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Search or list products
app.get('/api/products', (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit || '20', 10);
    if (!query) {
      const stats = db.getStats();
      return res.json({ success: true, count: stats.total, products: [] });
    }
    const products = db.searchProducts(query, limit);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all products (for offline sync)
app.get('/api/products/all', (req, res) => {
  try {
    const products = db.getAllProducts();
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get product by exact barcode or stock code
app.get('/api/products/lookup/:code', (req, res) => {
  try {
    const product = db.getProductByBarcodeOrStock(req.params.code);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  try {
    const { name, floor, batch, shelf } = req.body;
    if (!name || !batch || !shelf) {
      return res.status(400).json({
        success: false,
        error: 'Product name, row (batch), and shelf are required fields.'
      });
    }

    const pad2 = (v) => {
      const s = (v || '').toString().trim();
      return s.length === 1 ? '0' + s : s;
    };

    const row = pad2(batch);
    const sh = pad2(shelf);
    const lev = pad2(req.body.level) || '00';
    const fl = floor || '1';

    const loc = `${fl}-${row}-${sh}-${lev}`;
    const floorLabel = fl === '1' ? 'First Floor' : (fl === '2' ? 'Second Floor' : 'Third Floor');
    const loc_full = `${loc} ${floorLabel} - Row ${row} - Shelves ${sh} - Level ${lev}`;

    const newProduct = db.createProduct({
      ...req.body,
      floor: fl,
      batch: row,
      shelf: sh,
      level: lev,
      loc,
      loc_full
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Helper to get local IP addresses for easy mobile connection
function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

// Generate or load SSL certificates for mobile HTTPS camera support
async function getSslCertificates() {
  const certDir = path.join(__dirname, 'db', 'certs');
  const keyPath = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');

  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
  }

  const localIps = getLocalIpAddresses();
  const altNames = [
    { type: 2, value: 'localhost' },
    { type: 7, ip: '127.0.0.1' },
    ...localIps.map(ip => ({ type: 7, ip }))
  ];

  const pems = await selfsigned.generate(
    [{ name: 'commonName', value: 'Warehouse Product Locator' }],
    { days: 365, altNames }
  );

  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);

  return { key: pems.private, cert: pems.cert };
}

// Start Protocol-Multiplexed Server (Handles BOTH http:// and https:// on PORT 3002 seamlessly)
async function startServer() {
  const httpServer = http.createServer(app);
  let httpsServer = null;

  try {
    const sslOptions = await getSslCertificates();
    httpsServer = https.createServer(sslOptions, app);
  } catch (err) {
    console.warn('SSL initialization skipped:', err.message);
  }

  // Multiplexing server socket router
  const server = net.createServer((socket) => {
    socket.on('error', (err) => {
      // Cleanly handle client disconnects (ECONNRESET) without crashing
    });

    socket.once('data', (buffer) => {
      socket.pause();
      socket.unshift(buffer);
      // 0x16 (22) is the first byte of TLS Record Header (Handshake)
      if (buffer[0] === 22 && httpsServer) {
        httpsServer.emit('connection', socket);
      } else {
        httpServer.emit('connection', socket);
      }
      socket.resume();
    });
  });

  server.listen(PORT, () => {
    const localIps = getLocalIpAddresses();
    console.log(`=================================================`);
    console.log(`🚀 Warehouse Product Locator is LIVE!`);
    console.log(`🌐 HTTP Access:   http://localhost:${PORT}`);
    console.log(`🔒 HTTPS Access:  https://localhost:${PORT}`);
    localIps.forEach(ip => {
      console.log(`📱 Mobile Network: http://${ip}:${PORT}  or  https://${ip}:${PORT}`);
    });
    console.log(`=================================================`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
