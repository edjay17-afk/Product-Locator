const TRANSLATIONS = {
  en: {
    brandEyebrow: "Warehouse Product Locator",
    appTitle: "Product Locator",
    appSub: "Find where a product goes, or add a new one",
    databaseConnected: "Database Connected",
    skusMapped: "SKUs mapped",
    loadingDb: "Loading database...",
    searchPlaceholder: "Search barcode, code, or name...",
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
    itemCodeLabel: "Stock No.",
    itemCodeHint: "The short code printed on the price tag, if it has one.",
    categoryLabel: "Category (optional)",
    departmentLabel: "Department (optional)",
    subcategoryLabel: "Department (optional)",
    storedLabel: "Where is it stored?",
    storedHint: "This is what tells the next person exactly where to find it on the shelf.",
    floorLabel: "Floor",
    rowLabel: "Row number",
    shelfLabel: "Shelf number",
    levelLabel: "Level (0 = bottom)",
    qtyLabel: "How many are on hand?",
    stockmanLabel: "Responsible Stockman",
    formError: "Please fill in Product Name, Row, Shelf, and On Hand Quantity.",
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
    rapidSubmit: "Add & Next",
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
    e2: "Tap \"Scan\" to use the camera, or type a barcode, item code, or name above. Don't see a product? Tap \"Add Product\" to save it, or use the ⚡ \"Rapid Logger\" for high-speed barcode + location mapping.",
    scanBarcodeBtn: "Scan Barcode",
    scanQrBtn: "Scan QR",
    newProductFieldsTitle: "🆕 NEW PRODUCT DETAILS",
    orManualLoc: "OR ENTER COORDINATES MANUALLY:",
    cardFloor: "Floor",
    cardRow: "Row",
    cardShelf: "Shelf",
    cardLevel: "Level",
    cardStockman: "Stockman",
    cardLocationQty: "Location Qty",
    cardEditBtn: "Edit",
    quickSearchBoard: "Search Board QR",
    qrBoardTitle: "Quick Search Display Board",
    qrBoardSub: "Print this board and post it on your warehouse walls or doors. Customers and staff can scan it to instantly find product locations on their phones without logging in.",
    qrBoardInstructions: "1. Scan the QR code below using your phone's camera.<br>2. Search by product name or scan a barcode to see its location immediately.",
    printPoster: "Print Poster"
  },
  zh: {
    brandEyebrow: "仓库商品定位系统",
    appTitle: "库位导航",
    appSub: "查找商品存放位置，或登记新商品",
    databaseConnected: "数据库已连接",
    skusMapped: "已登记库位商品数",
    loadingDb: "正在加载数据库...",
    searchPlaceholder: "搜索条码、编码或名称...",
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
    itemCodeLabel: "货号 / Stock No.",
    itemCodeHint: "商品价格标签上印制的简短编码。",
    categoryLabel: "分类（可选）",
    departmentLabel: "部门（可选）",
    subcategoryLabel: "部门（可选）",
    storedLabel: "存放位置",
    storedHint: "这将准确指引下一个人在哪个货架上找到该商品。",
    floorLabel: "楼层",
    rowLabel: "通道 / 排号",
    shelfLabel: "货架号",
    levelLabel: "层数 (0 = 底层)",
    qtyLabel: "现有库存数量",
    stockmanLabel: "负责理货员",
    formError: "请填写商品名称、通道号、货架号和现有库存数。",
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
    rapidSubmit: "添加 & 下一个",
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
    e2: "点击“扫码”使用相机，或在上方输入条码、货号、名称。如果商品不存在，点击“添加商品”保存商品，或使用 ⚡“快速登记”进行高效率条码+库位绑定。",
    scanBarcodeBtn: "扫商品条码",
    scanQrBtn: "扫库位码",
    newProductFieldsTitle: "🆕 新商品详情",
    orManualLoc: "或手动输入库位：",
    cardFloor: "楼层",
    cardRow: "通道/排号",
    cardShelf: "货架号",
    cardLevel: "层数",
    cardStockman: "负责理货员",
    cardLocationQty: "库位数量",
    cardEditBtn: "编辑",
    quickSearchBoard: "查询看板 QR",
    qrBoardTitle: "自助查询引导看板",
    qrBoardSub: "打印此看板并贴在仓库墙壁或通道门上。理货员或客户只需用手机扫描即可免登录自助查询商品货位。",
    qrBoardInstructions: "1. 使用手机相机扫描下方二维码。<br>2. 输入商品名称或扫描商品条码，即可立即查看其架上位置。",
    printPoster: "打印海报"
  }
};

let CURRENT_LANG = localStorage.getItem('wh_lang') || 'en';
let isGuestMode = false;

let PRODUCTS = [];
let byBarcode = {};
let byStock = {};
let byBarcodeMap = new Map();
let byStockMap = new Map();
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

  if (isGuestMode) {
    const titleEl = document.getElementById('appTitle');
    const subEl = document.getElementById('appSub');
    if (titleEl) titleEl.textContent = lang === 'en' ? 'Product Finder' : '自助定位查找';
    if (subEl) subEl.textContent = lang === 'en' ? 'Scan barcode or enter name to locate items.' : '扫描商品条形码或输入商品名称查找存放位置。';
  }

  // Re-apply user UI so auth button (Logout/Sign In) is always correct
  // after the translation loop runs (translations must not overwrite dynamic state)
  updateUserUI();

  // Update dynamic lists
  if (activeProduct) {
    renderProduct(activeProduct);
  }
}

let activeProduct = null;

