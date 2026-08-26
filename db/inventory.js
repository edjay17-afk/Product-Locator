const db = require('./supabase');

const memory = {
  initialized: false,
  nextLot: 1,
  nextBalance: 1,
  nextMovement: 1,
  nextReservation: 1,
  nextAdjustment: 1,
  lots: [],
  balances: [],
  movements: [],
  reservations: [],
  adjustments: []
};

function requireInventorySchema(operation) {
  if (db.isSupabaseConnected && db.isSupabaseConnected()) {
    throw new Error(`Inventory schema is not installed; apply supabase/schema.sql before ${operation}.`);
  }
}

function clean(value) {
  return String(value == null ? '' : value).trim();
}

function skuKey(input = {}) {
  if (typeof input === 'string') return clean(input).toLowerCase();
  const barcode = clean(input.barcode).toLowerCase();
  const stockNo = clean(input.stock_no || input.stockNo || input.stock_code).toLowerCase();
  return barcode || stockNo || clean(input.sku_key || input.skuKey).toLowerCase();
}

function locationCode(product) {
  if (clean(product.loc)) return clean(product.loc);
  if (clean(product.floor) && (clean(product.row) || clean(product.batch)) && clean(product.shelf)) {
    return [product.floor, product.row || product.batch, product.shelf, product.level || '0'].join('-');
  }
  return 'RECEIVING';
}

function locationType(code, packageType) {
  const normalized = clean(code).toUpperCase();
  if (['RECEIVING', 'PICKED', 'DAMAGED', 'DISPATCHED'].includes(normalized)) return normalized;
  return ['CARTON', 'SACK', 'PALLET', 'OTHER'].includes(clean(packageType).toUpperCase()) ? 'BULK' : 'SHELF';
}

async function ensureMemory() {
  if (memory.initialized) return;
  memory.initialized = true;
  const products = await db.getAllProducts();
  for (const product of products) {
    const qty = Math.max(0, Number.parseInt(product.qty, 10) || 0);
    if (!qty) continue;
    const key = skuKey(product);
    const code = locationCode(product);
    const lot = {
      id: `legacy-${product.id || memory.nextLot++}`,
      sku_key: key,
      barcode: clean(product.barcode),
      stock_no: clean(product.stock_no),
      product_name: clean(product.product_name || product.name),
      lot_code: `MIGRATED-${product.id || memory.nextLot++}`,
      package_type: /carton/i.test(clean(product.location_storage || product.storage_location)) ? 'CARTON' : 'EACH',
      received_qty: qty,
      received_at: product.created_at || new Date().toISOString(),
      created_by: 'Legacy Migration'
    };
    memory.lots.push(lot);
    memory.balances.push({
      id: memory.nextBalance++, sku_key: key, lot_id: lot.id, location_code: code,
      location_type: locationType(code, lot.package_type), qty_on_hand: qty, qty_reserved: 0
    });
  }
}

async function rpc(name, args) {
  const client = db.getSupabaseClient();
  if (!client) return null;
  let response;
  try {
    response = await client.rpc(name, args);
  } catch (err) {
    // Keep the local compatibility path usable during a cold/offline
    // function invocation. A configured database will be retried next call.
    if (/fetch failed|network|timeout|socket/i.test(err.message || '')) return null;
    throw err;
  }
  const { data, error } = response;
  if (error) {
    if (/does not exist|not found|schema cache/i.test(error.message || '')) return null;
    throw new Error(error.message);
  }
  return data;
}

async function findProduct(input) {
  if (input && (input.product_name || input.name || input.barcode || input.stock_no || input.stock_code)) return input;
  return db.getProductByBarcodeOrStock(clean(input && (input.sku_key || input.skuKey)));
}

