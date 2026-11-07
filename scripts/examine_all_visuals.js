const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
  const files = fs.readdirSync(dir);

  console.log('--- ALL FILES DIMENSIONS & SIZES ---');
  const hex = files.filter(f => !f.startsWith('FB_IMG') && !/^\d+\.jpg/.test(f));
  for (const f of hex) {
    const meta = await sharp(path.join(dir, f)).metadata();
    console.log(`HEX: ${f.padEnd(46)} | ${meta.width}x${meta.height}`);
  }
}

main().catch(console.error);
