window.addEventListener('unhandledrejection', (e) => {
  console.error('[APP ERROR] Unhandled Promise Rejection:', e.reason);
  e.preventDefault();
});
window.onerror = (msg, src, line, col, err) => {
  console.error('[APP ERROR]', msg, 'at', src, line, col, err);
  return true;
};

function validateQty(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === '') return 0;
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < 0 || String(n) !== String(raw).trim()) return null;
  return n;
}

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
    recentPrev: "Prev",
    recentNext: "Next",
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
    editFormErrorRequired: "Please fill in Product Name, Stock No., Floor, Row, Shelf, Level, On Hand Quantity, and Responsible Stockman.",
    detailsTitle: "Product Details & Location",
    detailsSub: "View details or update shelf position for this item in the database.",
    barcode: "Barcode",
    onHand: "On hand",
    inventoryControl: "Inventory control",
    inventoryAvailable: "Available",
    inventoryReserved: "Reserved",
    inventoryReceiving: "Receiving",
    inventoryBulkCarton: "Bulk / carton",
    inventoryShelf: "Shelf",
    inventoryCalculated: "Calculated",
    inventoryDirectDelivery: "Direct Delivery",
    editLocDetails: "Edit Location / Details",
    scanNewLoc: "Scan QR for New Location",
    rapidTitle: "Rapid Location Logger",
    rapidSub: "Quickly scan a product, scan its location QR, and save. Repeat for high-speed mapping.",
    rapidBarcodeLabel: "1. Scan / Search Product",
    rapidSearchPlaceholder: "Search product name, code, barcode...",
    rapidLocLabel: "2. Scan Location QR",
    rapidQtyLabel: "Quantity",
    rapidSubmit: "Add & Next",
    rapidSuccessLog: "Last Registered Items (This Session)",
    rapidLocError: "Invalid location format. Expected format like '1-02-01-03'.",
    rapidSaved: "Location mapped successfully!",
    notFoundTitle: "Product Not Found",
    notFoundBtn: "Add Product",
    loginTitle: "Sign In",
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
    cardTransferBtn: "Transfer",
    cardAddStockBtn: "Add Stock",
    cardEditBtn: "Edit",
    cardDeleteLoc: "Delete",
    quickSearchBoard: "Search Board QR",
    qrBoardTitle: "Quick Search Display Board",
    qrBoardSub: "Print this board and post it on your warehouse walls or doors. Customers and staff can scan it to instantly find product locations on their phones without logging in.",
    qrBoardInstructions: "1. Scan the QR code below using your phone's camera.<br>2. Search by product name or scan a barcode to see its location immediately.",
    printPoster: "Print Poster",
    addAnotherLocTitle: "Add Another Location",
    addAnotherLocSub: "Tap a location below to update its stock, or click Add Another Location.",
    currentlyMappedLocs: "Mapped Locations",
    newLocToAdd: "New Location Scanned:",
    addAnotherLocBtn: "Add Another Location",
    locProductsTitle: "Products at Location",
    closeBtn: "Close",
    locProductsEmpty: "No products found at this location.",
    importDataBtn: "Import Data",
    exportDataBtn: "Export XLSX",
    searchViewBtn: "Search View",
    importingBtn: "Importing...",
    cartonBtn: "Big Items",
    saNavCartonBtn: "Carton Putaway",
    cartonModalTitle: "Carton Putaway",
    cartonModalSub: "Set shelf location for bulk carton items",
    cartonStep1: "Step 1: Scan / Search Product",
    cartonSearchPlaceholder: "Search product name, stock code, or barcode...",
    cartonItemFound: "Item Found",
    cartonStep2: "Step 2: Shelf Location",
    cartonScanQR: "📷 Scan QR Code",
    cartonStep3: "Step 3: Quantity",
    cartonSaveBtn: "Confirm & Save Location",
    cartonAddNew: "Add New Product to System",
    saEnterpriseAdmin: "Enterprise Admin",
    saSignOut: "Sign Out",
    saNavigation: "Navigation",
    saNavMaster: "Master Inventory",
    saNavOrders: "Delivery Routes",
    saNavAddProduct: "Add New Product",
    saNavAudit: "Audit Shelf QR",
    saRole: "Super Admin",
    saRoleSub: "Online · Full Access",
    saHeaderTitle: "Master Inventory",
    saHeaderSub: "Live warehouse catalog, storage coordinates, mapping health, and SKU stock tracking",
    saKpiTotal: "Total SKUs",
    saKpiTotalSub: "All catalog items",
    saKpiMapped: "Mapped Locations",
    saKpiMappedSub: "Active shelf coordinates",
    saKpiUnmapped: "Unmapped Items",
    saKpiUnmappedSub: "Requires shelf assignment",
    saKpiQty: "Total Quantity",
    saKpiQtySub: "Total on-hand units",
    saSearchPlaceholder: "Search by name, barcode, stock no...",
    saFilterStatusAll: "All Status",
    saFilterStatusMapped: "Mapped Only",
    saFilterStatusUnmapped: "Unmapped Only",
    saFilterFloorAll: "All Floors",
    saFilterFloor1: "1st Floor",
    saFilterFloor2: "2nd Floor",
    saFilterFloor3: "3rd Floor",
    thProdName: "Product Name",
    thStockNo: "Stock No",
    thBarcode: "Barcode",
    thCategory: "Department / Category",
    thLocation: "Shelf Location",
    thQty: "On-Hand Qty",
    thStatus: "Status",
    thReset: "Reset Loc",
    thAction: "Action",
    pagePrev: "Previous",
    pageNext: "Next",
    scanLocationQrBtn: "Scan Location QR",
    addStockTitle: "Add Stock to Location",
    addStockSub: "Sum incoming stock to existing location quantity",
    addStockCurrent: "Current Stock",
    addStockNew: "+ Add New Qty",
    addStockCalc: "Calculation: ",
    addStockEditAll: "✏️ Edit All Location Details",
    addStockTargetLoc: "📍 Target Location:"
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
    recentPrev: "上一页",
    recentNext: "下一页",
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
    editFormErrorRequired: "请填写商品名称、货号、楼层、排号、货架号、层数、现有库存数量和负责理货员。",
    detailsTitle: "商品详情与库位",
    detailsSub: "在数据库中查看详情或更新商品货架位置。",
    barcode: "条形码",
    onHand: "现有库存",
    inventoryControl: "库存控制",
    inventoryAvailable: "可用库存",
    inventoryReserved: "已预留",
    inventoryReceiving: "收货区",
    inventoryBulkCarton: "散装 / 整箱",
    inventoryShelf: "货架",
    inventoryCalculated: "系统计算",
    inventoryDirectDelivery: "直接配送",
    editLocDetails: "编辑库位 / 详情",
    scanNewLoc: "扫描二维码添加新位置",
    rapidTitle: "快速位置登记",
    rapidSub: "快速扫描商品条码，扫描库位二维码并保存。适合批量高速库位登记。",
    rapidBarcodeLabel: "1. 搜索或扫描商品",
    rapidSearchPlaceholder: "搜索商品名称、货号或条形码...",
    rapidLocLabel: "2. 扫描库位二维码",
    rapidQtyLabel: "数量",
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
    cardLocationQty: "库位库存",
    cardTransferBtn: "转移库存",
    cardAddStockBtn: "添加库存",
    cardEditBtn: "编辑商品",
    cardDeleteLoc: "删除库位",
    quickSearchBoard: "查询看板 QR",
    qrBoardTitle: "自助查询引导看板",
    qrBoardSub: "打印此看板并贴在仓库墙壁或通道门上。理货员或客户只需用手机扫描即可免登录自助查询商品货位。",
    qrBoardInstructions: "1. 使用手机相机扫描下方二维码。<br>2. 输入商品名称或扫描商品条码，即可立即查看其架上位置。",
    printPoster: "打印海报",
    addAnotherLocTitle: "添加额外库位",
    addAnotherLocSub: "点击下方库位更新库存，或点击添加额外库位。",
    currentlyMappedLocs: "已映射库位",
    newLocToAdd: "扫描到的新库位：",
    addAnotherLocBtn: "添加额外库位",
    locProductsTitle: "该位置的商品",
    closeBtn: "关闭",
    locProductsEmpty: "未找到属于该位置的商品。",
    importDataBtn: "导入数据",
    exportDataBtn: "导出 XLSX",
    searchViewBtn: "搜索视图",
    importingBtn: "导入中...",
    cartonBtn: "大件商品",
    saNavCartonBtn: "纸箱上架",
    cartonModalTitle: "纸箱上架",
    cartonModalSub: "设置大件纸箱商品的货架位置",
    cartonStep1: "第 1 步：扫描或搜索商品",
    cartonSearchPlaceholder: "搜索商品名称、货号或条形码...",
    cartonItemFound: "已找到商品",
    cartonStep2: "第 2 步：货架位置",
    cartonScanQR: "📷 扫描二维码",
    cartonStep3: "第 3 步：数量",
    cartonSaveBtn: "确认并保存位置",
    cartonAddNew: "在系统中注册新商品",
    saEnterpriseAdmin: "企业管理员",
    saSignOut: "退出登录",
    saNavigation: "导航栏",
    saNavMaster: "主库存",
    saNavOrders: "配送路线",
    saNavAddProduct: "添加新商品",
    saNavAudit: "审核货架二维码",
    saRole: "超级管理员",
    saRoleSub: "在线 · 完全访问",
    saHeaderTitle: "主库存",
    saHeaderSub: "实时仓库目录、存储坐标、映射健康状况及SKU库存跟踪",
    saKpiTotal: "总 SKU 数",
    saKpiTotalSub: "所有目录商品",
    saKpiMapped: "已映射位置",
    saKpiMappedSub: "有效货架坐标",
    saKpiUnmapped: "未映射商品",
    saKpiUnmappedSub: "需分配货架",
    saKpiQty: "总数量",
    saKpiQtySub: "总现有库存数",
    saSearchPlaceholder: "通过名称、条码、存货号搜索...",
    saFilterStatusAll: "所有状态",
    saFilterStatusMapped: "仅已映射",
    saFilterStatusUnmapped: "仅未映射",
    saFilterFloorAll: "所有楼层",
    saFilterFloor1: "1楼",
    saFilterFloor2: "2楼",
    saFilterFloor3: "3楼",
    thProdName: "商品名称",
    thStockNo: "存货号",
    thBarcode: "条形码",
    thCategory: "部门 / 类别",
    thLocation: "货架位置",
    thQty: "现有库存",
    thStatus: "状态",
    thReset: "重置位置",
    thAction: "操作",
    pagePrev: "上一页",
    pageNext: "下一页",
    scanLocationQrBtn: "扫描位置二维码",
    addStockTitle: "添加库存到库位",
    addStockSub: "将新进库存与现有位置数量相加",
    addStockCurrent: "当前库存",
    addStockNew: "+ 添加新数量",
    addStockCalc: "计算方式：",
    addStockEditAll: "✏️ 编辑所有位置详情",
    addStockTargetLoc: "📍 目标库位："
  }
};

let CURRENT_LANG = localStorage.getItem('wh_lang') || 'en';
let isGuestMode = false;

let PRODUCTS = [];
let productsData = [];
let byBarcode = {};
let byStock = {};
let byBarcodeMap = new Map();
let byStockMap = new Map();

let currentUser = null;
try {
  const savedUser = localStorage.getItem('wh_current_user');
  if (savedUser) currentUser = JSON.parse(savedUser);
} catch (e) { currentUser = null; }

function authFetch(url, options = {}) {
  const token = localStorage.getItem('wh_token');
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers, credentials: 'include' });
}

// Returns a user-specific localStorage key so each user has separate recent lookups
function recentKey() {
  const uid = currentUser ? currentUser.username : 'guest';
  return `wh_recent_${uid}`;
}

let recent = [];
let recentPage = 1;
const recentPageSize = 5;
try {
  const saved = localStorage.getItem(recentKey());
  if (saved) recent = JSON.parse(saved);
} catch (e) { recent = []; }


function updateUserUI() {
  const userBadge = document.getElementById('userBadge');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const authBtn = document.getElementById('authBtn');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const loginOverlay = document.getElementById('loginOverlay');
  const scanQrBtn = document.getElementById('scanLocationQrBtn');
  const rapidBtn = document.getElementById('rapidLoggerBtn');
  const auditBtn = document.getElementById('auditLocationQrBtn');
  const mainAppWrapper = document.getElementById('mainAppWrapper');
  const superAdminPortalView = document.getElementById('superAdminPortalView');

  const cartonBtn = document.getElementById('cartonPutawayBtn');
  const ordersBtn = document.getElementById('ordersBtn');
  const adminBtn = document.getElementById('adminDashboardBtn');

  const isCartonHandler = currentUser && (currentUser.role === 'carton_handler' || currentUser.username === 'carton' || currentUser.username === 'cartonhandler');
  const isAdminOrSuper = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.username === 'admin' || currentUser.username === 'superadmin');
  if (cartonBtn) cartonBtn.style.display = (isAdminOrSuper || isCartonHandler || (currentUser && currentUser.role === 'stockman')) ? 'inline-flex' : 'none';
  if (ordersBtn) ordersBtn.style.display = isAdminOrSuper ? 'flex' : 'none';
  if (adminBtn) adminBtn.style.display = isAdminOrSuper ? 'flex' : 'none';

  if (currentUser) {
    userBadge.style.display = 'flex';
    const roleIcon = currentUser.role === 'superadmin' ? '🛡️ ' : (currentUser.role === 'carton_handler' ? '📦 ' : (currentUser.role === 'checker' ? '🔍 ' : '👤 '));
    userNameDisplay.textContent = `${roleIcon}${currentUser.full_name}`;
    authBtn.textContent = CURRENT_LANG === 'en' ? 'Logout' : '登出';
    authBtn.className = 'user-auth-btn logout';
    closeLoginModal.style.display = 'block';
    loginOverlay.classList.remove('show');

    const superAdminPortalView = document.getElementById('superAdminPortalView');
    if (currentUser.role === 'superadmin' || currentUser.username === 'superadmin') {
      if (mainAppWrapper && !window.forceUserAppMode) mainAppWrapper.style.display = 'none';
      if (superAdminPortalView && !window.forceUserAppMode) {
        superAdminPortalView.style.display = 'block';
        let savedSuperadminView = 'master';
        try { savedSuperadminView = localStorage.getItem('wh_superadmin_view') || 'master'; } catch (err) { /* storage is optional */ }
        if (savedSuperadminView === 'operations') {
          void renderSuperadminOperations();
        } else if (savedSuperadminView === 'system-stock') {
          void renderSuperadminSystemStock();
        } else if (savedSuperadminView === 'notifications') {
          renderSuperadminNotifications();
        } else {
          setSuperadminView('master');
          renderPortalDataTable();
        }
        startPortalLiveUpdates();
      }
      if (mainAppWrapper && window.forceUserAppMode) mainAppWrapper.style.display = 'block';
      if (superAdminPortalView && window.forceUserAppMode) {
        superAdminPortalView.style.display = 'none';
        stopPortalLiveUpdates();
      }
    } else {
      stopPortalLiveUpdates();
      if (mainAppWrapper) mainAppWrapper.style.display = 'block';
      if (superAdminPortalView) superAdminPortalView.style.display = 'none';
    }

    if (currentUser.role === 'checker') {
      if (rapidBtn) rapidBtn.style.display = 'none';
      if (auditBtn) auditBtn.style.display = 'inline-flex';
    } else if (currentUser.role === 'carton_handler' || currentUser.username === 'carton' || currentUser.username === 'cartonhandler') {
      if (rapidBtn) rapidBtn.style.display = 'none';
      if (auditBtn) auditBtn.style.display = 'none';
    } else {
      if (rapidBtn) rapidBtn.style.display = 'inline-flex';
      if (auditBtn) auditBtn.style.display = 'none';
    }
  } else {
    stopPortalLiveUpdates();
    const superAdminPortalView = document.getElementById('superAdminPortalView');
    if (mainAppWrapper) mainAppWrapper.style.display = 'block';
    if (superAdminPortalView) superAdminPortalView.style.display = 'none';
    userBadge.style.display = 'none';
    closeLoginModal.style.display = 'none';
    document.getElementById('loginFormError').style.display = 'none';
    loginOverlay.classList.add('show');
    if (rapidBtn) rapidBtn.style.display = 'none';
    if (auditBtn) auditBtn.style.display = 'none';
  }
}

const INVENTORY_SYNC_QUEUE_KEY = 'wh_inventory_sync_queue';

function updateInventorySyncStatus(message, state = '') {
  const status = document.getElementById('inventorySyncStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('is-pending', state === 'pending');
  status.classList.toggle('is-offline', state === 'offline');
}

function isNetworkFailure(error) {
  return !navigator.onLine || /failed to fetch|network|timeout|load failed/i.test(String(error?.message || error || ''));
}

function queuedInventoryActions() {
  try { return JSON.parse(localStorage.getItem(INVENTORY_SYNC_QUEUE_KEY) || '[]'); } catch (err) { return []; }
}

function queueInventoryAction(url, body, label) {
  const pending = queuedInventoryActions();
  pending.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, url, body, label, createdAt: new Date().toISOString() });
  localStorage.setItem(INVENTORY_SYNC_QUEUE_KEY, JSON.stringify(pending.slice(-50)));
  updateInventorySyncStatus(`${pending.length} saved action${pending.length === 1 ? '' : 's'} waiting to sync`, 'pending');
}

async function flushInventorySyncQueue() {
  const pending = queuedInventoryActions();
  if (!pending.length) { updateInventorySyncStatus('Ready to sync'); return; }
  if (!navigator.onLine) { updateInventorySyncStatus(`${pending.length} saved action${pending.length === 1 ? '' : 's'} waiting for connection`, 'offline'); return; }
  const remaining = [];
  for (const action of pending) {
    try {
      const response = await authFetch(action.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action.body) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not sync saved action.');
    } catch (err) { remaining.push(action); }
  }
  localStorage.setItem(INVENTORY_SYNC_QUEUE_KEY, JSON.stringify(remaining));
  updateInventorySyncStatus(remaining.length ? `${remaining.length} saved action${remaining.length === 1 ? '' : 's'} waiting to sync` : 'All saved actions synced', remaining.length ? 'pending' : '');
  if (!remaining.length) showToast('Saved inventory actions synced.');
}

window.addEventListener('online', () => { void flushInventorySyncQueue(); });
window.addEventListener('offline', () => updateInventorySyncStatus('Offline — saved actions will sync later', 'offline'));
void flushInventorySyncQueue();

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
  renderRecent();
}

let activeProduct = null;

let searchIndexWarmupPromise = null;
let searchIndexDbPromise = null;
let searchIndexPersistTimer = null;

