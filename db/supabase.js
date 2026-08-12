const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const seedPath = path.join(__dirname, '..', 'seed-data.json');
let memoryProducts = [];
let isConnectedToSupabase = false;
let supabase = null;

let memoryUsers = [
  { id: 1, username: 'stockman1', password: 'password123', full_name: 'Juan Dela Cruz', role: 'stockman' },
  { id: 2, username: 'stockman2', password: 'password123', full_name: 'Pedro Santos', role: 'stockman' },
  { id: 3, username: 'checker1', password: 'password123', full_name: 'Maria Santos', role: 'checker' },
  { id: 4, username: 'checker2', password: 'password123', full_name: 'Alex Reyes', role: 'checker' },
  { id: 5, username: 'admin', password: 'adminpassword', full_name: 'Warehouse Supervisor', role: 'admin' }
];

function normalizeProduct(p) {
  if (!p) return p;
  const product_name = p.product_name !== undefined ? p.product_name : (p.name !== undefined ? p.name : (p.n || ''));
  const stock_no = p.stock_no !== undefined ? p.stock_no : (p.stock_code !== undefined ? p.stock_code : (p.s || ''));
  const department = p.department !== undefined ? p.department : (p.subcategory !== undefined ? p.subcategory : (p.sc || ''));
  const row = p.row !== undefined ? p.row : (p.batch !== undefined ? p.batch : '');
  const storage_location = p.location_storage !== undefined ? p.location_storage : (p.storage_location !== undefined ? p.storage_location : (p.loc_full !== undefined ? p.loc_full : (p.locFull || '')));
  return {
    ...p,
    product_name,
    name: product_name,
    stock_no,
    stock_code: stock_no,
    department,
    subcategory: department,
    row,
    batch: row,
    location_storage: storage_location,
    storage_location: storage_location,
    loc_full: storage_location
  };
}

function loadSeedData() {
  if (fs.existsSync(seedPath)) {
    try {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const items = JSON.parse(raw);
      return items.map((p, idx) => ({
        id: idx + 1,
        barcode: p.b || '',
        stock_no: p.s || '',
        product_name: p.n || 'Unnamed item',
        category: p.c || '',
        department: p.sc || '',
        floor: p.floor || '',
        row: p.row || '',
        shelf: p.shelf || '',
        level: p.level || '',
        loc: p.loc || '',
        storage_location: p.locFull || '',
        qty: typeof p.qty === 'number' ? p.qty : 0,
        status: p.status || '',
        custom: p.custom ? true : false,
        last_modified_by: (p.last_modified_by && p.last_modified_by !== 'System Import') ? p.last_modified_by : ''
      }));
    } catch (e) {
      console.warn('Could not read seed-data.json:', e);
    }
  }
  return [];
}

memoryProducts = loadSeedData();

// Initialize Supabase Client
function initSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚡ SUPABASE_URL / SUPABASE_KEY not set. Running in In-Memory / Netlify Fallback mode.');
    return false;
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    isConnectedToSupabase = true;
    console.log('⚡ Connected to Supabase PostgreSQL successfully!');
    seedSupabaseIfEmpty();
    seedUsersIfEmpty();
    return true;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err.message);
    isConnectedToSupabase = false;
    return false;
  }
}

async function seedUsersIfEmpty() {
  if (!supabase) return;
  try {
    const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (error) {
      console.warn('Users table check (Make sure `users` table exists in Supabase):', error.message);
      return;
    }

    if (count === 0) {
      console.log('Seeding default stockmen accounts into Supabase...');
      await supabase.from('users').insert(memoryUsers.map(u => ({
        username: u.username,
        password: u.password,
        full_name: u.full_name,
        role: u.role
      })));
      console.log('🎉 Stockmen accounts seeded into Supabase users table!');
    }
  } catch (err) {
    console.warn('Users seeding note:', err.message);
  }
}

