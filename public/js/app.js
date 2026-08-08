const TRANSLATIONS = {
  en: {
    brandEyebrow: "Warehouse Product Locator",
    appTitle: "Product Locator",
    appSub: "Find where a product goes, or add a new one",
    databaseConnected: "Database Connected",
    skusMapped: "SKUs mapped",
    loadingDb: "Loading database...",
    searchPlaceholder: "Type a barcode, item code, or product name…",
    scanBtn: "Scan",
    addBtn: "Add Product",
    rapidBtn: "Rapid Logger",
    uploadExcelBtn: "Upload Excel",
    recentHead: "Recent lookups",
    clearRecent: "clear",
    signIn: "Sign In",
    logout: "Logout",
    cancel: "Cancel",
    save: "Save",
    saveProduct: "Save Product",
    saveChanges: "Save Changes",
    addNewTitle: "Add a New Product",
    addNewSub: "Fill this in for a product that isn't in the system yet. Tell us its name and exactly where it sits on the shelf — that's what shows up next time someone searches for it.",
    barcodeLabel: "Barcode number",
    barcodeHint: "Scan it or type the numbers printed under the barcode. Leave blank if the item has no barcode.",
    prodNameLabel: "Product name",
    prodNameHint: "What is it? Write it the way you'd say it out loud, e.g. \"16oz plastic tumbler\".",
    prodNameLabelOptional: "Product Name (Optional)",
    itemCodeLabel: "Item / stock code",
    itemCodeHint: "The short code printed on the price tag, if it has one.",
    categoryLabel: "Category (optional)",
    subcategoryLabel: "Sub-category (optional)",
    storedLabel: "Where is it stored?",
    storedHint: "This is what tells the next person exactly where to find it on the shelf.",
    floorLabel: "Floor",
    rowLabel: "Row number",
    shelfLabel: "Shelf number",
    levelLabel: "Level (0 = bottom)",
    qtyLabel: "How many are on hand?",
    stockmanLabel: "Responsible Stockman",
    formError: "Please fill in Product Name, Stock Code, Row, Shelf, and On Hand Quantity.",
    detailsTitle: "Product Details & Location",
    detailsSub: "View details or update shelf position for this item in the database.",
    barcode: "Barcode",
    onHand: "On hand",
    editLocDetails: "Edit Location / Details",
    scanNewLoc: "Scan QR for New Location",
    rapidTitle: "Rapid Location Logger",
    rapidSub: "Quickly scan a product, scan its location QR, and save. Repeat for high-speed mapping.",
    rapidBarcodeLabel: "1. Scan / Type Product Barcode",
    rapidLocLabel: "2. Scan / Type Location (e.g. 1-02-01-03)",
    rapidQtyLabel: "3. Quantity On Hand",
    rapidSubmit: "Register & Next",
    rapidSuccessLog: "Last Registered Items (This Session)",
    rapidLocError: "Invalid location format. Expected format like '1-02-01-03'.",
    rapidSaved: "Location mapped successfully!",
    notFoundTitle: "Product Not Found",
    notFoundBtn: "Add Product",
    loginTitle: "Stockman Sign In",
    loginSub: "Warehouse Accountability Access",
    loginTip: "Sign in with your stockman profile to take responsibility for shelf location updates.",
    quickLoginTitle: "Quick Select Stockman Profile:",
    stockmanRole1: "Stockman 1",
    stockmanRole2: "Stockman 2",
    usernameLabel: "Username",
    passwordLabel: "Password",
    signInBtn: "Sign In as Stockman",
    floor1: "1st Floor",
    floor2: "2nd Floor",
    floor3: "3rd Floor",
    e1: "No product looked up yet",
    e2: "Tap \"Scan\" to use the camera, or type a barcode, item code, or name above. Don't see a product? Tap \"Add Product\" to save it and its shelf location."
  },
  zh: {
    brandEyebrow: "仓库商品定位系统",
    appTitle: "库位导航",
    appSub: "查找商品存放位置，或登记新商品",
    databaseConnected: "数据库已连接",
    skusMapped: "已登记库位商品数",
    loadingDb: "正在加载数据库...",
    searchPlaceholder: "输入条形码、商品编码或商品名称...",
    scanBtn: "扫码",
    addBtn: "添加商品",
    rapidBtn: "快速登记",
    uploadExcelBtn: "导入 Excel",
    recentHead: "最近查询",
    clearRecent: "清除历史",
    signIn: "登录",
    logout: "登出",
    cancel: "取消",
    save: "保存",
    saveProduct: "保存商品",
    saveChanges: "保存修改",
    addNewTitle: "添加新商品",
    addNewSub: "在此处登记系统中尚不存在的商品。输入商品名称及其准确存放库位，以便下次其他人可以轻松找到。",
    barcodeLabel: "条形码编号",
    barcodeHint: "扫描条码或手动输入条码下方的数字。若无条码则留空。",
    prodNameLabel: "商品名称",
    prodNameHint: "例如：\"16盎司塑料水杯\"，请使用通俗易懂的名称。",
    prodNameLabelOptional: "商品名称（可选）",
    itemCodeLabel: "货号 / 库存编码",
    itemCodeHint: "商品价格标签上印制的简短编码。",
    categoryLabel: "分类（可选）",
    subcategoryLabel: "子分类（可选）",
    storedLabel: "存放位置",
    storedHint: "这将准确指引下一个人在哪个货架上找到该商品。",
    floorLabel: "楼层",
    rowLabel: "通道 / 排号",
    shelfLabel: "货架号",
    levelLabel: "层数 (0 = 底层)",
    qtyLabel: "现有库存数量",
    stockmanLabel: "负责理货员",
    formError: "请填写商品名称、货号、通道号、货架号和现有库存数。",
    detailsTitle: "商品详情与库位",
    detailsSub: "在数据库中查看详情或更新商品货架位置。",
    barcode: "条形码",
    onHand: "现有库存",
    editLocDetails: "编辑库位 / 详情",
    scanNewLoc: "扫描二维码添加新位置",
    rapidTitle: "快速位置登记",
    rapidSub: "快速扫描商品条码，扫描库位二维码并保存。适合批量高速库位登记。",
    rapidBarcodeLabel: "1. 扫描 / 输入商品条形码",
    rapidLocLabel: "2. 扫描 / 输入库位 (例如 1-02-01-03)",
    rapidQtyLabel: "3. 现有库存数量",
    rapidSubmit: "登记并继续",
    rapidSuccessLog: "本次登记记录（最近5条）",
    rapidLocError: "库位格式错误。应为 '楼层-排号-货架号-层数' 格式（如 1-02-01-03）。",
    rapidSaved: "库位登记成功！",
    notFoundTitle: "未找到商品",
    notFoundBtn: "添加商品",
    loginTitle: "理货员登录",
    loginSub: "仓库责任制访问授权",
    loginTip: "使用理货员账户登录以对更新货架库位承担责任。",
    quickLoginTitle: "快速选择理货员账号:",
    stockmanRole1: "理货员 1",
    stockmanRole2: "理货员 2",
    usernameLabel: "用户名",
    passwordLabel: "密码",
    signInBtn: "理货员登录",
    floor1: "1楼",
    floor2: "2楼",
    floor3: "3楼",
    e1: "暂无查询记录",
    e2: "点击“扫码”使用相机，或在上方输入条码、货号、名称。如果商品不存在，点击“添加商品”保存商品及其货架位置。"
  }
};

