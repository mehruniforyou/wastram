const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
  const numericFiles = fs.readdirSync(dir)
    .filter(f => /^\d+\.jpg/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  for (let i = 0; i < numericFiles.length; i++) {
    const f = numericFiles[i];
    const p = path.join(dir, f);
    const m = await sharp(p).metadata();
    console.log(`${f.padEnd(16)} | ${m.width}x${m.height} | ${(fs.statSync(p).size / 1024 / 1024).toFixed(2)} MB`);
  }
}

main().catch(console.error);
