require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function cleanDatabase() {
  console.log('🚀 Starting Database Cleaning Process...');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

  let supabaseCleanCount = 0;

  // 1. Clean Supabase PostgreSQL Database
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      console.log('⚡ Connected to Supabase PostgreSQL at:', supabaseUrl);

      const { data, error } = await supabase
        .from('products')
        .update({
          floor: '',
          row: '',
          shelf: '',
          level: '',
          loc: '',
          location_storage: '',
          qty: 0,
          status: 'UNMAPPED',
          custom: false,
          last_modified_by: ''
        })
        .neq('id', 0)
        .select('id');

      if (error) {
        console.error('❌ Supabase Update Error:', error.message);
      } else {
        supabaseCleanCount = data ? data.length : 0;
        console.log(`✅ Supabase Database Cleaned! ${supabaseCleanCount} products reset to UNMAPPED status with empty location columns.`);
      }
    } catch (e) {
      console.error('❌ Error updating Supabase:', e.message);
    }
  } else {
    console.log('ℹ️ Supabase credentials not found in environment.');
  }

  // 2. Clean local seed-data.json if exists
  const seedPath = path.join(__dirname, 'seed-data.json');
  if (fs.existsSync(seedPath)) {
    try {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const items = JSON.parse(raw);
      console.log(`📁 Found seed-data.json with ${items.length} items. Cleaning location fields...`);

      const cleaned = items.map(p => ({
        ...p,
        floor: '',
        row: '',
        batch: '',
        shelf: '',
        level: '',
        loc: '',
        locFull: '',
        storage_location: '',
        location_storage: '',
        qty: 0,
        status: 'UNMAPPED',
        custom: false,
        last_modified_by: ''
      }));

      fs.writeFileSync(seedPath, JSON.stringify(cleaned, null, 2), 'utf8');
      console.log(`✅ seed-data.json updated & cleaned successfully!`);
    } catch (e) {
      console.error('❌ Error updating seed-data.json:', e.message);
    }
  }

  // 3. Clean SQLite database file if exists
  const dbPath = path.join(__dirname, 'db', 'database.db');
  if (fs.existsSync(dbPath)) {
    try {
      const Database = require('better-sqlite3');
      const sqliteDb = new Database(dbPath);
      console.log(`📁 Found SQLite database at ${dbPath}. Cleaning products table...`);

      const info = sqliteDb.prepare(`
        UPDATE products
        SET floor = '',
            batch = '',
            shelf = '',
            level = '',
            loc = '',
            loc_full = '',
            qty = 0,
            status = 'UNMAPPED',
            custom = 0,
            last_modified_by = ''
      `).run();

      console.log(`✅ SQLite Database Cleaned! ${info.changes} rows updated.`);
      sqliteDb.close();
    } catch (e) {
      console.error('❌ Error updating SQLite DB:', e.message);
    }
  }

  console.log('🎉 ALL DATABASES CLEANED SUCCESSFULLY!');
}

cleanDatabase();