// Initialize app data from server database API
async function initApp() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'guest') {
    isGuestMode = true;
    document.body.classList.add('guest-mode');
    setTimeout(() => {
      startScanner();
    }, 600);
  }

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
      const skuStamp = document.getElementById('skuStamp');
      if (skuStamp) skuStamp.textContent = `${statsRes.total} SKUs mapped`;
      document.getElementById('footerText').textContent = `Database Connected · ${statsRes.total} SKUs mapped`;
    }

    if (productsRes.success && Array.isArray(productsRes.products)) {
      PRODUCTS = productsRes.products;
      rebuildIndex();
      updateCategoryDatalist();
    }

    // Supabase Realtime WebSocket Subscription for instant multi-stockman push updates!
    try {
      if (window.supabase) {
        window.supabase.channel('products_realtime_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
            const item = payload.new;
            if (item && (item.name || item.barcode)) {
              const stockman = item.last_modified_by ? `by ${item.last_modified_by}` : '';
              showToast(`🔔 Stock updated ${stockman}: ${item.name || item.barcode} (Qty: ${item.qty})`);
              
              const existingIdx = PRODUCTS.findIndex(p => p.id === item.id);
              if (existingIdx >= 0) {
                PRODUCTS[existingIdx] = item;
              } else {
                PRODUCTS.push(item);
              }
              rebuildIndex();

              if (activeProduct && ((activeProduct.barcode && activeProduct.barcode === item.barcode) || (activeProduct.stock_code && activeProduct.stock_code === item.stock_code))) {
                renderProduct(activeProduct);
              }
            }
          })
          .subscribe();
      }
    } catch (e) {
      console.warn("Supabase Realtime subscription initialized in HTTP fallback mode:", e);
    }
  } catch (err) {
    console.warn('Network or API unavailable, operating in offline fallback mode if cached data exists.', err);
    const skuStamp = document.getElementById('skuStamp');
    if (skuStamp) skuStamp.textContent = `Offline mode`;
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
  byBarcodeMap.clear();
  byStockMap.clear();

  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    if (p.barcode || p.b) {
      const b = (p.barcode || p.b).toString().trim().toLowerCase();
      if (b) {
        byBarcode[b] = p;
        byBarcodeMap.set(b, p);
      }
    }
    if (p.stock_code || p.s) {
      const s = (p.stock_code || p.s).toString().trim().toLowerCase();
      if (s) {
        byStock[s] = p;
        byStockMap.set(s, p);
      }
    }
  }
}

