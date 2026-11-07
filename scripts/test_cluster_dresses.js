const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function extractSignature(filePath) {
  const p = filePath;
  const meta = await sharp(p).metadata();
  const w = meta.width;
  const h = meta.height;

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

  const sigs = [];
  for (const f of files) {
    const s = await extractSignature(path.join(dir, f));
    sigs.push(s);
  }

  // 1. Ethnic Wear Sets (57 images -> 12 products)
  const ethnicGroups = [
    { title: 'White & Maroon Resham Embroidered Kurta & Pant Set', files: ['IMG-20261102-WA0445.jpg.jpeg', 'IMG-20261102-WA2002.jpg.jpeg', 'IMG-20261102-WA3156.jpg.jpeg', 'IMG-20261102-WA4876.jpg.jpeg', 'IMG-20261102-WA5604.jpg.jpeg', 'IMG-20261102-WA7700.jpg.jpeg', 'IMG-20261102-WA8548.jpg.jpeg'] },
    { title: 'Slate Blue Floral Embroidered Cotton Kurta & Pant Set', files: ['IMG-20261102-WA0599.jpg.jpeg', 'IMG-20261102-WA0768.jpg.jpeg', 'IMG-20261102-WA3448.jpg.jpeg', 'IMG-20261102-WA4671.jpg.jpeg', 'IMG-20261102-WA7505.jpg.jpeg'] },
    { title: 'Ivory White & Royal Blue Embroidered Kurta & Pant Set', files: ['IMG-20261102-WA0671.jpg.jpeg', 'IMG-20261102-WA3307.jpg.jpeg', 'IMG-20261102-WA5864.jpg.jpeg', 'IMG-20261102-WA9972.jpg.jpeg'] },
    { title: 'Teal Blue Botanical Print Kurta & Tapered Pant Set', files: ['IMG-20261102-WA0726.jpg.jpeg', 'IMG-20261102-WA2623.jpg.jpeg', 'IMG-20261102-WA5653.jpg.jpeg', 'IMG-20261102-WA7263.jpg.jpeg', 'IMG-20261102-WA8387.jpg.jpeg'] },
    { title: 'Ivory White & Emerald Green Embroidered Kurta & Pant Set', files: ['IMG-20261102-WA0834.jpg.jpeg', 'IMG-20261102-WA3558.jpg.jpeg', 'IMG-20261102-WA6199.jpg.jpeg', 'IMG-20261102-WA8626.jpg.jpeg'] },
    { title: 'Royal Maroon Velvet Zardozi Embroidered Kurta & Pant Set', files: ['IMG-20261102-WA1264.jpg.jpeg', 'IMG-20261102-WA4295.jpg.jpeg', 'IMG-20261102-WA5318.jpg.jpeg', 'IMG-20261102-WA8443.jpg.jpeg'] },
    { title: 'Desert Beige Tone-on-Tone Embroidered Kurta & Pant Set', files: ['IMG-20261102-WA1548.jpg.jpeg', 'IMG-20261102-WA4313.jpg.jpeg', 'IMG-20261102-WA7034.jpg.jpeg', 'IMG-20261102-WA7246.jpg.jpeg', 'IMG-20261102-WA7268.jpg.jpeg'] },
    { title: 'Dusty Mauve Embroidered Cotton Slub Kurta & Pant Set', files: ['IMG-20261102-WA1720.jpg.jpeg', 'IMG-20261102-WA4498.jpg.jpeg', 'IMG-20261102-WA7221.jpg.jpeg', 'IMG-20261102-WA7641.jpg.jpeg', 'IMG-20261102-WA8879.jpg.jpeg'] },
    { title: 'Deep Crimson Red Slub Cotton Kurta & Pant Set', files: ['IMG-20261102-WA0851.jpg.jpeg', 'IMG-20261102-WA2380.jpg.jpeg', 'IMG-20261102-WA5236.jpg.jpeg', 'IMG-20261102-WA7993.jpg.jpeg'] },
    { title: 'Earthy Cinnamon Brown Embroidered Kurta & Pant Set', files: ['IMG-20261102-WA2983.jpg.jpeg', 'IMG-20261102-WA5906.jpg.jpeg', 'IMG-20261102-WA8373.jpg.jpeg', 'IMG-20261102-WA9452.jpg.jpeg'] },
    { title: 'Sage Grey Self-Embroidered Kurta & Pant Set', files: ['IMG-20261102-WA3163.jpg.jpeg', 'IMG-20261102-WA6340.jpg.jpeg', 'IMG-20261102-WA9550.jpg.jpeg', 'IMG-20261102-WA9743.jpg.jpeg'] },
    { title: 'Ivory White & Jet Black Embroidered Kurta & Pant Set', files: ['IMG-20261102-WA1564.jpg.jpeg', 'IMG-20261102-WA4229.jpg.jpeg', 'IMG-20261102-WA4258.jpg.jpeg', 'IMG-20261102-WA7009.jpg.jpeg', 'IMG-20261102-WA7324.jpg.jpeg', 'IMG-20261102-WA9432.jpg.jpeg'] }
  ];

  // 2. Umbrella, Kaftan, Cord Set
  const umbrellaGroups = [
    {
      title: 'Royal Indigo Kalidar Flared Umbrella Dress',
      files: [
        'IMG-20261103-WA0172.jpg.jpeg',
        'IMG-20261103-WA0176.jpg.jpeg',
        'IMG-20261103-WA0178.jpg.jpeg',
        'IMG-20261103-WA0179.jpg.jpeg',
        'IMG-20261103-WA0180.jpg.jpeg',
        'IMG-20261103-WA0181.jpg.jpeg',
        'IMG-20261103-WA0182.jpg.jpeg',
        'IMG-20261103-WA0183.jpg.jpeg',
        'IMG-20261103-WA0187.jpg.jpeg',
        'IMG-20261103-WA0190.jpg.jpeg'
      ]
    },
    {
      title: 'Aria Ivory Tiered Floral Embroidered Grand Flare Umbrella Gown',
      files: [
        'IMG-20261103-WA0847.jpg.jpeg',
        'IMG-20261103-WA0969.jpg.jpeg',
        'IMG-20261103-WA4736.jpg.jpeg',
        'IMG-20261103-WA8111.jpg.jpeg'
      ]
    }
  ];

  const kaftanGroups = [
    {
      title: 'Sunburst Yellow & Indigo Shibori Tie-Dye Maxi Kaftan',
      files: [
        'IMG-20261103-WA1191.jpg.jpeg',
        'IMG-20261103-WA3164.jpg.jpeg',
        'IMG-20261103-WA5899.jpg.jpeg',
        'IMG-20261103-WA8575.jpg.jpeg'
      ]
    }
  ];

  const cordGroups = [
    {
      title: 'Midnight Black Fitted Crop Top & Bohemian Flared Maxi Skirt Set',
      files: [
        'IMG-20261103-WA0387.jpg.jpeg',
        'IMG-20261103-WA6234.jpg.jpeg',
        'IMG-20261103-WA9636.jpg.jpeg'
      ]
    }
  ];

  const specialFiles = new Set();
  [...umbrellaGroups, ...kaftanGroups, ...cordGroups].forEach(g => g.files.forEach(f => specialFiles.add(f)));

  const remaining20261103 = sigs.filter(s => s.date === '20261103' && !specialFiles.has(s.file));

  // Sort remaining Western images by WA number
  remaining20261103.sort((a,b) => a.waNum - b.waNum);

  // Cluster Western images with max size 5
  function clusterWesternBounded(items, threshold = 26, maxClusterSize = 5) {
    const clusters = [];
    const used = new Set();

    for (let i = 0; i < items.length; i++) {
      if (used.has(items[i].file)) continue;
      const group = [items[i]];
      used.add(items[i].file);

      for (let j = i + 1; j < items.length; j++) {
        if (group.length >= maxClusterSize) break;
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

  const wc = clusterWesternBounded(remaining20261103, 26, 5);
  console.log(`Bounded Western clusters (max 5): ${wc.length}`);
  const sz = {};
  wc.forEach(c => sz[c.length] = (sz[c.length] || 0) + 1);
  console.log('Cluster size distribution:', sz);

  let totalImgs = ethnicGroups.reduce((a,c)=>a+c.files.length, 0)
    + umbrellaGroups.reduce((a,c)=>a+c.files.length, 0)
    + kaftanGroups.reduce((a,c)=>a+c.files.length, 0)
    + cordGroups.reduce((a,c)=>a+c.files.length, 0)
    + wc.reduce((a,c)=>a+c.length, 0);

  console.log(`TOTAL IMAGES CLUSTERED: ${totalImgs} / ${files.length}`);
}

main().catch(console.error);
