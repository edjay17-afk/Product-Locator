require('dotenv').config();
const express = require('express');
const cors = require('cors');
let compression;
try { compression = require('compression'); } catch(e) { compression = null; }
const path = require('path');
const fs = require('fs');
const http = require('http');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }
});

// XLSX is still used server-side for any future import features
let XLSX;
try { XLSX = require('xlsx'); } catch (e) { XLSX = null; }

const db = require('./db/supabase');
const inventory = require('./db/inventory');
const os = require('os');
const {
  clearSessionCookie,
  createSession,
  requireAuth,
  requireRole,
  readSession,
  setSessionCookie
} = require('./auth');

const app = express();
const PORT = parseInt(process.env.PORT || '3002', 10);

app.disable('x-powered-by');
if (compression) app.use(compression());
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(value => value.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : false,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const loginAttempts = new Map();
function loginRateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(key) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 15 * 60 * 1000;
  }
  entry.count += 1;
  loginAttempts.set(key, entry);
  if (entry.count > 20) return res.status(429).json({ success: false, error: 'Too many login attempts. Try again later.' });
  next();
}

function getLocalIpAddress() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading network interfaces:', e);
  }
  return 'localhost';
}


// Endpoint to fetch host and local IP address info
app.get('/api/host-info', requireAuth, (req, res) => {
  const localIp = getLocalIpAddress();
  res.json({
    success: true,
    localIp,
    port: PORT
  });
});

// --- REST API ENDPOINTS ---

// --- AUTHENTICATION & USER ENDPOINTS ---

// Health check — visit /api/ping to confirm the Netlify function is running
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong', env: process.env.NODE_ENV || 'unknown' });
});

// The browser may use Supabase Realtime with the public anon key. Never send
// the server service-role key to the client.
app.get('/api/realtime-config', (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const candidate = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';
  let isAnonKey = false;
  try {
    const parts = candidate.split('.');
    if (parts.length >= 2) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      isAnonKey = payload.role === 'anon';
    }
  } catch (e) {
    isAnonKey = false;
  }

  if (!supabaseUrl || !isAnonKey) {
    return res.json({ success: false, realtime: false });
  }
  res.json({ success: true, realtime: true, url: supabaseUrl, anonKey: candidate });
});


// Login Endpoint
app.post('/api/auth/login', loginRateLimit, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }
    const user = await db.loginUser(username, password);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }
    const token = createSession(user);
    setSessionCookie(res, req, user);
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const user = readSession(req);
  if (!user) return res.status(401).json({ success: false, error: 'Not authenticated.' });
  res.json({ success: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  clearSessionCookie(res, req);
  res.json({ success: true });
});