function statusInfo(status) {
  const isEn = CURRENT_LANG === 'en';
  if (!status) return { cls: 'neutral', label: isEn ? 'No status' : '未指派状态' };
  const s = status.toUpperCase();
  if (s === 'DONE') return { cls: 'go', label: isEn ? 'Verified' : '已核对' };
  if (s.includes('RECOUNT')) return { cls: 'warn', label: isEn ? 'Needs recount' : '需重数' };
  if (s.includes('NOT FOUND') || s.includes('WRONG')) return { cls: 'bad', label: isEn ? 'Flagged' : '异常标记' };
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

  const barcode = p.barcode || p.b;
  const stockCode = p.stock_code || p.s;
  document.getElementById('pBarcode').textContent = barcode || (stockCode ? ('#' + stockCode) : '—');

  // Multi-location rendering (fresh fetch from DB)
  const locs = await fetchLocationsForProduct(p);
  const totalQty = locs.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
  document.getElementById('pQty').textContent = totalQty;

  // Deduplicate and group locations by exact coordinates (floor, row, shelf, level)
  const uniqueLocs = [];
  locs.forEach(item => {
    const floor = item.floor !== undefined && item.floor !== null ? String(item.floor).trim() : '';
    const batch = item.batch !== undefined && item.batch !== null ? String(item.batch).trim() : (item.row || '').trim();
    const shelf = item.shelf !== undefined && item.shelf !== null ? String(item.shelf).trim() : '';
    const level = item.level !== undefined && item.level !== null ? String(item.level).trim() : '';
    const hasLoc = floor !== '';

    // Search for existing entry in grouped array
    const existing = uniqueLocs.find(u =>
      u.floor === floor &&
      u.batch === batch &&
      u.shelf === shelf &&
      u.level === level
    );

    if (existing) {
      existing.qty = (parseInt(existing.qty, 10) || 0) + (parseInt(item.qty, 10) || 0);
      // Retain the highest/most-recent database record ID for edit actions
      if (item.id && (!existing.id || item.id > existing.id)) {
        existing.id = item.id;
        existing.status = item.status;
        existing.last_modified_by = item.last_modified_by || item.modifiedBy;
      }
    } else {
      uniqueLocs.push({
        id: item.id,
        barcode: item.barcode || p.barcode || p.b || '',
        stock_code: item.stock_code || p.stock_code || p.s || '',
        name: item.name || p.name || p.n || 'Unnamed item',
        category: item.category || p.category || p.c || '—',
        subcategory: item.subcategory || p.subcategory || p.sc || '',
        floor,
        batch,
        shelf,
        level,
        hasLoc,
        qty: parseInt(item.qty, 10) || 0,
        status: item.status,
        last_modified_by: (item.last_modified_by && item.last_modified_by !== 'System Import') ? item.last_modified_by : '',
        custom: item.custom || p.custom
      });
    }
  });

  // Filter unmapped cards if at least one mapped location card exists
  const mappedLocs = uniqueLocs.filter(item => item.hasLoc && (item.floor || item.batch || item.shelf));
  const finalLocs = mappedLocs.length > 0 ? mappedLocs : uniqueLocs;

  window.currentLocs = finalLocs;

  const locationsList = document.getElementById('locationsList');
  locationsList.innerHTML = '';

  finalLocs.forEach((item, index) => {
    const floor = item.floor;
    const batch = item.batch;
    const shelf = item.shelf;
    const level = item.level;
    const hasLoc = item.hasLoc;

    const st = statusInfo(item.status);
    const qtyVal = item.qty;
    const rawStockman = item.last_modified_by || item.modifiedBy || '';
    const stockmanVal = (rawStockman && rawStockman !== 'System Import' && rawStockman !== 'Guest Stockman' && rawStockman !== 'Staff Scanner' && rawStockman !== 'Rapid Logger') ? rawStockman : '';

    const cardEl = document.createElement('div');
    cardEl.className = 'tagcard';
    cardEl.style.marginBottom = '16px';

    cardEl.innerHTML = `
      <div class="tagcard-top">
        <p class="pname">${escapeHtml(item.name)}</p>
        <div class="pmeta">
          <span>${escapeHtml(item.category)}</span>
          <span>${escapeHtml(item.subcategory)}</span>
        </div>
      </div>
      <div class="grid4">
        <div class="cell"><div class="clabel">${TRANSLATIONS[CURRENT_LANG].cardFloor}</div><div class="cval">${hasLoc ? floor : '–'}</div></div>
        <div class="cell"><div class="clabel">${TRANSLATIONS[CURRENT_LANG].cardRow}</div><div class="cval">${hasLoc ? batch : '–'}</div></div>
        <div class="cell"><div class="clabel">${TRANSLATIONS[CURRENT_LANG].cardShelf}</div><div class="cval">${hasLoc ? shelf : '–'}</div></div>
        <div class="cell"><div class="clabel">${TRANSLATIONS[CURRENT_LANG].cardLevel}</div><div class="cval">${hasLoc ? level : '–'}</div></div>
      </div>
      <div class="tagcard-bottom">
        <div style="font-size: 12px; display: flex; flex-direction: column; gap: 2px;">
          <div>${TRANSLATIONS[CURRENT_LANG].cardStockman}: <strong style="font-weight: 600;">${escapeHtml(stockmanVal)}</strong></div>
          <div style="opacity: 0.95; font-size: 11px;">${TRANSLATIONS[CURRENT_LANG].cardLocationQty}: <strong>${qtyVal}</strong></div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge ${st.cls}" style="font-size: 10px; padding: 4px 10px;">${st.label}</span>
          <button class="user-auth-btn login" style="font-size: 11.5px; padding: 5px 12px; margin: 0; border-radius: 8px; background: white; color: var(--ink); border: none; font-weight: 600;" type="button" onclick="openEditFormForProductIndex(${index})">${TRANSLATIONS[CURRENT_LANG].cardEditBtn}</button>
        </div>
      </div>
    `;
    locationsList.appendChild(cardEl);
  });

  window.currentLocs = uniqueLocs;

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

  // If product has no location set yet and Rapid Logger is not open, automatically pop up the Edit/Location modal!
  const isRapidOpen = document.getElementById('rapidOverlay') && document.getElementById('rapidOverlay').classList.contains('show');
  if (mappedLocs.length === 0 && !isRapidOpen) {
    setTimeout(() => {
      openEditForm();
    }, 150);
  }
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

  // 1. Instant O(1) local Map index lookup — exact barcode or stock match
  if (byBarcodeMap.has(q)) {
    renderProduct(byBarcodeMap.get(q));
    document.getElementById('searchInput').value = '';
    return;
  }
  if (byStockMap.has(q)) {
    renderProduct(byStockMap.get(q));
    document.getElementById('searchInput').value = '';
    return;
  }

  // 2. Local substring search (name/partial barcode)
  const localMatches = PRODUCTS.filter(p => {
    const barcode = (p.barcode || p.b || '').toString().toLowerCase();
    const stockCode = (p.stock_code || p.s || '').toString().toLowerCase();
    const name = (p.name || p.n || '').toLowerCase();
    return barcode.includes(q) || stockCode.includes(q) || name.includes(q);
  });

  // Deduplicate by barcode so multi-location products appear once in the list
  const seen = new Set();
  const dedupedMatches = [];
  for (const p of localMatches) {
    const key = (p.barcode || p.b || p.stock_code || p.s || p.name || p.n || '').toLowerCase();
    if (!seen.has(key)) { seen.add(key); dedupedMatches.push(p); }
    if (dedupedMatches.length >= 10) break;
  }

  if (dedupedMatches.length === 1) {
    // Only one unique product — show card directly
    renderProduct(dedupedMatches[0]);
    document.getElementById('searchInput').value = '';
    return;
  }

  if (dedupedMatches.length > 1) {
    renderMatches(dedupedMatches);
    return;
  }

  // 3. Server API Search Fallback
  try {
    const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=50`).then(r => r.json());
    if (res.success && res.products.length > 0) {
      // Check for exact barcode/stock match in server results → show card directly
      const exactMatch = res.products.find(item =>
        (item.barcode || '').toLowerCase() === q ||
        (item.stock_code || '').toLowerCase() === q
      );
      if (exactMatch) {
        renderProduct(exactMatch);
        document.getElementById('searchInput').value = '';
        return;
      }
      // Otherwise show deduped list
      const seenSrv = new Set();
      const dedupedSrv = [];
      for (const p of res.products) {
        const key = (p.barcode || p.stock_code || p.name || '').toLowerCase();
        if (!seenSrv.has(key)) { seenSrv.add(key); dedupedSrv.push(p); }
        if (dedupedSrv.length >= 10) break;
      }
      renderMatches(dedupedSrv);
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

// Event Listeners for Search & Upload (80ms debounce for smooth typing)
let searchDebounceTimer = null;
document.getElementById('searchInput').addEventListener('input', e => {
  clearTimeout(searchDebounceTimer);
  const val = e.target.value;
  searchDebounceTimer = setTimeout(() => {
    doSearch(val, false);
  }, 80);
});
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    clearTimeout(searchDebounceTimer);
    doSearch(e.target.value, true);
  }
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

// Scanner Logic Setup

// --- SCANNER LOGIC ---
let html5QrCode = null;
let scanTarget = 'search';
const overlay = document.getElementById('scannerOverlay');

document.getElementById('scanBtn').addEventListener('click', () => startScanner('search'));
document.getElementById('scanForAddBtn').addEventListener('click', () => startScanner('add'));
if (document.getElementById('scanEditLocQrBtn')) {
  document.getElementById('scanEditLocQrBtn').addEventListener('click', () => startScanner('edit_location_qr'));
}
if (document.getElementById('scanAddLocQrBtn')) {
  document.getElementById('scanAddLocQrBtn').addEventListener('click', () => startScanner('add_location_qr'));
}
document.getElementById('closeScan').addEventListener('click', stopScanner);

async function startScanner(target) {
  scanTarget = target || 'search';
  overlay.classList.add('show');
  const hintEl = document.querySelector('.scan-hint');
  hintEl.style.color = '';
  hintEl.textContent = (target.includes('location_qr') || target.includes('loc'))
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
    autoFillAddFormForBarcode(code);
  } else if (scanTarget === 'location_qr') {
    handleLocationQRScan(code);
  } else if (scanTarget === 'edit_location_qr') {
    handleEditLocationQRScan(code);
  } else if (scanTarget === 'add_location_qr') {
    handleAddLocationQRScan(code);
  } else if (scanTarget === 'rapid_barcode') {
    handleRapidBarcodeScanned(code);
  } else if (scanTarget === 'rapid_location_qr') {
    currentRapidLocation = code.trim();
    rapidLocationBadgeVal.textContent = currentRapidLocation;
    rapidLocationBadge.style.display = 'block';
    checkRapidExistingLocationProduct();
    rfQty.focus();
  } else {
    document.getElementById('searchInput').value = code;
    doSearch(code, true);
  }
}

function handleEditLocationQRScan(code) {
  const parsed = parseLocationQR(code);
  if (parsed) {
    document.getElementById('efFloor').value = parsed.floor;
    document.getElementById('efRow').value = parsed.row;
    document.getElementById('efShelf').value = parsed.shelf;
    document.getElementById('efLevel').value = parsed.level;
    if (typeof updateEditLocationSuggestions === 'function') {
      updateEditLocationSuggestions();
    }
    document.getElementById('efQty').focus();
    showToast(`Location set: Floor ${parsed.floor}, Row ${parsed.row}, Shelf ${parsed.shelf}, Level ${parsed.level}`);
  } else {
    alert("Invalid location QR format. Expected format like '1-02-01-03'.");
  }
}

function handleAddLocationQRScan(code) {
  const parsed = parseLocationQR(code);
  if (parsed) {
    document.getElementById('fFloor').value = parsed.floor;
    document.getElementById('fRow').value = parsed.row;
    document.getElementById('fShelf').value = parsed.shelf;
    document.getElementById('fLevel').value = parsed.level;
    if (typeof updateAddLocationSuggestions === 'function') {
      updateAddLocationSuggestions();
    }
    document.getElementById('fQty').focus();
    showToast(`Location set: Floor ${parsed.floor}, Row ${parsed.row}, Shelf ${parsed.shelf}, Level ${parsed.level}`);
  } else {
    alert("Invalid location QR format. Expected format like '1-02-01-03'.");
  }
}

async function autoFillAddFormForBarcode(code) {
  if (!code) return;
  const cleanCode = code.trim().toLowerCase();
  
  let match = PRODUCTS.find(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const s = (p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === cleanCode) || (s && s === cleanCode);
  });

  if (!match) {
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(code)}&limit=5`).then(r => r.json());
      if (res.success && Array.isArray(res.products) && res.products.length > 0) {
        match = res.products.find(item =>
          (item.barcode || '').toLowerCase() === cleanCode ||
          (item.stock_code || '').toLowerCase() === cleanCode
        );
      }
    } catch (e) {}
  }

  if (match) {
    document.getElementById('fName').value = match.name || match.n || '';
    document.getElementById('fStock').value = match.stock_code || match.s || '';
    document.getElementById('fCategory').value = match.category || match.c || '';
    document.getElementById('fSubcategory').value = match.subcategory || match.sc || '';
    showToast(`Auto-filled: "${match.name || match.n}"`);
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

  // stock_code is optional; if blank, use the barcode as fallback identifier
  const effective_stock_code = stock_code || barcode || '';

  if (!name || !row || !shelf || qtyRaw === '') {
    formError.classList.add('show');
    return;
  }
  formError.classList.remove('show');

  const payload = {
    barcode,
    stock_code: effective_stock_code,
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
  document.getElementById('efCategory').value = activeProduct.category || activeProduct.c || '';
  document.getElementById('efSubcategory').value = activeProduct.subcategory || activeProduct.sc || '';
  document.getElementById('efFloor').value = activeProduct.floor || '1';
  document.getElementById('efRow').value = activeProduct.batch || activeProduct.row || '';
  document.getElementById('efShelf').value = activeProduct.shelf || '';
  document.getElementById('efLevel').value = activeProduct.level || '00';
  document.getElementById('efQty').value = activeProduct.qty !== undefined ? activeProduct.qty : 0;
  document.getElementById('efStockman').value = activeProduct.last_modified_by || activeProduct.modifiedBy || (currentUser ? currentUser.full_name : '');

  document.getElementById('efCategoryDropdown').style.display = 'none';
  document.getElementById('efCategoryDropdown').innerHTML = '';

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
  const category = document.getElementById('efCategory').value.trim();
  const subcategory = document.getElementById('efSubcategory').value.trim();
  const floor = document.getElementById('efFloor').value;
  const row = pad2(document.getElementById('efRow').value);
  const shelf = pad2(document.getElementById('efShelf').value);
  const level = pad2(document.getElementById('efLevel').value) || '00';
  const qtyRaw = document.getElementById('efQty').value.trim();
  const stockmanRaw = document.getElementById('efStockman').value.trim();

  if (!name || !row || !shelf || qtyRaw === '') {
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
    stock_code: stock_code || barcode || '',
    category: category || 'Uncategorized',
    subcategory,
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
      const skuStamp = document.getElementById('skuStamp');
      if (skuStamp) skuStamp.textContent = `${statsRes.total} SKUs mapped`;
    }
  } catch (e) {}
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('successToast');
  const hasIcon = msg.includes('⚡') || msg.includes('🔔') || msg.includes('📍') || msg.includes('✅') || msg.includes('⚠️') || msg.includes('🔒') || msg.includes('📦');
  const icon = hasIcon ? '' : '✨ ';
  t.innerHTML = `<span>${icon}${escapeHtml(msg).replace(/&amp;/g, '&')}</span>`;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
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

function renderEditCategoryDropdown(filterText = '') {
  const cleanFilter = filterText.trim().toLowerCase();
  const filtered = ALL_CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(cleanFilter)
  );

  const dropdown = document.getElementById('efCategoryDropdown');
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
        handleEditCategorySelection(cat);
      };
      dropdown.appendChild(btn);
    });
  }
}

