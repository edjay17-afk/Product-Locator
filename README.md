# Warehouse Product Locator App (v2.0)

A fast, responsive, mobile-friendly web application for store staff and customers to quickly locate items on store shelves by barcode, stock code, or product name. Built with **Node.js**, **Express**, and **SQLite**.

---

## 🌟 Key Features

1. **SQLite Database Integration**
   - Automatically initializes and seeds all **940 initial store SKUs** into a local SQLite database (`db/product_locator.db`).
   - Supports full CRUD operations (Create, Read, Update, Delete) via Express REST API.
   - WAL (Write-Ahead Logging) mode enabled for high performance and concurrent access.

2. **Clean & Punchhole-Free Tag Card UI**
   - Signature location tag card redesigned without punchhole dots for a sleek, clean, modern presentation.
   - Displays Floor, Row, Shelf, and Level prominently.

3. **Live Search & Barcode Camera Scanner**
   - Real-time search by barcode number, stock code, item name, or category.
   - Built-in camera barcode scanner supporting UPC, EAN, CODE128, and QR codes.

4. **Product Editing & Management**
   - Staff can add new products directly into the database.
   - Staff can edit shelf location or stock quantity for any existing item.

5. **Deployment Ready**
   - Pre-configured with Docker (`Dockerfile` & `docker-compose.yml`) for instant cloud deployment to Render, Railway, Fly.io, DigitalOcean, or any VPS.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Setup

1. **Clone / Navigate to project folder:**
   ```bash
   cd "product-locator v2"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3002](http://localhost:3002)

---

## 🐳 Deploying with Docker

You can deploy using Docker or Docker Compose:

```bash
docker-compose up -d --build
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/stats` | `GET` | Get total SKU counts & custom item stats |
| `GET /api/products?q=query` | `GET` | Search products by name, barcode, or stock code |
| `GET /api/products/all` | `GET` | Fetch all products from database |
| `GET /api/products/:id` | `GET` | Get a specific product by ID |
| `POST /api/products` | `POST` | Add a new product to the database |
| `PUT /api/products/:id` | `PUT` | Update product details / shelf location |
| `DELETE /api/products/:id` | `DELETE` | Delete a product from the database |

---

## 📂 Project Structure

```
product-locator v2/
├── db/
│   ├── database.js          # SQLite database schema & query helpers
│   └── product_locator.db   # SQLite database file (Auto-created)
├── public/
│   ├── css/
│   │   └── styles.css       # Clean styling (punchholes removed)
│   ├── js/
│   │   └── app.js           # Frontend logic & API calls
│   └── index.html           # Main UI template
├── seed-data.json           # Initial 940 SKUs dataset
├── .env                     # Environment variables
├── Dockerfile               # Production Docker container setup
├── docker-compose.yml       # Docker Compose setup
├── package.json             # NPM dependencies & scripts
└── server.js                # Express backend server
```