let CURRENT_LANG = localStorage.getItem('wh_lang') || 'en';

let PRODUCTS = [];
let byBarcode = {};
let byStock = {};
let recent = [];
try {
  const saved = localStorage.getItem('wh_recent_lookups');
  if (saved) recent = JSON.parse(saved);
} catch (e) { recent = []; }

let currentUser = null;
try {
  const savedUser = localStorage.getItem('wh_current_user');
  if (savedUser) currentUser = JSON.parse(savedUser);
} catch (e) { currentUser = null; }

function updateUserUI() {
  const userBadge = document.getElementById('userBadge');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const authBtn = document.getElementById('authBtn');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const loginOverlay = document.getElementById('loginOverlay');
  const scanQrBtn = document.getElementById('scanLocationQrBtn');
  const rapidBtn = document.getElementById('rapidLoggerBtn');

  if (currentUser) {
    userBadge.style.display = 'flex';
    userNameDisplay.textContent = currentUser.full_name;
    authBtn.textContent = CURRENT_LANG === 'en' ? 'Logout' : '登出';
    authBtn.className = 'user-auth-btn logout';
    closeLoginModal.style.display = 'block';
    loginOverlay.classList.remove('show');
    if (activeProduct && scanQrBtn) {
      scanQrBtn.style.display = 'inline-flex';
    }
    if (rapidBtn) {
      rapidBtn.style.display = 'inline-flex';
    }
  } else {
    userBadge.style.display = 'none';
    closeLoginModal.style.display = 'none';
    document.getElementById('loginFormError').style.display = 'none';
    loginOverlay.classList.add('show');
    if (scanQrBtn) {
      scanQrBtn.style.display = 'none';
    }
    if (rapidBtn) {
      rapidBtn.style.display = 'none';
    }
  }
}

function updateLanguageUI() {
  const lang = CURRENT_LANG;
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      let textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.textContent = lang === 'en' ? '🇨🇳 中文' : '🇬🇧 English';
  }

  // Update dynamic lists
  if (activeProduct) {
    renderProduct(activeProduct);
  }
}

let activeProduct = null;

// Initialize app data from server database API
async function initApp() {
  updateUserUI();
  updateLanguageUI();
  
  document.getElementById('langToggleBtn').addEventListener('click', () => {
    CURRENT_LANG = CURRENT_LANG === 'en' ? 'zh' : 'en';
    localStorage.setItem('wh_lang', CURRENT_LANG);
    updateLanguageUI();
  });
  updateUserUI();

  document.getElementById('emptyState').style.display = 'block';
  document.getElementById('skeletonState').style.display = 'flex';
  document.getElementById('emptyPrompt').style.display = 'none';

  try {
    const [statsRes, productsRes] = await Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/products/all').then(r => r.json())
    ]);

    if (statsRes.success) {
      document.getElementById('skuStamp').textContent = `${statsRes.total} SKUs mapped`;
      document.getElementById('footerText').textContent = `Database Connected · ${statsRes.total} SKUs mapped`;
    }

    if (productsRes.success && Array.isArray(productsRes.products)) {
      PRODUCTS = productsRes.products;
      rebuildIndex();
      updateCategoryDatalist();
    }
  } catch (err) {
    console.warn('Network or API unavailable, operating in offline fallback mode if cached data exists.', err);
    document.getElementById('skuStamp').textContent = `Offline mode`;
  }

  document.getElementById('skeletonState').style.display = 'none';
  if (!activeProduct) {
    document.getElementById('emptyPrompt').style.display = 'flex';
  }
  renderRecent();
}

function rebuildIndex() {
  byBarcode = {};
  byStock = {};
  PRODUCTS.forEach(p => {
    if (p.barcode || p.b) {
      const b = (p.barcode || p.b).toString().trim().toLowerCase();
      if (b) byBarcode[b] = p;
    }
    if (p.stock_code || p.s) {
      const s = (p.stock_code || p.s).toString().trim().toLowerCase();
      if (s) byStock[s] = p;
    }
  });
}

function statusInfo(status) {
  if (!status) return { cls: 'neutral', label: 'No status' };
  const s = status.toUpperCase();
  if (s === 'DONE') return { cls: 'go', label: 'Verified' };
  if (s.includes('RECOUNT')) return { cls: 'warn', label: 'Needs recount' };
  if (s.includes('NOT FOUND') || s.includes('WRONG')) return { cls: 'bad', label: 'Flagged' };
  return { cls: 'neutral', label: status };
}

function getLocationsForProduct(product) {
  const barcode = (product.barcode || product.b || '').toString().trim().toLowerCase();
  const stockCode = (product.stock_code || product.s || '').toString().trim().toLowerCase();
  
  if (!barcode && !stockCode) return [product];
  
  const matched = PRODUCTS.filter(p => {
    const pBarcode = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const pStock = (p.stock_code || p.s || '').toString().trim().toLowerCase();
    
    if (barcode && pBarcode && barcode === pBarcode) return true;
    if (stockCode && pStock && stockCode === pStock) return true;
    return false;
  });
  
  return matched.length > 0 ? matched : [product];
}

