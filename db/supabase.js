const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const seedPath = path.join(__dirname, '..', 'seed-data.json');
let memoryProducts = [];
let isConnectedToSupabase = false;
let supabase = null;

// Default Stockmen Accounts for initial setup / fallback
let memoryUsers = [
  { id: 1, username: 'stockman1', password: 'password123', full_name: 'Juan Dela Cruz', role: 'stockman' },
  { id: 2, username: 'stockman2', password: 'password123', full_name: 'Pedro Santos', role: 'stockman' },
  { id: 3, username: 'admin', password: 'adminpassword', full_name: 'Warehouse Supervisor', role: 'admin' }
];

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
        custom: p.custom ? true : false,
        last_modified_by: p.last_modified_by || 'System Import'
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
        custom: p.custom,
        last_modified_by: 'System Import'
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
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
      if (!error && data) return data;
    }
    return memoryProducts;
  },
  searchProducts: async (query, limit = 20) => {
    const q = (query || '').trim();
    if (isConnectedToSupabase && supabase) {
      const pattern = `%${q}%`;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.${pattern},barcode.ilike.${pattern},stock_code.ilike.${pattern},category.ilike.${pattern},subcategory.ilike.${pattern}`)
        .limit(limit);

      if (!error && data) return data;
    }

    const qLower = q.toLowerCase();
    return memoryProducts.filter(p =>
      p.name.toLowerCase().includes(qLower) ||
      p.barcode.toLowerCase().includes(qLower) ||
      p.stock_code.toLowerCase().includes(qLower) ||
      p.category.toLowerCase().includes(qLower) ||
      p.subcategory.toLowerCase().includes(qLower)
    ).slice(0, limit);
  },
  getProductByBarcodeOrStock: async (code) => {
    const clean = (code || '').trim();
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq.${clean},stock_code.eq.${clean}`)
        .limit(1);

      if (!error && data && data.length > 0) return data[0];
    }
    const cleanLower = clean.toLowerCase();
    return memoryProducts.find(p => p.barcode.toLowerCase() === cleanLower || p.stock_code.toLowerCase() === cleanLower);
  },
  getProductById: async (id) => {
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return memoryProducts.find(p => String(p.id) === String(id));
  },
  createProduct: async (data) => {
    const payload = {
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
      custom: true,
      last_modified_by: data.last_modified_by || 'Unassigned Stockman'
    };

    if (isConnectedToSupabase && supabase) {
      const { data: inserted, error } = await supabase.from('products').insert([payload]).select().single();
      if (!error && inserted) return inserted;
    }

    const newProduct = {
      id: memoryProducts.length + 1,
      ...payload
    };
    memoryProducts.push(newProduct);
    return newProduct;
  },
  updateProduct: async (id, data) => {
    if (isConnectedToSupabase && supabase) {
      // 1. Update the specific location row
      const { data: updated, error } = await supabase
        .from('products')
        .update({
          ...data,
          last_modified_by: data.last_modified_by || data.modifiedBy || 'Stockman'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product row:', error.message);
      }

      if (!error && updated) {
        // 2. Propagate product-wide metadata updates to all other rows for the same product
        const barcode = updated.barcode || '';
        const stock_code = updated.stock_code || '';
        
        if (barcode || stock_code) {
          const syncData = {
            name: updated.name,
            category: updated.category,
            subcategory: updated.subcategory,
            stock_code: updated.stock_code,
            barcode: updated.barcode
          };
          
          let query = supabase.from('products').update(syncData);
          if (barcode && stock_code) {
            query = query.or(`barcode.eq."${barcode}",stock_code.eq."${stock_code}"`);
          } else if (barcode) {
            query = query.eq('barcode', barcode);
          } else {
            query = query.eq('stock_code', stock_code);
          }
          
          const { error: syncError } = await query;
          if (syncError) {
            console.error('Failed to sync product metadata to other locations:', syncError.message);
          }
        }
        return updated;
      }
    }

    const item = memoryProducts.find(p => String(p.id) === String(id));
    if (item) {
      Object.assign(item, data);
      if (data.last_modified_by) item.last_modified_by = data.last_modified_by;

      // Sync metadata in memory products
      const barcode = item.barcode || '';
      const stock_code = item.stock_code || '';
      if (barcode || stock_code) {
        memoryProducts.forEach(p => {
          const matchesBarcode = barcode && p.barcode === barcode;
          const matchesStock = stock_code && p.stock_code === stock_code;
          if (matchesBarcode || matchesStock) {
            p.name = item.name;
            p.category = item.category;
            p.subcategory = item.subcategory;
            p.stock_code = item.stock_code;
            p.barcode = item.barcode;
          }
        });
      }
    }
    return item;
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