async function seedSupabaseIfEmpty() {
  if (!supabase) return;
  try {
    const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (error) {
      console.warn('Supabase table lookup warning (Make sure `products` table exists):', error.message);
      return;
    }

    if (count === 0) {
      console.log('Seeding initial products into Supabase PostgreSQL...');
      const seedItems = memoryProducts.map(p => ({
        barcode: p.barcode,
        stock_no: p.stock_no,
        product_name: p.product_name,
        category: p.category,
        department: p.department,
        floor: p.floor,
        row: p.row,
        shelf: p.shelf,
        level: p.level,
        loc: p.loc,
        location_storage: p.storage_location || p.locFull || '',
        qty: p.qty,
        status: p.status,
        custom: p.custom,
        last_modified_by: ''
      }));

      const chunkSize = 200;
      for (let i = 0; i < seedItems.length; i += chunkSize) {
        const chunk = seedItems.slice(i, i + chunkSize);
        await supabase.from('products').insert(chunk);
      }
      console.log(`🎉 Supabase successfully seeded with products!`);
    }
  } catch (err) {
    console.error('Supabase seeding error:', err);
  }
}

initSupabase();

module.exports = {
  // Authentication & Users API
  loginUser: async (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (isConnectedToSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, full_name, role, password')
          .eq('username', cleanUser)
          .single();

        if (!error && data && data.password === cleanPass) {
          const { password, ...userWithoutPass } = data;
          return userWithoutPass;
        }
      } catch (e) {
        console.warn('Supabase user lookup error:', e.message);
      }
    }

    const found = memoryUsers.find(u => u.username.toLowerCase() === cleanUser && u.password === cleanPass);
    if (found) {
      const { password, ...userWithoutPass } = found;
      return userWithoutPass;
    }
    return null;
  },
  getUsers: async () => {
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase.from('users').select('id, username, full_name, role, created_at');
      if (!error && data) return data;
    }
    return memoryUsers.map(({ password, ...u }) => u);
  },
  createUser: async (data) => {
    const cleanUser = (data.username || '').trim().toLowerCase();
    const cleanPass = (data.password || '').trim();
    const fullName = (data.full_name || '').trim();
    const role = data.role || 'stockman';

    if (isConnectedToSupabase && supabase) {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ username: cleanUser, password: cleanPass, full_name: fullName, role }])
        .select('id, username, full_name, role, created_at')
        .single();

      if (!error && newUser) return newUser;
    }

    const newUser = {
      id: memoryUsers.length + 1,
      username: cleanUser,
      full_name: fullName,
      role
    };
    memoryUsers.push({ ...newUser, password: cleanPass });
    return newUser;
  },

  // Products API
  getAllProducts: async () => {
    if (isConnectedToSupabase && supabase) {
      try {
        const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 10000));
        const query = supabase.from('products').select('*').order('id', { ascending: true }).limit(1000);
        const { data, error } = await Promise.race([query, timeout]);
        if (!error && data) return data.map(normalizeProduct);
      } catch (err) {
        console.warn('getAllProducts Supabase timeout/error:', err.message);
      }
    }
    return memoryProducts.map(normalizeProduct);
  },
  searchProducts: async (query, limit = 20) => {
    const q = (query || '').trim();
    if (isConnectedToSupabase && supabase) {
      const pattern = `%${q}%`;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`product_name.ilike.${pattern},barcode.ilike.${pattern},stock_no.ilike.${pattern},category.ilike.${pattern},department.ilike.${pattern}`)
        .limit(limit);

      if (!error && data) return data.map(normalizeProduct);
    }

    const qLower = q.toLowerCase();
    return memoryProducts.filter(p =>
      p.product_name.toLowerCase().includes(qLower) ||
      p.barcode.toLowerCase().includes(qLower) ||
      p.stock_no.toLowerCase().includes(qLower) ||
      p.category.toLowerCase().includes(qLower) ||
      p.department.toLowerCase().includes(qLower)
    ).slice(0, limit).map(normalizeProduct);
  },
  getProductByBarcodeOrStock: async (code) => {
    const clean = (code || '').trim();
    if (isConnectedToSupabase && supabase) {
      const safeClean = clean.replace(/"/g, ''); // strip quotes to avoid breaking PostgREST syntax
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq."${safeClean}",stock_no.eq."${safeClean}"`)
        .limit(1);

      if (!error && data && data.length > 0) return normalizeProduct(data[0]);
    }
    const cleanLower = clean.toLowerCase();
    const found = memoryProducts.find(p => p.barcode.toLowerCase() === cleanLower || p.stock_no.toLowerCase() === cleanLower);
    return normalizeProduct(found);
  },
  getProductById: async (id) => {
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return normalizeProduct(data);
    }
    const found = memoryProducts.find(p => String(p.id) === String(id));
    return normalizeProduct(found);
  },
  getProductsByLocation: async ({ loc, floor, row, shelf, level }) => {
    if (isConnectedToSupabase && supabase) {
      let query = supabase.from('products').select('*');
      if (loc) {
        query = query.or(`loc.eq."${loc}",location_storage.ilike."%${loc}%"`);
      } else {
        if (floor) query = query.eq('floor', floor);
        if (row) query = query.eq('row', row);
        if (shelf) query = query.eq('shelf', shelf);
        if (level) query = query.eq('level', level);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Error getting products by location:', error.message);
        return [];
      }
      return (data || []).map(normalizeProduct);
    }

    const targetLoc = loc ? loc.trim().toLowerCase() : '';
    return memoryProducts.filter(p => {
      const pLoc = (p.loc || '').trim().toLowerCase();
      if (targetLoc && pLoc === targetLoc) return true;
      const f = String(p.floor || '').trim();
      const r = String(p.row || '').trim();
      const s = String(p.shelf || '').trim();
      const l = String(p.level || '').trim();
      return (floor && f === floor) && (row && r === row) && (shelf && s === shelf) && (level && l === level);
    }).map(normalizeProduct);
  },
  createProduct: async (data) => {
    const payload = {
      barcode: data.barcode || '',
      stock_no: data.stock_no || data.stock_code || '',
      product_name: data.product_name || data.name || '',
      category: data.category || 'Uncategorized',
      department: data.department || data.subcategory || '',
      floor: data.floor || '1',
      row: data.row || data.batch || '',
      shelf: data.shelf || '',
      level: data.level || '0',
      loc: data.loc || '',
      location_storage: data.location_storage || data.storage_location || data.loc_full || '',
      qty: parseInt(data.qty || 0, 10),
      status: data.status || 'MAPPED',
      custom: true,
      last_modified_by: data.last_modified_by || data.modifiedBy || 'Unassigned Stockman'
    };

    if (isConnectedToSupabase && supabase) {
      const { data: inserted, error } = await supabase.from('products').insert([payload]).select().single();
      if (!error && inserted) return normalizeProduct(inserted);
    }

    const newProduct = {
      id: memoryProducts.length + 1,
      ...payload
    };
    memoryProducts.push(newProduct);
    return normalizeProduct(newProduct);
  },
  updateProduct: async (id, data) => {
    const updatePayload = {};
    if (data.product_name !== undefined || data.name !== undefined) updatePayload.product_name = data.product_name || data.name;
    if (data.stock_no !== undefined || data.stock_code !== undefined) updatePayload.stock_no = data.stock_no || data.stock_code;
    if (data.barcode !== undefined) updatePayload.barcode = data.barcode;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.department !== undefined || data.subcategory !== undefined) updatePayload.department = data.department || data.subcategory;
    if (data.floor !== undefined) updatePayload.floor = data.floor;
    if (data.row !== undefined || data.batch !== undefined) updatePayload.row = data.row !== undefined ? data.row : data.batch;
    if (data.shelf !== undefined) updatePayload.shelf = data.shelf;
    if (data.level !== undefined) updatePayload.level = data.level;
    if (data.loc !== undefined) updatePayload.loc = data.loc;
    if (data.storage_location !== undefined || data.loc_full !== undefined || data.location_storage !== undefined) {
      updatePayload.location_storage = data.location_storage || data.storage_location || data.loc_full;
    }
    if (data.qty !== undefined) updatePayload.qty = parseInt(data.qty, 10);
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.custom !== undefined) updatePayload.custom = Boolean(data.custom);
    updatePayload.last_modified_by = data.last_modified_by || data.modifiedBy || 'Stockman';

    if (isConnectedToSupabase && supabase) {
      // 1. Update the specific location row
      const { data: updated, error } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product row:', error.message);
      }

      if (!error && updated) {
        // 2. Propagate product-wide metadata updates to all other rows for the same product
        const barcode = (updated.barcode || '').trim();
        const stock_no = (updated.stock_no || '').trim();
        
        if (barcode || stock_no) {
          const safeBar = barcode.replace(/"/g, '');
          const safeStock = stock_no.replace(/"/g, '');

          const syncData = {
            product_name: updated.product_name,
            category: updated.category,
            department: updated.department,
            stock_no: updated.stock_no,
            barcode: updated.barcode,
            custom: true
          };
          
          let query = supabase.from('products').update(syncData);
          if (safeBar && safeStock) {
            query = query.or(`barcode.eq."${safeBar}",stock_no.eq."${safeStock}"`);
          } else if (safeBar) {
            query = query.eq('barcode', safeBar);
          } else {
            query = query.eq('stock_no', safeStock);
          }
          
          const { error: syncError } = await query;
          if (syncError) {
            console.error('Failed to sync product metadata to other locations:', syncError.message);
          }
        }
        return normalizeProduct(updated);
      }
    }

    const item = memoryProducts.find(p => String(p.id) === String(id));
    if (item) {
      Object.assign(item, data);
      if (data.last_modified_by) item.last_modified_by = data.last_modified_by;

      // Sync metadata in memory products
      const barcode = item.barcode || '';
      const stock_no = item.stock_no || '';
      if (barcode || stock_no) {
        memoryProducts.forEach(p => {
          const matchesBarcode = barcode && p.barcode === barcode;
          const matchesStock = stock_no && p.stock_no === stock_no;
          if (matchesBarcode || matchesStock) {
            p.product_name = item.product_name;
            p.category = item.category;
            p.department = item.department;
            p.stock_no = item.stock_no;
            p.barcode = item.barcode;
            p.custom = true;
          }
        });
      }
    }
    return normalizeProduct(item);
  },
  deleteProduct: async (id) => {
    if (isConnectedToSupabase && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      return !error;
    }
    const len = memoryProducts.length;
    memoryProducts = memoryProducts.filter(p => String(p.id) !== String(id));
    return memoryProducts.length < len;
  },
  bulkCreateProducts: async (items) => {
    if (!isConnectedToSupabase || !supabase) {
      return {
        success: false,
        error: 'SUPABASE_NOT_CONNECTED',
        message: 'SUPABASE_URL or SUPABASE_KEY environment variables are missing in Netlify settings.'
      };
    }

    const formattedItems = items.map(data => ({
      barcode: data.barcode || '',
      stock_no: data.stock_no || '',
      product_name: data.product_name,
      category: data.category || 'Uncategorized',
      department: data.department || '',
      floor: data.floor || '1',
      row: data.row || '',
      shelf: data.shelf || '',
      level: data.level || '0',
      loc: data.loc || '',
      location_storage: data.location_storage || data.storage_location || '',
      qty: parseInt(data.qty || 0, 10),
      status: data.status || 'MAPPED',
      custom: true,
      last_modified_by: data.last_modified_by || 'System Import'
    }));

    const chunkSize = 500;
    let insertedCount = 0;
    let lastError = null;

    for (let i = 0; i < formattedItems.length; i += chunkSize) {
      const chunk = formattedItems.slice(i, i + chunkSize);
      const { data: inserted, error } = await supabase.from('products').insert(chunk).select('id');
      if (error) {
        console.error('Supabase bulk insert chunk error:', error.message);
        lastError = error.message;
        break;
      } else if (inserted) {
        insertedCount += inserted.length;
      }
    }

    if (lastError && insertedCount === 0) {
      return { success: false, error: lastError };
    }

    return { success: true, count: insertedCount };
  },
  getStats: async () => {
    if (isConnectedToSupabase && supabase) {
      const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: customCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('custom', true);
      return { total: total || 0, customCount: customCount || 0, isSupabase: true };
    }
    return {
      total: memoryProducts.length,
      customCount: memoryProducts.filter(p => p.custom).length,
      isSupabase: false
    };
  }
};
