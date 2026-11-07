const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function extractSignature(filePath) {
  const p = filePath;
  const meta = await sharp(p).metadata();
  const w = meta.width;
  const h = meta.height;

  // Extract 3 zones: Top (chest/neck), Middle (torso/skirt), Bottom (hem/pant)
  async function getAvgRgb(topPct, heightPct) {
    const left = Math.round(w * 0.25);
    const top = Math.round(h * topPct);
    const width = Math.round(w * 0.5);
    const height = Math.round(h * heightPct);

    const stats = await sharp(p)
      .extract({ left, top, width, height })
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
    return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
  }

  const topRgb = await getAvgRgb(0.2, 0.25);
  const midRgb = await getAvgRgb(0.45, 0.3);
  const botRgb = await getAvgRgb(0.75, 0.2);

  const match = path.basename(filePath).match(/IMG-(\d+)-WA(\d+)/);
  return {
    file: path.basename(filePath),
    date: match ? match[1] : '',
    waNum: match ? parseInt(match[2], 10) : 0,
    width: w,
    height: h,
    topRgb,
    midRgb,
    botRgb
  };
}

function dist(c1, c2) {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
    Math.pow(c1[1] - c2[1], 2) +
    Math.pow(c1[2] - c2[2], 2)
  );
}

function signatureDist(s1, s2) {
  const dTop = dist(s1.topRgb, s2.topRgb);
  const dMid = dist(s1.midRgb, s2.midRgb);
  const dBot = dist(s1.botRgb, s2.botRgb);
  return dTop * 0.35 + dMid * 0.45 + dBot * 0.20;
}

async function main() {
  const dir = path.join(__dirname, '..', 'dresses-images');
  const files = fs.readdirSync(dir);
  console.log(`Analyzing ${files.length} images...`);

  const sigs = [];
  for (const f of files) {
    const s = await extractSignature(path.join(dir, f));
    sigs.push(s);
  }

  // Separate 20261102 (Ethnic Sets) and 20261103 (Western / Umbrella / Kaftan / Cord)
  const set20261102 = sigs.filter(s => s.date === '20261102');
  const set20261103 = sigs.filter(s => s.date === '20261103');

  console.log(`20261102 (Ethnic Wear Sets): ${set20261102.length} images`);
  console.log(`20261103 (Western / Umbrella / Kaftan / Cord): ${set20261103.length} images`);

  // Let's cluster 20261102 into products
  // We know there are 12 products in 20261102:
  // Let's group them by signature similarity
  function clusterSet(items, threshold = 22) {
    const clusters = [];
    const used = new Set();

    for (let i = 0; i < items.length; i++) {
      if (used.has(items[i].file)) continue;
      const group = [items[i]];
      used.add(items[i].file);

      for (let j = i + 1; j < items.length; j++) {
        if (used.has(items[j].file)) continue;
        const d = signatureDist(items[i], items[j]);
        if (d < threshold) {
          group.push(items[j]);
          used.add(items[j].file);
        }
      }
      clusters.push(group);
    }
    return clusters;
  }

  const ethnicClusters = clusterSet(set20261102, 25);
  console.log(`Ethnic Wear Clusters (target ~12): ${ethnicClusters.length}`);
  ethnicClusters.forEach((c, idx) => {
    console.log(`  Ethnic #${idx + 1} (${c.length} imgs):`, c.map(x => x.file).join(', '));
  });

  const westernClusters = clusterSet(set20261103, 20);
  console.log(`20261103 Clusters: ${westernClusters.length}`);
  const counts = {};
  westernClusters.forEach(c => counts[c.length] = (counts[c.length] || 0) + 1);
  console.log('Size distribution:', counts);
}

main().catch(console.error);