function handleEditCategorySelection(cat) {
  document.getElementById('efCategory').value = cat;
  document.getElementById('efCategoryDropdown').style.display = 'none';
}

function showEditCategoryDropdown() {
  renderEditCategoryDropdown(document.getElementById('efCategory').value);
  document.getElementById('efCategoryDropdown').style.display = 'block';
}

// Set up listeners for edit category combobox
document.getElementById('efCategory').addEventListener('focus', showEditCategoryDropdown);
document.getElementById('efCategory').addEventListener('input', (e) => {
  renderEditCategoryDropdown(e.target.value);
  document.getElementById('efCategoryDropdown').style.display = 'block';
});

document.getElementById('efCategoryArrow').addEventListener('click', (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById('efCategoryDropdown');
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    showEditCategoryDropdown();
  }
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.combobox-container')) {
    const dropdown = document.getElementById('fCategoryDropdown');
    if (dropdown) dropdown.style.display = 'none';
    const editDropdown = document.getElementById('efCategoryDropdown');
    if (editDropdown) editDropdown.style.display = 'none';
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
  document.getElementById('efCategory').value = p.category || p.c || '';
  document.getElementById('efSubcategory').value = p.subcategory || p.sc || '';
  document.getElementById('efFloor').value = p.floor || '1';
  document.getElementById('efRow').value = p.floor !== undefined ? (p.batch || p.row || '') : '';
  document.getElementById('efShelf').value = p.shelf || '';
  document.getElementById('efLevel').value = p.level || '00';
  document.getElementById('efQty').value = p.qty !== undefined ? p.qty : '';
  document.getElementById('efStockman').value = p.last_modified_by || p.modifiedBy || (currentUser ? currentUser.full_name : '');

  document.getElementById('efCategoryDropdown').style.display = 'none';
  document.getElementById('efCategoryDropdown').innerHTML = '';

  document.getElementById('editFormError').classList.remove('show');
  document.getElementById('editOverlay').classList.add('show');
  updateEditLocationSuggestions();
};