async function fetchLocationsForProduct(product) {
  const barcode = (product.barcode || product.b || '').toString().trim().toLowerCase();
  const stockCode = (product.stock_code || product.s || '').toString().trim().toLowerCase();
  const q = barcode || stockCode;

  if (!q) return [product];

  try {
    const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=50`).then(r => r.json());
    if (res.success && Array.isArray(res.products) && res.products.length > 0) {
      const exact = res.products.filter(item => {
        const itemBarcode = (item.barcode || '').toString().trim().toLowerCase();
        const itemStock = (item.stock_code || '').toString().trim().toLowerCase();
        if (barcode && itemBarcode === barcode) return true;
        if (stockCode && itemStock === stockCode) return true;
        return false;
      });
      if (exact.length > 0) return exact;
    }
  } catch (e) {
    console.warn("Failed to fetch fresh locations, falling back to local cache:", e);
  }

  return getLocationsForProduct(product);
}

async function renderProduct(p) {
  activeProduct = p;
  document.getElementById('emptyState').style.display = 'none';
  const card = document.getElementById('tagCard');
  card.classList.add('show');
  document.getElementById('extraRow').style.display = 'flex';
  document.getElementById('cardActions').style.display = 'flex';

  const name = p.name || p.n || 'Unnamed item';
  const category = p.category || p.c || '—';
  const subcategory = p.subcategory || p.sc || '';

  document.getElementById('pName').textContent = name;
  document.getElementById('pCat').textContent = category;
  document.getElementById('pSub').textContent = subcategory + (p.custom ? '  •  Added by staff' : '');

  const barcode = p.barcode || p.b;
  const stockCode = p.stock_code || p.s;
  document.getElementById('pBarcode').textContent = barcode || (stockCode ? ('#' + stockCode) : '—');

  // Multi-location rendering (fresh fetch from DB)
  const locs = await fetchLocationsForProduct(p);
  const totalQty = locs.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
  document.getElementById('pQty').textContent = totalQty;

  const locationsList = document.getElementById('locationsList');
  locationsList.innerHTML = '';

  locs.forEach((item, index) => {
    const floor = item.floor !== undefined && item.floor !== null ? String(item.floor) : '';
    const batch = item.batch !== undefined && item.batch !== null ? String(item.batch) : (item.row || '');
    const shelf = item.shelf !== undefined && item.shelf !== null ? String(item.shelf) : '';
    const level = item.level !== undefined && item.level !== null ? String(item.level) : '';
    const hasLoc = floor !== '';
    
    const locFull = item.loc_full || item.locFull || (hasLoc ? `${floor}-${batch}-${shelf}-${level}` : 'Location not yet assigned');
    const st = statusInfo(item.status);
    const qtyVal = item.qty !== undefined && item.qty !== null ? item.qty : 0;
    const stockmanVal = item.last_modified_by || item.modifiedBy || 'System Import';

    const subCard = document.createElement('div');
    subCard.className = 'location-subcard';
    subCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="badge ${st.cls}" style="font-size: 11px; padding: 4px 8px;">${st.label}</span>
        <span style="font-family: var(--mono); font-size: 12.5px; color: var(--ink); font-weight: 600;">Qty: ${qtyVal}</span>
      </div>
      
      <div class="grid4" style="margin: 8px 0 12px 0;">
        <div class="cell"><div class="clabel">Floor</div><div class="cval">${hasLoc ? floor : '–'}</div></div>
        <div class="cell"><div class="clabel">Row</div><div class="cval">${hasLoc ? batch : '–'}</div></div>
        <div class="cell"><div class="clabel">Shelf</div><div class="cval">${hasLoc ? shelf : '–'}</div></div>
        <div class="cell"><div class="clabel">Level</div><div class="cval">${hasLoc ? level : '–'}</div></div>
      </div>
      
      <div style="font-size: 12.5px; color: var(--muted); margin-bottom: 12px; font-family: var(--body);">
        📍 ${locFull}
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--line); padding-top: 10px; font-size: 11.5px; color: var(--muted); margin-top: 6px;">
        <span>Stockman: <strong>${stockmanVal}</strong></span>
        <button class="user-auth-btn login" style="font-size: 11px; padding: 4px 10px; margin: 0; border-radius: 8px;" type="button" onclick="openEditFormForProductIndex(${index})">Edit Location</button>
      </div>
    `;
    locationsList.appendChild(subCard);
  });

  window.currentLocs = locs;

  const editBtn = document.getElementById('editProductBtn');
  const scanQrBtn = document.getElementById('scanLocationQrBtn');

  editBtn.style.display = 'none';

  if (currentUser) {
    scanQrBtn.style.display = 'inline-flex';
  } else {
    scanQrBtn.style.display = 'none';
  }

  if (navigator.vibrate) navigator.vibrate(60);

  // push to persistent recent lookups
  recent = recent.filter(r => (r.id ? r.id !== p.id : (r.barcode || r.b) !== (p.barcode || p.b)));
  recent.unshift(p);
  recent = recent.slice(0, 20); // Store up to 20 recent items
  try {
    localStorage.setItem('wh_recent_lookups', JSON.stringify(recent));
  } catch (e) {}

  renderRecent();
  hideResults();
}

