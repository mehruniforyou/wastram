const fs = require('fs');
const content = fs.readFileSync('data/categories.ts', 'utf8');
const regex = /name:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const name = match[1];
  const img = match[2];
  const exists = fs.existsSync('public' + img);
  console.log(`${name}: ${img} -> ${exists ? 'EXISTS' : 'MISSING'}`);
}