// --- RAPID LOCATION LOGGER LOGIC ---
const rapidOverlay = document.getElementById('rapidOverlay');
const rapidNewProductFields = document.getElementById('rapidNewProductFields');
const rfName = document.getElementById('rfName');
const rfStock = document.getElementById('rfStock');
const rfCategory = document.getElementById('rfCategory');
const rfSubcategory = document.getElementById('rfSubcategory');
const rfQty = document.getElementById('rfQty');
const rapidFormError = document.getElementById('rapidFormError');
const rapidLogList = document.getElementById('rapidLogList');

const rapidBarcodeBadge = document.getElementById('rapidBarcodeBadge');
const rapidBarcodeBadgeVal = document.getElementById('rapidBarcodeBadgeVal');
const rapidLocationBadge = document.getElementById('rapidLocationBadge');
const rapidLocationBadgeVal = document.getElementById('rapidLocationBadgeVal');

let rapidLogs = [];
let currentRapidBarcode = '';
let currentRapidLocation = '';
let currentRapidExistingRow = null;

document.getElementById('rapidLoggerBtn').addEventListener('click', openRapidLogger);
document.getElementById('closeRapidBtn').addEventListener('click', closeRapidLogger);
document.getElementById('saveRapidBtn').addEventListener('click', saveRapidEntry);

document.getElementById('scanForRapidBarcodeBtn').addEventListener('click', () => startScanner('rapid_barcode'));
document.getElementById('scanForRapidLocBtn').addEventListener('click', () => startScanner('rapid_location_qr'));

function openRapidLogger() {
  currentRapidBarcode = '';
  currentRapidLocation = '';
  currentRapidExistingRow = null;
  rfName.value = '';
  rfStock.value = '';
  rfCategory.value = '';
  rfSubcategory.value = '';
  rfQty.value = '1';
  
  rapidBarcodeBadge.style.display = 'none';
  rapidLocationBadge.style.display = 'none';
  rapidNewProductFields.style.display = 'none';
  rapidFormError.classList.remove('show');
  rapidOverlay.classList.add('show');
}

