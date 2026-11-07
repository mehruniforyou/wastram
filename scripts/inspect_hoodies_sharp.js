const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
  const files = fs.readdirSync(dir);

  const numericFiles = files
    .filter(f => /^\d+\.jpg/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  console.log('Numeric files count:', numericFiles.length);

  // Inspect dimensions and average colors for numeric files
  const data = [];
  for (const f of numericFiles) {
    const filePath = path.join(dir, f);
    const meta = await sharp(filePath).metadata();
    const stats = await sharp(filePath).resize(32, 32).raw().toBuffer();
    // Compute average RGB
    let r = 0, g = 0, b = 0;
    const pixels = stats.length / 3;
    for (let i = 0; i < stats.length; i += 3) {
      r += stats[i];
      g += stats[i + 1];
      b += stats[i + 2];
    }
    r = Math.round(r / pixels);
    g = Math.round(g / pixels);
    b = Math.round(b / pixels);

    data.push({
      file: f,
      num: parseInt(f),
      width: meta.width,
      height: meta.height,
      avg: [r, g, b],
      rawSample: stats
    });
  }

  // Calculate distance between consecutive files
  console.log('\n--- Consecutive distances ---');
  for (let i = 0; i < data.length - 1; i++) {
    const cur = data[i];
    const next = data[i + 1];
    let sumDiff = 0;
    for (let k = 0; k < cur.rawSample.length; k++) {
      sumDiff += Math.abs(cur.rawSample[k] - next.rawSample[k]);
    }
    const avgPixDiff = Math.round(sumDiff / cur.rawSample.length);
    console.log(`${cur.file} -> ${next.file} | diff: ${avgPixDiff} | rgb1: [${cur.avg}] rgb2: [${next.avg}]`);
  }
}

main().catch(console.error);
