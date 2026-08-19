require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

(async () => {
  const { data, error } = await supabase.from('products').select('*').not('loc', 'is', null).neq('loc', '').limit(50);
  if (error) { 
    console.error(error); 
    return; 
  }
  
  if (!data || data.length === 0) {
    console.log("No products have locations yet.");
    return;
  }
  
  console.log('Products with location:');
  data.forEach(p => {
    console.log(`${p.name || 'Unnamed'} (Barcode: ${p.barcode}) - Location: ${p.loc} - Qty: ${p.qty}`);
  });
})();
