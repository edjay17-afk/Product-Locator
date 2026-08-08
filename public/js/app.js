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

  if (currentUser) {
    userBadge.style.display = 'flex';
    userNameDisplay.textContent = currentUser.full_name;
    authBtn.textContent = 'Logout';
    authBtn.className = 'user-auth-btn logout';
    closeLoginModal.style.display = 'block';
    loginOverlay.classList.remove('show');
  } else {
    userBadge.style.display = 'none';
    closeLoginModal.style.display = 'none';
    document.getElementById('loginFormError').style.display = 'none';
    loginOverlay.classList.add('show');
  }
}

let activeProduct = null;

// Initialize app data from server database API
async function initApp() {
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

function renderProduct(p) {
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

  const floor = p.floor !== undefined && p.floor !== null ? String(p.floor) : '';
  const batch = p.batch !== undefined && p.batch !== null ? String(p.batch) : (p.row || '');
  const shelf = p.shelf !== undefined && p.shelf !== null ? String(p.shelf) : '';
  const level = p.level !== undefined && p.level !== null ? String(p.level) : '';

  const hasLoc = floor !== '';
  document.getElementById('cFloor').textContent = hasLoc ? floor : '–';
  document.getElementById('cRow').textContent = hasLoc ? batch : '–';
  document.getElementById('cShelf').textContent = hasLoc ? shelf : '–';
  document.getElementById('cLevel').textContent = hasLoc ? level : '–';

  const locFull = p.loc_full || p.locFull || (hasLoc ? `${floor}-${batch}-${shelf}-${level}` : 'Location not yet assigned');
  document.getElementById('pFull').textContent = locFull;

  const st = statusInfo(p.status);
  const badge = document.getElementById('pStatus');
  badge.textContent = st.label;
  badge.className = 'badge ' + st.cls;

  const barcode = p.barcode || p.b;
  const stockCode = p.stock_code || p.s;
  document.getElementById('pBarcode').textContent = barcode || (stockCode ? ('#' + stockCode) : '—');
  document.getElementById('pQty').textContent = (p.qty !== undefined && p.qty !== null ? p.qty : '—');
  document.getElementById('pStockman').textContent = p.last_modified_by || p.modifiedBy || 'System Import';

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
  hintEl.textContent = 'Hold the item barcode steady inside the frame.';

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

  const config = { fps: 12, qrbox: { width: 260, height: 140 } };
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
