let PRODUCTS = [];
let byBarcode = {};
let byStock = {};
let recent = [];
try {
  const saved = localStorage.getItem('wh_recent_lookups');
  if (saved) recent = JSON.parse(saved);
} catch (e) { recent = []; }

let activeProduct = null;

// Initialize app data from server database API
async function initApp() {
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
    }
  } catch (err) {
    console.warn('Network or API unavailable, operating in offline fallback mode if cached data exists.', err);
    document.getElementById('skuStamp').textContent = `Offline mode`;
  }
  renderRecent();

  // Restore active scanned product card across page refreshes
  try {
    const savedActive = localStorage.getItem('wh_active_product');
    if (savedActive) {
      const activeP = JSON.parse(savedActive);
      if (activeP) renderProduct(activeP);
    }
  } catch (e) {}
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

  if (navigator.vibrate) navigator.vibrate(60);

  // push to persistent recent lookups
  recent = recent.filter(r => (r.id ? r.id !== p.id : (r.barcode || r.b) !== (p.barcode || p.b)));
  recent.unshift(p);
  recent = recent.slice(0, 20); // Store up to 20 recent items
  try {
    localStorage.setItem('wh_recent_lookups', JSON.stringify(recent));
    localStorage.setItem('wh_active_product', JSON.stringify(p));
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

async function doSearch(q) {
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
document.getElementById('searchInput').addEventListener('input', e => doSearch(e.target.value));
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch(e.target.value);
});

document.getElementById('clearRecent').addEventListener('click', () => {
  recent = [];
  activeProduct = null;
  try {
    localStorage.removeItem('wh_recent_lookups');
    localStorage.removeItem('wh_active_product');
  } catch (e) {}
  document.getElementById('tagCard').classList.remove('show');
  document.getElementById('emptyState').style.display = 'flex';
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
    doSearch(code);
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
  document.getElementById('fCategory').value = '';
  document.getElementById('fSubcategory').value = '';
  document.getElementById('fFloor').value = '1';
  document.getElementById('fRow').value = '';
  document.getElementById('fShelf').value = '';
  document.getElementById('fLevel').value = '';
  document.getElementById('fQty').value = '';
  formError.classList.remove('show');
  addOverlay.classList.add('show');
  hideResults();
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

  if (!name || !row || !shelf) {
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
    status: 'DONE'
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

  editFormError.classList.remove('show');
  editOverlay.classList.add('show');
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

  if (!name || !row || !shelf) {
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
    qty: qtyRaw === '' ? 0 : parseInt(qtyRaw, 10)
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

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
