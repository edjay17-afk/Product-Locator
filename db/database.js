const path = require('path');
const fs = require('fs');

let driver = 'memory'; // 'better-sqlite3' | 'libsql' | 'memory'
let sqliteDb = null;
let libsqlClient = null;

const seedPath = path.join(__dirname, '..', 'seed-data.json');
let memoryProducts = [];

function loadSeedData() {
  if (fs.existsSync(seedPath)) {
    try {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const items = JSON.parse(raw);
      return items.map((p, idx) => ({
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
        custom: p.custom ? 1 : 0
      }));
    } catch (e) {
      console.warn('Could not read seed-data.json:', e);
    }
  }
  return [];
}

// 1. Try Turso Cloud SQLite if environment variables are set
const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;

if (tursoUrl) {
  try {
    const { createClient } = require('@libsql/client');
    libsqlClient = createClient({ url: tursoUrl, authToken: tursoToken });
    driver = 'libsql';
    console.log('🔗 Database connected: Turso Cloud SQLite');
    initTurso();
  } catch (err) {
    console.warn('Failed to initialize Turso client, falling back:', err.message);
  }
}

// 2. Try better-sqlite3 locally
if (driver === 'memory') {
  try {
    const Database = require('better-sqlite3');
    const isNetlify = process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const defaultDbPath = path.join(__dirname, 'product_locator.db');
    const dbPath = process.env.DB_PATH || (isNetlify ? '/tmp/product_locator.db' : defaultDbPath);

    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');
    driver = 'better-sqlite3';
    console.log('💾 Database connected: Local SQLite file (' + dbPath + ')');
    initBetterSqlite();
  } catch (err) {
    console.log('⚡ Running in In-Memory / Netlify Serverless fallback mode.');
    driver = 'memory';
    memoryProducts = loadSeedData();
  }
}

