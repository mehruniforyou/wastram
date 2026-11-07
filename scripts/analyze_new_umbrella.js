const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'umbrella-dresses-all-product-image', 'new-umbrella-dress');
const entries = fs.readdirSync(dir);

console.log('Total entries:', entries.length);

let dirs = [];
let files = [];
entries.forEach(e => {
  const stat = fs.statSync(path.join(dir, e));
  if (stat.isDirectory()) dirs.push(e);
  else files.push(e);
});

console.log('Directories:', dirs);
console.log('Files count:', files.length);
console.log('First 30 files:');
files.slice(0, 30).forEach(f => console.log(f));
console.log('Last 20 files:');
files.slice(-20).forEach(f => console.log(f));
