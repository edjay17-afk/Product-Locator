# 🚶‍♂️ Walkthrough: Rapid Logger Overlays & Dual-Scanning Layout

I have fixed the camera scanner overlap z-index and optimized the **Rapid Location Logger** to offer a smart dual-scanning layout (for both product barcodes and location QR codes) while supporting both existing and new products.

---

## 🛠️ Summary of Work

### 1. Z-Index Overlap Fix
* **Overlay Layering (`styles.css`):** Increased `#scannerOverlay`'s `z-index` to `100` (which is higher than the modals' `z-index: 60`).
* **The Impact:** Scanning from any input field inside the Rapid Location Logger modal now correctly overlays the scanner viewport on top of the active modal rather than rendering behind it.

### 2. Dual Scanner Support in Rapid Logger
* **Two Camera Triggers (`index.html` & `app.js`):**
  * **Product Barcode Scanner:** Added back the "Scan Barcode" button (`#scanForRapidBarcodeBtn`) next to the barcode field (uses a 260x150 rectangle capture size).
  * **Location QR Scanner:** Kept the "Scan QR" button (`#scanForRapidLocBtn`) next to the coordinates field (uses a 250x250 square capture size).

### 3. Dynamic Field Toggling based on Barcode
* **Minimal View (Existing Product):** If the scanned or typed barcode exists in the database, only the Barcode field, Location QR field, and Quantity field are displayed.
* **Expanded View (New Product):** If the barcode does not exist, the logger dynamically expands to show additional text fields to register the new item's details:
  1. Product Name
  2. Item / Stock Code
  3. Category
  4. Subcategory
  5. **Manual Coordinates Option:** Floor dropdown, Row input, Shelf input, and Level input.

### 4. Interactive Coordinates Synchronization
* **Two-Way Binding (`app.js`):**
  * Scanning a Location QR code (e.g. `1-02-01-03`) automatically splits and populates the manual coordinates inputs (Floor: 1st, Row: 02, Shelf: 01, Level: 03).
  * Manually typing coordinates in the Floor/Row/Shelf/Level fields dynamically updates the main Location text field.

---

## 🔍 Verification Details

1. **Verify Camera Overlap:**
   * Open the **Rapid Logger** (signed in as stockman).
   * Click **Scan QR** next to the location field. The camera scanner overlay now correctly renders on top of the modal.
2. **Verify Dynamic Fields:**
   * Enter an existing barcode (e.g. `100002109790`). The modal remains minimal, matching "Wedding card".
   * Clear it and enter a new barcode. The modal expands, prompting for name, stock code, category, and manual coordinate dropdowns.
3. **Verify Coordinates Sync:**
   * In expanded mode, change the shelf number to `15` and level to `02`. Observe the main Location text field updates to `1-02-15-02` in real-time.
