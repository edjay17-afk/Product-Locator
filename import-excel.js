const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, 'products(2026-08-08).xls');
const seedPath = path.join(__dirname, 'seed-data.json');

if (!fs.existsSync(excelPath)) {
  console.error('❌ Could not find "products(2026-08-08).xls" in project root.');
  process.exit(1);
}

console.log('📖 Reading "products(2026-08-08).xls"...');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet);

function cleanHtmlEntities(str) {
  if (!str) return '';
  return String(str)
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

console.log(`Processing ${rows.length} master product records...`);

const parsed = rows.map((r) => {
  const barcode = r['C. Barcode'] ? String(r['C. Barcode']).trim() : '';
  const stock = r['Stock No.'] ? String(r['Stock No.']).trim() : '';
  const name = cleanHtmlEntities(r['Product'] ? String(r['Product']).trim() : 'Unnamed Item');
  const category = cleanHtmlEntities(r['Category'] ? String(r['Category']).trim() : '');
  const department = cleanHtmlEntities(r['Department'] ? String(r['Department']).trim() : '');

  return {
    b: barcode,
    s: stock,
    n: name,
    c: category || 'Uncategorized',
    sc: department,
    floor: '',
    batch: '',
    shelf: '',
    level: '',
    loc: '',
    locFull: '',
    qty: 0,
    status: 'UNMAPPED'
  };
});

fs.writeFileSync(seedPath, JSON.stringify(parsed, null, 2));
console.log(`✅ Successfully updated seed-data.json with all ${parsed.length} master products!`);