async function receive(input, actor) {
  const product = await findProduct(input);
  const key = skuKey({ ...input, ...(product || {}) });
  if (!key) throw new Error('A barcode or stock number is required.');
  const qty = Number.parseInt(input.qty, 10);
  if (!Number.isInteger(qty) || qty <= 0) throw new Error('Receiving quantity must be greater than zero.');
  const args = {
    p_sku_key: key,
    p_barcode: clean(input.barcode || product?.barcode),
    p_stock_no: clean(input.stock_no || input.stock_code || product?.stock_no),
    p_product_name: clean(input.product_name || input.name || product?.product_name),
    p_qty: qty,
    p_location_code: clean(input.location_code || input.location || 'RECEIVING'),
    p_package_type: clean(input.package_type || 'EACH').toUpperCase(),
    p_lot_code: clean(input.lot_code),
    p_source_reference: clean(input.source_reference || input.reference),
    p_actor_name: clean(actor || input.actor_name || 'Staff')
  };
  const result = await rpc('inventory_receive', args);
  if (result) return result;
  requireInventorySchema('recording inventory');
  await ensureMemory();
  if (args.p_source_reference && memory.lots.some(lot => lot.sku_key === key && lot.source_reference === args.p_source_reference)) {
    throw new Error('This receiving reference has already been recorded for this product.');
  }
  const lot = { id: `lot-${memory.nextLot++}`, sku_key: key, barcode: args.p_barcode, stock_no: args.p_stock_no, product_name: args.p_product_name, lot_code: args.p_lot_code || `LOT-${Date.now()}`, package_type: args.p_package_type, received_qty: qty, source_reference: args.p_source_reference, received_at: new Date().toISOString(), created_by: args.p_actor_name };
  const balance = { id: memory.nextBalance++, sku_key: key, lot_id: lot.id, location_code: args.p_location_code, location_type: locationType(args.p_location_code, args.p_package_type), qty_on_hand: qty, qty_reserved: 0 };
  memory.lots.push(lot); memory.balances.push(balance);
  memory.movements.push({ id: memory.nextMovement++, sku_key: key, lot_id: lot.id, to_location_code: args.p_location_code, qty, movement_type: 'RECEIVE', actor_name: args.p_actor_name, created_at: new Date().toISOString() });
  return { lotId: lot.id, balanceId: balance.id, skuKey: key, qty, location: args.p_location_code };
}

async function move(input, actor) {
  const key = skuKey(input);
  const qty = Number.parseInt(input.qty, 10);
  if (!key || !input.lot_id || !clean(input.from_location) || !clean(input.to_location) || !Number.isInteger(qty) || qty <= 0) throw new Error('SKU, lot, source, destination, and positive quantity are required.');
  const result = await rpc('inventory_move', { p_sku_key: key, p_lot_id: input.lot_id, p_from_location: input.from_location, p_to_location: input.to_location, p_qty: qty, p_actor_name: actor || 'Staff', p_reason: input.reason || '', p_to_type: input.to_type || 'SHELF' });
  if (result) return result;
  requireInventorySchema('moving inventory');
  await ensureMemory();
  const source = memory.balances.find(b => b.sku_key === key && String(b.lot_id) === String(input.lot_id) && b.location_code === clean(input.from_location));
  if (!source || qty > source.qty_on_hand - source.qty_reserved) throw new Error('Move quantity exceeds available source quantity.');
  let destination = memory.balances.find(b => b.sku_key === key && String(b.lot_id) === String(input.lot_id) && b.location_code === clean(input.to_location));
  if (!destination) { destination = { id: memory.nextBalance++, sku_key: key, lot_id: input.lot_id, location_code: clean(input.to_location), location_type: locationType(input.to_location), qty_on_hand: 0, qty_reserved: 0 }; memory.balances.push(destination); }
  source.qty_on_hand -= qty; destination.qty_on_hand += qty;
  memory.movements.push({ id: memory.nextMovement++, sku_key: key, lot_id: input.lot_id, from_location_code: input.from_location, to_location_code: input.to_location, qty, movement_type: 'MOVE', actor_name: actor || 'Staff', reason: input.reason || '', created_at: new Date().toISOString() });
  return { qty, sourceBalanceId: source.id, destinationBalanceId: destination.id };
}

async function putaway(input, actor) {
  const key = skuKey(input);
  const qty = Number.parseInt(input.qty, 10);
  if (!key || !clean(input.to_location) || !Number.isInteger(qty) || qty <= 0) throw new Error('SKU, destination, and positive quantity are required.');
  const result = await rpc('inventory_putaway', { p_sku_key: key, p_qty: qty, p_to_location: input.to_location, p_package_type: input.package_type || 'EACH', p_actor_name: actor || 'Staff' });
  if (result) return result;
  requireInventorySchema('putting away inventory');
  await ensureMemory();
  let remaining = qty;
  const destinationType = locationType(input.to_location, input.package_type);
  for (const source of memory.balances.filter(b => b.sku_key === key && ['RECEIVING', 'BULK', 'SHELF'].includes(b.location_type))) {
    if (!remaining) break;
    const take = Math.min(remaining, source.qty_on_hand - source.qty_reserved);
    if (!take) continue;
    let destination = memory.balances.find(b => b.sku_key === key && String(b.lot_id) === String(source.lot_id) && b.location_code === input.to_location);
    if (!destination) { destination = { id: memory.nextBalance++, sku_key: key, lot_id: source.lot_id, location_code: input.to_location, location_type: destinationType, qty_on_hand: 0, qty_reserved: 0 }; memory.balances.push(destination); }
    if (source !== destination) source.qty_on_hand -= take;
    destination.qty_on_hand += source === destination ? 0 : take;
    memory.movements.push({ id: memory.nextMovement++, sku_key: key, lot_id: source.lot_id, from_location_code: source.location_code, to_location_code: input.to_location, qty: take, movement_type: 'MOVE', reason: 'Putaway', actor_name: actor || 'Staff', created_at: new Date().toISOString() });
    remaining -= take;
  }
  if (remaining) throw new Error('Putaway quantity exceeds available warehouse stock.');
  return { skuKey: key, putAway: qty, location: input.to_location };
}