function initBetterSqlite() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT,
      stock_code TEXT,
      name TEXT NOT NULL,
      category TEXT,
      subcategory TEXT,
      floor TEXT,
      batch TEXT,
      shelf TEXT,
      level TEXT,
      loc TEXT,
      loc_full TEXT,
      qty INTEGER DEFAULT 0,
      status TEXT,
      custom INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_code COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name COLLATE NOCASE);
  `);

  const count = sqliteDb.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (count === 0) {
    console.log('Seeding initial products into SQLite...');
    const seedItems = loadSeedData();
    const insertStmt = sqliteDb.prepare(`
      INSERT INTO products (
        barcode, stock_code, name, category, subcategory,
        floor, batch, shelf, level, loc, loc_full, qty, status, custom
      ) VALUES (
        @barcode, @stock_code, @name, @category, @subcategory,
        @floor, @batch, @shelf, @level, @loc, @loc_full, @qty, @status, @custom
      )
    `);

    const insertMany = sqliteDb.transaction((products) => {
      for (const p of products) {
        insertStmt.run(p);
      }
    });
    insertMany(seedItems);
    console.log(`Seeded ${seedItems.length} products into local SQLite.`);
  }
}

async function initTurso() {
  try {
    await libsqlClient.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode TEXT,
        stock_code TEXT,
        name TEXT NOT NULL,
        category TEXT,
        subcategory TEXT,
        floor TEXT,
        batch TEXT,
        shelf TEXT,
        level TEXT,
        loc TEXT,
        loc_full TEXT,
        qty INTEGER DEFAULT 0,
        status TEXT,
        custom INTEGER DEFAULT 0
      );
    `);

    const res = await libsqlClient.execute('SELECT COUNT(*) as count FROM products');
    const count = Number(res.rows[0].count);
    if (count === 0) {
      console.log('Seeding Turso Cloud SQLite database...');
      const seedItems = loadSeedData();
      for (const p of seedItems) {
        await libsqlClient.execute({
          sql: `INSERT INTO products (
            barcode, stock_code, name, category, subcategory,
            floor, batch, shelf, level, loc, loc_full, qty, status, custom
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            p.barcode, p.stock_code, p.name, p.category, p.subcategory,
            p.floor, p.batch, p.shelf, p.level, p.loc, p.loc_full, p.qty, p.status, p.custom
          ]
        });
      }
      console.log(`Turso database seeded with ${seedItems.length} products!`);
    }
  } catch (err) {
    console.error('Turso init error:', err);
  }
}

const { SEARCH_SYNONYMS } = require('./search-synonyms');

module.exports = {
  getAllProducts: () => {
    if (driver === 'better-sqlite3') {
      return sqliteDb.prepare('SELECT * FROM products ORDER BY id ASC').all();
    }
    return memoryProducts;
  },
  searchProducts: (query, limit = 20) => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    if (driver === 'better-sqlite3') {
      const clauses = [];
      const params = [];
      tokens.forEach(t => {
        const syns = SEARCH_SYNONYMS[t] || [t];
        const synClauses = syns.map(() => `
          (LOWER(name) LIKE ? OR LOWER(barcode) LIKE ? OR LOWER(stock_code) LIKE ? OR LOWER(category) LIKE ? OR LOWER(subcategory) LIKE ?)
        `).join(' OR ');
        clauses.push(`(${synClauses})`);
        syns.forEach(syn => {
          const pattern = `%${syn}%`;
          params.push(pattern, pattern, pattern, pattern, pattern);
        });
      });
      params.push(limit);
      return sqliteDb.prepare(`
        SELECT * FROM products
        WHERE ${clauses.join(' AND ')}
        LIMIT ?
      `).all(...params);
    }

    return memoryProducts.filter(p => {
      const fullText = `${p.name || ''} ${p.barcode || ''} ${p.stock_code || ''} ${p.category || ''} ${p.subcategory || ''}`.toLowerCase();
      return tokens.every(t => {
        const syns = SEARCH_SYNONYMS[t] || [t];
        return syns.some(syn => fullText.includes(syn));
      });
    }).slice(0, limit);
  },
  getProductByBarcodeOrStock: (code) => {
    const clean = (code || '').trim().toLowerCase();
    if (driver === 'better-sqlite3') {
      return sqliteDb.prepare('SELECT * FROM products WHERE LOWER(barcode) = ? OR LOWER(stock_code) = ? LIMIT 1').get(clean, clean);
    }
    return memoryProducts.find(p => p.barcode.toLowerCase() === clean || p.stock_code.toLowerCase() === clean);
  },
  getProductById: (id) => {
    const numId = parseInt(id, 10);
    if (driver === 'better-sqlite3') {
      return sqliteDb.prepare('SELECT * FROM products WHERE id = ?').get(numId);
    }
    return memoryProducts.find(p => p.id === numId);
  },
  createProduct: (data) => {
    if (driver === 'better-sqlite3') {
      const stmt = sqliteDb.prepare(`
        INSERT INTO products (
          barcode, stock_code, name, category, subcategory,
          floor, batch, shelf, level, loc, loc_full, qty, status, custom
        ) VALUES (
          @barcode, @stock_code, @name, @category, @subcategory,
          @floor, @batch, @shelf, @level, @loc, @loc_full, @qty, @status, 1
        )
      `);
      const info = stmt.run({
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
        status: data.status || 'DONE'
      });
      return sqliteDb.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
    }

    const newProduct = {
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
      custom: 1
    };
    memoryProducts.push(newProduct);
    return newProduct;
  },
  updateProduct: (id, data) => {
    const numId = parseInt(id, 10);
    if (driver === 'better-sqlite3') {
      const stmt = sqliteDb.prepare(`
        UPDATE products SET
          barcode = COALESCE(@barcode, barcode),
          stock_code = COALESCE(@stock_code, stock_code),
          name = COALESCE(@name, name),
          category = COALESCE(@category, category),
          subcategory = COALESCE(@subcategory, subcategory),
          floor = COALESCE(@floor, floor),
          batch = COALESCE(@batch, batch),
          shelf = COALESCE(@shelf, shelf),
          level = COALESCE(@level, level),
          loc = COALESCE(@loc, loc),
          loc_full = COALESCE(@loc_full, loc_full),
          qty = COALESCE(@qty, qty),
          status = COALESCE(@status, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run({
        barcode: data.barcode,
        stock_code: data.stock_code,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory,
        floor: data.floor,
        batch: data.batch,
        shelf: data.shelf,
        level: data.level,
        loc: data.loc,
        loc_full: data.loc_full,
        qty: data.qty !== undefined ? parseInt(data.qty, 10) : undefined,
        status: data.status
      }, numId);
      return sqliteDb.prepare('SELECT * FROM products WHERE id = ?').get(numId);
    }

    const item = memoryProducts.find(p => p.id === numId);
    if (item) {
      Object.assign(item, data);
    }
    return item;
  },
  deleteProduct: (id) => {
    const numId = parseInt(id, 10);
    if (driver === 'better-sqlite3') {
      const info = sqliteDb.prepare('DELETE FROM products WHERE id = ?').run(numId);
      return info.changes > 0;
    }
    const len = memoryProducts.length;
    memoryProducts = memoryProducts.filter(p => p.id !== numId);
    return memoryProducts.length < len;
  },
  getStats: () => {
    if (driver === 'better-sqlite3') {
      const total = sqliteDb.prepare('SELECT COUNT(*) as total FROM products').get().total;
      const customCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM products WHERE custom = 1').get().count;
      return { total, customCount };
    }
    return {
      total: memoryProducts.length,
      customCount: memoryProducts.filter(p => p.custom === 1).length
    };
  },
  resetProductLocation: (id) => {
    const numId = parseInt(id, 10);
    if (driver === 'better-sqlite3') {
      sqliteDb.prepare(`
        UPDATE products
        SET floor = NULL, batch = NULL, shelf = NULL, level = NULL, loc_full = NULL, status = 'UNMAPPED'
        WHERE id = ?
      `).run(numId);
      return sqliteDb.prepare('SELECT * FROM products WHERE id = ?').get(numId);
    }
    const item = memoryProducts.find(p => p.id === numId);
    if (item) {
      item.floor = null;
      item.batch = null;
      item.shelf = null;
      item.level = null;
      item.loc_full = null;
      item.status = 'UNMAPPED';
    }
    return item;
  }
};
