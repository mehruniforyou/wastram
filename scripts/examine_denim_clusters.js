const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'denim-all-product-images');
  const files = fs.readdirSync(dir);

  console.log('Total denim files:', files.length);

  const items = [];
  for (const f of files) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    const meta = await sharp(p).metadata();
    
    // Extract WA sequence number
    const match = f.match(/IMG-(\d+)-WA(\d+)/);
    const date = match ? match[1] : '';
    const waNum = match ? parseInt(match[2], 10) : 0;

    // Center crop RGB average
    const w = meta.width;
    const h = meta.height;
    const cw = Math.round(w * 0.4);
    const ch = Math.round(h * 0.4);
    const left = Math.round(w * 0.3);
    const top = Math.round(h * 0.3);

    const stats = await sharp(p)
      .extract({ left, top, width: cw, height: ch })
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

    items.push({
      file: f,
      date,
      waNum,
      width: w,
      height: h,
      size: stat.size,
      rgb: [r, g, b]
    });
  }

  // Sort by date then waNum
  items.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.waNum - b.waNum;
  });

  console.log('\n--- Sorted Items with delta WA ---');
  for (let i = 0; i < items.length; i++) {
    const cur = items[i];
    const prev = i > 0 ? items[i - 1] : null;
    const waDelta = prev ? (cur.date === prev.date ? cur.waNum - prev.waNum : 'DATE_CHANGE') : 0;
    let colorDist = 0;
    if (prev) {
      colorDist = Math.round(Math.sqrt(
        Math.pow(cur.rgb[0] - prev.rgb[0], 2) +
        Math.pow(cur.rgb[1] - prev.rgb[1], 2) +
        Math.pow(cur.rgb[2] - prev.rgb[2], 2)
      ));
    }
    console.log(`${cur.file} | ${cur.width}x${cur.height} | ${(cur.size/1024).toFixed(0)}KB | RGB: [${cur.rgb}] | waDelta: ${waDelta} | colorDist: ${colorDist}`);
  }
}

main().catch(console.error);