function getSearchIndexDb() {
  if (searchIndexDbPromise) return searchIndexDbPromise;
  if (!window.indexedDB) return Promise.resolve(null);
  searchIndexDbPromise = new Promise(resolve => {
    const request = window.indexedDB.open('product-locator-cache', 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('search')) {
        request.result.createObjectStore('search');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
  return searchIndexDbPromise;
}

async function readCachedSearchIndex() {
  const db = await getSearchIndexDb();
  if (!db) return null;
  return new Promise(resolve => {
    const request = db.transaction('search', 'readonly').objectStore('search').get('products-v2');
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : null);
    request.onerror = () => resolve(null);
  });
}

async function writeCachedSearchIndex(products) {
  const db = await getSearchIndexDb();
  if (!db || !Array.isArray(products)) return;
  try {
    db.transaction('search', 'readwrite').objectStore('search').put(products, 'products-v2');
  } catch (err) {
    console.warn('Could not persist search index cache:', err);
  }
}

// Keep the local-first search cache current after a location is saved. This
// makes the next search (including after a page refresh) use the new location
// without waiting for a full catalog download.
function persistSearchIndexSoon() {
  clearTimeout(searchIndexPersistTimer);
  searchIndexPersistTimer = setTimeout(() => {
    const snapshot = PRODUCTS.map(product => {
      const clean = {};
      Object.entries(product).forEach(([key, value]) => {
        if (!key.startsWith('_')) clean[key] = value;
      });
      return clean;
    });
    void writeCachedSearchIndex(snapshot);
  }, 120);
}

function applySearchIndex(products) {
  if (!Array.isArray(products)) return;

  // Preserve newer records already fetched or edited while the index was
  // loading, then rebuild all O(1) barcode/stock and text indexes.
  const existingById = new Map(PRODUCTS.map(p => [String(p.id), p]));
  PRODUCTS = products.map(p => {
    const existing = existingById.get(String(p.id));
    return existing ? { ...p, ...existing } : p;
  });
  productsData = PRODUCTS;
  rebuildIndex();

  // If typing started before warm-up finished, repaint immediately from
  // the local catalog instead of waiting for the remote search response.
  const input = document.getElementById('searchInput');
  const value = input ? input.value.trim() : '';
  if (value) doSearch(value, false);
}

// Warm the compact catalog in the background. The browser keeps this GET in
// its HTTP cache and IndexedDB, so a normal refresh can rebuild the local
// search index without waiting for the database or a request per keystroke.
async function warmSearchIndex() {
  if (searchIndexWarmupPromise) return searchIndexWarmupPromise;
  searchIndexWarmupPromise = (async () => {
    const cachedIndexPromise = readCachedSearchIndex();
    const networkIndexPromise = fetch('/api/products/all?searchIndex=1&v=2', { cache: 'force-cache' })
      .then(res => res.json());

    try {
      const cachedProducts = await cachedIndexPromise;
      if (cachedProducts) applySearchIndex(cachedProducts);
    } catch (err) {
      console.warn('Cached search index load failed:', err);
    }

    try {
      const data = await networkIndexPromise;
      if (data.success && Array.isArray(data.products)) {
        applySearchIndex(data.products);
        // Persist the full index so subsequent refreshes are local-first.
        writeCachedSearchIndex(data.products);
      }
    } catch (err) {
      // The API search fallback remains active when the index is unavailable.
      console.warn('Search index warm-up failed:', err);
    }
  })().finally(() => {
    searchIndexWarmupPromise = null;
  });
  return searchIndexWarmupPromise;
}

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

  // Paint the app shell immediately — data syncs in behind it instead of
  // holding the UI hostage behind a full-catalog download.
  document.getElementById('skeletonState').style.display = 'none';
  document.getElementById('emptyState').style.display = 'block';
  if (!activeProduct) {
    document.getElementById('emptyPrompt').style.display = 'flex';
  }
  renderRecent();

  try {
    // Start immediately, without delaying the shell or first keystroke.
    warmSearchIndex();

    // Stats badge updates whenever the server answers (non-blocking).
    fetch('/api/stats').then(r => r.json()).then(statsRes => {
      if (statsRes && statsRes.success) {
        const skuStamp = document.getElementById('skuStamp');
        if (skuStamp) skuStamp.textContent = `${statsRes.total} SKUs mapped`;
        document.getElementById('footerText').textContent = `Database Connected · ${statsRes.total} SKUs mapped`;
      }
    }).catch(e => console.warn('Stats fetch failed:', e));

    // Supabase Realtime WebSocket Subscription for instant multi-stockman push updates!
    try {
      void startProductRealtime();
      if (false) {
        window.supabase.channel('products_realtime_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
            const item = payload.new;
            if (item && (item.product_name || item.barcode)) {
              const stockman = item.last_modified_by ? `by ${item.last_modified_by}` : '';
              showToast(`🔔 Stock updated ${stockman}: ${item.product_name || item.barcode} (Qty: ${item.qty})`);
              
              const existingIdx = PRODUCTS.findIndex(p => p.id === item.id);
              if (existingIdx >= 0) {
                PRODUCTS[existingIdx] = item;
              } else {
                PRODUCTS.push(item);
              }
              rebuildIndex();

              if (activeProduct && ((activeProduct.barcode && activeProduct.barcode === item.barcode) || (activeProduct.barcode_2 && activeProduct.barcode_2 === item.barcode_2) || (activeProduct.stock_no && activeProduct.stock_no === item.stock_no))) {
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
}

const mappedSkus = new Set();
const skuToMappedLoc = new Map();

function rebuildIndex() {
  byBarcode = {};
  byStock = {};
  byBarcodeMap.clear();
  byStockMap.clear();
  mappedSkus.clear();
  skuToMappedLoc.clear();

  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
    const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
    const n = (p.product_name || p.name || p.n || '').toString().trim().toLowerCase();
    const c = (p.category || p.c || '').toString().trim().toLowerCase();
    const d = (p.department || p.subcategory || p.sc || '').toString().trim().toLowerCase();

    p._b = b;
    p._b2 = b2;
    p._s = s;
    p._n = n;
    p._c = c;
    p._d = d;
    p._bStripped = b ? b.replace(/^0+/, '') : '';
    p._b2Stripped = b2 ? b2.replace(/^0+/, '') : '';
    p._sStripped = s ? s.replace(/^0+/, '') : '';
    p._searchStr = `${b} ${b2} ${s} ${n} ${c} ${d}`;
    p._searchStrStripped = p._searchStr.replace(/0+/g, '');
    p._words = n ? n.split(/\s+/) : [];

    const floor = (p.floor !== undefined && p.floor !== null) ? String(p.floor).trim() : '';
    const row = (p.row !== undefined && p.row !== null) ? String(p.row).trim() : ((p.batch !== undefined && p.batch !== null) ? String(p.batch).trim() : '');
    const shelf = (p.shelf !== undefined && p.shelf !== null) ? String(p.shelf).trim() : '';
    const locText = (p.loc || p.loc_full || p.storage_location || p.location_storage || '').trim();
    const isMapped = (floor !== '' && floor !== '0' && floor !== '00') ||
                     (row !== '' && row !== '0' && row !== '00') ||
                     (shelf !== '' && shelf !== '0' && shelf !== '00') ||
                     (locText !== '' && locText !== '—') ||
                     Boolean(p.status && String(p.status).toUpperCase() === 'MAPPED');

    p._hasLoc = isMapped;

    if (isMapped) {
      if (b) {
        mappedSkus.add(b);
        if (!skuToMappedLoc.has(b)) skuToMappedLoc.set(b, p);
      }
      if (b2) {
        mappedSkus.add(b2);
        if (!skuToMappedLoc.has(b2)) skuToMappedLoc.set(b2, p);
      }
      if (s) {
        mappedSkus.add(s);
        if (!skuToMappedLoc.has(s)) skuToMappedLoc.set(s, p);
      }
    }

    if (b) {
      const existing = byBarcodeMap.get(b);
      if (!existing || (!existing._hasLoc && isMapped)) {
        byBarcode[b] = p;
        byBarcodeMap.set(b, p);
      }

      if (p._bStripped && p._bStripped !== b) {
        const existingS = byBarcodeMap.get(p._bStripped);
        if (!existingS || (!existingS._hasLoc && isMapped)) {
          byBarcodeMap.set(p._bStripped, p);
          byBarcode[p._bStripped] = p;
        }
      }

      const cleanAlpha = b.replace(/[^a-z0-9]/gi, '');
      if (cleanAlpha && cleanAlpha !== b && cleanAlpha !== p._bStripped) {
        const existingA = byBarcodeMap.get(cleanAlpha);
        if (!existingA || (!existingA._hasLoc && isMapped)) {
          byBarcodeMap.set(cleanAlpha, p);
        }
      }
    }
    
    if (b2) {
      const existing2 = byBarcodeMap.get(b2);
      if (!existing2 || (!existing2._hasLoc && isMapped)) {
        byBarcode[b2] = p;
        byBarcodeMap.set(b2, p);
      }

      if (p._b2Stripped && p._b2Stripped !== b2) {
        const existing2S = byBarcodeMap.get(p._b2Stripped);
        if (!existing2S || (!existing2S._hasLoc && isMapped)) {
          byBarcodeMap.set(p._b2Stripped, p);
          byBarcode[p._b2Stripped] = p;
        }
      }

      const cleanAlpha2 = b2.replace(/[^a-z0-9]/gi, '');
      if (cleanAlpha2 && cleanAlpha2 !== b2 && cleanAlpha2 !== p._b2Stripped) {
        const existingA2 = byBarcodeMap.get(cleanAlpha2);
        if (!existingA2 || (!existingA2._hasLoc && isMapped)) {
          byBarcodeMap.set(cleanAlpha2, p);
        }
      }
    }
    if (s) {
      const existingStock = byStockMap.get(s);
      if (!existingStock || (!existingStock._hasLoc && isMapped)) {
        byStock[s] = p;
        byStockMap.set(s, p);
      }

      if (p._sStripped && p._sStripped !== s) {
        const existingStockS = byStockMap.get(p._sStripped);
        if (!existingStockS || (!existingStockS._hasLoc && isMapped)) {
          byStockMap.set(p._sStripped, p);
          byStock[p._sStripped] = p;
        }
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

function expandLocationsList(items) {
  const result = [];
  items.forEach(item => {
    if (Array.isArray(item.locations) && item.locations.length > 0) {
      item.locations.forEach(subLoc => {
        result.push({
          ...item,
          ...subLoc,
          floor: (subLoc.floor !== undefined && subLoc.floor !== null && String(subLoc.floor).trim() !== '') ? String(subLoc.floor).trim() : (item.floor || ''),
          row: (subLoc.row !== undefined && subLoc.row !== null && String(subLoc.row).trim() !== '') ? String(subLoc.row).trim() : (subLoc.batch || item.batch || item.row || ''),
          shelf: (subLoc.shelf !== undefined && subLoc.shelf !== null && String(subLoc.shelf).trim() !== '') ? String(subLoc.shelf).trim() : (item.shelf || ''),
          level: (subLoc.level !== undefined && subLoc.level !== null && String(subLoc.level).trim() !== '') ? String(subLoc.level).trim() : (item.level || ''),
          qty: subLoc.qty !== undefined ? subLoc.qty : item.qty,
          status: subLoc.status || item.status || (subLoc.floor ? 'MAPPED' : 'UNMAPPED'),
          last_modified_by: subLoc.last_modified_by || item.last_modified_by
        });
      });
    } else {
      result.push(item);
    }
  });
  return result;
}

function getLocationsForProduct(product) {
  if (!product) return [];

  const barcode = (product.barcode || product.b || '').toString().trim().toLowerCase();
  const barcode2 = (product.barcode_2 || product.b2 || '').toString().trim().toLowerCase();
  const stockCode = (product.stock_no || product.stock_code || product.s || '').toString().trim().toLowerCase();

  let matched = [];
  if (barcode || barcode2 || stockCode) {
    matched = PRODUCTS.filter(p => {
      const pBarcode = (p.barcode || p.b || '').toString().trim().toLowerCase();
      const pBarcode2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
      const pStock = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();

      if (barcode && pBarcode && barcode === pBarcode) return true;
      if (barcode && pBarcode2 && barcode === pBarcode2) return true;
      if (barcode2 && pBarcode && barcode2 === pBarcode) return true;
      if (barcode2 && pBarcode2 && barcode2 === pBarcode2) return true;
      if (stockCode && pStock && stockCode === pStock) return true;
      return false;
    });
  }

  const sourceList = matched.length > 0 ? matched : [product];
  return expandLocationsList(sourceList);
}

// True when the product (or any row sharing its barcode / stock no.) already
// has a shelf location mapped. Mirrors the hasLoc logic in renderProductLocationsUI.
function productHasAnyLocation(product) {
  if (!product) return false;
  if (product._hasLoc) return true;

  const selfFloor = product.floor !== undefined && product.floor !== null ? String(product.floor).trim() : '';
  const selfRow = product.batch !== undefined && product.batch !== null ? String(product.batch).trim() :
    (product.row !== undefined && product.row !== null ? String(product.row).trim() : '');
  const selfShelf = product.shelf !== undefined && product.shelf !== null ? String(product.shelf).trim() : '';
  const selfLocText = (product.loc || product.loc_full || product.storage_location || product.location_storage || '').trim();
  const selfStatus = (product.status || '').toUpperCase();

  if ((selfFloor !== '' && selfFloor !== '0' && selfFloor !== '00') ||
      (selfRow !== '' && selfRow !== '0' && selfRow !== '00') ||
      (selfShelf !== '' && selfShelf !== '0' && selfShelf !== '00') ||
      (selfLocText !== '' && selfLocText !== '—') ||
      selfStatus === 'MAPPED') {
    return true;
  }

  const b = (product.barcode || product.b || '').toString().trim().toLowerCase();
  const b2 = (product.barcode_2 || product.b2 || '').toString().trim().toLowerCase();
  const s = (product.stock_no || product.stock_code || product.s || '').toString().trim().toLowerCase();
  return (b && mappedSkus.has(b)) || (b2 && mappedSkus.has(b2)) || (s && mappedSkus.has(s));
}

async function fetchLocationsForProduct(product) {
  const barcode = (product.barcode || product.b || '').toString().trim().toLowerCase();
  const barcode2 = (product.barcode_2 || product.b2 || '').toString().trim().toLowerCase();
  const stockCode = (product.stock_no || product.stock_code || product.s || '').toString().trim().toLowerCase();
  const q = barcode || barcode2 || stockCode;

  if (!q) return getLocationsForProduct(product);

  try {
    const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=50`).then(r => r.json());
    if (res.success && Array.isArray(res.products) && res.products.length > 0) {
      const exact = res.products.filter(item => {
        const itemBarcode = (item.barcode || item.b || '').toString().trim().toLowerCase();
        const itemBarcode2 = (item.barcode_2 || item.b2 || '').toString().trim().toLowerCase();
        const itemStock = (item.stock_no || item.stock_code || item.s || '').toString().trim().toLowerCase();
        if (barcode && (itemBarcode === barcode || itemBarcode2 === barcode)) return true;
        if (barcode2 && (itemBarcode === barcode2 || itemBarcode2 === barcode2)) return true;
        if (stockCode && itemStock === stockCode) return true;
        return false;
      });
      if (exact.length > 0) {
        exact.forEach(freshItem => {
          const idx = PRODUCTS.findIndex(p => String(p.id) === String(freshItem.id));
          if (idx !== -1) {
            PRODUCTS[idx] = { ...PRODUCTS[idx], ...freshItem };
          } else {
            PRODUCTS.push(freshItem);
          }
        });
        rebuildIndex();
        return expandLocationsList(exact);
      }
    }
  } catch (e) {
    console.warn("Failed to fetch fresh locations, falling back to local cache:", e);
  }

  return getLocationsForProduct(product);
}

let lastLocsRenderSig = null;

function renderProductLocationsUI(p, locs) {
  const expandedLocs = expandLocationsList(locs || []);
  // Skip the DOM rebuild when nothing visible changed — the background
  // "fresh locations" refetch usually returns identical data, and rebuilding
  // the card anyway is what made it look like it was "loading" twice.
  const renderSig =
    (p.barcode || p.b || '') + '#' + (p.stock_no || p.stock_code || p.s || '') + '#' +
    (p.product_name || p.name || p.n || '') + '#' + (p.category || p.c || '') + '#' +
    (p.department || p.subcategory || p.sc || '') + '#' + (p.last_modified_by || p.modifiedBy || '') + '#' +
    (currentUser ? currentUser.username : 'guest') + '#' + CURRENT_LANG + '#' +
    expandedLocs.map(l => [l.id || '', l.floor, l.batch || l.row || '', l.shelf, l.level, l.qty, l.status, l.last_modified_by || ''].join('|')).join(';');
  if (renderSig === lastLocsRenderSig) return;
  lastLocsRenderSig = renderSig;

  const totalQty = expandedLocs.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
  document.getElementById('pQty').textContent = totalQty;

  // Deduplicate and group locations by exact normalized coordinates (floor, row, shelf, level)
  const uniqueLocs = [];
  expandedLocs.forEach(item => {
    let floor = item.floor !== undefined && item.floor !== null ? String(item.floor).trim() : '';
    let row = item.batch !== undefined && item.batch !== null ? String(item.batch).trim() : (item.row !== undefined && item.row !== null ? String(item.row).trim() : (item.row || '').trim());
    let shelf = item.shelf !== undefined && item.shelf !== null ? String(item.shelf).trim() : '';
    let level = item.level !== undefined && item.level !== null ? String(item.level).trim() : '';

    const locText = (item.loc || item.loc_full || item.storage_location || item.location_storage || '').trim();
    if ((!floor || !row || !shelf) && locText) {
      const parsed = parseLocationQR(locText);
      if (parsed) {
        if (!floor) floor = parsed.floor;
        if (!row) row = parsed.row;
        if (!shelf) shelf = parsed.shelf;
        if (!level || level === '0') level = parsed.level;
      }
    }

    if (row && row !== '0' && row !== '00') row = pad2(row);
    else if (row === '0' || row === '00') row = '00';

    if (shelf && shelf !== '0' && shelf !== '00') shelf = pad2(shelf);
    else if (shelf === '0' || shelf === '00') shelf = '00';

    if (level && level !== '0' && level !== '00') level = pad2(level);
    else level = '00';

    if (!floor) floor = '1';

    const hasLoc = Boolean((row && row !== '00') || (shelf && shelf !== '00') || (locText && locText !== '—'));
    const isCartonItem = Boolean(item.is_carton || item.loc_type === 'CARTON' || (locText && locText.includes('Carton')));

    const existing = uniqueLocs.find(u =>
      String(u.floor) === String(floor) &&
      pad2(u.row) === pad2(row) &&
      pad2(u.shelf) === pad2(shelf) &&
      pad2(u.level) === pad2(level)
    );

    if (existing) {
      existing.qty = (parseInt(existing.qty, 10) || 0) + (parseInt(item.qty, 10) || 0);
      existing.is_carton = existing.is_carton || isCartonItem;
      if (isCartonItem) existing.loc_type = 'CARTON';
      if (item.id && (!existing.id || item.id > existing.id)) {
        existing.id = item.id;
        existing.status = item.status || existing.status;
        existing.last_modified_by = item.last_modified_by || item.modifiedBy || existing.last_modified_by;
      }
    } else {
      uniqueLocs.push({
        id: item.id,
        barcode: item.barcode || p.barcode || p.b || '',
        stock_no: item.stock_no || p.stock_no || item.stock_code || p.stock_code || p.s || '',
        product_name: item.product_name || p.product_name || item.name || p.name || p.n || 'Unnamed item',
        category: item.category || p.category || p.c || '—',
        department: item.department || p.department || item.subcategory || p.subcategory || p.sc || '—',
        subcategory: item.department || p.department || item.subcategory || p.subcategory || p.sc || '',
        floor,
        row,
        shelf,
        level,
        hasLoc,
        qty: parseInt(item.qty, 10) || 0,
        is_carton: isCartonItem,
        loc_type: isCartonItem ? 'CARTON' : (item.loc_type || p.loc_type || 'SHELF'),
        location_storage: item.location_storage || item.storage_location || p.location_storage || p.storage_location || locText || '',
        storage_location: item.storage_location || item.location_storage || p.storage_location || p.location_storage || locText || '',
        status: item.status || (hasLoc ? 'MAPPED' : 'UNMAPPED'),
        last_modified_by: ((item.last_modified_by || item.modifiedBy || p.last_modified_by || p.modifiedBy) &&
          (item.last_modified_by || item.modifiedBy || p.last_modified_by || p.modifiedBy) !== 'System Import')
          ? (item.last_modified_by || item.modifiedBy || p.last_modified_by || p.modifiedBy)
          : '—',
        custom: item.custom || p.custom
      });
    }
  });

  const mappedLocs = uniqueLocs.filter(item => item.hasLoc && item.row !== '00' && item.shelf !== '00');
  const finalLocs = mappedLocs.length > 0 ? mappedLocs : uniqueLocs;

  window.currentLocs = finalLocs;

  const locationsList = document.getElementById('locationsList');
  locationsList.innerHTML = '';

  finalLocs.forEach((item, index) => {
    const cardTranslations = TRANSLATIONS[CURRENT_LANG] || TRANSLATIONS.en;
    const floor = item.floor;
    const row = item.row;
    const shelf = item.shelf;
    const level = item.level;
    const hasLoc = item.hasLoc;

    const st = statusInfo(item.status);
    const qtyVal = item.qty;
    const barcodeVal = item.barcode || p.barcode || p.b || '—';
    const categoryVal = item.category || p.category || p.c || '—';
    const departmentVal = item.department || item.subcategory || p.department || p.subcategory || p.sc || '—';
    const stockmanVal = item.last_modified_by || p.last_modified_by || p.modifiedBy || '—';

    const isCartonLocation = Boolean(
      item.is_carton ||
      p.is_carton ||
      item.loc_type === 'CARTON' ||
      p.loc_type === 'CARTON' ||
      item.storage_type === 'CARTON' ||
      (item.location_storage && item.location_storage.toUpperCase().includes('CARTON')) ||
      (item.storage_location && item.storage_location.toUpperCase().includes('CARTON')) ||
      (p.location_storage && p.location_storage.toUpperCase().includes('CARTON')) ||
      (p.storage_location && p.storage_location.toUpperCase().includes('CARTON')) ||
      (item.last_modified_by && item.last_modified_by.toLowerCase().includes('carton'))
    );

    const cartonBadgeHtml = isCartonLocation 
      ? `<span class="badge-carton-tag" style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:2.5px 7px; border-radius:6px; font-size:10px; font-weight:800; display:inline-flex; align-items:center; gap:3px; box-shadow:0 1px 2px rgba(180, 83, 9, 0.08); white-space:nowrap; flex-shrink:0;">📦 Carton/Sack</span>`
      : '';

    const statusBadgeHtml = `<span class="badge ${st.cls}" style="font-size:10px; font-weight:700; padding:2.5px 7px; border-radius:6px; line-height:normal; display:inline-flex; align-items:center; letter-spacing:0.02em; white-space:nowrap; flex-shrink:0;">${st.label}</span>`;

    const cardEl = document.createElement('div');
    cardEl.className = 'tagcard';
    cardEl.style.marginBottom = '16px';

    cardEl.innerHTML = `
      <div class="tagcard-top" style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
        <div style="flex:1; min-width:0; padding-right:4px;">
          <p class="pname" style="margin:0 0 4px 0; font-size:16px; font-weight:700; line-height:1.25;">${escapeHtml(item.product_name)}</p>
        </div>
        <div class="tagcard-badges-group" style="display:flex; align-items:center; gap:5px; flex-shrink:0; flex-wrap:wrap;">
          ${cartonBadgeHtml}
          ${statusBadgeHtml}
        </div>
      </div>
      <div class="result-card-metadata">
        <div><span>Category</span><strong>${escapeHtml(categoryVal)}</strong></div>
        <div><span>Department</span><strong>${escapeHtml(departmentVal)}</strong></div>
        <div class="result-card-stockman"><span>Responsible Stockman</span><strong>${escapeHtml(stockmanVal)}</strong></div>
      </div>
      <div class="grid4">
        <div class="cell"><div class="clabel">${cardTranslations.cardFloor}</div><div class="cval">${hasLoc ? floor : '–'}</div></div>
        <div class="cell"><div class="clabel">${cardTranslations.cardRow}</div><div class="cval">${hasLoc ? row : '–'}</div></div>
        <div class="cell"><div class="clabel">${cardTranslations.cardShelf}</div><div class="cval">${hasLoc ? shelf : '–'}</div></div>
        <div class="cell"><div class="clabel">${cardTranslations.cardLevel}</div><div class="cval">${hasLoc ? level : '–'}</div></div>
      </div>
      <div class="tagcard-bottom">
        <div class="tagcard-bottom-info">
          <div class="result-card-barcode">Barcode: <strong>${escapeHtml(barcodeVal)}</strong></div>
          <div class="location-qty-highlight"><span>Location Qty</span><strong>${qtyVal}</strong></div>
        </div>
        <div class="tagcard-bottom-actions">
          ${currentUser && item.id ? `<button class="card-btn btn-transfer" type="button" onclick="event.stopPropagation(); openTransferModalForProductIndex(${index})" title="Transfer stock to another shelf">Transfer</button>` : ''}
          <button class="card-btn btn-addstock" type="button" onclick="event.stopPropagation(); openAddQtyForLocation(${index})">Add Stock</button>
          <button class="card-btn btn-edit" type="button" onclick="event.stopPropagation(); openEditFormForProductIndex(${index})" title="Edit product details">Edit</button>
          ${currentUser ? `<button class="card-btn btn-delete-loc" type="button" onclick="event.stopPropagation(); deleteProductLocation(${index})" title="Delete this shelf location">Delete</button>` : ''}
        </div>
      </div>
    `;
    locationsList.appendChild(cardEl);
  });

  window.currentLocs = finalLocs;

  const editBtn = document.getElementById('editProductBtn');

  editBtn.style.display = 'none';

}

function renderProduct(p) {
  activeProduct = p;
  document.getElementById('emptyState').style.display = 'none';
  const card = document.getElementById('tagCard');
  card.classList.add('show');
  document.getElementById('cardActions').style.display = 'flex';

  // 1. Instant local render (0ms latency!)
  const localLocs = getLocationsForProduct(p);
  renderProductLocationsUI(p, localLocs);
  // renderProductLocationsUI immediately calculates the displayed on-hand total,
  // which is also the safe fallback while the separate ledger request is loading.
  loadInventorySummary(p);

  // push to persistent recent lookups
  recent = recent.filter(r => (r.id ? r.id !== p.id : (r.barcode || r.b) !== (p.barcode || p.b)));
  recent.unshift(p);
  recent = recent.slice(0, 100); // Store up to 100 recent items for data gathering sessions
  recentPage = 1; // Always jump to page 1 on new lookup
  try {
    localStorage.setItem(recentKey(), JSON.stringify(recent));
  } catch (e) {}

  renderRecent();
  hideResults();

  // 2. Background non-blocking DB fetch for fresh locations
  fetchLocationsForProduct(p).then(freshLocs => {
    if (freshLocs && freshLocs.length > 0 && activeProduct && (
      (activeProduct.id && activeProduct.id === p.id) ||
      (activeProduct.barcode && (activeProduct.barcode === p.barcode || activeProduct.barcode === p.b)) ||
      (activeProduct.barcode_2 && (activeProduct.barcode_2 === p.barcode_2)) ||
      (activeProduct.stock_no && (activeProduct.stock_no === p.stock_no || activeProduct.stock_no === p.s))
    )) {
      renderProductLocationsUI(p, freshLocs);
      const hasMapped = freshLocs.some(l => l.hasLoc || (l.floor && l.row && l.shelf));
      if (hasMapped) {
        closeEditForm();
      }
    }
  }).catch(e => {
    console.warn("Background fresh locations fetch error:", e);
  });
}

const INVENTORY_SUMMARY_CACHE_KEY = 'wh_inventory_summary_cache_v1';
const INVENTORY_SUMMARY_CACHE_TTL_MS = 5 * 60 * 1000;
const INVENTORY_SUMMARY_CACHE_LIMIT = 120;
const INVENTORY_SUMMARY_REQUEST_TIMEOUT_MS = 8000;
const inventorySummaryCache = new Map();

function inventorySummaryCacheKey(key) {
  return String(key || '').trim().toLowerCase();
}

function readInventorySummaryCache(key) {
  const cacheKey = inventorySummaryCacheKey(key);
  const memoryItem = inventorySummaryCache.get(cacheKey);
  if (memoryItem && Date.now() - memoryItem.savedAt < INVENTORY_SUMMARY_CACHE_TTL_MS) return memoryItem.summary;
  try {
    const stored = JSON.parse(localStorage.getItem(INVENTORY_SUMMARY_CACHE_KEY) || '{}');
    const item = stored[cacheKey];
    if (!item || Date.now() - item.savedAt >= INVENTORY_SUMMARY_CACHE_TTL_MS) return null;
    inventorySummaryCache.set(cacheKey, item);
    return item.summary;
  } catch (err) {
    return null;
  }
}

function saveInventorySummaryCache(key, summary) {
  const cacheKey = inventorySummaryCacheKey(key);
  const item = { summary, savedAt: Date.now() };
  inventorySummaryCache.set(cacheKey, item);
  try {
    const stored = JSON.parse(localStorage.getItem(INVENTORY_SUMMARY_CACHE_KEY) || '{}');
    stored[cacheKey] = item;
    const kept = Object.entries(stored)
      .filter(([, value]) => value && Date.now() - value.savedAt < INVENTORY_SUMMARY_CACHE_TTL_MS)
      .sort((a, b) => b[1].savedAt - a[1].savedAt)
      .slice(0, INVENTORY_SUMMARY_CACHE_LIMIT);
    localStorage.setItem(INVENTORY_SUMMARY_CACHE_KEY, JSON.stringify(Object.fromEntries(kept)));
  } catch (err) {
    // The page can still use the in-memory cache when browser storage is unavailable.
  }
}

function invalidateInventorySummaryCache(key) {
  const cacheKey = inventorySummaryCacheKey(key);
  inventorySummaryCache.delete(cacheKey);
  try {
    const stored = JSON.parse(localStorage.getItem(INVENTORY_SUMMARY_CACHE_KEY) || '{}');
    delete stored[cacheKey];
    localStorage.setItem(INVENTORY_SUMMARY_CACHE_KEY, JSON.stringify(stored));
  } catch (err) {
    // Nothing else is required; the next live request will refresh the card.
  }
}

function productInventoryFallback(product) {
  const productQty = Number.parseInt(product?.qty, 10);
  const displayedQty = Number.parseInt((document.getElementById('pQty')?.textContent || '').replace(/,/g, ''), 10);
  const qty = Math.max(0, Number.isInteger(productQty) ? productQty : (Number.isInteger(displayedQty) ? displayedQty : 0));
  return { onHand: qty, available: qty, reserved: 0, receiving: 0, bulk: 0, shelf: 0, systemOnHandUpdatedAt: product?.system_on_hand_updated_at || product?.systemOnHandUpdatedAt || null };
}

function bestAvailableInventorySummary(product, cachedSummary) {
  const productSummary = productInventoryFallback(product);
  // A prior offline request may have cached an empty ledger result. Never let
  // that stale zero hide a known on-hand quantity from the product record.
  if (productSummary.onHand > 0 && (!cachedSummary || Number(cachedSummary.onHand || 0) === 0)) return productSummary;
  return cachedSummary || productSummary;
}

function renderInventorySummary(summary, statusText) {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = Number(value || 0).toLocaleString();
  };
  set('inventoryOnHand', summary.onHand);
  set('inventoryAvailable', summary.available);
  set('inventoryReserved', summary.reserved);
  set('inventoryReceiving', summary.receiving);
  set('inventoryBulk', summary.bulk);
  set('inventoryShelf', summary.shelf);
  const systemUpdatedAt = document.getElementById('inventorySystemUpdatedAt');
  if (systemUpdatedAt) {
    const date = summary.systemOnHandUpdatedAt ? new Date(summary.systemOnHandUpdatedAt) : null;
    systemUpdatedAt.textContent = date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : 'Not received from external system yet';
  }
  const status = document.getElementById('inventorySummaryStatus');
  if (status) status.textContent = statusText;
}

let inventorySummaryRequestId = 0;
let currentInventorySummaryProduct = null;
async function loadInventorySummary(product) {
  const card = document.getElementById('inventorySummaryCard');
  if (!card) return;
  if (!currentUser) {
    card.style.display = 'none';
    return;
  }
  const key = product && (product.barcode || product.b || product.stock_no || product.stock_code || product.s);
  if (!key) return;
  currentInventorySummaryProduct = product;
  const requestId = ++inventorySummaryRequestId;
  card.style.display = 'block';
  const cachedSummary = readInventorySummaryCache(key);
  const localSummary = bestAvailableInventorySummary(product, cachedSummary);
  renderInventorySummary(localSummary, cachedSummary ? 'Updating live balance...' : 'Syncing live balance...');
  const controller = typeof AbortController === 'undefined' ? null : new AbortController();
  const timeout = controller ? setTimeout(() => controller.abort(), INVENTORY_SUMMARY_REQUEST_TIMEOUT_MS) : null;
  try {
    const response = await authFetch(`/api/inventory/${encodeURIComponent(key)}/summary`, {
      ...(controller ? { signal: controller.signal } : {}),
      cache: 'no-store'
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'The live inventory service did not return a balance.');
    if (requestId !== inventorySummaryRequestId) return;
    const summary = data.summary || {};
    saveInventorySummaryCache(key, summary);
    renderInventorySummary(summary, 'Ledger balance');
  } catch (err) {
    if (requestId === inventorySummaryRequestId) {
      const message = err?.name === 'AbortError'
        ? 'Live balance timed out — showing saved quantity'
        : 'Live balance unavailable — showing saved quantity';
      renderInventorySummary(bestAvailableInventorySummary(product, cachedSummary), message);
    }
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

const inventoryQuickAdjustOverlay = document.getElementById('inventoryQuickAdjustOverlay');
const inventoryQuickAdjustSave = document.getElementById('inventoryQuickAdjustSave');
const inventoryQuickAdjustCancel = document.getElementById('inventoryQuickAdjustCancel');
const inventoryQuickAdjustBucket = document.getElementById('inventoryQuickAdjustBucket');
const inventoryQuickAdjustQty = document.getElementById('inventoryQuickAdjustQty');
const inventoryQuickAdjustReason = document.getElementById('inventoryQuickAdjustReason');
const inventoryQuickAdjustError = document.getElementById('inventoryQuickAdjustError');
const inventoryDirectDeliveryBtn = document.getElementById('inventoryDirectDeliveryBtn');
const inventoryDirectDeliveryOverlay = document.getElementById('inventoryDirectDeliveryOverlay');
const inventoryDirectDeliveryQty = document.getElementById('inventoryDirectDeliveryQty');
const inventoryDirectDeliveryReference = document.getElementById('inventoryDirectDeliveryReference');
const inventoryDirectDeliveryError = document.getElementById('inventoryDirectDeliveryError');
const inventoryDirectDeliverySave = document.getElementById('inventoryDirectDeliverySave');
const inventoryDirectDeliveryCancel = document.getElementById('inventoryDirectDeliveryCancel');

function canQuickAdjustInventory() {
  return Boolean(currentUser && ['stockman', 'carton_handler', 'admin', 'superadmin'].includes(currentUser.role));
}

function inventorySummaryValue(bucket) {
  const ids = { ON_HAND: 'inventoryOnHand', RECEIVING: 'inventoryReceiving', BULK: 'inventoryBulk', SHELF: 'inventoryShelf' };
  return Number.parseInt((document.getElementById(ids[bucket])?.textContent || '0').replace(/,/g, ''), 10) || 0;
}

function updateInventoryCardImmediately(bucket, targetQty) {
  const current = {
    onHand: inventorySummaryValue('ON_HAND'),
    available: Number.parseInt((document.getElementById('inventoryAvailable')?.textContent || '0').replace(/,/g, ''), 10) || 0,
    reserved: Number.parseInt((document.getElementById('inventoryReserved')?.textContent || '0').replace(/,/g, ''), 10) || 0,
    receiving: inventorySummaryValue('RECEIVING'),
    bulk: inventorySummaryValue('BULK'),
    shelf: inventorySummaryValue('SHELF')
  };
  const field = { ON_HAND: 'onHand', RECEIVING: 'receiving', BULK: 'bulk', SHELF: 'shelf' }[bucket];
  if (!field) return;
  current[field] = targetQty;
  if (bucket === 'ON_HAND') current.available = Math.max(0, targetQty - current.reserved);
  renderInventorySummary(current, '');
}

function openInventoryQuickAdjust(bucket) {
  if (!currentInventorySummaryProduct || !inventoryQuickAdjustOverlay) return;
  if (!canQuickAdjustInventory()) {
    showToast('Inventory corrections require a stockman or admin account.');
    return;
  }
  const product = currentInventorySummaryProduct;
  const name = product.product_name || product.name || product.n || 'Product';
  const barcode = product.barcode || product.b || '—';
  const stock = product.stock_no || product.stock_code || product.s || '—';
  document.getElementById('inventoryQuickAdjustProductName').textContent = name;
  document.getElementById('inventoryQuickAdjustMeta').textContent = `Barcode: ${barcode} | Stock No: ${stock}`;
  inventoryQuickAdjustBucket.value = bucket;
  inventoryQuickAdjustQty.value = String(inventorySummaryValue(bucket));
  inventoryQuickAdjustReason.value = 'Physical count correction';
  inventoryQuickAdjustError.textContent = '';
  inventoryQuickAdjustError.classList.remove('show');
  inventoryQuickAdjustOverlay.classList.add('show');
  setTimeout(() => inventoryQuickAdjustQty.focus(), 80);
}

function openInventoryDirectDelivery() {
  if (!currentInventorySummaryProduct || !inventoryDirectDeliveryOverlay) return;
  if (!canQuickAdjustInventory()) {
    showToast('Direct deliveries require a stockman or admin account.');
    return;
  }
  const receiving = inventorySummaryValue('RECEIVING');
  if (receiving <= 0) {
    showToast('There is no stock in Receiving to deliver directly.', 'error');
    return;
  }
  const product = currentInventorySummaryProduct;
  const name = product.product_name || product.name || product.n || 'Product';
  const barcode = product.barcode || product.b || '—';
  const stock = product.stock_no || product.stock_code || product.s || '—';
  document.getElementById('inventoryDirectDeliveryProductName').textContent = name;
  document.getElementById('inventoryDirectDeliveryMeta').textContent = `Receiving: ${receiving.toLocaleString()} | Barcode: ${barcode} | Stock No: ${stock}`;
  inventoryDirectDeliveryQty.max = String(receiving);
  inventoryDirectDeliveryQty.value = '';
  inventoryDirectDeliveryReference.value = '';
  inventoryDirectDeliveryError.classList.remove('show');
  inventoryDirectDeliveryOverlay.classList.add('show');
  setTimeout(() => inventoryDirectDeliveryQty.focus(), 80);
}

const inventorySummaryCard = document.getElementById('inventorySummaryCard');
if (inventorySummaryCard) {
  inventorySummaryCard.addEventListener('click', event => {
    const editable = event.target.closest('[data-inventory-edit]');
    if (editable) {
      openInventoryQuickAdjust(editable.dataset.inventoryEdit);
      return;
    }
    const derived = event.target.closest('[data-inventory-derived]');
    if (derived) showToast('This balance is calculated from the inventory ledger.');
  });
  inventorySummaryCard.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const editable = event.target.closest('[data-inventory-edit]');
    if (editable) {
      event.preventDefault();
      openInventoryQuickAdjust(editable.dataset.inventoryEdit);
    }
  });
}

if (inventoryQuickAdjustCancel) inventoryQuickAdjustCancel.addEventListener('click', () => inventoryQuickAdjustOverlay?.classList.remove('show'));
if (inventoryQuickAdjustSave) inventoryQuickAdjustSave.addEventListener('click', async () => {
  const product = currentInventorySummaryProduct;
  const qtyRaw = inventoryQuickAdjustQty.value.trim();
  const targetQty = Number(qtyRaw);
  const reason = inventoryQuickAdjustReason.value.trim();
  if (!product || !qtyRaw || !Number.isInteger(targetQty) || targetQty < 1) {
    inventoryQuickAdjustError.textContent = CURRENT_LANG === 'en'
      ? 'New Quantity is required. Enter a whole number of at least 1.'
      : '新数量为必填项。请输入至少为 1 的整数。';
    inventoryQuickAdjustError.classList.add('show');
    return;
  }
  if (!reason) {
    inventoryQuickAdjustError.textContent = CURRENT_LANG === 'en'
      ? 'Reason is required. Enter a reason for the count correction.'
      : '原因为必填项。请输入盘点更正原因。';
    inventoryQuickAdjustError.classList.add('show');
    return;
  }
  inventoryQuickAdjustSave.disabled = true;
  inventoryQuickAdjustError.classList.remove('show');
  const key = product.barcode || product.b || product.stock_no || product.stock_code || product.s;
  try {
    const response = await authFetch(`/api/inventory/${encodeURIComponent(key)}/quick-adjustment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barcode: product.barcode || product.b,
        stock_no: product.stock_no || product.stock_code || product.s,
        product_name: product.product_name || product.name || product.n,
        storage_type: inventoryQuickAdjustBucket.value,
        target_qty: targetQty,
        reason
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Could not save inventory correction.');
    const bucket = inventoryQuickAdjustBucket.value;
    updateInventoryCardImmediately(bucket, targetQty);
    if (data.product) {
      const nextOnHand = Number.parseInt(data.product.qty, 10);
      currentInventorySummaryProduct = { ...product, ...data.product };
      if (Number.isInteger(nextOnHand) && bucket !== 'ON_HAND') {
        updateInventoryCardImmediately('ON_HAND', nextOnHand);
      }
    }
    inventoryQuickAdjustOverlay.classList.remove('show');
    showToast(`Inventory count updated to ${targetQty.toLocaleString()} units.`);
    invalidateInventorySummaryCache(key);
    loadInventorySummary(currentInventorySummaryProduct || product);
  } catch (err) {
    if (isNetworkFailure(err)) {
      const bucket = inventoryQuickAdjustBucket.value;
      queueInventoryAction(`/api/inventory/${encodeURIComponent(key)}/quick-adjustment`, {
        barcode: product.barcode || product.b,
        stock_no: product.stock_no || product.stock_code || product.s,
        product_name: product.product_name || product.name || product.n,
        storage_type: bucket, target_qty: targetQty, reason
      }, 'inventory correction');
      updateInventoryCardImmediately(bucket, targetQty);
      inventoryQuickAdjustOverlay.classList.remove('show');
      showToast('Saved on this device. It will sync automatically when connected.');
    } else {
      inventoryQuickAdjustError.textContent = err.message;
      inventoryQuickAdjustError.classList.add('show');
    }
  } finally {
    inventoryQuickAdjustSave.disabled = false;
  }
});

[inventoryQuickAdjustQty, inventoryQuickAdjustReason].forEach(field => {
  field?.addEventListener('input', () => {
    inventoryQuickAdjustError.textContent = '';
    inventoryQuickAdjustError.classList.remove('show');
  });
});

if (inventoryDirectDeliveryBtn) inventoryDirectDeliveryBtn.addEventListener('click', openInventoryDirectDelivery);
if (inventoryDirectDeliveryCancel) inventoryDirectDeliveryCancel.addEventListener('click', () => inventoryDirectDeliveryOverlay?.classList.remove('show'));
if (inventoryDirectDeliverySave) inventoryDirectDeliverySave.addEventListener('click', async () => {
  const product = currentInventorySummaryProduct;
  const qty = Number.parseInt(inventoryDirectDeliveryQty.value, 10);
  const reference = inventoryDirectDeliveryReference.value.trim();
  const receiving = inventorySummaryValue('RECEIVING');
  if (!product || !Number.isInteger(qty) || qty <= 0 || qty > receiving) {
    inventoryDirectDeliveryError.textContent = `Enter a whole number from 1 to ${receiving.toLocaleString()}.`;
    inventoryDirectDeliveryError.classList.add('show');
    return;
  }
  if (!reference) {
    inventoryDirectDeliveryError.textContent = 'Enter a delivery reference or customer name.';
    inventoryDirectDeliveryError.classList.add('show');
    return;
  }
  inventoryDirectDeliverySave.disabled = true;
  inventoryDirectDeliveryError.classList.remove('show');
  const key = product.barcode || product.b || product.stock_no || product.stock_code || product.s;
  try {
    const response = await authFetch(`/api/inventory/${encodeURIComponent(key)}/direct-delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty, delivery_reference: reference })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Could not record the direct delivery.');
    const nextOnHand = Math.max(0, inventorySummaryValue('ON_HAND') - qty);
    updateInventoryCardImmediately('RECEIVING', Math.max(0, receiving - qty));
    updateInventoryCardImmediately('ON_HAND', nextOnHand);
    if (data.product) currentInventorySummaryProduct = { ...product, ...data.product, qty: nextOnHand };
    inventoryDirectDeliveryOverlay.classList.remove('show');
    showToast(`Direct delivery recorded: ${qty.toLocaleString()} unit(s) removed from Receiving.`);
    invalidateInventorySummaryCache(key);
    loadInventorySummary(currentInventorySummaryProduct || product);
  } catch (err) {
    if (isNetworkFailure(err)) {
      queueInventoryAction(`/api/inventory/${encodeURIComponent(key)}/direct-delivery`, { qty, delivery_reference: reference }, 'direct delivery');
      updateInventoryCardImmediately('RECEIVING', Math.max(0, receiving - qty));
      updateInventoryCardImmediately('ON_HAND', Math.max(0, inventorySummaryValue('ON_HAND') - qty));
      inventoryDirectDeliveryOverlay.classList.remove('show');
      showToast('Delivery saved on this device. It will sync automatically when connected.');
    } else {
      inventoryDirectDeliveryError.textContent = err.message;
      inventoryDirectDeliveryError.classList.add('show');
    }
  } finally {
    inventoryDirectDeliverySave.disabled = false;
  }
});

function renderRecent() {
  const strip = document.getElementById('recentStrip');
  const paginationEl = document.getElementById('recentPagination');
  const pageInfoEl = document.getElementById('recentPageInfo');
  const countBadgeEl = document.getElementById('recentCountBadge');
  const prevBtn = document.getElementById('recentPrevBtn');
  const nextBtn = document.getElementById('recentNextBtn');

  if (!strip) return;
  strip.innerHTML = '';

  if (recent.length === 0) {
    strip.innerHTML = `<div class="no-results" style="text-align:left;padding:2px;">${CURRENT_LANG === 'en' ? 'Nothing looked up yet.' : '暂无查询历史。'}</div>`;
    if (paginationEl) paginationEl.style.display = 'none';
    if (countBadgeEl) countBadgeEl.style.display = 'none';
    recentPage = 1;
    return;
  }

  const totalItems = recent.length;
  const totalPages = Math.ceil(totalItems / recentPageSize);

  if (recentPage > totalPages) recentPage = totalPages;
  if (recentPage < 1) recentPage = 1;

  if (countBadgeEl) {
    countBadgeEl.textContent = totalItems;
    countBadgeEl.style.display = 'inline-block';
  }

  const startIdx = (recentPage - 1) * recentPageSize;
  const pageItems = recent.slice(startIdx, startIdx + recentPageSize);

  pageItems.forEach(p => {
    const div = document.createElement('div');
    div.className = 'recent-item';
    const name = p.product_name || p.name || p.n || 'Unnamed Product';
    const floor = p.floor !== undefined && p.floor !== null ? String(p.floor) : '';
    const row = p.batch !== undefined && p.batch !== null ? String(p.batch) : (p.row !== undefined && p.row !== null ? String(p.row) : (p.row || ''));
    const shelf = p.shelf !== undefined && p.shelf !== null ? String(p.shelf) : '';
    const level = p.level !== undefined && p.level !== null ? String(p.level) : '';
    const hasLoc = floor !== '' || row !== '' || shelf !== '';
    const loc = hasLoc ? `${floor}-${row}-${shelf}-${level}` : (CURRENT_LANG === 'en' ? 'no location' : '未分配库位');

    const isCarton = Boolean(
      p.is_carton ||
      p.loc_type === 'CARTON' ||
      (p.location_storage && p.location_storage.toUpperCase().includes('CARTON')) ||
      (p.storage_location && p.storage_location.toUpperCase().includes('CARTON'))
    );

    const cartonTag = isCarton ? `<span style="font-size:10px; margin-left:4px;">📦</span>` : '';

    div.innerHTML = `<span class="rin">${escapeHtml(name)} ${cartonTag}</span><span class="riloc">${escapeHtml(loc)}</span>`;
    div.onclick = () => renderProduct(p);
    strip.appendChild(div);
  });

  if (totalPages > 1) {
    if (paginationEl) paginationEl.style.display = 'flex';
    if (pageInfoEl) {
      if (CURRENT_LANG === 'en') {
        pageInfoEl.textContent = `Page ${recentPage} of ${totalPages} (${totalItems} items)`;
      } else {
        pageInfoEl.textContent = `第 ${recentPage} / ${totalPages} 页 (共 ${totalItems} 条)`;
      }
    }
    if (prevBtn) prevBtn.disabled = recentPage <= 1;
    if (nextBtn) nextBtn.disabled = recentPage >= totalPages;
  } else {
    if (paginationEl) paginationEl.style.display = 'none';
  }
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML.replace(/"/g, '&quot;');
}

function hideResults() {
  const rl = document.getElementById('resultsList');
  rl.classList.remove('show');
  rl.innerHTML = '';
}

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

// A multi-word search is an AND query: every token must match the same
// product, while each token may match any indexed product field. This keeps
// autocomplete results correct for searches such as "809 basket".
function productMatchesAllSearchTokens(p, tokens) {
  if (!p || !tokens || tokens.length === 0) return false;
  const searchText = p._searchStr !== undefined
    ? p._searchStr
    : [p.barcode || p.b, p.barcode_2 || p.b2, p.stock_no || p.stock_code || p.s,
      p.product_name || p.name || p.n, p.category || p.c,
      p.department || p.subcategory || p.sc].join(' ').toLowerCase();
  const strippedText = p._searchStrStripped !== undefined
    ? p._searchStrStripped
    : searchText.replace(/0+/g, '');

  return tokens.every(token => {
    const strippedToken = token.replace(/^0+/, '');
    const synonyms = SEARCH_SYNONYMS[token] || [token];
    return synonyms.some(term => searchText.includes(term)) ||
      Boolean(strippedToken && strippedText.includes(strippedToken));
  });
}

function scoreProductMatch(p, qTrim, qStripped, tokens) {
  if (!p || !qTrim) return 0;
  if (!qStripped) qStripped = qTrim.replace(/^0+/, '');

  const b = p._b !== undefined ? p._b : (p.barcode || p.b || '').toString().trim().toLowerCase();
  const b2 = p._b2 !== undefined ? p._b2 : (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
  const s = p._s !== undefined ? p._s : (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
  const n = p._n !== undefined ? p._n : (p.product_name || p.name || p.n || '').toString().trim().toLowerCase();
  const c = p._c !== undefined ? p._c : (p.category || p.c || '').toString().trim().toLowerCase();
  const d = p._d !== undefined ? p._d : (p.department || p.subcategory || p.sc || '').toString().trim().toLowerCase();

  const bStripped = p._bStripped !== undefined ? p._bStripped : (b ? b.replace(/^0+/, '') : '');
  const b2Stripped = p._b2Stripped !== undefined ? p._b2Stripped : (b2 ? b2.replace(/^0+/, '') : '');
  const sStripped = p._sStripped !== undefined ? p._sStripped : (s ? s.replace(/^0+/, '') : '');

  // 1. Exact matches (Score 100)
  if (b === qTrim || b2 === qTrim || s === qTrim || n === qTrim) return 100;
  if (qStripped && (b === qStripped || b2 === qStripped || s === qStripped || bStripped === qStripped || b2Stripped === qStripped || sStripped === qStripped)) return 95;

  // 2. StartsWith (Prefix) matches on Barcode or Stock No (Score 85)
  if (b.startsWith(qTrim) || b2.startsWith(qTrim) || s.startsWith(qTrim)) return 85;
  if (qStripped && (b.startsWith(qStripped) || b2.startsWith(qStripped) || s.startsWith(qStripped) || bStripped.startsWith(qStripped) || b2Stripped.startsWith(qStripped))) return 80;

  // 3. StartsWith (Prefix) matches on Product Name (Score 75)
  if (n.startsWith(qTrim)) return 75;
  const words = p._words || (n ? n.split(/\s+/) : []);
  if (words.some(w => w.startsWith(qTrim))) return 70;

  // 4. Substring matches on Barcode or Stock No (Score 65)
  if (b.includes(qTrim) || b2.includes(qTrim) || s.includes(qTrim)) return 65;
  if (qStripped && (b.includes(qStripped) || b2.includes(qStripped) || s.includes(qStripped))) return 60;

  // 5. Contiguous Substring matches on Name, Category, Department (Score 55 - 50)
  if (n.includes(qTrim)) return 55;
  if (c.includes(qTrim) || d.includes(qTrim)) return 50;

  // 6. Multi-Token / Word-Split Matching (with Synonym Expansion e.g. black <-> blk, trapal <-> tarpaulin)
  const tokList = tokens || qTrim.split(/\s+/).filter(Boolean);
  if (tokList.length > 0) {
    const fullText = p._searchStr || `${b} ${b2} ${s} ${n} ${c} ${d}`;
    const fullTextStripped = p._searchStrStripped || fullText.replace(/0+/g, '');

    let matchedCount = 0;
    let codeMatched = false;
    let wordBoundaryMatched = false;

    for (const t of tokList) {
      const tStripped = t.replace(/^0+/, '');
      const syns = SEARCH_SYNONYMS[t] || [t];
      const matchesToken = syns.some(syn => fullText.includes(syn)) || (tStripped && fullTextStripped.includes(tStripped));
      if (matchesToken) {
        matchedCount++;
        if (syns.some(syn => b.includes(syn) || b2.includes(syn) || s.includes(syn) || bStripped.includes(syn) || b2Stripped.includes(syn) || sStripped.includes(syn))) {
          codeMatched = true;
        }
        if (syns.some(syn => words.some(w => w.startsWith(syn)))) {
          wordBoundaryMatched = true;
        }
      }
    }

    if (matchedCount === tokList.length) {
      let tokenScore = 45;
      if (codeMatched) tokenScore += 10;
      if (wordBoundaryMatched) tokenScore += 5;
      return tokenScore;
    } else if (matchedCount >= Math.max(2, Math.ceil(tokList.length * 0.6))) {
      const ratio = matchedCount / tokList.length;
      return Math.floor(25 * ratio);
    }
  }

  return 0;
}

let searchRequestId = 0;
let searchFetchTimer = null;
let searchFetchController = null;
let missingProductPromptTimer = null;
let pendingMissingProductQuery = '';

// Pausing while typing must never select a product. It only checks whether
// the query has no possible matches, then offers the Add Product prompt.
async function promptOnlyWhenSearchIsMissing(query) {
  const q = String(query || '').trim();
  if (!q || (document.getElementById('searchInput')?.value || '').trim() !== q) return;

  const qLower = q.toLowerCase();
  const qStripped = qLower.replace(/^0+/, '');
  const tokens = qLower.split(/\s+/).filter(Boolean);
  const hasLocalMatch = PRODUCTS.some(product => {
    if (product._searchStr !== undefined && !productMatchesAllSearchTokens(product, tokens)) return false;
    return scoreProductMatch(product, qLower, qStripped, tokens) > 0;
  });
  if (hasLocalMatch) return;

  try {
    const response = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=1`);
    const result = await response.json();
    if ((document.getElementById('searchInput')?.value || '').trim() !== q) return;
    if (result.success && Array.isArray(result.products) && result.products.length === 0) {
      showNotFoundModal(q);
    }
  } catch (err) {
    // Do not offer Add Product while the database search itself is unavailable.
    console.warn('Missing-product check failed:', err);
  }
}

// Final scan / Enter resolution displays the result card. Editing remains an
// explicit action from the card's Edit button.
function renderOrPromptLocation(p, code) {
  if (!p) return;
  const allLocs = getLocationsForProduct(p);
  const mappedLoc = allLocs.find(l => (l.floor && String(l.floor).trim() !== '') || (l.row && String(l.row).trim() !== '') || (l.shelf && String(l.shelf).trim() !== '') || (l.loc && String(l.loc).trim() !== ''));
  const itemToDisplay = mappedLoc || p;
  renderProduct(itemToDisplay);
  closeEditForm();
}

async function doSearch(q, isFinal = false) {
  q = (q || '').trim();
  if (isFinal) clearTimeout(missingProductPromptTimer);
  if (!q) {
    clearTimeout(searchFetchTimer);
    if (searchFetchController) {
      searchFetchController.abort();
      searchFetchController = null;
    }
    hideResults();
    return;
  }

  const currentSearchId = ++searchRequestId;
  if (searchFetchController) {
    searchFetchController.abort();
    searchFetchController = null;
  }
  const qLower = q.toLowerCase();
  const qStripped = qLower.replace(/^0+/, '');
  const tokens = qLower.split(/\s+/).filter(Boolean);

  // --- 0. INSTANT EXACT-CODE FAST PATH (Enter / barcode scanner) ---
  // Hash-map lookup on the prebuilt indexes — zero array scanning.
  if (isFinal) {
    const directHit = byBarcodeMap.get(qLower) || byStockMap.get(qLower) ||
      (qStripped ? (byBarcodeMap.get(qStripped) || byStockMap.get(qStripped)) : null);
    if (directHit) {
      renderOrPromptLocation(directHit, q);
      const inputEl = document.getElementById('searchInput');
      if (inputEl) inputEl.value = '';
      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) clearBtn.style.display = 'none';
      hideResults();
      return;
    }
  }

  // --- 1. INSTANT LOCAL MEMORY CANDIDATE SEARCH (Barcode, Stock No, Product Name) ---
  const localCandidates = [];
  const maxCandidates = isFinal ? 1000 : 80;
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    if (p._searchStr !== undefined && !productMatchesAllSearchTokens(p, tokens)) continue;
    const score = scoreProductMatch(p, qLower, qStripped, tokens);
    if (score > 0) {
      localCandidates.push({ p, score });
      if (localCandidates.length >= maxCandidates) break;
    }
  }

  localCandidates.sort((a, b) => b.score - a.score);

  const seen = new Map();
  for (const item of localCandidates) {
    const p = item.p;
    const key = (p.barcode || p.b) ? ('bar_' + (p.barcode || p.b)) : ((p.stock_no || p.s) ? ('stock_' + (p.stock_no || p.s)) : ('id_' + p.id));
    const hasLoc = productHasAnyLocation(p);
    if (!seen.has(key)) {
      seen.set(key, { p, score: item.score, hasLoc });
    } else {
      const existing = seen.get(key);
      if (!existing.hasLoc && hasLoc) {
        seen.set(key, { p, score: Math.max(existing.score, item.score), hasLoc: true });
      }
    }
    if (seen.size >= 30) break;
  }
  const candidateMatches = Array.from(seen.values()).map(v => v.p);

  // Handle final submission (Enter pressed or barcode scanner triggered)
  if (isFinal) {
    // Exact barcode / stock_no match auto-select
    const exactMatch = candidateMatches.find(p => 
      (p.barcode || p.b) === q || 
      (p.barcode_2 || p.b2 || '') === q ||
      String(p.stock_no || p.stock_code || p.s) === q
    );

    if (exactMatch) {
      renderOrPromptLocation(exactMatch, q);
      const inputEl = document.getElementById('searchInput');
      if (inputEl) inputEl.value = '';
      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) clearBtn.style.display = 'none';
      hideResults();
      return;
    }

    if (candidateMatches.length === 1) {
      renderOrPromptLocation(candidateMatches[0], q);
      const inputEl = document.getElementById('searchInput');
      if (inputEl) inputEl.value = '';
      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) clearBtn.style.display = 'none';
      hideResults();
      return;
    }

    if (candidateMatches.length > 1) {
      renderMatches(candidateMatches.slice(0, 30));
      return;
    }

    // No local candidates — query API before displaying not found modal
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=30`).then(r => r.json());
      if (currentSearchId !== searchRequestId) return;
      if (res.success && Array.isArray(res.products) && res.products.length > 0) {
        if (res.products.length === 1) {
          renderOrPromptLocation(res.products[0], q);
          const inputEl = document.getElementById('searchInput');
          if (inputEl) inputEl.value = '';
          const clearBtn = document.getElementById('clearSearchBtn');
          if (clearBtn) clearBtn.style.display = 'none';
          hideResults();
          return;
        } else {
          renderMatches(res.products.slice(0, 30));
          return;
        }
      }
    } catch (err) {
      console.warn('Final search API error:', err);
    }

    if (currentSearchId === searchRequestId) {
      showNotFoundModal(q);
      hideResults();
    }
    return;
  }

  // While typing (isFinal === false):
  // 1. If we have local matches, render them INSTANTLY with zero latency!
  if (candidateMatches.length > 0) {
    renderMatches(candidateMatches.slice(0, 30));
  } else {
    hideResults();
  }

  // --- 3. BACKGROUND ASYNC DATABASE ENRICHMENT / FALLBACK (debounced) ---
  if (candidateMatches.length < 5) {
    clearTimeout(searchFetchTimer);
    const fetchId = currentSearchId;
    searchFetchTimer = setTimeout(() => {
      const controller = new AbortController();
      searchFetchController = controller;
      runBackgroundEnrich(q, qLower, fetchId, candidateMatches, seen, controller.signal)
        .finally(() => {
          if (searchFetchController === controller) searchFetchController = null;
        });
    }, 80);
  }
}

async function runBackgroundEnrich(q, qLower, currentSearchId, candidateMatches, seen, signal) {
  try {
    const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=30`, { signal }).then(r => r.json());
    if (currentSearchId !== searchRequestId) return;
    const currentInput = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    if (currentInput !== qLower) return;

    if (res.success && Array.isArray(res.products) && res.products.length > 0) {
      let added = false;
      for (const p of res.products) {
        const key = (p.barcode || p.b) ? ('bar_' + (p.barcode || p.b)) : ((p.stock_no || p.s) ? ('stock_' + (p.stock_no || p.s)) : ('id_' + p.id));
        
        const localIdx = PRODUCTS.findIndex(prod => String(prod.id) === String(p.id));
        if (localIdx !== -1) {
          PRODUCTS[localIdx] = { ...PRODUCTS[localIdx], ...p };
        } else {
          PRODUCTS.push(p);
        }

        if (!seen.has(key)) {
          seen.set(key, { p, score: Math.max(scoreProductMatch(p, qLower), 10), hasLoc: productHasAnyLocation(p) });
          candidateMatches.push(p);
          added = true;
        } else {
          const existing = seen.get(key);
          const hasLoc = productHasAnyLocation(p);
          if (hasLoc || !existing.hasLoc) {
            seen.set(key, { p, score: Math.max(existing.score, scoreProductMatch(p, qLower)), hasLoc: true });
            const cIdx = candidateMatches.findIndex(c => (c.barcode && c.barcode === p.barcode) || (c.stock_no && c.stock_no === p.stock_no) || String(c.id) === String(p.id));
            if (cIdx !== -1) {
              candidateMatches[cIdx] = p;
            } else {
              candidateMatches.push(p);
            }
            added = true;
          }
        }
      }
      if (added) {
        rebuildIndex();
        candidateMatches.sort((a, b) => {
          const scoreB = Math.max(scoreProductMatch(b, qLower), 10);
          const scoreA = Math.max(scoreProductMatch(a, qLower), 10);
          return scoreB - scoreA;
        });
      }
      if (candidateMatches.length > 0) {
        renderMatches(candidateMatches.slice(0, 30));
      }
    } else if (candidateMatches.length === 0) {
      renderMatches([]);
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return;
    console.warn('Background API search error:', err);
    if (currentSearchId === searchRequestId && candidateMatches.length === 0) {
      renderMatches([]);
    }
  }
}

function renderMatches(matches) {
  const rl = document.getElementById('resultsList');
  if (!rl) return;
  rl.innerHTML = '';
  if (!matches || matches.length === 0) {
    const isEn = CURRENT_LANG === 'en';
    rl.innerHTML = `<div class="no-results">${isEn ? 'No matching product in the database.' : '数据库中未找到匹配的商品。'}</div>`;
  } else {
    matches.forEach(p => {
      const rowEl = document.createElement('div');
      rowEl.className = 'result-row';
      const name = p.product_name || p.name || p.n;
      const barcode = p.barcode || p.b;
      const stockCode = p.stock_no || p.stock_code || p.s;
      
      const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
      const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
      const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
      
      const mappedLoc = (b && skuToMappedLoc.get(b)) || (b2 && skuToMappedLoc.get(b2)) || (s && skuToMappedLoc.get(s));
      const itemToDisplay = mappedLoc || p;

      const floor = itemToDisplay.floor !== undefined && itemToDisplay.floor !== null ? String(itemToDisplay.floor).trim() : '';
      const row = itemToDisplay.batch !== undefined && itemToDisplay.batch !== null ? String(itemToDisplay.batch).trim() : (itemToDisplay.row !== undefined && itemToDisplay.row !== null ? String(itemToDisplay.row).trim() : (itemToDisplay.row || '').trim());
      const shelf = itemToDisplay.shelf !== undefined && itemToDisplay.shelf !== null ? String(itemToDisplay.shelf).trim() : '';
      const level = itemToDisplay.level !== undefined && itemToDisplay.level !== null ? String(itemToDisplay.level).trim() : '';
      const loc = (floor !== '' && row !== '' && shelf !== '') ? `${floor}-${row}-${shelf}-${level || '00'}` : (itemToDisplay.loc || '—');

      rowEl.innerHTML = `<div><div class="rn">${escapeHtml(name)}</div><div class="rc">${escapeHtml(barcode || ('#' + stockCode))}</div></div><div class="rloc">${loc}</div>`;
      rowEl.onclick = () => {
        renderProduct(itemToDisplay);
        const inputEl = document.getElementById('searchInput');
        if (inputEl) inputEl.value = '';
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) clearBtn.style.display = 'none';
        hideResults();

        closeEditForm();
      };
      rl.appendChild(rowEl);
    });
  }
  rl.classList.add('show');
}

// Event Listeners for Search & Typing (Instant 0ms search execution)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    const val = e.target.value;
    clearTimeout(missingProductPromptTimer);
    if (!val.trim()) {
      searchRequestId++;
      clearTimeout(searchFetchTimer);
      if (searchFetchController) {
        searchFetchController.abort();
        searchFetchController = null;
      }
      hideResults();
      return;
    }
    // Execute search immediately (0ms latency)
    doSearch(val, false);
    // A barcode scan finishes as an Enter search. For typed entries, wait
    // briefly for the worker to stop typing and only offer Add Product when
    // there are no matches. Never auto-open a product from a typing pause.
    if (val.trim().length >= 3) {
      const queryAtSchedule = val.trim();
      missingProductPromptTimer = setTimeout(() => {
        void promptOnlyWhenSearchIsMissing(queryAtSchedule);
      }, 700);
    }
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch(e.target.value, true);
    } else if (e.key === 'Escape') {
      hideResults();
    }
  });

  searchInput.addEventListener('focus', e => {
    const val = e.target.value.trim();
    if (val) {
      doSearch(val, false);
    }
  });
}

document.getElementById('clearRecent').addEventListener('click', () => {
  recent = [];
  recentPage = 1;
  activeProduct = null;
  try {
    localStorage.removeItem(recentKey());
    localStorage.removeItem('wh_active_product');
  } catch (e) {}
  document.getElementById('tagCard').classList.remove('show');
  document.getElementById('emptyState').style.display = 'block';
  document.getElementById('skeletonState').style.display = 'none';
  document.getElementById('emptyPrompt').style.display = 'flex';
  renderRecent();
});

const recentPrevBtn = document.getElementById('recentPrevBtn');
if (recentPrevBtn) {
  recentPrevBtn.addEventListener('click', () => {
    if (recentPage > 1) {
      recentPage--;
      renderRecent();
    }
  });
}

const recentNextBtn = document.getElementById('recentNextBtn');
if (recentNextBtn) {
  recentNextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(recent.length / recentPageSize);
    if (recentPage < totalPages) {
      recentPage++;
      renderRecent();
    }
  });
}

// Scanner Logic Setup

// --- SCANNER LOGIC ---
let html5QrCode = null;
let scanTarget = 'search';

const scanBtnEl = document.getElementById('scanBtn');
if (scanBtnEl) scanBtnEl.addEventListener('click', () => startScanner('search'));

const scanForAddBtnEl = document.getElementById('scanForAddBtn');
if (scanForAddBtnEl) scanForAddBtnEl.addEventListener('click', () => startScanner('add'));

const scanEditLocQrBtnEl = document.getElementById('scanEditLocQrBtn');
if (scanEditLocQrBtnEl) scanEditLocQrBtnEl.addEventListener('click', () => startScanner('edit_location_qr'));

const scanAddLocQrBtnEl = document.getElementById('scanAddLocQrBtn');
if (scanAddLocQrBtnEl) scanAddLocQrBtnEl.addEventListener('click', () => startScanner('add_location_qr'));

// Homepage QR Location Scanner — scan a shelf QR to see products at that location
const scanQrLocBtnEl = document.getElementById('scanQrLocBtn');
if (scanQrLocBtnEl) scanQrLocBtnEl.addEventListener('click', () => startScanner('home_location_qr'));

const closeScanEl = document.getElementById('closeScan');
if (closeScanEl) closeScanEl.addEventListener('click', stopScanner);

const testBeepBtnEl = document.getElementById('testBeepBtn');
if (testBeepBtnEl) {
  testBeepBtnEl.addEventListener('click', () => {
    primeAudioEngine();
    playScanBeep(false);
    if (typeof showToast === 'function') showToast('🔊 Beep sound played!');
  });
}

let barcodeAudioEl = null;
let qrAudioEl = null;
let globalAudioCtx = null;

function createBeepWavDataUri(frequency = 1800, durationMs = 85, volume = 0.95) {
  try {
    const sampleRate = 22050;
    const numSamples = Math.floor(sampleRate * (durationMs / 1000));
    const buffer = new Uint8Array(44 + numSamples * 2);
    const view = new DataView(buffer.buffer);

    buffer.set([82, 73, 70, 70], 0); // "RIFF"
    view.setUint32(4, 36 + numSamples * 2, true);
    buffer.set([87, 65, 86, 69], 8); // "WAVE"
    buffer.set([102, 109, 116, 32], 12); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    buffer.set([100, 97, 116, 97], 36); // "data"
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const fadeOut = (i > numSamples - 330) ? (numSamples - i) / 330 : 1;
      const sample = Math.sin(2 * Math.PI * frequency * t) * volume * fadeOut;
      const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
      view.setInt16(44 + i * 2, intSample, true);
    }

    let binary = '';
    for (let i = 0; i < buffer.length; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
  } catch (e) {
    return '';
  }
}

function initAudioElements() {
  if (!barcodeAudioEl) {
    const barcodeWav = createBeepWavDataUri(1800, 85, 0.95);
    if (barcodeWav) {
      barcodeAudioEl = new Audio(barcodeWav);
      barcodeAudioEl.preload = 'auto';
    }
  }
  if (!qrAudioEl) {
    const qrWav = createBeepWavDataUri(2200, 110, 0.95);
    if (qrWav) {
      qrAudioEl = new Audio(qrWav);
      qrAudioEl.preload = 'auto';
    }
  }
}

function primeAudioEngine() {
  initAudioElements();

  // 1. Prime Web Audio Context
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
        globalAudioCtx = new AudioCtx();
      }
      if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume().catch(() => {});
      }
    }
  } catch (e) {}

  // 2. Pre-unlock HTML5 Audio elements on mobile Safari & Chrome SILENTLY (muted play)
  try {
    if (barcodeAudioEl && barcodeAudioEl.paused) {
      barcodeAudioEl.muted = true;
      const p1 = barcodeAudioEl.play();
      if (p1 && typeof p1.then === 'function') {
        p1.then(() => {
          barcodeAudioEl.pause();
          barcodeAudioEl.muted = false;
          barcodeAudioEl.currentTime = 0;
        }).catch(() => {
          barcodeAudioEl.muted = false;
        });
      }
    }
    if (qrAudioEl && qrAudioEl.paused) {
      qrAudioEl.muted = true;
      const p2 = qrAudioEl.play();
      if (p2 && typeof p2.then === 'function') {
        p2.then(() => {
          qrAudioEl.pause();
          qrAudioEl.muted = false;
          qrAudioEl.currentTime = 0;
        }).catch(() => {
          qrAudioEl.muted = false;
        });
      }
    }
  } catch (e) {}
}

// User touch/click listeners to pre-prime mobile audio engines
if (typeof window !== 'undefined') {
  ['touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
    document.addEventListener(evt, () => {
      primeAudioEngine();
    }, { once: false, passive: true });
  });
}

function playScanBeep(isQr = false) {
  try {
    // 1. Mobile haptic vibration
    if (navigator.vibrate) {
      try { navigator.vibrate(isQr ? [50, 40, 50] : 70); } catch (e) {}
    }

    // 2. Web Audio Synthesizer (Crystal Clear Audio Tone)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
          globalAudioCtx = new AudioCtx();
        }
        if (globalAudioCtx.state === 'suspended') {
          globalAudioCtx.resume().catch(() => {});
        }

        const osc = globalAudioCtx.createOscillator();
        const gain = globalAudioCtx.createGain();

        const freq = isQr ? 2400 : 1850;
        const duration = isQr ? 0.14 : 0.10;
        const now = globalAudioCtx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);
      }
    } catch (err) {
      console.warn('Web Audio beep error:', err);
    }

    // 3. Primary HTML5 Audio Element Playback (Media Stream Channel)
    initAudioElements();
    const targetAudio = isQr ? qrAudioEl : barcodeAudioEl;
    if (targetAudio) {
      try {
        targetAudio.muted = false;
        targetAudio.currentTime = 0;
        targetAudio.play().catch(() => {});
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Scan beep error:', e);
  }
}

// A separate three-note chime makes a saved shelf location distinguishable
// from barcode and QR scan sounds, especially when several staff are working.
function playLocationSaveSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!globalAudioCtx || globalAudioCtx.state === 'closed') globalAudioCtx = new AudioCtx();
    if (globalAudioCtx.state === 'suspended') globalAudioCtx.resume().catch(() => {});

    const now = globalAudioCtx.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const start = now + index * 0.095;
      const oscillator = globalAudioCtx.createOscillator();
      const gain = globalAudioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
      oscillator.connect(gain);
      gain.connect(globalAudioCtx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.26);
    });
  } catch (err) {
    console.warn('Location save sound error:', err);
  }
}

window.playScanBeep = playScanBeep;
window.playScanBeepSound = playScanBeep;

async function startScanner(target) {
  primeAudioEngine();
  scanTarget = target || 'search';
  const overlayEl = document.getElementById('scannerOverlay');
  if (overlayEl) overlayEl.classList.add('show');
  
  const hintEl = document.querySelector('.scan-hint');
  if (hintEl) {
    hintEl.style.color = '';
    hintEl.textContent = (target.includes('location_qr') || target.includes('loc'))
      ? 'Point the camera at the location QR code (e.g. 1-02-01-03).'
      : 'Hold the item barcode steady inside the frame.';
  }

  if (html5QrCode) {
    try { await html5QrCode.stop(); } catch (e) {}
    try { html5QrCode.clear(); } catch (e) {}
    html5QrCode = null;
  }

  let options = {
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
    }
  };
  const SupportedFormats = window.Html5QrcodeSupportedFormats || (window.Html5Qrcode && window.Html5Qrcode.SupportedFormats);
  if (SupportedFormats) {
    options.formatsToSupport = [
      SupportedFormats.EAN_13,
      SupportedFormats.EAN_8,
      SupportedFormats.UPC_A,
      SupportedFormats.UPC_E,
      SupportedFormats.CODE_128,
      SupportedFormats.CODE_39,
      SupportedFormats.QR_CODE
    ];
  }

  html5QrCode = new Html5Qrcode("reader", options);

  const isQr = target.includes('qr') || target.includes('location');
  const qrbox = isQr ? { width: 250, height: 250 } : { width: 280, height: 160 };
  const config = {
    fps: 25,
    qrbox,
    aspectRatio: 1.777778,
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
    }
  };
  const onScan = (decodedText) => onScanSuccess(decodedText);
  const onError = () => {};

  const applyAutofocus = () => {
    try {
      if (html5QrCode && typeof html5QrCode.getRunningTrack === 'function') {
        const track = html5QrCode.getRunningTrack();
        if (track && track.applyConstraints) {
          track.applyConstraints({
            advanced: [{ focusMode: "continuous" }]
          }).catch(() => {});
        }
      }
    } catch (e) {}
  };

  // 1. Try environment camera mode
  try {
    await html5QrCode.start({ facingMode: "environment" }, config, onScan, onError);
    applyAutofocus();
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
      applyAutofocus();
      return;
    }
  } catch (err2) {
    console.warn('Camera device enumeration failed:', err2);
  }

  // 3. Try any user facing camera
  try {
    await html5QrCode.start({ facingMode: "user" }, config, onScan, onError);
    applyAutofocus();
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
  const isQr = Boolean(scanTarget && (scanTarget.includes('qr') || scanTarget.includes('location')));
  playScanBeep(isQr);
  stopScanner();
  if (scanTarget === 'add') {
    document.getElementById('fBarcode').value = code;
    autoFillAddFormForBarcode(code);
  } else if (scanTarget === 'location_qr') {
    handleLocationQRScan(code);
  } else if (scanTarget === 'carton_barcode') {
    if (cartonStockNoInput) cartonStockNoInput.value = code;
    if (cartonClearSearchBtn) cartonClearSearchBtn.style.display = 'block';
    if (cartonOverlay) cartonOverlay.classList.add('show');
    doCartonProductSearch(code, true);
  } else if (scanTarget === 'carton_location_qr') {
    handleCartonLocationQRScan(code);
  } else if (scanTarget === 'edit_location_qr') {
    handleEditLocationQRScan(code);
  } else if (scanTarget === 'add_location_qr') {
    handleAddLocationQRScan(code);
  } else if (scanTarget === 'checker_location_qr') {
    handleCheckerLocationScan(code);
  } else if (scanTarget === 'rapid_barcode') {
    handleRapidBarcodeScanned(code);
  } else if (scanTarget === 'inventory_receive_barcode') {
    const receiveLookup = document.getElementById('inventoryReceiveLookup');
    if (receiveLookup) receiveLookup.value = code;
    findInventoryReceiveProduct(code);
  } else if (scanTarget === 'rapid_location_qr') {
    currentRapidLocation = code.trim();
    const parsedRapidLocation = parseLocationQR(currentRapidLocation);
    if (parsedRapidLocation) setRapidLocationFields(parsedRapidLocation);
    rapidLocationBadgeVal.textContent = currentRapidLocation;
    rapidLocationBadge.style.display = 'block';
    checkRapidExistingLocationProduct();
  } else if (scanTarget === 'home_location_qr') {
    handleHomeLocationQRScan(code);
  } else {
    document.getElementById('searchInput').value = code;
    doSearch(code, true);
  }
}

async function handleCheckerLocationScan(code) {
  const parsed = parseLocationQR(code);
  const locStr = parsed ? `${parsed.floor}-${parsed.row}-${parsed.shelf}-${parsed.level}` : code.trim();
  window.currentAuditLoc = locStr;
  
  showToast(`Auditing location: ${locStr}...`);

  let items = [];
  try {
    const res = await fetch(`/api/products/by-location?loc=${encodeURIComponent(locStr)}`).then(r => r.json());
    if (res.success && Array.isArray(res.products)) items = res.products;
  } catch (e) {}

  if (!items || items.length === 0) {
    const targetLoc = locStr.toLowerCase();
    items = PRODUCTS.filter(p => {
      const f = String(p.floor || '').trim();
      const r = String(p.batch !== undefined && p.batch !== null ? p.batch : (p.row || '')).trim();
      const s = String(p.shelf || '').trim();
      const l = String(p.level || '').trim();
      const fullLoc = `${f}-${r}-${s}-${l}`;
      return fullLoc === locStr || (p.loc && p.loc.toLowerCase().includes(targetLoc));
    });
  }

  renderLocationAuditModal(locStr, items);
}

function renderLocationAuditModal(locStr, items) {
  const overlay = document.getElementById('locationAuditOverlay');
  const titleEl = document.getElementById('auditLocTitle');
  const totalSkuEl = document.getElementById('auditTotalSku');
  const totalQtyEl = document.getElementById('auditTotalQty');
  const listEl = document.getElementById('auditProductList');

  titleEl.textContent = `Location Audit: ${locStr}`;
  totalSkuEl.textContent = items.length;
  
  const totalQty = items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
  totalQtyEl.textContent = totalQty;

  listEl.innerHTML = '';

  if (items.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:30px 10px; color:#64748b; font-size:13px;">
        🔍 No products currently registered at <b>${escapeHtml(locStr)}</b>.<br>
        <span style="font-size:11px; opacity:0.8;">Use Rapid Logger or Add Product to map stock here.</span>
      </div>
    `;
  } else {
    items.forEach(item => {
      const card = document.createElement('div');
      card.style.cssText = 'background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; display:flex; flex-direction:column; gap:8px;';
      
      const st = statusInfo(item.status);
      const stockmanVal = (item.last_modified_by && item.last_modified_by !== 'System Import') ? item.last_modified_by : 'Unassigned';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-weight:700; font-size:14px; color:#0f172a;">${escapeHtml(item.product_name || item.n)}</div>
            <div style="font-size:11.5px; color:#64748b; margin-top:2px;">
              Barcode: <b>${escapeHtml(item.barcode || item.b || '—')}</b> | Stock No.: <b>${escapeHtml(item.stock_no || item.s || '—')}</b>
            </div>
            <div style="font-size:11px; color:#94a3b8; margin-top:2px;">
              ${escapeHtml(item.category || item.c || '—')} &bull; ${escapeHtml(item.department || item.sc || '—')}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:16px; font-weight:800; color:#16a34a;">${item.qty || 0} units</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Mapped by: <b>${escapeHtml(stockmanVal)}</b></div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #cbd5e1; padding-top:8px; margin-top:4px;">
          <span class="badge ${st.cls}" style="font-size:10.5px; padding:3px 8px;">${st.label}</span>
          <div style="display:flex; gap:6px;">
            <button type="button" style="background:#ecfdf5; border:1px solid #a7f3d0; color:#047857; font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; cursor:pointer;" onclick="setAuditItemStatus(${item.id}, 'DONE')">
              ✅ Verify Audit
            </button>
            <button type="button" style="background:#fffbe6; border:1px solid #fef08a; color:#b45309; font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; cursor:pointer;" onclick="setAuditItemStatus(${item.id}, 'NEEDS RECOUNT')">
              ⚠️ Flag Recount
            </button>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  }

  overlay.classList.add('show');
}

async function setAuditItemStatus(id, status) {
  if (!id) return;
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status })
    }).then(r => r.json());

    if (res.success) {
      showToast(`Audit status updated to "${status}"`);
      const item = PRODUCTS.find(p => p.id === id);
      if (item) item.status = status;
      if (window.currentAuditLoc) {
        handleCheckerLocationScan(window.currentAuditLoc);
      }
    }
  } catch (e) {
    showToast('Failed to update audit status.');
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
    showToast("Invalid location QR format. Expected format like '1-02-01-03'.", 'error');
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
    const fQtyEl = document.getElementById('fQty');
    if (fQtyEl) fQtyEl.focus();
    showToast(`Location set: Floor ${parsed.floor}, Row ${parsed.row}, Shelf ${parsed.shelf}, Level ${parsed.level}`);
  } else {
    showToast("Invalid location QR format. Expected format like '1-02-01-03'.", 'error');
  }
}

async function autoFillAddFormForBarcode(code) {
  if (!code) return;
  const cleanCode = code.trim().toLowerCase();
  
  let match = PRODUCTS.find(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
    const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === cleanCode) || (b2 && b2 === cleanCode) || (s && s === cleanCode);
  });

  if (!match) {
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(code)}&limit=5`).then(r => r.json());
      if (res.success && Array.isArray(res.products) && res.products.length > 0) {
        match = res.products.find(item =>
          (item.barcode || '').toLowerCase() === cleanCode ||
          (item.barcode_2 || '').toLowerCase() === cleanCode ||
          (item.stock_no || '').toLowerCase() === cleanCode
        );
      }
    } catch (e) {}
  }

  if (match) {
    document.getElementById('fName').value = match.product_name || match.name || match.n || '';
    document.getElementById('fStock').value = match.stock_no || match.stock_code || match.s || '';
    document.getElementById('fCategory').value = match.category || match.c || '';
    document.getElementById('fSubcategory').value = match.department || match.subcategory || match.sc || '';
    showToast(`Auto-filled: "${match.product_name || match.name || match.n}"`);
  }
}

// Scan/Enter resolved to a product that has no shelf location yet:
// open the Add Product modal pre-filled so the user can map it immediately.
function openAddFormForScannedNoLocation(match, code) {
  activeProduct = match;
  openAddForm();
  const barcodeVal = (match && (match.barcode || match.b)) || code || '';
  document.getElementById('fBarcode').value = barcodeVal;
  autoFillAddFormForBarcode(code || barcodeVal);
  const name = match && (match.product_name || match.name || match.n);
  showToast(name
    ? `"${name}" has no location yet — set one below to map it.`
    : 'Scanned product has no location yet — set one below to map it.');
}

function stopScanner() {
  const scanOverlay = document.getElementById('scannerOverlay');
  if (scanOverlay) scanOverlay.classList.remove('show');
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

document.getElementById('cancelAddBtn').addEventListener('click', closeAddForm);
document.getElementById('saveProductBtn').addEventListener('click', saveNewProduct);

function openAddForm() {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
  const typed = document.getElementById('searchInput').value.trim();
  document.getElementById('fBarcode').value = /^\d+$/.test(typed) ? typed : '';
  document.getElementById('fName').value = /^\d+$/.test(typed) ? '' : typed;
  document.getElementById('fStock').value = '';
  
  // Pre-populate category from active product context if available
  const activeCat = (activeProduct && (activeProduct.category || activeProduct.c)) || '';
  document.getElementById('fCategory').value = activeCat;
  document.getElementById('fSubcategory').value = (activeProduct && (activeProduct.department || activeProduct.subcategory || activeProduct.sc)) || '';
  
  const fQtyEl = document.getElementById('fQty');
  if (fQtyEl) fQtyEl.value = '';
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
  const stock_no = document.getElementById('fStock').value.trim();
  
  const category = document.getElementById('fCategory').value.trim();
  
  const department = document.getElementById('fSubcategory').value.trim();
  const floor = document.getElementById('fFloor').value;
  const row = pad2(document.getElementById('fRow').value);
  const shelf = pad2(document.getElementById('fShelf').value);
  const level = pad2(document.getElementById('fLevel').value);
  const fQtyEl = document.getElementById('fQty');
  const qtyRaw = fQtyEl ? fQtyEl.value.trim() : '0';
  const stockmanRaw = document.getElementById('fStockman').value.trim();

  // stock_no is optional; if blank, use the barcode as fallback identifier
  const effective_stock_code = stock_no || barcode || '';

  if (!name || !row || !shelf) {
    formError.classList.add('show');
    return;
  }
  formError.classList.remove('show');

  const validQty = 0;

  const btn = document.getElementById('saveNewBtn');
  if (btn && btn.disabled) return;
  if (btn) btn.disabled = true;

  try {
    const loc = `${floor}-${row}-${shelf}-${level || '0'}`;
    const floorLabel = floor === '1' ? 'First Floor' : (floor === '2' ? 'Second Floor' : 'Third Floor');
    const storage_location = `${loc} ${floorLabel} - Row ${row} - Shelves ${shelf} - Level ${level || '0'}`;

    const payload = {
      barcode,
      stock_code: effective_stock_code,
      name: name,
      category: category || 'Uncategorized',
      subcategory: department,
      floor,
      batch: row,
      shelf,
      level: level || '0',
      loc: loc,
      loc_full: storage_location,
      qty: validQty,
      status: 'MAPPED',
      custom: true,
      last_modified_by: stockmanRaw || (currentUser ? currentUser.full_name : 'Guest Stockman')
    };

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success && res.product) {
      PRODUCTS.push(res.product);
      rebuildIndex();
      persistSearchIndexSoon();
      closeAddForm();
      renderProduct(res.product);
      showToast(`Saved to Database! "${name}" is now at Floor ${floor}, Row ${row}, Shelf ${shelf}.`);
      updateStatsHeader();
    } else {
      showToast('Error saving product: ' + (res.error || 'Unknown error'), 'error');
    }
  } catch (err) {
    console.error('Failed to post product:', err);
    showToast('Server connection error while saving product.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// --- EDIT PRODUCT LOGIC ---
const editOverlay = document.getElementById('editOverlay');
const editFormError = document.getElementById('editFormError');

document.getElementById('editProductBtn').addEventListener('click', openEditForm);
document.getElementById('cancelEditBtn').addEventListener('click', closeEditForm);
document.getElementById('saveEditBtn').addEventListener('click', saveEditProduct);

const efAddQtyEl = document.getElementById('efAddQty');
if (efAddQtyEl) {
  efAddQtyEl.addEventListener('input', e => {
    const base = window.currentEditBaseQty !== undefined ? window.currentEditBaseQty : (parseInt(document.getElementById('efQty').value, 10) || 0);
    const addVal = parseInt(e.target.value, 10) || 0;
    const hint = document.getElementById('efQtyMathHint');
    if (e.target.value.trim() !== '') {
      const total = base + addVal;
      document.getElementById('efQty').value = total;
      if (hint) {
        hint.style.display = 'block';
        hint.innerHTML = `Calculation: <b>${base} (Existing) + ${addVal} (New) = ${total} Total Units</b>`;
      }
    } else {
      document.getElementById('efQty').value = base;
      if (hint) hint.style.display = 'none';
    }
  });
}

const inventoryReceiveOverlay = document.getElementById('inventoryReceiveOverlay');
const inventoryReceiveBtn = document.getElementById('receiveInventoryBtn');
const inventoryReceiveScanBtn = document.getElementById('inventoryReceiveScanBtn');
const inventoryReceiveCancel = document.getElementById('inventoryReceiveCancel');
const inventoryReceiveSave = document.getElementById('inventoryReceiveSave');
let inventoryReceiveTargetProduct = null;

function openInventoryReceiveModal(product = activeProduct) {
  if (!inventoryReceiveOverlay) return;
  inventoryReceiveTargetProduct = product || null;
  const activeProduct = product || {};
  const lookup = document.getElementById('inventoryReceiveLookup');
  const name = activeProduct.product_name || activeProduct.name || activeProduct.n || 'Product';
  const barcode = activeProduct.barcode || activeProduct.b || '—';
  const stock = activeProduct.stock_no || activeProduct.stock_code || activeProduct.s || '—';
  document.getElementById('inventoryReceiveProductName').textContent = name;
  document.getElementById('inventoryReceiveProductMeta').textContent = `Barcode: ${barcode} | Stock No: ${stock}`;
  if (lookup) lookup.value = product ? (activeProduct.barcode || activeProduct.b || activeProduct.stock_no || activeProduct.stock_code || activeProduct.s || '') : '';
  if (!product) {
    document.getElementById('inventoryReceiveProductName').textContent = 'No product selected';
    document.getElementById('inventoryReceiveProductMeta').textContent = 'Barcode: — | Stock No: —';
    const resultEl = document.getElementById('inventoryReceiveLookupResult');
    if (resultEl) resultEl.textContent = 'Find a product before recording the receipt.';
  } else {
    const resultEl = document.getElementById('inventoryReceiveLookupResult');
    if (resultEl) resultEl.textContent = 'Product selected. Enter the physically counted quantity.';
  }
  document.getElementById('inventoryReceiveQty').value = '';
  document.getElementById('inventoryReceivePackage').value = 'EACH';
  document.getElementById('inventoryReceiveLocation').value = 'RECEIVING';
  document.getElementById('inventoryReceiveLot').value = '';
  document.getElementById('inventoryReceiveError').classList.remove('show');
  hideInventoryReceiveSuggestions();
  inventoryReceiveOverlay.classList.add('show');
  setTimeout(() => (product ? document.getElementById('inventoryReceiveQty') : lookup)?.focus(), 80);
}

if (inventoryReceiveBtn) inventoryReceiveBtn.addEventListener('click', openInventoryReceiveModal);
if (inventoryReceiveCancel) inventoryReceiveCancel.addEventListener('click', () => inventoryReceiveOverlay?.classList.remove('show'));
if (inventoryReceiveScanBtn) inventoryReceiveScanBtn.addEventListener('click', () => startScanner('inventory_receive_barcode'));
async function findInventoryReceiveProduct(scannedCode) {
  const lookup = document.getElementById('inventoryReceiveLookup');
  const resultEl = document.getElementById('inventoryReceiveLookupResult');
  const errorEl = document.getElementById('inventoryReceiveError');
  const query = String(scannedCode || lookup?.value || '').trim();
  if (!query) {
    resultEl.textContent = 'Enter a barcode or stock number.';
    return;
  }
  const normalized = query.toLowerCase();
  const localProduct = PRODUCTS.find(product => [
    product.barcode || product.b || '',
    product.barcode_2 || product.b2 || '',
    product.stock_no || product.stock_code || product.s || ''
  ].some(value => String(value).trim().toLowerCase() === normalized));
  if (localProduct) {
    inventoryReceiveTargetProduct = localProduct;
    openInventoryReceiveModal(localProduct);
    return;
  }
  resultEl.textContent = 'Finding product…';
  errorEl.classList.remove('show');
  try {
    const response = await authFetch(`/api/products/lookup/${encodeURIComponent(query)}`);
    const data = await response.json();
    if (!response.ok || !data.success || !data.product) throw new Error(data.message || 'Product not found.');
    inventoryReceiveTargetProduct = data.product;
    openInventoryReceiveModal(data.product);
  } catch (err) {
    inventoryReceiveTargetProduct = null;
    resultEl.textContent = '';
    errorEl.textContent = err.message;
    errorEl.classList.add('show');
  }
}
const inventoryReceiveLookup = document.getElementById('inventoryReceiveLookup');
const inventoryReceiveSuggestions = document.getElementById('inventoryReceiveSuggestions');

function hideInventoryReceiveSuggestions() {
  if (!inventoryReceiveSuggestions) return;
  inventoryReceiveSuggestions.innerHTML = '';
  inventoryReceiveSuggestions.style.display = 'none';
}

function clearInventoryReceiveSelection(message) {
  inventoryReceiveTargetProduct = null;
  document.getElementById('inventoryReceiveProductName').textContent = 'No product selected';
  document.getElementById('inventoryReceiveProductMeta').textContent = 'Barcode: — | Stock No: —';
  const resultEl = document.getElementById('inventoryReceiveLookupResult');
  if (resultEl) resultEl.textContent = message || 'Choose a product from the suggestions.';
}

function showInventoryReceiveSuggestions(query) {
  if (!inventoryReceiveSuggestions) return;
  const q = String(query || '').trim().toLowerCase();
  if (q.length < 2 || !PRODUCTS.length) return hideInventoryReceiveSuggestions();
  const tokens = q.split(/\s+/).filter(Boolean);
  const matches = [];
  for (let index = 0; index < PRODUCTS.length; index++) {
    const product = PRODUCTS[index];
    const text = product._searchStr || [product.barcode || product.b, product.barcode_2 || product.b2, product.stock_no || product.stock_code || product.s, product.product_name || product.name || product.n].join(' ').toLowerCase();
    if (!tokens.every(token => text.includes(token))) continue;
    const barcode = String(product._b || product.barcode || product.b || '');
    const stock = String(product._s || product.stock_no || product.stock_code || product.s || '');
    const name = String(product._n || product.product_name || product.name || product.n || '').toLowerCase();
    const score = barcode.startsWith(q) || stock.startsWith(q) ? 4 : (name.startsWith(q) ? 3 : (name.includes(q) ? 2 : 1));
    matches.push({ product, score });
    if (matches.length >= 30) break;
  }
  matches.sort((a, b) => b.score - a.score);
  const unique = new Map();
  for (const match of matches) {
    const product = match.product;
    const key = String(product.barcode || product.b || product.stock_no || product.stock_code || product.s || product.id);
    if (!unique.has(key)) unique.set(key, product);
    if (unique.size >= 12) break;
  }
  if (!unique.size) return hideInventoryReceiveSuggestions();

  inventoryReceiveSuggestions.innerHTML = '';
  for (const product of unique.values()) {
    const name = product.product_name || product.name || product.n || 'Unnamed product';
    const barcode = product.barcode || product.b || product.barcode_2 || product.b2 || '—';
    const stock = product.stock_no || product.stock_code || product.s || '—';
    const item = document.createElement('div');
    item.className = 'inventory-receive-suggestion';
    item.setAttribute('role', 'option');
    item.innerHTML = `<div style="font-size:13px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(name)}</div><div style="font:11px var(--mono);color:var(--muted);margin-top:2px;">Barcode: ${escapeHtml(barcode)} &nbsp;|&nbsp; Stock No: ${escapeHtml(stock)}</div>`;
    item.addEventListener('pointerdown', event => {
      event.preventDefault();
      if (inventoryReceiveLookup) inventoryReceiveLookup.value = barcode;
      inventoryReceiveTargetProduct = product;
      openInventoryReceiveModal(product);
    });
    inventoryReceiveSuggestions.appendChild(item);
  }
  inventoryReceiveSuggestions.style.display = 'block';
}

if (inventoryReceiveLookup) inventoryReceiveLookup.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    hideInventoryReceiveSuggestions();
  }
});
if (inventoryReceiveLookup) inventoryReceiveLookup.addEventListener('input', () => {
  const query = inventoryReceiveLookup.value.trim().toLowerCase();
  clearInventoryReceiveSelection(query ? 'Choose a product from the suggestions.' : 'Find a product before recording the receipt.');
  showInventoryReceiveSuggestions(query);
});
if (inventoryReceiveLookup) inventoryReceiveLookup.addEventListener('blur', () => setTimeout(hideInventoryReceiveSuggestions, 160));
if (inventoryReceiveSave) inventoryReceiveSave.addEventListener('click', async () => {
  const product = inventoryReceiveTargetProduct || activeProduct;
  if (!product) return;
  const qty = Number.parseInt(document.getElementById('inventoryReceiveQty').value, 10);
  const errorEl = document.getElementById('inventoryReceiveError');
  if (!Number.isInteger(qty) || qty <= 0) {
    errorEl.textContent = 'Enter a positive counted quantity.';
    errorEl.classList.add('show');
    return;
  }
  inventoryReceiveSave.disabled = true;
  try {
    const response = await authFetch('/api/inventory/receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barcode: product.barcode || product.b,
        stock_no: product.stock_no || product.stock_code || product.s,
        product_name: product.product_name || product.name || product.n,
        qty,
        package_type: document.getElementById('inventoryReceivePackage').value,
        location_code: document.getElementById('inventoryReceiveLocation').value.trim() || 'RECEIVING',
        lot_code: document.getElementById('inventoryReceiveLot').value.trim(),
        source_reference: document.getElementById('inventoryReceiveLot').value.trim()
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Could not record receipt.');
    inventoryReceiveOverlay.classList.remove('show');
    showToast(`Received ${qty.toLocaleString()} units into inventory ledger.`);
    invalidateInventorySummaryCache(product.barcode || product.b || product.stock_no || product.stock_code || product.s);
    loadInventorySummary(product);
  } catch (err) {
    if (isNetworkFailure(err)) {
      queueInventoryAction('/api/inventory/receipts', {
        barcode: product.barcode || product.b,
        stock_no: product.stock_no || product.stock_code || product.s,
        product_name: product.product_name || product.name || product.n,
        qty,
        package_type: document.getElementById('inventoryReceivePackage').value,
        location_code: document.getElementById('inventoryReceiveLocation').value.trim() || 'RECEIVING',
        lot_code: document.getElementById('inventoryReceiveLot').value.trim(),
        source_reference: document.getElementById('inventoryReceiveLot').value.trim()
      }, 'stock receipt');
      inventoryReceiveOverlay.classList.remove('show');
      showToast('Receipt saved on this device. It will sync automatically when connected.');
    } else {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
    }
  } finally {
    inventoryReceiveSave.disabled = false;
  }
});

function openEditForm() {
  if (!activeProduct) return;

  document.getElementById('efId').value = activeProduct.id || '';
  document.getElementById('efName').value = activeProduct.product_name || activeProduct.name || activeProduct.n || '';
  document.getElementById('efBarcode').value = activeProduct.barcode || activeProduct.b || '';
  document.getElementById('efStock').value = activeProduct.stock_no || activeProduct.stock_code || activeProduct.s || '';
  document.getElementById('efCategory').value = activeProduct.category || activeProduct.c || '';
  document.getElementById('efSubcategory').value = activeProduct.department || activeProduct.subcategory || activeProduct.sc || '';

  // Extract Floor, Row, Shelf, Level from all possible properties
  let f = activeProduct.floor !== undefined && activeProduct.floor !== null ? String(activeProduct.floor).trim() : '';
  let r = activeProduct.row !== undefined && activeProduct.row !== null ? String(activeProduct.row).trim() : (activeProduct.batch ? String(activeProduct.batch).trim() : '');
  let s = activeProduct.shelf !== undefined && activeProduct.shelf !== null ? String(activeProduct.shelf).trim() : '';
  let l = activeProduct.level !== undefined && activeProduct.level !== null ? String(activeProduct.level).trim() : '';

  // Parse loc string if discrete fields are empty (e.g. "1-02-01-02")
  if ((!f || !r || !s) && activeProduct.loc) {
    const parts = String(activeProduct.loc).split('-');
    if (parts.length >= 3) {
      f = f || parts[0].trim();
      r = r || parts[1].trim();
      s = s || parts[2].trim();
      l = l || (parts[3] ? parts[3].trim() : '0');
    }
  }

  // Parse from locations array if present
  if ((!f || !r || !s) && Array.isArray(activeProduct.locations) && activeProduct.locations.length > 0) {
    const firstLoc = activeProduct.locations[0];
    if (firstLoc) {
      f = f || (firstLoc.floor !== undefined && firstLoc.floor !== null ? String(firstLoc.floor).trim() : '');
      r = r || (firstLoc.row !== undefined && firstLoc.row !== null ? String(firstLoc.row).trim() : (firstLoc.batch ? String(firstLoc.batch).trim() : ''));
      s = s || (firstLoc.shelf !== undefined && firstLoc.shelf !== null ? String(firstLoc.shelf).trim() : '');
      l = l || (firstLoc.level !== undefined && firstLoc.level !== null ? String(firstLoc.level).trim() : '0');
    }
  }

  // Parse from storage_location/location_storage text if present
  if ((!f || !r || !s) && (activeProduct.storage_location || activeProduct.location_storage)) {
    const text = String(activeProduct.storage_location || activeProduct.location_storage);
    const m = text.match(/(\d+)-(\d+)-(\d+)(?:-(\d+))?/);
    if (m) {
      f = f || m[1];
      r = r || m[2];
      s = s || m[3];
      l = l || m[4] || '0';
    }
  }

  document.getElementById('efFloor').value = f || '1';
  document.getElementById('efRow').value = r || '';
  document.getElementById('efShelf').value = s || '';
  document.getElementById('efLevel').value = l || '0';
  
  const currentQty = activeProduct.qty !== undefined ? activeProduct.qty : 0;
  window.currentEditBaseQty = currentQty;
  document.getElementById('efQty').value = currentQty;
  if (efAddQtyEl) efAddQtyEl.value = '';
  const hint = document.getElementById('efQtyMathHint');
  if (hint) hint.style.display = 'none';

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
  const stock_no = document.getElementById('efStock').value.trim();
  const category = document.getElementById('efCategory').value.trim();
  const department = document.getElementById('efSubcategory').value.trim();
  const floor = document.getElementById('efFloor').value;
  const row = pad2(document.getElementById('efRow').value);
  const shelf = pad2(document.getElementById('efShelf').value);
  const levelRaw = document.getElementById('efLevel').value.trim();
  const level = pad2(levelRaw);
  const qtyRaw = document.getElementById('efQty').value.trim();
  const stockmanRaw = document.getElementById('efStockman').value.trim();

  if (!name || !stock_no || !floor || !row || !shelf || levelRaw === '' || qtyRaw === '' || !stockmanRaw) {
    editFormError.classList.add('show');
    return;
  }
  editFormError.classList.remove('show');

  const loc = `${floor}-${row}-${shelf}-${level}`;
  const floorLabel = floor === '1' ? 'First Floor' : (floor === '2' ? 'Second Floor' : 'Third Floor');
  const storage_location = `${loc} ${floorLabel} - Row ${row} - Shelves ${shelf} - Level ${level}`;

  const validQty = validateQty(qtyRaw);
  if (validQty === null) {
    showToast('Invalid quantity.', 'error');
    return;
  }

  const btn = document.getElementById('saveEditBtn');
  if (btn && btn.disabled) return;
  if (btn) btn.disabled = true;

  try {
    const payload = {
      name: name,
      barcode,
      stock_code: stock_no || barcode || '',
      category: category || 'Uncategorized',
      subcategory: department,
      floor,
      batch: row,
      shelf,
      level,
      loc,
      loc_full: storage_location,
      qty: validQty,
      status: 'MAPPED',
      custom: true,
      last_modified_by: stockmanRaw || (currentUser ? currentUser.full_name : 'Guest Stockman')
    };

    const currentName = activeProduct?.product_name || activeProduct?.name || activeProduct?.n || '';
    const currentBarcode = activeProduct?.barcode || activeProduct?.b || '';
    const currentStock = activeProduct?.stock_no || activeProduct?.stock_code || activeProduct?.s || '';
    const currentCategory = activeProduct?.category || activeProduct?.c || '';
    const currentDepartment = activeProduct?.department || activeProduct?.subcategory || activeProduct?.sc || '';
    payload.sync_product_metadata = !id ||
      name !== String(currentName).trim() ||
      barcode !== String(currentBarcode).trim() ||
      stock_no !== String(currentStock).trim() ||
      (category || 'Uncategorized') !== String(currentCategory).trim() ||
      department !== String(currentDepartment).trim();

    if (!id) {
      Object.assign(activeProduct, payload);
      renderProduct(activeProduct);
      closeEditForm();
      showToast(`Updated "${name}" location details!`);
      return;
    }

    const productIndex = PRODUCTS.findIndex(p => String(p.id) === String(id));
    const originalProduct = productIndex !== -1 ? { ...PRODUCTS[productIndex] } : null;
    const originalActiveProduct = activeProduct ? { ...activeProduct } : null;
    const baseProduct = originalProduct || originalActiveProduct || {};
    const optimisticProduct = {
      ...baseProduct,
      id: baseProduct.id || id,
      product_name: name,
      name,
      barcode,
      stock_no: stock_no || barcode || '',
      stock_code: stock_no || barcode || '',
      category: category || 'Uncategorized',
      department,
      subcategory: department,
      floor,
      row,
      batch: row,
      shelf,
      level,
      loc,
      location_storage: storage_location,
      storage_location,
      loc_full: storage_location,
      qty: validQty,
      status: 'MAPPED',
      custom: true,
      last_modified_by: stockmanRaw || (currentUser ? currentUser.full_name : 'Guest Stockman')
    };

    // Update the visible card immediately. The server request continues in
    // the background and rolls back this optimistic state if it fails.
    if (productIndex !== -1) PRODUCTS[productIndex] = optimisticProduct;
    else PRODUCTS.push(optimisticProduct);
    activeProduct = optimisticProduct;
    rebuildIndex();
    persistSearchIndexSoon();
    closeEditForm();
    renderProduct(optimisticProduct);
    showToast(`Saving "${name}"...`, 'info');

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(async response => {
        const body = await response.json();
        if (!response.ok || !body.success) throw new Error(body.error || 'Unknown server error');
        return body;
      });

      if (res.product) {
        const savedIndex = PRODUCTS.findIndex(p => String(p.id) === String(res.product.id));
        if (savedIndex !== -1) PRODUCTS[savedIndex] = { ...PRODUCTS[savedIndex], ...res.product };
        else PRODUCTS.push(res.product);
        const currentIsEdited = activeProduct && String(activeProduct.id) === String(id);
        if (currentIsEdited) activeProduct = res.product;
        rebuildIndex();
        persistSearchIndexSoon();
        if (currentIsEdited) renderProduct(res.product);
        if (typeof renderPortalDataTable === 'function') {
          void renderPortalDataTable({ refreshStats: true });
        }
      }
      showToast(`Updated in Database! "${name}" location is now Floor ${floor}, Row ${row}, Shelf ${shelf}.`);
    } catch (err) {
      const optimisticIndex = PRODUCTS.findIndex(p => String(p.id) === String(id));
      if (originalProduct && optimisticIndex !== -1) PRODUCTS[optimisticIndex] = originalProduct;
      else if (optimisticIndex !== -1) PRODUCTS.splice(optimisticIndex, 1);
      const currentIsEdited = activeProduct && String(activeProduct.id) === String(id);
      if (currentIsEdited) {
        activeProduct = originalActiveProduct;
        rebuildIndex();
        if (activeProduct) {
          renderProduct(activeProduct);
          openEditForm();
        }
      } else {
        rebuildIndex();
      }
      throw err;
    }
  } catch (err) {
    console.error('Failed to update product:', err);
    showToast('Server error updating product.', 'error');
  } finally {
    if (btn) btn.disabled = false;
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
function showToast(msg, type = 'success') {
  const t = document.getElementById('successToast');
  const hasIcon = msg.includes('⚡') || msg.includes('🔔') || msg.includes('📍') || msg.includes('✅') || msg.includes('⚠️') || msg.includes('🔒') || msg.includes('📦');
  const icon = hasIcon ? '' : (type === 'error' ? '❌ ' : '✨ ');
  t.innerHTML = `<span>${icon}${escapeHtml(msg).replace(/&amp;/g, '&')}</span>`;
  t.style.background = type === 'error' ? 'var(--alert-red, #e74c3c)' : '';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// --- AUTHENTICATION EVENT LISTENERS ---
document.getElementById('authBtn').addEventListener('click', () => {
  if (currentUser) {
    currentUser = null;
    localStorage.removeItem('wh_current_user');
    localStorage.removeItem('wh_token');
    // Switch to guest recent list
    try { recent = JSON.parse(localStorage.getItem(recentKey()) || '[]'); } catch(e) { recent = []; }
    updateUserUI();
    renderRecent();
    showToast('Logged out.');
  } else {
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginFormError').style.display = 'none';
    document.getElementById('loginOverlay').classList.add('show');
  }
});

document.getElementById('closeLoginModal').addEventListener('click', () => {
  document.getElementById('loginOverlay').classList.remove('show');
});

let selectedRole = 'admin';

if (document.getElementById('auditLocationQrBtn')) {
  document.getElementById('auditLocationQrBtn').addEventListener('click', () => startScanner('checker_location_qr'));
}

if (document.getElementById('closeAuditModal')) {
  document.getElementById('closeAuditModal').addEventListener('click', () => {
    document.getElementById('locationAuditOverlay').classList.remove('show');
  });
}

window.quickFillLogin = function(u, p) {
  const uInput = document.getElementById('loginUsername');
  const pInput = document.getElementById('loginPassword');
  if (uInput) uInput.value = u;
  if (pInput) pInput.value = p;
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    if (typeof loginForm.requestSubmit === 'function') {
      loginForm.requestSubmit();
    } else {
      loginForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }
};

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const u = document.getElementById('loginUsername').value.trim();
  const p = document.getElementById('loginPassword').value.trim();
  const errEl = document.getElementById('loginFormError');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server returned ${response.status} ${response.statusText}. The server might be down or restarting.`);
    }

    const res = await response.json();

    if (res.success && res.user) {
      currentUser = res.user;
      if (res.token) {
        localStorage.setItem('wh_token', res.token);
      }
      localStorage.setItem('wh_current_user', JSON.stringify(currentUser));
      // Load this user's own recent lookups
      try { recent = JSON.parse(localStorage.getItem(recentKey()) || '[]'); } catch(e) { recent = []; }
      updateUserUI();
      renderRecent();
      document.getElementById('loginOverlay').classList.remove('show');
      showToast(`Welcome, ${currentUser.full_name}!`);
    } else {
      errEl.textContent = res.error || 'Invalid username or password.';
      errEl.style.display = 'block';
    }
  } catch (err) {
    console.error('Login error:', err);
    if (err instanceof TypeError) {
      errEl.textContent = 'Network error: Cannot reach the server. Please check your connection or try again later.';
    } else {
      errEl.textContent = err.message || 'Server connection error during login.';
    }
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
    const rw = String(p.batch !== undefined && p.batch !== null ? p.batch : (p.row || ''));
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
  const level = document.getElementById('fLevel').value.trim() || '0';

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
  const level = document.getElementById('efLevel').value.trim() || '0';

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
  showToast("⚠️ Shelf / Location Full Instructions:\n\nIf the assigned shelf slot or location is full, please place the newly arrived stock in a nearby position.\n\nTo make this simple:\n1. Look at the nearby suggestions row below (e.g., Next Shelf, Higher Level, or Neighboring Row).\n2. Place the physical product in that new location.\n3. Tap that suggestion pill in this app. The coordinates will auto-fill instantly!\n4. Click Save to complete the update.");
}

function showNotFoundModal(query) {
  pendingMissingProductQuery = String(query || '').trim();
  document.getElementById('notFoundMessage').textContent = `No product matching "${query}" was found in the database. Would you like to add it now?`;
  document.getElementById('notFoundOverlay').classList.add('show');
}

document.getElementById('cancelNotFoundBtn').addEventListener('click', () => {
  document.getElementById('notFoundOverlay').classList.remove('show');
  pendingMissingProductQuery = '';
});

document.getElementById('confirmNotFoundBtn').addEventListener('click', () => {
  const query = pendingMissingProductQuery;
  document.getElementById('notFoundOverlay').classList.remove('show');
  openAddForm();
  const isBarcode = /^\d+$/.test(query);
  const isStockCode = /^[a-z]{1,8}[-\s]?\d[\w-]*$/i.test(query);
  document.getElementById('fBarcode').value = isBarcode ? query : '';
  document.getElementById('fStock').value = isStockCode ? query : '';
  document.getElementById('fName').value = isBarcode || isStockCode ? '' : query;
  pendingMissingProductQuery = '';
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

// Close dropdowns and search results when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('#searchInput') && !e.target.closest('#resultsList')) {
    hideResults();
  }
  if (!e.target.closest('.combobox-container')) {
    const dropdown = document.getElementById('fCategoryDropdown');
    if (dropdown) dropdown.style.display = 'none';
    const editDropdown = document.getElementById('efCategoryDropdown');
    if (editDropdown) editDropdown.style.display = 'none';
  }
});

function parseLocationQR(text) {
  text = text.trim();
  const parts = text.split('-');
  if (parts.length >= 3) {
    let floor = parts[0].trim();
    if (floor.toUpperCase() === '3F') floor = '3'; // Normalize 3F to 3 so DB stays clean
    if (floor.toUpperCase() === '1F') floor = '1';
    if (floor.toUpperCase() === '2F') floor = '2';
    return {
      floor: floor,
      row: parts[1].trim(),
      shelf: parts[2].trim(),
      level: parts[3] ? parts[3].trim() : '0'
    };
  }
  return null;
}

window.openAddQtyForLocation = function(index) {
  if (!window.currentLocs || !window.currentLocs[index]) return;
  const item = window.currentLocs[index];

  document.getElementById('addStockId').value = item.id || '';
  const currentQty = parseInt(item.qty, 10) || 0;
  document.getElementById('addStockExistingQty').value = currentQty;

  const pName = item.product_name || (activeProduct ? activeProduct.product_name || activeProduct.name : 'Product');
  const pBar = item.barcode || (activeProduct ? activeProduct.barcode || activeProduct.b : '—');
  const pStock = item.stock_no || (activeProduct ? activeProduct.stock_no || activeProduct.s : '—');

  document.getElementById('addStockProductName').textContent = pName;
  document.getElementById('addStockProductMeta').textContent = `Barcode: ${pBar} | Stock No: ${pStock}`;

  const floor = item.floor !== undefined && item.floor !== null ? String(item.floor).trim() : '1';
  const row = item.batch !== undefined && item.batch !== null ? String(item.batch).trim() : (item.row !== undefined && item.row !== null ? String(item.row).trim() : '01');
  const shelf = item.shelf !== undefined && item.shelf !== null ? String(item.shelf).trim() : '01';
  const level = item.level !== undefined && item.level !== null ? String(item.level).trim() : '0';

  document.getElementById('addStockLocBadge').textContent = `Floor ${floor} - Row ${row} - Shelf ${shelf} - Level ${level}`;

  document.getElementById('addStockCurrentDisplay').value = currentQty;
  document.getElementById('addStockNewInput').value = '';
  document.getElementById('addStockmanInput').value = currentUser ? currentUser.full_name : (item.last_modified_by || '');
  clearAddStockFormError();

  updateAddStockMathPreview(currentQty, 0);

  window.currentEditingLocIndex = index;
  const modal = document.getElementById('addStockModal');
  if (modal) modal.classList.add('show');

  setTimeout(() => {
    const input = document.getElementById('addStockNewInput');
    if (input) { input.focus(); }
  }, 100);
};

function updateAddStockMathPreview(existingQty, newAddQty) {
  const ex = parseInt(existingQty, 10) || 0;
  const add = parseInt(newAddQty, 10) || 0;
  const total = ex + add;

  const previewEl = document.getElementById('addStockMathPreview');
  const btnTextEl = document.getElementById('confirmAddStockBtnText');

  if (previewEl) {
    if (add > 0) {
      previewEl.innerHTML = `<b style="color:#15803d;">${ex} (Existing) + ${add} (New) = ${total} Total Units</b>`;
    } else if (add < 0) {
      previewEl.innerHTML = `<b style="color:#b45309;">${ex} (Existing) - ${Math.abs(add)} (Removed) = ${total} Total Units</b>`;
    } else {
      previewEl.innerHTML = `<span>${ex} (Existing) + 0 (New) = <b>${ex} Total Units</b></span>`;
    }
  }

  if (btnTextEl) {
    btnTextEl.textContent = add !== 0 ? 'Save & Add Stock' : 'Save Quantity';
  }
}

function showAddStockFormError(message) {
  const error = document.getElementById('addStockFormError');
  if (!error) return;
  error.textContent = message;
  error.classList.add('show');
}

function clearAddStockFormError() {
  const error = document.getElementById('addStockFormError');
  if (!error) return;
  error.textContent = '';
  error.classList.remove('show');
}

async function saveAddStockToLocation() {
  const id = document.getElementById('addStockId').value;
  const existingQty = parseInt(document.getElementById('addStockExistingQty').value, 10) || 0;
  const addQtyRaw = document.getElementById('addStockNewInput').value.trim();
  const addQty = Number(addQtyRaw);
  const stockman = document.getElementById('addStockmanInput').value.trim();

  if (!addQtyRaw || !Number.isInteger(addQty) || addQty < 1) {
    showAddStockFormError(CURRENT_LANG === 'en' ? 'Add New Qty is required. Enter a whole quantity of at least 1.' : '新增数量为必填项。请输入至少为 1 的整数。');
    return;
  }
  if (!stockman) {
    showAddStockFormError(CURRENT_LANG === 'en' ? 'Responsible Stockman is required.' : '负责理货员为必填项。');
    return;
  }
  clearAddStockFormError();

  const finalQty = existingQty + addQty;
  if (finalQty < 0) {
    showToast("Total quantity cannot be negative.", 'error');
    return;
  }
  if (addQty < 0) {
    showToast('Quantity reductions require a physical count and supervisor-approved adjustment.', 'error');
    return;
  }

  const btn = document.getElementById('confirmAddStockBtn');
  if (btn && btn.disabled) return;
  if (btn) btn.disabled = true;

  try {
    const idx = window.currentEditingLocIndex;

    if (id) {
      if (addQty > 0) {
        const item = window.currentLocs && window.currentLocs[idx] ? window.currentLocs[idx] : activeProduct;
        const loc = item && (item.loc || `${item.floor || '1'}-${item.row || item.batch || '00'}-${item.shelf || '00'}-${item.level || '0'}`);
        const receiptResponse = await authFetch('/api/inventory/receipts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            barcode: item && (item.barcode || item.b),
            stock_no: item && (item.stock_no || item.stock_code || item.s),
            product_name: item && (item.product_name || item.name || item.n),
            qty: addQty,
            location_code: loc,
            package_type: 'EACH',
            source_reference: 'Add Stock to Location'
          })
        });
        const receiptData = await receiptResponse.json();
        if (!receiptResponse.ok || !receiptData.success) throw new Error(receiptData.error || 'Could not record inventory receipt.');
      }
      const payload = {
        qty: finalQty,
        last_modified_by: stockman || (currentUser ? currentUser.full_name : 'Staff Stockman'),
        status: 'MAPPED'
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success) {
        showToast(`✅ Added ${addQty} units! New total stock at location is ${finalQty}.`);
        document.getElementById('addStockModal').classList.remove('show');

        // Update the small on-demand cache; do not re-download 50k rows after
        // a single stock change.
        const localIndex = PRODUCTS.findIndex(p => String(p.id) === String(id));
        if (localIndex >= 0 && res.product) PRODUCTS[localIndex] = { ...PRODUCTS[localIndex], ...res.product };
        rebuildIndex();
        persistSearchIndexSoon();
        const targetItem = PRODUCTS.find(p => String(p.id) === String(id)) || res.product;
        if (targetItem) renderProduct(targetItem);
      } else {
        showToast("Failed to update stock: " + (res.error || "Unknown error"), 'error');
      }
    }
  } catch (err) {
    console.error("Error saving added stock:", err);
    showToast("Network error updating stock.", 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Add Stock Modal Event Listeners
const closeAddStockModalBtnEl = document.getElementById('closeAddStockModalBtn');
if (closeAddStockModalBtnEl) closeAddStockModalBtnEl.addEventListener('click', () => {
  document.getElementById('addStockModal').classList.remove('show');
});

const cancelAddStockBtnEl = document.getElementById('cancelAddStockBtn');
if (cancelAddStockBtnEl) cancelAddStockBtnEl.addEventListener('click', () => {
  document.getElementById('addStockModal').classList.remove('show');
});

const confirmAddStockBtnEl = document.getElementById('confirmAddStockBtn');
if (confirmAddStockBtnEl) confirmAddStockBtnEl.addEventListener('click', saveAddStockToLocation);

const addStockNewInputEl = document.getElementById('addStockNewInput');
if (addStockNewInputEl) {
  addStockNewInputEl.addEventListener('input', e => {
    clearAddStockFormError();
    const existing = parseInt(document.getElementById('addStockExistingQty').value, 10) || 0;
    const val = parseInt(e.target.value, 10) || 0;
    updateAddStockMathPreview(existing, val);
  });
  addStockNewInputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveAddStockToLocation();
    }
  });
}

document.getElementById('addStockmanInput')?.addEventListener('input', clearAddStockFormError);

const openFullEditFromAddStockBtnEl = document.getElementById('openFullEditFromAddStockBtn');
if (openFullEditFromAddStockBtnEl) {
  openFullEditFromAddStockBtnEl.addEventListener('click', () => {
    document.getElementById('addStockModal').classList.remove('show');
    if (window.currentEditingLocIndex !== undefined) {
      openEditFormForProductIndex(window.currentEditingLocIndex);
    }
  });
}

async function handleHomeLocationQRScan(code) {
  const parsed = parseLocationQR(code);
  if (!parsed) {
    showToast("Invalid location QR code format. Expected e.g. '1-02-01-03'.", 'error');
    return;
  }
  window.currentScannedHomeLoc = { code, parsed };
  
  showToast("Fetching products at location...", 'info');
  
  try {
    const res = await fetch(`/api/products/by-location?floor=${parsed.floor}&row=${parsed.row}&shelf=${parsed.shelf}&level=${parsed.level}`);
    const data = await res.json();
    
    if (data.success) {
      document.getElementById('locProductsBadge').textContent = `Location: Floor ${parsed.floor} - Row ${parsed.row} - Shelf ${parsed.shelf} - Level ${parsed.level}`;
      
      const listEl = document.getElementById('locProductsList');
      listEl.innerHTML = '';
      
      if (data.products && data.products.length > 0) {
        document.getElementById('locProductsEmpty').style.display = 'none';
        
        data.products.forEach(p => {
          const row = document.createElement('div');
          row.className = 'loc-product-row';
          
          const infoDiv = document.createElement('div');
          infoDiv.className = 'loc-product-info';
          
          const nameDiv = document.createElement('div');
          nameDiv.className = 'loc-product-name';
          nameDiv.textContent = p.product_name || p.name || p.n || 'Unknown Product';
          
          const metaDiv = document.createElement('div');
          metaDiv.className = 'loc-product-meta';
          metaDiv.textContent = `Barcode: ${p.barcode || p.b || '—'} | Stock No: ${p.stock_no || p.stock_code || p.s || '—'}`;
          
          infoDiv.appendChild(nameDiv);
          infoDiv.appendChild(metaDiv);
          
          const rightContainer = document.createElement('div');
          rightContainer.style.display = 'flex';
          rightContainer.style.alignItems = 'center';
          rightContainer.style.gap = '6px';

          const qtyDiv = document.createElement('div');
          qtyDiv.className = 'loc-product-qty';
          qtyDiv.textContent = `${p.qty || 0} pcs`;
          
          const deleteBtn = document.createElement('button');
          deleteBtn.type = 'button';
          deleteBtn.className = 'card-btn btn-delete-loc';
          deleteBtn.style.cssText = 'height: 28px; min-height: 28px; padding: 0 8px; font-size: 11px; border-radius: 6px;';
          deleteBtn.textContent = TRANSLATIONS[CURRENT_LANG].cardDeleteLoc || 'Delete';
          deleteBtn.title = 'Delete location for this item';
          deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteLocationForProduct(p, parsed);
          };

          const chevron = document.createElement('div');
          chevron.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--muted);"><path d="m9 18 6-6-6-6"/></svg>`;
          chevron.style.display = 'flex';
          
          rightContainer.appendChild(qtyDiv);
          rightContainer.appendChild(deleteBtn);
          rightContainer.appendChild(chevron);
          
          row.appendChild(infoDiv);
          row.appendChild(rightContainer);
          
          row.addEventListener('click', () => {
             // Close the location products modal
             document.getElementById('locProductsModal').classList.remove('show');
             // Open the add quantity modal
             openAddQtyFromLocationModal(p, parsed);
          });
          
          listEl.appendChild(row);
        });
      } else {
        document.getElementById('locProductsEmpty').style.display = 'block';
      }
      
      document.getElementById('locProductsModal').classList.add('show');
    } else {
      showToast("Failed to fetch location products: " + (data.error || "Unknown error"), 'error');
    }
  } catch (err) {
    console.error("Failed to fetch location products:", err);
    showToast("Network error while fetching products.", 'error');
  }
}

