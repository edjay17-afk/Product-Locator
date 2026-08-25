const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');
const inventory = require('../db/inventory');
const db = require('../db/supabase');
const { createSession } = require('../auth');

test('inventory ledger endpoints require an application session', async () => {
  const server = app.listen(0);
  try {
    const address = server.address();
    const base = `http://127.0.0.1:${address.port}`;
    const summary = await fetch(`${base}/api/inventory/TEST-SKU/summary`);
    const receipt = await fetch(`${base}/api/inventory/receipts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ barcode: 'TEST-SKU', qty: 1 }) });
    const adjustment = await fetch(`${base}/api/inventory/adjustments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sku_key: 'TEST-SKU', counted_qty: 1, reason: 'test' }) });
    const directDelivery = await fetch(`${base}/api/inventory/TEST-SKU/direct-delivery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qty: 1, delivery_reference: 'DR-TEST' }) });
    assert.equal(summary.status, 401);
    assert.equal(receipt.status, 401);
    assert.equal(adjustment.status, 401);
    assert.equal(directDelivery.status, 401);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('inventory summary uses the catalog on-hand quantity and keeps ledger buckets separate', async () => {
  const originalSummary = inventory.summary;
  const originalProductLookup = db.getProductByBarcodeOrStock;
  inventory.summary = async sku => ({ skuKey: sku, onHand: 0, available: 0, reserved: 0, receiving: 0, bulk: 0, shelf: 0, picked: 0 });
  db.getProductByBarcodeOrStock = async () => ({ barcode: '100480800919', qty: 707 });
  const server = app.listen(0);
  try {
    const address = server.address();
    const token = createSession({ id: 'test-user', username: 'stockman', full_name: 'Test Stockman', role: 'stockman' });
    const response = await fetch(`http://127.0.0.1:${address.port}/api/inventory/100480800919/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.summary.onHand, 707);
    assert.equal(body.summary.available, 707);
    assert.equal(body.summary.shelf, 0);
    assert.match(response.headers.get('cache-control'), /no-store/);
  } finally {
    inventory.summary = originalSummary;
    db.getProductByBarcodeOrStock = originalProductLookup;
    await new Promise(resolve => server.close(resolve));
  }
});

test('on-hand corrections update the catalog quantity rather than a physical location bucket', async () => {
  const originalLookup = db.getProductByBarcodeOrStock;
  const originalUpdate = db.updateProduct;
  let updateCall;
  db.getProductByBarcodeOrStock = async () => ({ id: 77, barcode: 'TEST-SKU', qty: 10 });
  db.updateProduct = async (id, values) => { updateCall = { id, values }; return { id, ...values }; };
  const server = app.listen(0);
  try {
    const address = server.address();
    const token = createSession({ id: 'test-user', username: 'stockman', full_name: 'Test Stockman', role: 'stockman' });
    const response = await fetch(`http://127.0.0.1:${address.port}/api/inventory/TEST-SKU/quick-adjustment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ storage_type: 'ON_HAND', target_qty: 0, reason: 'Physical count correction' })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.adjustment.source, 'CATALOG_ON_HAND');
    assert.deepEqual(updateCall, { id: 77, values: { qty: 0, last_modified_by: 'Test Stockman' } });
  } finally {
    db.getProductByBarcodeOrStock = originalLookup;
    db.updateProduct = originalUpdate;
    await new Promise(resolve => server.close(resolve));
  }
});

test('physical bucket changes keep the catalog on-hand quantity in sync', async () => {
  const originalLookup = db.getProductByBarcodeOrStock;
  const originalUpdate = db.updateProduct;
  const originalQuickAdjust = inventory.quickAdjust;
  const updateCalls = [];
  db.getProductByBarcodeOrStock = async () => ({ id: 91, barcode: 'TEST-SKU', qty: 707 });
  db.updateProduct = async (id, values) => { updateCalls.push({ id, values }); return { id, ...values }; };
  inventory.quickAdjust = async input => ({ storageType: input.storage_type, previousQty: 0, targetQty: 100, delta: 100 });
  const server = app.listen(0);
  try {
    const address = server.address();
    const token = createSession({ id: 'test-user', username: 'stockman', full_name: 'Test Stockman', role: 'stockman' });
    for (const storageType of ['RECEIVING', 'BULK', 'SHELF']) {
      const response = await fetch(`http://127.0.0.1:${address.port}/api/inventory/TEST-SKU/quick-adjustment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ storage_type: storageType, target_qty: 100, reason: 'New arrival' })
      });
      const body = await response.json();
      assert.equal(response.status, 200);
      assert.equal(body.success, true);
      assert.equal(body.product.qty, 807);
    }
    assert.deepEqual(updateCalls, [
      { id: 91, values: { qty: 807, last_modified_by: 'Test Stockman' } },
      { id: 91, values: { qty: 807, last_modified_by: 'Test Stockman' } },
      { id: 91, values: { qty: 807, last_modified_by: 'Test Stockman' } }
    ]);
  } finally {
    db.getProductByBarcodeOrStock = originalLookup;
    db.updateProduct = originalUpdate;
    inventory.quickAdjust = originalQuickAdjust;
    await new Promise(resolve => server.close(resolve));
  }
});

test('direct delivery records an outbound movement from Receiving', async () => {
  const originalDirectDispatch = inventory.directDispatch;
  const originalLookup = db.getProductByBarcodeOrStock;
  const originalUpdate = db.updateProduct;
  let receivedInput;
  inventory.directDispatch = async (input, actor) => {
    receivedInput = { input, actor };
    return { skuKey: input.sku_key, dispatched: input.qty, deliveryReference: input.delivery_reference, source: 'RECEIVING' };
  };
  db.getProductByBarcodeOrStock = async () => ({ id: 55, barcode: 'TEST-SKU', qty: 100 });
  db.updateProduct = async (id, values) => ({ id, ...values });
  const server = app.listen(0);
  try {
    const address = server.address();
    const token = createSession({ id: 'test-user', username: 'stockman', full_name: 'Test Stockman', role: 'stockman' });
    const response = await fetch(`http://127.0.0.1:${address.port}/api/inventory/TEST-SKU/direct-delivery`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty: 20, delivery_reference: 'DR-12345' })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.delivery.dispatched, 20);
    assert.equal(body.delivery.source, 'RECEIVING');
    assert.equal(receivedInput.input.sku_key, 'TEST-SKU');
    assert.equal(receivedInput.actor, 'Test Stockman');
  } finally {
    inventory.directDispatch = originalDirectDispatch;
    db.getProductByBarcodeOrStock = originalLookup;
    db.updateProduct = originalUpdate;
    await new Promise(resolve => server.close(resolve));
  }
});