function renderRecent() {
  const strip = document.getElementById('recentStrip');
  strip.innerHTML = '';
  if (recent.length === 0) {
    strip.innerHTML = '<div class="no-results" style="text-align:left;padding:2px;">Nothing looked up yet.</div>';
    return;
  }
  recent.forEach(p => {
    const div = document.createElement('div');
    div.className = 'recent-item';
    const name = p.name || p.n;
    const floor = p.floor !== undefined && p.floor !== null ? String(p.floor) : '';
    const batch = p.batch !== undefined && p.batch !== null ? String(p.batch) : (p.row || '');
    const shelf = p.shelf !== undefined && p.shelf !== null ? String(p.shelf) : '';
    const level = p.level !== undefined && p.level !== null ? String(p.level) : '';
    const loc = floor !== '' ? `${floor}-${batch}-${shelf}-${level}` : 'no location';

    div.innerHTML = `<span class="rin">${escapeHtml(name)}</span><span class="riloc">${loc}</span>`;
    div.onclick = () => renderProduct(p);
    strip.appendChild(div);
  });
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function hideResults() {
  const rl = document.getElementById('resultsList');
  rl.classList.remove('show');
  rl.innerHTML = '';
}

async function doSearch(q, isFinal = false) {
  q = q.trim().toLowerCase();
  if (!q) { hideResults(); return; }

  // 1. Instant local index lookup
  if (byBarcode[q]) {
    renderProduct(byBarcode[q]);
    document.getElementById('searchInput').value = '';
    return;
  }
  if (byStock[q]) {
    renderProduct(byStock[q]);
    document.getElementById('searchInput').value = '';
    return;
  }

  // Local substring search
  const localMatches = PRODUCTS.filter(p => {
    const barcode = (p.barcode || p.b || '').toString().toLowerCase();
    const stockCode = (p.stock_code || p.s || '').toString().toLowerCase();
    const name = (p.name || p.n || '').toLowerCase();
    return barcode.includes(q) || stockCode.includes(q) || name.includes(q);
  }).slice(0, 10);

  if (localMatches.length > 0) {
    renderMatches(localMatches);
    return;
  }

  // 2. Server API Search Fallback
  try {
    const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=10`).then(r => r.json());
    if (res.success && res.products.length > 0) {
      if (res.products.length === 1 && (res.products[0].barcode.toLowerCase() === q || res.products[0].stock_code.toLowerCase() === q)) {
        renderProduct(res.products[0]);
        document.getElementById('searchInput').value = '';
      } else {
        renderMatches(res.products);
      }
      return;
    }
  } catch (err) {
    console.error('API search failed:', err);
  }

  renderMatches([]);
  if (isFinal) {
    showNotFoundModal(document.getElementById('searchInput').value.trim());
  }
}

function renderMatches(matches) {
  const rl = document.getElementById('resultsList');
  rl.innerHTML = '';
  if (matches.length === 0) {
    rl.innerHTML = '<div class="no-results">No matching product in the database.</div>';
  } else {
    matches.forEach(p => {
      const row = document.createElement('div');
      row.className = 'result-row';
      const name = p.name || p.n;
      const barcode = p.barcode || p.b;
      const stockCode = p.stock_code || p.s;
      const floor = p.floor !== undefined && p.floor !== null ? String(p.floor) : '';
      const batch = p.batch !== undefined && p.batch !== null ? String(p.batch) : (p.row || '');
      const shelf = p.shelf !== undefined && p.shelf !== null ? String(p.shelf) : '';
      const level = p.level !== undefined && p.level !== null ? String(p.level) : '';
      const loc = floor !== '' ? `${floor}-${batch}-${shelf}-${level}` : '—';

      row.innerHTML = `<div><div class="rn">${escapeHtml(name)}</div><div class="rc">${escapeHtml(barcode || ('#' + stockCode))}</div></div><div class="rloc">${loc}</div>`;
      row.onclick = () => {
        renderProduct(p);
        document.getElementById('searchInput').value = '';
      };
      rl.appendChild(row);
    });
  }
  rl.classList.add('show');
}

// Event Listeners for Search & Upload
document.getElementById('searchInput').addEventListener('input', e => doSearch(e.target.value, false));
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch(e.target.value, true);
});

document.getElementById('clearRecent').addEventListener('click', () => {
  recent = [];
  activeProduct = null;
  try {
    localStorage.removeItem('wh_recent_lookups');
    localStorage.removeItem('wh_active_product');
  } catch (e) {}
  document.getElementById('tagCard').classList.remove('show');
  document.getElementById('emptyState').style.display = 'block';
  document.getElementById('skeletonState').style.display = 'none';
  document.getElementById('emptyPrompt').style.display = 'flex';
  renderRecent();
});

// Excel Upload Handler
document.getElementById('uploadExcelBtn').addEventListener('click', () => {
  document.getElementById('excelFileInput').click();
});

document.getElementById('excelFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  showToast('Reading Excel file in browser...');

  try {
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        if (typeof XLSX === 'undefined') {
          alert('XLSX library not loaded. Please refresh the page and try again.');
          return;
        }
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const extractNum = (str) => {
          if (typeof str === 'number') return String(str);
          if (!str) return '';
          const m = String(str).match(/(\d+)/);
          if (!m) return '';
          return m[1].length === 1 ? '0' + m[1] : m[1];
        };

        const cleanHtml = (str) => {
          if (!str) return '';
          return String(str).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        };

        const itemsToInsert = [];
        for (const r of rows) {
          const barcode = r[0] ? String(r[0]).trim() : '';
          const stock = r[1] ? String(r[1]).trim() : '';
          const name = cleanHtml(r[2] ? String(r[2]).trim() : '');
          if (!name || name === 'Unnamed Item') continue;

          const category = cleanHtml(r[3] ? String(r[3]).trim() : '');
          const subcategory = cleanHtml(r[4] ? String(r[4]).trim() : '');
          const locFull = r[5] ? cleanHtml(String(r[5]).trim()) : '';
          const floor = r[6] ? extractNum(r[6]).replace(/^0+/, '') : '';
          const batch = r[7] ? extractNum(r[7]) : '';
          const shelf = r[8] ? extractNum(r[8]) : '';
          const level = r[9] ? extractNum(r[9]) : '';
          const qty = typeof r[10] === 'number' ? r[10] : (parseInt(r[10], 10) || 0);
          const status = r[16] ? String(r[16]).trim() : '';

          const loc = (floor || batch || shelf) ? `${floor}-${batch}-${shelf}-${level || '00'}` : '';

          itemsToInsert.push({
            barcode,
            stock_code: stock,
            name,
            category,
            subcategory,
            floor,
            batch,
            shelf,
            level: level || '00',
            loc,
            loc_full: locFull || loc,
            qty,
            status
          });
        }

        showToast(`Parsed ${itemsToInsert.length} items! Uploading to database...`);

        const chunkSize = 500;
        let uploaded = 0;

        for (let i = 0; i < itemsToInsert.length; i += chunkSize) {
          const chunk = itemsToInsert.slice(i, i + chunkSize);
          const res = await fetch('/api/products/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: chunk })
          }).then(r => r.json());

          if (!res.success) {
            alert('Upload error: ' + (res.error || res.message || 'Batch insert failed'));
            return;
          }

          uploaded += (res.count || chunk.length);
          showToast(`Uploaded ${uploaded} / ${itemsToInsert.length} products...`);
        }

        showToast(`🎉 Success! Uploaded ${uploaded} products to database!`);
        initApp();
      } catch (err) {
        console.error('Parsing error:', err);
        alert('Failed to parse Excel file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  } catch (err) {
    console.error('File reading error:', err);
    alert('Failed to read file.');
  }
});

// --- SCANNER LOGIC ---
let html5QrCode = null;
let scanTarget = 'search';
const overlay = document.getElementById('scannerOverlay');

document.getElementById('scanBtn').addEventListener('click', () => startScanner('search'));
document.getElementById('scanForAddBtn').addEventListener('click', () => startScanner('add'));
document.getElementById('closeScan').addEventListener('click', stopScanner);

async function startScanner(target) {
  scanTarget = target || 'search';
  overlay.classList.add('show');
  const hintEl = document.querySelector('.scan-hint');
  hintEl.style.color = '';
  hintEl.textContent = target === 'location_qr'
    ? 'Point the camera at the location QR code (e.g. 1-02-01-03).'
    : 'Hold the item barcode steady inside the frame.';

  if (html5QrCode) {
    try { await html5QrCode.stop(); } catch (e) {}
    try { html5QrCode.clear(); } catch (e) {}
    html5QrCode = null;
  }

  html5QrCode = new Html5Qrcode("reader", {
    formatsToSupport: [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.QR_CODE
    ]
  });

  const isQr = target.includes('qr') || target.includes('location');
  const qrbox = isQr ? { width: 250, height: 250 } : { width: 260, height: 150 };
  const config = { fps: 12, qrbox };
  const onScan = (decodedText) => onScanSuccess(decodedText);
  const onError = () => {};

  // 1. Try environment camera mode
  try {
    await html5QrCode.start({ facingMode: "environment" }, config, onScan, onError);
    return;
  } catch (err1) {
    console.warn('facingMode environment start failed, trying camera device list:', err1);
  }

  // 2. Try camera list search
  try {
    const cameras = await Html5Qrcode.getCameras();
    if (cameras && cameras.length > 0) {
      const backCam = cameras.find(c => /back|rear|environment|main/i.test(c.label)) || cameras[cameras.length - 1];
      await html5QrCode.start(backCam.id, config, onScan, onError);
      return;
    }
  } catch (err2) {
    console.warn('Camera device enumeration failed:', err2);
  }

  // 3. Try any user facing camera
  try {
    await html5QrCode.start({ facingMode: "user" }, config, onScan, onError);
    return;
  } catch (err3) {
    console.error('All camera initialization modes failed:', err3);
    hintEl.style.color = '#ef4444';
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      hintEl.innerHTML = `🔒 <b>HTTPS Required for Phone Camera</b><br>Mobile browsers (iOS Safari & Chrome) disable camera permissions over local HTTP.<br><br>Run <b>npm run share</b> in your terminal for a free trusted HTTPS link for your phone!`;
    } else {
      hintEl.innerHTML = `⚠️ <b>Camera Permission Denied</b><br>Please enable Camera access in your phone's browser site settings and reload.`;
    }
  }
}

function onScanSuccess(code) {
  code = code.trim();
  stopScanner();
  if (scanTarget === 'add') {
    document.getElementById('fBarcode').value = code;
  } else if (scanTarget === 'location_qr') {
    handleLocationQRScan(code);
  } else if (scanTarget === 'rapid_barcode') {
    const input = document.getElementById('rfBarcode');
    input.value = code;
    input.dispatchEvent(new Event('input'));
    document.getElementById('rfLocation').focus();
  } else if (scanTarget === 'rapid_location_qr') {
    document.getElementById('rfLocation').value = code;
    document.getElementById('rfQty').focus();
  } else {
    document.getElementById('searchInput').value = code;
    doSearch(code, true);
  }
}