window.currentLocModalProduct = null;
window.currentLocModalParsed = null;

function openAddQtyFromLocationModal(item, parsedLoc) {
  window.currentLocModalProduct = item;
  window.currentLocModalParsed = parsedLoc || null;

  document.getElementById('addStockId').value = item.id || '';
  const currentQty = parseInt(item.qty, 10) || 0;
  document.getElementById('addStockExistingQty').value = currentQty;

  const pName = item.product_name || item.name || item.n || 'Product';
  const pBar = item.barcode || item.b || '—';
  const pStock = item.stock_no || item.stock_code || item.s || '—';

  document.getElementById('addStockProductName').textContent = pName;
  document.getElementById('addStockProductMeta').textContent = `Barcode: ${pBar} | Stock No: ${pStock}`;

  const floor = item.floor !== undefined && item.floor !== null ? String(item.floor).trim() : (parsedLoc ? parsedLoc.floor : '1');
  const row = item.batch !== undefined && item.batch !== null ? String(item.batch).trim() : (item.row !== undefined && item.row !== null ? String(item.row).trim() : (parsedLoc ? parsedLoc.row : '01'));
  const shelf = item.shelf !== undefined && item.shelf !== null ? String(item.shelf).trim() : (parsedLoc ? parsedLoc.shelf : '01');
  const level = item.level !== undefined && item.level !== null ? String(item.level).trim() : (parsedLoc ? parsedLoc.level : '0');

  document.getElementById('addStockLocBadge').textContent = `Floor ${floor} - Row ${row} - Shelf ${shelf} - Level ${level}`;

  document.getElementById('addStockCurrentDisplay').value = currentQty;
  document.getElementById('addStockNewInput').value = '';
  document.getElementById('addStockmanInput').value = currentUser ? currentUser.full_name : (item.last_modified_by || '');
  clearAddStockFormError();

  updateAddStockMathPreview(currentQty, 0);

  // Keep the current activeProduct if one was selected, but we don't strictly need it to just update DB
  window.currentEditingLocIndex = -1; // Hack to prevent trying to open edit modal back later if it fails

  document.getElementById('addStockModal').classList.add('show');
  setTimeout(() => {
    document.getElementById('addStockNewInput').focus();
  }, 300);
}

