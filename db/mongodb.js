const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const seedPath = path.join(__dirname, '..', 'seed-data.json');
let memoryProducts = [];
let isConnectedToMongo = false;

// Define Product Schema
const productSchema = new mongoose.Schema({
  barcode: { type: String, default: '', index: true },
  stock_code: { type: String, default: '', index: true },
  name: { type: String, required: true, index: true },
  category: { type: String, default: 'Uncategorized' },
  subcategory: { type: String, default: '' },
  floor: { type: String, default: '1' },
  batch: { type: String, default: '' },
  shelf: { type: String, default: '' },
  level: { type: String, default: '00' },
  loc: { type: String, default: '' },
  loc_full: { type: String, default: '' },
  qty: { type: Number, default: 0 },
  status: { type: String, default: 'DONE' },
  custom: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

function loadSeedData() {
  if (fs.existsSync(seedPath)) {
    try {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const items = JSON.parse(raw);
      return items.map((p, idx) => ({
        _id: String(idx + 1),
        id: idx + 1,
        barcode: p.b || '',
        stock_code: p.s || '',
        name: p.n || 'Unnamed item',
        category: p.c || '',
        subcategory: p.sc || '',
        floor: p.floor || '',
        batch: p.batch || '',
        shelf: p.shelf || '',
        level: p.level || '',
        loc: p.loc || '',
        loc_full: p.locFull || '',
        qty: typeof p.qty === 'number' ? p.qty : 0,
        status: p.status || '',
        custom: p.custom ? true : false
      }));
    } catch (e) {
      console.warn('Could not read seed-data.json:', e);
    }
  }
  return [];
}

memoryProducts = loadSeedData();

// Connect to MongoDB
async function connectDb() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚡ MONGODB_URI not set. Running in In-Memory / Netlify Fallback mode.');
    return false;
  }

  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  try {
    console.log('🍃 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000
    });
    isConnectedToMongo = true;
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Auto-seed MongoDB Atlas if empty
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Seeding initial 940 products into MongoDB Atlas...');
      const seedItems = memoryProducts.map(p => ({
        barcode: p.barcode,
        stock_code: p.stock_code,
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        floor: p.floor,
        batch: p.batch,
        shelf: p.shelf,
        level: p.level,
        loc: p.loc,
        loc_full: p.loc_full,
        qty: p.qty,
        status: p.status,
        custom: p.custom
      }));
      await Product.insertMany(seedItems);
      console.log(`🎉 MongoDB Atlas seeded with ${seedItems.length} products!`);
    }
    return true;
  } catch (err) {
    console.warn('MongoDB connection error, using memory fallback:', err.message);
    isConnectedToMongo = false;
    return false;
  }
}

// Ensure connection helper
async function ensureDb() {
  if (process.env.MONGODB_URI && !isConnectedToMongo) {
    await connectDb();
  }
}

