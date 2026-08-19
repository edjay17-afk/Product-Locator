require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Reading CSV...');
  const csvText = fs.readFileSync('Nelsoft_Products_2026-08-14.csv', 'utf8');
  const lines = csvText.split(/\r?\n/);
  
  // Create mapping: Client Barcode -> Barcode
  const map = new Map();
  // Skip header (i=0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    
    // Based on the CSV format:
    // Barcode,Client Barcode
    // We map existing system barcode (Client Barcode) to the new barcode_2 (Barcode)
    const barcode2 = parts[0] ? parts[0].trim() : '';
    const existingBarcode = parts[1] ? parts[1].trim() : '';
    
    if (existingBarcode && barcode2) {
      map.set(existingBarcode, barcode2);
    }
  }

  console.log(`Found ${map.size} mappings in CSV.`);
  console.log('Fetching all products from Supabase...');
  
  let allProducts = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase.from('products').select('id, barcode').range(offset, offset + limit - 1);
    if (error) {
      console.error('Error fetching products:', error);
      process.exit(1);
    }
    if (data.length === 0) break;
    allProducts.push(...data);
    offset += limit;
  }

  console.log(`Fetched ${allProducts.length} products from system.`);
  
  const updates = [];
  for (const product of allProducts) {
    if (product.barcode && map.has(String(product.barcode))) {
      updates.push({
        id: product.id,
        barcode_2: map.get(String(product.barcode))
      });
    }
  }

  console.log(`Found ${updates.length} products to update with barcode_2.`);
  
  if (updates.length > 0) {
    console.log('Updating products in batches of 50...');
    let successCount = 0;
    
    // Update concurrently
    const promises = [];
    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];
      promises.push(
        supabase.from('products').update({ barcode_2: update.barcode_2 }).eq('id', update.id)
      );
      
      if (promises.length >= 50 || i === updates.length - 1) {
        const results = await Promise.all(promises);
        for (const res of results) {
          if (res.error) {
            console.error('Error updating:', res.error);
          } else {
            successCount++;
          }
        }
        promises.length = 0;
        process.stdout.write(`Updated ${i + 1} / ${updates.length}\r`);
      }
    }
    console.log(`\nUpdate complete! Successfully updated ${successCount} products.`);
  } else {
    console.log('No updates needed.');
  }
}

run();
