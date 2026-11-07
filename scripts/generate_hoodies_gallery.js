const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
const files = fs.readdirSync(dir)
  .filter(f => /^\d+\.jpg/.test(f))
  .sort((a, b) => parseInt(a) - parseInt(b));

let html = `<!DOCTYPE html><html><head><style>
body { font-family: sans-serif; background: #222; color: #fff; }
.grid { display: flex; flex-wrap: wrap; gap: 10px; }
.card { background: #333; padding: 5px; text-align: center; width: 140px; }
.card img { width: 100%; height: 180px; object-fit: cover; }
.pnum { font-size: 12px; font-weight: bold; margin-top: 4px; }
</style></head><body>
<h2>Hoodies Numeric Images (16885 - 16951)</h2>
<div class="grid">
`;

files.forEach(f => {
  html += `<div class="card"><img src="../hoodies-sweatshirts-all-product-images/${f}"><div class="pnum">${f.replace('.jpg.jpeg', '')}</div></div>\n`;
});

html += `</div></body></html>`;

fs.writeFileSync(path.join(__dirname, '..', 'temp_hoodies_gallery.html'), html, 'utf8');
console.log('Gallery written to temp_hoodies_gallery.html');
