const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
const files = fs.readdirSync(dir);

const pureNumeric = [];
const hexFiles = [];
const fbFiles = [];

files.forEach(f => {
  if (f.startsWith('FB_IMG')) {
    fbFiles.push(f);
  } else if (/^\d+\.jpg/.test(f)) {
    pureNumeric.push({ file: f, num: parseInt(f.match(/^(\d+)/)[1], 10) });
  } else {
    hexFiles.push(f);
  }
});

console.log('Pure Numeric count:', pureNumeric.length);
console.log('FB count:', fbFiles.length);
console.log('Hex count:', hexFiles.length);
console.log('Total:', pureNumeric.length + fbFiles.length + hexFiles.length);

pureNumeric.sort((a,b) => a.num - b.num);
console.log('Numeric range:', pureNumeric[0].num, 'to', pureNumeric[pureNumeric.length - 1].num);

// Check if any numbers are skipped in pureNumeric
const missing = [];
for (let n = pureNumeric[0].num; n <= pureNumeric[pureNumeric.length - 1].num; n++) {
  if (!pureNumeric.some(x => x.num === n)) {
    missing.push(n);
  }
}
console.log('Missing in numeric sequence:', missing);

console.log('\n--- ALL HEX FILES ---');
hexFiles.forEach(f => console.log(f));
