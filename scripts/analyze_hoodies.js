const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
const files = fs.readdirSync(dir);

console.log('Total files:', files.length);

files.forEach((f, i) => {
  console.log(`${i + 1}: ${f}`);
});
