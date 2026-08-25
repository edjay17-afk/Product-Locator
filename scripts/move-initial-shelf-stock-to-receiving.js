require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function run() {
  const { data: shelfLocations, error: locationError } = await supabase
    .from('inventory_locations')
    .select('id, code')
    .eq('storage_type', 'SHELF');
  if (locationError) throw locationError;

  const shelfIds = (shelfLocations || []).map(location => location.id);
  if (!shelfIds.length) {
    console.log('No shelf locations found. Nothing to move.');
    return;
  }

  const { data: balances, error: balanceError } = await supabase
    .from('inventory_balances')
    .select('sku_key, lot_id, location_id, qty_on_hand, qty_reserved')
    .in('location_id', shelfIds)
    .gt('qty_on_hand', 0);
  if (balanceError) throw balanceError;

  const reserved = (balances || []).reduce((total, balance) => total + Number(balance.qty_reserved || 0), 0);
  if (reserved > 0) throw new Error(`Cannot reclassify shelf stock while ${reserved} units are reserved.`);

  let moved = 0;
  for (const balance of balances || []) {
    const source = shelfLocations.find(location => location.id === balance.location_id);
    const { error } = await supabase.rpc('inventory_move', {
      p_sku_key: balance.sku_key,
      p_lot_id: balance.lot_id,
      p_from_location: source.code,
      p_to_location: 'RECEIVING',
      p_qty: balance.qty_on_hand,
      p_actor_name: 'Initial inventory classification',
      p_reason: 'Initial catalog quantity is not a verified shelf count',
      p_to_type: 'RECEIVING'
    });
    if (error) throw error;
    moved += Number(balance.qty_on_hand || 0);
  }
  console.log(JSON.stringify({ balancesMoved: (balances || []).length, unitsMovedToReceiving: moved }));
}

run().catch(error => {
  console.error(error.message);
  process.exit(1);
});
