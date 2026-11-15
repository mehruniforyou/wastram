const fs = require('fs');

const code = fs.readFileSync('app/products/[slug]/page.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (/color|variant/i.test(l)) {
    console.log(`${i+1}: ${l.trim().slice(0, 100)}`);
  }
});
