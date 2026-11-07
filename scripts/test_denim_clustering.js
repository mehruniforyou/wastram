const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'denim-all-product-images');
  const files = fs.readdirSync(dir);

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

  // Cluster based on date, waNum proximity, and visual color distance
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

    // Group if consecutive shots of same item (max 4 shots per product)
    const shouldGroup = current.length < 4 && sameDate && (
      waDelta <= 6 || // very close WA timestamp (within seconds)
      (waDelta <= 55 && colorDist < 25) || // close timestamp and nearly identical garment color
      (waDelta <= 35 && colorDist < 45 && cur.aspect === prev.aspect) // same camera orientation & similar color
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

  console.log(`Clustered ${items.length} images into ${clusters.length} products!`);
  const shotCounts = {};
  clusters.forEach(c => {
    shotCounts[c.length] = (shotCounts[c.length] || 0) + 1;
  });
  console.log('Shot count distribution:', shotCounts);

  // Print first 15 clusters
  console.log('\n--- First 15 Clusters ---');
  clusters.slice(0, 15).forEach((c, idx) => {
    console.log(`Product ${idx + 1} (${c.length} shots):`, c.map(x => x.file));
  });

  // Verify 0 orphans
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