async function deleteLocationForProduct(item, parsedLoc) {
  if (!item) return;
  const prodName = item.product_name || item.name || item.n || 'this product';
  let targetId = item.id;
  const isEn = CURRENT_LANG === 'en';

  const barcode = (item.barcode || item.b || '').toString().trim().toLowerCase();
  const barcode2 = (item.barcode_2 || item.b2 || '').toString().trim().toLowerCase();
  const stockCode = (item.stock_no || item.stock_code || item.s || '').toString().trim().toLowerCase();

  // If no direct target ID, lookup from local cache
  if (!targetId) {
    const matched = PRODUCTS.find(p => {
      const b1 = (p.barcode || p.b || '').toString().trim().toLowerCase();
      const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
      const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
      if (barcode && (b1 === barcode || b2 === barcode)) return true;
      if (barcode2 && (b1 === barcode2 || b2 === barcode2)) return true;
      if (stockCode && s === stockCode) return true;
      return false;
    });
    if (matched) targetId = matched.id;
  }

  // If still no target ID, try fetching from server lookup
  if (!targetId && (barcode || stockCode)) {
    try {
      const lookupRes = await fetch(`/api/products/lookup/${encodeURIComponent(barcode || stockCode)}`).then(r => r.json()).catch(() => null);
      if (lookupRes && lookupRes.product && lookupRes.product.id) {
        targetId = lookupRes.product.id;
      }
    } catch (_) {}
  }

  const floor = item.floor || (parsedLoc ? parsedLoc.floor : '1');
  const row = item.row || item.batch || (parsedLoc ? parsedLoc.row : '');
  const shelf = item.shelf || (parsedLoc ? parsedLoc.shelf : '');
  const level = item.level || (parsedLoc ? parsedLoc.level : '00');
  const locDisplay = `Floor ${floor}, Row ${row}, Shelf ${shelf}, Level ${level}`;

  const confirmMsg = isEn
    ? `Delete shelf location (${locDisplay}) for "${prodName}"?\n\nThe product itself will NOT be deleted and will remain in the catalog.`
    : `确认删除商品 "${prodName}" 的货架位置 (${locDisplay})？\n\n提示：此操作仅清除货位，商品仍将保留在库存目录中。`;

  if (!confirm(confirmMsg)) return;

  showToast(isEn ? 'Removing shelf location...' : '正在清除货架位置...');

  try {
    // Check if there are multiple database entries/rows for this SKU
    const matchingRows = PRODUCTS.filter(p => {
      const b1 = (p.barcode || p.b || '').toString().trim().toLowerCase();
      const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
      const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
      if (barcode && (b1 === barcode || b2 === barcode)) return true;
      if (barcode2 && (b1 === barcode2 || b2 === barcode2)) return true;
      if (stockCode && s === stockCode) return true;
      return false;
    });

    const isMultiRow = matchingRows.length > 1;

    let res = null;
    if (isMultiRow && targetId) {
      res = await fetch(`/api/products/${targetId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()).catch(() => null);
    } else if (targetId) {
      res = await fetch(`/api/products/${targetId}/reset-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()).catch(() => null);
    }

    // Fallback: If reset-location endpoint wasn't reached or failed, use PUT with empty location fields
    if (!res || !res.success) {
      if (targetId) {
        res = await fetch(`/api/products/${targetId}`, {
          method: isMultiRow ? 'DELETE' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: isMultiRow ? undefined : JSON.stringify({
            floor: '',
            batch: '',
            row: '',
            shelf: '',
            level: '0',
            loc: '',
            loc_full: '',
            location_storage: '',
            storage_location: '',
            is_carton: false,
            loc_type: 'SHELF',
            qty: 0,
            status: 'UNMAPPED',
            last_modified_by: currentUser ? currentUser.full_name : 'Staff Stockman'
          })
        }).then(r => r.json()).catch(() => null);
      }
    }

    if (res && res.success) {
      if (isMultiRow && targetId) {
        const pIdx = PRODUCTS.findIndex(p => String(p.id) === String(targetId));
        if (pIdx !== -1) PRODUCTS.splice(pIdx, 1);
        if (typeof productsData !== 'undefined' && Array.isArray(productsData)) {
          const dIdx = productsData.findIndex(p => String(p.id) === String(targetId));
          if (dIdx !== -1) productsData.splice(dIdx, 1);
        }
      } else if (targetId) {
        const pIdx = PRODUCTS.findIndex(p => String(p.id) === String(targetId));
        if (pIdx !== -1) {
          PRODUCTS[pIdx].floor = '';
          PRODUCTS[pIdx].row = '';
          PRODUCTS[pIdx].batch = '';
          PRODUCTS[pIdx].shelf = '';
          PRODUCTS[pIdx].level = '0';
          PRODUCTS[pIdx].loc = '';
          PRODUCTS[pIdx].location_storage = '';
          PRODUCTS[pIdx].storage_location = '';
          PRODUCTS[pIdx].is_carton = false;
          PRODUCTS[pIdx].loc_type = 'SHELF';
          PRODUCTS[pIdx].status = 'UNMAPPED';
          PRODUCTS[pIdx].qty = 0;
        }
      }

      rebuildIndex();

      // Close add stock modal if open
      const addStockModal = document.getElementById('addStockModal');
      if (addStockModal) addStockModal.classList.remove('show');

      // Refresh the scanned location modal list in real time
      const activeLoc = parsedLoc || (window.currentScannedHomeLoc ? window.currentScannedHomeLoc.parsed : null);
      if (activeLoc) {
        const scanCode = (window.currentScannedHomeLoc && window.currentScannedHomeLoc.code) || `${activeLoc.floor}-${activeLoc.row}-${activeLoc.shelf}-${activeLoc.level}`;
        handleHomeLocationQRScan(scanCode);
      } else {
        const locProductsModal = document.getElementById('locProductsModal');
        if (locProductsModal) locProductsModal.classList.remove('show');
      }

      // Refresh product display if currently open on homepage
      if (activeProduct) {
        const nextProd = PRODUCTS.find(p => String(p.id) === String(targetId)) || activeProduct;
        renderProduct(nextProd);
      }

      if (typeof renderPortalDataTable === 'function') {
        renderPortalDataTable({ refreshStats: true });
      }

      showToast(isEn ? '🗑️ Location removed! Product is now unmapped.' : '🗑️ 货位已清除！商品现为未上架状态。', 'success');
    } else {
      showToast('Failed to delete location: ' + (res?.message || res?.error || 'Server error'), 'error');
    }
  } catch (err) {
    showToast('Network error removing location: ' + err.message, 'error');
  }
}

