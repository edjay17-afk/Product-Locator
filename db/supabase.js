const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const { SEARCH_SYNONYMS } = require('./search-synonyms');
const { hashPassword, verifyPassword } = require('../auth');

const seedPath = path.join(__dirname, '..', 'seed-data.json');
let memoryProducts = [];
let isConnectedToSupabase = false;
let supabase = null;

// Short-lived in-memory cache for the full product catalog so that
// /api/products/all (used by the client for instant local search) does not
// re-download tens of thousands of rows on every page load.
const ALL_PRODUCTS_TTL_MS = 300000;
let allProductsCache = { data: null, time: 0 };
let allProductsPromise = null; // in-flight fetch shared by concurrent callers
// Only the columns the app actually uses — keeps the Supabase transfer small.
const PRODUCT_COLUMNS = 'id,barcode,barcode_2,stock_no,product_name,category,department,floor,row,shelf,level,loc,location_storage,qty,status,custom,last_modified_by,created_at';
function invalidateAllProductsCache() {
  allProductsCache.time = 0;
}

function escapePostgrestValue(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

let memoryUsers = [
  { id: 1, username: 'stockman1', password: hashPassword('password123'), full_name: 'Juan Dela Cruz', role: 'stockman' },
  { id: 2, username: 'stockman2', password: hashPassword('password123'), full_name: 'Pedro Santos', role: 'stockman' },
  { id: 3, username: 'checker1', password: hashPassword('password123'), full_name: 'Maria Santos', role: 'checker' },
  { id: 4, username: 'checker2', password: hashPassword('password123'), full_name: 'Alex Reyes', role: 'checker' },
  { id: 5, username: 'admin', password: hashPassword('adminpassword'), full_name: 'Warehouse Supervisor', role: 'admin' }
];

function normalizeProduct(p) {
  if (!p) return p;
  const product_name = (p.product_name && String(p.product_name).trim()) ? String(p.product_name).trim() : ((p.name && String(p.name).trim()) ? String(p.name).trim() : (p.n || ''));
  const stock_no = (p.stock_no && String(p.stock_no).trim()) ? String(p.stock_no).trim() : ((p.stock_code && String(p.stock_code).trim()) ? String(p.stock_code).trim() : (p.s || ''));
  const department = (p.department && String(p.department).trim()) ? String(p.department).trim() : ((p.subcategory && String(p.subcategory).trim()) ? String(p.subcategory).trim() : (p.sc || ''));
  const row = p.row !== undefined && p.row !== null ? String(p.row) : (p.batch !== undefined && p.batch !== null ? String(p.batch) : '');
  const storage_location = p.location_storage !== undefined && p.location_storage !== null ? String(p.location_storage) : (p.storage_location !== undefined && p.storage_location !== null ? String(p.storage_location) : (p.loc_full !== undefined && p.loc_full !== null ? String(p.loc_full) : (p.locFull || '')));
  const is_carton = Boolean(p.is_carton || p.loc_type === 'CARTON' || (storage_location && (storage_location.includes('Carton') || storage_location.includes('Big Item'))));
  const loc_type = is_carton ? 'CARTON' : (p.loc_type || 'SHELF');
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
    loc_full: storage_location,
    is_carton,
    loc_type
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

// Initialize Supabase Client
function initSupabase() {
  if (supabase) return supabase;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚡ SUPABASE_URL / SUPABASE_KEY not set. Running in In-Memory / Netlify Fallback mode.');
    isConnectedToSupabase = false;
    return null;
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    isConnectedToSupabase = true;
    console.log('⚡ Connected to Supabase PostgreSQL successfully!');
    return supabase;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err.message);
    isConnectedToSupabase = false;
    return null;
  }
}

initSupabase();

if (!isConnectedToSupabase) {
  memoryProducts = loadSeedData();
}