async function reserveOrder(orderId, items, actor) {
  const normalized = [];
  for (const item of items || []) {
    const product = await findProduct(item);
    const key = skuKey({ ...item, ...(product || {}) });
    const qty = Number.parseInt(item.qty || item.requested_qty, 10);
    if (!key || !Number.isInteger(qty) || qty <= 0) throw new Error('Each order item needs a SKU and positive quantity.');
    normalized.push({ skuKey: key, qty });
  }
  const result = await rpc('inventory_reserve_order', { p_order_id: String(orderId), p_items: normalized, p_actor_name: actor || 'Staff' });
  if (result) return result;
  requireInventorySchema('reserving inventory');
  await ensureMemory();
  const created = [];
  for (const item of normalized) {
    const available = memory.balances.filter(b => b.sku_key === item.skuKey && ['RECEIVING', 'BULK', 'SHELF'].includes(b.location_type)).reduce((sum, b) => sum + b.qty_on_hand - b.qty_reserved, 0);
    if (available < item.qty) throw new Error(`Insufficient available quantity for ${item.skuKey}.`);
    let remaining = item.qty;
    for (const balance of memory.balances.filter(b => b.sku_key === item.skuKey && ['RECEIVING', 'BULK', 'SHELF'].includes(b.location_type))) {
      if (!remaining) break;
      const take = Math.min(remaining, balance.qty_on_hand - balance.qty_reserved);
      if (!take) continue;
      balance.qty_reserved += take;
      const reservation = { id: memory.nextReservation++, order_id: String(orderId), sku_key: item.skuKey, lot_id: balance.lot_id, location_code: balance.location_code, qty_reserved: take, qty_picked: 0, status: 'RESERVED', created_by: actor || 'Staff' };
      memory.reservations.push(reservation); created.push(reservation); remaining -= take;
    }
  }
  return { orderId: String(orderId), reserved: normalized.reduce((sum, i) => sum + i.qty, 0), reservations: created };
}

async function orderAction(action, orderId, actor) {
  const rpcName = action === 'release' ? 'inventory_release_order' : action === 'pick' ? 'inventory_pick_order' : 'inventory_dispatch_order';
  const result = await rpc(rpcName, { p_order_id: String(orderId), p_actor_name: actor || 'Staff' });
  if (result) return result;
  requireInventorySchema(`${action} inventory`);
  await ensureMemory();
  const rows = memory.reservations.filter(r => r.order_id === String(orderId) && ((action === 'release' && r.status === 'RESERVED') || (action === 'pick' && r.status === 'RESERVED') || (action === 'dispatch' && r.status === 'PICKED')));
  let total = 0;
  for (const reservation of rows) {
    const source = memory.balances.find(b => b.sku_key === reservation.sku_key && String(b.lot_id) === String(reservation.lot_id) && b.location_code === (action === 'dispatch' ? 'PICKED' : reservation.location_code));
    if (action === 'release') { source.qty_reserved -= reservation.qty_reserved; reservation.status = 'RELEASED'; total += reservation.qty_reserved; }
    if (action === 'pick') {
      const picked = memory.balances.find(b => b.sku_key === reservation.sku_key && String(b.lot_id) === String(reservation.lot_id) && b.location_code === 'PICKED') || (() => { const b = { id: memory.nextBalance++, sku_key: reservation.sku_key, lot_id: reservation.lot_id, location_code: 'PICKED', location_type: 'PICKED', qty_on_hand: 0, qty_reserved: 0 }; memory.balances.push(b); return b; })();
      source.qty_on_hand -= reservation.qty_reserved; source.qty_reserved -= reservation.qty_reserved; picked.qty_on_hand += reservation.qty_reserved; reservation.qty_picked = reservation.qty_reserved; reservation.status = 'PICKED'; total += reservation.qty_reserved;
    }
    if (action === 'dispatch') { const picked = source; if (!picked || picked.qty_on_hand < reservation.qty_picked) throw new Error('Picked quantity is unavailable.'); picked.qty_on_hand -= reservation.qty_picked; reservation.status = 'DISPATCHED'; total += reservation.qty_picked; }
  }
  return { orderId: String(orderId), [action === 'release' ? 'released' : action === 'pick' ? 'picked' : 'dispatched']: total };
}