// Wire up the close button for the location products modal
document.addEventListener('DOMContentLoaded', () => {
  const closeLocProductsModalBtn = document.getElementById('closeLocProductsModal');
  if (closeLocProductsModalBtn) {
    closeLocProductsModalBtn.addEventListener('click', () => {
      document.getElementById('locProductsModal').classList.remove('show');
    });
  }

});

async function handleLocationQRScan(code) {
  if (!activeProduct) {
    showToast("No active product selected to link a location to.", 'error');
    return;
  }
  const parsed = parseLocationQR(code);
  if (!parsed) {
    showToast("Invalid location QR code format. Expected e.g. '1-02-01-03'.", 'error');
    return;
  }

  // Check if this location ALREADY exists for activeProduct
  const existingIdx = (window.currentLocs || []).findIndex(item => {
    const pf = String(item.floor !== undefined && item.floor !== null ? item.floor : '').trim();
    const pb = String(item.batch !== undefined && item.batch !== null ? item.batch : (item.row || '')).trim();
    const ps = String(item.shelf !== undefined && item.shelf !== null ? item.shelf : '').trim();
    const pl = String(item.level !== undefined && item.level !== null ? item.level : '').trim();

    return pf === String(parsed.floor) &&
           pb === String(parsed.row) &&
           ps === String(parsed.shelf) &&
           pl === String(parsed.level);
  });

  if (existingIdx !== -1) {
    showToast("📍 Existing location scanned! Add new incoming quantity below.");
    openAddQtyForLocation(existingIdx);
    return;
  }

  showToast("Registering new location...");

  const payload = {
    barcode: activeProduct.barcode || activeProduct.b || '',
    stock_no: activeProduct.stock_no || activeProduct.stock_code || activeProduct.s || '',
    product_name: activeProduct.product_name || activeProduct.name || activeProduct.n,
    category: activeProduct.category || activeProduct.c || 'Uncategorized',
    subcategory: activeProduct.department || activeProduct.subcategory || activeProduct.sc || '',
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
      
      const localIndex = PRODUCTS.findIndex(p => String(p.id) === String(res.product?.id));
      if (localIndex >= 0) PRODUCTS[localIndex] = { ...PRODUCTS[localIndex], ...res.product };
      else if (res.product) PRODUCTS.push(res.product);
      rebuildIndex();
      persistSearchIndexSoon();
      updateCategoryDatalist();
      renderProduct(res.product || activeProduct);
    } else {
      showToast("Failed to register location: " + (res.error || "Unknown error"), 'error');
    }
  } catch (err) {
    console.error("Failed to post new location:", err);
    showToast("Network error: failed to link location.", 'error');
  }
}

window.openEditFormForProductIndex = function(index) {
  if (!window.currentLocs || !window.currentLocs[index]) return;
  const p = window.currentLocs[index];
  
  document.getElementById('efId').value = p.id;
  document.getElementById('efName').value = p.product_name || p.name || p.n || '';
  document.getElementById('efBarcode').value = p.barcode || p.b || '';
  document.getElementById('efStock').value = p.stock_no || p.stock_code || p.s || '';
  document.getElementById('efCategory').value = p.category || p.c || '';
  document.getElementById('efSubcategory').value = p.department || p.subcategory || p.sc || '';
  document.getElementById('efFloor').value = p.floor || '1';
  document.getElementById('efRow').value = p.floor !== undefined ? (p.batch !== undefined && p.batch !== null ? p.batch : (p.row || '')) : '';
  document.getElementById('efShelf').value = p.shelf || '';
  document.getElementById('efLevel').value = p.level || '0';

  const currentQty = p.qty !== undefined && p.qty !== null ? p.qty : 0;
  window.currentEditBaseQty = currentQty;
  document.getElementById('efQty').value = currentQty;
  const efAddQty = document.getElementById('efAddQty');
  if (efAddQty) efAddQty.value = '';
  const efHint = document.getElementById('efQtyMathHint');
  if (efHint) efHint.style.display = 'none';

  document.getElementById('efStockman').value = p.last_modified_by || p.modifiedBy || (currentUser ? currentUser.full_name : '');

  document.getElementById('efCategoryDropdown').style.display = 'none';
  document.getElementById('efCategoryDropdown').innerHTML = '';

  document.getElementById('editFormError').classList.remove('show');
  document.getElementById('editOverlay').classList.add('show');
  updateEditLocationSuggestions();
};

function confirmResultCardLocationDelete(productName, locDisplay) {
  const overlay = document.getElementById('deleteLocationConfirmOverlay');
  const title = document.getElementById('deleteLocationConfirmTitle');
  const message = document.getElementById('deleteLocationConfirmMessage');
  const details = document.getElementById('deleteLocationConfirmDetails');
  const note = overlay?.querySelector('.delete-confirm-note');
  const cancelBtn = document.getElementById('cancelDeleteLocationBtn');
  const deleteBtn = document.getElementById('confirmDeleteLocationBtn');

  if (!overlay || !title || !message || !details || !note || !cancelBtn || !deleteBtn) {
    return Promise.resolve(false);
  }

  const isEn = CURRENT_LANG === 'en';
  title.textContent = isEn ? 'Remove this location?' : '删除此库位？';
  message.textContent = isEn
    ? `You are about to remove the shelf location for “${productName}”.`
    : `您即将删除“${productName}”的货架位置。`;
  details.textContent = locDisplay;
  note.textContent = isEn
    ? 'The product will remain in the catalog. Only this shelf location will be removed.'
    : '商品仍会保留在目录中，只会删除此货架位置。';
  cancelBtn.textContent = isEn ? 'Cancel' : '取消';
  deleteBtn.textContent = isEn ? 'Delete Location' : '删除库位';
  overlay.classList.add('show');

  return new Promise(resolve => {
    const finish = confirmed => {
      overlay.classList.remove('show');
      cancelBtn.removeEventListener('click', cancel);
      deleteBtn.removeEventListener('click', confirmDelete);
      overlay.removeEventListener('click', clickOutside);
      document.removeEventListener('keydown', keyHandler);
      resolve(confirmed);
    };
    const cancel = () => finish(false);
    const confirmDelete = () => finish(true);
    const clickOutside = event => {
      if (event.target === overlay) cancel();
    };
    const keyHandler = event => {
      if (event.key === 'Escape') cancel();
    };

    cancelBtn.addEventListener('click', cancel);
    deleteBtn.addEventListener('click', confirmDelete);
    overlay.addEventListener('click', clickOutside);
    document.addEventListener('keydown', keyHandler);
    setTimeout(() => cancelBtn.focus(), 0);
  });
}

window.deleteProductLocation = async function(index) {
  if (!window.currentLocs || !window.currentLocs[index]) return;
  const item = window.currentLocs[index];

  const prodName = item.product_name || (activeProduct ? activeProduct.product_name || activeProduct.name : 'this product');
  const floor = item.floor !== undefined && item.floor !== null ? String(item.floor).trim() : '1';
  const row = item.batch !== undefined && item.batch !== null ? String(item.batch).trim() : (item.row !== undefined && item.row !== null ? String(item.row).trim() : '01');
  const shelf = item.shelf !== undefined && item.shelf !== null ? String(item.shelf).trim() : '01';
  const level = item.level !== undefined && item.level !== null ? String(item.level).trim() : '00';

  const locDisplay = item.hasLoc ? `Floor ${floor}, Row ${row}, Shelf ${shelf}, Level ${level}` : 'unassigned shelf';

  const isEn = CURRENT_LANG === 'en';
  const confirmMsg = isEn
    ? `Delete shelf location (${locDisplay}) for "${prodName}"?\n\nNOTE: The product itself will NOT be deleted and will remain in the catalog.`
    : `确认删除商品 "${prodName}" 的货架位置 (${locDisplay})？\n\n提示：此操作仅清除货位，商品仍将保留在库存目录中。`;

  if (!await confirmResultCardLocationDelete(prodName, locDisplay)) return;

  // Resolve target product ID accurately
  let targetId = item.id;
  if (!targetId) {
    const b1 = (item.barcode || (activeProduct ? activeProduct.barcode || activeProduct.b : '')).toString().trim().toLowerCase();
    const b2 = (item.barcode_2 || (activeProduct ? activeProduct.barcode_2 || activeProduct.b2 : '')).toString().trim().toLowerCase();
    const s = (item.stock_no || (activeProduct ? activeProduct.stock_no || activeProduct.s : '')).toString().trim().toLowerCase();

    const matched = PRODUCTS.find(p => {
      const pb1 = (p.barcode || p.b || '').toString().trim().toLowerCase();
      const pb2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
      const ps = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
      if (b1 && (pb1 === b1 || pb2 === b1)) return true;
      if (b2 && (pb1 === b2 || pb2 === b2)) return true;
      if (s && ps === s) return true;
      return false;
    });

    targetId = matched ? matched.id : (activeProduct ? activeProduct.id : null);
  }

  if (!targetId) {
    showToast(isEn ? 'Error: Cannot identify product ID to delete location.' : '错误：无法确定要删除货位的商品ID。', 'error');
    return;
  }

  showToast(isEn ? 'Removing shelf location...' : '正在清除货架位置...');

  try {
    const barcode = (item.barcode || (activeProduct ? activeProduct.barcode || activeProduct.b : '')).toString().trim().toLowerCase();
    const barcode2 = (item.barcode_2 || (activeProduct ? activeProduct.barcode_2 || activeProduct.b2 : '')).toString().trim().toLowerCase();
    const stockCode = (item.stock_no || (activeProduct ? activeProduct.stock_no || activeProduct.s : '')).toString().trim().toLowerCase();

    // Check if there are other matching rows in PRODUCTS for this product
    const matchingRows = PRODUCTS.filter(p => {
      const b1 = (p.barcode || p.b || '').toString().trim().toLowerCase();
      const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
      const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
      if (barcode && (b1 === barcode || b2 === barcode)) return true;
      if (barcode2 && (b1 === barcode2 || b2 === barcode2)) return true;
      if (stockCode && s === stockCode) return true;
      return false;
    });

    const isMultiRow = matchingRows.length > 1;

    let res;
    if (isMultiRow) {
      res = await fetch(`/api/products/${targetId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()).catch(() => null);
    } else {
      res = await fetch(`/api/products/${targetId}/reset-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()).catch(() => null);
    }

    // Fallback: If reset-location/delete didn't succeed, call PUT with cleared fields
    if (!res || !res.success) {
      const resetPayload = {
        floor: '',
        batch: '',
        row: '',
        shelf: '',
        level: '0',
        loc: '',
        loc_full: '',
        location_storage: '',
        storage_location: '',
        is_carton: false,
        loc_type: 'SHELF',
        qty: 0,
        status: 'UNMAPPED',
        last_modified_by: currentUser ? currentUser.full_name : 'Staff Stockman'
      };

      const fallbackRes = await fetch(`/api/products/${targetId}`, {
        method: isMultiRow ? 'DELETE' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: isMultiRow ? undefined : JSON.stringify(resetPayload)
      }).then(r => r.json()).catch(() => null);

      if (fallbackRes && fallbackRes.success) {
        res = fallbackRes;
      }
    }

    if (res && res.success) {
      if (isMultiRow) {
        const pIdx = PRODUCTS.findIndex(p => String(p.id) === String(targetId));
        if (pIdx !== -1) PRODUCTS.splice(pIdx, 1);
        if (typeof productsData !== 'undefined' && Array.isArray(productsData)) {
          const dIdx = productsData.findIndex(p => String(p.id) === String(targetId));
          if (dIdx !== -1) productsData.splice(dIdx, 1);
        }
      } else {
        const pIdx = PRODUCTS.findIndex(p => String(p.id) === String(targetId));
        if (pIdx !== -1) {
          PRODUCTS[pIdx].floor = '';
          PRODUCTS[pIdx].row = '';
          PRODUCTS[pIdx].batch = '';
          PRODUCTS[pIdx].shelf = '';
          PRODUCTS[pIdx].level = '0';
          PRODUCTS[pIdx].loc = '';
          PRODUCTS[pIdx].location_storage = '';
          PRODUCTS[pIdx].storage_location = '';
          PRODUCTS[pIdx].loc_full = '';
          PRODUCTS[pIdx].is_carton = false;
          PRODUCTS[pIdx].loc_type = 'SHELF';
          PRODUCTS[pIdx].status = 'UNMAPPED';
          PRODUCTS[pIdx].qty = 0;
        }
      }

      rebuildIndex();

      let nextProd = matchingRows.find(p => String(p.id) !== String(targetId));
      if (!nextProd) {
        nextProd = PRODUCTS.find(p => String(p.id) === String(targetId)) || activeProduct;
        if (nextProd) {
          nextProd.floor = '';
          nextProd.row = '';
          nextProd.batch = '';
          nextProd.shelf = '';
          nextProd.level = '0';
          nextProd.loc = '';
          nextProd.location_storage = '';
          nextProd.storage_location = '';
          nextProd.is_carton = false;
          nextProd.loc_type = 'SHELF';
          nextProd.status = 'UNMAPPED';
          nextProd.qty = 0;
        }
      }

      if (nextProd) {
        renderProduct(nextProd);
      }
      if (typeof renderPortalDataTable === 'function') {
        renderPortalDataTable({ refreshStats: true });
      }
      showToast(isEn ? '🗑️ Location removed! Product is now unmapped.' : '🗑️ 货位已清除！商品现为未上架状态。', 'success');
    } else {
      showToast('Failed to delete location: ' + (res?.message || res?.error || 'Server error'), 'error');
    }
  } catch (err) {
    showToast('Network error removing location: ' + err.message, 'error');
  }
};

// --- RAPID LOCATION LOGGER LOGIC ---
const rapidOverlay = document.getElementById('rapidOverlay');
const rapidNewProductFields = document.getElementById('rapidNewProductFields');
const rfName = document.getElementById('rfName');
const rfStock = document.getElementById('rfStock');
const rfCategory = document.getElementById('rfCategory');
const rfSubcategory = document.getElementById('rfSubcategory');
const rfFloor = document.getElementById('rfFloor');
const rfRow = document.getElementById('rfRow');
const rfShelf = document.getElementById('rfShelf');
const rfLevel = document.getElementById('rfLevel');
const rfQty = document.getElementById('rfQty');
const rapidFormError = document.getElementById('rapidFormError');
const rapidLogList = document.getElementById('rapidLogList');

const rapidProductSearchInput = document.getElementById('rapidProductSearchInput');
const rapidClearSearchBtn = document.getElementById('rapidClearSearchBtn');
const rapidSearchResultsList = document.getElementById('rapidSearchResultsList');

const rapidBarcodeBadge = document.getElementById('rapidBarcodeBadge');
const rapidBarcodeBadgeVal = document.getElementById('rapidBarcodeBadgeVal');
const rapidLocationBadge = document.getElementById('rapidLocationBadge');
const rapidLocationBadgeVal = document.getElementById('rapidLocationBadgeVal');

let rapidLogs = [];
let currentRapidBarcode = '';
let currentRapidLocation = '';
let currentRapidExistingRow = null;

let rapidSearchRequestId = 0;
let rapidBackgroundFetchTimer = null;

const rapidLoggerBtnEl = document.getElementById('rapidLoggerBtn');
if (rapidLoggerBtnEl) rapidLoggerBtnEl.addEventListener('click', openRapidLogger);

const closeRapidBtnEl = document.getElementById('closeRapidBtn');
if (closeRapidBtnEl) closeRapidBtnEl.addEventListener('click', closeRapidLogger);

const saveRapidBtnEl = document.getElementById('saveRapidBtn');
if (saveRapidBtnEl) saveRapidBtnEl.addEventListener('click', saveRapidEntry);

const scanForRapidBarcodeBtnEl = document.getElementById('scanForRapidBarcodeBtn');
if (scanForRapidBarcodeBtnEl) scanForRapidBarcodeBtnEl.addEventListener('click', () => startScanner('rapid_barcode'));

const scanForRapidLocBtnEl = document.getElementById('scanForRapidLocBtn');
if (scanForRapidLocBtnEl) scanForRapidLocBtnEl.addEventListener('click', () => startScanner('rapid_location_qr'));

function setRapidLocationFields(location) {
  if (rfFloor) rfFloor.value = location.floor || '1';
  if (rfRow) rfRow.value = location.row || '';
  if (rfShelf) rfShelf.value = location.shelf || '';
  if (rfLevel) rfLevel.value = location.level || '0';
  if (rapidFormError) {
    rapidFormError.textContent = '';
    rapidFormError.classList.remove('show');
  }
}

function updateRapidLocationFromFields() {
  const row = rfRow ? rfRow.value.trim() : '';
  const shelf = rfShelf ? rfShelf.value.trim() : '';
  if (!row || !shelf) {
    currentRapidLocation = '';
    currentRapidExistingRow = null;
    if (rapidLocationBadge) rapidLocationBadge.style.display = 'none';
    return;
  }

  const floor = rfFloor ? rfFloor.value : '1';
  const level = rfLevel && rfLevel.value.trim() !== '' ? rfLevel.value.trim() : '0';
  currentRapidLocation = `${floor}-${pad2(row)}-${pad2(shelf)}-${pad2(level)}`;
  rapidLocationBadgeVal.textContent = currentRapidLocation;
  rapidLocationBadge.style.display = 'block';
  checkRapidExistingLocationProduct();
}

[rfFloor, rfRow, rfShelf, rfLevel].forEach(input => {
  if (input) input.addEventListener('change', updateRapidLocationFromFields);
});

[rfFloor, rfRow, rfShelf, rfLevel, rfQty].forEach(input => {
  input?.addEventListener('input', () => {
    rapidFormError.textContent = '';
    rapidFormError.classList.remove('show');
  });
});

function openRapidLogger() {
  currentRapidBarcode = '';
  currentRapidLocation = '';
  currentRapidExistingRow = null;
  if (rapidProductSearchInput) rapidProductSearchInput.value = '';
  if (rapidClearSearchBtn) rapidClearSearchBtn.style.display = 'none';
  hideRapidSearchResults();

  rfName.value = '';
  rfStock.value = '';
  rfCategory.value = '';
  rfSubcategory.value = '';
  if (rfFloor) rfFloor.value = '1';
  if (rfRow) rfRow.value = '';
  if (rfShelf) rfShelf.value = '';
  if (rfLevel) rfLevel.value = '0';
  if (rfQty) rfQty.value = '';
  
  rapidBarcodeBadge.style.display = 'none';
  rapidLocationBadge.style.display = 'none';
  rapidNewProductFields.style.display = 'none';
  rapidFormError.textContent = '';
  rapidFormError.classList.remove('show');
  rapidOverlay.classList.add('show');
}

function closeRapidLogger() {
  rapidOverlay.classList.remove('show');
  hideRapidSearchResults();
}

if (rapidProductSearchInput) {
  // Instant 0ms synchronous execution on keystroke (matching homepage search speed)
  rapidProductSearchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (rapidClearSearchBtn) rapidClearSearchBtn.style.display = q ? 'block' : 'none';
    clearTimeout(rapidBackgroundFetchTimer);
    if (!q) {
      rapidSearchRequestId++;
      hideRapidSearchResults();
      currentRapidBarcode = '';
      currentRapidExistingRow = null;
      if (rapidBarcodeBadge) rapidBarcodeBadge.style.display = 'none';
      if (rapidNewProductFields) rapidNewProductFields.style.display = 'none';
      return;
    }
    doRapidProductSearch(q);
  });

  rapidProductSearchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = rapidProductSearchInput.value.trim();
      if (!q) return;
      const firstItem = rapidSearchResultsList ? rapidSearchResultsList.querySelector('.rapid-search-item') : null;
      if (firstItem && firstItem._product) {
        selectRapidProduct(firstItem._product);
      } else {
        hideRapidSearchResults();
        await handleRapidBarcodeScanned(q);
      }
    } else if (e.key === 'Escape') {
      hideRapidSearchResults();
    }
  });

  rapidProductSearchInput.addEventListener('focus', () => {
    const q = rapidProductSearchInput.value.trim();
    if (q && (!currentRapidBarcode || rapidProductSearchInput.value !== currentRapidBarcode)) {
      doRapidProductSearch(q);
    }
  });
}

if (rapidClearSearchBtn) {
  rapidClearSearchBtn.addEventListener('click', () => {
    if (rapidProductSearchInput) {
      rapidProductSearchInput.value = '';
      rapidProductSearchInput.focus();
    }
    rapidClearSearchBtn.style.display = 'none';
    hideRapidSearchResults();
    currentRapidBarcode = '';
    currentRapidExistingRow = null;
    if (rapidBarcodeBadge) rapidBarcodeBadge.style.display = 'none';
    if (rapidNewProductFields) rapidNewProductFields.style.display = 'none';
  });
}

function hideRapidSearchResults() {
  if (rapidSearchResultsList) {
    rapidSearchResultsList.style.display = 'none';
    rapidSearchResultsList.innerHTML = '';
  }
}

// Close rapid search dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!rapidOverlay || !rapidOverlay.classList.contains('show')) return;
  if (rapidProductSearchInput && !rapidProductSearchInput.contains(e.target) &&
      rapidSearchResultsList && !rapidSearchResultsList.contains(e.target)) {
    hideRapidSearchResults();
  }
});

// Instant synchronous product search in Rapid Logger (0ms latency)
function doRapidProductSearch(q) {
  if (!q || !rapidSearchResultsList) return;
  const currentRapidReqId = ++rapidSearchRequestId;
  const qLower = q.toLowerCase();
  const qStripped = qLower.replace(/^0+/, '');
  const tokens = qLower.split(/\s+/).filter(Boolean);

  // 1. Direct O(1) Fast Path if exact barcode / stock code
  const exactDirect = byBarcodeMap.get(qLower) || byStockMap.get(qLower) ||
    (qStripped ? (byBarcodeMap.get(qStripped) || byStockMap.get(qStripped)) : null);

  const localCandidates = [];
  if (exactDirect) {
    localCandidates.push({ p: exactDirect, score: 100 });
  }

  // 2. High-speed local in-memory index scan (0ms)
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    if (exactDirect && p === exactDirect) continue;

    if (p._searchStr !== undefined && !productMatchesAllSearchTokens(p, tokens)) continue;
    const score = scoreProductMatch(p, qLower, qStripped, tokens);
    if (score > 0) {
      localCandidates.push({ p, score });
    }
  }

  localCandidates.sort((a, b) => b.score - a.score);

  const seen = new Set();
  const candidateMatches = [];
  for (const item of localCandidates) {
    const p = item.p;
    const key = p.id ? ('id_' + p.id) : (p.barcode || p.b ? ('bar_' + (p.barcode || p.b)) : ('name_' + (p.product_name || p.name || p.n) + '_stock_' + (p.stock_no || p.s)));
    if (!seen.has(key)) {
      seen.add(key);
      candidateMatches.push(p);
    }
    if (candidateMatches.length >= 25) break;
  }

  // 3. INSTANT SYNCHRONOUS RENDER (0ms latency!)
  renderRapidSearchResults(candidateMatches, q);

  // 4. Background NON-BLOCKING server enrichment (debounced, never delays UI)
  if (candidateMatches.length < 5) {
    clearTimeout(rapidBackgroundFetchTimer);
    rapidBackgroundFetchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=20`).then(r => r.json());
        if (currentRapidReqId !== rapidSearchRequestId) return;
        const currentInput = (rapidProductSearchInput?.value || '').trim().toLowerCase();
        if (currentInput !== qLower) return;

        if (res.success && Array.isArray(res.products) && res.products.length > 0) {
          let hasNew = false;
          for (const p of res.products) {
            const key = p.id ? ('id_' + p.id) : (p.barcode || p.b ? ('bar_' + (p.barcode || p.b)) : ('name_' + (p.product_name || p.name || p.n) + '_stock_' + (p.stock_no || p.s)));
            if (!seen.has(key)) {
              seen.add(key);
              candidateMatches.push(p);
              hasNew = true;
            }
          }
          if (hasNew) {
            renderRapidSearchResults(candidateMatches.slice(0, 25), q);
          }
        }
      } catch (e) {
        console.warn("Background rapid search enrich note:", e);
      }
    }, 200);
  }
}

function renderRapidSearchResults(matches, query) {
  if (!rapidSearchResultsList) return;
  rapidSearchResultsList.innerHTML = '';

  if (!matches || matches.length === 0) {
    const isEn = CURRENT_LANG === 'en';
    const noDiv = document.createElement('div');
    noDiv.className = 'no-results';
    noDiv.style.padding = '12px 14px';
    noDiv.style.fontSize = '12.5px';
    noDiv.style.cursor = 'pointer';
    noDiv.innerHTML = `<span style="color:#2563eb; font-weight:600;">➕ ${isEn ? `Use "${escapeHtml(query)}" as new barcode/product` : `将 "${escapeHtml(query)}" 作为新条码使用`}</span>`;
    noDiv.onclick = () => {
      hideRapidSearchResults();
      handleRapidBarcodeScanned(query);
    };
    rapidSearchResultsList.appendChild(noDiv);
    rapidSearchResultsList.style.display = 'block';
    return;
  }

  matches.forEach(p => {
    const itemEl = document.createElement('div');
    itemEl.className = 'rapid-search-item result-row';
    itemEl.style.cssText = 'padding: 9px 12px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.12s ease; border-radius: 0;';
    itemEl._product = p;

    const name = p.product_name || p.name || p.n || 'Unnamed item';
    const barcode = p.barcode || p.b || '';
    const barcode2 = p.barcode_2 || p.b2 || '';
    const stockCode = p.stock_no || p.stock_code || p.s || '';
    const category = p.category || p.c || '';

    const isCarton = Boolean(
      p.is_carton ||
      p.loc_type === 'CARTON' ||
      (p.location_storage && p.location_storage.toUpperCase().includes('CARTON')) ||
      (p.storage_location && p.storage_location.toUpperCase().includes('CARTON'))
    );

    const cartonTag = isCarton 
      ? `<span style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:1px 5px; border-radius:4px; font-size:10px; font-weight:700; margin-left:4px;">📦 Carton</span>`
      : '';

    const floor = p.floor !== undefined && p.floor !== null ? String(p.floor) : '';
    const row = p.batch !== undefined && p.batch !== null ? String(p.batch) : (p.row !== undefined && p.row !== null ? String(p.row) : (p.row || ''));
    const shelf = p.shelf !== undefined && p.shelf !== null ? String(p.shelf) : '';
    const level = p.level !== undefined && p.level !== null ? String(p.level) : '';
    const hasLoc = floor !== '' || row !== '' || shelf !== '';
    const locText = hasLoc ? `📍 ${floor}-${row}-${shelf}-${level}` : `<span style="color:#94a3b8; font-size:11px;">⚠️ No loc</span>`;

    const codeDisplay = barcode || (barcode2 ? `Barcode 2: ${barcode2}` : (stockCode ? `#${stockCode}` : ''));

    itemEl.innerHTML = `
      <div style="flex: 1; min-width: 0; padding-right: 8px;">
        <div style="font-size: 13px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${escapeHtml(name)} ${cartonTag}
        </div>
        <div style="font-size: 11px; color: var(--muted); margin-top: 2px; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${escapeHtml(codeDisplay)}${category ? ` &bull; ${escapeHtml(category)}` : ''}
        </div>
      </div>
      <div style="text-align: right; flex-shrink: 0;">
        <div style="font-size: 11px; font-weight: 600; color: var(--accent);">
          ${locText}
        </div>
      </div>
    `;

    itemEl.addEventListener('click', () => {
      selectRapidProduct(p);
    });

    rapidSearchResultsList.appendChild(itemEl);
  });

  rapidSearchResultsList.style.display = 'block';
}

