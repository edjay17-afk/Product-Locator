# Warehouse Product Locator

A mobile-friendly product locator for warehouse staff and customers. Search by barcode, stock number, product name, category, or department, then view shelf locations, quantities, and stock history.

## Stack

- Node.js and Express API
- Supabase PostgreSQL database
- Vanilla HTML, CSS, and JavaScript frontend
- Barcode and QR scanning for warehouse workflows
- Signed HTTP-only sessions for staff actions

## Local setup

1. Install Node.js 18 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set:

   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose it to the browser)
   - `SESSION_SECRET` (at least 32 random characters)

4. Apply [supabase/schema.sql](supabase/schema.sql) to the database.
5. Start the app:

   ```bash
   npm start
   ```

Open `http://localhost:3002`.

For production search performance, apply the current `supabase/schema.sql` in
the Supabase SQL editor after deploying schema changes. It adds the exact/code
and trigram search indexes plus the lightweight product-stats function used by
the Netlify API.

Run the automated checks with:

```bash
npm test
```

## Data import

Use `npm run seed-supabase` only from a trusted administrative environment. It requires `SUPABASE_SERVICE_ROLE_KEY` and should not be exposed as a public HTTP operation. Staff Excel imports are restricted to admin users and limited to 10 MB.

## API overview

| Endpoint | Method | Access |
| :--- | :--- | :--- |
| `/api/ping` | GET | Public health check |
| `/api/auth/login` | POST | Public login |
| `/api/auth/me` | GET | Current session |
| `/api/auth/logout` | POST | Current session |
| `/api/products?q=query` | GET | Public catalog search |
| `/api/products/:id` | GET | Public product lookup |
| `/api/products` | POST | Staff |
| `/api/products/:id` | PUT | Staff |
| `/api/products/:id` | DELETE | Admin |
| `/api/admin/*` | GET | Admin |
| `/api/inventory/*` | GET/POST | Authenticated staff; approvals are admin/superadmin |
| `/api/upload-excel` | POST | Admin |

## Inventory quantity model

New warehouse quantity workflows use the inventory ledger in
`supabase/schema.sql`. Receiving creates a counted lot, carton/sack stock is
kept by package type, delivery creation reserves available units, picking
moves reserved units to dispatch staging, and dispatch removes them from
on-hand stock. Physical count corrections are submitted by staff and
approved by an admin or superadmin.

After deploying the application, apply the current `supabase/schema.sql` in
the Supabase SQL editor, then call `POST /api/inventory/migrate-legacy` once
as an admin or superadmin to convert existing `products.qty` rows into
opening-balance lots. The original `products` data is retained for
compatibility during reconciliation.

## Project structure

```text
server.js                 Express routes and deployment entry point
auth.js                   Password hashing and signed session helpers
db/supabase.js            Active database adapter
supabase/schema.sql       Canonical schema, indexes, and RLS setup
public/index.html         Application shell
public/js/app.js          Frontend behavior and offline catalog cache
public/css/styles.css     UI styling
test/auth.test.js         Authentication and route protection tests
```
