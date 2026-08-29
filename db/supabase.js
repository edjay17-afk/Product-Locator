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
const SEARCH_CACHE_TTL_MS = 15000;
const STATS_CACHE_TTL_MS = 30000;
const searchCache = new Map();
let statsCache = { data: null, time: 0 };
const SEARCH_INDEX_COLUMNS = 'id,barcode,barcode_2,stock_no,product_name,category,department,floor,row,shelf,level,loc,location_storage,qty,on_hand_qty,unaccounted_qty,not_located_qty,system_on_hand_updated_at,status,custom,last_modified_by';
const SEARCH_INDEX_TTL_MS = 300000;
let searchIndexCache = { data: null, time: 0 };
let searchIndexPromise = null;
// Only the columns the app actually uses — keeps the Supabase transfer small.
const PRODUCT_COLUMNS = 'id,barcode,barcode_2,stock_no,product_name,category,department,floor,row,shelf,level,loc,location_storage,qty,on_hand_qty,unaccounted_qty,not_located_qty,system_on_hand_updated_at,status,custom,last_modified_by,created_at';
function invalidateAllProductsCache() {
  allProductsCache.time = 0;
  searchIndexCache.time = 0;
  searchCache.clear();
  statsCache.time = 0;
}

function escapePostgrestValue(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// Adds `signedDelta` (positive or negative, floored at 0) to a persisted
// audit counter column for every row sharing a barcode/stock_no (same sync
// convention as on_hand_qty), so the running total reads the same for any
// staff member regardless of which of the product's locations they're
// looking at. Shared by recordNotLocatedIncrease / drainNotLocated
// (not_located_qty) and recordUnaccountedIncrease (unaccounted_qty) via
// incrementSkuCounter and drainSkuCounter below. `extraFromRows(rows)`, when
// given, computes additional columns to set in the same update from the
// fetched sibling rows (used to also decrement on_hand_qty for Unaccounted).
async function adjustSkuCounter({ barcode, stockNo, column, signedDelta, modifiedBy, timestamp, extraFromRows }) {
  invalidateAllProductsCache();
  const amount = Number.parseInt(signedDelta, 10);
  if (!Number.isInteger(amount) || amount === 0) return null;
  const barcodeTrim = (barcode || '').trim();
  const stockTrim = (stockNo || '').trim();
  if (!barcodeTrim && !stockTrim) return null;
  const updatedAt = timestamp || new Date().toISOString();
  const modifier = modifiedBy || 'Stockman';

  if (isConnectedToSupabase && supabase) {
    const safeBar = escapePostgrestValue(barcodeTrim);
    const safeStock = escapePostgrestValue(stockTrim);
    let siblingQuery = supabase.from('products').select(`id,${column},on_hand_qty`);
    siblingQuery = safeBar && safeStock
      ? siblingQuery.or(`barcode.eq."${safeBar}",stock_no.eq."${safeStock}"`)
      : (safeBar ? siblingQuery.eq('barcode', safeBar) : siblingQuery.eq('stock_no', safeStock));
    const { data: rows, error: rowsErr } = await siblingQuery;
    if (rowsErr) throw new Error(rowsErr.message);
    if (!rows || !rows.length) return null;

    const current = Math.max(0, ...rows.map(r => Number.parseInt(r[column], 10) || 0));
    const next = Math.max(0, current + amount);
    const updatePayload = { [column]: next, last_modified_by: modifier, system_on_hand_updated_at: updatedAt };
    if (extraFromRows) Object.assign(updatePayload, extraFromRows(rows));

    let query = supabase.from('products').update(updatePayload);
    query = safeBar && safeStock
      ? query.or(`barcode.eq."${safeBar}",stock_no.eq."${safeStock}"`)
      : (safeBar ? query.eq('barcode', safeBar) : query.eq('stock_no', safeStock));
    const { error } = await query;
    if (error) throw new Error(error.message);
    return { [column]: next, on_hand_qty: 'on_hand_qty' in updatePayload ? updatePayload.on_hand_qty : null };
  }

  const matches = memoryProducts.filter(p => (barcodeTrim && p.barcode === barcodeTrim) || (stockTrim && p.stock_no === stockTrim));
  if (!matches.length) return null;
  const current = Math.max(0, ...matches.map(p => Number.parseInt(p[column], 10) || 0));
  const next = Math.max(0, current + amount);
  const extra = extraFromRows ? extraFromRows(matches) : {};
  matches.forEach(p => {
    p[column] = next;
    p.last_modified_by = modifier;
    p.system_on_hand_updated_at = updatedAt;
    Object.assign(p, extra);
  });
  return { [column]: next, on_hand_qty: 'on_hand_qty' in extra ? extra.on_hand_qty : null };
}

// amount must be positive — grows the counter.
function incrementSkuCounter({ delta, ...rest }) {
  const amount = Number.parseInt(delta, 10);
  if (!Number.isInteger(amount) || amount <= 0) return null;
  return adjustSkuCounter({ ...rest, signedDelta: amount });
}

// amount must be positive — shrinks the counter (floored at 0).
function drainSkuCounter({ delta, ...rest }) {
  const amount = Number.parseInt(delta, 10);
  if (!Number.isInteger(amount) || amount <= 0) return null;
  return adjustSkuCounter({ ...rest, signedDelta: -amount });
}

const SEARCHABLE_PRODUCT_FIELDS = [
  'product_name', 'barcode', 'barcode_2', 'stock_no', 'category', 'department'
];

function searchTermVariants(token) {
  const stripped = token.replace(/^0+/, '');
  return Array.from(new Set([
    token,
    stripped,
    ...(SEARCH_SYNONYMS[token] || [])
  ].filter(Boolean)));
}

let memoryUsers = [
  { id: 0, username: 'stockman', password: hashPassword('stockmanpassword'), full_name: 'Stockman', role: 'stockman' },
  { id: 1, username: 'stockman1', password: hashPassword('password123'), full_name: 'Juan Dela Cruz', role: 'stockman' },
  { id: 2, username: 'stockman2', password: hashPassword('password123'), full_name: 'Pedro Santos', role: 'stockman' },
  { id: 3, username: 'checker1', password: hashPassword('password123'), full_name: 'Maria Santos', role: 'checker' },
  { id: 4, username: 'checker2', password: hashPassword('password123'), full_name: 'Alex Reyes', role: 'checker' },
  { id: 5, username: 'admin', password: hashPassword('ubestpassword'), full_name: 'Warehouse Supervisor', role: 'admin' }
];
let memoryAdminNotifications = [];
let nextAdminNotificationId = 1;

function normalizeProduct(p) {
  if (!p) return p;
  const product_name = (p.product_name && String(p.product_name).trim()) ? String(p.product_name).trim() : ((p.name && String(p.name).trim()) ? String(p.name).trim() : (p.n || ''));
  const stock_no = (p.stock_no && String(p.stock_no).trim()) ? String(p.stock_no).trim() : ((p.stock_code && String(p.stock_code).trim()) ? String(p.stock_code).trim() : (p.s || ''));
  const department = (p.department && String(p.department).trim()) ? String(p.department).trim() : ((p.subcategory && String(p.subcategory).trim()) ? String(p.subcategory).trim() : (p.sc || ''));
  const row = p.row !== undefined && p.row !== null ? String(p.row) : (p.batch !== undefined && p.batch !== null ? String(p.batch) : '');
  const storage_location = p.location_storage !== undefined && p.location_storage !== null ? String(p.location_storage) : (p.storage_location !== undefined && p.storage_location !== null ? String(p.storage_location) : (p.loc_full !== undefined && p.loc_full !== null ? String(p.loc_full) : (p.locFull || '')));
  const is_carton = Boolean(p.is_carton || p.loc_type === 'CARTON' || (storage_location && (storage_location.includes('Carton') || storage_location.includes('Big Item'))));
  const loc_type = is_carton ? 'CARTON' : (p.loc_type || 'SHELF');
  const system_on_hand_updated_at = p.system_on_hand_updated_at || p.systemOnHandUpdatedAt || null;
  const onHandRaw = p.on_hand_qty !== undefined ? p.on_hand_qty : p.onHandQty;
  const onHandParsed = Number.parseInt(onHandRaw, 10);
  const on_hand_qty = Number.isInteger(onHandParsed) ? onHandParsed : null;
  const notLocatedRaw = p.not_located_qty !== undefined ? p.not_located_qty : p.notLocatedQty;
  const notLocatedParsed = Number.parseInt(notLocatedRaw, 10);
  const not_located_qty = Number.isInteger(notLocatedParsed) ? notLocatedParsed : 0;
  const unaccountedRaw = p.unaccounted_qty !== undefined ? p.unaccounted_qty : p.unaccountedQty;
  const unaccountedParsed = Number.parseInt(unaccountedRaw, 10);
  const unaccounted_qty = Number.isInteger(unaccountedParsed) ? unaccountedParsed : 0;
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
    loc_type,
    system_on_hand_updated_at,
    on_hand_qty,
    not_located_qty,
    unaccounted_qty
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
  getSupabaseClient: () => supabase,
  isSupabaseConnected: () => isConnectedToSupabase,
  // Authentication & Users API
  loginUser: async (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const fastLocalAccount = ['stockman', 'admin'].includes(cleanUser)
      ? memoryUsers.find(user => user.username === cleanUser)
      : null;

    // These explicitly configured local accounts must remain fast and usable
    // even when the remote user store is slow or temporarily unreachable.
    if (fastLocalAccount && verifyPassword(cleanPass, fastLocalAccount.password).valid) {
      const { password: _password, ...safeLocalAccount } = fastLocalAccount;
      return safeLocalAccount;
    }

    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, full_name, role, password')
        .eq('username', cleanUser)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.warn('Remote user login unavailable; using local account fallback:', error.message);
      } else if (data) {
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
        return null;
      } else {
        return null;
      }
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
  updateUserRole: async (id, role) => {
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', id)
        .select('id, username, full_name, role, created_at')
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
    const user = memoryUsers.find(item => String(item.id) === String(id));
    if (!user) throw new Error('User not found.');
    user.role = role;
    const { password, ...safeUser } = user;
    return safeUser;
  },
  createAdminNotification: async (notification) => {
    const row = {
      action: String(notification.action || 'ACTIVITY'),
      title: String(notification.title || 'Warehouse activity'),
      detail: String(notification.detail || ''),
      product_name: String(notification.product_name || ''),
      sku_key: String(notification.sku_key || ''),
      location: String(notification.location || ''),
      qty: Number.isFinite(Number(notification.qty)) ? Number(notification.qty) : 0,
      actor_name: String(notification.actor_name || 'Warehouse staff')
    };
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase.from('admin_notifications').insert([row]).select('*').single();
      if (!error && data) return data;
      // Notifications must never be lost merely because Supabase is briefly
      // unavailable or the new table is awaiting its first schema install.
      if (error) console.warn('Admin notification database write unavailable:', error.message);
    }
    const saved = { id: nextAdminNotificationId++, ...row, created_at: new Date().toISOString() };
    memoryAdminNotifications.unshift(saved);
    memoryAdminNotifications = memoryAdminNotifications.slice(0, 500);
    return saved;
  },
  getAdminNotifications: async (limit = 120) => {
    const safeLimit = Math.max(1, Math.min(500, Number.parseInt(limit, 10) || 120));
    if (isConnectedToSupabase && supabase) {
      const { data, error } = await supabase.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(safeLimit);
      if (!error) return data || [];
      if (error) console.warn('Admin notification database read unavailable:', error.message);
    }
    return memoryAdminNotifications.slice(0, safeLimit);
  },

  getSystemStockUpdates: async ({ search = '', page = 1, limit = 100 } = {}) => {
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.max(25, Math.min(200, Number.parseInt(limit, 10) || 100));
    const tokens = String(search || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    let products = await module.exports.getAllProducts();
    if (tokens.length) {
      products = products.filter(product => {
        const text = `${product.product_name || product.name || ''} ${product.barcode || ''} ${product.stock_no || product.stock_code || ''}`.toLowerCase();
        return tokens.every(token => text.includes(token));
      });
    }
    products.sort((a, b) => {
      const aTime = a.system_on_hand_updated_at ? new Date(a.system_on_hand_updated_at).getTime() : 0;
      const bTime = b.system_on_hand_updated_at ? new Date(b.system_on_hand_updated_at).getTime() : 0;
      return bTime - aTime || String(a.product_name || '').localeCompare(String(b.product_name || ''));
    });
    const total = products.length;
    const start = (safePage - 1) * safeLimit;
    return { total, page: safePage, limit: safeLimit, products: products.slice(start, start + safeLimit) };
  },

  getSystemStockHealth: async () => {
    const products = await module.exports.getAllProducts();
    const now = Date.now();
    const health = { total: products.length, fresh: 0, delayed: 0, stale: 0, missing: 0 };
    for (const product of products) {
      const updatedAt = product.system_on_hand_updated_at;
      const timestamp = updatedAt ? new Date(updatedAt).getTime() : NaN;
      if (!Number.isFinite(timestamp)) health.missing += 1;
      else if (now - timestamp > 72 * 60 * 60 * 1000) health.stale += 1;
      else if (now - timestamp > 24 * 60 * 60 * 1000) health.delayed += 1;
      else health.fresh += 1;
    }
    return health;
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
  // Compact catalog used by the browser for zero-network autocomplete after
  // the initial warm-up. Keep this separate from the full admin/export cache.
  getSearchIndex: async () => {
    if (isConnectedToSupabase && supabase) {
      const now = Date.now();
      if (searchIndexCache.data && now - searchIndexCache.time < SEARCH_INDEX_TTL_MS) {
        return searchIndexCache.data;
      }
      if (searchIndexPromise) return searchIndexPromise;

      searchIndexPromise = (async () => {
        const PAGE = 1000;
        const MAX_ROWS = 200000;
        const CONCURRENCY = 8;
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
              supabase.from('products').select(SEARCH_INDEX_COLUMNS)
                .order('id', { ascending: true }).range(from, from + PAGE - 1)
                .then(({ data, error }) => {
                  if (error) throw new Error(error.message);
                  return data || [];
                })
            );
          }
          for (const rows of await Promise.all(batch)) all.push(...rows);
        }

        const mapped = all.map(normalizeProduct);
        searchIndexCache = { data: mapped, time: Date.now() };
        return mapped;
      })();

      try {
        return await searchIndexPromise;
      } catch (err) {
        console.warn('getSearchIndex Supabase error:', err.message);
        if (searchIndexCache.data) return searchIndexCache.data;
        throw err;
      } finally {
        searchIndexPromise = null;
      }
    }
    return memoryProducts.map(normalizeProduct);
  },
  searchProducts: async (query, limit = 20) => {
    const q = (query || '').trim();
    if (!q) return [];
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);

    if (isConnectedToSupabase && supabase) {
      const cacheKey = `${q.toLowerCase()}::${limit}`;
      const cached = searchCache.get(cacheKey);
      if (cached && Date.now() - cached.time < SEARCH_CACHE_TTL_MS) {
        return cached.data;
      }

      // Scanner searches are usually barcode/stock-number lookups. Try an
      // exact indexed query first so they do not pay for a table-wide search.
      // Only use the exact lookup for a single token. A multi-token query
      // such as "809 basket" must be evaluated token-by-token below.
      const likelyCode = tokens.length === 1 && (/\d/.test(q) || /[-_]/.test(q));
      if (likelyCode) {
        const qStripped = q.replace(/^0+/, '');
        const exactValues = Array.from(new Set([q, qStripped].filter(Boolean)))
          .map(escapePostgrestValue);
        const exactOr = exactValues.flatMap(value => [
          `barcode.eq."${value}"`,
          `barcode_2.eq."${value}"`,
          `stock_no.eq."${value}"`
        ]).join(',');
        const { data: exactData, error: exactError } = await supabase
          .from('products')
          .select(PRODUCT_COLUMNS)
          .or(exactOr)
          .order('status', { ascending: true })
          .order('id', { ascending: false })
          .limit(limit);

        if (exactError) throw new Error(exactError.message);
        if (exactData && exactData.length > 0) {
          const result = exactData.map(normalizeProduct);
          searchCache.set(cacheKey, { data: result, time: Date.now() });
          return result;
        }
      }

      // Each token gets its own OR group, so all words must be present in
      // the same product while each word can match any searchable field.
      let productQuery = supabase
        .from('products')
        .select(PRODUCT_COLUMNS);
      for (const token of tokens) {
        const clauses = searchTermVariants(token).flatMap(term => {
          const pattern = escapePostgrestValue(`%${term}%`);
          return SEARCHABLE_PRODUCT_FIELDS.map(field => `${field}.ilike."${pattern}"`);
        }).join(',');
        if (clauses) productQuery = productQuery.or(clauses);
      }

      const { data, error } = await productQuery
        .order('status', { ascending: true }) // 'MAPPED' comes before 'UNMAPPED'
        .order('id', { ascending: false })
        .limit(limit);

      if (error) throw new Error(error.message);
      if (data) {
        const result = data.map(normalizeProduct);
        searchCache.set(cacheKey, { data: result, time: Date.now() });
        return result;
      }
    }

    return memoryProducts.filter(p => {
      const searchableText = [
        p.product_name || p.name,
        p.barcode || p.b,
        p.barcode_2 || p.b2,
        p.stock_no || p.stock_code,
        p.category || p.c,
        p.department || p.subcategory || p.sc
      ].join(' ').toLowerCase();
      return tokens.every(token => searchTermVariants(token)
        .some(term => searchableText.includes(term)));
    }).slice(0, limit).map(normalizeProduct);
  },
  getPaginatedProducts: async ({ page = 1, limit = 25, search = '', status = 'ALL', floor = 'ALL' } = {}) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(500, Math.max(1, parseInt(limit, 10) || 25));

    if (isConnectedToSupabase && supabase) {
      let query = supabase
        .from('products')
        .select(PRODUCT_COLUMNS, { count: 'exact' });

      if (status === 'MAPPED') query = query.eq('status', 'MAPPED');
      if (status === 'UNMAPPED') query = query.neq('status', 'MAPPED');
      if (floor && floor !== 'ALL') query = query.eq('floor', String(floor));

      const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        const terms = Array.from(new Set([token, ...(SEARCH_SYNONYMS[token] || [])]));
        const clauses = terms.flatMap(term => {
          const pattern = escapePostgrestValue(`%${term}%`);
          return [
            `product_name.ilike."${pattern}"`,
            `barcode.ilike."${pattern}"`,
            `barcode_2.ilike."${pattern}"`,
            `stock_no.ilike."${pattern}"`,
            `category.ilike."${pattern}"`,
            `department.ilike."${pattern}"`
          ];
        }).join(',');
        if (clauses) query = query.or(clauses);
      }

      const from = (pageNum - 1) * pageSize;
      const { data, count, error } = await query
        .order('id', { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) throw new Error(error.message);

      const total = count || 0;
      return {
        products: (data || []).map(normalizeProduct),
        total,
        page: pageNum,
        totalPages: Math.max(1, Math.ceil(total / pageSize))
      };
    }

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
        .select(PRODUCT_COLUMNS)
        .or(`barcode.eq."${safeClean}",stock_no.eq."${safeClean}",barcode.eq."${safeStripped}",stock_no.eq."${safeStripped}"`)
        .limit(1);

      if (error) throw new Error(error.message);
      if (data && data.length > 0) return normalizeProduct(data[0]);

      // Fallback to ilike match if eq fails
      const { data: dataLike, error: errorLike } = await supabase
        .from('products')
        .select(PRODUCT_COLUMNS)
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
      system_on_hand_updated_at: data.system_on_hand_updated_at || data.systemOnHandUpdatedAt || null,
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
    if (data.on_hand_qty !== undefined || data.onHandQty !== undefined) {
      const rawOnHand = data.on_hand_qty !== undefined ? data.on_hand_qty : data.onHandQty;
      updatePayload.on_hand_qty = rawOnHand === null ? null : parseInt(rawOnHand, 10);
    }
    if (data.system_on_hand_updated_at !== undefined || data.systemOnHandUpdatedAt !== undefined) {
      updatePayload.system_on_hand_updated_at = data.system_on_hand_updated_at || data.systemOnHandUpdatedAt || null;
    }
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.custom !== undefined) updatePayload.custom = Boolean(data.custom);
    if (data.last_modified_by !== undefined || data.modifiedBy !== undefined) {
      updatePayload.last_modified_by = data.last_modified_by || data.modifiedBy || 'Stockman';
    }

    if (isConnectedToSupabase && supabase) {
      // Update the location row and propagate shared product metadata in
      // parallel. The old sequential requests added a full network round
      // trip to every details/location save.
      const primaryUpdate = supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id)
        .select(PRODUCT_COLUMNS)
        .single();

      let metadataSync = Promise.resolve({ error: null });
      const barcode = (bCode || '').trim();
      const stock_no = (sNo || '').trim();

      const shouldSyncMetadata = data.sync_product_metadata === true ||
        (data.sync_product_metadata === undefined && pName && (barcode || stock_no));
      if (shouldSyncMetadata && pName && (barcode || stock_no)) {
        const safeBar = escapePostgrestValue(barcode);
        const safeStock = escapePostgrestValue(stock_no);
        const syncData = { product_name: pName, custom: true };
        if (updatePayload.category !== undefined) syncData.category = updatePayload.category;
        if (updatePayload.department !== undefined) syncData.department = updatePayload.department;
        if (updatePayload.stock_no !== undefined) syncData.stock_no = stock_no;
        if (updatePayload.barcode !== undefined) syncData.barcode = barcode;

        let query = supabase.from('products').update(syncData);
        if (safeBar && safeStock) {
          query = query.or(`barcode.eq."${safeBar}",stock_no.eq."${safeStock}"`);
        } else if (safeBar) {
          query = query.eq('barcode', safeBar);
        } else {
          query = query.eq('stock_no', safeStock);
        }
        metadataSync = query;
      }

      const [{ data: updated, error }, { error: syncError }] = await Promise.all([primaryUpdate, metadataSync]);
      if (error) throw new Error(error.message);
      if (syncError) console.error('Failed to sync product metadata to other locations:', syncError.message);
      if (updated) return normalizeProduct(updated);
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
  // Adjusts the SKU-level on-hand total independently of any shelf's qty.
  // Resolves one anchor row (by id, or by barcode/stock text search), applies
  // either a delta or an absolute targetQty to it, then syncs the resulting
  // on_hand_qty to every other row sharing that barcode/stock_no so the total
  // reads the same no matter which of the product's locations is displayed.
  adjustOnHandQuantity: async ({ id, sku, delta, targetQty, modifiedBy, timestamp }) => {
    invalidateAllProductsCache();
    // A stale client cache can send an id from before the row was recreated
    // (e.g. re-mapped/re-added). Fall back to barcode/stock lookup rather
    // than failing outright when the id no longer matches any row.
    const anchor = (id && await module.exports.getProductById(id))
      || await module.exports.getProductByBarcodeOrStock(sku);
    if (!anchor) throw new Error('Product not found.');

    const barcode = (anchor.barcode || '').trim();
    const stock_no = (anchor.stock_no || '').trim();
    const updatedAt = timestamp || new Date().toISOString();
    const modifier = modifiedBy || 'Stockman';

    // A product can occupy more than one shelf row. Until on_hand_qty has
    // been set (first-ever adjustment), the caller's baseline for "current"
    // on-hand is the SUM of qty across every row for this SKU — not just
    // this one row's qty — so the delta lands on the right total.
    let currentOnHand;
    if (Number.isInteger(anchor.on_hand_qty)) {
      currentOnHand = anchor.on_hand_qty;
    } else if (isConnectedToSupabase && supabase && (barcode || stock_no)) {
      const safeBar = escapePostgrestValue(barcode);
      const safeStock = escapePostgrestValue(stock_no);
      let siblingQuery = supabase.from('products').select('qty');
      siblingQuery = safeBar && safeStock
        ? siblingQuery.or(`barcode.eq."${safeBar}",stock_no.eq."${safeStock}"`)
        : (safeBar ? siblingQuery.eq('barcode', safeBar) : siblingQuery.eq('stock_no', safeStock));
      const { data: siblingRows, error: siblingErr } = await siblingQuery;
      if (siblingErr) throw new Error(siblingErr.message);
      currentOnHand = (siblingRows || []).reduce((sum, row) => sum + (Number.parseInt(row.qty, 10) || 0), 0);
    } else if (!isConnectedToSupabase) {
      currentOnHand = memoryProducts
        .filter(p => String(p.id) === String(anchor.id) || (barcode && p.barcode === barcode) || (stock_no && p.stock_no === stock_no))
        .reduce((sum, p) => sum + (Number.parseInt(p.qty, 10) || 0), 0);
    } else {
      currentOnHand = Number.parseInt(anchor.qty, 10) || 0;
    }

    const nextOnHand = Number.isInteger(delta) ? currentOnHand + delta : Number.parseInt(targetQty, 10);
    if (!Number.isInteger(nextOnHand) || nextOnHand < 0) {
      throw new Error('On-hand quantity must be a non-negative whole number.');
    }

    if (isConnectedToSupabase && supabase) {
      const primaryUpdate = supabase
        .from('products')
        .update({ on_hand_qty: nextOnHand, last_modified_by: modifier, system_on_hand_updated_at: updatedAt })
        .eq('id', anchor.id)
        .select(PRODUCT_COLUMNS)
        .single();

      let siblingSync = Promise.resolve({ error: null });
      if (barcode || stock_no) {
        const safeBar = escapePostgrestValue(barcode);
        const safeStock = escapePostgrestValue(stock_no);
        let query = supabase
          .from('products')
          .update({ on_hand_qty: nextOnHand, last_modified_by: modifier, system_on_hand_updated_at: updatedAt })
          .neq('id', anchor.id);
        query = safeBar && safeStock
          ? query.or(`barcode.eq."${safeBar}",stock_no.eq."${safeStock}"`)
          : (safeBar ? query.eq('barcode', safeBar) : query.eq('stock_no', safeStock));
        siblingSync = query;
      }

      const [{ data: updated, error }, { error: syncError }] = await Promise.all([primaryUpdate, siblingSync]);
      if (error) throw new Error(error.message);
      if (syncError) console.error('Failed to sync on-hand quantity to other locations:', syncError.message);
      return {
        ...normalizeProduct(updated),
        // Keep the pre-adjustment total available to the API layer so audit
        // counters are based on the value actually changed in the database.
        previous_on_hand_qty: currentOnHand
      };
    }

    memoryProducts.forEach(p => {
      const matchesId = String(p.id) === String(anchor.id);
      const matchesBarcode = barcode && p.barcode === barcode;
      const matchesStock = stock_no && p.stock_no === stock_no;
      if (matchesId || matchesBarcode || matchesStock) {
        p.on_hand_qty = nextOnHand;
        p.last_modified_by = modifier;
        p.system_on_hand_updated_at = updatedAt;
      }
    });
    const item = memoryProducts.find(p => String(p.id) === String(anchor.id));
    return {
      ...normalizeProduct(item),
      previous_on_hand_qty: currentOnHand
    };
  },
  // Logs units added to On Hand via a Quick Inventory Count "New Quantity"
  // that exceeded the prior On Hand total (see the ON_HAND branch of
  // POST /api/inventory/:sku/quick-adjustment). Persisted and synced across
  // every row sharing barcode/stock_no so it reads the same for any staff
  // member. Purely a record of what's been counted but not yet given a
  // shelf address — never subtracted from any other total.
  recordNotLocatedIncrease: async ({ barcode, stockNo, delta, modifiedBy, timestamp }) => incrementSkuCounter({
    barcode, stockNo, delta, modifiedBy, timestamp,
    column: 'not_located_qty'
  }),
  // Stock that was behind a Not Located total just got a shelf address (a
  // mapped location's qty was raised via Edit or Add Stock). Drains
  // not_located_qty by that same rise, floored at 0, so the figure tracks
  // "still needs a home" rather than growing forever.
  drainNotLocated: async ({ barcode, stockNo, delta, modifiedBy, timestamp }) => drainSkuCounter({
    barcode, stockNo, delta, modifiedBy, timestamp,
    column: 'not_located_qty'
  }),
  // Logs units removed from a mapped shelf location via a manual qty
  // decrease in Product Details & Location's Edit form (e.g. editing
  // 1272 -> 1270). Purely an audit trail, shown to staff as "Unaccounted":
  // increments unaccounted_qty by the drop amount for this SKU, synced
  // across every row sharing barcode/stock_no, so staff can see cumulative
  // shrinkage even after On Hand and Actual On Hand reconcile. Also
  // decrements on_hand_qty by the same amount, but only when it was already
  // independently tracked (non-null) — otherwise on_hand_qty stays null and
  // keeps auto-following the live shelf sum, so the drop is never
  // subtracted twice.
  recordUnaccountedIncrease: async ({ barcode, stockNo, delta, modifiedBy, timestamp }) => incrementSkuCounter({
    barcode, stockNo, delta, modifiedBy, timestamp,
    column: 'unaccounted_qty',
    extraFromRows: rows => {
      const onHandValues = rows.map(r => Number.parseInt(r.on_hand_qty, 10)).filter(Number.isInteger);
      if (!onHandValues.length) return {};
      const drop = Number.parseInt(delta, 10) || 0;
      return { on_hand_qty: Math.max(0, Math.max(...onHandValues) - drop) };
    }
  }),
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
      const cleanItem = {
        barcode,
        stock_no,
        product_name: name,
        category: data.category || 'Uncategorized',
        department: data.department || '',
        barcode_2: (data.barcode_2 || '').toString().trim()
      };
      const systemUpdatedAt = data.system_on_hand_updated_at || data.systemOnHandUpdatedAt;
      if (systemUpdatedAt) cleanItem.system_on_hand_updated_at = systemUpdatedAt;
      clean.push(cleanItem);
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
    // A SKU's identity is its primary barcode (falling back to stock_no, then
    // row id). Product name and location fields are deliberately excluded:
    // the same item may have several location rows, and metadata can vary
    // slightly between imports without creating a new SKU.
    // The same product legitimately appears in several rows — one per shelf
    // location — so stats must count distinct SKUs, not physical rows;
    // registering one more location for an item must not inflate the total.
    const skuKey = p => {
      const b = (p.barcode || '').toString().trim().toLowerCase();
      const s = (p.stock_no || p.stock_code || '').toString().trim().toLowerCase();
      const identity = b || s;
      if (identity) return 'sku:' + identity;
      return 'id:' + p.id;
    };
    const rollupSkuStats = rows => {
      const skuMap = new Map();
      for (const p of rows || []) {
        const key = skuKey(p);
        const current = skuMap.get(key);
        skuMap.set(key, {
          mapped: Boolean(current && current.mapped) || Boolean(isMappedRow(p)),
          custom: Boolean(current && current.custom) || Boolean(p.custom)
        });
      }
      let mappedCount = 0;
      let customCount = 0;
      for (const value of skuMap.values()) {
        if (value.mapped) mappedCount++;
        if (value.custom) customCount++;
      }
      return {
        total: skuMap.size,
        customCount,
        mappedCount,
        unmappedCount: Math.max(0, skuMap.size - mappedCount)
      };
    };
    if (isConnectedToSupabase && supabase) {
      const now = Date.now();
      if (statsCache.data && now - statsCache.time < STATS_CACHE_TTL_MS) return statsCache.data;

      // Prefer the exact distinct-SKU aggregate when the performance
      // migration has been applied. It runs inside PostgreSQL and returns a
      // tiny JSON object instead of downloading the whole catalog.
      // Use the versioned function so an older deployed RPC cannot return a
      // partial or different SKU count. Until v3 is installed, the complete
      // paged fallback below remains correct.
      const { data: aggregate, error: aggregateError } = await supabase.rpc('get_product_stats_v3');
      if (!aggregateError && aggregate) {
        statsCache = {
          data: {
            total: Number(aggregate.total) || 0,
            customCount: Number(aggregate.customCount) || 0,
            mappedCount: Number(aggregate.mappedCount) || 0,
            unmappedCount: Number(aggregate.unmappedCount) || 0,
            isSupabase: true
          },
          time: now
        };
        return statsCache.data;
      }

      // If the RPC migration is not installed yet, still count distinct SKUs
      // in the fallback. Counting table rows here would count every location
      // row as a separate SKU.
      // Reuse the paged catalog loader; a plain Supabase select is capped at
      // 1,000 rows and would silently produce the old ~983-SKU total.
      const statRows = await module.exports.getSearchIndex();
      const rolledUp = rollupSkuStats(statRows);
      statsCache = {
        data: {
          ...rolledUp,
          isSupabase: true
        },
        time: now
      };
      return statsCache.data;
    }
    const rolledUp = rollupSkuStats(memoryProducts);
    return {
      ...rolledUp,
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
        .maybeSingle();

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
