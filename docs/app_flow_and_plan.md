# 📋 Project Report: Warehouse Product Locator App

## 1. Executive Summary
The **Warehouse Product Locator App** is a responsive, web-based tool designed to solve a common warehouse operations challenge: locating items on shelves quickly and accurately. 

The application serves two primary user groups:
* **Warehouse Staff (Stockmen):** Can verify stock quantities, update storage shelves, log new inventory, and take responsibility for item locations.
* **Store Personnel / Customers:** Can instantly search for items using names, barcodes, or catalog codes to find exactly where they are stored on the warehouse floor.

---

## 2. Key Capabilities
* **Instant Search:** Users can look up items in real time. Search results display the exact coordinates (Floor, Row, Shelf, and Level) formatted as a clear shelf tag.
* **Camera Barcode Scanner:** Staff can use their smartphone or tablet camera to scan barcodes directly, eliminating manual typing.
* **Accountability Tracking:** Updates are logged against individual stockman profiles to ensure coordinates remain correct and verified.
* **Bulk Data Import:** Support for uploading warehouse Excel sheets directly from the browser to initialize or update hundreds of SKUs at once.
* **Offline Resiliency:** The app stores lookup history and database stats on the device so it remains functional even if network signals drop temporarily.

---

## 3. Standard User Journeys

### Journey A: Finding a Product
1. The user opens the web application on their phone or tablet.
2. They enter an item name (e.g., "Balloon stick") or scan the barcode.
3. The app instantly searches local data and the server.
4. The location card shows exactly where to go:
   * *Example:* **Floor 1, Row 02, Shelf 01, Level 03**

### Journey B: Modifying a Location (Accountable Staff)
1. A stockman signs in using their quick-profile switcher.
2. They search for the product that needs moving.
3. They tap **"Edit Location / Details"**.
4. They update the floor, row, shelf, or level, and enter the updated quantity on hand.
5. They tap **"Save Changes"**. The system updates the backend database and logs who made the adjustment.

---

## 4. Simplified Technical Architecture

* **Frontend (User Interface):** A single-page application built with modern HTML5, vanilla CSS styling (custom card views), and pure JavaScript. It uses `html5-qrcode` for the camera feed and `SheetJS` for local Excel file reading.
* **Backend (Server):** An Express (Node.js) server. It hosts a protocol multiplexer that automatically supports both secure HTTPS (needed for camera access) and standard HTTP requests on the same port.
* **Database (Storage):** A pluggable design. It is currently configured to connect to **Supabase (PostgreSQL)**, with auto-fallback database drivers for local **SQLite** database files or in-memory arrays when running serverless or offline.

---

## 5. Summary Roadmap
* **Phase 1 (Complete):** Core lookup, camera scanning, and location tagging interface.
* **Phase 2 (Complete):** Stockman quick authentication and batch Excel importing.
* **Phase 3 (Next Steps):** Queue updates locally when completely offline, and visual grid maps to show the shortest path to a shelf.
