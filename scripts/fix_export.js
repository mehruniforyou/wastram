const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'nishorama-data.ts');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  'export const NISHORAMA_STORIES = [',
  'export const NISHORAMA_PRODUCTS: NishoramaProduct[] = [\n  ...WESTERN_DRESSES,\n  ...ORIGINAL_PRODUCTS\n];\n\nexport const NISHORAMA_STORIES = ['
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('NISHORAMA_PRODUCTS successfully exported!');