async function summary(input) {
  const key = skuKey(input);
  const result = await rpc('inventory_summary', { p_sku_key: key });
  if (result) return result;
  await ensureMemory();
  const rows = memory.balances.filter(b => b.sku_key === key);
  const total = field => rows.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
  const available = rows.filter(r => ['RECEIVING', 'BULK', 'SHELF'].includes(r.location_type)).reduce((sum, r) => sum + r.qty_on_hand - r.qty_reserved, 0);
  return { skuKey: key, onHand: total('qty_on_hand'), reserved: total('qty_reserved'), available, receiving: totalByType(rows, 'RECEIVING'), bulk: totalByType(rows, 'BULK'), shelf: totalByType(rows, 'SHELF'), picked: totalByType(rows, 'PICKED') };
}

async function quickAdjust(input, actor) {
  const key = skuKey(input);
  const targetQty = Number.parseInt(input.target_qty ?? input.targetQty, 10);
  const storageType = clean(input.storage_type || input.storageType || 'ON_HAND').toUpperCase();
  if (!key || !Number.isInteger(targetQty) || targetQty < 0) throw new Error('SKU and a non-negative target quantity are required.');
  if (!['ON_HAND', 'RECEIVING', 'BULK', 'SHELF'].includes(storageType)) throw new Error('Unsupported inventory bucket.');
  if (!clean(input.reason)) throw new Error('A reason is required for an inventory correction.');
  const result = await rpc('inventory_quick_adjust', {
    p_sku_key: key,
    p_barcode: clean(input.barcode),
    p_stock_no: clean(input.stock_no || input.stock_code),
    p_product_name: clean(input.product_name || input.name),
    p_storage_type: storageType,
    p_target_qty: targetQty,
    p_reason: clean(input.reason),
    p_actor_name: actor || 'Staff'
  });
  if (result) return result;
  requireInventorySchema('saving a quick inventory adjustment');
  throw new Error('Inventory quick-adjustment function is not installed. Apply supabase/schema.sql first.');
}

async function directDispatch(input, actor) {
  const key = skuKey(input);
  const qty = Number.parseInt(input.qty, 10);
  const reference = clean(input.delivery_reference || input.reference);
  if (!key || !Number.isInteger(qty) || qty <= 0) throw new Error('SKU and a positive delivery quantity are required.');
  if (!reference) throw new Error('A delivery reference is required.');
  const result = await rpc('inventory_direct_dispatch', {
    p_sku_key: key,
    p_qty: qty,
    p_delivery_reference: reference,
    p_actor_name: actor || 'Staff'
  });
  if (result) return result;
  requireInventorySchema('recording a direct delivery');
  await ensureMemory();
  if (memory.movements.some(m => m.sku_key === key && m.reference_type === 'DIRECT_DELIVERY' && m.reference_id === reference)) {
    throw new Error('This delivery reference has already been recorded for this product.');
  }
  let remaining = qty;
  const receiving = memory.balances
    .filter(b => b.sku_key === key && b.location_type === 'RECEIVING')
    .sort((a, b) => String(a.lot_id).localeCompare(String(b.lot_id)));
  const available = receiving.reduce((sum, balance) => sum + Math.max(0, balance.qty_on_hand - balance.qty_reserved), 0);
  if (available < qty) throw new Error(`Only ${available} unreserved unit(s) are available in Receiving.`);
  for (const balance of receiving) {
    if (!remaining) break;
    const take = Math.min(remaining, balance.qty_on_hand - balance.qty_reserved);
    if (!take) continue;
    balance.qty_on_hand -= take;
    memory.movements.push({ id: memory.nextMovement++, sku_key: key, lot_id: balance.lot_id, from_location_code: balance.location_code, qty: take, movement_type: 'DISPATCH', reference_type: 'DIRECT_DELIVERY', reference_id: reference, reason: 'Direct delivery from Receiving', actor_name: actor || 'Staff', created_at: new Date().toISOString() });
    remaining -= take;
  }
  return { skuKey: key, dispatched: qty, deliveryReference: reference, source: 'RECEIVING' };
}