function selectRapidProduct(p) {
  if (!p) return;
  hideRapidSearchResults();

  const code = p.barcode || p.b || p.barcode_2 || p.b2 || p.stock_no || p.stock_code || p.s || '';
  if (rapidProductSearchInput) {
    rapidProductSearchInput.value = p.product_name || p.name || p.n || code;
    if (rapidClearSearchBtn) rapidClearSearchBtn.style.display = 'block';
  }

  currentRapidBarcode = code.toString().trim();
  const name = p.product_name || p.name || p.n || 'Unnamed item';

  rapidBarcodeBadgeVal.innerHTML = `${escapeHtml(code || name)} <br><span style="color:#16a34a; font-size:12px;">✅ Selected: ${escapeHtml(name)}</span>`;
  rapidBarcodeBadge.style.display = 'block';
  rapidBarcodeBadge.style.background = '#f0fdf4';
  rapidBarcodeBadge.style.borderColor = '#bbf7d0';
  rapidBarcodeBadge.style.color = '#15803d';
  rapidNewProductFields.style.display = 'none';

  checkRapidExistingLocationProduct();
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
    const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
    const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === currentRapidBarcode.toLowerCase()) || (b2 && b2 === currentRapidBarcode.toLowerCase()) || (s && s === currentRapidBarcode.toLowerCase());
  });

  // 2. If not in local cache, ask the server (catches newly registered products)
  if (!found) {
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(currentRapidBarcode)}&limit=5`).then(r => r.json());
      if (res.success && res.products.length > 0) {
        found = res.products.find(item =>
          (item.barcode || '').toLowerCase() === currentRapidBarcode.toLowerCase() ||
          (item.barcode_2 || '').toLowerCase() === currentRapidBarcode.toLowerCase() ||
          (item.stock_no || '').toLowerCase() === currentRapidBarcode.toLowerCase()
        );
      }
    } catch (e) {
      console.warn('Server lookup failed during rapid barcode scan', e);
    }
  }

  if (found) {
    const name = found.product_name || found.n;
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
  if (e.key === 'Enter') {
    e.preventDefault();
    saveRapidEntry();
  }
});

function checkRapidExistingLocationProduct() {
  currentRapidExistingRow = null;
  if (!currentRapidBarcode || !currentRapidLocation) return;

  const parsed = parseLocationQR(currentRapidLocation);
  if (!parsed) {
    rapidLocationBadgeVal.innerHTML = `${escapeHtml(currentRapidLocation)} <br><span style="color:#ef4444; font-size:11px; font-weight:600;">⚠️ Invalid format (e.g. 1-02-01-03)</span>`;
    rapidLocationBadge.style.background = '#fef2f2';
    rapidLocationBadge.style.borderColor = '#fecaca';
    rapidLocationBadge.style.color = '#b91c1c';
    rapidLocationBadge.style.display = 'block';
    return;
  }

  const normBar = currentRapidBarcode.toLowerCase().trim();

  // 1. Instant 0ms local in-memory search
  const allProdRows = PRODUCTS.filter(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
    const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === normBar) || (b2 && b2 === normBar) || (s && s === normBar);
  });

  const parsedFloor = String(parsed.floor).trim();
  const parsedRow = String(parsed.row).trim();
  const parsedShelf = String(parsed.shelf).trim();
  const parsedLevel = String(parsed.level).trim();

  const match = allProdRows.find(p => {
    const pf = String(p.floor !== undefined && p.floor !== null ? p.floor : '').trim();
    const pb = String(p.batch !== undefined && p.batch !== null ? p.batch : (p.row || '')).trim();
    const ps = String(p.shelf !== undefined && p.shelf !== null ? p.shelf : '').trim();
    const pl = String(p.level !== undefined && p.level !== null ? p.level : '').trim();

    return pf === parsedFloor && pb === parsedRow && ps === parsedShelf && pl === parsedLevel;
  });

  if (match) {
    currentRapidExistingRow = match;
    const existingQty = match.qty !== undefined && match.qty !== null ? match.qty : 0;
    if (rfQty) rfQty.value = existingQty;
    rapidLocationBadgeVal.innerHTML = `${escapeHtml(currentRapidLocation)} <br><span style="color:#16a34a; font-size:11px; font-weight:600;">✅ Existing location: Qty ${existingQty} (will update)</span>`;
    rapidLocationBadge.style.background = '#f0fdf4';
    rapidLocationBadge.style.borderColor = '#bbf7d0';
    rapidLocationBadge.style.color = '#15803d';
    rapidLocationBadge.style.display = 'block';
    return;
  }

  // Exact location not matched. Check if product has existing locations elsewhere
  const existingLocRows = allProdRows.filter(p => (p.loc && p.loc.trim() !== '') || (p.floor && String(p.floor).trim() !== ''));

  if (existingLocRows.length > 0) {
    const locSummary = existingLocRows.map(p => {
      const l = p.loc || `${p.floor || '1'}-${p.batch !== undefined && p.batch !== null ? p.batch : (p.row || '00')}-${p.shelf || '00'}-${p.level || '00'}`;
      const q = p.qty !== undefined && p.qty !== null ? p.qty : 0;
      return `${l} (Qty: ${q})`;
    }).join(', ');

    if (rfQty) rfQty.value = '0';
    rapidLocationBadgeVal.innerHTML = `${escapeHtml(currentRapidLocation)}<br>
      <span style="color:#d97706; font-size:11px; font-weight:600; display:block; margin-top:2px;">📍 Existing Location(s): ${escapeHtml(locSummary)}</span>
      <span style="color:#2563eb; font-size:11px; font-weight:600; display:block; margin-top:2px;">➕ Add another location: ${escapeHtml(currentRapidLocation)}</span>`;
    rapidLocationBadge.style.background = '#fffbeb';
    rapidLocationBadge.style.borderColor = '#fde68a';
    rapidLocationBadge.style.color = '#b45309';
    rapidLocationBadge.style.display = 'block';

    promptAddAnotherLocation(allProdRows[0] || { barcode: currentRapidBarcode }, existingLocRows, currentRapidLocation);
  } else {
    if (rfQty) rfQty.value = '0';
    rapidLocationBadgeVal.innerHTML = `${escapeHtml(currentRapidLocation)} <br><span style="color:#2563eb; font-size:11px; font-weight:600;">🆕 New location for this product</span>`;
    rapidLocationBadge.style.background = '#eff6ff';
    rapidLocationBadge.style.borderColor = '#bfdbfe';
    rapidLocationBadge.style.color = '#1d4ed8';
    rapidLocationBadge.style.display = 'block';
  }
}

function promptAddAnotherLocation(productObj, existingLocRows, newLocStr) {
  const overlay = document.getElementById('addAnotherLocOverlay');
  if (!overlay) return;

  const nameEl = document.getElementById('addLocProductName');
  const metaEl = document.getElementById('addLocProductMeta');
  const listEl = document.getElementById('addLocExistingList');
  const targetEl = document.getElementById('addLocNewTarget');
  const cancelBtn = document.getElementById('addLocCancelBtn');
  const confirmBtn = document.getElementById('addLocConfirmBtn');

  const prodName = productObj.product_name || productObj.name || productObj.n || 'Product';
  const prodBar = productObj.barcode || productObj.b || currentRapidBarcode || '—';
  const prodStock = productObj.stock_no || productObj.stock_code || productObj.s || '—';

  nameEl.textContent = prodName;
  metaEl.textContent = `Barcode: ${prodBar} | Stock No: ${prodStock}`;

  listEl.innerHTML = '';
  existingLocRows.forEach(row => {
    const locCode = row.loc || `${row.floor || '1'}-${row.batch !== undefined && row.batch !== null ? row.batch : (row.row || '00')}-${row.shelf || '00'}-${row.level || '00'}`;
    const qtyVal = row.qty !== undefined && row.qty !== null ? row.qty : 0;
    
    const card = document.createElement('div');
    card.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:8px 12px; font-size:12.5px; cursor:pointer; transition:all 0.15s ease; box-shadow:0 1px 3px rgba(0,0,0,0.04);';
    card.innerHTML = `
      <div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-weight:700; color:#0f172a; font-size:13px;">📍 ${escapeHtml(locCode)}</span>
          <span style="font-size:10px; font-weight:700; background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:5px; text-transform:uppercase;">Select</span>
        </div>
        <div style="color:#64748b; font-size:11px; margin-top:2px;">Floor ${row.floor || '1'}, Row ${row.batch !== undefined && row.batch !== null ? row.batch : (row.row || '—')}, Shelf ${row.shelf || '—'}, Level ${row.level || '—'}</div>
      </div>
      <div style="font-weight:700; color:#15803d; background:#f0fdf4; border:1px solid #bbf7d0; padding:3px 9px; border-radius:6px; font-size:12px; text-align:right;">
        Qty: ${qtyVal}
      </div>
    `;

    card.onmouseenter = () => {
      card.style.borderColor = '#0284c7';
      card.style.background = '#f0f9ff';
      card.style.boxShadow = '0 3px 6px -1px rgba(2, 132, 199, 0.14)';
    };
    card.onmouseleave = () => {
      card.style.borderColor = '#cbd5e1';
      card.style.background = '#ffffff';
      card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
    };

    card.onclick = () => {
      overlay.classList.remove('show');
      currentRapidLocation = locCode;
      currentRapidExistingRow = row;
      const parsedLocation = parseLocationQR(locCode);
      if (parsedLocation) setRapidLocationFields(parsedLocation);
      if (rfQty) rfQty.value = qtyVal;

      rapidLocationBadgeVal.innerHTML = `${locCode} <br><span style="color:#16a34a; font-size:11px; font-weight:600;">✅ Selected existing location: Qty ${qtyVal} (will update)</span>`;
      rapidLocationBadge.style.background = '#f0fdf4';
      rapidLocationBadge.style.borderColor = '#bbf7d0';
      rapidLocationBadge.style.color = '#15803d';

      showToast(CURRENT_LANG === 'en' 
        ? `Selected existing location ${locCode} (Qty ${qtyVal}). Modify quantity & tap Add & Next.` 
        : `已选择现有库位 ${locCode}（现存 ${qtyVal}）。修改数量后点击 添加 & 下一个。`);
    };

    listEl.appendChild(card);
  });

  targetEl.textContent = newLocStr;
  overlay.classList.add('show');

  cancelBtn.onclick = () => {
    overlay.classList.remove('show');
    currentRapidLocation = '';
    rapidLocationBadge.style.display = 'none';
    if (rfQty) rfQty.value = '0';
  };

  confirmBtn.onclick = () => {
    overlay.classList.remove('show');
    currentRapidExistingRow = null;
    if (rfQty) rfQty.value = '0';
    showToast(CURRENT_LANG === 'en' 
      ? `Location ${newLocStr} ready to add. Tap quantity field when ready.` 
      : `已添加新库位 ${newLocStr}。可以在数量栏输入库存。`);
  };
}

function promptConcurrentScan(existingRow, newQty) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('concurrentOverlay');
    if (!overlay) { resolve('cancel'); return; }
    const stockmanEl = document.getElementById('concurrentStockman');
    const locEl = document.getElementById('concurrentLocation');
    const loggedQtyEl = document.getElementById('concurrentLoggedQty');
    const timeAgoEl = document.getElementById('concurrentTimeAgo');
    const addQtyEl = document.getElementById('concurrentAddQty');
    const replaceQtyEl = document.getElementById('concurrentReplaceQty');

    const stockmanName = existingRow.last_modified_by || existingRow.modifiedBy || 'Staff Stockman';
    stockmanEl.textContent = stockmanName;
    locEl.textContent = `Floor ${existingRow.floor || '1'}, Row ${existingRow.batch !== undefined && existingRow.batch !== null ? existingRow.batch : (existingRow.row || '—')}, Shelf ${existingRow.shelf || '—'}, Level ${existingRow.level || '—'}`;
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
  const floorRaw = rfFloor ? rfFloor.value.trim() : '';
  const rowRaw = rfRow ? rfRow.value.trim() : '';
  const shelfRaw = rfShelf ? rfShelf.value.trim() : '';
  const levelRaw = rfLevel ? rfLevel.value.trim() : '';
  const qtyRaw = rfQty ? rfQty.value.trim() : '';
  const quantity = Number(qtyRaw);

  if (!floorRaw || !rowRaw || !shelfRaw || levelRaw === '' || !qtyRaw) {
    rapidFormError.textContent = CURRENT_LANG === 'en'
      ? 'Floor, Row number, Shelf number, Level, and Quantity are required.'
      : '楼层、排号、货架号、层数和数量均为必填项。';
    rapidFormError.classList.add('show');
    return;
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    rapidFormError.textContent = CURRENT_LANG === 'en'
      ? 'Quantity must be a whole number of at least 1.'
      : '数量必须是至少为 1 的整数。';
    rapidFormError.classList.add('show');
    return;
  }
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

  // Fast local lookup first
  let existingProduct = PRODUCTS.find(p => {
    const b = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const b2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
    const s = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();
    return (b && b === currentRapidBarcode.toLowerCase()) || (b2 && b2 === currentRapidBarcode.toLowerCase()) || (s && s === currentRapidBarcode.toLowerCase());
  });

  // Only ask server if not found in local cache
  if (!existingProduct) {
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(currentRapidBarcode)}&limit=5`).then(r => r.json());
      if (res.success && res.products.length > 0) {
        existingProduct = res.products.find(item =>
          (item.barcode || '').toLowerCase() === currentRapidBarcode.toLowerCase() ||
          (item.barcode_2 || '').toLowerCase() === currentRapidBarcode.toLowerCase() ||
          (item.stock_no || '').toLowerCase() === currentRapidBarcode.toLowerCase()
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

  const validQty = quantity;
  let rapidLedgerQty = validQty;

  const btn = document.getElementById('saveRapidBtn') || document.getElementById('rfSubmitBtn');
  if (btn && btn.disabled) return;
  if (btn) btn.disabled = true;

  try {
    rapidFormError.classList.remove('show');
    const savedLoc = currentRapidLocation;
    const savedBarcode = currentRapidBarcode;

    const loc = `${parsed.floor}-${parsed.row}-${parsed.shelf}-${parsed.level}`;
    const floorLabel = parsed.floor === '1' ? 'First Floor' : (parsed.floor === '2' ? 'Second Floor' : 'Third Floor');
    const storage_location = `${loc} ${floorLabel} - Row ${parsed.row} - Shelves ${parsed.shelf} - Level ${parsed.level}`;

    const payload = {
      barcode: existingProduct ? (existingProduct.barcode || existingProduct.b || currentRapidBarcode) : currentRapidBarcode,
      barcode_2: existingProduct ? (existingProduct.barcode_2 || existingProduct.b2 || '') : '',
      stock_no: existingProduct ? (existingProduct.stock_no || existingProduct.stock_code || existingProduct.s || rfStock.value.trim()) : rfStock.value.trim(),
      stock_code: existingProduct ? (existingProduct.stock_no || existingProduct.stock_code || existingProduct.s || rfStock.value.trim()) : rfStock.value.trim(),
      product_name: existingProduct ? (existingProduct.product_name || existingProduct.name || existingProduct.n) : rfName.value.trim(),
      name: existingProduct ? (existingProduct.product_name || existingProduct.name || existingProduct.n) : rfName.value.trim(),
      category: existingProduct ? (existingProduct.category || existingProduct.c || 'Uncategorized') : (rfCategory.value.trim() || 'Uncategorized'),
      department: existingProduct ? (existingProduct.department || existingProduct.subcategory || existingProduct.sc || '') : rfSubcategory.value.trim(),
      subcategory: existingProduct ? (existingProduct.department || existingProduct.subcategory || existingProduct.sc || '') : rfSubcategory.value.trim(),
      floor: parsed.floor,
      row: parsed.row,
      batch: parsed.row,
      shelf: parsed.shelf,
      level: parsed.level,
      loc: loc,
      location_storage: storage_location,
      storage_location: storage_location,
      loc_full: storage_location,
      status: 'MAPPED',
      custom: true,
      qty: validQty,
      last_modified_by: currentUser ? currentUser.full_name : 'Rapid Logger'
    };

    // Concurrent Multi-User Duplicate Safeguard
    if (currentRapidExistingRow) {
      const userAction = await promptConcurrentScan(currentRapidExistingRow, payload.qty);
      if (userAction === 'cancel') {
        if (btn) btn.disabled = false;
        showToast(CURRENT_LANG === 'en' ? 'Scan cancelled — duplicate entry prevented.' : '已取消登记 — 已防止重复记录。');
        return;
      }
      if (userAction === 'add') {
        payload.qty = (parseInt(currentRapidExistingRow.qty, 10) || 0) + parseInt(payload.qty, 10);
      } else if (userAction === 'replace') {
        rapidLedgerQty = 0;
      }
    }

    const isUnmappedMaster = existingProduct && (!existingProduct.floor || String(existingProduct.floor).trim() === '' || !existingProduct.loc || String(existingProduct.loc).trim() === '');
    const targetRow = currentRapidExistingRow || (isUnmappedMaster ? existingProduct : null);

    const url = targetRow ? `/api/products/${targetRow.id}` : '/api/products';
    const method = targetRow ? 'PUT' : 'POST';

    if (rapidLedgerQty > 0) {
      const inventoryResponse = await authFetch('/api/inventory/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: payload.barcode,
          stock_no: payload.stock_no,
          product_name: payload.product_name,
          qty: rapidLedgerQty,
          location_code: loc,
          package_type: 'EACH',
          source_reference: 'Rapid Logger'
        })
      });
      const inventoryData = await inventoryResponse.json();
      if (!inventoryResponse.ok || !inventoryData.success) throw new Error(inventoryData.error || 'Could not record rapid entry in inventory ledger.');
    }

    // --- INSTANT OPTIMISTIC RESET FOR HIGH-SPEED LOGGING ---
    rapidSessionCount++;
    const rBadge = document.getElementById('rapidSessionBadge');
    const rVal = document.getElementById('rapidSessionCountVal');
    if (rBadge && rVal) {
      rVal.textContent = rapidSessionCount;
      rBadge.style.display = 'flex';
    }

    // Add to session log strip immediately
    const logText = `[${new Date().toLocaleTimeString()}] ${payload.product_name} (${payload.barcode}) &rarr; 📍 ${savedLoc} [Qty: ${payload.qty}]`;
    rapidLogs.unshift(logText);
    rapidLogs = rapidLogs.slice(0, 5);

    if (rapidLogList) {
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
    }

    // Clear form inputs immediately so stockman can scan/search next item in 0ms!
    currentRapidBarcode = '';
    currentRapidLocation = '';
    currentRapidExistingRow = null;
    if (rapidProductSearchInput) rapidProductSearchInput.value = '';
    if (rapidClearSearchBtn) rapidClearSearchBtn.style.display = 'none';
    hideRapidSearchResults();

    rfName.value = '';
    rfStock.value = '';
    rfCategory.value = '';
    rfSubcategory.value = '';
    if (rfFloor) rfFloor.value = '1';
    if (rfRow) rfRow.value = '';
    if (rfShelf) rfShelf.value = '';
    if (rfLevel) rfLevel.value = '0';
    if (rfQty) rfQty.value = '0';

    if (rapidBarcodeBadge) rapidBarcodeBadge.style.display = 'none';
    if (rapidLocationBadge) rapidLocationBadge.style.display = 'none';
    if (rapidNewProductFields) rapidNewProductFields.style.display = 'none';

    showToast(CURRENT_LANG === 'en' ? '✅ Saved! Ready for next scan.' : '✅ 已保存！准备好进行下一次扫描。');
    if (btn) btn.disabled = false;

    // Send HTTP save request in background & update local cache in-place (NO full /api/products/all fetch!)
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json()).then(res => {
      if (res.success && res.product) {
        const savedProd = res.product;
        // Merge into PRODUCTS and productsData array locally
        const existingIdx = PRODUCTS.findIndex(p => p.id === savedProd.id);
        if (existingIdx !== -1) {
          PRODUCTS[existingIdx] = savedProd;
        } else {
          PRODUCTS.unshift(savedProd);
        }

        const dataIdx = productsData.findIndex(p => p.id === savedProd.id);
        if (dataIdx !== -1) {
          productsData[dataIdx] = savedProd;
        } else {
          productsData.unshift(savedProd);
        }

        rebuildIndex();
        persistSearchIndexSoon();
        updateCategoryDatalist();

        if (superAdminPortalView && superAdminPortalView.style.display !== 'none') {
          renderPortalDataTable();
        }
      }
    }).catch(err => {
      console.warn('Background rapid logger save error:', err);
    });

  } catch (err) {
    if (btn) btn.disabled = false;
    console.error("Failed to rapidly register product location:", err);
    showToast("Connection error: failed to register location.", 'error');
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

// Hardware Barcode Scanner (Keyboard Wedge) Global Fast Listener
let hardwareScanBuffer = '';
let lastKeyTime = 0;
document.addEventListener('keydown', e => {
  const tag = (e.target && e.target.tagName) ? e.target.tagName : '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;

  const now = Date.now();
  if (now - lastKeyTime > 120) {
    hardwareScanBuffer = '';
  }
  lastKeyTime = now;

  if (e.key === 'Enter') {
    if (hardwareScanBuffer.length >= 3) {
      const code = hardwareScanBuffer.trim();
      hardwareScanBuffer = '';
      playScanBeep();
      const inputEl = document.getElementById('searchInput');
      if (inputEl) inputEl.value = code;
      doSearch(code, true);
    }
  } else if (e.key && e.key.length === 1) {
    hardwareScanBuffer += e.key;
  }
});

// --- UI/UX ENHANCEMENTS: QUICK QUANTITY ADJUSTMENT STEPPER & SEARCH HELPERS ---
let rapidSessionCount = 0;

window.quickAdjustQty = async function(id, delta) {
  if (!id) return;
  const target = (window.currentLocs || []).find(p => p.id === id) || (PRODUCTS || []).find(p => p.id === id);
  if (!target) return;

  const currentQty = parseInt(target.qty, 10) || 0;
  const newQty = Math.max(0, currentQty + delta);
  if (newQty === currentQty) return;

  target.qty = newQty;
  // Update total Qty display immediately
  const totalQty = (window.currentLocs || []).reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
  const pQtyEl = document.getElementById('pQty');
  if (pQtyEl) pQtyEl.textContent = totalQty;

  if (activeProduct) {
    renderProductLocationsUI(activeProduct, window.currentLocs || []);
  }

  showToast(CURRENT_LANG === 'en' ? `Updating quantity to ${newQty}...` : `正在更新库存为 ${newQty}...`);

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty: newQty, modifiedBy: currentUser ? currentUser.full_name : 'Stockman' })
    }).then(r => r.json());

    if (res.success) {
      showToast(CURRENT_LANG === 'en' ? `Qty updated: ${newQty}` : `库存更新成功: ${newQty}`);
      const localIndex = PRODUCTS.findIndex(p => String(p.id) === String(id));
      if (localIndex >= 0) PRODUCTS[localIndex] = { ...PRODUCTS[localIndex], ...(res.product || { qty: newQty }) };
      rebuildIndex();
      persistSearchIndexSoon();
    } else {
      showToast(CURRENT_LANG === 'en' ? 'Failed to update quantity' : '更新库存失败', 'error');
    }
  } catch (err) {
    showToast(CURRENT_LANG === 'en' ? 'Network error' : '网络错误', 'error');
  }
};

// Search Input Clear Button (✕) and Keyboard Shortcut '/' or 'Ctrl+K'
const searchInputEl = document.getElementById('searchInput');
const clearSearchBtnEl = document.getElementById('clearSearchBtn');

if (searchInputEl && clearSearchBtnEl) {
  searchInputEl.addEventListener('input', () => {
    if (searchInputEl.value.trim().length > 0) {
      clearSearchBtnEl.style.display = 'block';
    } else {
      clearSearchBtnEl.style.display = 'none';
      hideResults();
    }
  });

  clearSearchBtnEl.addEventListener('click', () => {
    searchInputEl.value = '';
    clearSearchBtnEl.style.display = 'none';
    searchInputEl.focus();
    hideResults();
  });
}

// Global Keyboard Shortcut: '/' or 'Ctrl+K' to focus search box
document.addEventListener('keydown', (e) => {
  const activeEl = document.activeElement;
  const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
  const isModalOpen = document.querySelector('.modal-overlay.show');

  if (!isInput && !isModalOpen) {
    if (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      if (searchInputEl) {
        searchInputEl.focus();
        searchInputEl.select();
      }
    }
  }
});

// --- OPTION 1: WAREHOUSE SHELF AUDIT & 1-TAP STOCK TRANSFER ---
let currentTransferItem = null;

const transferDestinationFields = {
  floor: document.getElementById('transferDestFloor'),
  row: document.getElementById('transferDestRow'),
  shelf: document.getElementById('transferDestShelf'),
  level: document.getElementById('transferDestLevel')
};
const transferFormError = document.getElementById('transferFormError');

function showTransferFormError(message) {
  if (!transferFormError) return;
  transferFormError.textContent = message;
  transferFormError.classList.add('show');
}

function clearTransferFormError() {
  if (!transferFormError) return;
  transferFormError.textContent = '';
  transferFormError.classList.remove('show');
}

function formatTransferLocationPart(value, minimum) {
  const raw = String(value ?? '').trim();
  if (!/^\d+$/.test(raw)) return '';
  const number = Number.parseInt(raw, 10);
  return Number.isInteger(number) && number >= minimum && number <= 99 ? String(number).padStart(2, '0') : '';
}

function getTransferDestinationLocation() {
  const floor = String(transferDestinationFields.floor?.value || '').trim();
  const row = formatTransferLocationPart(transferDestinationFields.row?.value, 1);
  const shelf = formatTransferLocationPart(transferDestinationFields.shelf?.value, 1);
  const level = formatTransferLocationPart(transferDestinationFields.level?.value, 0);
  return ['1', '2', '3'].includes(floor) && row && shelf && level ? `${floor}-${row}-${shelf}-${level}` : '';
}

function updateTransferDestinationPreview() {
  const preview = document.getElementById('transferDestPreview');
  if (preview) preview.textContent = getTransferDestinationLocation() || '—';
}

function setTransferDestinationFields(location) {
  if (!location) return;
  if (transferDestinationFields.floor) transferDestinationFields.floor.value = String(location.floor || '').replace(/^0+/, '') || '0';
  if (transferDestinationFields.row) transferDestinationFields.row.value = Number.parseInt(location.row, 10) || '';
  if (transferDestinationFields.shelf) transferDestinationFields.shelf.value = Number.parseInt(location.shelf, 10) || '';
  if (transferDestinationFields.level) {
    const level = Number.parseInt(location.level, 10);
    transferDestinationFields.level.value = Number.isInteger(level) && level >= 0 ? level : '';
  }
  updateTransferDestinationPreview();
}

Object.values(transferDestinationFields).forEach(field => {
  field?.addEventListener('input', () => {
    updateTransferDestinationPreview();
    clearTransferFormError();
  });
  field?.addEventListener('change', () => {
    updateTransferDestinationPreview();
    clearTransferFormError();
  });
});

window.openTransferModalForProductIndex = function(index) {
  const locs = window.currentLocs || [];
  const item = locs[index];
  if (!item) return;

  currentTransferItem = item;
  clearTransferFormError();
  document.getElementById('transferProductName').textContent = item.product_name || 'Unnamed Product';
  document.getElementById('transferProductMeta').textContent = `Barcode: ${item.barcode || '—'} | Stock No: ${item.stock_no || '—'}`;
  document.getElementById('transferSourceLoc').textContent = item.loc || `${item.floor}-${item.row}-${item.shelf}-${item.level}`;
  document.getElementById('transferSourceMaxQty').textContent = item.qty || 0;
  
  const qtyInput = document.getElementById('transferQtyInput');
  Object.values(transferDestinationFields).forEach(field => { if (field) field.value = ''; });
  if (transferDestinationFields.floor && ['1', '2', '3'].includes(String(item.floor || ''))) {
    transferDestinationFields.floor.value = String(item.floor);
  }
  updateTransferDestinationPreview();
  if (qtyInput) {
    qtyInput.value = item.qty || 1;
    qtyInput.max = item.qty || 1;
  }

  const overlay = document.getElementById('transferOverlay');
  if (overlay) overlay.classList.add('show');
};

window.closeTransferModal = function() {
  const overlay = document.getElementById('transferOverlay');
  if (overlay) overlay.classList.remove('show');
  currentTransferItem = null;
};

const closeTransferModalBtn = document.getElementById('closeTransferModal');
const cancelTransferBtn = document.getElementById('cancelTransferBtn');
const confirmTransferBtn = document.getElementById('confirmTransferBtn');
const scanDestLocBtn = document.getElementById('scanDestLocBtn');
const transferQtyInput = document.getElementById('transferQtyInput');

transferQtyInput?.addEventListener('input', clearTransferFormError);

if (closeTransferModalBtn) closeTransferModalBtn.addEventListener('click', window.closeTransferModal);
if (cancelTransferBtn) cancelTransferBtn.addEventListener('click', window.closeTransferModal);

if (scanDestLocBtn) {
  scanDestLocBtn.addEventListener('click', () => {
    openScanner((scannedText) => {
      const parsed = parseLocationQR(scannedText);
      if (parsed) {
        setTransferDestinationFields(parsed);
        clearTransferFormError();
        showToast(`Scanned destination: ${getTransferDestinationLocation()}`);
      } else {
        showToast(CURRENT_LANG === 'en' ? 'Invalid location QR code.' : '无效的库位二维码。', 'error');
      }
    });
  });
}

if (confirmTransferBtn) {
  confirmTransferBtn.addEventListener('click', async () => {
    if (!currentTransferItem) {
      showTransferFormError(CURRENT_LANG === 'en' ? 'Please select a product to transfer.' : '请选择要转移的商品。');
      return;
    }
    const destLoc = getTransferDestinationLocation();
    const qtyVal = parseInt(document.getElementById('transferQtyInput').value.trim(), 10);

    if (!destLoc) {
      showTransferFormError(CURRENT_LANG === 'en'
        ? 'Floor, Row number, Shelf number, and Level are required. Enter valid values.'
        : '楼层、排号、货架号和层数均为必填项。请输入有效值。');
      showToast(CURRENT_LANG === 'en' ? 'Please select a floor and enter valid row, shelf, and level numbers.' : '请选择楼层并输入有效的排、货架和层数。', 'error');
      return;
    }
    if (isNaN(qtyVal) || qtyVal <= 0) {
      showTransferFormError(CURRENT_LANG === 'en'
        ? 'Quantity is required. Enter a valid quantity of at least 1.'
        : '数量为必填项。请输入至少为 1 的有效数量。');
      showToast(CURRENT_LANG === 'en' ? 'Please enter a valid transfer quantity.' : '请输入有效的转移数量。', 'error');
      return;
    }
    if (qtyVal > (parseInt(currentTransferItem.qty, 10) || 0)) {
      showTransferFormError(CURRENT_LANG === 'en'
        ? 'Transfer quantity cannot exceed the available stock.'
        : '转移数量不能超过可用库存。');
      showToast(CURRENT_LANG === 'en' ? 'Transfer quantity exceeds available stock.' : '转移数量超过现有库存。', 'error');
      return;
    }

    showToast(CURRENT_LANG === 'en' ? 'Transferring stock...' : '正在转移库存...');

    clearTransferFormError();
    try {
      const res = await fetch('/api/products/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: currentTransferItem.id,
          destLocation: destLoc,
          transferQty: qtyVal,
          modifiedBy: currentUser ? currentUser.full_name : 'Stockman Transfer'
        })
      }).then(r => r.json());

      if (res.success) {
        showToast(CURRENT_LANG === 'en' ? `Transferred ${qtyVal} units to ${destLoc}!` : `成功转移 ${qtyVal} 件库存至 ${destLoc}！`);
        window.closeTransferModal();

        // Refresh product details
        if (activeProduct) {
          const freshRes = await fetch(`/api/products?q=${encodeURIComponent(activeProduct.barcode || activeProduct.stock_no)}`).then(r => r.json());
          if (freshRes.success && freshRes.products.length > 0) {
            renderProductLocationsUI(freshRes.products[0], freshRes.products);
          }
        }
      } else {
        showToast(res.error || 'Transfer failed.', 'error');
      }
    } catch (e) {
      showToast(CURRENT_LANG === 'en' ? 'Network error during transfer.' : '网络错误，转移失败。', 'error');
    }
  });
}

// Audit Shelf QR Handler
window.auditShelfLocation = async function(locCode) {
  if (!locCode) return;
  const overlay = document.getElementById('locationAuditOverlay');
  const titleEl = document.getElementById('auditLocTitle');
  const totalSkuEl = document.getElementById('auditTotalSku');
  const totalQtyEl = document.getElementById('auditTotalQty');
  const listEl = document.getElementById('auditProductList');

  if (titleEl) titleEl.textContent = `Shelf Audit: 📍 ${locCode}`;
  if (listEl) listEl.innerHTML = '<div style="color:#64748b; font-size:13px;">Loading shelf items...</div>';
  if (overlay) overlay.classList.add('show');

  try {
    const res = await fetch(`/api/products/by-location?loc=${encodeURIComponent(locCode)}`).then(r => r.json());
    if (res.success && Array.isArray(res.products)) {
      const items = res.products;
      const totalQty = items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
      if (totalSkuEl) totalSkuEl.textContent = items.length;
      if (totalQtyEl) totalQtyEl.textContent = totalQty;

      if (items.length === 0) {
        if (listEl) listEl.innerHTML = '<div style="color:#94a3b8; font-size:13px; text-align:center; padding:16px;">No products currently registered at this shelf location.</div>';
        return;
      }

      if (listEl) {
        listEl.innerHTML = '';
        items.forEach(p => {
          const rowEl = document.createElement('div');
          rowEl.style.cssText = 'background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center;';
          rowEl.innerHTML = `
            <div>
              <div style="font-weight:700; color:#0f172a; font-size:14px;">${escapeHtml(p.product_name)}</div>
              <div style="font-size:11px; color:#64748b; font-family:monospace; margin-top:2px;">Barcode: ${escapeHtml(p.barcode || '—')} | Stock No: ${escapeHtml(p.stock_no || '—')}</div>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Logged by: ${escapeHtml(p.last_modified_by || 'System')}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:16px; font-weight:800; color:#15803d;">${p.qty} pcs</div>
            </div>
          `;
          listEl.appendChild(rowEl);
        });
      }
    }
  } catch (e) {
    if (listEl) listEl.innerHTML = '<div style="color:#ef4444; font-size:13px;">Error loading location audit data.</div>';
  }
};

const auditLocationQrBtn = document.getElementById('auditLocationQrBtn');
const closeAuditModal = document.getElementById('closeAuditModal');
if (closeAuditModal) {
  closeAuditModal.addEventListener('click', () => {
    const overlay = document.getElementById('locationAuditOverlay');
    if (overlay) overlay.classList.remove('show');
  });
}

if (auditLocationQrBtn) {
  auditLocationQrBtn.addEventListener('click', () => {
    openScanner((scannedText) => {
      const parsed = parseLocationQR(scannedText);
      const locCode = parsed ? `${parsed.floor}-${parsed.row}-${parsed.shelf}-${parsed.level}` : scannedText.trim();
      auditShelfLocation(locCode);
    });
  });
}

// --- 1. CARTON / BIG ITEMS PUTAWAY ENGINE (NON-BARCODED ITEMS) ---
const cartonOverlay = document.getElementById('cartonOverlay');
const cartonPutawayBtn = document.getElementById('cartonPutawayBtn');
const closeCartonModal = document.getElementById('closeCartonModal');
const cancelCartonBtn = document.getElementById('cancelCartonBtn');
const cartonStockNoInput = document.getElementById('cartonStockNoInput');
const cartonClearSearchBtn = document.getElementById('cartonClearSearchBtn');
const cartonScanBarcodeBtn = document.getElementById('cartonScanBarcodeBtn');
const cartonSearchResultsList = document.getElementById('cartonSearchResultsList');
const cartonMatchBox = document.getElementById('cartonMatchBox');
const cartonNoMatchBox = document.getElementById('cartonNoMatchBox');
const cartonMatchedName = document.getElementById('cartonMatchedName');
const cartonMatchedMeta = document.getElementById('cartonMatchedMeta');
const cartonScanLocBtn = document.getElementById('cartonScanLocBtn');
const cartonAddNewBtn = document.getElementById('cartonAddNewBtn');
const cartonManualLocBtn = document.getElementById('cartonManualLocBtn');
const cartonManualBox = document.getElementById('cartonManualBox');
const cartonSaveManualBtn = document.getElementById('cartonSaveManualBtn');
const cartonFormError = document.getElementById('cartonFormError');

function showCartonFormError(message) {
  if (!cartonFormError) return;
  cartonFormError.textContent = message;
  cartonFormError.classList.add('show');
}

function clearCartonFormError() {
  if (!cartonFormError) return;
  cartonFormError.textContent = '';
  cartonFormError.classList.remove('show');
}

let matchedCartonProduct = null;
let cartonSearchRequestId = 0;
let cartonBackgroundFetchTimer = null;

if (cartonPutawayBtn) {
  cartonPutawayBtn.addEventListener('click', () => {
    if (cartonStockNoInput) cartonStockNoInput.value = '';
    if (cartonClearSearchBtn) cartonClearSearchBtn.style.display = 'none';
    hideCartonSearchResults();
    if (cartonMatchBox) cartonMatchBox.style.display = 'none';
    if (cartonNoMatchBox) cartonNoMatchBox.style.display = 'none';
    if (cartonManualBox) cartonManualBox.style.display = 'none';
    clearCartonFormError();
    matchedCartonProduct = null;
    if (cartonOverlay) {
      cartonOverlay.classList.add('show');
    }
  });
}

if (closeCartonModal) closeCartonModal.addEventListener('click', () => {
  if (cartonOverlay) cartonOverlay.classList.remove('show');
  hideCartonSearchResults();
});
if (cancelCartonBtn) cancelCartonBtn.addEventListener('click', () => {
  if (cartonOverlay) cartonOverlay.classList.remove('show');
  hideCartonSearchResults();
});

if (cartonClearSearchBtn) {
  cartonClearSearchBtn.addEventListener('click', () => {
    if (cartonStockNoInput) {
      cartonStockNoInput.value = '';
      cartonStockNoInput.focus();
    }
    cartonClearSearchBtn.style.display = 'none';
    hideCartonSearchResults();
    if (cartonMatchBox) cartonMatchBox.style.display = 'none';
    if (cartonNoMatchBox) cartonNoMatchBox.style.display = 'none';
    matchedCartonProduct = null;
  });
}

if (cartonScanBarcodeBtn) {
  cartonScanBarcodeBtn.addEventListener('click', () => {
    startScanner('carton_barcode');
  });
}

function hideCartonSearchResults() {
  if (cartonSearchResultsList) {
    cartonSearchResultsList.style.display = 'none';
    cartonSearchResultsList.innerHTML = '';
  }
}

// Close carton search dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!cartonOverlay || !cartonOverlay.classList.contains('show')) return;
  if (cartonStockNoInput && !cartonStockNoInput.contains(e.target) &&
      cartonSearchResultsList && !cartonSearchResultsList.contains(e.target)) {
    hideCartonSearchResults();
  }
});

function selectCartonProduct(p) {
  if (!p) return;
  hideCartonSearchResults();
  matchedCartonProduct = p;
  activeProduct = p;

  const displayName = p.product_name || p.name || p.n || 'Unnamed item';
  const displayCode = p.stock_no || p.stock_code || p.s || p.barcode || p.b || '';

  if (cartonStockNoInput) {
    cartonStockNoInput.value = displayName;
    if (cartonClearSearchBtn) cartonClearSearchBtn.style.display = 'block';
  }

  if (cartonMatchedName) cartonMatchedName.textContent = displayName;
  if (cartonMatchedMeta) cartonMatchedMeta.textContent = `Barcode: ${p.barcode || p.b || '—'}${p.barcode_2 || p.b2 ? ` | Barcode 2: ${p.barcode_2 || p.b2}` : ''} | Category: ${p.category || p.c || '—'} • ${p.department || p.subcategory || p.sc || 'General'}`;
  const matchSkuBadge = document.getElementById('cartonMatchSkuBadge');
  if (matchSkuBadge) matchSkuBadge.textContent = displayCode;

  const existingLocsEl = document.getElementById('cartonExistingLocs');
  if (existingLocsEl) {
    const locsList = Array.isArray(p.locations) ? p.locations : [];
    if (locsList.length > 0) {
      existingLocsEl.innerHTML = `<strong>Current Active Locations:</strong><br>` + locsList.map(l => `• Floor ${l.floor || '1'}, Row ${l.row || l.batch || '01'}, Shelf ${l.shelf || '01'}, Level ${l.level || '00'} (${l.qty || 0} units)${l.is_carton || (l.storage_location && l.storage_location.includes('Carton')) ? ' <span style="color:#b45309;font-weight:700;">[📦 Big Carton]</span>' : ''}`).join('<br>');
    } else if (p.floor || p.row || p.shelf || p.loc || p.storage_location || p.location_storage) {
      const f = p.floor || '1';
      const r = p.row || p.batch || '01';
      const s = p.shelf || '01';
      const l = p.level || '00';
      existingLocsEl.innerHTML = `<strong>Current Active Location:</strong><br>• Floor ${f}, Row ${r}, Shelf ${s}, Level ${l} (${p.qty || 0} units)`;
    } else {
      existingLocsEl.innerHTML = `<span style="color:#64748b; font-style:italic;">No shelf location assigned yet. Ready for first carton putaway.</span>`;
    }
  }

  if (cartonMatchBox) cartonMatchBox.style.display = 'block';
  if (cartonNoMatchBox) cartonNoMatchBox.style.display = 'none';
}

