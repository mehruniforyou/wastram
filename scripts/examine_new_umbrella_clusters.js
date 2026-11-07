const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'umbrella-dresses-all-product-image', 'new-umbrella-dress');
  const files = fs.readdirSync(dir);

  console.log('Total files:', files.length);

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
      aspect: (w / h).toFixed(2),
      rgb: [r, g, b]
    });
  }

  items.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.waNum - b.waNum;
  });

  // Calculate waDelta and colorDist between consecutive items
  console.log('\n--- Step-by-step WA sequence check ---');
  let smallDeltas = 0;
  let largeDeltas = 0;

  for (let i = 0; i < items.length - 1; i++) {
    const cur = items[i];
    const nxt = items[i + 1];
    const waDelta = nxt.date === cur.date ? nxt.waNum - cur.waNum : 'DATE';
    if (typeof waDelta === 'number' && waDelta <= 6) smallDeltas++;
    else largeDeltas++;
  }

  console.log(`Adjacent deltas <= 6: ${smallDeltas}`);
  console.log(`Adjacent deltas > 6: ${largeDeltas}`);

  // Test clustering
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

    // Group if:
    // 1. Same date
    // 2. Max 5 shots per product
    // 3. WA delta <= 6 (sent together within seconds) OR (waDelta <= 40 && colorDist < 28)
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

  console.log(`\nClustered ${items.length} images into ${clusters.length} products!`);
  const shotCounts = {};
  clusters.forEach(c => {
    shotCounts[c.length] = (shotCounts[c.length] || 0) + 1;
  });
  console.log('Shot count distribution:', shotCounts);

  console.log('\n--- First 10 Multi-Shot Clusters ---');
  clusters.filter(c => c.length > 1).slice(0, 10).forEach((c, idx) => {
    console.log(`Multi-shot ${idx + 1} (${c.length} shots):`, c.map(x => x.file));
  });

  // Verify total and uniqueness
  let totalInClusters = 0;
  const clusteredFiles = new Set();
  clusters.forEach(c => {
    totalInClusters += c.length;
    c.forEach(x => clusteredFiles.add(x.file));
  });
  console.log(`\nTotal verified: ${totalInClusters} / ${items.length}`);
  console.log(`Unique verified: ${clusteredFiles.size} / ${items.length}`);
}

main().catch(console.error);
