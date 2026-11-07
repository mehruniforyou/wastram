const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function check() {
  const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
  const files = fs.readdirSync(dir);

  console.log('Total files:', files.length);

  // Group hex files
  const hex = files.filter(f => !f.startsWith('FB_IMG') && !/^\d+\.jpg/.test(f));
  console.log('\n--- HEX FILES (' + hex.length + ') ---');
  // Look for shared prefixes in hex files
  const hexGroups = {};
  for (const f of hex) {
    const base = f.replace(/_\d+\.jpg\.jpeg$/, '').replace(/\.jpg\.jpeg$/, '');
    if (!hexGroups[base]) hexGroups[base] = [];
    hexGroups[base].push(f);
  }
  for (const [base, flist] of Object.entries(hexGroups)) {
    console.log(`Hex group [${base.slice(0, 8)}...]: ${flist.length} shots ->`, flist);
  }

  // Group FB files
  const fb = files.filter(f => f.startsWith('FB_IMG')).sort();
  console.log('\n--- FB FILES (' + fb.length + ') ---');
  fb.forEach(f => console.log(f));
}

check();