function stopScanner() {
  overlay.classList.remove('show');
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      html5QrCode = null;
    }).catch(() => { html5QrCode = null; });
  }
}

// --- ADD PRODUCT LOGIC ---
const addOverlay = document.getElementById('addOverlay');
const formError = document.getElementById('formError');

document.getElementById('addProductBtn').addEventListener('click', openAddForm);
document.getElementById('cancelAddBtn').addEventListener('click', closeAddForm);
document.getElementById('saveProductBtn').addEventListener('click', saveNewProduct);

function openAddForm() {
  const typed = document.getElementById('searchInput').value.trim();
  document.getElementById('fBarcode').value = /^\d+$/.test(typed) ? typed : '';
  document.getElementById('fName').value = /^\d+$/.test(typed) ? '' : typed;
  document.getElementById('fStock').value = '';
  
  // Pre-populate category from active product context if available
  const activeCat = (activeProduct && (activeProduct.category || activeProduct.c)) || '';
  document.getElementById('fCategory').value = activeCat;
  document.getElementById('fSubcategory').value = (activeProduct && (activeProduct.subcategory || activeProduct.sc)) || '';
  
  document.getElementById('fQty').value = '';
  document.getElementById('fStockman').value = currentUser ? currentUser.full_name : '';
  formError.classList.remove('show');
  addOverlay.classList.add('show');
  hideResults();
  
  // Auto-fill coordinates and suggestions based on category
  const suggested = suggestLocationForCategory(activeCat);
  if (suggested) {
    if (suggested.floor) document.getElementById('fFloor').value = suggested.floor;
    if (suggested.row) document.getElementById('fRow').value = suggested.row;
    if (suggested.shelf) document.getElementById('fShelf').value = suggested.shelf;
    if (suggested.level) document.getElementById('fLevel').value = suggested.level;
    updateAddLocationSuggestions();
  } else {
    document.getElementById('fFloor').value = '1';
    document.getElementById('fRow').value = '';
    document.getElementById('fShelf').value = '';
    document.getElementById('fLevel').value = '';
    document.getElementById('locSuggestions').style.display = 'none';
    document.getElementById('locSuggestionsPills').innerHTML = '';
  }
  
  document.getElementById('fCategoryDropdown').style.display = 'none';
  document.getElementById('fCategoryDropdown').innerHTML = '';
  
  setTimeout(() => document.getElementById('fName').focus(), 50);
}

function closeAddForm() {
  addOverlay.classList.remove('show');
}

function pad2(v) {
  v = (v || '').toString().trim();
  if (v === '') return '';
  return v.length === 1 ? '0' + v : v;
}

async function saveNewProduct() {
  const barcode = document.getElementById('fBarcode').value.trim();
  const name = document.getElementById('fName').value.trim();
  const stock_code = document.getElementById('fStock').value.trim();
  
  const category = document.getElementById('fCategory').value.trim();
  
  const subcategory = document.getElementById('fSubcategory').value.trim();
  const floor = document.getElementById('fFloor').value;
  const row = pad2(document.getElementById('fRow').value);
  const shelf = pad2(document.getElementById('fShelf').value);
  const level = pad2(document.getElementById('fLevel').value);
  const qtyRaw = document.getElementById('fQty').value.trim();
  const stockmanRaw = document.getElementById('fStockman').value.trim();

  if (!name || !stock_code || !row || !shelf || qtyRaw === '') {
    formError.classList.add('show');
    return;
  }
  formError.classList.remove('show');

  const payload = {
    barcode,
    stock_code,
    name,
    category: category || 'Uncategorized',
    subcategory,
    floor,
    batch: row,
    shelf,
    level: level || '00',
    qty: qtyRaw === '' ? 0 : parseInt(qtyRaw, 10),
    status: 'DONE',
    last_modified_by: stockmanRaw || (currentUser ? currentUser.full_name : 'Guest Stockman')
  };

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success && res.product) {
      PRODUCTS.push(res.product);
      rebuildIndex();
      closeAddForm();
      renderProduct(res.product);
      showToast(`Saved to Database! "${name}" is now at Floor ${floor}, Row ${row}, Shelf ${shelf}.`);
      updateStatsHeader();
    } else {
      alert('Error saving product: ' + (res.error || 'Unknown error'));
    }
  } catch (err) {
    console.error('Failed to post product:', err);
    alert('Server connection error while saving product.');
  }
}

// --- EDIT PRODUCT LOGIC ---
const editOverlay = document.getElementById('editOverlay');
const editFormError = document.getElementById('editFormError');

document.getElementById('editProductBtn').addEventListener('click', openEditForm);
document.getElementById('cancelEditBtn').addEventListener('click', closeEditForm);
document.getElementById('saveEditBtn').addEventListener('click', saveEditProduct);

function openEditForm() {
  if (!activeProduct) return;

  document.getElementById('efId').value = activeProduct.id || '';
  document.getElementById('efName').value = activeProduct.name || activeProduct.n || '';
  document.getElementById('efBarcode').value = activeProduct.barcode || activeProduct.b || '';
  document.getElementById('efStock').value = activeProduct.stock_code || activeProduct.s || '';
  document.getElementById('efFloor').value = activeProduct.floor || '1';
  document.getElementById('efRow').value = activeProduct.batch || activeProduct.row || '';
  document.getElementById('efShelf').value = activeProduct.shelf || '';
  document.getElementById('efLevel').value = activeProduct.level || '00';
  document.getElementById('efQty').value = activeProduct.qty !== undefined ? activeProduct.qty : 0;
  document.getElementById('efStockman').value = activeProduct.last_modified_by || activeProduct.modifiedBy || (currentUser ? currentUser.full_name : '');

  editFormError.classList.remove('show');
  editOverlay.classList.add('show');
  updateEditLocationSuggestions();
}

function closeEditForm() {
  editOverlay.classList.remove('show');
}

async function saveEditProduct() {
  const id = document.getElementById('efId').value;
  const name = document.getElementById('efName').value.trim();
  const barcode = document.getElementById('efBarcode').value.trim();
  const stock_code = document.getElementById('efStock').value.trim();
  const floor = document.getElementById('efFloor').value;
  const row = pad2(document.getElementById('efRow').value);
  const shelf = pad2(document.getElementById('efShelf').value);
  const level = pad2(document.getElementById('efLevel').value) || '00';
  const qtyRaw = document.getElementById('efQty').value.trim();
  const stockmanRaw = document.getElementById('efStockman').value.trim();

  if (!name || !stock_code || !row || !shelf || qtyRaw === '') {
    editFormError.classList.add('show');
    return;
  }
  editFormError.classList.remove('show');

  const loc = `${floor}-${row}-${shelf}-${level}`;
  const floorLabel = floor === '1' ? 'First Floor' : (floor === '2' ? 'Second Floor' : 'Third Floor');
  const loc_full = `${loc} ${floorLabel} - Row ${row} - Shelves ${shelf} - Level ${level}`;

  const payload = {
    name,
    barcode,
    stock_code,
    floor,
    batch: row,
    shelf,
    level,
    loc,
    loc_full,
    qty: qtyRaw === '' ? 0 : parseInt(qtyRaw, 10),
    last_modified_by: stockmanRaw || (currentUser ? currentUser.full_name : 'Guest Stockman')
  };

  if (!id) {
    Object.assign(activeProduct, payload);
    renderProduct(activeProduct);
    closeEditForm();
    showToast(`Updated "${name}" location details!`);
    return;
  }

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success && res.product) {
      const idx = PRODUCTS.findIndex(p => p.id === res.product.id);
      if (idx !== -1) PRODUCTS[idx] = res.product;
      rebuildIndex();
      closeEditForm();
      renderProduct(res.product);
      showToast(`Updated in Database! "${name}" location is now Floor ${floor}, Row ${row}, Shelf ${shelf}.`);
    } else {
      alert('Error updating product: ' + (res.error || 'Unknown error'));
    }
  } catch (err) {
    console.error('Failed to update product:', err);
    alert('Server error updating product.');
  }
}

