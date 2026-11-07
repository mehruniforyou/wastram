const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
const files = fs.readdirSync(dir);

const numeric = [];
const hex = [];
const fb = [];

files.forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  if (f.startsWith('FB_IMG')) {
    fb.push({ file: f, size: stat.size, mtime: stat.mtimeMs });
  } else if (/^\d+/.test(f)) {
    const num = parseInt(f.match(/^(\d+)/)[1], 10);
    numeric.push({ file: f, num, size: stat.size, mtime: stat.mtimeMs });
  } else {
    hex.push({ file: f, size: stat.size, mtime: stat.mtimeMs });
  }
});

console.log('--- NUMERIC FILES (' + numeric.length + ') ---');
numeric.sort((a, b) => a.num - b.num);
let diffs = [];
for (let i = 0; i < numeric.length - 1; i++) {
  diffs.push(numeric[i+1].num - numeric[i].num);
}
console.log('First 10 numeric:', numeric.slice(0, 10).map(x => x.file));
console.log('Last 10 numeric:', numeric.slice(-10).map(x => x.file));

// Group numeric by contiguous blocks or step
console.log('\n--- FB FILES (' + fb.length + ') ---');
fb.sort((a, b) => a.file.localeCompare(b.file));
fb.forEach(x => console.log(x.file, 'size:', x.size));

console.log('\n--- HEX FILES (' + hex.length + ') ---');
hex.sort((a, b) => a.file.localeCompare(b.file));
hex.forEach(x => console.log(x.file, 'size:', x.size));
