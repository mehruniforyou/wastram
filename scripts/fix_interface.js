const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'nishorama-data.ts');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  `  regularPrice?: number;
  salePrice?: number;`,
  `  regularPrice: number;
  salePrice: number;`
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Restored regularPrice: number and salePrice: number in interface');