// List Stockmen / Users
app.get('/api/users', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create New Stockman Account
app.post('/api/users', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;
    if (!username || !password || !full_name) {
      return res.status(400).json({ success: false, error: 'Username, password, and full name are required.' });
    }
    const allowedRoles = ['stockman', 'checker', 'carton_handler', 'admin'];
    if (!allowedRoles.includes(role || 'stockman')) {
      return res.status(400).json({ success: false, error: 'Invalid role.' });
    }
    const user = await db.createUser({ username, password, full_name, role });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/users/:id/role', requireAuth, requireRole('superadmin'), async (req, res) => {
  try {
    const role = String(req.body?.role || '').trim();
    const allowedRoles = ['stockman', 'checker', 'carton_handler', 'admin'];
    if (!allowedRoles.includes(role)) return res.status(400).json({ success: false, error: 'Invalid role.' });
    const user = await db.updateUserRole(req.params.id, role);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Explicit seed endpoint
app.post('/api/seed-supabase', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'seed-data.json'), 'utf8');
    const items = JSON.parse(raw);
    const result = await db.bulkCreateProducts(items);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// batch create products endpoint
app.post('/api/products/batch', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const products = req.body.products;
    if (!Array.isArray(products) || products.length === 0 || products.length > 10000) {
      return res.status(400).json({ success: false, error: 'No products array provided.' });
    }

    const result = await db.bulkCreateProducts(products);
    if (result && result.error) {
      return res.status(400).json({ success: false, error: result.error, message: result.message });
    }
    const count = typeof result === 'object' ? (result.count || 0) : result;
    if (count > 0) {
      await notifySuperadmin(
        'PRODUCT_ADDED',
        count === 1 ? 'New product added to system' : 'New products added to system',
        `${Number(count).toLocaleString()} product${count === 1 ? ' was' : 's were'} added through batch import.`,
        null,
        req.user.full_name || req.user.username,
        { qty: count }
      );
    }
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Maps the client barcode printed on products to the internal Nelsoft
// barcode (the barcode_2 column), read from the newest Nelsoft_Products_*.csv
// present in the project root. Empty map when no such file exists — imports
// still work, barcode_2 just stays unset for unmatched items.
function loadBarcode2Map() {
  const map = new Map();
  try {
    const candidates = fs.readdirSync(__dirname)
      .filter(f => /^Nelsoft_Products_.*\.csv$/i.test(f))
      .sort()
      .reverse(); // newest date in filename first
    if (candidates.length === 0) return map;
    const csvText = fs.readFileSync(path.join(__dirname, candidates[0]), 'utf8');
    const lines = csvText.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      const internal = (parts[0] || '').trim().replace(/^"/, '').replace(/"$/, '');
      const client = (parts[1] || '').trim().replace(/^"/, '').replace(/"$/, '');
      // Skip the header row ("Barcode,Client Barcode")
      if (!internal || !client || !/^\d+$/.test(internal)) continue;
      if (!map.has(client)) map.set(client, internal);
    }
  } catch (e) {
    console.warn('Could not load Nelsoft barcode_2 mapping CSV:', e.message);
  }
  return map;
}

// Excel upload endpoint
app.post('/api/upload-excel', requireAuth, requireRole('admin', 'superadmin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'No Excel file buffer received.' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    const barcode2Map = loadBarcode2Map();

    const cleanHtml = (str) => {
      if (!str) return '';
      return String(str).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    };

    // Two supported layouts:
    //  A) Master SKU list — has a header row ("C. Barcode","Stock No.","Product",
    //     "Department","Category"). Upserted by barcode so re-imports never
    //     duplicate SKUs; barcode_2 is resolved from the Nelsoft CSV (or an
    //     optional extra "Barcode" column in the file itself).
    //  B) Location export — positional columns, no header (barcode in col 0).
    //     Inserted as location-mapping rows; one product may live in many
    //     locations, so appending here is intended.
    const headerCells = (rows[0] || []).map(c => String(c).trim().toLowerCase());
    const isMasterList = headerCells.includes('c. barcode') || headerCells.includes('product');

    if (isMasterList) {
      const colOf = (...names) => {
        for (const n of names) {
          const idx = headerCells.indexOf(n);
          if (idx >= 0) return idx;
        }
        return -1;
      };
      const idxBarcode = colOf('c. barcode', 'client barcode') >= 0 ? colOf('c. barcode', 'client barcode') : 0;
      const idxStock = colOf('stock no.', 'stock_no', 'stock');
      const idxName = colOf('product', 'product_name', 'name');
      const idxDept = colOf('department');
      const idxCat = colOf('category');
      const idxSystemUpdatedAt = colOf('system on hand updated at', 'system stock updated at', 'on hand updated at', 'external updated at');
      // An explicit extra barcode column (the internal Nelsoft barcode) feeds barcode_2.
      const idxBarcode2 = colOf('barcode_2', 'barcode2', 'barcode');

      const masterItems = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const barcode = String(idxBarcode >= 0 && r[idxBarcode] !== undefined ? r[idxBarcode] : '').trim();
        const stock = String(idxStock >= 0 && r[idxStock] !== undefined ? r[idxStock] : '').trim();
        const name = cleanHtml(String(idxName >= 0 && r[idxName] !== undefined ? r[idxName] : '').trim());
        if (!name || name === 'Unnamed Item') continue;

        const fromFile = idxBarcode2 >= 0 ? String(r[idxBarcode2] || '').trim() : '';
        const sourceTimestamp = idxSystemUpdatedAt >= 0 ? String(r[idxSystemUpdatedAt] || '').trim() : '';
        masterItems.push({
          barcode,
          stock_no: stock,
          product_name: name,
          category: cleanHtml(String(idxCat >= 0 && r[idxCat] !== undefined ? r[idxCat] : '').trim()),
          department: cleanHtml(String(idxDept >= 0 && r[idxDept] !== undefined ? r[idxDept] : '').trim()),
          barcode_2: fromFile || barcode2Map.get(barcode) || '',
          system_on_hand_updated_at: sourceTimestamp || null
        });
      }

      const result = await db.upsertMasterProducts(masterItems);
      if (result && result.error) {
        return res.status(400).json({ success: false, error: result.error, message: result.message });
      }
      if (result.inserted > 0) {
        await notifySuperadmin(
          'PRODUCT_ADDED',
          result.inserted === 1 ? 'New product added to system' : 'New products added to system',
          `${Number(result.inserted).toLocaleString()} new product${result.inserted === 1 ? ' was' : 's were'} added through master-list import.`,
          null,
          req.user.full_name || req.user.username,
          { qty: result.inserted }
        );
      }
      return res.json({
        success: true,
        count: result.count || 0,
        inserted: result.inserted || 0,
        updated: result.updated || 0,
        message: `Master list imported: ${result.count || 0} SKUs (${result.inserted || 0} new, ${result.updated || 0} updated).`
      });
    }

    const extractNum = (str) => {
      if (typeof str === 'number') return String(str);
      if (!str) return '';
      const m = String(str).match(/(\d+)/);
      if (!m) return '';
      return m[1].length === 1 ? '0' + m[1] : m[1];
    };

    const itemsToInsert = [];
    for (const r of rows) {
      const barcode = r[0] ? String(r[0]).trim() : '';
      const stock = r[1] ? String(r[1]).trim() : '';
      const name = cleanHtml(r[2] ? String(r[2]).trim() : '');
      if (!name || name === 'Unnamed Item') continue;

      const category = cleanHtml(r[3] ? String(r[3]).trim() : '');
      const department = cleanHtml(r[4] ? String(r[4]).trim() : '');
      const locFull = r[5] ? cleanHtml(String(r[5]).trim()) : '';
      const floor = r[6] ? extractNum(r[6]).replace(/^0+/, '') : '';
      const row = r[7] ? extractNum(r[7]) : '';
      const shelf = r[8] ? extractNum(r[8]) : '';
      const level = r[9] ? extractNum(r[9]) : '';
      const qty = typeof r[10] === 'number' ? r[10] : (parseInt(r[10], 10) || 0);
      const status = r[16] ? String(r[16]).trim() : '';

      const loc = (floor || row || shelf) ? `${floor}-${row}-${shelf}-${level || '0'}` : '';

      itemsToInsert.push({
        barcode,
        barcode_2: barcode2Map.get(barcode) || '',
        stock_no: stock,
        product_name: name,
        category,
        department,
        floor,
        row,
        shelf,
        level: level || '0',
        loc,
        storage_location: locFull || loc,
        qty,
        status
      });
    }

    const result = await db.bulkCreateProducts(itemsToInsert);
    if (result && result.error) {
      return res.status(400).json({ success: false, error: result.error, message: result.message });
    }
    const count = typeof result === 'object' ? (result.count || 0) : result;
    res.json({ success: true, count, message: `Successfully imported ${count} products!` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    res.json({ success: true, ...stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Search or list products
app.get('/api/products', async (req, res) => {
  try {
    const query = req.query.q || '';
    const requestedLimit = parseInt(req.query.limit || '20', 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(100, Math.max(1, requestedLimit)) : 20;
    if (!query) {
      const stats = await db.getStats();
      return res.json({ success: true, count: stats.total, products: [] });
    }
    const products = await db.searchProducts(query, limit);
    // A location just saved must be searchable immediately. The browser uses
    // its in-memory index for normal typing, while this database fallback must
    // never return an older CDN-cached search result.
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all products (for offline sync) — compact payload for 50K+ SKUs
app.get('/api/products/all', async (req, res) => {
  try {
    const isSearchIndex = req.query.searchIndex === '1';
    const products = isSearchIndex ? await db.getSearchIndex() : await db.getAllProducts();
    // Send compact payload: use short field names to reduce JSON size for 50K+ products
    const compact = products.map(p => {
      const item = {
        id: p.id,
        b: p.barcode || '',
        b2: p.barcode_2 || '',
        s: p.stock_no || '',
        n: p.product_name || '',
        c: p.category || '',
        sc: p.department || ''
      };
      if (p.floor !== undefined && p.floor !== null && p.floor !== '') item.floor = p.floor;
      if (p.row !== undefined && p.row !== null && p.row !== '') item.row = p.row;
      if (p.shelf !== undefined && p.shelf !== null && p.shelf !== '') item.shelf = p.shelf;
      if (p.level !== undefined && p.level !== null && p.level !== '') item.level = p.level;
      if (p.loc) item.loc = p.loc;
      if (p.location_storage || p.storage_location) item.locFull = p.location_storage || p.storage_location;
      if (p.qty) item.qty = p.qty;
      if (p.system_on_hand_updated_at) item.systemOnHandUpdatedAt = p.system_on_hand_updated_at;
      if (p.status) item.status = p.status;
      if (p.custom) item.custom = true;
      if (p.last_modified_by) item.last_modified_by = p.last_modified_by;
      if (p.locations && p.locations.length > 0) item.locations = p.locations;
      if (p.isMapped) item.isMapped = true;
      return item;
    });
    if (isSearchIndex) {
      res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    }
    res.json({ success: true, count: compact.length, products: compact });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get product by exact barcode or stock code
app.get('/api/products/lookup/:code', async (req, res) => {
  try {
    const product = await db.getProductByBarcodeOrStock(req.params.code);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all products at a specific shelf location (for Checker Audit Mode)
app.get('/api/products/by-location', async (req, res) => {
  try {
    const loc = req.query.loc || '';
    const floor = req.query.floor || '';
    const row = req.query.row || req.query.batch || '';
    const shelf = req.query.shelf || '';
    const level = req.query.level || '';

    const products = await db.getProductsByLocation({ loc, floor, row, shelf, level });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// Inventory ledger API. Product-location endpoints remain available for
// compatibility, while all new quantity workflows use these endpoints.
// ---------------------------------------------------------------------------
const inventoryStaff = requireRole('stockman', 'carton_handler', 'admin', 'superadmin');
const inventorySupervisor = requireRole('admin', 'superadmin');

async function notifySuperadmin(action, title, detail, product, actor, extra = {}) {
  try {
    const item = product || {};
    const location = extra.location || item.loc || (item.floor ? `${item.floor}-${item.batch || item.row || ''}-${item.shelf || ''}-${item.level || '0'}` : '');
    await db.createAdminNotification({
      action, title, detail,
      product_name: item.product_name || item.name || extra.product_name || '',
      sku_key: item.barcode || item.stock_no || extra.sku_key || '',
      location, qty: extra.qty || 0,
      actor_name: actor || item.last_modified_by || 'Warehouse staff'
    });
  } catch (err) { console.warn('Notification record failed:', err.message); }
}

async function applyCatalogOnHandDelta(sku, delta, actor) {
  if (!delta) return null;
  const product = await db.getProductByBarcodeOrStock(sku);
  if (!product) throw new Error('Product not found.');
  const currentQty = Number.parseInt(product.qty, 10) || 0;
  const nextQty = currentQty + Number(delta);
  if (nextQty < 0) throw new Error('This change would make the on-hand quantity negative.');
  return db.updateProduct(product.id, {
    qty: nextQty,
    last_modified_by: actor || 'Stockman'
  });
}

app.get('/api/inventory/:sku/summary', requireAuth, async (req, res) => {
  try {
    const [ledgerSummary, product] = await Promise.all([
      inventory.summary(req.params.sku),
      db.getProductByBarcodeOrStock(req.params.sku)
    ]);
    const catalogQty = product ? Number.parseInt(product.qty, 10) : NaN;
    // The catalog quantity is the current on-hand source until the external
    // stock integration is connected. Location buckets are counted separately
    // and start at zero until staff records a receipt or putaway.
    const onHand = Number.isInteger(catalogQty) && catalogQty >= 0 ? catalogQty : Number(ledgerSummary.onHand || 0);
    const summary = {
      ...ledgerSummary,
      onHand,
      available: Math.max(0, onHand - Number(ledgerSummary.reserved || 0)),
      systemOnHandUpdatedAt: product?.system_on_hand_updated_at || null
    };
    // Inventory cards are edited in-place. A cached response here can show a
    // value from before a successful save, so always return a fresh balance.
    res.set('Cache-Control', 'no-store, max-age=0');
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/inventory/:sku/history', requireAuth, async (req, res) => {
  try {
    const history = await inventory.history(req.params.sku, Number.parseInt(req.query.limit || '100', 10));
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/:sku/quick-adjustment', requireAuth, inventoryStaff, async (req, res) => {
  try {
    const storageType = String(req.body?.storage_type || req.body?.storageType || '').trim().toUpperCase();
    if (storageType === 'ON_HAND') {
      const targetQty = Number.parseInt(req.body?.target_qty ?? req.body?.targetQty, 10);
      const reason = String(req.body?.reason || '').trim();
      if (!Number.isInteger(targetQty) || targetQty < 0) {
        return res.status(400).json({ success: false, error: 'On-hand quantity must be a non-negative whole number.' });
      }
      if (!reason) return res.status(400).json({ success: false, error: 'A reason is required for an on-hand correction.' });
      const product = await db.getProductByBarcodeOrStock(req.params.sku);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
      const previousQty = Number.parseInt(product.qty, 10) || 0;
      const updatedProduct = await db.updateProduct(product.id, {
        qty: targetQty,
        last_modified_by: req.user.full_name || req.user.username
      });
      await notifySuperadmin('QUANTITY_MODIFIED', 'On-hand quantity changed', `On-hand changed from ${previousQty.toLocaleString()} to ${targetQty.toLocaleString()}. Reason: ${reason}`, updatedProduct, req.user.full_name || req.user.username, { qty: targetQty });
      return res.json({
        success: true,
        adjustment: { skuKey: req.params.sku, storageType, targetQty, source: 'CATALOG_ON_HAND' },
        product: updatedProduct
      });
    }
    const result = await inventory.quickAdjust({ ...(req.body || {}), sku_key: req.params.sku }, req.user.full_name || req.user.username);
    // Until an external stock system is connected, the catalog quantity is
    // the current on-hand total. A physical bucket change therefore changes
    // that total by the same amount.
    const product = await applyCatalogOnHandDelta(req.params.sku, Number(result?.delta || 0), req.user.full_name || req.user.username);
    await notifySuperadmin('QUANTITY_MODIFIED', 'Quantity changed', `${storageType} changed from ${Number(result?.previousQty || 0).toLocaleString()} to ${Number(result?.targetQty || 0).toLocaleString()}. Reason: ${String(req.body?.reason || '').trim()}`, product, req.user.full_name || req.user.username, { qty: Number(result?.targetQty || 0) });
    res.json({ success: true, adjustment: result, product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Stock that leaves straight from the receiving area never reaches a shelf.
// This creates a DISPATCH movement and deducts only from RECEIVING lots.
app.post('/api/inventory/:sku/direct-delivery', requireAuth, inventoryStaff, async (req, res) => {
  try {
    const result = await inventory.directDispatch({ ...(req.body || {}), sku_key: req.params.sku }, req.user.full_name || req.user.username);
    const product = await applyCatalogOnHandDelta(req.params.sku, -Number(result?.dispatched || 0), req.user.full_name || req.user.username);
    await notifySuperadmin('DIRECT_DELIVERY', 'Quantity delivered directly', `${Number(result?.dispatched || 0).toLocaleString()} unit(s) delivered from Receiving. Reference: ${result?.deliveryReference || req.body?.delivery_reference || ''}`, product, req.user.full_name || req.user.username, { qty: Number(result?.dispatched || 0), location: 'RECEIVING' });
    res.json({ success: true, delivery: result, product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/inventory/warehouse-summary', requireAuth, async (req, res) => {
  try {
    const summary = await inventory.warehouseSummary();
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/receipts', requireAuth, inventoryStaff, async (req, res) => {
  try {
    const result = await inventory.receive(req.body || {}, req.user.full_name || req.user.username);
    const reference = String(req.body?.source_reference || req.body?.reference || req.body?.lot_code || '').trim();
    await notifySuperadmin('RECEIVING', 'Stock received', `${Number(req.body?.qty || 0).toLocaleString()} unit(s) added to Receiving.${reference ? ` Reference: ${reference}` : ''}`, req.body, req.user.full_name || req.user.username, { qty: Number(req.body?.qty || 0), location: req.body?.location_code || 'RECEIVING' });
    res.status(201).json({ success: true, receipt: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/movements', requireAuth, inventoryStaff, async (req, res) => {
  try {
    const result = await inventory.move(req.body || {}, req.user.full_name || req.user.username);
    await notifySuperadmin('LOCATION_TRANSFER', 'Stock transferred', `${Number(req.body?.qty || 0).toLocaleString()} unit(s) moved to ${req.body?.to_location || 'a new location'}.`, req.body, req.user.full_name || req.user.username, { qty: Number(req.body?.qty || 0), location: req.body?.to_location });
    res.json({ success: true, movement: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/putaway', requireAuth, inventoryStaff, async (req, res) => {
  try {
    const result = await inventory.putaway(req.body || {}, req.user.full_name || req.user.username);
    const isBigItem = String(req.body?.package_type || '').toUpperCase() === 'CARTON';
    await notifySuperadmin(isBigItem ? 'BIG_ITEMS_ADDED' : 'LOCATION_TRANSFER', isBigItem ? 'Big items added' : 'Stock put away', `${Number(req.body?.qty || 0).toLocaleString()} unit(s) placed at ${req.body?.to_location || 'a location'}.`, req.body, req.user.full_name || req.user.username, { qty: Number(req.body?.qty || 0), location: req.body?.to_location });
    res.json({ success: true, movement: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/adjustments', requireAuth, inventoryStaff, async (req, res) => {
  try {
    const result = await inventory.requestAdjustment(req.body || {}, req.user.full_name || req.user.username);
    res.status(201).json({ success: true, adjustment: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/adjustments/:id/approve', requireAuth, inventorySupervisor, async (req, res) => {
  try {
    const result = await inventory.approveAdjustment(req.params.id, req.user.full_name || req.user.username);
    res.json({ success: true, adjustment: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/adjustments/:id/reject', requireAuth, requireRole('superadmin'), async (req, res) => {
  try {
    const result = await inventory.rejectAdjustment(req.params.id, req.user.full_name || req.user.username);
    res.json({ success: true, adjustment: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/inventory/operations', requireAuth, requireRole('superadmin'), async (req, res) => {
  try {
    const [operations, users, stats, stockHealth, reconciliation] = await Promise.all([
      inventory.adminOperations(req.query.limit), db.getUsers(), db.getStats(), db.getSystemStockHealth(), inventory.reconciliationExceptions(50)
    ]);
    res.set('Cache-Control', 'no-store, max-age=0');
    res.json({ success: true, operations, users, stats, stockHealth, reconciliation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/notifications', requireAuth, requireRole('superadmin'), async (req, res) => {
  try {
    const notifications = await db.getAdminNotifications(req.query.limit);
    res.set('Cache-Control', 'no-store, max-age=0');
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/system-stock-updates', requireAuth, requireRole('superadmin'), async (req, res) => {
  try {
    const result = await db.getSystemStockUpdates({
      search: req.query.search || '',
      page: req.query.page || 1,
      limit: req.query.limit || 100
    });
    res.set('Cache-Control', 'no-store, max-age=0');
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/migrate-legacy', requireAuth, inventorySupervisor, async (req, res) => {
  try {
    const result = await inventory.migrateLegacy(req.user.full_name || req.user.username);
    res.json({ success: true, migration: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Stock Transfer between shelf locations
app.post('/api/products/transfer', async (req, res) => {
  try {
    const { sourceId, destLocation, transferQty, modifiedBy } = req.body;
    if (!sourceId || !destLocation || !transferQty) {
      return res.status(400).json({ success: false, error: 'sourceId, destLocation, and transferQty are required.' });
    }

    const result = await db.transferProductStock({ sourceId, destLocation, transferQty, modifiedBy });
    if (result && result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }
    await notifySuperadmin('LOCATION_TRANSFER', 'Location transferred', `${Number(transferQty).toLocaleString()} unit(s) transferred to ${destLocation}.`, result?.product || {}, modifiedBy || 'Warehouse staff', { qty: Number(transferQty), location: destLocation });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add new product
app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const name = req.body.name || req.body.product_name;
    const floor = req.body.floor;
    const batch = req.body.batch || req.body.row;
    const shelf = req.body.shelf;

    if (!name || !batch || !shelf) {
      return res.status(400).json({
        success: false,
        error: 'Product name, batch, and shelf are required fields.'
      });
    }

    if (req.body.qty !== undefined && (!Number.isInteger(Number(req.body.qty)) || Number(req.body.qty) < 0 || Number(req.body.qty) > 1000000000)) {
      return res.status(400).json({ success: false, error: 'Quantity must be a non-negative whole number.' });
    }

    const stock_code = req.body.stock_code || req.body.stock_no || req.body.barcode || '';
    const subcategory = req.body.subcategory || req.body.department || '';
    let existingProduct = null;
    if (stock_code) {
      try {
        existingProduct = await db.getProductByBarcodeOrStock(stock_code);
      } catch (lookupError) {
        console.warn('Could not check existing product before creation:', lookupError.message);
      }
    }

    const pad2 = (v) => {
      const s = (v || '').toString().trim();
      return s.length === 1 ? '0' + s : s;
    };

    const rw = pad2(batch);
    const sh = pad2(shelf);
    const lev = pad2(req.body.level) || '0';
    const fl = floor || '1';

    const loc = `${fl}-${rw}-${sh}-${lev}`;
    const floorLabel = fl === '1' ? 'First Floor' : (fl === '2' ? 'Second Floor' : 'Third Floor');
    const loc_full = req.body.loc_full || req.body.location_storage || req.body.storage_location || `${loc} ${floorLabel} - Batch ${rw} - Shelves ${sh} - Level ${lev}`;

    const newProduct = await db.createProduct({
      ...req.body,
      name,
      stock_code,
      subcategory,
      floor: fl,
      batch: rw,
      shelf: sh,
      level: lev,
      loc,
      loc_full
    });
    if (existingProduct) {
      await notifySuperadmin('LOCATION_ADDED', 'Product location added', `Location ${loc} was added.`, newProduct, req.user.full_name || req.user.username, { location: loc, qty: Number(newProduct.qty || 0) });
    } else {
      await notifySuperadmin('PRODUCT_ADDED', 'New product added to system', `"${newProduct.product_name || newProduct.name || name}" was added at location ${loc}.`, newProduct, req.user.full_name || req.user.username, { location: loc, qty: Number(newProduct.qty || 0) });
    }

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    if (req.body.qty !== undefined && (!Number.isInteger(Number(req.body.qty)) || Number(req.body.qty) < 0 || Number(req.body.qty) > 1000000000)) {
      return res.status(400).json({ success: false, error: 'Quantity must be a non-negative whole number.' });
    }
    const previous = await db.getProductById(req.params.id);
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const oldLocation = previous ? (previous.loc || `${previous.floor || ''}-${previous.batch || previous.row || ''}-${previous.shelf || ''}-${previous.level || '0'}`) : '';
    const newLocation = updated.loc || `${updated.floor || ''}-${updated.batch || updated.row || ''}-${updated.shelf || ''}-${updated.level || '0'}`;
    const locationChanged = oldLocation !== newLocation;
    const quantityChanged = previous && Number(previous.qty || 0) !== Number(updated.qty || 0);
    await notifySuperadmin(locationChanged ? 'LOCATION_MODIFIED' : (quantityChanged ? 'QUANTITY_MODIFIED' : 'PRODUCT_MODIFIED'), locationChanged ? 'Product location changed' : (quantityChanged ? 'Product quantity modified' : 'Product details modified'), locationChanged ? `Location changed to ${newLocation}.` : (quantityChanged ? `Quantity changed from ${Number(previous.qty || 0).toLocaleString()} to ${Number(updated.qty || 0).toLocaleString()}.` : 'Product details were updated.'), updated, req.body.last_modified_by || 'Warehouse staff', { location: newLocation, qty: Number(updated.qty || 0) });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset location (Remove floor, row, shelf, level -> mark as UNMAPPED)
app.post('/api/products/:id/reset-location', async (req, res) => {
  try {
    const previous = await db.getProductById(req.params.id);
    const resetProduct = await db.resetProductLocation(req.params.id);
    if (!resetProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await notifySuperadmin('LOCATION_DELETED', 'Product location removed', 'The product location was removed and marked as unmapped.', previous || resetProduct, req.user?.full_name || req.user?.username || 'Warehouse staff');
    res.json({ success: true, product: resetProduct, message: 'Location reset successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset ALL products locations (Mark all as UNMAPPED)
app.post('/api/products/reset-all', async (req, res) => {
  try {
    const result = await db.resetAllProducts();
    res.json({ success: true, count: result.count, message: `Successfully reset ${result.count} products to UNMAPPED.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete product / location row
app.delete('/api/products/:id', async (req, res) => {
  try {
    const previous = await db.getProductById(req.params.id);
    const deleted = await db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await notifySuperadmin('LOCATION_DELETED', 'Product location deleted', 'A product location entry was deleted.', previous || {}, req.user?.full_name || req.user?.username || 'Warehouse staff');
    res.json({ success: true, message: 'Product location deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SUPER ADMIN & ANALYTICS ENDPOINTS ---

// Admin Stats
app.get('/api/admin/stats', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const stats = await db.getStats();
    const warehouse = await inventory.warehouseSummary();
    res.json({
      success: true,
      stats: {
        totalProducts: stats.total || 0,
        mappedCount: stats.mappedCount || 0,
        unmappedCount: stats.unmappedCount || 0,
        totalQty: warehouse.onHand || 0,
        warehouse
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Paginated Products API (Fast browsing through 50k+ items)
app.get('/api/admin/products', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { page, limit, search, status, floor } = req.query;
    const result = await db.getPaginatedProducts({ page, limit, search, status, floor });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Filtered Product Export API
app.get('/api/admin/export-data', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { status, category, floor, search } = req.query;
    let products = await db.getAllProducts();

    if (status && status !== 'ALL') {
      if (status === 'MAPPED') {
        products = products.filter(p => (p.status || '').toUpperCase() === 'MAPPED' || (p.floor || p.row || p.shelf));
      } else if (status === 'UNMAPPED') {
        products = products.filter(p => (p.status || '').toUpperCase() !== 'MAPPED' && !p.floor && !p.row && !p.shelf);
      }
    }

    if (category && category !== 'ALL') {
      products = products.filter(p => (p.category || '').toLowerCase() === category.toLowerCase() || (p.department || '').toLowerCase() === category.toLowerCase());
    }

    if (floor && floor !== 'ALL') {
      products = products.filter(p => String(p.floor) === String(floor));
    }

const SEARCH_SYNONYMS = {
  'black': ['black', 'blk'],
  'blk': ['black', 'blk'],
  'white': ['white', 'wht', 'wt'],
  'wht': ['white', 'wht', 'wt'],
  'wt': ['white', 'wht', 'wt'],
  'blue': ['blue', 'blu', 'bl'],
  'blu': ['blue', 'blu', 'bl'],
  'red': ['red', 'rd'],
  'rd': ['red', 'rd'],
  'green': ['green', 'grn'],
  'grn': ['green', 'grn'],
  'yellow': ['yellow', 'ylw', 'yl'],
  'ylw': ['yellow', 'ylw', 'yl'],
  'orange': ['orange', 'orn', 'org'],
  'orn': ['orange', 'orn', 'org'],
  'brown': ['brown', 'brn'],
  'brn': ['brown', 'brn'],
  'gray': ['gray', 'grey', 'gry'],
  'grey': ['gray', 'grey', 'gry'],
  'gry': ['gray', 'grey', 'gry'],
  'silver': ['silver', 'slv', 'silv'],
  'gold': ['gold', 'gld'],
  'clear': ['clear', 'clr'],
  'clr': ['clear', 'clr'],
  'transparent': ['transparent', 'trans', 'clr'],

  'small': ['small', 'sml', 'sm'],
  'sml': ['small', 'sml', 'sm'],
  'sm': ['small', 'sml', 'sm'],
  'medium': ['medium', 'med', 'md'],
  'med': ['medium', 'med', 'md'],
  'md': ['medium', 'med', 'md'],
  'large': ['large', 'lrg', 'lg'],
  'lrg': ['large', 'lrg', 'lg'],
  'lg': ['large', 'lrg', 'lg'],
  'xlarge': ['xlarge', 'xl'],
  'xl': ['xlarge', 'xl'],

  'piece': ['piece', 'pieces', 'pc', 'pcs'],
  'pieces': ['piece', 'pieces', 'pc', 'pcs'],
  'pc': ['piece', 'pieces', 'pc', 'pcs'],
  'pcs': ['piece', 'pieces', 'pc', 'pcs'],
  'pack': ['pack', 'package', 'pk', 'pkg'],
  'package': ['pack', 'package', 'pk', 'pkg'],
  'pk': ['pack', 'package', 'pk', 'pkg'],
  'pkg': ['pack', 'package', 'pk', 'pkg'],
  'box': ['box', 'bx'],
  'bx': ['box', 'bx'],
  'set': ['set', 'st'],
  'st': ['set', 'st'],
  'carton': ['carton', 'ctn'],
  'ctn': ['carton', 'ctn'],
  'bottle': ['bottle', 'btl'],
  'btl': ['bottle', 'btl'],
  'roll': ['roll', 'rl'],
  'rl': ['roll', 'rl'],
  'pair': ['pair', 'pr'],
  'pr': ['pair', 'pr'],
  'dozen': ['dozen', 'dz'],
  'dz': ['dozen', 'dz'],

  'plastic': ['plastic', 'plstc', 'plast', 'pl'],
  'plstc': ['plastic', 'plstc', 'plast', 'pl'],
  'stainless': ['stainless', 'stain', 'ss'],
  'ss': ['stainless', 'stain', 'ss'],
  'heavy': ['heavy', 'hvy'],
  'hvy': ['heavy', 'hvy'],
  'duty': ['duty', 'dty'],
  'tarpaulin': ['tarpaulin', 'trapal', 'tarps'],
  'trapal': ['tarpaulin', 'trapal', 'tarps'],
  'basket': ['basket', 'bskt'],
  'bskt': ['basket', 'bskt']
};

    if (search && search.trim()) {
      const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
      products = products.filter(p => {
        const fullText = `${p.product_name || p.name || ''} ${p.barcode || ''} ${p.stock_no || p.stock_code || ''} ${p.category || ''} ${p.department || p.subcategory || ''}`.toLowerCase();
        return tokens.every(t => {
          const syns = SEARCH_SYNONYMS[t] || [t];
          return syns.some(syn => fullText.includes(syn));
        });
      });
    }

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- DAILY DELIVERY ORDERS & PICK ROUTE API ---
let memoryOrders = [
  {
    id: 101,
    order_no: 'ORD-2026-001',
    customer_name: 'Main Branch Store',
    status: 'PENDING',
    created_at: new Date().toISOString(),
    items: [
      { stock_no: 'H007', requested_qty: 10, picked_qty: 0, status: 'PENDING' },
      { stock_no: 'SL027', requested_qty: 5, picked_qty: 0, status: 'PENDING' }
    ]
  }
];

app.get('/api/orders', requireAuth, requireRole('admin', 'superadmin'), (req, res) => {
  res.json({ success: true, orders: memoryOrders });
});

app.post('/api/orders', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  const { order_no, customer_name, items } = req.body;
  const newOrder = {
    id: Date.now(),
    order_no: order_no || `ORD-${Date.now().toString().slice(-4)}`,
    customer_name: customer_name || 'Warehouse Customer',
    status: 'PENDING',
    created_at: new Date().toISOString(),
    items: items || []
  };
  if (newOrder.items.length > 0) {
    try {
      const reservation = await inventory.reserveOrder(newOrder.id, newOrder.items, req.user.full_name || req.user.username);
      newOrder.status = 'RESERVED';
      newOrder.reservation = reservation;
    } catch (err) {
      return res.status(409).json({ success: false, error: err.message });
    }
  }
  memoryOrders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

app.post('/api/orders/:id/reserve', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const order = memoryOrders.find(item => String(item.id) === String(req.params.id));
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    const result = await inventory.reserveOrder(order.id, order.items, req.user.full_name || req.user.username);
    order.status = 'RESERVED'; order.reservation = result;
    res.json({ success: true, order, reservation: result });
  } catch (err) {
    res.status(409).json({ success: false, error: err.message });
  }
});

async function applyOrderInventoryAction(req, res, action, nextStatus) {
  try {
    const order = memoryOrders.find(item => String(item.id) === String(req.params.id));
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    const result = await inventory.orderAction(action, order.id, req.user.full_name || req.user.username);
    order.status = nextStatus;
    order.items = order.items.map(item => ({ ...item, status: nextStatus, picked_qty: action === 'pick' || action === 'dispatch' ? (item.requested_qty || item.qty || 0) : (item.picked_qty || 0) }));
    res.json({ success: true, order, inventory: result });
  } catch (err) {
    res.status(409).json({ success: false, error: err.message });
  }
}

app.post('/api/orders/:id/pick', requireAuth, requireRole('admin', 'superadmin'), (req, res) => applyOrderInventoryAction(req, res, 'pick', 'PICKED'));
app.post('/api/orders/:id/dispatch', requireAuth, requireRole('admin', 'superadmin'), (req, res) => applyOrderInventoryAction(req, res, 'dispatch', 'DISPATCHED'));
app.post('/api/orders/:id/cancel', requireAuth, requireRole('admin', 'superadmin'), (req, res) => applyOrderInventoryAction(req, res, 'release', 'CANCELLED'));

// S-Shape Route Optimizer Engine Endpoint
app.get('/api/orders/:id/route', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const order = memoryOrders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const allProducts = await db.getAllProducts();
    const routeSteps = [];

    order.items.forEach((item, index) => {
      const match = allProducts.find(p => 
        (item.stock_no && p.stock_no && p.stock_no.toLowerCase() === item.stock_no.toLowerCase()) ||
        (item.barcode && p.barcode && p.barcode.toLowerCase() === item.barcode.toLowerCase())
      );

      const floor = match && match.floor ? String(match.floor) : '1';
      const row = match && match.row ? String(match.row) : '99';
      const shelf = match && match.shelf ? String(match.shelf) : '99';
      const level = match && match.level ? String(match.level) : '0';
      const locFull = match && match.locFull ? match.locFull : (match ? `Floor ${floor} - Row ${row}` : 'UNMAPPED');

      routeSteps.push({
        step_index: index + 1,
        item_id: item.stock_no || item.barcode,
        product_name: match ? match.product_name : (item.product_name || item.stock_no || 'Item'),
        stock_no: item.stock_no || (match ? match.stock_no : ''),
        barcode: item.barcode || (match ? match.barcode : ''),
        requested_qty: item.requested_qty || 1,
        picked_qty: item.picked_qty || 0,
        floor,
        row,
        shelf,
        level,
        locFull,
        status: item.status || 'PENDING'
      });
    });

    // S-Shape Traversal Algorithm: Sort by Floor asc -> Row asc -> Shelf asc -> Level asc
    routeSteps.sort((a, b) => {
      if (a.floor !== b.floor) return a.floor.localeCompare(b.floor, undefined, { numeric: true });
      if (a.row !== b.row) return a.row.localeCompare(b.row, undefined, { numeric: true });
      if (a.shelf !== b.shelf) return a.shelf.localeCompare(b.shelf, undefined, { numeric: true });
      return a.level.localeCompare(b.level, undefined, { numeric: true });
    });

    // Re-index steps cleanly
    routeSteps.forEach((s, idx) => { s.step_number = idx + 1; });

    res.json({ success: true, order_no: order.order_no, routeSteps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error('Request failed:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'Uploaded file is too large. Maximum size is 10 MB.' });
  }
  res.status(400).json({ success: false, error: 'Invalid request.' });
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ success: false, error: 'Endpoint not found', path: req.originalUrl || req.url });
  }
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
  // These are local-only modules — safe to require inside this function
  let selfsigned;
  try { selfsigned = require('selfsigned'); } catch (e) {
    throw new Error('selfsigned not installed — HTTPS skipped (run: npm i selfsigned)');
  }
  const os = require('os');

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
    [{ product_name: 'commonName', value: 'Warehouse Product Locator' }],
    { days: 365, altNames }
  );

  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);

  return { key: pems.private, cert: pems.cert };
}

// Start Protocol-Multiplexed Server (Handles BOTH http:// and https:// on PORT 3002 seamlessly)
async function startServer() {
  // These are local-only modules — not needed in serverless environments
  const https = require('https');
  const net = require('net');
  const os = require('os');

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
