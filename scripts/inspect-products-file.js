const fs = require('fs');

const code = fs.readFileSync('data/products.ts', 'utf8');

const allExports = code.match(/export const [a-zA-Z0-9_]+/g);
console.log('Exports in data/products.ts:', allExports);

const lines = code.split('\n');
console.log('Total lines:', lines.length);

const startLine = lines.findIndex(l => l.includes('export const PRODUCTS'));
console.log('PRODUCTS starts at line:', startLine + 1);

let prodCount = 0;
for (let i = startLine; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('"id":')) {
    prodCount++;
  }
}
console.log('Total "id": inside PRODUCTS:', prodCount);
