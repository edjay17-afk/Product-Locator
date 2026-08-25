require('dotenv').config();

const XLSX = require('xlsx');
const db = require('../db/supabase');

const WORKBOOK = process.argv[2] || 'products(2026-08-24).xlsx';
const IMPORT_ACTOR = 'Inventory Import 2026-08-24';

function text(value) {
  return String(value == null ? '' : value).trim();
}

function key(value) {
  return text(value).toLowerCase();
}

function parseInventory(value) {
  const source = text(value);
  const parts = source.split(',');
  const main = parts.shift().trim();
  const multiplication = main.match(/^(-?[0-9]+(?:[.][0-9]+)?)\s*[x×*]\s*(-?[0-9]+(?:[.][0-9]+)?)$/i);
  let total = multiplication ? Number(multiplication[1]) * Number(multiplication[2]) : Number(main);
  for (const part of parts) total += Number(part.trim()) || 0;
  if (!Number.isFinite(total)) throw new Error(`Invalid inventory value: ${source}`);
  return total;
}

function normalizedQuantity(value) {
  // Warehouse quantities cannot be negative or fractional in the current schema.
  return Math.max(0, Math.round(parseInventory(value)));
}

function hasLocation(product) {
  return ['loc', 'floor', 'row', 'shelf', 'level', 'location_storage'].some(field => text(product[field]) !== '');
}

function productRow(product, updates = {}) {
  return {
    id: product.id,
    barcode: text(product.barcode),
    barcode_2: text(product.barcode_2),
    stock_no: text(product.stock_no || product.stock_code),
    product_name: text(product.product_name || product.name) || 'Unnamed item',
    category: text(product.category) || 'Uncategorized',
    department: text(product.department || product.subcategory),
    floor: text(product.floor),
    row: text(product.row || product.batch),
    shelf: text(product.shelf),
    level: text(product.level) || '0',
    loc: text(product.loc),
    location_storage: text(product.location_storage || product.storage_location),
    qty: Number.isInteger(product.qty) ? product.qty : (Number.parseInt(product.qty, 10) || 0),
    status: text(product.status) || 'UNMAPPED',
    custom: Boolean(product.custom),
    last_modified_by: text(product.last_modified_by) || 'System Import',
    ...(product.created_at ? { created_at: product.created_at } : {}),
    ...updates
  };
}

async function main() {
  const workbook = XLSX.readFile(WORKBOOK);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const sourceRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }).slice(1);
  const workbookRows = sourceRows.map((row, index) => {
    const barcode = text(row[0]);
    const stockNo = text(row[1]);
    if (!barcode && !stockNo) throw new Error(`Row ${index + 2} has no barcode or stock number.`);
    return {
      barcode,
      stockNo,
      productName: text(row[2]) || 'Unnamed item',
      department: text(row[3]),
      category: text(row[4]) || 'Uncategorized',
      rawInventory: row[5],
      quantity: normalizedQuantity(row[5])
    };
  });

  const products = await db.getAllProducts();
  const byBarcode = new Map();
  const byStockNo = new Map();
  const addIndex = (map, value, product) => {
    const normalized = key(value);
    if (!normalized) return;
    const list = map.get(normalized) || [];
    list.push(product);
    map.set(normalized, list);
  };
  for (const product of products) {
    addIndex(byBarcode, product.barcode, product);
    addIndex(byStockNo, product.stock_no || product.stock_code, product);
  }

  const updatesById = new Map();
  const inserts = [];
  const seenWorkbookKeys = new Set();
  let matchedByBarcode = 0;
  let matchedByStockNo = 0;
  let unmatched = 0;
  let negativeRows = 0;
  let fractionalRows = 0;
  let importedQuantity = 0;

  for (const item of workbookRows) {
    const barcodeKey = key(item.barcode);
    const stockKey = key(item.stockNo);
    const workbookKey = barcodeKey || `s:${stockKey}`;
    if (seenWorkbookKeys.has(workbookKey)) throw new Error(`Duplicate workbook SKU: ${workbookKey}`);
    seenWorkbookKeys.add(workbookKey);

    const barcodeMatches = barcodeKey ? (byBarcode.get(barcodeKey) || []) : [];
    const stockMatches = stockKey ? (byStockNo.get(stockKey) || []) : [];
    // A barcode match is authoritative. Only fall back to stock number when
    // the workbook barcode is absent or not present in the database.
    const candidates = barcodeMatches.length ? barcodeMatches : stockMatches;
    const totalBeforeClamp = parseInventory(item.rawInventory);
    if (totalBeforeClamp < 0) negativeRows++;
    if (!Number.isInteger(totalBeforeClamp)) fractionalRows++;
    importedQuantity += item.quantity;

    if (candidates.length) {
      if (barcodeMatches.length) matchedByBarcode++;
      else matchedByStockNo++;
      // Prefer an unlocated master row so the SKU total is not attached to a shelf row.
      const canonical = [...candidates].sort((a, b) => Number(hasLocation(a)) - Number(hasLocation(b)) || Number(a.id) - Number(b.id))[0];
      const update = productRow(canonical, {
        barcode: item.barcode || text(canonical.barcode),
        stock_no: item.stockNo || text(canonical.stock_no || canonical.stock_code),
        product_name: item.productName,
        department: item.department,
        category: item.category,
        qty: item.quantity,
        last_modified_by: IMPORT_ACTOR
      });
      const previous = updatesById.get(canonical.id);
      if (previous && previous.qty !== update.qty) {
        throw new Error(`One database row matched multiple workbook quantities: product id ${canonical.id}.`);
      }
      updatesById.set(canonical.id, update);
    } else {
      unmatched++;
      inserts.push({
        barcode: item.barcode,
        barcode_2: '',
        stock_no: item.stockNo,
        product_name: item.productName,
        category: item.category,
        department: item.department,
        floor: '', row: '', shelf: '', level: '0', loc: '', location_storage: '',
        qty: item.quantity,
        status: 'UNMAPPED',
        custom: false,
        last_modified_by: IMPORT_ACTOR
      });
    }
  }

  const updates = [...updatesById.values()];

  const client = db.getSupabaseClient();
  if (!client) throw new Error('Supabase service client is not available. Set SUPABASE_SERVICE_ROLE_KEY.');

  for (let i = 0; i < updates.length; i += 500) {
    const { error } = await client.from('products').upsert(updates.slice(i, i + 500), { onConflict: 'id' });
    if (error) throw new Error(`Updating products batch ${i / 500 + 1} failed: ${error.message}`);
    console.log(`Updated ${Math.min(i + 500, updates.length)} / ${updates.length} matched SKUs`);
  }
  for (let i = 0; i < inserts.length; i += 500) {
    const { error } = await client.from('products').insert(inserts.slice(i, i + 500));
    if (error) throw new Error(`Inserting products batch ${i / 500 + 1} failed: ${error.message}`);
    console.log(`Inserted ${Math.min(i + 500, inserts.length)} / ${inserts.length} new SKUs`);
  }

  const { data: migration, error: migrationError } = await client.rpc('inventory_migrate_legacy', { p_actor_name: IMPORT_ACTOR });
  if (migrationError) throw new Error(`Inventory opening-balance migration failed: ${migrationError.message}`);

  console.log(JSON.stringify({
    workbookRows: workbookRows.length,
    matchedByBarcode,
    matchedByStockNo,
    unmatchedInserted: unmatched,
    negativeRowsClampedToZero: negativeRows,
    fractionalRowsRounded: fractionalRows,
    importedQuantity,
    migration
  }, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
