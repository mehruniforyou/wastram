const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'denim-all-product-images');
const files = fs.readdirSync(dir);

console.log('Total files in denim-all-product-images:', files.length);

files.forEach((f, i) => {
  console.log(`${i + 1}: ${f}`);
});