async function warehouseSummary() {
  const result = await rpc('inventory_warehouse_summary', {});
  if (result) return result;
  await ensureMemory();
  const rows = memory.balances;
  const onHand = rows.reduce((sum, row) => sum + (Number(row.qty_on_hand) || 0), 0);
  const reserved = rows.reduce((sum, row) => sum + (Number(row.qty_reserved) || 0), 0);
  const available = rows.filter(r => ['RECEIVING', 'BULK', 'SHELF'].includes(r.location_type)).reduce((sum, r) => sum + r.qty_on_hand - r.qty_reserved, 0);
  return {
    onHand,
    reserved,
    available,
    receiving: totalByType(rows, 'RECEIVING'),
    bulk: totalByType(rows, 'BULK'),
    shelf: totalByType(rows, 'SHELF'),
    picked: totalByType(rows, 'PICKED'),
    skuCount: new Set(rows.filter(r => r.qty_on_hand > 0).map(r => r.sku_key)).size
  };
}

function totalByType(rows, type) { return rows.filter(r => r.location_type === type).reduce((sum, r) => sum + (Number(r.qty_on_hand) || 0), 0); }

async function history(input, limit = 100) {
  const key = skuKey(input);
  const client = db.getSupabaseClient();
  if (client) {
    const { data, error } = await client.from('inventory_movements').select('*').eq('sku_key', key).order('created_at', { ascending: false }).limit(Math.min(500, limit));
    if (!error) return data || [];
    if (!/does not exist|schema cache/i.test(error.message || '')) throw new Error(error.message);
  }
  await ensureMemory();
  return memory.movements.filter(m => m.sku_key === key).slice(-limit).reverse();
}

async function requestAdjustment(input, actor) {
  const key = skuKey(input);
  const result = await rpc('inventory_request_adjustment', { p_sku_key: key, p_lot_id: input.lot_id, p_location_code: input.location_code, p_counted_qty: Number.parseInt(input.counted_qty, 10), p_reason: input.reason, p_actor_name: actor || 'Staff' });
  if (result) return result;
  requireInventorySchema('requesting an adjustment');
  await ensureMemory();
  const balance = memory.balances.find(b => b.sku_key === key && String(b.lot_id) === String(input.lot_id) && b.location_code === input.location_code);
  if (!balance) throw new Error('Inventory balance not found.');
  const counted = Number.parseInt(input.counted_qty, 10);
  const adjustment = { id: memory.nextAdjustment++, sku_key: key, lot_id: input.lot_id, location_code: input.location_code, system_qty: balance.qty_on_hand, counted_qty: counted, delta: counted - balance.qty_on_hand, reason: input.reason, status: 'PENDING', submitted_by: actor || 'Staff' };
  memory.adjustments.push(adjustment); return { adjustmentId: adjustment.id, status: 'PENDING', delta: adjustment.delta };
}

async function approveAdjustment(id, actor) {
  const result = await rpc('inventory_approve_adjustment', { p_adjustment_id: id, p_reviewer: actor || 'Supervisor' });
  if (result) return result;
  requireInventorySchema('approving an adjustment');
  await ensureMemory();
  const adjustment = memory.adjustments.find(a => String(a.id) === String(id) && a.status === 'PENDING');
  if (!adjustment) throw new Error('Pending inventory adjustment not found.');
  const balance = memory.balances.find(b => b.sku_key === adjustment.sku_key && String(b.lot_id) === String(adjustment.lot_id) && b.location_code === adjustment.location_code);
  if (adjustment.counted_qty < balance.qty_reserved) throw new Error('Counted quantity cannot be below reserved quantity.');
  balance.qty_on_hand = adjustment.counted_qty; adjustment.status = 'APPROVED'; adjustment.reviewed_by = actor || 'Supervisor';
  return { adjustmentId: adjustment.id, status: 'APPROVED', delta: adjustment.delta };
}