module.exports = {
  connectDb,
  Product,
  getAllProducts: async () => {
    await ensureDb();
    if (isConnectedToMongo) {
      const docs = await Product.find().sort({ createdAt: 1 }).lean();
      return docs.map(d => ({ ...d, id: d._id.toString() }));
    }
    return memoryProducts;
  },
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

  searchProducts: async (query, limit = 20) => {
    await ensureDb();
    const q = (query || '').trim();
    if (!q) return [];
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    if (isConnectedToMongo) {
      const andConditions = tokens.map(t => {
        const syns = SEARCH_SYNONYMS[t] || [t];
        const patternStr = syns.map(syn => syn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const regex = new RegExp(patternStr, 'i');
        return {
          $or: [
            { name: regex },
            { barcode: regex },
            { stock_code: regex },
            { category: regex },
            { subcategory: regex }
          ]
        };
      });
      const docs = await Product.find({ $and: andConditions }).limit(limit).lean();
      return docs.map(d => ({ ...d, id: d._id.toString() }));
    }

    return memoryProducts.filter(p => {
      const fullText = `${p.name || ''} ${p.barcode || ''} ${p.stock_code || ''} ${p.category || ''} ${p.subcategory || ''}`.toLowerCase();
      return tokens.every(t => {
        const syns = SEARCH_SYNONYMS[t] || [t];
        return syns.some(syn => fullText.includes(syn));
      });
    }).slice(0, limit);
  },
  getProductByBarcodeOrStock: async (code) => {
    await ensureDb();
    const clean = (code || '').trim();
    if (isConnectedToMongo) {
      const doc = await Product.findOne({
        $or: [
          { barcode: clean },
          { stock_code: clean }
        ]
      }).lean();
      return doc ? { ...doc, id: doc._id.toString() } : null;
    }
    const cleanLower = clean.toLowerCase();
    return memoryProducts.find(p => p.barcode.toLowerCase() === cleanLower || p.stock_code.toLowerCase() === cleanLower);
  },
  getProductById: async (id) => {
    await ensureDb();
    if (isConnectedToMongo) {
      try {
        const doc = await Product.findById(id).lean();
        return doc ? { ...doc, id: doc._id.toString() } : null;
      } catch (e) { return null; }
    }
    return memoryProducts.find(p => String(p.id) === String(id) || String(p._id) === String(id));
  },
  createProduct: async (data) => {
    await ensureDb();
    if (isConnectedToMongo) {
      const doc = await Product.create({
        barcode: data.barcode || '',
        stock_code: data.stock_code || '',
        name: data.name,
        category: data.category || 'Uncategorized',
        subcategory: data.subcategory || '',
        floor: data.floor || '1',
        batch: data.batch || '',
        shelf: data.shelf || '',
        level: data.level || '00',
        loc: data.loc || '',
        loc_full: data.loc_full || '',
        qty: parseInt(data.qty || 0, 10),
        status: data.status || 'DONE',
        custom: true
      });
      const obj = doc.toObject();
      return { ...obj, id: obj._id.toString() };
    }

    const newProduct = {
      _id: String(memoryProducts.length + 1),
      id: memoryProducts.length + 1,
      barcode: data.barcode || '',
      stock_code: data.stock_code || '',
      name: data.name,
      category: data.category || 'Uncategorized',
      subcategory: data.subcategory || '',
      floor: data.floor || '1',
      batch: data.batch || '',
      shelf: data.shelf || '',
      level: data.level || '00',
      loc: data.loc || '',
      loc_full: data.loc_full || '',
      qty: parseInt(data.qty || 0, 10),
      status: data.status || 'DONE',
      custom: true
    };
    memoryProducts.push(newProduct);
    return newProduct;
  },
  updateProduct: async (id, data) => {
    await ensureDb();
    if (isConnectedToMongo) {
      try {
        const doc = await Product.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
        return doc ? { ...doc, id: doc._id.toString() } : null;
      } catch (e) { return null; }
    }

    const item = memoryProducts.find(p => String(p.id) === String(id) || String(p._id) === String(id));
    if (item) {
      Object.assign(item, data);
    }
    return item;
  },
  deleteProduct: async (id) => {
    await ensureDb();
    if (isConnectedToMongo) {
      try {
        const res = await Product.findByIdAndDelete(id);
        return !!res;
      } catch (e) { return false; }
    }
    const len = memoryProducts.length;
    memoryProducts = memoryProducts.filter(p => String(p.id) !== String(id) && String(p._id) !== String(id));
    return memoryProducts.length < len;
  },
  getStats: async () => {
    await ensureDb();
    if (isConnectedToMongo) {
      const total = await Product.countDocuments();
      const customCount = await Product.countDocuments({ custom: true });
      return { total, customCount, isMongo: true };
    }
    return {
      total: memoryProducts.length,
      customCount: memoryProducts.filter(p => p.custom).length,
      isMongo: false
    };
  }
};
