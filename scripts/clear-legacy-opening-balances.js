require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function run() {
  const lotIds = [];
  for (let from = 0; ; from += 1000) {
    const { data: lots, error: lotError } = await supabase
      .from('inventory_lots')
      .select('id')
      .like('source_reference', 'products:%')
      .order('id')
      .range(from, from + 999);
    if (lotError) throw lotError;
    lotIds.push(...(lots || []).map(lot => lot.id));
    if (!lots || lots.length < 1000) break;
  }

  let clearedBalances = 0;
  for (let index = 0; index < lotIds.length; index += 500) {
    const batch = lotIds.slice(index, index + 500);
    const { data: balances, error: balanceError } = await supabase
      .from('inventory_balances')
      .select('id, qty_on_hand, qty_reserved')
      .in('lot_id', batch)
      .gt('qty_on_hand', 0);
    if (balanceError) throw balanceError;
    if ((balances || []).some(balance => Number(balance.qty_reserved || 0) > 0)) {
      throw new Error('Cannot clear legacy balances while stock is reserved.');
    }
    const ids = (balances || []).map(balance => balance.id);
    if (!ids.length) continue;
    const { error: updateError } = await supabase
      .from('inventory_balances')
      .update({ qty_on_hand: 0 })
      .in('id', ids);
    if (updateError) throw updateError;
    clearedBalances += ids.length;
  }
  console.log(JSON.stringify({ legacyLots: lotIds.length, balancesCleared: clearedBalances }));
}

run().catch(error => {
  console.error(error.message);
  process.exit(1);
});