function doCartonProductSearch(q, isFinal = false) {
  if (!q) {
    cartonSearchRequestId++;
    hideCartonSearchResults();
    if (cartonMatchBox) cartonMatchBox.style.display = 'none';
    if (cartonNoMatchBox) cartonNoMatchBox.style.display = 'none';
    matchedCartonProduct = null;
    return;
  }

  const currentCartonReqId = ++cartonSearchRequestId;
  const qLower = q.toLowerCase();
  const qStripped = qLower.replace(/^0+/, '');
  const tokens = qLower.split(/\s+/).filter(Boolean);

  // 1. Direct O(1) Fast Path if exact barcode / stock code
  const exactDirect = byBarcodeMap.get(qLower) || byStockMap.get(qLower) ||
    (qStripped ? (byBarcodeMap.get(qStripped) || byStockMap.get(qStripped)) : null);

  if (isFinal && exactDirect) {
    selectCartonProduct(exactDirect);
    return;
  }

  const localCandidates = [];
  if (exactDirect) {
    localCandidates.push({ p: exactDirect, score: 100 });
  }

  // 2. High-speed local index scan (0ms)
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    if (exactDirect && p === exactDirect) continue;

    if (p._searchStr !== undefined && !productMatchesAllSearchTokens(p, tokens)) continue;
    const score = scoreProductMatch(p, qLower, qStripped, tokens);
    if (score > 0) {
      localCandidates.push({ p, score });
    }
  }

  localCandidates.sort((a, b) => b.score - a.score);

  const seen = new Set();
  const candidateMatches = [];
  for (const item of localCandidates) {
    const p = item.p;
    const key = p.id ? ('id_' + p.id) : (p.barcode || p.b ? ('bar_' + (p.barcode || p.b)) : ('name_' + (p.product_name || p.name || p.n) + '_stock_' + (p.stock_no || p.s)));
    if (!seen.has(key)) {
      seen.add(key);
      candidateMatches.push(p);
    }
    if (candidateMatches.length >= 25) break;
  }

  if (isFinal && candidateMatches.length === 1) {
    selectCartonProduct(candidateMatches[0]);
    return;
  }

  // 3. INSTANT SYNCHRONOUS RENDER (0ms latency!)
  renderCartonSearchResults(candidateMatches, q);

  // 4. Background NON-BLOCKING server enrichment
  if (candidateMatches.length < 5) {
    clearTimeout(cartonBackgroundFetchTimer);
    cartonBackgroundFetchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=20`).then(r => r.json());
        if (currentCartonReqId !== cartonSearchRequestId) return;
        const currentInput = (cartonStockNoInput?.value || '').trim().toLowerCase();
        if (currentInput !== qLower) return;

        if (res.success && Array.isArray(res.products) && res.products.length > 0) {
          let hasNew = false;
          for (const p of res.products) {
            const key = p.id ? ('id_' + p.id) : (p.barcode || p.b ? ('bar_' + (p.barcode || p.b)) : ('name_' + (p.product_name || p.name || p.n) + '_stock_' + (p.stock_no || p.s)));
            if (!seen.has(key)) {
              seen.add(key);
              candidateMatches.push(p);
              hasNew = true;
            }
          }
          if (hasNew) {
            renderCartonSearchResults(candidateMatches.slice(0, 25), q);
          }
        }
      } catch (e) {
        console.warn("Background carton search enrich note:", e);
      }
    }, 200);
  }
}

function renderCartonSearchResults(matches, query) {
  if (!cartonSearchResultsList) return;
  cartonSearchResultsList.innerHTML = '';

  if (!matches || matches.length === 0) {
    const isEn = CURRENT_LANG === 'en';
    const noDiv = document.createElement('div');
    noDiv.className = 'no-results';
    noDiv.style.padding = '12px 14px';
    noDiv.style.fontSize = '12.5px';
    noDiv.innerHTML = `<span style="color:#ef4444; font-weight:600;">⚠️ ${isEn ? `No product matching "${escapeHtml(query)}"` : `未找到匹配 "${escapeHtml(query)}" 的商品`}</span>`;
    cartonSearchResultsList.appendChild(noDiv);
    cartonSearchResultsList.style.display = 'block';

    if (cartonMatchBox) cartonMatchBox.style.display = 'none';
    if (cartonNoMatchBox) cartonNoMatchBox.style.display = 'block';
    return;
  }

  if (cartonNoMatchBox) cartonNoMatchBox.style.display = 'none';

  matches.forEach(p => {
    const itemEl = document.createElement('div');
    itemEl.className = 'carton-search-item result-row';
    itemEl.style.cssText = 'padding: 9px 12px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.12s ease; border-radius: 0;';
    itemEl._product = p;

    const name = p.product_name || p.name || p.n || 'Unnamed item';
    const barcode = p.barcode || p.b || '';
    const barcode2 = p.barcode_2 || p.b2 || '';
    const stockCode = p.stock_no || p.stock_code || p.s || '';
    const category = p.category || p.c || '';

    const isCarton = Boolean(
      p.is_carton ||
      p.loc_type === 'CARTON' ||
      (p.location_storage && p.location_storage.toUpperCase().includes('CARTON')) ||
      (p.storage_location && p.storage_location.toUpperCase().includes('CARTON'))
    );

    const cartonTag = isCarton 
      ? `<span style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:1px 5px; border-radius:4px; font-size:10px; font-weight:700; margin-left:4px;">📦 Carton</span>`
      : '';

    const floor = p.floor !== undefined && p.floor !== null ? String(p.floor) : '';
    const row = p.batch !== undefined && p.batch !== null ? String(p.batch) : (p.row !== undefined && p.row !== null ? String(p.row) : (p.row || ''));
    const shelf = p.shelf !== undefined && p.shelf !== null ? String(p.shelf) : '';
    const level = p.level !== undefined && p.level !== null ? String(p.level) : '';
    const hasLoc = floor !== '' || row !== '' || shelf !== '';
    const locText = hasLoc ? `📍 ${floor}-${row}-${shelf}-${level}` : `<span style="color:#94a3b8; font-size:11px;">⚠️ No loc</span>`;

    const codeDisplay = barcode || (barcode2 ? `Barcode 2: ${barcode2}` : (stockCode ? `#${stockCode}` : ''));

    itemEl.innerHTML = `
      <div style="flex: 1; min-width: 0; padding-right: 8px;">
        <div style="font-size: 13px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${escapeHtml(name)} ${cartonTag}
        </div>
        <div style="font-size: 11px; color: var(--muted); margin-top: 2px; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${escapeHtml(codeDisplay)}${category ? ` &bull; ${escapeHtml(category)}` : ''}
        </div>
      </div>
      <div style="text-align: right; flex-shrink: 0;">
        <div style="font-size: 11px; font-weight: 600; color: var(--accent);">
          ${locText}
        </div>
      </div>
    `;

    itemEl.addEventListener('click', () => {
      selectCartonProduct(p);
    });

    cartonSearchResultsList.appendChild(itemEl);
  });

  cartonSearchResultsList.style.display = 'block';
}

if (cartonStockNoInput) {
  cartonStockNoInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (cartonClearSearchBtn) cartonClearSearchBtn.style.display = val ? 'block' : 'none';
    doCartonProductSearch(val);
  });

  cartonStockNoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = cartonStockNoInput.value.trim();
      if (!val) return;
      const firstItem = cartonSearchResultsList ? cartonSearchResultsList.querySelector('.carton-search-item') : null;
      if (firstItem && firstItem._product) {
        selectCartonProduct(firstItem._product);
      } else {
        doCartonProductSearch(val, true);
      }
    } else if (e.key === 'Escape') {
      hideCartonSearchResults();
    }
  });

  cartonStockNoInput.addEventListener('focus', () => {
    const val = cartonStockNoInput.value.trim();
    if (val && (!matchedCartonProduct || cartonStockNoInput.value !== (matchedCartonProduct.product_name || matchedCartonProduct.name))) {
      doCartonProductSearch(val);
    }
  });
}

if (cartonScanLocBtn) {
  cartonScanLocBtn.addEventListener('click', () => {
    if (!matchedCartonProduct) {
      showToast('Please type a valid stock number first.', 'error');
      return;
    }
    activeProduct = matchedCartonProduct;
    if (cartonOverlay) cartonOverlay.classList.remove('show');
    startScanner('carton_location_qr');
    showToast(`Point camera at shelf QR code for carton: "${matchedCartonProduct.product_name || matchedCartonProduct.name}"`);
  });
}

function handleCartonLocationQRScan(code) {
  const parsed = parseLocationQR(code);
  if (!parsed) {
    showToast("Invalid location QR format. Expected e.g. '1-02-01-02'.", 'error');
    return;
  }

  const fEl = document.getElementById('cartonManualFloor');
  const rEl = document.getElementById('cartonManualRow');
  const sEl = document.getElementById('cartonManualShelf');
  const lEl = document.getElementById('cartonManualLevel');

  if (fEl) fEl.value = parsed.floor || '1';
  if (rEl) rEl.value = pad2(parsed.row || '01');
  if (sEl) sEl.value = pad2(parsed.shelf || '01');
  if (lEl) lEl.value = pad2(parsed.level || '00');

  if (cartonOverlay) cartonOverlay.classList.add('show');
  showToast(`Location Scanned: Floor ${parsed.floor}, Row ${parsed.row}, Shelf ${parsed.shelf}. Tap "Save Carton Location" to confirm.`, 'info');
}

const cartonSaveLocationBtn = document.getElementById('cartonSaveLocationBtn');
if (cartonSaveLocationBtn) {
  cartonSaveLocationBtn.addEventListener('click', async () => {
    let p = matchedCartonProduct || activeProduct;
    
    // Auto fallback: if user typed stock code or name without clicking dropdown
    if (!p) {
      const inputVal = cartonStockNoInput ? cartonStockNoInput.value.trim() : '';
      if (inputVal) {
        const qLower = inputVal.toLowerCase();
        p = PRODUCTS.find(item => {
          const b1 = (item.barcode || item.b || '').toString().trim().toLowerCase();
          const b2 = (item.barcode_2 || item.b2 || '').toString().trim().toLowerCase();
          const s = (item.stock_no || item.stock_code || item.s || '').toString().trim().toLowerCase();
          const n = (item.product_name || item.name || item.n || '').toString().trim().toLowerCase();
          return (b1 && b1 === qLower) || (b2 && b2 === qLower) || (s && s === qLower) || (n && n === qLower) || (n && n.includes(qLower));
        });
        if (p) matchedCartonProduct = p;
      }
    }

    if (!p) {
      showCartonFormError(CURRENT_LANG === 'en'
        ? 'Please search, select, or scan a valid product first.'
        : '请先搜索、选择或扫描有效商品。');
      return;
    }

    const floorRaw = document.getElementById('cartonManualFloor')?.value.trim() || '';
    const rowRaw = document.getElementById('cartonManualRow')?.value.trim() || '';
    const shelfRaw = document.getElementById('cartonManualShelf')?.value.trim() || '';
    const levelRaw = document.getElementById('cartonManualLevel')?.value.trim() || '';
    const qtyRaw = document.getElementById('cartonQtyInput')?.value.trim() || '';
    const putawayQty = Number(qtyRaw);

    if (!floorRaw || !rowRaw || !shelfRaw || !levelRaw || !qtyRaw) {
      showCartonFormError(CURRENT_LANG === 'en'
        ? 'Floor, Row, Shelf, Level, and Quantity are required.'
        : '楼层、排号、货架号、层数和数量均为必填项。');
      return;
    }
    if (!Number.isInteger(putawayQty) || putawayQty < 1) {
      showCartonFormError(CURRENT_LANG === 'en'
        ? 'Quantity must be a whole number of at least 1.'
        : '数量必须是至少为 1 的整数。');
      return;
    }
    clearCartonFormError();

    const floor = floorRaw;
    const row = pad2(rowRaw);
    const shelf = pad2(shelfRaw);
    const level = pad2(levelRaw);

    const loc = `${floor}-${row}-${shelf}-${level}`;
    const floorLabel = floor === '1' ? 'First Floor' : (floor === '2' ? 'Second Floor' : 'Third Floor');
    const storage_location = `${loc} ${floorLabel} - Row ${row} - Shelves ${shelf} - Level ${level} • 📦 Big Carton`;

    // 1. Locate all existing rows for this product in catalog
    const barcode = (p.barcode || p.b || '').toString().trim().toLowerCase();
    const barcode2 = (p.barcode_2 || p.b2 || '').toString().trim().toLowerCase();
    const stockCode = (p.stock_no || p.stock_code || p.s || '').toString().trim().toLowerCase();

    const matchingRows = PRODUCTS.filter(item => {
      if (p.id && String(item.id) === String(p.id)) return true;
      const ib1 = (item.barcode || item.b || '').toString().trim().toLowerCase();
      const ib2 = (item.barcode_2 || item.b2 || '').toString().trim().toLowerCase();
      const is = (item.stock_no || item.stock_code || item.s || '').toString().trim().toLowerCase();
      if (barcode && (ib1 === barcode || ib2 === barcode)) return true;
      if (barcode2 && (ib1 === barcode2 || ib2 === barcode2)) return true;
      if (stockCode && is === stockCode) return true;
      return false;
    });

    const masterProd = matchingRows.find(item => item.product_name || item.name || item.n) || p;

    const resolvedName = (p.product_name || p.name || p.n || masterProd.product_name || masterProd.name || masterProd.n || '').trim();
    const resolvedStock = (p.stock_no || p.stock_code || p.s || masterProd.stock_no || masterProd.stock_code || masterProd.s || '').trim();
    const resolvedBarcode = (p.barcode || p.b || masterProd.barcode || masterProd.b || '').trim();
    const resolvedBarcode2 = (p.barcode_2 || p.b2 || masterProd.barcode_2 || masterProd.b2 || '').trim();
    const resolvedCat = (p.category || p.c || masterProd.category || masterProd.c || 'Uncategorized').trim();
    const resolvedDept = (p.department || p.subcategory || p.sc || masterProd.department || masterProd.subcategory || masterProd.sc || '').trim();

    // Check if there is already a row for this product at this exact location
    const sameLocRow = matchingRows.find(item =>
      String(item.floor || '1') === String(floor) &&
      pad2(item.row || item.batch || '') === pad2(row) &&
      pad2(item.shelf || '') === pad2(shelf) &&
      pad2(item.level || '00') === pad2(level)
    );

    // Check if there is an unmapped row for this product
    const unmappedRow = matchingRows.find(item =>
      !item.floor || String(item.floor).trim() === '' || !item.row || String(item.row).trim() === '' || item.status === 'UNMAPPED'
    );

    // If matching at same location or unmapped row exists, update via PUT; otherwise add a new location row via POST
    const targetRow = sameLocRow || unmappedRow;
    const targetId = targetRow ? targetRow.id : null;
    const url = targetId ? `/api/products/${targetId}` : '/api/products';
    const method = targetId ? 'PUT' : 'POST';

    const finalQty = sameLocRow ? ((parseInt(sameLocRow.qty, 10) || 0) + putawayQty) : putawayQty;

    cartonSaveLocationBtn.disabled = true;
    showToast(`Saving Carton Location: ${loc}...`);

    const payload = {
      name: resolvedName,
      product_name: resolvedName,
      barcode: resolvedBarcode,
      barcode_2: resolvedBarcode2,
      stock_code: resolvedStock,
      stock_no: resolvedStock,
      category: resolvedCat,
      subcategory: resolvedDept,
      department: resolvedDept,
      floor,
      row,
      batch: row,
      shelf,
      level,
      loc,
      loc_full: storage_location,
      location_storage: storage_location,
      storage_location: storage_location,
      is_carton: true,
      loc_type: 'CARTON',
      qty: finalQty,
      status: 'MAPPED',
      custom: true,
      last_modified_by: currentUser ? currentUser.full_name : 'Staff Stockman'
    };

    try {
      if (putawayQty > 0) {
        const inventoryOperation = targetRow && !sameLocRow ? 'putaway' : 'receipts';
        const inventoryResponse = await authFetch('/api/inventory/' + inventoryOperation, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            barcode: resolvedBarcode,
            stock_no: resolvedStock,
            product_name: resolvedName,
            qty: putawayQty,
            to_location: loc,
            location_code: loc,
            package_type: 'CARTON',
            source_reference: 'Big Items Putaway'
          })
        });
        const inventoryData = await inventoryResponse.json();
        if (!inventoryResponse.ok || !inventoryData.success) throw new Error(inventoryData.error || 'Could not update inventory ledger.');
      }
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success && res.product) {
        playScanBeep(true);
        if (cartonOverlay) cartonOverlay.classList.remove('show');
        
        const savedProd = res.product;
        savedProd.product_name = savedProd.product_name || resolvedName;
        savedProd.name = savedProd.name || resolvedName;
        savedProd.stock_no = savedProd.stock_no || resolvedStock;
        savedProd.stock_code = savedProd.stock_code || resolvedStock;
        savedProd.barcode = savedProd.barcode || resolvedBarcode;
        savedProd.barcode_2 = savedProd.barcode_2 || resolvedBarcode2;
        savedProd.category = savedProd.category || resolvedCat;
        savedProd.department = savedProd.department || resolvedDept;

        const idx = PRODUCTS.findIndex(item => String(item.id) === String(savedProd.id));
        if (idx !== -1) {
          PRODUCTS[idx] = savedProd;
        } else {
          PRODUCTS.unshift(savedProd);
        }

        // Also ensure all other rows sharing this SKU retain the resolved product name
        PRODUCTS.forEach(item => {
          const ib1 = (item.barcode || item.b || '').toString().trim().toLowerCase();
          const is = (item.stock_no || item.stock_code || item.s || '').toString().trim().toLowerCase();
          if ((resolvedBarcode && ib1 === resolvedBarcode.toLowerCase()) || (resolvedStock && is === resolvedStock.toLowerCase())) {
            item.product_name = resolvedName;
            item.name = resolvedName;
          }
        });

        if (typeof productsData !== 'undefined' && Array.isArray(productsData)) {
          const dataIdx = productsData.findIndex(item => String(item.id) === String(savedProd.id));
          if (dataIdx !== -1) productsData[dataIdx] = savedProd;
          else productsData.unshift(savedProd);
        }

        rebuildIndex();
        persistSearchIndexSoon();
        renderProduct(savedProd);
        if (typeof renderPortalDataTable === 'function') {
          renderPortalDataTable({ refreshStats: true });
        }
        showToast(`🎉 Big Carton Location Saved! "${savedProd.product_name || savedProd.name}" -> Floor ${floor}, Row ${row}, Shelf ${shelf}`, 'success');
      } else {
        showToast('Failed to save carton location: ' + (res.error || res.message || 'Server error'), 'error');
      }
    } catch (err) {
      showToast('Network error saving carton location: ' + err.message, 'error');
    } finally {
      cartonSaveLocationBtn.disabled = false;
    }
  });
}

['cartonManualFloor', 'cartonManualRow', 'cartonManualShelf', 'cartonManualLevel', 'cartonQtyInput'].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener('input', clearCartonFormError);
  input.addEventListener('change', clearCartonFormError);
});

if (cartonAddNewBtn) {
  cartonAddNewBtn.addEventListener('click', () => {
    const stockVal = cartonStockNoInput ? cartonStockNoInput.value.trim() : '';
    if (cartonOverlay) cartonOverlay.classList.remove('show');
    openAddForm();
    const fStockEl = document.getElementById('fStock');
    if (fStockEl) fStockEl.value = stockVal;
  });
}


// --- 2. SUPER ADMIN DASHBOARD & EXCEL (.XLSX) EXPORTER ---
const adminDashboardOverlay = document.getElementById('adminDashboardOverlay');
const adminDashboardBtn = document.getElementById('adminDashboardBtn');
const closeAdminDashboardModal = document.getElementById('closeAdminDashboardModal');
const cancelAdminModalBtn = document.getElementById('cancelAdminModalBtn');
const downloadXlsxBtn = document.getElementById('downloadXlsxBtn');

if (adminDashboardBtn) {
  adminDashboardBtn.addEventListener('click', openAdminDashboard);
}

if (closeAdminDashboardModal) closeAdminDashboardModal.addEventListener('click', () => adminDashboardOverlay.classList.remove('show'));
if (cancelAdminModalBtn) cancelAdminModalBtn.addEventListener('click', () => adminDashboardOverlay.classList.remove('show'));

async function openAdminDashboard() {
  if (adminDashboardOverlay) adminDashboardOverlay.classList.add('show');

  try {
    const res = await authFetch('/api/admin/stats');
    const data = await res.json();
    if (data.success && data.stats) {
      document.getElementById('admStatTotal').textContent = (data.stats.totalProducts || 0).toLocaleString();
      document.getElementById('admStatMapped').textContent = (data.stats.mappedCount || 0).toLocaleString();
      document.getElementById('admStatUnmapped').textContent = (data.stats.unmappedCount || 0).toLocaleString();
    }
  } catch (e) {
    const total = productsData.length;
    const mapped = productsData.filter(p => (p.status || '').toUpperCase() === 'MAPPED' || p.floor || p.row || p.shelf).length;
    document.getElementById('admStatTotal').textContent = total.toLocaleString();
    document.getElementById('admStatMapped').textContent = mapped.toLocaleString();
    document.getElementById('admStatUnmapped').textContent = (total - mapped).toLocaleString();
  }
}

if (downloadXlsxBtn) {
  downloadXlsxBtn.addEventListener('click', exportWarehouseDataToExcel);
}

async function exportWarehouseDataToExcel() {
  const status = document.getElementById('expStatusFilter')?.value || 'ALL';
  const floor = document.getElementById('expFloorFilter')?.value || 'ALL';

  showToast('Generating Excel report...');
  if (downloadXlsxBtn) downloadXlsxBtn.disabled = true;
  const exportButton = document.getElementById('saExportBtn');
  if (exportButton) exportButton.disabled = true;

  try {
    // Export from the database, not the browser search cache. The cache is
    // intentionally compact and may only contain recently loaded records.
    const response = await authFetch(`/api/admin/export-data?status=${encodeURIComponent(status)}&floor=${encodeURIComponent(floor)}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || !data.success || !Array.isArray(data.products)) {
      throw new Error(data.error || 'Could not load the Master Inventory export data.');
    }
    const items = data.products;

    const exportRows = items.map((p, idx) => ({
      '#': idx + 1,
      'Product Name': p.product_name || p.name || '—',
      'Stock No': p.stock_no || p.stock_code || '—',
      'Barcode': p.barcode || '—',
      'Department / Category': p.department || p.category || p.subcategory || '—',
      'Floor': p.floor || '—',
      'Row': p.batch || p.row || '—',
      'Shelf': p.shelf || '—',
      'Level': p.level || '—',
      'Shelf Location': p.loc || p.locFull || p.location_storage || p.storage_location || (p.floor ? `${p.floor}-${p.batch || p.row}-${p.shelf}-${p.level}` : 'UNMAPPED'),
      'On Hand Qty': p.qty !== undefined ? p.qty : 0,
      'Status': p.status || ((p.floor || p.row || p.shelf) ? 'MAPPED' : 'UNMAPPED'),
      'Last Modified By': p.last_modified_by || 'System'
    }));

    if (typeof XLSX !== 'undefined') {
      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      worksheet['!cols'] = [
        { wch: 7 }, { wch: 38 }, { wch: 16 }, { wch: 18 }, { wch: 25 },
        { wch: 9 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 22 },
        { wch: 15 }, { wch: 13 }, { wch: 22 }
      ];
      worksheet['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 12, r: Math.max(exportRows.length, 1) } }) };
      worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Warehouse Inventory');

      XLSX.writeFile(workbook, `Warehouse_Inventory_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
      showToast('Excel report downloaded successfully!', 'success');
    } else {
      showToast('XLSX library not loaded.', 'error');
    }
  } catch (err) {
    showToast('Failed to export Excel file: ' + err.message, 'error');
  } finally {
    if (downloadXlsxBtn) downloadXlsxBtn.disabled = false;
    if (exportButton) exportButton.disabled = false;
  }
}


// --- 3. DAILY DELIVERY ORDERS & S-SHAPE PICK ROUTE ENGINE ---
const ordersOverlay = document.getElementById('ordersOverlay');
const pickerRouteOverlay = document.getElementById('pickerRouteOverlay');
const ordersBtn = document.getElementById('ordersBtn');
const closeOrdersModal = document.getElementById('closeOrdersModal');
const cancelOrdersBtn = document.getElementById('cancelOrdersBtn');
const closeRouteModal = document.getElementById('closeRouteModal');
const cancelRouteBtn = document.getElementById('cancelRouteBtn');

let currentActiveRouteSteps = [];
let currentRouteStepIndex = 0;

if (ordersBtn) {
  ordersBtn.addEventListener('click', openOrdersModal);
}

if (closeOrdersModal) closeOrdersModal.addEventListener('click', () => ordersOverlay.classList.remove('show'));
if (cancelOrdersBtn) cancelOrdersBtn.addEventListener('click', () => ordersOverlay.classList.remove('show'));
if (closeRouteModal) closeRouteModal.addEventListener('click', () => pickerRouteOverlay.classList.remove('show'));
if (cancelRouteBtn) cancelRouteBtn.addEventListener('click', () => pickerRouteOverlay.classList.remove('show'));

async function openOrdersModal() {
  if (ordersOverlay) ordersOverlay.classList.add('show');
  const container = document.getElementById('ordersListContainer');
  if (!container) return;

  container.innerHTML = '<div style="color:#64748b; font-size:13px;">Loading delivery orders...</div>';

  try {
    const res = await authFetch('/api/orders');
    const data = await res.json();

    if (data.success && data.orders && data.orders.length > 0) {
      container.innerHTML = '';
      data.orders.forEach(ord => {
        const itemEl = document.createElement('div');
        itemEl.style.cssText = 'background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; display:flex; justify-content:space-between; align-items:center;';
        itemEl.innerHTML = `
          <div>
            <div style="font-weight:700; font-size:14.5px; color:#0f172a;">${escapeHtml(ord.order_no)}</div>
            <div style="font-size:12px; color:#64748b; margin-top:2px;">Customer: ${escapeHtml(ord.customer_name)}</div>
            <div style="font-size:11.5px; color:#059669; font-weight:600; margin-top:4px;">${ord.items ? ord.items.length : 0} Items to Pick</div>
          </div>
          <button type="button" onclick="generatePickRouteForOrder(${ord.id})" style="background:#059669; color:white; border:none; padding:8px 14px; border-radius:8px; font-weight:700; font-size:12.5px; cursor:pointer;">
            ⚡ Start Pick Route
          </button>
        `;
        container.appendChild(itemEl);
      });
    } else {
      container.innerHTML = '<div style="color:#64748b; font-size:13px;">No pending delivery orders.</div>';
    }
  } catch (e) {
    container.innerHTML = '<div style="color:#ef4444; font-size:13px;">Failed to fetch delivery orders.</div>';
  }
}

window.generatePickRouteForOrder = async function(orderId) {
  showToast('Calculating S-Shape shortest pick route...');

  try {
    const res = await authFetch(`/api/orders/${orderId}/route`);
    const data = await res.json();

    if (data.success && data.routeSteps && data.routeSteps.length > 0) {
      currentActiveRouteSteps = data.routeSteps;
      currentRouteStepIndex = 0;

      if (ordersOverlay) ordersOverlay.classList.remove('show');
      if (pickerRouteOverlay) pickerRouteOverlay.classList.add('show');

      renderActiveRouteStep();
    } else {
      showToast('No valid mapped items found for this order.', 'error');
    }
  } catch (err) {
    showToast('Error generating pick route: ' + err.message, 'error');
  }
};

function renderActiveRouteStep() {
  if (!currentActiveRouteSteps || currentActiveRouteSteps.length === 0) return;
  const step = currentActiveRouteSteps[currentRouteStepIndex];

  document.getElementById('routeOrderTitle').textContent = `Pick Route (Step ${currentRouteStepIndex + 1} of ${currentActiveRouteSteps.length})`;
  document.getElementById('routeProgressText').textContent = `Optimal Path Progress: ${Math.round(((currentRouteStepIndex + 1) / currentActiveRouteSteps.length) * 100)}%`;

  document.getElementById('activeStepLocationBadge').textContent = `📍 TARGET LOCATION: FLOOR ${step.floor} - ROW ${step.row} - SHELF ${step.shelf} (LEVEL ${step.level})`;
  document.getElementById('activeStepProductName').textContent = step.product_name;
  document.getElementById('activeStepMeta').textContent = `Stock No: ${step.stock_no || '—'} | Barcode: ${step.barcode || '—'}`;
  document.getElementById('activeStepQtyBadge').textContent = `Pick ${step.requested_qty} Units`;
}

const confirmStepBtn = document.getElementById('confirmStepBtn');
if (confirmStepBtn) {
  confirmStepBtn.addEventListener('click', () => {
    playScanBeepSound();
    if (currentRouteStepIndex < currentActiveRouteSteps.length - 1) {
      currentRouteStepIndex++;
      renderActiveRouteStep();
      showToast('Pick confirmed! Moving to next shelf location.', 'success');
    } else {
      if (pickerRouteOverlay) pickerRouteOverlay.classList.remove('show');
      showToast('🎉 Order Picking Route Completed Successfully!', 'success');
    }
  });
}

// --- 4. DEDICATED SUPER ADMIN MASTER PORTAL DATA TABLE CONTROLLER ---
let portalCurrentPage = 1;
const portalPageSize = 25;
let portalDebounceTimer = null;
let portalAbortController = null;
let portalStatsCached = null;
let portalLivePollingTimer = null;
let portalLivePollingBusy = false;
let portalLivePageSnapshot = null;
let portalLiveAlertTimer = null;
let portalLiveRefreshTimer = null;
let portalLiveOperationsTimer = null;
let browserSupabaseClient = null;
let browserSupabaseClientPromise = null;
let browserProductRealtimeChannel = null;
let portalNotifications = [];

function portalNotificationsKey() {
  return `wh_superadmin_notifications_${currentUser?.username || 'superadmin'}`;
}

function loadPortalNotifications() {
  try { portalNotifications = JSON.parse(localStorage.getItem(portalNotificationsKey()) || '[]'); } catch (err) { portalNotifications = []; }
  if (!Array.isArray(portalNotifications)) portalNotifications = [];
  updatePortalNotificationBadge();
}

function savePortalNotifications() {
  try { localStorage.setItem(portalNotificationsKey(), JSON.stringify(portalNotifications.slice(0, 120))); } catch (err) { /* storage is optional */ }
}

function updatePortalNotificationBadge() {
  const badge = document.getElementById('saNotificationBadge');
  if (!badge) return;
  const unread = portalNotifications.filter(item => !item.read).length;
  badge.textContent = unread > 99 ? '99+' : String(unread);
  badge.style.display = unread ? 'inline-block' : 'none';
}

function recordPortalNotification(product) {
  const location = portalProductLocation(product);
  const key = `${portalProductLiveKey(product)}|${portalProductLiveSignature(product)}`;
  const now = Date.now();
  if (portalNotifications.some(item => item.key === key && now - Number(item.time || 0) < 5000)) return;
  portalNotifications.unshift({ key, time: now, read: false, product: product.product_name || product.name || product.barcode || product.stock_no || 'Product', location, actor: product.last_modified_by || 'Warehouse staff' });
  portalNotifications = portalNotifications.slice(0, 120);
  savePortalNotifications();
  updatePortalNotificationBadge();
  if (document.getElementById('saNotificationsPanel')?.style.display !== 'none') renderSuperadminNotifications();
}

function toPortalServerNotification(item, read = false) {
  return {
    key: `server:${item.id}`,
    time: new Date(item.created_at || Date.now()).getTime(),
    read,
    title: item.title || 'Warehouse activity',
    detail: item.detail || '',
    action: item.action || 'ACTIVITY',
    product: item.product_name || '',
    location: item.location || '',
    actor: item.actor_name || 'Warehouse staff'
  };
}

function addLivePortalNotification(item) {
  if (!item || item.id === undefined || item.id === null) return;
  const key = `server:${item.id}`;
  const previous = portalNotifications.find(notification => notification.key === key);
  if (previous) return;

  const notification = toPortalServerNotification(item);
  // A product update can create a temporary local location alert at the same
  // moment as the durable notification. Keep the durable shared record only.
  portalNotifications = portalNotifications.filter(existing => {
    if (String(existing.key || '').startsWith('server:')) return true;
    const sameProduct = String(existing.product || '') === String(notification.product || '');
    const sameLocation = String(existing.location || '') === String(notification.location || '');
    return !(sameProduct && sameLocation && Math.abs(Number(existing.time || 0) - notification.time) < 5000);
  });
  portalNotifications.unshift(notification);
  portalNotifications = portalNotifications.sort((a, b) => Number(b.time || 0) - Number(a.time || 0)).slice(0, 120);
  savePortalNotifications();
  updatePortalNotificationBadge();
  if (document.getElementById('saNotificationsPanel')?.style.display !== 'none') renderSuperadminNotifications();
}

async function syncPortalNotifications() {
  if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.username !== 'superadmin')) return;
  try {
    const response = await authFetch('/api/admin/notifications?limit=120', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || !data.success || !Array.isArray(data.notifications)) return;
    const readByKey = new Map(portalNotifications.map(item => [item.key, item.read]));
    const serverItems = data.notifications.map(item => toPortalServerNotification(item, readByKey.get(`server:${item.id}`) || false));
    const localItems = portalNotifications.filter(item => !String(item.key).startsWith('server:'));
    portalNotifications = [...serverItems, ...localItems].sort((a, b) => Number(b.time || 0) - Number(a.time || 0)).slice(0, 120);
    savePortalNotifications();
    updatePortalNotificationBadge();
    if (document.getElementById('saNotificationsPanel')?.style.display !== 'none') renderSuperadminNotifications();
  } catch (err) { console.warn('Notification sync failed:', err.message); }
}

function portalProductIsMapped(product) {
  return (product && String(product.status || '').toUpperCase() === 'MAPPED') || Boolean(product && (product.floor || product.row || product.shelf));
}

function portalProductLocation(product) {
  if (!product) return 'Unassigned';
  const floor = product.floor ?? '';
  const row = product.batch ?? product.row ?? '';
  const shelf = product.shelf ?? '';
  const level = product.level ?? '0';
  return [floor, row, shelf, level].join('-');
}

function portalProductLiveKey(product) {
  return String(product && product.id !== undefined ? product.id : `${product?.barcode || ''}|${product?.stock_no || ''}`);
}

function portalProductLiveSignature(product) {
  return `${portalProductIsMapped(product) ? 'mapped' : 'unmapped'}|${portalProductLocation(product)}|${product?.status || ''}`;
}

function showPortalLocationAlert(product) {
  const alert = document.getElementById('portalLiveAlert');
  if (!alert || !product) return;
  const name = product.product_name || product.name || product.barcode || product.stock_no || 'Product';
  const location = portalProductLocation(product);
  const modifier = product.last_modified_by ? ` · ${product.last_modified_by}` : '';
  recordPortalNotification(product);
  alert.innerHTML = `<span class="portal-live-alert-icon" aria-hidden="true">📍</span><span><strong>Location saved</strong><br><b>${escapeHtml(name)}</b> → Floor ${escapeHtml(String(product.floor ?? ''))}, Row ${escapeHtml(String(product.batch ?? product.row ?? ''))}, Shelf ${escapeHtml(String(product.shelf ?? ''))}, Level ${escapeHtml(String(product.level ?? '0'))}${escapeHtml(modifier)}</span>`;
  alert.dataset.location = location;
  alert.classList.remove('show');
  requestAnimationFrame(() => alert.classList.add('show'));
  clearTimeout(portalLiveAlertTimer);
  portalLiveAlertTimer = setTimeout(() => alert.classList.remove('show'), 6500);
  playLocationSaveSound();
}

function setPortalLiveStatus(mode = 'live') {
  const status = document.getElementById('portalLiveStatus');
  if (!status) return;
  status.classList.toggle('is-fallback', mode !== 'live');
  status.innerHTML = `<span></span>${mode === 'live' ? 'Live updates on' : 'Live check on'}`;
}

function handlePortalLiveProduct(product, { initial = false } = {}) {
  if (!product || initial || !portalProductIsMapped(product)) return;
  const key = portalProductLiveKey(product);
  const previous = portalLivePageSnapshot && portalLivePageSnapshot.get(key);
  if (!previous || previous.signature !== portalProductLiveSignature(product)) {
    showPortalLocationAlert(product);
  }
}

function schedulePortalTableRefresh() {
  clearTimeout(portalLiveRefreshTimer);
  portalLiveRefreshTimer = setTimeout(() => {
    if (currentUser && (currentUser.role === 'superadmin' || currentUser.username === 'superadmin')) {
      void renderPortalDataTable({ refreshStats: true });
      if (document.getElementById('saOperationsPanel')?.style.display !== 'none') {
        clearTimeout(portalLiveOperationsTimer);
        portalLiveOperationsTimer = setTimeout(() => void renderSuperadminOperations(), 260);
      }
      if (document.getElementById('saSystemStockPanel')?.style.display !== 'none') {
        void renderSuperadminSystemStock();
      }
    }
  }, 180);
}

async function getBrowserSupabaseClient() {
  if (browserSupabaseClient) return browserSupabaseClient;
  if (browserSupabaseClientPromise) return browserSupabaseClientPromise;
  browserSupabaseClientPromise = (async () => {
    try {
      const api = window.supabase;
      if (!api || typeof api.createClient !== 'function') return null;
      const response = await fetch('/api/realtime-config', { cache: 'no-store' });
      const config = await response.json();
      if (!config.success || !config.url || !config.anonKey) return null;
      browserSupabaseClient = api.createClient(config.url, config.anonKey, {
        realtime: { params: { eventsPerSecond: 10 } }
      });
      // Keep the client available to older code that checks window.supabase.
      window.supabase = browserSupabaseClient;
      return browserSupabaseClient;
    } catch (err) {
      console.warn('Browser Realtime config unavailable:', err.message);
      return null;
    }
  })().finally(() => {
    browserSupabaseClientPromise = null;
  });
  return browserSupabaseClientPromise;
}

function handleProductRealtimeEvent(payload) {
  const item = payload && payload.new;
  if (!item || (!item.product_name && !item.barcode && !item.stock_no)) return;

  const stockman = item.last_modified_by ? `by ${item.last_modified_by}` : '';
  showToast(`🔔 Stock updated ${stockman}: ${item.product_name || item.barcode} (Qty: ${item.qty ?? 0})`);
  const existingIdx = PRODUCTS.findIndex(p => String(p.id) === String(item.id));
  if (existingIdx >= 0) PRODUCTS[existingIdx] = { ...PRODUCTS[existingIdx], ...item };
  else PRODUCTS.push(item);
  rebuildIndex();
  persistSearchIndexSoon();

  if (activeProduct && ((activeProduct.barcode && activeProduct.barcode === item.barcode) || (activeProduct.barcode_2 && activeProduct.barcode_2 === item.barcode_2) || (activeProduct.stock_no && activeProduct.stock_no === item.stock_no))) {
    renderProduct(item);
  }

  if (currentUser && (currentUser.role === 'superadmin' || currentUser.username === 'superadmin')) {
    handlePortalLiveProduct(item);
    schedulePortalTableRefresh();
  }
}

function handleAdminNotificationRealtimeEvent(payload) {
  if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.username !== 'superadmin')) return;
  if (payload?.eventType !== 'INSERT') return;
  addLivePortalNotification(payload.new);
}