module.exports = {
  // Authentication & Users API
  loginUser: async (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, full_name, role, password')
        .eq('username', cleanUser)
        .single();

      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      if (data) {
        const result = verifyPassword(cleanPass, data.password);
        if (result.valid) {
          if (result.needsUpgrade) {
            const { error: upgradeError } = await supabase
              .from('users')
              .update({ password: hashPassword(cleanPass) })
              .eq('id', data.id);
            if (upgradeError) console.warn('Could not upgrade legacy password hash:', upgradeError.message);
          }
          const { password, ...userWithoutPass } = data;
          return userWithoutPass;
        }
      }
      return null;
    }

    const found = memoryUsers.find(u => u.username.toLowerCase() === cleanUser);
    if (found && verifyPassword(cleanPass, found.password).valid) {
      const { password, ...userWithoutPass } = found;
      return userWithoutPass;
    }
    return null;
  },
  getUsers: async () => {
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase.from('users').select('id, username, full_name, role, created_at');
      if (error) throw new Error(error.message);
      if (data) return data;
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
        .insert([{ username: cleanUser, password: hashPassword(cleanPass), full_name: fullName, role }])
        .select('id, username, full_name, role, created_at')
        .single();

      if (error) throw new Error(error.message);
      if (newUser) return newUser;
    }

    const newUser = {
      id: memoryUsers.length + 1,
      username: cleanUser,
      full_name: fullName,
      role
    };
    memoryUsers.push({ ...newUser, password: hashPassword(cleanPass) });
    return newUser;
  },

  // Products API
  getAllProducts: async () => {
    if (isConnectedToSupabase && supabase) {
      const now = Date.now();
      if (allProductsCache.data && now - allProductsCache.time < ALL_PRODUCTS_TTL_MS) {
        return allProductsCache.data;
      }
      // Concurrent callers (e.g. /api/stats + /api/products/all at app boot)
      // share a single in-flight download instead of each pulling 50k rows.
      if (allProductsPromise) return allProductsPromise;

      allProductsPromise = (async () => {
        // PostgREST caps each response at 1000 rows, so page through the
        // whole catalog in parallel chunks — the client needs every SKU
        // locally for instant (zero-network) search.
        const PAGE = 1000;
        const MAX_ROWS = 200000; // safety cap
        const CONCURRENCY = 6;
        const { count, error: countErr } = await supabase
          .from('products').select('id', { count: 'exact', head: true });
        if (countErr) throw new Error(countErr.message);
        const total = Math.min(count || 0, MAX_ROWS);
        const pageCount = Math.max(1, Math.ceil(total / PAGE));
        const all = [];
        for (let startPage = 0; startPage < pageCount; startPage += CONCURRENCY) {
          const batch = [];
          for (let pg = startPage; pg < Math.min(startPage + CONCURRENCY, pageCount); pg++) {
            const from = pg * PAGE;
            batch.push(
              supabase.from('products').select(PRODUCT_COLUMNS).order('id', { ascending: true }).range(from, from + PAGE - 1)
                .then(({ data, error }) => {
                  if (error) throw new Error(error.message);
                  return data || [];
                })
            );
          }
          for (const rows of await Promise.all(batch)) {
            all.push(...rows);
          }
        }
        const mapped = all.map(normalizeProduct);
        allProductsCache = { data: mapped, time: Date.now() };
        return mapped;
      })();

      try {
        return await allProductsPromise;
      } catch (err) {
        console.warn('getAllProducts Supabase error:', err.message);
        if (allProductsCache.data) return allProductsCache.data; // serve stale rather than nothing
        throw err;
      } finally {
        allProductsPromise = null;
      }
    }
    return memoryProducts.map(normalizeProduct);
  },
  searchProducts: async (query, limit = 20) => {
    const q = (query || '').trim();
    if (!q) return [];
    const qStripped = q.replace(/^0+/, '');

    if (isConnectedToSupabase && supabase) {
      const pattern = escapePostgrestValue(`%${q}%`);
      const patternStripped = escapePostgrestValue(qStripped ? `%${qStripped}%` : `%${q}%`);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`product_name.ilike."${pattern}",barcode.ilike."${pattern}",barcode.ilike."${patternStripped}",barcode_2.ilike."${pattern}",barcode_2.ilike."${patternStripped}",stock_no.ilike."${pattern}",category.ilike."${pattern}",department.ilike."${pattern}"`)
        .limit(limit);

      if (error) throw new Error(error.message);
      if (data) return data.map(normalizeProduct);
    }

    const qLower = q.toLowerCase();
    const qStrippedLower = qStripped.toLowerCase();
    return memoryProducts.filter(p => {
      const name = (p.product_name || p.name || '').toLowerCase();
      const barcode = (p.barcode || p.b || '').toLowerCase();
      const stock = (p.stock_no || p.stock_code || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const dept = (p.department || p.subcategory || '').toLowerCase();

      return name.includes(qLower) ||
             barcode.includes(qLower) ||
             (qStrippedLower && barcode.includes(qStrippedLower)) ||
             stock.includes(qLower) ||
             cat.includes(qLower) ||
             dept.includes(qLower);
    }).slice(0, limit).map(normalizeProduct);
  },
  getPaginatedProducts: async ({ page = 1, limit = 25, search = '', status = 'ALL', floor = 'ALL' } = {}) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(500, Math.max(1, parseInt(limit, 10) || 25));

    // Filter the (60s-cached) full catalog in memory — 50k rows filter in
    // milliseconds and the semantics stay identical to the export endpoint.
    let products = await module.exports.getAllProducts();

    if (status && status !== 'ALL') {
      if (status === 'MAPPED') {
        products = products.filter(p => (p.status || '').toUpperCase() === 'MAPPED' || p.floor || p.row || p.shelf);
      } else if (status === 'UNMAPPED') {
        products = products.filter(p => (p.status || '').toUpperCase() !== 'MAPPED' && !p.floor && !p.row && !p.shelf);
      }
    }

    if (floor && floor !== 'ALL') {
      products = products.filter(p => String(p.floor) === String(floor));
    }

    if (search && search.trim()) {
      const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
      products = products.filter(p => {
        const fullText = `${p.product_name || ''} ${p.barcode || ''} ${p.barcode_2 || ''} ${p.stock_no || ''} ${p.category || ''} ${p.department || ''}`.toLowerCase();
        return tokens.every(t => {
          const syns = SEARCH_SYNONYMS[t] || [t];
          return syns.some(syn => fullText.includes(syn));
        });
      });
    }

    const total = products.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (pageNum - 1) * pageSize;
    return {
      products: products.slice(start, start + pageSize),
      total,
      page: pageNum,
      totalPages
    };
  },
  getProductByBarcodeOrStock: async (code) => {
    const clean = (code || '').trim();
    if (!clean) return null;
    const cleanStripped = clean.replace(/^0+/, '');

    if (isConnectedToSupabase && supabase) {
      const safeClean = escapePostgrestValue(clean);
      const safeStripped = escapePostgrestValue(cleanStripped);

      // Check exact match or zero-stripped match first
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq."${safeClean}",stock_no.eq."${safeClean}",barcode.eq."${safeStripped}",stock_no.eq."${safeStripped}"`)
        .limit(1);

      if (error) throw new Error(error.message);
      if (data && data.length > 0) return normalizeProduct(data[0]);

      // Fallback to ilike match if eq fails
      const { data: dataLike, error: errorLike } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.ilike."%${safeClean}%",stock_no.ilike."%${safeClean}%"`)
        .limit(1);

      if (errorLike) throw new Error(errorLike.message);
      if (dataLike && dataLike.length > 0) return normalizeProduct(dataLike[0]);
    }

    const cleanLower = clean.toLowerCase();
    const cleanStrippedLower = cleanStripped.toLowerCase();
    const found = memoryProducts.find(p => {
      const b = (p.barcode || p.b || '').toLowerCase();
      const s = (p.stock_no || p.stock_code || p.s || '').toLowerCase();
      return b === cleanLower || s === cleanLower || (cleanStrippedLower && (b === cleanStrippedLower || s === cleanStrippedLower));
    });
    return normalizeProduct(found);
  },
  getProductById: async (id) => {
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      if (data) return normalizeProduct(data);
    }
    const found = memoryProducts.find(p => String(p.id) === String(id));
    return normalizeProduct(found);
  },
  getProductsByLocation: async ({ loc, floor, row, shelf, level }) => {
    if (isConnectedToSupabase && supabase) {
      let query = supabase.from('products').select('*');
      if (loc) {
        const safeLoc = escapePostgrestValue(loc);
        query = query.or(`loc.eq."${safeLoc}",location_storage.ilike."%${safeLoc}%"`);
      } else {
        if (floor) query = query.eq('floor', floor);
        if (row) query = query.eq('row', row);
        if (shelf) query = query.eq('shelf', shelf);
        if (level) query = query.eq('level', level);
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
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
    invalidateAllProductsCache();
    const payload = {
      barcode: data.barcode || '',
      stock_no: data.stock_no || data.stock_code || '',
      product_name: data.product_name || data.name || '',
      category: data.category || 'Uncategorized',
      department: data.department || data.subcategory || '',
      barcode_2: data.barcode_2 || data.b2 || '',
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
      if (error) throw new Error(error.message);
      if (inserted) return normalizeProduct({ ...inserted, is_carton: Boolean(data.is_carton || data.loc_type === 'CARTON') });
    }

    const newProduct = {
      id: memoryProducts.length + 1,
      ...payload,
      is_carton: Boolean(data.is_carton || data.loc_type === 'CARTON'),
      loc_type: data.loc_type || (data.is_carton ? 'CARTON' : 'SHELF')
    };
    memoryProducts.push(newProduct);
    return normalizeProduct(newProduct);
  },
  updateProduct: async (id, data) => {
    invalidateAllProductsCache();
    const updatePayload = {};
    const pName = (data.product_name || data.name || '').toString().trim();
    if (pName) updatePayload.product_name = pName;
    const sNo = (data.stock_no || data.stock_code || '').toString().trim();
    if (sNo) updatePayload.stock_no = sNo;
    const bCode = (data.barcode || '').toString().trim();
    if (bCode) updatePayload.barcode = bCode;
    const bCode2 = (data.barcode_2 || data.b2 || '').toString().trim();
    if (bCode2) updatePayload.barcode_2 = bCode2;
    if (data.category && String(data.category).trim()) updatePayload.category = String(data.category).trim();
    const dept = (data.department || data.subcategory || '').toString().trim();
    if (dept) updatePayload.department = dept;
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

      if (error) throw new Error(error.message);

      if (!error && updated) {
        // 2. Propagate product-wide metadata updates to all other rows for the same product ONLY if metadata was provided
        const barcode = (updated.barcode || '').trim();
        const stock_no = (updated.stock_no || '').trim();
        
        if (pName && (barcode || stock_no)) {
          const safeBar = escapePostgrestValue(barcode);
          const safeStock = escapePostgrestValue(stock_no);
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
      Object.assign(item, updatePayload);
      if (data.last_modified_by) item.last_modified_by = data.last_modified_by;

      // Sync metadata in memory products
      const barcode = item.barcode || '';
      const stock_no = item.stock_no || '';
      if (pName && (barcode || stock_no)) {
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
    invalidateAllProductsCache();
    if (isConnectedToSupabase && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return true;
    }
    const len = memoryProducts.length;
    memoryProducts = memoryProducts.filter(p => String(p.id) !== String(id));
    return memoryProducts.length < len;
  },
  bulkCreateProducts: async (items) => {
    invalidateAllProductsCache();
    if (!isConnectedToSupabase || !supabase) {
      return {
        success: false,
        error: 'SUPABASE_NOT_CONNECTED',
        message: 'SUPABASE_URL or SUPABASE_KEY environment variables are missing in Netlify settings.'
      };
    }

    const formattedItems = items.map(data => ({
      barcode: data.barcode || '',
      barcode_2: data.barcode_2 || '',
      stock_no: data.stock_no || '',
      product_name: data.product_name || data.name,
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

    if (lastError) {
      return { success: false, error: lastError, count: insertedCount, partial: insertedCount > 0 };
    }

    return { success: true, count: insertedCount };
  },
  // Upsert the master SKU list by barcode (falling back to stock_no when the
  // barcode is blank). Existing rows only get their catalog fields refreshed —
  // shelf locations, quantities and in-app flags are left untouched — so
  // re-importing a list never duplicates a SKU or wipes a location mapping.
  upsertMasterProducts: async (items) => {
    invalidateAllProductsCache();
    if (!isConnectedToSupabase || !supabase) {
      return {
        success: false,
        error: 'SUPABASE_NOT_CONNECTED',
        message: 'SUPABASE_URL or SUPABASE_KEY environment variables are missing.'
      };
    }

    const clean = [];
    const seen = new Set();
    for (const data of items) {
      const barcode = (data.barcode || '').toString().trim();
      const stock_no = (data.stock_no || '').toString().trim();
      const name = (data.product_name || data.name || '').toString().trim();
      if (!name || name === 'Unnamed Item') continue;
      if (!barcode && !stock_no) continue;
      const key = (barcode || stock_no).toLowerCase();
      if (seen.has(key)) continue; // duplicated inside the uploaded file itself
      seen.add(key);
      clean.push({
        barcode,
        stock_no,
        product_name: name,
        category: data.category || 'Uncategorized',
        department: data.department || '',
        barcode_2: (data.barcode_2 || '').toString().trim()
      });
    }

    // Page through the existing id + key columns once to split updates from inserts.
    const existingByBarcode = new Map();
    const existingByStock = new Map();
    const PAGE = 1000;
    for (let offset = 0; ; offset += PAGE) {
      const { data, error } = await supabase.from('products').select('id,barcode,stock_no').range(offset, offset + PAGE - 1);
      if (error) return { success: false, error: error.message };
      if (!data || data.length === 0) break;
      for (const row of data) {
        const b = (row.barcode || '').trim().toLowerCase();
        const s = (row.stock_no || '').trim().toLowerCase();
        if (b && !existingByBarcode.has(b)) existingByBarcode.set(b, row.id);
        if (s && !existingByStock.has(s)) existingByStock.set(s, row.id);
      }
    }

    const updates = [];
    const inserts = [];
    for (const item of clean) {
      const b = item.barcode.toLowerCase();
      const s = item.stock_no.toLowerCase();
      const id = (b && existingByBarcode.get(b)) || (s && existingByStock.get(s));
      if (id) {
        const payload = { id, ...item };
        if (!payload.barcode_2) delete payload.barcode_2; // never wipe a known barcode_2
        updates.push(payload);
      } else {
        const payload = {
          ...item,
          floor: '', row: '', shelf: '', level: '0',
          loc: '', location_storage: '',
          qty: 0, status: 'UNMAPPED', custom: false,
          last_modified_by: 'System Import'
        };
        if (!payload.barcode_2) delete payload.barcode_2;
        inserts.push(payload);
      }
    }

    let insertedCount = 0;
    const chunkSize = 500;
    for (let i = 0; i < inserts.length; i += chunkSize) {
      const chunk = inserts.slice(i, i + chunkSize);
      const { data, error } = await supabase.from('products').insert(chunk).select('id');
      if (error) return { success: false, error: error.message };
      insertedCount += data ? data.length : 0;
    }

    // Supabase has no bulk update — run small parallel batches keyed by id.
    let updatedCount = 0;
    const CONCURRENCY = 20;
    for (let i = 0; i < updates.length; i += CONCURRENCY) {
      const results = await Promise.all(updates.slice(i, i + CONCURRENCY).map(u => {
        const { id, ...fields } = u;
        return supabase.from('products').update(fields).eq('id', id);
      }));
      for (const r of results) {
        if (r.error) return { success: false, error: r.error.message };
        updatedCount++;
      }
    }

    return { success: true, count: clean.length, inserted: insertedCount, updated: updatedCount };
  },
  transferProductStock: async ({ sourceId, destLocation, transferQty, modifiedBy }) => {
    const qtyToTransfer = parseInt(transferQty, 10);
    if (!sourceId || isNaN(qtyToTransfer) || qtyToTransfer <= 0) {
      return { error: 'Invalid transfer arguments.' };
    }

    const source = await module.exports.getProductById(sourceId);
    if (!source) return { error: 'Source product record not found.' };

    const currentQty = parseInt(source.qty, 10) || 0;
    if (qtyToTransfer > currentQty) {
      return { error: `Transfer quantity (${qtyToTransfer}) exceeds source available stock (${currentQty}).` };
    }

    const cleanDestLoc = (destLocation || '').trim();
    const m = cleanDestLoc.match(/^(\d+)-(\d+)-(\d+)-(\d+)$/);
    if (!m) {
      return { error: 'Destination location must be formatted as Floor-Row-Shelf-Level (e.g. 1-05-02-01).' };
    }

    const destFloor = m[1];
    const destRow = m[2];
    const destShelf = m[3];
    const destLevel = m[4];
    const destFloorLabel = destFloor === '1' ? 'First Floor' : (destFloor === '2' ? 'Second Floor' : 'Third Floor');
    const destLocFull = `${cleanDestLoc} ${destFloorLabel} - Row ${destRow} - Shelves ${destShelf} - Level ${destLevel}`;

    const newSourceQty = currentQty - qtyToTransfer;
    let sourceChanged = false;
    try {
      // The conditional update prevents two concurrent transfers from both
      // spending the same units. A database RPC can make this fully atomic;
      // this guarded update plus compensation is safe for existing installs.
      if (isConnectedToSupabase && supabase) {
        const { data: decremented, error: decrementError } = await supabase
          .from('products')
          .update({ qty: newSourceQty, last_modified_by: modifiedBy || 'Stockman Transfer' })
          .eq('id', sourceId)
          .gte('qty', qtyToTransfer)
          .select('id,qty')
          .single();
        if (decrementError || !decremented) throw new Error(decrementError ? decrementError.message : 'Source stock changed; please retry.');
      } else {
        await module.exports.updateProduct(sourceId, { qty: newSourceQty, modifiedBy: modifiedBy || 'Stockman Transfer' });
      }
      sourceChanged = true;

      const existingLocs = await module.exports.getProductsByLocation({ loc: cleanDestLoc });
      const targetDestRow = existingLocs.find(p =>
        (p.barcode && source.barcode && p.barcode.toLowerCase() === source.barcode.toLowerCase()) ||
        (p.stock_no && source.stock_no && p.stock_no.toLowerCase() === source.stock_no.toLowerCase())
      );

      if (targetDestRow) {
        const existingDestQty = parseInt(targetDestRow.qty, 10) || 0;
        await module.exports.updateProduct(targetDestRow.id, {
          qty: existingDestQty + qtyToTransfer,
          modifiedBy: modifiedBy || 'Stockman Transfer'
        });
      } else {
        await module.exports.createProduct({
          barcode: source.barcode,
          stock_no: source.stock_no,
          product_name: source.product_name,
          category: source.category,
          department: source.department,
          floor: destFloor,
          row: destRow,
          shelf: destShelf,
          level: destLevel,
          loc: cleanDestLoc,
          storage_location: destLocFull,
          qty: qtyToTransfer,
          status: 'MAPPED',
          custom: true,
          last_modified_by: modifiedBy || 'Stockman Transfer'
        });
      }
    } catch (err) {
      if (sourceChanged) {
        try {
          if (isConnectedToSupabase && supabase) {
            await supabase.from('products').update({ qty: currentQty }).eq('id', sourceId).eq('qty', newSourceQty);
          } else {
            await module.exports.updateProduct(sourceId, { qty: currentQty, modifiedBy: 'Transfer rollback' });
          }
        } catch (rollbackError) {
          throw new Error(`Transfer failed and rollback also failed: ${err.message}; ${rollbackError.message}`);
        }
      }
      throw new Error(`Transfer failed: ${err.message}`);
    }

    return { success: true, message: `Transferred ${qtyToTransfer} units to location ${cleanDestLoc}` };
  },
  getStats: async () => {
    const isMappedRow = p => (p.status || '').toUpperCase() === 'MAPPED' || p.floor || p.row || p.shelf;
    // A SKU's identity is its barcode (falling back to stock_no, then row id).
    // The same product legitimately appears in several rows — one per shelf
    // location — so stats must count distinct SKUs, not physical rows;
    // registering one more location for an item must not inflate the total.
    const skuKey = p => {
      const b = (p.barcode || '').toString().trim().toLowerCase();
      if (b) return 'b:' + b;
      const s = (p.stock_no || p.stock_code || '').toString().trim().toLowerCase();
      if (s) return 's:' + s;
      return 'id:' + p.id;
    };
    try {
      const all = await module.exports.getAllProducts();
      const skuMapped = new Map(); // skuKey -> true if any of its rows is mapped
      let customCount = 0;
      for (const p of all) {
        skuMapped.set(skuKey(p), (skuMapped.get(skuKey(p)) === true) || isMappedRow(p));
        if (p.custom) customCount++;
      }
      const total = skuMapped.size;
      let mappedCount = 0;
      for (const mapped of skuMapped.values()) if (mapped) mappedCount++;
      return {
        total,
        customCount,
        mappedCount,
        unmappedCount: total - mappedCount,
        isSupabase: Boolean(isConnectedToSupabase && supabase)
      };
    } catch (e) {
      console.warn('getStats distinct-SKU computation failed, falling back to row counts:', e.message);
    }
    if (isConnectedToSupabase && supabase) {
      const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: customCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('custom', true);
      return { total: total || 0, customCount: customCount || 0, isSupabase: true };
    }
    const mappedCount = memoryProducts.filter(isMappedRow).length;
    return {
      total: memoryProducts.length,
      customCount: memoryProducts.filter(p => p.custom).length,
      mappedCount,
      unmappedCount: memoryProducts.length - mappedCount,
      isSupabase: false
    };
  },
  resetProductLocation: async (id) => {
    invalidateAllProductsCache();
    if (isConnectedToSupabase && supabase) {
      const updatePayload = {
        floor: null,
        row: null,
        shelf: null,
        level: null,
        loc: null,
        location_storage: null,
        qty: 0,
        status: 'UNMAPPED'
      };

      const { data: updated, error } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      if (updated) {
        const idx = memoryProducts.findIndex(p => String(p.id) === String(id));
        if (idx !== -1) {
          memoryProducts[idx] = { ...memoryProducts[idx], ...updated };
        }
        return normalizeProduct(updated);
      }
    }

    const idx = memoryProducts.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      memoryProducts[idx].floor = null;
      memoryProducts[idx].row = null;
      memoryProducts[idx].batch = null;
      memoryProducts[idx].shelf = null;
      memoryProducts[idx].level = null;
      memoryProducts[idx].loc = null;
      memoryProducts[idx].location_storage = null;
      memoryProducts[idx].storage_location = null;
      memoryProducts[idx].loc_full = null;
      memoryProducts[idx].is_carton = false;
      memoryProducts[idx].loc_type = 'SHELF';
      memoryProducts[idx].qty = 0;
      memoryProducts[idx].status = 'UNMAPPED';
      return normalizeProduct(memoryProducts[idx]);
    }
    return null;
  },
  resetAllProducts: async () => {
    invalidateAllProductsCache();
    let count = 0;

    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({
          floor: null,
          row: null,
          shelf: null,
          level: '0',
          loc: null,
          location_storage: null,
          qty: 0,
          status: 'UNMAPPED',
          last_modified_by: 'Admin Reset'
        })
        .neq('id', 0)
        .select('id');

      if (error) throw new Error(error.message);
      count = data ? data.length : 0;
    }

    if (Array.isArray(memoryProducts)) {
      memoryProducts.forEach(p => {
        p.floor = null;
        p.row = null;
        p.batch = null;
        p.shelf = null;
        p.level = null;
        p.loc = null;
        p.location_storage = null;
        p.storage_location = null;
        p.loc_full = null;
        p.qty = 0;
        p.status = 'UNMAPPED';
        p.last_modified_by = 'Admin Reset';
      });
      if (!count) count = memoryProducts.length;
    }

    // Also update seed-data.json if exists
    if (fs.existsSync(seedPath)) {
      try {
        const raw = fs.readFileSync(seedPath, 'utf8');
        const items = JSON.parse(raw);
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
      } catch (e) {
        console.warn('Could not update seed-data.json during reset:', e.message);
      }
    }

    return { success: true, count };
  }
};
