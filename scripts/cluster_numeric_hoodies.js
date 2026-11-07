const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
  const numericFiles = fs.readdirSync(dir)
    .filter(f => /^\d+\.jpg/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  console.log(`Analyzing ${numericFiles.length} numeric images from ${numericFiles[0]} to ${numericFiles[numericFiles.length - 1]}`);

  // For each image, get small 16x16 thumbnail RGB buffer and aspect ratio
  const items = [];
  for (const f of numericFiles) {
    const p = path.join(dir, f);
    const meta = await sharp(p).metadata();
    const buf = await sharp(p).resize(16, 16, { fit: 'fill' }).removeAlpha().raw().toBuffer();
    items.push({
      file: f,
      num: parseInt(f),
      aspect: (meta.width / meta.height).toFixed(3),
      size: fs.statSync(p).size,
      buf
    });
  }

  // Calculate distance between item i and item j
  function dist(a, b) {
    let d = 0;
    for (let k = 0; k < a.buf.length; k++) {
      d += Math.abs(a.buf[k] - b.buf[k]);
    }
    return Math.round(d / a.buf.length);
  }

  console.log('\n--- Step-by-step adjacent distance & size ratio ---');
  for (let i = 0; i < items.length - 1; i++) {
    const cur = items[i];
    const nxt = items[i + 1];
    const d = dist(cur, nxt);
    const sizeRatio = (nxt.size / cur.size).toFixed(2);
    console.log(`[${cur.num}] -> [${nxt.num}] | dist: ${d.toString().padStart(3)} | sizes: ${cur.size} vs ${nxt.size} (ratio ${sizeRatio})`);
  }
}

main().catch(console.error);