function closeRapidLogger() {
  rapidOverlay.classList.remove('show');
}

// Function to handle barcode registration state change
// Uses server-side exact lookup so products added via Rapid Logger (not in local cache)
// are also correctly recognised as existing.
async function handleRapidBarcodeScanned(barcode) {
  currentRapidBarcode = barcode.trim();
  if (!currentRapidBarcode) {
    rapidBarcodeBadge.style.display = 'none';
    rapidNewProductFields.style.display = 'none';
    return;
  }

  // Show a temporary searching state
  rapidBarcodeBadgeVal.innerHTML = `${currentRapidBarcode} <br><span style="color:#64748b; font-size:12px;">Searching…</span>`;
  rapidBarcodeBadge.style.display = 'block';
  rapidBarcodeBadge.style.background = '#f8fafc';
  rapidBarcodeBadge.style.borderColor = '#cbd5e1';
  rapidBarcodeBadge.style.color = '#0f172a';

  // 1. Check local cache first (fast path)
  let found = PRODUCTS.find(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const s = (p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === currentRapidBarcode.toLowerCase()) || (s && s === currentRapidBarcode.toLowerCase());
  });

  // 2. If not in local cache, ask the server (catches newly registered products)
  if (!found) {
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(currentRapidBarcode)}&limit=5`).then(r => r.json());
      if (res.success && res.products.length > 0) {
        found = res.products.find(item =>
          (item.barcode || '').toLowerCase() === currentRapidBarcode.toLowerCase() ||
          (item.stock_code || '').toLowerCase() === currentRapidBarcode.toLowerCase()
        );
      }
    } catch (e) {
      console.warn('Server lookup failed during rapid barcode scan', e);
    }
  }

  if (found) {
    const name = found.name || found.n;
    rapidBarcodeBadgeVal.innerHTML = `${currentRapidBarcode} <br><span style="color:#16a34a; font-size:12px;">✅ Matched: ${escapeHtml(name)}</span>`;
    rapidBarcodeBadge.style.background = '#f0fdf4';
    rapidBarcodeBadge.style.borderColor = '#bbf7d0';
    rapidBarcodeBadge.style.color = '#15803d';
    rapidNewProductFields.style.display = 'none';
    rfName.value = '';
    rfStock.value = '';
    rfCategory.value = '';
    rfSubcategory.value = '';
  } else {
    rapidBarcodeBadgeVal.innerHTML = `${currentRapidBarcode} <br><span style="color:#2563eb; font-size:12px;">${CURRENT_LANG === 'en' ? '🆕 New Product — fill in details below' : '🆕 新商品 — 请填写以下资料'}</span>`;
    rapidBarcodeBadge.style.background = '#eff6ff';
    rapidBarcodeBadge.style.borderColor = '#bfdbfe';
    rapidBarcodeBadge.style.color = '#1d4ed8';
    rapidNewProductFields.style.display = 'block';
    rfStock.value = currentRapidBarcode.slice(0, 8);
    setTimeout(() => rfName.focus(), 150);
  }

  await checkRapidExistingLocationProduct();
}

// Key transitions mapping
rfName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); rfStock.focus(); }
});
rfStock.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); rfCategory.focus(); }
});
rfCategory.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); rfSubcategory.focus(); }
});
rfSubcategory.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); rfQty.focus(); }
});
rfQty.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveRapidEntry();
  }
});

async function checkRapidExistingLocationProduct() {
  currentRapidExistingRow = null;
  if (!currentRapidBarcode || !currentRapidLocation) return;

  const parsed = parseLocationQR(currentRapidLocation);
  if (!parsed) return;

  // Show a brief checking status on the location badge
  rapidLocationBadgeVal.innerHTML = `${currentRapidLocation} <br><span style="color:#64748b; font-size:11px; font-weight:500;">Checking location...</span>`;
  rapidLocationBadge.style.background = '#fffbeb';
  rapidLocationBadge.style.borderColor = '#fde68a';
  rapidLocationBadge.style.color = '#b45309';

  // 1. Search locally in PRODUCTS cache
  let match = PRODUCTS.find(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const s = (p.stock_code || p.s || '').toString().trim().toLowerCase();
    const isProductMatch = (b && b === currentRapidBarcode.toLowerCase()) || (s && s === currentRapidBarcode.toLowerCase());
    if (!isProductMatch) return false;

    const pf = String(p.floor !== undefined && p.floor !== null ? p.floor : '').trim();
    const pb = String(p.batch !== undefined && p.batch !== null ? p.batch : (p.row || '')).trim();
    const ps = String(p.shelf !== undefined && p.shelf !== null ? p.shelf : '').trim();
    const pl = String(p.level !== undefined && p.level !== null ? p.level : '').trim();

    return pf === String(parsed.floor) &&
           pb === String(parsed.row) &&
           ps === String(parsed.shelf) &&
           pl === String(parsed.level);
  });

  // 2. Fallback to a precise server lookup if not in local cache
  if (!match) {
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(currentRapidBarcode)}&limit=50`).then(r => r.json());
      if (res.success && Array.isArray(res.products)) {
        match = res.products.find(p => {
          const pf = String(p.floor !== undefined && p.floor !== null ? p.floor : '').trim();
          const pb = String(p.batch !== undefined && p.batch !== null ? p.batch : (p.row || '')).trim();
          const ps = String(p.shelf !== undefined && p.shelf !== null ? p.shelf : '').trim();
          const pl = String(p.level !== undefined && p.level !== null ? p.level : '').trim();

          return pf === String(parsed.floor) &&
                 pb === String(parsed.row) &&
                 ps === String(parsed.shelf) &&
                 pl === String(parsed.level);
        });
      }
    } catch (e) {
      console.warn("Failed to check existing product location on server:", e);
    }
  }

  if (match) {
    currentRapidExistingRow = match;
    rfQty.value = match.qty !== undefined && match.qty !== null ? match.qty : 1;
    rapidLocationBadgeVal.innerHTML = `${currentRapidLocation} <br><span style="color:#16a34a; font-size:11px; font-weight:600;">✅ Existing location: Qty ${match.qty} (will update)</span>`;
    rapidLocationBadge.style.background = '#f0fdf4';
    rapidLocationBadge.style.borderColor = '#bbf7d0';
    rapidLocationBadge.style.color = '#15803d';
  } else {
    rfQty.value = '1';
    rapidLocationBadgeVal.innerHTML = `${currentRapidLocation} <br><span style="color:#2563eb; font-size:11px; font-weight:500;">🆕 New location for this product</span>`;
    rapidLocationBadge.style.background = '#eff6ff';
    rapidLocationBadge.style.borderColor = '#bfdbfe';
    rapidLocationBadge.style.color = '#1d4ed8';
  }
}

