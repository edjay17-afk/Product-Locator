# 📋 Implementation Plan: QR Code Location Linker & Multi-Location Cards

This plan outlines the architecture and changes required to support scanning location QR codes and displaying multiple storage slots for a single barcode.

---

## 🎯 Goal Description
In real-life warehousing, products are often spread across multiple shelf slots when their primary locations are full. 

This change introduces:
1. **Multiple Location Cards:** If a product barcode or stock code matches multiple records in the database, the locator displays all storage cards stacked vertically under the product details.
2. **Vacant Location QR Scanner:** Stockmen can scan a shelf QR code (containing coordinates like `1-02-01-03`) to instantly link that new location to the active product barcode (registering it in the system with `qty: 0`).

---

## Proposed Changes

### 1. HTML Layout Upgrades (`public/index.html`)
* Modify the `#tagCard` structure to support a dynamic `#locationsList` container.
* Add a **"Scan QR for New Location"** button (`#scanLocationQrBtn`) to the actions row, styled with a distinct yellow/amber theme to differentiate it from basic search scanning.
* Ensure the button is only shown when a stockman is logged in and viewing a product.

```html
<!-- C:/Users/User/product-locator v2/public/index.html -->
<div id="tagCard" class="tagcard">
  <div class="tagcard-top">
    <p class="pname" id="pName">—</p>
    <div class="pmeta">
      <span id="pCat">—</span>
      <span id="pSub">—</span>
    </div>
  </div>
  
  <!-- Container for all registered location cards -->
  <div id="locationsList"></div>
</div>
```

---

### 2. Frontend Logic (`public/js/app.js`)
* **Multi-Location Search Fetch:**
  * When `doSearch()` or a scan successfully retrieves a match, query the local `PRODUCTS` array to find all entries sharing the same barcode or stock code.
* **Dynamic Location Card Rendering:**
  * Loop through all matching product records.
  * Render each location as a subcard containing its own coordinates grid, quantity, verification status, and dedicated edit button.
* **QR Code Parsing:**
  * Parse QR contents formatted as `floor-row-shelf-level` (e.g. `1-02-01-03`).
* **API Registration Call:**
  * Implement an automatic POST request to `/api/products` when a location QR code is scanned, copying the barcode, name, and category of the active product to the new location coordinates.
* **Scan Target Management:**
  * Introduce a `scanTarget = 'location_qr'` state to route the QR camera handler correctly.

```javascript
// Quick prototype of the QR code handler in app.js
if (scanTarget === 'location_qr') {
  const parsed = parseLocationQR(code);
  if (!parsed) {
    alert("Invalid location QR code format. Expected 'floor-row-shelf-level'.");
    return;
  }
  
  // Register location automatically
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
  
  // POST to backend API
  const res = await fetch('/api/products', { ... });
}
```

---

### 3. Styles Sheet (`public/css/styles.css`)
* Add rules for `.location-subcard` to style the nested cards nicely with clear borders, shadows, and spacing.

```css
.location-subcard {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  background: #f8fafc;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.location-subcard:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
```

---

## Verification Plan

### Manual Verification
1. **Login:** Sign in as a Stockman (Juan Dela Cruz).
2. **Search:** Search for a valid product (e.g. barcode `100000000001`).
3. **Register New Location:** 
   * Click the new **"Scan QR for New Location"** button.
   * Simulate a location scan with value `2-05-12-01` (representing Floor 2, Row 05, Shelf 12, Level 01).
   * Confirm the success toast appears.
4. **Display Check:** Verify that the product details card now displays **both** locations stacked nicely, each with its own coordinates and Edit button.
5. **Quantity Check:** Edit the new location card, update the quantity to `15`, save, and verify only that location card's quantity updates.
