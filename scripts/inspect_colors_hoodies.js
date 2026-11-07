const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
  const numericFiles = fs.readdirSync(dir)
    .filter(f => /^\d+\.jpg/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  console.log('Numeric images:');
  const results = [];

  for (const f of numericFiles) {
    const p = path.join(dir, f);
    // Crop center 40% where the hoodie/sweatshirt is worn
    const meta = await sharp(p).metadata();
    const cropW = Math.round(meta.width * 0.4);
    const cropH = Math.round(meta.height * 0.4);
    const left = Math.round(meta.width * 0.3);
    const top = Math.round(meta.height * 0.25);

    const stats = await sharp(p)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(10, 10, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer();

    let r = 0, g = 0, b = 0;
    const count = stats.length / 3;
    for (let i = 0; i < stats.length; i += 3) {
      r += stats[i];
      g += stats[i + 1];
      b += stats[i + 2];
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    results.push({ file: f, num: parseInt(f), rgb: [r, g, b] });
  }

  for (let i = 0; i < results.length; i++) {
    const cur = results[i];
    const prev = i > 0 ? results[i - 1] : null;
    let d = 0;
    if (prev) {
      d = Math.round(Math.sqrt(
        Math.pow(cur.rgb[0] - prev.rgb[0], 2) +
        Math.pow(cur.rgb[1] - prev.rgb[1], 2) +
        Math.pow(cur.rgb[2] - prev.rgb[2], 2)
      ));
    }
    console.log(`${cur.file} | RGB: [${cur.rgb.map(x=>x.toString().padStart(3)).join(',')}] | deltaPrev: ${d.toString().padStart(3)}`);
  }
}

main().catch(console.error);