function promptConcurrentScan(existingRow, newQty) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('concurrentOverlay');
    const stockmanEl = document.getElementById('concurrentStockman');
    const locEl = document.getElementById('concurrentLocation');
    const loggedQtyEl = document.getElementById('concurrentLoggedQty');
    const timeAgoEl = document.getElementById('concurrentTimeAgo');
    const addQtyEl = document.getElementById('concurrentAddQty');
    const replaceQtyEl = document.getElementById('concurrentReplaceQty');

    const stockmanName = existingRow.last_modified_by || existingRow.modifiedBy || 'Staff Stockman';
    stockmanEl.textContent = stockmanName;
    locEl.textContent = `Floor ${existingRow.floor || '1'}, Row ${existingRow.batch || existingRow.row || '—'}, Shelf ${existingRow.shelf || '—'}, Level ${existingRow.level || '—'}`;
    loggedQtyEl.textContent = `${existingRow.qty !== undefined ? existingRow.qty : 0} units`;

    let timeAgo = 'Recently (< 5 mins ago)';
    if (existingRow.created_at || existingRow.updated_at) {
      const diffMs = Date.now() - new Date(existingRow.updated_at || existingRow.created_at).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) timeAgo = `${diffSec} seconds ago`;
      else if (diffSec < 3600) timeAgo = `${Math.floor(diffSec / 60)} minutes ago`;
    }
    timeAgoEl.textContent = timeAgo;

    const existingQtyNum = parseInt(existingRow.qty, 10) || 0;
    const newQtyNum = parseInt(newQty, 10) || 0;
    addQtyEl.textContent = `${newQtyNum} (Total: ${existingQtyNum + newQtyNum})`;
    replaceQtyEl.textContent = `${newQtyNum}`;

    overlay.classList.add('show');

    const cancelBtn = document.getElementById('concurrentCancelBtn');
    const addBtn = document.getElementById('concurrentAddBtn');
    const replaceBtn = document.getElementById('concurrentReplaceBtn');

    function cleanup(action) {
      overlay.classList.remove('show');
      cancelBtn.onclick = null;
      addBtn.onclick = null;
      replaceBtn.onclick = null;
      resolve(action);
    }

    cancelBtn.onclick = () => cleanup('cancel');
    addBtn.onclick = () => cleanup('add');
    replaceBtn.onclick = () => cleanup('replace');
  });
}