async function rejectAdjustment(id, actor) {
  const client = db.getSupabaseClient();
  if (client) {
    const { data, error } = await client.from('inventory_adjustments')
      .update({ status: 'REJECTED', reviewed_by: actor || 'Supervisor', reviewed_at: new Date().toISOString() })
      .eq('id', id).eq('status', 'PENDING').select('*').single();
    if (!error && data) return { adjustmentId: data.id, status: data.status, delta: data.delta };
    if (error && !/does not exist|schema cache/i.test(error.message || '')) throw new Error(error.message);
  }
  await ensureMemory();
  const adjustment = memory.adjustments.find(item => String(item.id) === String(id) && item.status === 'PENDING');
  if (!adjustment) throw new Error('Pending inventory adjustment not found.');
  adjustment.status = 'REJECTED';
  adjustment.reviewed_by = actor || 'Supervisor';
  adjustment.reviewed_at = new Date().toISOString();
  return { adjustmentId: adjustment.id, status: adjustment.status, delta: adjustment.delta };
}

async function adminOperations(limit = 100) {
  const safeLimit = Math.max(1, Math.min(250, Number.parseInt(limit, 10) || 100));
  const client = db.getSupabaseClient();
  if (client) {
    const [movementsResult, adjustmentsResult] = await Promise.all([
      client.from('inventory_movements').select('*').order('created_at', { ascending: false }).limit(safeLimit),
      client.from('inventory_adjustments').select('*').order('created_at', { ascending: false }).limit(safeLimit)
    ]);
    if (!movementsResult.error && !adjustmentsResult.error) {
      const movements = movementsResult.data || [];
      const adjustments = adjustmentsResult.data || [];
      const daily = await rpc('inventory_daily_activity_summary', {}) || dailyActivity(movements);
      return {
        movements,
        adjustments,
        daily,
        pendingAdjustments: adjustments.filter(item => item.status === 'PENDING'),
        directDeliveries: movements.filter(item => item.reference_type === 'DIRECT_DELIVERY'),
        receivingAlerts: movements.filter(item => item.movement_type === 'RECEIVE' && Date.now() - new Date(item.created_at).getTime() > 24 * 60 * 60 * 1000)
      };
    }
    const error = movementsResult.error || adjustmentsResult.error;
    if (!/does not exist|schema cache/i.test(error?.message || '')) throw new Error(error.message);
  }
  await ensureMemory();
  const movements = memory.movements.slice(-safeLimit).reverse();
  const adjustments = memory.adjustments.slice(-safeLimit).reverse();
  return {
    movements,
    adjustments,
    daily: dailyActivity(movements),
    pendingAdjustments: adjustments.filter(item => item.status === 'PENDING'),
    directDeliveries: movements.filter(item => item.reference_type === 'DIRECT_DELIVERY'),
    receivingAlerts: movements.filter(item => item.movement_type === 'RECEIVE' && Date.now() - new Date(item.created_at).getTime() > 24 * 60 * 60 * 1000)
  };
}

function dailyActivity(movements) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const today = movements.filter(item => {
    const time = new Date(item.created_at).getTime();
    return Number.isFinite(time) && time >= startOfDay.getTime();
  });
  return {
    total: today.length,
    received: today.filter(item => item.movement_type === 'RECEIVE').reduce((sum, item) => sum + (Number(item.qty) || 0), 0),
    delivered: today.filter(item => item.reference_type === 'DIRECT_DELIVERY' || item.movement_type === 'DISPATCH').reduce((sum, item) => sum + (Number(item.qty) || 0), 0),
    adjustments: today.filter(item => item.movement_type === 'ADJUSTMENT').length
  };
}

async function reconciliationExceptions(limit = 50) {
  const safeLimit = Math.max(1, Math.min(200, Number.parseInt(limit, 10) || 50));
  const client = db.getSupabaseClient();
  if (client) {
    const { data, error } = await client.rpc('inventory_reconciliation_exceptions', { p_limit: safeLimit });
    if (!error) return data || [];
    if (!/does not exist|not found|schema cache/i.test(error.message || '')) throw new Error(error.message);
  }
  return [];
}

async function migrateLegacy(actor) {
  const result = await rpc('inventory_migrate_legacy', { p_actor_name: actor || 'Legacy Migration' });
  if (result) return result;
  requireInventorySchema('migrating legacy quantities');
  await ensureMemory();
  return { lotsCreated: memory.lots.length, balancesCreated: memory.balances.length, mode: 'memory' };
}

module.exports = { skuKey, receive, move, putaway, reserveOrder, orderAction, summary, quickAdjust, directDispatch, warehouseSummary, history, requestAdjustment, approveAdjustment, rejectAdjustment, adminOperations, reconciliationExceptions, migrateLegacy };