async function updateStatsHeader() {
  try {
    const statsRes = await fetch('/api/stats').then(r => r.json());
    if (statsRes.success) {
      document.getElementById('skuStamp').textContent = `${statsRes.total} SKUs mapped`;
    }
  } catch (e) {}
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('successToast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
}

// --- AUTHENTICATION EVENT LISTENERS ---
document.getElementById('authBtn').addEventListener('click', () => {
  if (currentUser) {
    currentUser = null;
    localStorage.removeItem('wh_current_user');
    updateUserUI();
    showToast('Logged out.');
  } else {
    document.getElementById('loginFormError').style.display = 'none';
    document.getElementById('loginOverlay').classList.add('show');
  }
});

document.getElementById('closeLoginModal').addEventListener('click', () => {
  document.getElementById('loginOverlay').classList.remove('show');
});

const chip1 = document.getElementById('chipStockman1');
if (chip1) {
  chip1.addEventListener('click', () => {
    document.getElementById('loginUsername').value = 'stockman1';
    document.getElementById('loginPassword').value = 'password123';
  });
}

const chip2 = document.getElementById('chipStockman2');
if (chip2) {
  chip2.addEventListener('click', () => {
    document.getElementById('loginUsername').value = 'stockman2';
    document.getElementById('loginPassword').value = 'password123';
  });
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const u = document.getElementById('loginUsername').value.trim();
  const p = document.getElementById('loginPassword').value.trim();
  const errEl = document.getElementById('loginFormError');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    }).then(r => r.json());

    if (res.success && res.user) {
      currentUser = res.user;
      localStorage.setItem('wh_current_user', JSON.stringify(currentUser));
      updateUserUI();
      document.getElementById('loginOverlay').classList.remove('show');
      showToast(`Welcome, ${currentUser.full_name}! Accountable for changes.`);
    } else {
      errEl.textContent = res.error || 'Invalid username or password.';
      errEl.style.display = 'block';
    }
  } catch (err) {
    console.error('Login error:', err);
    errEl.textContent = 'Server connection error during login.';
    errEl.style.display = 'block';
  }
});

// Dynamic Category & Shelf Overflow Helpers
let ALL_CATEGORIES = [];
function updateCategoryDatalist() {
  const categories = new Set();
  PRODUCTS.forEach(p => {
    const cat = p.category || p.c;
    if (cat) categories.add(cat.trim());
  });
  ALL_CATEGORIES = Array.from(categories).sort();
}

function suggestLocationForCategory(catName) {
  if (!catName) return null;
  const cleanCat = catName.trim().toLowerCase();

  const matches = PRODUCTS.filter(p => {
    const c = p.category || p.c || '';
    return c.trim().toLowerCase() === cleanCat;
  });

  if (matches.length === 0) return null;

  const frequencies = { floor: {}, row: {}, shelf: {}, level: {} };
  matches.forEach(p => {
    const fl = p.floor !== undefined ? String(p.floor) : '';
    const rw = (p.batch || p.row || '').toString();
    const sh = (p.shelf || '').toString();
    const lv = (p.level || '').toString();

    if (fl) frequencies.floor[fl] = (frequencies.floor[fl] || 0) + 1;
    if (rw) frequencies.row[rw] = (frequencies.row[rw] || 0) + 1;
    if (sh) frequencies.shelf[sh] = (frequencies.shelf[sh] || 0) + 1;
    if (lv) frequencies.level[lv] = (frequencies.level[lv] || 0) + 1;
  });

  const getMode = (obj) => {
    let modeKey = '';
    let maxCount = 0;
    for (const key in obj) {
      if (obj[key] > maxCount) {
        maxCount = obj[key];
        modeKey = key;
      }
    }
    return modeKey;
  };

  return {
    floor: getMode(frequencies.floor),
    row: getMode(frequencies.row),
    shelf: getMode(frequencies.shelf),
    level: getMode(frequencies.level)
  };
}

function getNearbyLocations(floor, row, shelf, level) {
  const f = parseInt(floor, 10) || 1;
  const r = parseInt(row, 10) || 0;
  const s = parseInt(shelf, 10) || 0;
  const l = parseInt(level, 10) || 0;

  const pad = (num) => String(num).padStart(2, '0');
  const suggestions = [];

  // 1. Next Shelf
  suggestions.push({
    label: `Shelf ${pad(s + 1)}`,
    floor: String(f),
    row: pad(r),
    shelf: pad(s + 1),
    level: pad(l)
  });

  // 2. Next Level
  suggestions.push({
    label: `Level ${pad(l + 1)}`,
    floor: String(f),
    row: pad(r),
    shelf: pad(s),
    level: pad(l + 1)
  });

  // 3. Previous Shelf (only if shelf > 1)
  if (s > 1) {
    suggestions.push({
      label: `Shelf ${pad(s - 1)}`,
      floor: String(f),
      row: pad(r),
      shelf: pad(s - 1),
      level: pad(l)
    });
  }

  // 4. Next Row
  suggestions.push({
    label: `Row ${pad(r + 1)}`,
    floor: String(f),
    row: pad(r + 1),
    shelf: pad(s),
    level: pad(l)
  });

  return suggestions;
}

function updateAddLocationSuggestions() {
  const floor = document.getElementById('fFloor').value;
  const row = document.getElementById('fRow').value.trim();
  const shelf = document.getElementById('fShelf').value.trim();
  const level = document.getElementById('fLevel').value.trim() || '00';

  const container = document.getElementById('locSuggestions');
  const pillsEl = document.getElementById('locSuggestionsPills');

  if (!row || !shelf) {
    container.style.display = 'none';
    return;
  }

  const suggestions = getNearbyLocations(floor, row, shelf, level);
  pillsEl.innerHTML = '';
  suggestions.forEach(s => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'loc-pill';
    pill.textContent = `${s.label} (${s.floor}-${s.row}-${s.shelf}-${s.level})`;
    pill.onclick = () => {
      document.getElementById('fFloor').value = s.floor;
      document.getElementById('fRow').value = s.row;
      document.getElementById('fShelf').value = s.shelf;
      document.getElementById('fLevel').value = s.level;
      updateAddLocationSuggestions();
    };
    pillsEl.appendChild(pill);
  });
  container.style.display = 'block';
}

