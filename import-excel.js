const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, 'Product Location.xlsx');
const seedPath = path.join(__dirname, 'seed-data.json');

if (!fs.existsSync(excelPath)) {
  console.error('❌ Could not find "Product Location.xlsx" in project root.');
  process.exit(1);
}

console.log('📖 Reading "Product Location.xlsx"...');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

function extractNum(str) {
  if (typeof str === 'number') return String(str);
  if (!str) return '';
  const m = String(str).match(/(\d+)/);
  if (!m) return '';
  const n = m[1];
  return n.length === 1 ? '0' + n : n;
}

function cleanHtmlEntities(str) {
  if (!str) return '';
  return String(str)
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

console.log(`Processing ${rows.length} rows...`);

const parsed = rows.map((r) => {
  const barcode = r[0] ? String(r[0]).trim() : '';
  const stock = r[1] ? String(r[1]).trim() : '';
  const name = cleanHtmlEntities(r[2] ? String(r[2]).trim() : 'Unnamed Item');
  const category = cleanHtmlEntities(r[3] ? String(r[3]).trim() : '');
  const subcategory = cleanHtmlEntities(r[4] ? String(r[4]).trim() : '');
  const locFull = r[5] ? cleanHtmlEntities(String(r[5]).trim()) : '';
  const floor = r[6] ? extractNum(r[6]) : '';
  const batch = r[7] ? extractNum(r[7]) : '';
  const shelf = r[8] ? extractNum(r[8]) : '';
  const level = r[9] ? extractNum(r[9]) : '';
  const qty = typeof r[10] === 'number' ? r[10] : (parseInt(r[10], 10) || 0);
  const status = r[16] ? String(r[16]).trim() : '';

  const cleanFloor = floor.replace(/^0+/, '') || floor;
  const loc = (cleanFloor || batch || shelf) ? `${cleanFloor}-${batch}-${shelf}-${level || '00'}` : '';

  return {
    b: barcode,
    s: stock,
    n: name,
    c: category,
    sc: subcategory,
    floor: cleanFloor,
    batch: batch,
    shelf: shelf,
    level: level || '00',
    loc: loc,
    locFull: locFull || loc,
    qty: qty,
    status: status
  };
});

fs.writeFileSync(seedPath, JSON.stringify(parsed, null, 2));
console.log(`✅ Successfully updated seed-data.json with all ${parsed.length} products from "Product Location.xlsx"!`);
