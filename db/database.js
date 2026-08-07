const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const isNetlify = process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT || process.env.AWS_LAMBDA_FUNCTION_NAME;
const defaultDbPath = path.join(__dirname, 'product_locator.db');
const dbPath = process.env.DB_PATH || (isNetlify ? '/tmp/product_locator.db' : defaultDbPath);

const db = new Database(dbPath);

// Enable WAL mode for performance & concurrency
db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
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

    CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
    CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_code);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
  `);

  // Check if database needs initial seeding
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM products');
  const { count } = countStmt.get();

  if (count === 0) {
    console.log('Database is empty. Seeding initial 940 products from seed-data.json...');
    const seedPath = path.join(__dirname, '..', 'seed-data.json');
    if (fs.existsSync(seedPath)) {
      const seedProducts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

      const insertStmt = db.prepare(`
        INSERT INTO products (
          barcode, stock_code, name, category, subcategory,
          floor, batch, shelf, level, loc, loc_full, qty, status, custom
        ) VALUES (
          @b, @s, @n, @c, @sc,
          @floor, @batch, @shelf, @level, @loc, @locFull, @qty, @status, @custom
        )
      `);

      const insertMany = db.transaction((products) => {
        for (const p of products) {
          insertStmt.run({
            b: p.b || '',
            s: p.s || '',
            n: p.n || 'Unnamed item',
            c: p.c || '',
            sc: p.sc || '',
            floor: p.floor || '',
            batch: p.batch || '',
            shelf: p.shelf || '',
            level: p.level || '',
            loc: p.loc || '',
            locFull: p.locFull || '',
            qty: typeof p.qty === 'number' ? p.qty : 0,
            status: p.status || '',
            custom: p.custom ? 1 : 0
          });
        }
      });

      insertMany(seedProducts);
      console.log(`Seeding complete! ${seedProducts.length} products inserted into SQLite database.`);
    } else {
      console.warn('seed-data.json not found, starting with empty products table.');
    }
  }
}

initDb();

module.exports = {
  db,
  getAllProducts: () => {
    return db.prepare('SELECT * FROM products ORDER BY id ASC').all();
  },
  searchProducts: (query, limit = 20) => {
    const q = `%${query.trim().toLowerCase()}%`;
    return db.prepare(`
      SELECT * FROM products
      WHERE LOWER(name) LIKE ?
         OR LOWER(barcode) LIKE ?
         OR LOWER(stock_code) LIKE ?
         OR LOWER(category) LIKE ?
         OR LOWER(subcategory) LIKE ?
      LIMIT ?
    `).all(q, q, q, q, q, limit);
  },
  getProductByBarcodeOrStock: (code) => {
    const clean = code.trim();
    return db.prepare(`
      SELECT * FROM products
      WHERE barcode = ? OR stock_code = ?
      LIMIT 1
    `).get(clean, clean);
  },
  getProductById: (id) => {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },
  createProduct: (data) => {
    const stmt = db.prepare(`
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
    return db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  },
  updateProduct: (id, data) => {
    const stmt = db.prepare(`
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
    }, id);
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },
  deleteProduct: (id) => {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  },
  getStats: () => {
    const total = db.prepare('SELECT COUNT(*) as total FROM products').get().total;
    const customCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE custom = 1').get().count;
    return { total, customCount };
  }
};