function updateEditLocationSuggestions() {
  const floor = document.getElementById('efFloor').value;
  const row = document.getElementById('efRow').value.trim();
  const shelf = document.getElementById('efShelf').value.trim();
  const level = document.getElementById('efLevel').value.trim() || '00';

  const container = document.getElementById('editLocSuggestions');
  const pillsEl = document.getElementById('editLocSuggestionsPills');

  if (!row || !shelf) {
    container.style.display = 'none';
    return;
  }

  const suggestions = getNearbyLocations(floor, row, shelf, level);
  pillsEl.innerHTML = '';
  suggestions.forEach(s => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'loc-pill';
    pill.textContent = `${s.label} (${s.floor}-${s.row}-${s.shelf}-${s.level})`;
    pill.onclick = () => {
      document.getElementById('efFloor').value = s.floor;
      document.getElementById('efRow').value = s.row;
      document.getElementById('efShelf').value = s.shelf;
      document.getElementById('efLevel').value = s.level;
      updateEditLocationSuggestions();
    };
    pillsEl.appendChild(pill);
  });
  container.style.display = 'block';
}

function showLocationFullInfo() {
  alert("⚠️ Shelf / Location Full Instructions:\n\nIf the assigned shelf slot or location is full, please place the newly arrived stock in a nearby position.\n\nTo make this simple:\n1. Look at the nearby suggestions row below (e.g., Next Shelf, Higher Level, or Neighboring Row).\n2. Place the physical product in that new location.\n3. Tap that suggestion pill in this app. The coordinates will auto-fill instantly!\n4. Click Save to complete the update.");
}

function showNotFoundModal(query) {
  document.getElementById('notFoundMessage').textContent = `No product matching "${query}" was found in the database. Would you like to add it now?`;
  document.getElementById('notFoundOverlay').classList.add('show');
}

document.getElementById('cancelNotFoundBtn').addEventListener('click', () => {
  document.getElementById('notFoundOverlay').classList.remove('show');
});

document.getElementById('confirmNotFoundBtn').addEventListener('click', () => {
  document.getElementById('notFoundOverlay').classList.remove('show');
  openAddForm();
});

function renderCategoryDropdown(filterText = '') {
  const cleanFilter = filterText.trim().toLowerCase();
  const filtered = ALL_CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(cleanFilter)
  );

  const dropdown = document.getElementById('fCategoryDropdown');
  if (!dropdown) return;

  dropdown.innerHTML = '';
  if (filtered.length === 0) {
    dropdown.innerHTML = '<div style="padding: 10px 14px; font-size:12px; color:var(--muted); font-family:var(--mono);">No matches</div>';
  } else {
    filtered.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'combobox-item';
      btn.textContent = cat;
      btn.onclick = (e) => {
        e.stopPropagation();
        handleCategorySelection(cat);
      };
      dropdown.appendChild(btn);
    });
  }
}

function handleCategorySelection(cat) {
  document.getElementById('fCategory').value = cat;
  document.getElementById('fCategoryDropdown').style.display = 'none';

  const suggested = suggestLocationForCategory(cat);
  if (suggested) {
    if (suggested.floor) document.getElementById('fFloor').value = suggested.floor;
    if (suggested.row) document.getElementById('fRow').value = suggested.row;
    if (suggested.shelf) document.getElementById('fShelf').value = suggested.shelf;
    if (suggested.level) document.getElementById('fLevel').value = suggested.level;
    updateAddLocationSuggestions();
  }
}

function showCategoryDropdown() {
  renderCategoryDropdown(document.getElementById('fCategory').value);
  document.getElementById('fCategoryDropdown').style.display = 'block';
}

// Set up listeners for category autocomplete autofill and combobox toggles
document.getElementById('fCategory').addEventListener('focus', showCategoryDropdown);
document.getElementById('fCategory').addEventListener('input', (e) => {
  const cat = e.target.value;
  renderCategoryDropdown(cat);
  document.getElementById('fCategoryDropdown').style.display = 'block';

  const suggested = suggestLocationForCategory(cat);
  if (suggested) {
    if (suggested.floor) document.getElementById('fFloor').value = suggested.floor;
    if (suggested.row) document.getElementById('fRow').value = suggested.row;
    if (suggested.shelf) document.getElementById('fShelf').value = suggested.shelf;
    if (suggested.level) document.getElementById('fLevel').value = suggested.level;
    updateAddLocationSuggestions();
  }
});

document.getElementById('fCategoryArrow').addEventListener('click', (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById('fCategoryDropdown');
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    showCategoryDropdown();
  }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.combobox-container')) {
    const dropdown = document.getElementById('fCategoryDropdown');
    if (dropdown) dropdown.style.display = 'none';
  }
});

document.getElementById('scanLocationQrBtn').addEventListener('click', () => startScanner('location_qr'));

function parseLocationQR(text) {
  text = text.trim();
  const parts = text.split('-');
  if (parts.length >= 3) {
    return {
      floor: parts[0].trim(),
      row: parts[1].trim(),
      shelf: parts[2].trim(),
      level: parts[3] ? parts[3].trim() : '00'
    };
  }
  return null;
}

