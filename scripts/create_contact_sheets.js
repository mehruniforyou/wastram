const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'dresses-images');
  const outDir = path.join(__dirname, '..', 'scratch', 'contact_sheets');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = fs.readdirSync(dir);
  console.log(`Processing ${files.length} images...`);

  const items = [];
  for (const f of files) {
    const p = path.join(dir, f);
    const meta = await sharp(p).metadata();
    const match = f.match(/IMG-(\d+)-WA(\d+)/);
    const date = match ? match[1] : '';
    const waNum = match ? parseInt(match[2], 10) : 0;

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
      rgb: [r, g, b]
    });
  }

  items.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.waNum - b.waNum;
  });

  const clusters = [];
  let current = [items[0]];

  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1];
    const cur = items[i];
    const sameDate = cur.date === prev.date;
    const waDelta = cur.waNum - prev.waNum;
    const colorDist = Math.sqrt(
      Math.pow(cur.rgb[0] - prev.rgb[0], 2) +
      Math.pow(cur.rgb[1] - prev.rgb[1], 2) +
      Math.pow(cur.rgb[2] - prev.rgb[2], 2)
    );

    const shouldGroup = current.length < 5 && sameDate && (
      (waDelta <= 6) ||
      (waDelta <= 40 && colorDist < 28) ||
      (waDelta <= 60 && colorDist < 18)
    );

    if (shouldGroup) {
      current.push(cur);
    } else {
      clusters.push(current);
      current = [cur];
    }
  }
  if (current.length > 0) {
    clusters.push(current);
  }

  console.log(`Clustered ${items.length} images into ${clusters.length} products.`);

  // Write cluster metadata json
  fs.writeFileSync(
    path.join(outDir, 'clusters.json'),
    JSON.stringify(clusters.map((c, i) => ({
      index: i + 1,
      count: c.length,
      primaryImage: c[0].file,
      allImages: c.map(x => x.file),
      date: c[0].date,
      waNum: c[0].waNum
    })), null, 2),
    'utf8'
  );

  // Generate Contact Sheets: 4 columns x 4 rows = 16 products per sheet
  // Cell size: 240px width, 320px height
  const cols = 4;
  const rows = 4;
  const perSheet = cols * rows; // 16
  const cellW = 240;
  const cellH = 320;
  const sheetW = cols * cellW;
  const sheetH = rows * cellH;

  const totalSheets = Math.ceil(clusters.length / perSheet);
  console.log(`Generating ${totalSheets} contact sheets...`);

  for (let s = 0; s < totalSheets; s++) {
    const sheetClusters = clusters.slice(s * perSheet, (s + 1) * perSheet);
    const composites = [];

    for (let cIdx = 0; cIdx < sheetClusters.length; cIdx++) {
      const cluster = sheetClusters[cIdx];
      const productNum = s * perSheet + cIdx + 1;
      const col = cIdx % cols;
      const row = Math.floor(cIdx / cols);
      const x = col * cellW;
      const y = row * cellH;

      const imgPath = path.join(dir, cluster[0].file);
      // Resize thumbnail to fit cell height - 30px (for label)
      const thumbBuf = await sharp(imgPath)
        .resize(cellW, cellH - 30, { fit: 'cover' })
        .toBuffer();

      composites.push({
        input: thumbBuf,
        left: x,
        top: y
      });

      // SVG banner for label
      const labelText = `#${productNum} (${cluster.length}img) WA${cluster[0].waNum}`;
      const svgBanner = Buffer.from(
        `<svg width="${cellW}" height="30">
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.85)"/>
          <text x="8" y="20" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#ffffff">${labelText}</text>
        </svg>`
      );

      composites.push({
        input: svgBanner,
        left: x,
        top: y + (cellH - 30)
      });
    }

    const sheetPath = path.join(outDir, `sheet_${s + 1}.jpg`);
    await sharp({
      create: {
        width: sheetW,
        height: sheetH,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    })
      .composite(composites)
      .jpeg({ quality: 85 })
      .toFile(sheetPath);

    console.log(`Created ${sheetPath}`);
  }

  console.log('All contact sheets generated!');
}

main().catch(console.error);
