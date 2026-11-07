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

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  const dressesDir = path.join(__dirname, '..', 'dresses-images');
  const allFiles = fs.readdirSync(dressesDir);
  console.log(`Starting processing for ${allFiles.length} images from dresses-images...`);

  // Create destination folders
  const targetDirs = {
    'ethnic-wear-sets': path.join(__dirname, '..', '3-piece-sets-all-product-image', 'dresses-images'),
    'umbrella-dresses': path.join(__dirname, '..', 'umbrella-dresses-all-product-image', 'dresses-images'),
    'short-long-kaftan': path.join(__dirname, '..', 'short-long-kaftan-all-product-images', 'dresses-images'),
    'cord-sets': path.join(__dirname, '..', 'cord-set-all-product-images', 'dresses-images'),
    'western-dresses': path.join(__dirname, '..', 'western-dresses-all-product-image', 'dresses-images'),
    'public-direct': path.join(__dirname, '..', 'public', 'dresses-images')
  };

  Object.values(targetDirs).forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Copy all files to public/dresses-images as well
  for (const f of allFiles) {
    const src = path.join(dressesDir, f);
    const dest = path.join(targetDirs['public-direct'], f);
    fs.copyFileSync(src, dest);
  }
  console.log(`Copied ${allFiles.length} files to public/dresses-images/`);

  // Extract signatures
  const sigs = [];
  for (const f of allFiles) {
    const s = await extractSignature(path.join(dressesDir, f));
    sigs.push(s);
  }

  // ==========================================
  // 1. ETHNIC WEAR SETS (12 products, 57 images)
  // ==========================================
  const ethnicProductDefs = [
    {
      title: 'White & Maroon Resham Embroidered Kurta & Pant Set',
      fabric: 'Pure Cotton Slub with Resham Kashmiri Work',
      badge: 'Heritage Craft',
      files: ['IMG-20261102-WA0445.jpg.jpeg', 'IMG-20261102-WA2002.jpg.jpeg', 'IMG-20261102-WA3156.jpg.jpeg', 'IMG-20261102-WA4876.jpg.jpeg', 'IMG-20261102-WA5604.jpg.jpeg', 'IMG-20261102-WA7700.jpg.jpeg', 'IMG-20261102-WA8548.jpg.jpeg']
    },
    {
      title: 'Slate Blue Floral Embroidered Cotton Kurta & Pant Set',
      fabric: 'Fine Cotton Twill with Pastel Resham Embroidery',
      badge: 'Export Bestseller',
      files: ['IMG-20261102-WA0599.jpg.jpeg', 'IMG-20261102-WA0768.jpg.jpeg', 'IMG-20261102-WA3448.jpg.jpeg', 'IMG-20261102-WA4671.jpg.jpeg', 'IMG-20261102-WA7505.jpg.jpeg']
    },
    {
      title: 'Ivory White & Royal Blue Embroidered Kurta & Pant Set',
      fabric: 'Premium Mulmul Cotton with Contrast Resham Threadwork',
      badge: 'New Arrival',
      files: ['IMG-20261102-WA0671.jpg.jpeg', 'IMG-20261102-WA3307.jpg.jpeg', 'IMG-20261102-WA5864.jpg.jpeg', 'IMG-20261102-WA9972.jpg.jpeg']
    },
    {
      title: 'Teal Blue Botanical Print Kurta & Tapered Pant Set',
      fabric: 'Breathable Slub Rayon with Precision Screen Print',
      badge: 'Wholesale Favorite',
      files: ['IMG-20261102-WA0726.jpg.jpeg', 'IMG-20261102-WA2623.jpg.jpeg', 'IMG-20261102-WA5653.jpg.jpeg', 'IMG-20261102-WA7263.jpg.jpeg', 'IMG-20261102-WA8387.jpg.jpeg']
    },
    {
      title: 'Ivory White & Emerald Green Embroidered Kurta & Pant Set',
      fabric: 'Chanderi Blend with Intricate Yoke Kashida Work',
      badge: 'Festive Edition',
      files: ['IMG-20261102-WA0834.jpg.jpeg', 'IMG-20261102-WA3558.jpg.jpeg', 'IMG-20261102-WA6199.jpg.jpeg', 'IMG-20261102-WA8626.jpg.jpeg']
    },
    {
      title: 'Royal Maroon Velvet Zardozi Embroidered Kurta & Pant Set',
      fabric: 'Luxe Micro-Velvet with Golden Tilla & Zardozi Motifs',
      badge: 'Royal Velvet',
      files: ['IMG-20261102-WA1264.jpg.jpeg', 'IMG-20261102-WA4295.jpg.jpeg', 'IMG-20261102-WA5318.jpg.jpeg', 'IMG-20261102-WA8443.jpg.jpeg']
    },
    {
      title: 'Desert Beige Tone-on-Tone Embroidered Kurta & Pant Set',
      fabric: 'Pure Cotton Linen Slub with Self Resham Work',
      badge: 'Boutique Exclusive',
      files: ['IMG-20261102-WA1548.jpg.jpeg', 'IMG-20261102-WA4313.jpg.jpeg', 'IMG-20261102-WA7034.jpg.jpeg', 'IMG-20261102-WA7246.jpg.jpeg', 'IMG-20261102-WA7268.jpg.jpeg']
    },
    {
      title: 'Dusty Mauve Embroidered Cotton Slub Kurta & Pant Set',
      fabric: 'Premium 60s Cotton with Tonal Floral Neck Embroidery',
      badge: 'Summer Pastel',
      files: ['IMG-20261102-WA1720.jpg.jpeg', 'IMG-20261102-WA4498.jpg.jpeg', 'IMG-20261102-WA7221.jpg.jpeg', 'IMG-20261102-WA7641.jpg.jpeg', 'IMG-20261102-WA8879.jpg.jpeg']
    },
    {
      title: 'Deep Crimson Red Slub Cotton Kurta & Pant Set',
      fabric: 'Handloom Texture Cotton with Geometric Thread Embroidery',
      badge: 'Wholesale Only',
      files: ['IMG-20261102-WA0851.jpg.jpeg', 'IMG-20261102-WA2380.jpg.jpeg', 'IMG-20261102-WA5236.jpg.jpeg', 'IMG-20261102-WA7993.jpg.jpeg']
    },
    {
      title: 'Earthy Cinnamon Brown Embroidered Kurta & Pant Set',
      fabric: 'Linen Slub with Tonal Floral Resham Work',
      badge: 'Autumn Edit',
      files: ['IMG-20261102-WA2983.jpg.jpeg', 'IMG-20261102-WA5906.jpg.jpeg', 'IMG-20261102-WA8373.jpg.jpeg', 'IMG-20261102-WA9452.jpg.jpeg']
    },
    {
      title: 'Sage Grey Self-Embroidered Kurta & Pant Set',
      fabric: 'Breathable Modal Cotton with Slub Texture',
      badge: 'Minimalist Luxe',
      files: ['IMG-20261102-WA3163.jpg.jpeg', 'IMG-20261102-WA6340.jpg.jpeg', 'IMG-20261102-WA9550.jpg.jpeg', 'IMG-20261102-WA9743.jpg.jpeg']
    },
    {
      title: 'Ivory White & Jet Black Embroidered Kurta & Pant Set',
      fabric: 'Fine Cambric Cotton with Dense Kashida Embroidery',
      badge: 'Monochrome Luxe',
      files: ['IMG-20261102-WA1564.jpg.jpeg', 'IMG-20261102-WA4229.jpg.jpeg', 'IMG-20261102-WA4258.jpg.jpeg', 'IMG-20261102-WA7009.jpg.jpeg', 'IMG-20261102-WA7324.jpg.jpeg', 'IMG-20261102-WA9432.jpg.jpeg']
    }
  ];

  // Copy ethnic files
  ethnicProductDefs.forEach(p => {
    p.files.forEach(f => {
      fs.copyFileSync(path.join(dressesDir, f), path.join(targetDirs['ethnic-wear-sets'], f));
    });
  });

  // Read existing ethnic wear sets
  const ethnicPath = path.join(__dirname, '..', 'data', 'ethnic-wear-sets.ts');
  const ethnicCode = fs.readFileSync(ethnicPath, 'utf8');
  const existingEthnic = JSON.parse(ethnicCode.match(/export const ETHNIC_WEAR_SETS: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/)[1]);
  const ethnicStartIndex = existingEthnic.length; // 77

  const newEthnicProducts = ethnicProductDefs.map((p, idx) => {
    const overallIndex = ethnicStartIndex + idx + 1; // 78, 79...
    const sku = `WST-EW-${100 + overallIndex}`;
    const id = `ew-${overallIndex.toString().padStart(3, '0')}`;
    const slug = `${slugify(p.title)}-${overallIndex}`;
    const images = p.files.map(f => `/ethnic-wear-sets/dresses-images/${f}`);
    const description = `The ${p.title} (${sku}) is an exceptional ensemble from Wastram's premier Ethnic Wear Sets wholesale collection. Crafted in ${p.fabric}, it features refined artisanal embroidery, coordinating tailored bottoms, and export-grade seam reinforcement, tailored for boutiques, retailers, and fashion distributors worldwide.`;
    const details = [
      'Coordinating 2-piece designer ensemble: Tailored Kurta and Straight Pant',
      `Handcrafted threadwork embroidery and reinforced hem finishing in ${p.fabric}`,
      'Available in assorted export size packs (XS-XXL)',
      'Flexible B2B wholesale MOQ: 20 pcs per style'
    ];
    return {
      id,
      title: p.title,
      slug,
      tab: 'ethnic-wear-sets',
      category: 'ethnic-wear-sets',
      badge: p.badge,
      regularPrice: 0,
      salePrice: 0,
      images,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description,
      fabric: p.fabric,
      details,
      moq: '20 pcs / Flexible Wholesale Pack',
      sku
    };
  });

  const combinedEthnic = [...existingEthnic, ...newEthnicProducts];
  fs.writeFileSync(
    ethnicPath,
    `// Auto-generated Ethnic Wear Sets catalogue dataset for B2B Wholesale\nimport { NishoramaProduct } from './nishorama-data';\n\nexport const ETHNIC_WEAR_SETS: NishoramaProduct[] = ${JSON.stringify(combinedEthnic, null, 2)};\n`,
    'utf8'
  );
  console.log(`Updated data/ethnic-wear-sets.ts: ${existingEthnic.length} -> ${combinedEthnic.length} products`);

  // ==========================================
  // 2. UMBRELLA DRESSES (2 products, 14 images)
  // ==========================================
  const umbrellaProductDefs = [
    {
      title: 'Royal Indigo Kalidar Flared Umbrella Maxi Dress',
      fabric: 'Pure Indigo Dabu Handloom Cotton with Sweep Flare',
      badge: 'Heritage Kalidar',
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
      fabric: 'Fine Chanderi Mulmul with Multi-Resham Floral Yoke',
      badge: 'Full Umbrella Flare',
      files: [
        'IMG-20261103-WA0847.jpg.jpeg',
        'IMG-20261103-WA0969.jpg.jpeg',
        'IMG-20261103-WA4736.jpg.jpeg',
        'IMG-20261103-WA8111.jpg.jpeg'
      ]
    }
  ];

  umbrellaProductDefs.forEach(p => {
    p.files.forEach(f => {
      fs.copyFileSync(path.join(dressesDir, f), path.join(targetDirs['umbrella-dresses'], f));
    });
  });

  const umbrellaPath = path.join(__dirname, '..', 'data', 'umbrella-dresses.ts');
  const umbrellaCode = fs.readFileSync(umbrellaPath, 'utf8');
  const existingUmbrella = JSON.parse(umbrellaCode.match(/export const UMBRELLA_DRESSES: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/)[1]);
  const umbrellaStartIndex = existingUmbrella.length; // 302

  const newUmbrellaProducts = umbrellaProductDefs.map((p, idx) => {
    const overallIndex = umbrellaStartIndex + idx + 1; // 303, 304
    const sku = `WST-UD-${100 + overallIndex}`;
    const id = `ud-${overallIndex.toString().padStart(3, '0')}`;
    const slug = `${slugify(p.title)}-${overallIndex}`;
    const images = p.files.map(f => `/umbrella-dresses/dresses-images/${f}`);
    const description = `The ${p.title} (${sku}) is an exquisite creation from Wastram's premier Umbrella Dresses wholesale export collection. Crafted in ${p.fabric}, it features a sweeping circular umbrella flare silhouette, exquisite artisanal finishes, and export-grade seam reinforcement, tailored for international boutiques, luxury summer retail, and high-end fashion distributors worldwide.`;
    const details = [
      'Full circular umbrella flare silhouette offering dramatic volume and graceful movement',
      `Tailored bodice with breathable cotton voile lining in ${p.fabric}`,
      'Available in assorted export size packs (XS-XXL)',
      'Flexible B2B wholesale MOQ: 20 pcs per style'
    ];
    return {
      id,
      title: p.title,
      slug,
      tab: 'umbrella-dresses',
      category: 'umbrella-dresses',
      badge: p.badge,
      regularPrice: 0,
      salePrice: 0,
      images,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description,
      fabric: p.fabric,
      details,
      moq: '20 pcs / Flexible Wholesale Pack',
      sku
    };
  });

  const combinedUmbrella = [...existingUmbrella, ...newUmbrellaProducts];
  fs.writeFileSync(
    umbrellaPath,
    `// Auto-generated Umbrella Dresses catalogue dataset for B2B Wholesale\nimport { NishoramaProduct } from './nishorama-data';\n\nexport const UMBRELLA_DRESSES: NishoramaProduct[] = ${JSON.stringify(combinedUmbrella, null, 2)};\n`,
    'utf8'
  );
  console.log(`Updated data/umbrella-dresses.ts: ${existingUmbrella.length} -> ${combinedUmbrella.length} products`);

  // ==========================================
  // 3. SHORT & LONG KAFTAN (1 product, 4 images)
  // ==========================================
  const kaftanProductDefs = [
    {
      title: 'Sunburst Yellow & Indigo Shibori Tie-Dye Maxi Kaftan',
      fabric: 'Fine Viscose Silk with Drawstring Waist and Side High-Slit',
      badge: 'Resort Edition',
      files: [
        'IMG-20261103-WA1191.jpg.jpeg',
        'IMG-20261103-WA3164.jpg.jpeg',
        'IMG-20261103-WA5899.jpg.jpeg',
        'IMG-20261103-WA8575.jpg.jpeg'
      ]
    }
  ];

  kaftanProductDefs.forEach(p => {
    p.files.forEach(f => {
      fs.copyFileSync(path.join(dressesDir, f), path.join(targetDirs['short-long-kaftan'], f));
    });
  });

  const kaftanPath = path.join(__dirname, '..', 'data', 'short-long-kaftan.ts');
  const kaftanCode = fs.readFileSync(kaftanPath, 'utf8');
  const existingKaftan = JSON.parse(kaftanCode.match(/export const SHORT_LONG_KAFTANS: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/)[1]);
  const kaftanStartIndex = existingKaftan.length; // 144

  const newKaftanProducts = kaftanProductDefs.map((p, idx) => {
    const overallIndex = kaftanStartIndex + idx + 1; // 145
    const sku = `WST-KF-${100 + overallIndex}`;
    const id = `kf-${overallIndex.toString().padStart(3, '0')}`;
    const slug = `${slugify(p.title)}-${overallIndex}`;
    const images = p.files.map(f => `/short-long-kaftan/dresses-images/${f}`);
    const description = `The ${p.title} (${sku}) is an export-grade resort wear kaftan from Wastram's luxury Kaftan wholesale collection. Crafted in ${p.fabric}, it features an airy silhouette with adjustable waist cinch, side leg opening, and reinforced seams for global commercial distribution.`;
    const details = [
      'Flowing full-length kaftan silhouette with adjustable tassel waist tie',
      `Artisanal tie-dye shibori pattern on breathable ${p.fabric}`,
      'Available in assorted export size packs (Free Size / XS-XXL)',
      'Flexible B2B wholesale MOQ: 20 pcs per style'
    ];
    return {
      id,
      title: p.title,
      slug,
      tab: 'short-long-kaftan',
      category: 'short-long-kaftan',
      badge: p.badge,
      regularPrice: 0,
      salePrice: 0,
      images,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description,
      fabric: p.fabric,
      details,
      moq: '20 pcs / Flexible Wholesale Pack',
      sku
    };
  });

  const combinedKaftan = [...existingKaftan, ...newKaftanProducts];
  fs.writeFileSync(
    kaftanPath,
    `// Auto-generated Short & Long Kaftan catalogue dataset for B2B Wholesale\nimport { NishoramaProduct } from './nishorama-data';\n\nexport const SHORT_LONG_KAFTANS: NishoramaProduct[] = ${JSON.stringify(combinedKaftan, null, 2)};\n`,
    'utf8'
  );
  console.log(`Updated data/short-long-kaftan.ts: ${existingKaftan.length} -> ${combinedKaftan.length} products`);

  // ==========================================
  // 4. CO-ORD SETS (1 product, 3 images)
  // ==========================================
  const cordProductDefs = [
    {
      title: 'Midnight Black Fitted Crop Top & Bohemian Flared Maxi Skirt Set',
      fabric: 'Stretch Rib Cotton Top with Printed Rayon Flared Maxi Skirt',
      badge: 'Co-ord Trend',
      files: [
        'IMG-20261103-WA0387.jpg.jpeg',
        'IMG-20261103-WA6234.jpg.jpeg',
        'IMG-20261103-WA9636.jpg.jpeg'
      ]
    }
  ];

  cordProductDefs.forEach(p => {
    p.files.forEach(f => {
      fs.copyFileSync(path.join(dressesDir, f), path.join(targetDirs['cord-sets'], f));
    });
  });

  const cordPath = path.join(__dirname, '..', 'data', 'cord-sets.ts');
  const cordCode = fs.readFileSync(cordPath, 'utf8');
  const existingCord = JSON.parse(cordCode.match(/export const CORD_SETS: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/)[1]);
  const cordStartIndex = existingCord.length; // 95

  const newCordProducts = cordProductDefs.map((p, idx) => {
    const overallIndex = cordStartIndex + idx + 1; // 96
    const sku = `WST-CS-${100 + overallIndex}`;
    const id = `cs-${overallIndex.toString().padStart(3, '0')}`;
    const slug = `${slugify(p.title)}-${overallIndex}`;
    const images = p.files.map(f => `/cord-sets/dresses-images/${f}`);
    const description = `The ${p.title} (${sku}) is an export-ready 2-piece skirt and top co-ord set designed for contemporary retail boutiques and resort fashion buyers. Built with ${p.fabric}, it combines modern minimalist tailoring with a sweeping ethnic-printed skirt.`;
    const details = [
      'Two-piece coordinating set: Fitted knit top and high-waist flared maxi skirt',
      'Comfort-stretch waistband with reinforced hemline',
      'Available in assorted export size packs (XS-XXL)',
      'Flexible B2B wholesale MOQ: 20 pcs per style'
    ];
    return {
      id,
      title: p.title,
      slug,
      tab: 'cord-sets',
      category: 'cord-sets',
      badge: p.badge,
      regularPrice: 0,
      salePrice: 0,
      images,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description,
      fabric: p.fabric,
      details,
      moq: '20 pcs / Flexible Wholesale Pack',
      sku
    };
  });

  const combinedCord = [...existingCord, ...newCordProducts];
  fs.writeFileSync(
    cordPath,
    `// Auto-generated Co-ord Sets catalogue dataset for B2B Wholesale\nimport { NishoramaProduct } from './nishorama-data';\n\nexport const CORD_SETS: NishoramaProduct[] = ${JSON.stringify(combinedCord, null, 2)};\n`,
    'utf8'
  );
  console.log(`Updated data/cord-sets.ts: ${existingCord.length} -> ${combinedCord.length} products`);

  // ==========================================
  // 5. WESTERN DRESSES (Remaining 204 images)
  // ==========================================
  const specialFiles = new Set();
  ethnicProductDefs.forEach(g => g.files.forEach(f => specialFiles.add(f)));
  umbrellaProductDefs.forEach(g => g.files.forEach(f => specialFiles.add(f)));
  kaftanProductDefs.forEach(g => g.files.forEach(f => specialFiles.add(f)));
  cordProductDefs.forEach(g => g.files.forEach(f => specialFiles.add(f)));

  const remainingWesternSigs = sigs.filter(s => s.date === '20261103' && !specialFiles.has(s.file));
  remainingWesternSigs.sort((a, b) => a.waNum - b.waNum);

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

  const westernClusters = clusterWesternBounded(remainingWesternSigs, 26, 5);
  console.log(`Clustered ${remainingWesternSigs.length} Western images into ${westernClusters.length} products.`);

  // Copy Western files to western-dresses-all-product-image/dresses-images
  westernClusters.forEach(c => {
    c.forEach(item => {
      fs.copyFileSync(path.join(dressesDir, item.file), path.join(targetDirs['western-dresses'], item.file));
    });
  });

  const westernTitles = [
    'Aria Yellow Embroidered Bohemian Notch-Neck Tunic Dress',
    'Sienna Lime Green Bishop-Sleeve Embroidered Dress',
    'Zephyr Midnight Black & Crimson Lotus Print Midi Dress',
    'Elena White Embroidered Peasant Balloon-Sleeve Dress',
    'Kyoto Olive Green Tiered Smocked Sundress',
    'Milan Minimalist Botanical Leaf Print Rayon Dress',
    'Orion Ivory White Embroidered Peasant Mini Dress',
    'Nova Sunset Pink & Gold Tie-Dye Collared Shirt Dress',
    'Rowan White Tiered Bohemian Mini Dress with Black Threadwork',
    'Zuri Black & White Graphic Tile Printed Sundress',
    'Elysia Sage Green Halter Backless Tiered Maxi Dress',
    'Vesper Grey & Coral Floral Gathered Midi Dress',
    'Astrid Crimson Red Kashmiri Embroidered Tunic Dress',
    'Terra Red Printed Bohemian Summer Sundress',
    'Luxe White Poppy Embroidered Linen A-Line Dress',
    'Solstice Turquoise Shibori Tie-Dye Halter Sundress',
    'Blakely Royal Blue Hand-Dyed Tunic Dress',
    'Emerson Cobalt Blue Shibori Halter Sundress',
    'Oslo Cream & Emerald Floral Embroidered Dress',
    'Vance Golden Amber Tie-Dye Casual Dress',
    'Reese Black & White Peacock Motif Flared Sundress',
    'Cruz Royal Navy Angrakha Wrap Flared Dress',
    'Harlow Rich Maroon & Golden Ombre Tiered Maxi Dress',
    'Kenzo Crimson Micro-Print Bohemian Dress',
    'Sage Turquoise & Amber Tie-Dye Shirt Dress',
    'Dallas Sage Green Tunic Dress with Magenta Threadwork',
    'Nico Black Graphic Abstract Floral Midi Dress',
    'Indie Hot Pink Embroidered Notch-Neck Sundress',
    'Marlow Imperial Purple Bohemian Tiered Sundress',
    'Bodhi Multi-Color Rainbow Tie-Dye Sundress',
    'Sora Earthy Brown Smocked Bodice Flared Dress',
    'Remi Olive Green Botanical Print Midi Dress',
    'Eden Grey Sand Abstract Batik Print Dress',
    'Atlas Indigo Navy Tie-Dye Tunic Dress',
    'Juno Cobalt Blue Shibori Checkered Midi Dress',
    'Phoenix Amber Ochre Printed Cap-Sleeve Dress',
    'Lennon Royal Blue Embroidered V-Neck Tunic Dress',
    'Cairo Dusty Peach Tiered Ruffle Mini Dress',
    'Milo Warm Rust Embroidered Bohemian Tiered Dress',
    'Shiloh White Embroidered Tassel-Tie Boho Mini Dress',
    'Jasper Multi-Pattern Smocked Bodice Midi Dress',
    'Dune Cream Embroidered Victorian Long-Sleeve Dress',
    'River Ocean Blue Printed Sheath Midi Dress',
    'Zenith Amethyst Purple Paisley Print Maxi Dress',
    'Aura Indigo Tie-Dye A-Line Casual Dress',
    'Coralie Coral Pink Tiered Summer Sundress',
    'Breezy Seafoam Linen Slub Midi Dress',
    'Karisma Hand-Dyed Cotton Voile Shirt Dress',
    'Melina Floral Embroidered Georgette Sundress',
    'Nalani Bohemian Printed Cotton Maxi Dress',
    'Saffron Embroidered Folk Tunic Dress',
    'Verona Tiered Smocked Rayon Midi Dress',
    'Zahara Moroccan Tile Print Slip Dress',
    'Amira Vintage Washed Linen Sundress',
    'Belle Blue Shibori Flared Midi Dress',
    'Calla Ivory Cutwork Cotton Mini Dress',
    'Delphine Sage Botanical Print Shift Dress',
    'Evie Rust Orange Smocked Bohemian Dress',
    'Fleur Pastel Floral Georgette Tiered Dress',
    'Gia Aztec Pattern Linen Blend Dress',
    'Haven Smocked Yoke Cotton Sundress',
    'Iris Cobalt Blue Hand-Block Print Dress',
    'Joli Sunflower Yellow Embroidered Tunic Dress',
    'Kiran Royal Navy Printed Shirt Dress',
    'Lila Lavender Tiered Flared Maxi Dress',
    'Mira Bohemian Folk Embroidered Dress',
    'Nadia Golden Mustard Linen Sundress',
    'Opaline Pure Cotton Pintuck Tunic Dress',
    'Paloma Vintage Indigo Wrap Midi Dress',
    'Quinn Olive Drab Tiered Linen Dress',
    'Raya Sunset Orange Embroidered Peasant Dress',
    'Serena Multi-Stripe Cotton Voile Dress',
    'Talia Floral Trellis Printed Slip Dress',
    'Uma Dusty Cedar Smocked Midi Dress',
    'Vida Emerald Tile Print Flared Dress',
    'Wren Classic White Schiffli Lace Dress',
    'Xanthe Terracotta Printed Bohemian Dress'
  ];

  const westernFabrics = [
    'Pure Cotton 60:60 with Enzyme Soft Wash',
    'Premium Viscose Rayon with Breathable Drape',
    'Lustrous Crepe Silk with Micro-Pleat Details',
    'Belgian Linen Slub with Pre-Shrunk Finish',
    'Flowing Viscose Georgette with Butter Crepe Lining',
    'Fine Cotton Voile with Artisanal Hand-Dyed Finish',
    'Pure Mulmul Cotton with Slub Texture',
    'Cambric Cotton with Reinforced Seam Construction'
  ];

  const westernBadges = [
    'Export Bestseller',
    'Wholesale Only',
    'New Design',
    'Boutique Exclusive',
    'Summer Edit',
    'Trending Style',
    'Resort Collection',
    'Fast Seller'
  ];

  const westernPath = path.join(__dirname, '..', 'data', 'western-dresses.ts');
  const westernCode = fs.readFileSync(westernPath, 'utf8');
  const existingWestern = JSON.parse(westernCode.match(/export const WESTERN_DRESSES: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/)[1]);
  const westernStartIndex = existingWestern.length; // 173

  const newWesternProducts = westernClusters.map((cluster, idx) => {
    const overallIndex = westernStartIndex + idx + 1; // 174...
    const sku = `WST-WD-${100 + overallIndex}`;
    const id = `wd-${overallIndex.toString().padStart(3, '0')}`;
    const baseTitle = westernTitles[idx % westernTitles.length];
    const edition = Math.floor(idx / westernTitles.length) + 1;
    const title = edition > 1 ? `${baseTitle} (Edition ${edition})` : baseTitle;
    const slug = `${slugify(title)}-${overallIndex}`;
    const fabric = westernFabrics[idx % westernFabrics.length];
    const badge = westernBadges[idx % westernBadges.length];
    const images = cluster.map(item => `/western-dresses/dresses-images/${item.file}`);
    const description = `The ${title} (${sku}) is an export-grade women's Western dress crafted for international boutiques, retailers, and private label brands. Built with ${fabric}, it features an elegant tailored fit, premium lining, and reinforced seam work for global commercial distribution.`;
    const details = [
      'Export-grade precision stitching and hem finishing',
      `Breathable, colorfast fabrication in ${fabric}`,
      'Available in assorted size packs (XS-XXL)',
      'Flexible B2B wholesale MOQ: 20 pcs per style'
    ];
    return {
      id,
      title,
      slug,
      tab: 'western-dresses',
      category: 'western-dresses',
      badge,
      regularPrice: 0,
      salePrice: 0,
      images,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description,
      fabric,
      details,
      moq: '20 pcs / Flexible Wholesale Pack',
      sku
    };
  });

  const combinedWestern = [...existingWestern, ...newWesternProducts];
  fs.writeFileSync(
    westernPath,
    `// Auto-generated Western Dresses catalogue dataset for B2B Wholesale\nimport { NishoramaProduct } from './nishorama-data';\n\nexport const WESTERN_DRESSES: NishoramaProduct[] = ${JSON.stringify(combinedWestern, null, 2)};\n`,
    'utf8'
  );
  console.log(`Updated data/western-dresses.ts: ${existingWestern.length} -> ${combinedWestern.length} products`);

  // ==========================================
  // 6. UPDATE HEADER, MOBILE DRAWER, NISHORAMA DATA
  // ==========================================
  const totalSiteStyles = combinedEthnic.length + combinedUmbrella.length + combinedKaftan.length + combinedCord.length + combinedWestern.length + 94 + 123 + 51 + 44 + 144;
  console.log(`TOTAL SITE STYLES: ${totalSiteStyles}`);

  // Header.tsx
  const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
  let headerCode = fs.readFileSync(headerPath, 'utf8');
  headerCode = headerCode.replace(/All 1,200\+ Styles/g, 'All 1,300+ Styles');
  fs.writeFileSync(headerPath, headerCode, 'utf8');
  console.log('Updated Header.tsx to All 1,300+ Styles');

  // MobileNavDrawer.tsx
  const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
  let drawerCode = fs.readFileSync(drawerPath, 'utf8');
  drawerCode = drawerCode.replace(/ALL 1,200\+ STYLES/g, 'ALL 1,300+ STYLES');
  fs.writeFileSync(drawerPath, drawerCode, 'utf8');
  console.log('Updated MobileNavDrawer.tsx to ALL 1,300+ STYLES');

  // nishorama-data.ts stories
  const nishoPath = path.join(__dirname, '..', 'data', 'nishorama-data.ts');
  let nishoCode = fs.readFileSync(nishoPath, 'utf8');
  nishoCode = nishoCode.replace(/75\+ Regal 3-Piece Sets/g, '85+ Regal 3-Piece Sets');
  fs.writeFileSync(nishoPath, nishoCode, 'utf8');
  console.log('Updated data/nishorama-data.ts stories');

  console.log('\n--- ALL CATALOGUE INTEGRATION COMPLETED SUCCESSFULLY! ---');
}

main().catch(console.error);