async function handleLocationQRScan(code) {
  if (!activeProduct) {
    alert("No active product selected to link a location to.");
    return;
  }
  const parsed = parseLocationQR(code);
  if (!parsed) {
    alert("Invalid location QR code format. Expected e.g. '1-02-01-03'.");
    return;
  }

  showToast("Registering new location...");

  const payload = {
    barcode: activeProduct.barcode || activeProduct.b || '',
    stock_code: activeProduct.stock_code || activeProduct.s || '',
    name: activeProduct.name || activeProduct.n,
    category: activeProduct.category || activeProduct.c || 'Uncategorized',
    subcategory: activeProduct.subcategory || activeProduct.sc || '',
    floor: parsed.floor,
    batch: parsed.row,
    shelf: parsed.shelf,
    level: parsed.level,
    qty: 0,
    last_modified_by: currentUser ? currentUser.full_name : 'Staff Scanner'
  };

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success) {
      showToast("📍 New location linked successfully!");
      
      const productsRes = await fetch('/api/products/all').then(r => r.json());
      if (productsRes.success && Array.isArray(productsRes.products)) {
        PRODUCTS = productsRes.products;
        rebuildIndex();
        updateCategoryDatalist();
        
        const updatedProduct = PRODUCTS.find(p => p.id === res.product.id) || res.product;
        renderProduct(updatedProduct);
      }
    } else {
      alert("Failed to register location: " + (res.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Failed to post new location:", err);
    alert("Network error: failed to link location.");
  }
}

window.openEditFormForProductIndex = function(index) {
  if (!window.currentLocs || !window.currentLocs[index]) return;
  const p = window.currentLocs[index];
  
  document.getElementById('efId').value = p.id;
  document.getElementById('efName').value = p.name || p.n || '';
  document.getElementById('efBarcode').value = p.barcode || p.b || '';
  document.getElementById('efStock').value = p.stock_code || p.s || '';
  document.getElementById('efFloor').value = p.floor || '1';
  document.getElementById('efRow').value = p.floor !== undefined ? (p.batch || p.row || '') : '';
  document.getElementById('efShelf').value = p.shelf || '';
  document.getElementById('efLevel').value = p.level || '00';
  document.getElementById('efQty').value = p.qty !== undefined ? p.qty : '';
  document.getElementById('efStockman').value = p.last_modified_by || p.modifiedBy || (currentUser ? currentUser.full_name : '');

  document.getElementById('editFormError').classList.remove('show');
  document.getElementById('editOverlay').classList.add('show');
  updateEditLocationSuggestions();
};

// --- RAPID LOCATION LOGGER LOGIC ---
const rapidOverlay = document.getElementById('rapidOverlay');
const rfBarcode = document.getElementById('rfBarcode');
const rfNameField = document.getElementById('rfNameField');
const rfName = document.getElementById('rfName');
const rfLocation = document.getElementById('rfLocation');
const rfQty = document.getElementById('rfQty');
const rapidFormError = document.getElementById('rapidFormError');
const rapidLogList = document.getElementById('rapidLogList');

let rapidLogs = [];

document.getElementById('rapidLoggerBtn').addEventListener('click', openRapidLogger);
document.getElementById('closeRapidBtn').addEventListener('click', closeRapidLogger);
document.getElementById('saveRapidBtn').addEventListener('click', saveRapidEntry);

document.getElementById('scanForRapidBarcodeBtn').addEventListener('click', () => startScanner('rapid_barcode'));
document.getElementById('scanForRapidLocBtn').addEventListener('click', () => startScanner('rapid_location_qr'));

function openRapidLogger() {
  rfBarcode.value = '';
  rfName.value = '';
  rfLocation.value = '';
  rfQty.value = '1';
  rfNameField.style.display = 'none';
  document.getElementById('rapidProductPreview').style.display = 'none';
  rapidFormError.classList.remove('show');
  rapidOverlay.classList.add('show');
  setTimeout(() => rfBarcode.focus(), 150);
}

function closeRapidLogger() {
  rapidOverlay.classList.remove('show');
}

rfBarcode.addEventListener('input', () => {
  const val = rfBarcode.value.trim().toLowerCase();
  const previewEl = document.getElementById('rapidProductPreview');
  const matchedNameEl = document.getElementById('rfMatchedName');

  if (!val) {
    previewEl.style.display = 'none';
    rfNameField.style.display = 'none';
    return;
  }

  // Look in PRODUCTS array
  const found = PRODUCTS.find(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const s = (p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === val) || (s && s === val);
  });

  if (found) {
    matchedNameEl.textContent = found.name || found.n;
    previewEl.style.display = 'block';
    previewEl.style.color = '#10b981';
    rfNameField.style.display = 'none';
    rfName.value = '';
  } else {
    matchedNameEl.textContent = CURRENT_LANG === 'en' ? 'New Product (Name Optional)' : '新商品（可选择录入商品名称）';
    previewEl.style.display = 'block';
    previewEl.style.color = '#3b82f6';
    rfNameField.style.display = 'block';
  }
});

// Pressing enter in inputs transitions focus
rfBarcode.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (rfNameField.style.display !== 'none') {
      rfName.focus();
    } else {
      rfLocation.focus();
    }
  }
});
rfName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    rfLocation.focus();
  }
});
rfLocation.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    rfQty.focus();
  }
});
rfQty.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveRapidEntry();
  }
});

async function saveRapidEntry() {
  const barcode = rfBarcode.value.trim();
  const locCode = rfLocation.value.trim();
  const qtyRaw = rfQty.value.trim();
  const customName = rfName.value.trim();

  if (!barcode || !locCode || !qtyRaw) {
    rapidFormError.textContent = CURRENT_LANG === 'en' ? 'Please fill in all fields.' : '请填写所有必填字段。';
    rapidFormError.classList.add('show');
    return;
  }

  const parsed = parseLocationQR(locCode);
  if (!parsed) {
    rapidFormError.textContent = TRANSLATIONS[CURRENT_LANG].rapidLocError;
    rapidFormError.classList.add('show');
    return;
  }

  rapidFormError.classList.remove('show');
  showToast(CURRENT_LANG === 'en' ? 'Saving rapid location...' : '正在登记库位...');

  // Search existing details
  const existing = PRODUCTS.find(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const s = (p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === barcode.toLowerCase()) || (s && s === barcode.toLowerCase());
  });

  // Decide product name
  let nameToUse = `Product ${barcode}`;
  if (existing) {
    nameToUse = existing.name || existing.n;
  } else if (customName) {
    nameToUse = customName;
  } else {
    nameToUse = CURRENT_LANG === 'en' ? `New Product (${barcode})` : `新登记商品 (${barcode})`;
  }

  const payload = {
    barcode: existing ? (existing.barcode || existing.b) : barcode,
    stock_code: existing ? (existing.stock_code || existing.s) : barcode.slice(0, 8),
    name: nameToUse,
    category: existing ? (existing.category || existing.c || 'Uncategorized') : 'Uncategorized',
    subcategory: existing ? (existing.subcategory || existing.sc || '') : '',
    floor: parsed.floor,
    batch: parsed.row,
    shelf: parsed.shelf,
    level: parsed.level,
    qty: parseInt(qtyRaw, 10) || 0,
    last_modified_by: currentUser ? currentUser.full_name : 'Rapid Logger'
  };

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success) {
      showToast(TRANSLATIONS[CURRENT_LANG].rapidSaved);

      // Add to session logs list
      const logText = `[${new Date().toLocaleTimeString()}] ${payload.name} (${payload.barcode}) &rarr; 📍 ${locCode} [Qty: ${payload.qty}]`;
      rapidLogs.unshift(logText);
      rapidLogs = rapidLogs.slice(0, 5);

      rapidLogList.innerHTML = '';
      rapidLogs.forEach(log => {
        const item = document.createElement('div');
        item.style.padding = '6px';
        item.style.background = 'var(--bg)';
        item.style.borderRadius = '6px';
        item.style.border = '1px solid var(--line)';
        item.innerHTML = log;
        rapidLogList.appendChild(item);
      });

      // Update local PRODUCTS state
      const productsRes = await fetch('/api/products/all').then(r => r.json());
      if (productsRes.success && Array.isArray(productsRes.products)) {
        PRODUCTS = productsRes.products;
        rebuildIndex();
        updateCategoryDatalist();
      }

      // Reset logger fields and focus barcode for next item
      rfBarcode.value = '';
      rfName.value = '';
      rfLocation.value = '';
      rfQty.value = '1';
      rfNameField.style.display = 'none';
      document.getElementById('rapidProductPreview').style.display = 'none';
      rfBarcode.focus();
    } else {
      alert("Error saving: " + (res.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Failed to rapidly register product location:", err);
    alert("Connection error: failed to register location.");
  }
}

// Coordinate change listeners for Add modal
['fFloor', 'fRow', 'fShelf', 'fLevel'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateAddLocationSuggestions);
  document.getElementById(id).addEventListener('change', updateAddLocationSuggestions);
});

// Coordinate change listeners for Edit modal
['efFloor', 'efRow', 'efShelf', 'efLevel'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateEditLocationSuggestions);
  document.getElementById(id).addEventListener('change', updateEditLocationSuggestions);
});

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
