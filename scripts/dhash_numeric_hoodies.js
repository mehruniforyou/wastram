const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function getDHash(filePath) {
  // 9x8 grayscale image for 64-bit difference hash
  const buf = await sharp(filePath)
    .grayscale()
    .resize(9, 8, { fit: 'fill' })
    .raw()
    .toBuffer();

  let hash = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const left = buf[row * 9 + col];
      const right = buf[row * 9 + col + 1];
      hash += left > right ? '1' : '0';
    }
  }
  return hash;
}

function hammingDistance(h1, h2) {
  let dist = 0;
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) dist++;
  }
  return dist;
}

async function main() {
  const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
  const numericFiles = fs.readdirSync(dir)
    .filter(f => /^\d+\.jpg/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  const hashes = [];
  for (const f of numericFiles) {
    const h = await getDHash(path.join(dir, f));
    hashes.push({ file: f, hash: h });
  }

  console.log('--- Step by step hamming distance ---');
  for (let i = 0; i < hashes.length - 1; i++) {
    const cur = hashes[i];
    const nxt = hashes[i + 1];
    const d = hammingDistance(cur.hash, nxt.hash);
    console.log(`${cur.file} -> ${nxt.file} | dHash dist: ${d}`);
  }
}

main().catch(console.error);