async function startProductRealtime() {
  if (browserProductRealtimeChannel) return;
  const client = await getBrowserSupabaseClient();
  if (!client) return;
  try {
    browserProductRealtimeChannel = client.channel('superadmin_live_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, handleProductRealtimeEvent)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, handleAdminNotificationRealtimeEvent)
      .subscribe(status => setPortalLiveStatus(status === 'SUBSCRIBED' ? 'live' : 'fallback'));
  } catch (err) {
    browserProductRealtimeChannel = null;
    console.warn('Supabase Realtime subscription unavailable:', err.message);
  }
}

function stopPortalLiveUpdates() {
  clearInterval(portalLivePollingTimer);
  portalLivePollingTimer = null;
  portalLivePageSnapshot = null;
  clearTimeout(portalLiveAlertTimer);
  clearTimeout(portalLiveRefreshTimer);
  clearTimeout(portalLiveOperationsTimer);
  const alert = document.getElementById('portalLiveAlert');
  if (alert) alert.classList.remove('show');
}

async function pollPortalLiveTable() {
  if (portalLivePollingBusy || !currentUser || (currentUser.role !== 'superadmin' && currentUser.username !== 'superadmin')) return;
  const portal = document.getElementById('superAdminPortalView');
  if (!portal || portal.style.display === 'none') return;
  portalLivePollingBusy = true;
  try {
    await renderPortalDataTable({ live: true, refreshStats: true });
    await syncPortalNotifications();
    if (document.getElementById('saOperationsPanel')?.style.display !== 'none') {
      await renderSuperadminOperations();
    }
  } finally {
    portalLivePollingBusy = false;
  }
}

function startPortalLiveUpdates() {
  stopPortalLiveUpdates();
  loadPortalNotifications();
  void syncPortalNotifications();
  void startProductRealtime();
  setPortalLiveStatus('fallback');
  void pollPortalLiveTable();
  // Realtime above is the normal immediate path. This is only a recovery path
  // for a dropped browser connection or a database that has not enabled Realtime.
  portalLivePollingTimer = setInterval(() => { void pollPortalLiveTable(); }, 1000);
}

async function fetchPortalKPIs(force = false) {
  if (portalStatsCached && !force) return portalStatsCached;
  try {
    const statsRes = await authFetch('/api/admin/stats');
    const statsData = await statsRes.json();
    if (statsData.success && statsData.stats) {
      portalStatsCached = statsData.stats;
      const { totalProducts, mappedCount, unmappedCount, totalQty } = statsData.stats;
      if (document.getElementById('portalTotalProducts')) document.getElementById('portalTotalProducts').textContent = (totalProducts || 0).toLocaleString();
      if (document.getElementById('portalMappedCount')) document.getElementById('portalMappedCount').textContent = (mappedCount || 0).toLocaleString();
      if (document.getElementById('portalUnmappedCount')) document.getElementById('portalUnmappedCount').textContent = (unmappedCount || 0).toLocaleString();
      if (document.getElementById('portalTotalQty')) document.getElementById('portalTotalQty').textContent = (totalQty || 0).toLocaleString();
      
      const mappedPct = totalProducts > 0 ? ((mappedCount / totalProducts) * 100).toFixed(1) : '0';
      const mappedPctEl = document.getElementById('portalMappedPct');
      if (mappedPctEl) {
        mappedPctEl.innerHTML = `<span style="font-weight:800; font-size:12px;">${mappedPct}%</span> <span style="color:#64748b;">mapped (${(mappedCount || 0).toLocaleString()} items)</span>`;
      }
    }
  } catch (err) {
    console.warn('Portal stats fetch error:', err);
  }
}

async function renderPortalDataTable(options = {}) {
  const tableBody = document.getElementById('portalTableBody');
  if (!tableBody) return;

  const searchQuery = (document.getElementById('portalTableSearch')?.value || '').trim();
  const statusFilter = document.getElementById('portalStatusFilter')?.value || 'ALL';
  const floorFilter = document.getElementById('portalFloorFilter')?.value || 'ALL';

  // Load / refresh KPIs in background
  fetchPortalKPIs(options.refreshStats);

  // Cancel previous in-flight request if user is typing or changing filters rapidly
  if (portalAbortController) {
    portalAbortController.abort();
  }
  portalAbortController = new AbortController();

  try {
    const url = `/api/admin/products?page=${portalCurrentPage}&limit=${portalPageSize}&search=${encodeURIComponent(searchQuery)}&status=${encodeURIComponent(statusFilter)}&floor=${encodeURIComponent(floorFilter)}`;
    const res = await authFetch(url, { signal: portalAbortController.signal });
    const data = await res.json();

    if (!data.success) {
      tableBody.innerHTML = `<tr><td colspan="9" style="padding:24px; text-align:center; color:#e11d48;">Error loading inventory data: ${escapeHtml(data.error || 'Server error')}</td></tr>`;
      return;
    }

    const { products: pageItems, total: totalRecords, totalPages } = data;

    if (options.live) {
      const nextSnapshot = new Map();
      (pageItems || []).forEach(product => {
        const key = portalProductLiveKey(product);
        const previous = portalLivePageSnapshot && portalLivePageSnapshot.get(key);
        nextSnapshot.set(key, { signature: portalProductLiveSignature(product) });
        if (previous && previous.signature !== portalProductLiveSignature(product) && portalProductIsMapped(product)) {
          showPortalLocationAlert(product);
        }
      });
      portalLivePageSnapshot = nextSnapshot;
    }

    const startIdx = (portalCurrentPage - 1) * portalPageSize;
    const pagInfo = document.getElementById('portalPaginationInfo');
    if (pagInfo) {
      const endDisplay = Math.min(startIdx + portalPageSize, totalRecords);
      pagInfo.innerHTML = `Showing <strong style="color:#0f172a;">${totalRecords > 0 ? (startIdx + 1).toLocaleString() : 0}</strong> to <strong style="color:#0f172a;">${endDisplay.toLocaleString()}</strong> of <strong style="color:#0f172a;">${totalRecords.toLocaleString()}</strong> SKUs`;
    }

    const pageLabel = document.getElementById('portalCurrentPageLabel');
    if (pageLabel) pageLabel.textContent = `Page ${portalCurrentPage} of ${totalPages || 1}`;

    const prevBtn = document.getElementById('portalPrevPageBtn');
    if (prevBtn) prevBtn.disabled = portalCurrentPage <= 1;

    const nextBtn = document.getElementById('portalNextPageBtn');
    if (nextBtn) nextBtn.disabled = portalCurrentPage >= totalPages;

    tableBody.innerHTML = '';
    const mobileCardsList = document.getElementById('portalMobileCardsList');
    if (mobileCardsList) mobileCardsList.innerHTML = '';

    if (!pageItems || pageItems.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="padding:36px 16px; text-align:center;">
            <div style="width:40px; height:40px; border-radius:10px; background:#f1f5f9; color:#64748b; display:inline-flex; align-items:center; justify-content:center; margin-bottom:8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div style="font-weight:700; font-size:13.5px; color:#0f172a;">No matching products found</div>
            <div style="font-size:11.5px; color:#64748b; margin-top:2px;">Try adjusting your keyword or status/floor filter.</div>
          </td>
        </tr>`;
      if (mobileCardsList) {
        mobileCardsList.innerHTML = `
          <div style="padding:28px 16px; text-align:center; background:#ffffff; border-radius:14px; border:1.5px solid #e2e8f0;">
            <div style="font-weight:700; font-size:14px; color:#0f172a;">No matching products found</div>
            <div style="font-size:12px; color:#64748b; margin-top:4px;">Try adjusting your keyword or status/floor filter.</div>
          </div>`;
      }
      return;
    }

    window.portalProductsMap = {};

    pageItems.forEach((p, idx) => {
      const locList = Array.isArray(p.locations) ? p.locations : [];
      const itemKey = p.id || (p.stock_no ? 'stock_' + p.stock_no : (p.barcode ? 'bar_' + p.barcode : (locList[0] && locList[0].id ? locList[0].id : ('idx_' + idx))));
      window.portalProductsMap[itemKey] = p;
      if (p.id) window.portalProductsMap[p.id] = p;

      const tr = document.createElement('tr');
      const isMapped = (p.status || '').toUpperCase() === 'MAPPED' || p.floor || p.row || p.shelf;
      const floor = p.floor !== undefined && p.floor !== null ? String(p.floor) : '';
      const row = p.batch !== undefined && p.batch !== null ? String(p.batch) : (p.row !== undefined && p.row !== null ? String(p.row) : '');
      const shelf = p.shelf !== undefined && p.shelf !== null ? String(p.shelf) : '';
      const level = p.level !== undefined && p.level !== null ? String(p.level) : '0';
      const extraLocCount = locList.length > 1 ? locList.length - 1 : 0;
      const allLocsTooltip = locList.length > 0 ? locList.map(l => l.loc).filter(Boolean).join(', ') : `${floor}-${row}-${shelf}-${level}`;

      const hasCartonStorage = Boolean(
        p.is_carton ||
        p.loc_type === 'CARTON' ||
        (p.location_storage && p.location_storage.includes('Carton')) ||
        (p.storage_location && p.storage_location.includes('Carton')) ||
        (locList.length > 0 && locList.some(l => l.is_carton || (l.storage_location && l.storage_location.includes('Carton'))))
      );

      const cartonBadge = hasCartonStorage ? ` <span style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; border-radius:999px; padding:1px 6px; font-size:9.5px; font-weight:800; margin-left:3px;" title="Big Carton Bulk Storage">📦 Carton</span>` : '';

      const locBadge = isMapped && floor !== ''
        ? `<span class="badge-loc mapped" title="Shelf locations: ${escapeHtml(allLocsTooltip)}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${escapeHtml(floor)}-${escapeHtml(row)}-${escapeHtml(shelf)}-${escapeHtml(level)}${cartonBadge}${extraLocCount > 0 ? ` <span style="background:#0284c7; color:#ffffff; border-radius:999px; padding:1px 6px; font-size:9.5px; font-weight:700; margin-left:3px;" title="${escapeHtml(allLocsTooltip)}">+${extraLocCount} loc</span>` : ''}</span>`
        : `<span class="badge-loc unmapped">Unassigned</span>`;

      const statusBadge = isMapped 
        ? `<span class="badge-status mapped">Mapped</span>` 
        : `<span class="badge-status unmapped">Unmapped</span>`;

      const deptCategory = p.department || p.category || p.subcategory || 'General';

      tr.innerHTML = `
        <td style="color:#64748b; font-size:11.5px; font-weight:500;">${startIdx + idx + 1}</td>
        <td>
          <div style="font-weight:700; color:#0f172a; font-size:13px; line-height:1.25;">${escapeHtml(p.product_name || p.name || '—')}</div>
          <div style="font-size:10.5px; color:#94a3b8; margin-top:1px;">ID: #${p.id || p.stock_no || idx}${locList.length > 1 ? ` • <span style="color:#0284c7; font-weight:600;">${locList.length} locations</span>` : ''}</div>
        </td>
        <td>
          <span class="badge-mono">${escapeHtml(p.stock_no || p.stock_code || '—')}</span>
        </td>
        <td>
          <span class="badge-mono" style="color:#64748b;">${escapeHtml(p.barcode || '—')}</span>
        </td>
        <td>
          <span style="font-size:11.5px; color:#475569; background:#f1f5f9; padding:2px 7px; border-radius:5px; font-weight:500; display:inline-block;">${escapeHtml(deptCategory)}</span>
        </td>
        <td>${locBadge}</td>
        <td>
          <span class="badge-qty">${p.qty !== undefined ? p.qty : 0}</span>
        </td>
        <td>${statusBadge}</td>
        <td style="text-align:center;">
          ${isMapped ? `
            <button type="button" class="btn-table-reset" onclick="resetPortalProductLocation('${escapeHtml(String(itemKey)).replace(/'/g, "\\'")}', '${escapeHtml(p.product_name || p.name || '').replace(/'/g, "\\'")}')" title="Remove shelf location and mark as Unmapped">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>Reset</span>
            </button>
          ` : `<span style="color:#cbd5e1; font-size:11.5px;">—</span>`}
        </td>
        <td style="text-align:right;">
          <button type="button" class="btn-table-edit" onclick="openPortalEditProduct('${escapeHtml(String(itemKey)).replace(/'/g, "\\'")}')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span>Edit</span>
          </button>
        </td>
      `;
      tableBody.appendChild(tr);

      // Append Card for Mobile Screen Layout
      if (mobileCardsList) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'portal-mobile-card';
        cardDiv.innerHTML = `
          <div class="pmc-header">
            <div>
              <div class="pmc-title">${escapeHtml(p.product_name || p.name || '—')}</div>
              <div class="pmc-meta">#${startIdx + idx + 1} • Stock No: <span style="font-family:monospace; font-weight:700; color:#0f172a;">${escapeHtml(p.stock_no || p.stock_code || '—')}</span></div>
            </div>
            ${statusBadge}
          </div>
          <div class="pmc-body">
            <div class="pmc-row">
              <span class="pmc-label">Barcode:</span>
              <span class="pmc-val mono">${escapeHtml(p.barcode || '—')}</span>
            </div>
            <div class="pmc-row">
              <span class="pmc-label">Department:</span>
              <span class="pmc-val" style="background:#f1f5f9; padding:2px 8px; border-radius:6px; font-size:11px;">${escapeHtml(deptCategory)}</span>
            </div>
            <div class="pmc-row" style="margin-top:2px;">
              <span class="pmc-label">Shelf Location:</span>
              <span class="pmc-val">${locBadge}</span>
            </div>
            <div class="pmc-row">
              <span class="pmc-label">On-Hand Qty:</span>
              <span class="pmc-val" style="font-size:13px; color:#0284c7;">${p.qty !== undefined ? p.qty : 0} units</span>
            </div>
          </div>
          <div class="pmc-actions">
            ${isMapped ? `
              <button type="button" class="btn-mobile-reset" onclick="resetPortalProductLocation('${escapeHtml(String(itemKey)).replace(/'/g, "\\'")}', '${escapeHtml(p.product_name || p.name || '').replace(/'/g, "\\'")}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                <span>Reset Loc</span>
              </button>
            ` : ''}
            <button type="button" class="btn-mobile-edit" onclick="openPortalEditProduct('${escapeHtml(String(itemKey)).replace(/'/g, "\\'")}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Edit Details</span>
            </button>
          </div>
        `;
        mobileCardsList.appendChild(cardDiv);
      }
    });
  } catch (err) {
    if (err.name !== 'AbortError') {
      tableBody.innerHTML = `<tr><td colspan="9" style="padding:24px; text-align:center; color:#e11d48;">Network error: ${escapeHtml(err.message)}</td></tr>`;
    }
  }
}

const portalSearchInput = document.getElementById('portalTableSearch');
if (portalSearchInput) {
  portalSearchInput.addEventListener('input', () => {
    clearTimeout(portalDebounceTimer);
    portalDebounceTimer = setTimeout(() => {
      portalCurrentPage = 1;
      renderPortalDataTable();
    }, 160);
  });
}

const portalStatusFilter = document.getElementById('portalStatusFilter');
if (portalStatusFilter) {
  portalStatusFilter.addEventListener('change', () => {
    portalCurrentPage = 1;
    renderPortalDataTable();
  });
}

const portalFloorFilter = document.getElementById('portalFloorFilter');
if (portalFloorFilter) {
  portalFloorFilter.addEventListener('change', () => {
    portalCurrentPage = 1;
    renderPortalDataTable();
  });
}

const portalPrevBtn = document.getElementById('portalPrevPageBtn');
if (portalPrevBtn) {
  portalPrevBtn.addEventListener('click', () => {
    if (portalCurrentPage > 1) {
      portalCurrentPage--;
      renderPortalDataTable();
    }
  });
}

const portalNextBtn = document.getElementById('portalNextPageBtn');
if (portalNextBtn) {
  portalNextBtn.addEventListener('click', () => {
    portalCurrentPage++;
    renderPortalDataTable();
  });
}

const saExportBtn = document.getElementById('saExportBtn');
if (saExportBtn) {
  saExportBtn.addEventListener('click', exportWarehouseDataToExcel);
}

const saImportBtn = document.getElementById('saImportBtn');
const saImportFile = document.getElementById('saImportFile');
const saMigrateInventoryBtn = document.getElementById('saMigrateInventoryBtn');
if (saMigrateInventoryBtn) {
  saMigrateInventoryBtn.addEventListener('click', async () => {
    const confirmed = window.confirm('Initialize inventory from the existing product quantities? This should normally be done once after applying the database schema.');
    if (!confirmed) return;
    saMigrateInventoryBtn.disabled = true;
    try {
      const response = await authFetch('/api/inventory/migrate-legacy', { method: 'POST' });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Inventory migration failed.');
      showToast(`Inventory initialized: ${data.migration?.lotsCreated || 0} opening lots created.`);
      portalStatsCached = null;
      await fetchPortalKPIs(true);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      saMigrateInventoryBtn.disabled = false;
    }
  });
}

function formatOperationTime(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : 'Just now';
}

function setSuperadminView(view) {
  const isOperations = view === 'operations';
  const isNotifications = view === 'notifications';
  const isSystemStock = view === 'system-stock';
  try { localStorage.setItem('wh_superadmin_view', view); } catch (err) { /* storage is optional */ }
  const operations = document.getElementById('saOperationsPanel');
  const notifications = document.getElementById('saNotificationsPanel');
  const systemStock = document.getElementById('saSystemStockPanel');
  const kpis = document.getElementById('portalMasterKpis');
  const table = document.getElementById('portalMasterTable');
  const main = document.querySelector('.portal-main');
  if (operations) operations.style.display = isOperations ? 'flex' : 'none';
  if (notifications) notifications.style.display = isNotifications ? 'flex' : 'none';
  if (systemStock) systemStock.style.display = isSystemStock ? 'flex' : 'none';
  if (kpis) kpis.style.display = isOperations || isNotifications || isSystemStock ? 'none' : 'grid';
  if (table) table.style.display = isOperations || isNotifications || isSystemStock ? 'none' : 'block';
  if (main) {
    main.classList.toggle('operations-active', isOperations || isNotifications || isSystemStock);
    main.classList.toggle('notifications-active', isNotifications);
  }
  document.querySelectorAll('.portal-nav-item').forEach(button => button.classList.remove('active'));
  document.getElementById(isOperations ? 'saNavOperationsBtn' : (isNotifications ? 'saNavNotificationsBtn' : (isSystemStock ? 'saNavSystemStockBtn' : 'saNavMasterBtn')))?.classList.add('active');
  const title = document.querySelector('.portal-header-title');
  const subtitle = document.querySelector('.portal-header-sub');
  if (title) title.textContent = isOperations ? 'Warehouse Operations' : (isNotifications ? 'Notifications' : (isSystemStock ? 'System Stock Updates' : 'Master Inventory'));
  if (subtitle) subtitle.textContent = isOperations ? 'Live exceptions, count approvals, stock activity, and staff access.' : (isNotifications ? 'Live updates from warehouse product-location activity.' : (isSystemStock ? 'Latest external system on-hand timestamps by product.' : 'Live warehouse catalog, storage coordinates, mapping health, and SKU stock tracking'));
}

const systemStockViewState = { page: 1, query: '' };

function stockFreshness(updatedAt) {
  const timestamp = updatedAt ? new Date(updatedAt).getTime() : NaN;
  if (!Number.isFinite(timestamp)) return { label: 'Not received', state: 'missing' };
  const age = Date.now() - timestamp;
  if (age > 72 * 60 * 60 * 1000) return { label: 'More than 72 hours old', state: 'stale' };
  if (age > 24 * 60 * 60 * 1000) return { label: 'More than 24 hours old', state: 'delayed' };
  return { label: 'Fresh (within 24 hours)', state: 'fresh' };
}

async function renderSuperadminSystemStock(page = systemStockViewState.page) {
  systemStockViewState.page = Math.max(1, Number(page) || 1);
  setSuperadminView('system-stock');
  const rows = document.getElementById('saSystemStockRows');
  const pagination = document.getElementById('saSystemStockPagination');
  if (!rows || !pagination) return;
  rows.innerHTML = '<tr><td colspan="4">Loading system stock timestamps…</td></tr>';
  try {
    const params = new URLSearchParams({ page: String(systemStockViewState.page), limit: '100' });
    if (systemStockViewState.query) params.set('search', systemStockViewState.query);
    const response = await authFetch(`/api/admin/system-stock-updates?${params.toString()}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Could not load system stock timestamps.');
    const products = Array.isArray(data.products) ? data.products : [];
    rows.innerHTML = products.length ? products.map(product => {
      const updated = product.system_on_hand_updated_at ? new Date(product.system_on_hand_updated_at) : null;
      const updatedText = updated && !Number.isNaN(updated.getTime()) ? updated.toLocaleString() : 'Not received yet';
      const freshness = stockFreshness(product.system_on_hand_updated_at);
      const productName = product.product_name || product.name || 'Unnamed product';
      const code = [product.barcode, product.stock_no || product.stock_code].filter(Boolean).join(' · ') || '—';
      return `<tr><td><strong>${escapeHtml(productName)}</strong></td><td>${escapeHtml(code)}</td><td>${Number(product.qty || 0).toLocaleString()}</td><td>${escapeHtml(updatedText)}<span class="sa-stock-age ${freshness.state}">${freshness.label}</span></td></tr>`;
    }).join('') : '<tr><td colspan="4">No products match this search.</td></tr>';
    const totalPages = Math.max(1, Math.ceil(Number(data.total || 0) / Number(data.limit || 100)));
    pagination.innerHTML = `<span>${Number(data.total || 0).toLocaleString()} products</span><div><button type="button" class="portal-btn-secondary" data-system-stock-page="${systemStockViewState.page - 1}" ${systemStockViewState.page <= 1 ? 'disabled' : ''}>Previous</button><span>Page ${systemStockViewState.page} of ${totalPages}</span><button type="button" class="portal-btn-secondary" data-system-stock-page="${systemStockViewState.page + 1}" ${systemStockViewState.page >= totalPages ? 'disabled' : ''}>Next</button></div>`;
  } catch (err) {
    rows.innerHTML = `<tr><td colspan="4">${escapeHtml(err.message || 'Could not load system stock timestamps.')}</td></tr>`;
    pagination.innerHTML = '';
  }
}

function renderSuperadminNotifications() {
  setSuperadminView('notifications');
  portalNotifications.forEach(item => { item.read = true; });
  savePortalNotifications();
  updatePortalNotificationBadge();
  const list = document.getElementById('saNotificationsList');
  if (!list) return;
  const filter = document.getElementById('saNotificationFilter')?.value || 'ALL';
  const matchingActions = {
    PRODUCT: ['PRODUCT_ADDED'],
    LOCATION: ['LOCATION_ADDED', 'LOCATION_DELETED', 'LOCATION_MODIFIED', 'LOCATION_TRANSFER'],
    QUANTITY: ['QUANTITY_MODIFIED'],
    RECEIVING: ['RECEIVING'],
    BIG_ITEMS: ['BIG_ITEMS_ADDED'],
    DELIVERY: ['DIRECT_DELIVERY']
  };
  const visible = filter === 'ALL' ? portalNotifications : portalNotifications.filter(item => (matchingActions[filter] || []).includes(item.action));
  list.innerHTML = visible.length ? visible.map(item => `<article class="sa-notification-item"><div class="sa-notification-icon">${item.action === 'PRODUCT_ADDED' ? '➕' : item.action === 'DIRECT_DELIVERY' ? '🚚' : item.action === 'RECEIVING' ? '📥' : item.action === 'QUANTITY_MODIFIED' ? '🔢' : item.action === 'LOCATION_DELETED' ? '🗑️' : item.action === 'BIG_ITEMS_ADDED' ? '📦' : '📍'}</div><div class="sa-notification-content"><strong>${escapeHtml(item.title || `Location saved: ${item.product}`)}</strong><p>${escapeHtml(item.detail || item.location || 'Location updated')} · ${escapeHtml(item.actor || 'Warehouse staff')}</p><div class="sa-notification-time">${formatOperationTime(item.time)}</div></div></article>`).join('') : '<div class="sa-notifications-empty">No notifications match this filter.</div>';
}

document.getElementById('saNotificationFilter')?.addEventListener('change', renderSuperadminNotifications);

let systemStockSearchTimer = null;
document.getElementById('saSystemStockSearch')?.addEventListener('input', event => {
  clearTimeout(systemStockSearchTimer);
  systemStockSearchTimer = setTimeout(() => {
    systemStockViewState.query = event.target.value.trim();
    void renderSuperadminSystemStock(1);
  }, 180);
});

document.getElementById('saSystemStockPagination')?.addEventListener('click', event => {
  const button = event.target.closest('[data-system-stock-page]');
  if (!button || button.disabled) return;
  void renderSuperadminSystemStock(Number(button.dataset.systemStockPage));
});

async function renderSuperadminOperations() {
  setSuperadminView('operations');
  const exceptionsEl = document.getElementById('saOperationsExceptions');
  const pendingEl = document.getElementById('saPendingAdjustments');
  const movementsEl = document.getElementById('saRecentMovements');
  const usersEl = document.getElementById('saOperationsUsers');
  const dailyEl = document.getElementById('saDailySummary');
  const reconciliationEl = document.getElementById('saReconciliationList');
  try {
    const response = await authFetch('/api/admin/inventory/operations?limit=100', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Could not load operations.');
    const operations = data.operations || {};
    const pending = operations.pendingAdjustments || [];
    const receiving = operations.receivingAlerts || [];
    const health = data.stockHealth || {};
    const reconciliation = data.reconciliation || [];
    const unmapped = Number(data.stats?.unmappedCount || 0);
    if (exceptionsEl) exceptionsEl.innerHTML = `<div class="sa-exception alert"><b>${pending.length.toLocaleString()}</b><span>Physical counts awaiting approval</span></div><div class="sa-exception warn"><b>${Number(health.stale || 0).toLocaleString()}</b><span>System stock updates older than 72 hours</span></div><div class="sa-exception warn"><b>${Number(health.delayed || 0).toLocaleString()}</b><span>System stock updates older than 24 hours</span></div><div class="sa-exception info"><b>${reconciliation.length.toLocaleString()}</b><span>Physical stock above system on-hand</span></div><div class="sa-exception info"><b>${unmapped.toLocaleString()}</b><span>Products still needing a shelf location</span></div>`;
    const daily = operations.daily || {};
    if (dailyEl) dailyEl.innerHTML = `<div class="sa-daily-summary"><div><b>${Number(daily.total || 0).toLocaleString()}</b><span>Activities today</span></div><div><b>${Number(daily.received || 0).toLocaleString()}</b><span>Units received</span></div><div><b>${Number(daily.delivered || 0).toLocaleString()}</b><span>Units delivered</span></div><div><b>${Number(daily.adjustments || 0).toLocaleString()}</b><span>Count corrections</span></div></div>`;
    if (reconciliationEl) reconciliationEl.innerHTML = reconciliation.length ? reconciliation.slice(0, 8).map(item => `<div class="sa-operation-row"><div class="sa-operation-main"><strong>${escapeHtml(item.product_name || item.sku_key || 'Product')} · +${Number(item.excess_qty || 0).toLocaleString()} units</strong><div class="sa-operation-meta">System: ${Number(item.catalog_qty || 0).toLocaleString()} · Physical: ${Number(item.physical_qty || 0).toLocaleString()}</div></div></div>`).join('') : '<div class="sa-list-empty">No physical stock is above the current system on-hand.</div>';
    document.getElementById('saPendingCountBadge').textContent = pending.length.toLocaleString();
    if (pendingEl) pendingEl.innerHTML = pending.length ? pending.map(item => `<div class="sa-operation-row"><div class="sa-operation-main"><strong>${escapeHtml(item.sku_key || 'Product')} · ${Number(item.system_qty || 0)} → ${Number(item.counted_qty || 0)}</strong><div class="sa-operation-meta">${escapeHtml(item.reason || 'Physical count')} · ${escapeHtml(item.submitted_by || 'Staff')} · ${formatOperationTime(item.created_at)}</div></div><button class="sa-small-btn" data-adjustment-action="approve" data-adjustment-id="${item.id}">Approve</button><button class="sa-small-btn danger" data-adjustment-action="reject" data-adjustment-id="${item.id}">Reject</button></div>`).join('') : '<div class="sa-list-empty">No count approvals waiting.</div>';
    const movements = operations.movements || [];
    if (movementsEl) movementsEl.innerHTML = movements.length ? movements.slice(0, 12).map(item => `<div class="sa-operation-row"><div class="sa-operation-main"><strong>${escapeHtml(item.movement_type || 'STOCK')} · ${Number(item.qty || 0).toLocaleString()} units · ${escapeHtml(item.sku_key || '')}</strong><div class="sa-operation-meta">${escapeHtml(item.actor_name || 'System')} · ${escapeHtml(item.reason || item.reference_type || 'Stock movement')} · ${formatOperationTime(item.created_at)}</div></div></div>`).join('') : '<div class="sa-list-empty">No stock activity yet.</div>';
    const users = data.users || [];
    if (usersEl) usersEl.innerHTML = users.length ? users.map(user => `<div class="sa-operation-row"><div class="sa-operation-main"><strong>${escapeHtml(user.full_name || user.username)}</strong><div class="sa-operation-meta">@${escapeHtml(user.username || '')}</div></div><select class="sa-role-select" data-user-role-id="${user.id}" aria-label="Role for ${escapeHtml(user.username || 'user')}"><option value="stockman" ${user.role === 'stockman' ? 'selected' : ''}>Stockman</option><option value="checker" ${user.role === 'checker' ? 'selected' : ''}>Checker</option><option value="carton_handler" ${user.role === 'carton_handler' ? 'selected' : ''}>Big Items</option><option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option></select></div>`).join('') : '<div class="sa-list-empty">No staff accounts found.</div>';
  } catch (err) {
    const message = escapeHtml(err.message || 'Could not load operations.');
    if (exceptionsEl) exceptionsEl.innerHTML = `<div class="sa-list-empty">${message}</div>`;
    if (pendingEl) pendingEl.innerHTML = `<div class="sa-list-empty">${message}</div>`;
  }
}

document.getElementById('saOperationsRefreshBtn')?.addEventListener('click', renderSuperadminOperations);
document.getElementById('saPendingAdjustments')?.addEventListener('click', async event => {
  const button = event.target.closest('[data-adjustment-action]');
  if (!button) return;
  const action = button.dataset.adjustmentAction;
  button.disabled = true;
  try {
    const response = await authFetch(`/api/inventory/adjustments/${encodeURIComponent(button.dataset.adjustmentId)}/${action}`, { method: 'POST' });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || `Could not ${action} count.`);
    showToast(`Count ${action}d.`);
    await renderSuperadminOperations();
  } catch (err) {
    showToast(err.message, 'error');
    button.disabled = false;
  }
});
document.getElementById('saOperationsUsers')?.addEventListener('change', async event => {
  const select = event.target.closest('[data-user-role-id]');
  if (!select) return;
  select.disabled = true;
  try {
    const response = await authFetch(`/api/users/${encodeURIComponent(select.dataset.userRoleId)}/role`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: select.value }) });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Could not change role.');
    showToast('Staff permission updated.');
  } catch (err) {
    showToast(err.message, 'error');
    await renderSuperadminOperations();
  } finally { select.disabled = false; }
});
if (saImportBtn && saImportFile) {
  saImportBtn.addEventListener('click', () => {
    saImportFile.click();
  });

  saImportFile.addEventListener('change', async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    saImportBtn.innerHTML = `<span data-i18n="importingBtn">${TRANSLATIONS[CURRENT_LANG].importingBtn || 'Importing...'}</span>`;
    saImportBtn.disabled = true;

    try {
      const res = await authFetch('/api/upload-excel', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Import successful!');
        renderPortalDataTable();
      } else {
        showToast(data.message || 'Import failed.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading file.', true);
    } finally {
      saImportFile.value = '';
      saImportBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><span data-i18n="importDataBtn">${TRANSLATIONS[CURRENT_LANG].importDataBtn || 'Import Data'}</span>`;
      saImportBtn.disabled = false;
    }
  });
}

const handleSuperAdminLogout = () => {
  currentUser = null;
  localStorage.removeItem('wh_current_user');
  localStorage.removeItem('wh_token');
  window.forceUserAppMode = false;
  updateUserUI();
  showToast('Super Admin Logged Out.');
};

const saLogoutBtn = document.getElementById('saLogoutBtn');
if (saLogoutBtn) {
  saLogoutBtn.addEventListener('click', handleSuperAdminLogout);
}

const saMobileLogoutBtn = document.getElementById('saMobileLogoutBtn');
if (saMobileLogoutBtn) {
  saMobileLogoutBtn.addEventListener('click', handleSuperAdminLogout);
}

const saSwitchAppBtn = document.getElementById('saSwitchAppBtn');
if (saSwitchAppBtn) {
  saSwitchAppBtn.addEventListener('click', () => {
    window.forceUserAppMode = !window.forceUserAppMode;
    updateUserUI();
    if (window.forceUserAppMode) {
      showToast('Switched to Standard Search Mode. (Click Search Mode again to return to Portal)', 'info');
    }
  });
}

const saNavMasterBtn = document.getElementById('saNavMasterBtn');
if (saNavMasterBtn) {
  saNavMasterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setSuperadminView('master');
    renderPortalDataTable();
    showToast('Viewing Master Inventory Database.');
  });
}

const saNavSystemStockBtn = document.getElementById('saNavSystemStockBtn');
if (saNavSystemStockBtn) {
  saNavSystemStockBtn.addEventListener('click', event => {
    event.preventDefault();
    void renderSuperadminSystemStock(1);
  });
}

const saNavOperationsBtn = document.getElementById('saNavOperationsBtn');
if (saNavOperationsBtn) {
  saNavOperationsBtn.addEventListener('click', event => {
    event.preventDefault();
    void renderSuperadminOperations();
  });
}

const saNavNotificationsBtn = document.getElementById('saNavNotificationsBtn');
if (saNavNotificationsBtn) {
  saNavNotificationsBtn.addEventListener('click', event => {
    event.preventDefault();
    renderSuperadminNotifications();
  });
}

document.getElementById('saClearNotificationsBtn')?.addEventListener('click', () => {
  portalNotifications = [];
  savePortalNotifications();
  updatePortalNotificationBadge();
  renderSuperadminNotifications();
});

const saNavCartonBtn = document.getElementById('saNavCartonBtn');
if (saNavCartonBtn) {
  saNavCartonBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (cartonStockNoInput) cartonStockNoInput.value = '';
    if (cartonMatchBox) cartonMatchBox.style.display = 'none';
    if (cartonNoMatchBox) cartonNoMatchBox.style.display = 'none';
    matchedCartonProduct = null;
    if (cartonOverlay) cartonOverlay.classList.add('show');
  });
}

const saNavOrdersBtn = document.getElementById('saNavOrdersBtn');
if (saNavOrdersBtn) {
  saNavOrdersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openOrdersModal();
  });
}

const saNavAddProductBtn = document.getElementById('saNavAddProductBtn');
if (saNavAddProductBtn) {
  saNavAddProductBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openAddForm();
  });
}


window.openPortalEditProduct = function(productId) {
  let p = (window.portalProductsMap && window.portalProductsMap[productId]);
  if (!p) {
    const cleanId = String(productId).replace(/^(stock_|bar_|idx_)/, '');
    p = PRODUCTS.find(item => String(item.id) === cleanId || String(item.stock_no || '').toLowerCase() === cleanId.toLowerCase() || String(item.barcode || '').toLowerCase() === cleanId.toLowerCase() || String(item.barcode_2 || '').toLowerCase() === cleanId.toLowerCase());
  }
  if (p) {
    activeProduct = p;
    openEditForm();
  } else {
    fetch(`/api/products/lookup/${encodeURIComponent(productId)}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.product) {
          activeProduct = res.product;
          openEditForm();
        } else {
          showToast('Could not load product location details.', 'error');
        }
      })
      .catch(err => {
        showToast('Error loading product: ' + err.message, 'error');
      });
  }
};

window.resetPortalProductLocation = async function(productId, productName) {
  if (!confirm(`Are you sure you want to remove the location for "${productName || 'this item'}"?\n\nThis will clear Floor, Row, Shelf, and Level and mark the product as UNMAPPED.`)) {
    return;
  }

  showToast(`Removing location for "${productName || 'item'}"...`);

  try {
    const res = await fetch(`/api/products/${encodeURIComponent(productId)}/reset-location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json());

    if (res.success) {
      if (window.portalProductsMap && window.portalProductsMap[productId]) {
        window.portalProductsMap[productId].floor = '';
        window.portalProductsMap[productId].row = '';
        window.portalProductsMap[productId].batch = '';
        window.portalProductsMap[productId].shelf = '';
        window.portalProductsMap[productId].level = '0';
        window.portalProductsMap[productId].loc = '';
        window.portalProductsMap[productId].status = 'UNMAPPED';
        window.portalProductsMap[productId].locations = [];
      }
      let pIdx = -1;
      if (res.product && res.product.id) {
        pIdx = PRODUCTS.findIndex(p => String(p.id) === String(res.product.id));
      }
      if (pIdx === -1) {
        pIdx = PRODUCTS.findIndex(p => {
          const pKey = p.id || (p.stock_no ? 'stock_' + p.stock_no : (p.barcode ? 'bar_' + p.barcode : null));
          return String(p.id) === String(productId) || String(pKey) === String(productId);
        });
      }
      if (pIdx !== -1) {
        PRODUCTS[pIdx].floor = '';
        PRODUCTS[pIdx].row = '';
        PRODUCTS[pIdx].batch = '';
        PRODUCTS[pIdx].shelf = '';
        PRODUCTS[pIdx].level = '0';
        PRODUCTS[pIdx].loc = '';
        PRODUCTS[pIdx].status = 'UNMAPPED';
        PRODUCTS[pIdx].locations = [];
      }
      rebuildIndex();
      renderPortalDataTable({ refreshStats: true });
      showToast(`Location cleared for "${productName || 'Item'}". Marked as Unmapped!`, 'success');
    } else {
      showToast('Error resetting location: ' + (res.error || res.message || 'Unknown error'), 'error');
    }
  } catch (err) {
    showToast('Failed to reset location: ' + err.message, 'error');
  }
};

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