async function saveRapidEntry() {
  const qtyRaw = rfQty.value.trim();

  if (!currentRapidBarcode) {
    rapidFormError.textContent = CURRENT_LANG === 'en' ? 'Please scan a product barcode first.' : '请先扫描商品条码。';
    rapidFormError.classList.add('show');
    return;
  }
  if (!currentRapidLocation) {
    rapidFormError.textContent = TRANSLATIONS[CURRENT_LANG].rapidLocError;
    rapidFormError.classList.add('show');
    return;
  }
  if (!qtyRaw) {
    rapidFormError.textContent = CURRENT_LANG === 'en' ? 'Please enter quantity.' : '请填写数量。';
    rapidFormError.classList.add('show');
    return;
  }

  // Fresh lookup — do NOT rely on DOM visibility (async timing issue)
  let existingProduct = PRODUCTS.find(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const s = (p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === currentRapidBarcode.toLowerCase()) || (s && s === currentRapidBarcode.toLowerCase());
  });

  // If not in local cache, ask server
  if (!existingProduct) {
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(currentRapidBarcode)}&limit=5`).then(r => r.json());
      if (res.success && res.products.length > 0) {
        existingProduct = res.products.find(item =>
          (item.barcode || '').toLowerCase() === currentRapidBarcode.toLowerCase() ||
          (item.stock_code || '').toLowerCase() === currentRapidBarcode.toLowerCase()
        );
      }
    } catch (e) { /* offline fallback */ }
  }

  // Only validate new-product fields if product truly doesn't exist
  if (!existingProduct) {
    const customName = rfName.value.trim();
    if (!customName) {
      rapidFormError.textContent = CURRENT_LANG === 'en' ? 'New product — please fill in the product name.' : '新商品 — 请填写商品名称。';
      rapidFormError.classList.add('show');
      return;
    }
  }

  const parsed = parseLocationQR(currentRapidLocation);
  if (!parsed) {
    rapidFormError.textContent = TRANSLATIONS[CURRENT_LANG].rapidLocError;
    rapidFormError.classList.add('show');
    return;
  }

  rapidFormError.classList.remove('show');
  showToast(CURRENT_LANG === 'en' ? 'Saving location...' : '正在登记库位...');

  const payload = {
    barcode: existingProduct ? (existingProduct.barcode || existingProduct.b || currentRapidBarcode) : currentRapidBarcode,
    stock_code: existingProduct ? (existingProduct.stock_code || existingProduct.s || rfStock.value.trim()) : rfStock.value.trim(),
    name: existingProduct ? (existingProduct.name || existingProduct.n) : rfName.value.trim(),
    category: existingProduct ? (existingProduct.category || existingProduct.c || 'Uncategorized') : (rfCategory.value.trim() || 'Uncategorized'),
    subcategory: existingProduct ? (existingProduct.subcategory || existingProduct.sc || '') : rfSubcategory.value.trim(),
    floor: parsed.floor,
    batch: parsed.row,
    shelf: parsed.shelf,
    level: parsed.level,
    qty: parseInt(qtyRaw, 10) || 0,
    last_modified_by: currentUser ? currentUser.full_name : 'Rapid Logger'
  };

  // Concurrent Multi-User Duplicate Safeguard
  if (currentRapidExistingRow) {
    const userAction = await promptConcurrentScan(currentRapidExistingRow, payload.qty);
    if (userAction === 'cancel') {
      showToast(CURRENT_LANG === 'en' ? 'Scan cancelled — duplicate entry prevented.' : '已取消登记 — 已防止重复记录。');
      return;
    }
    if (userAction === 'add') {
      payload.qty = (parseInt(currentRapidExistingRow.qty, 10) || 0) + parseInt(payload.qty, 10);
    }
  }

  try {
    const isUnmappedMaster = existingProduct && (!existingProduct.floor || String(existingProduct.floor).trim() === '' || !existingProduct.loc || String(existingProduct.loc).trim() === '');
    const targetRow = currentRapidExistingRow || (isUnmappedMaster ? existingProduct : null);

    const url = targetRow ? `/api/products/${targetRow.id}` : '/api/products';
    const method = targetRow ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success) {
      showToast(TRANSLATIONS[CURRENT_LANG].rapidSaved);

      // Add to session logs list
      const logText = `[${new Date().toLocaleTimeString()}] ${payload.name} (${payload.barcode}) &rarr; 📍 ${currentRapidLocation} [Qty: ${payload.qty}]`;
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

        // Real-time UI update: if the active product matches the rapid logger product, re-render it!
        if (activeProduct) {
          const actBar = (activeProduct.barcode || activeProduct.b || '').toString().toLowerCase();
          const actStk = (activeProduct.stock_code || activeProduct.s || '').toString().toLowerCase();
          const rapidBar = payload.barcode.toLowerCase();
          const rapidStk = payload.stock_code.toLowerCase();

          if ((actBar && (actBar === rapidBar || actBar === rapidStk)) || 
              (actStk && (actStk === rapidBar || actStk === rapidStk))) {
            const freshMatch = PRODUCTS.find(p => {
              const pb = (p.barcode || p.b || '').toString().toLowerCase();
              const ps = (p.stock_code || p.s || '').toString().toLowerCase();
              return (pb && pb === actBar) || (ps && ps === actStk);
            });
            if (freshMatch) {
              renderProduct(freshMatch);
            }
          }
        }
      }

      // Reset logger fields
      currentRapidBarcode = '';
      currentRapidLocation = '';
      currentRapidExistingRow = null;
      rfName.value = '';
      rfStock.value = '';
      rfCategory.value = '';
      rfSubcategory.value = '';
      rfQty.value = '1';

      rapidBarcodeBadge.style.display = 'none';
      rapidLocationBadge.style.display = 'none';
      rapidNewProductFields.style.display = 'none';
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

// Quick Search QR Board logic
const qrBoardOverlay = document.getElementById('qrBoardOverlay');
const showQrBoardBtn = document.getElementById('showQrBoardBtn');
const closeQrBoardBtn = document.getElementById('closeQrBoardBtn');
const printQrBoardBtn = document.getElementById('printQrBoardBtn');
const qrBoardCodeImg = document.getElementById('qrBoardCodeImg');
const qrBoardUrlText = document.getElementById('qrBoardUrlText');

if (showQrBoardBtn) {
  showQrBoardBtn.addEventListener('click', async () => {
    let guestUrl = `${window.location.origin}${window.location.pathname}?mode=guest`;
    
    // Substitute localhost/127.0.0.1 with local network IP for mobile device access
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        const hostRes = await fetch('/api/host-info').then(r => r.json());
        if (hostRes.success && hostRes.localIp && hostRes.localIp !== 'localhost') {
          guestUrl = `${window.location.protocol}//${hostRes.localIp}:${hostRes.port}${window.location.pathname}?mode=guest`;
        }
      } catch (e) {
        console.warn("Could not retrieve local host IP from server:", e);
      }
    }
    
    // Generate QR locally (works offline on the warehouse LAN);
    // fall back to the remote API only if the vendored lib failed to load
    const container = document.getElementById('qrBoardCodeContainer');
    if (window.QRCode && container) {
      container.innerHTML = '';
      container.style.display = 'block';
      qrBoardCodeImg.style.display = 'none';
      new QRCode(container, {
        text: guestUrl,
        width: 250,
        height: 250,
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      if (container) container.style.display = 'none';
      qrBoardCodeImg.style.display = 'block';
      qrBoardCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(guestUrl)}`;
    }
    
    // Display textual URL
    qrBoardUrlText.textContent = guestUrl;
    
    // Open the overlay
    qrBoardOverlay.classList.add('show');
  });
}

if (closeQrBoardBtn) {
  closeQrBoardBtn.addEventListener('click', () => {
    qrBoardOverlay.classList.remove('show');
  });
}

if (printQrBoardBtn) {
  printQrBoardBtn.addEventListener('click', () => {
    window.print();
  });
}

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
