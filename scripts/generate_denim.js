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

    const shouldGroup = current.length < 4 && sameDate && (
      (waDelta <= 15 && colorDist < 35) ||
      (waDelta <= 60 && colorDist < 20)
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

  console.log(`Clustering created ${clusters.length} products`);

  const titlesPool = [
    'Aria High-Rise Vintage Flared Denim Jeans',
    'Sienna Wide-Leg Rigid Cotton Denim',
    'Zephyr Acid-Washed Barrel Leg Denim Pants',
    'Kyoto Raw Indigo Selvedge Denim Trousers',
    'Milan Relaxed Tapered Boyfriend Fit Jeans',
    'Orion Distressed Straight Leg Street Denim',
    'Nova Clean-Cut High-Waisted Dark Indigo Denim',
    'Rowan Cargo Utility Pocket Relaxed Denim Jeans',
    'Zuri Stone-Washed Slouchy Skate Denim',
    'Elysia Tailored Wide-Leg Pleated Denim Trousers',
    'Vesper Mineral-Washed Cropped Raw Hem Jeans',
    'Astrid Whisker-Faded Slim Straight Denim',
    'Terra Earth-Toned Overdyed Carpenter Jeans',
    'Luxe Dual-Tone Patchwork Streetwear Denim',
    'Solstice Classic Mom-Fit Washed Indigo Jeans',
    'Blakely Heavy Duty 14 Oz Selvedge Straight Denim',
    'Emerson Ultra-Comfort Stretch Flare Leg Jeans',
    'Oslo Minimalist Washed Grey Tapered Denim',
    'Vance Vintage Medium Wash Relaxed Jeans',
    'Reese High-Waist Bootcut Clean Finish Denim',
    'Cruz Washed Black Urban Skater Denim Pants',
    'Harlow Double-Knee Workwear Utility Denim',
    'Kenzo Japanese Kuroki Loom Selvedge Denim',
    'Sage Bleached Acid Wash Street Relaxed Denim',
    'Dallas Western Yoke Stitching Classic Jeans',
    'Nico 90s Low-Rise Baggy Fit Denim Pants',
    'Indie Distressed Knee Slash Straight Denim',
    'Marlow Classic Mid-Blue Rinse Straight Leg Jeans',
    'Bodhi Clean Indigo Darted Hem Wide Denim',
    'Sora Sand-Blasted Vintage Whiskered Jeans',
    'Remi High-Rise Paperbag Waist Denim Trousers',
    'Eden Deep Ocean Indigo Relaxed Trouser Jeans',
    'Atlas Heavy Gauge Rigid 13.5 Oz Vintage Jeans',
    'Juno Comfort Flex High-Rise Ankle Length Denim',
    'Phoenix Embroidered Back-Pocket Streetwear Denim',
    'Lennon Distressed Raw-Edge Bootcut Jeans',
    'Cairo Sun-Dusted Tan Overdyed Denim Pants',
    'Milo Downtown Baggy Relaxed Fit Denim',
    'Shiloh Garment-Washed Soft Drape Denim Trousers',
    'Jasper Classic 5-Pocket Everyday Straight Jeans',
    'Dune Mineral Sand Wash Relaxed Cargo Denim',
    'River Ocean Blue Stone-Washed Flared Jeans',
    'Zenith Export Edition 14 Oz Selvedge Denim'
  ];

  const fabricsPool = [
    '13.5 Oz 100% Rigid Ring-Spun Cotton Denim',
    '12 Oz Comfort Stretch Indigo Denim (98% Cotton / 2% Spandex)',
    '14 Oz Authentic Shuttle-Loom Selvedge Denim',
    '11.5 Oz Enzyme Stone-Washed Slub Cotton Denim',
    '13 Oz Mineral-Washed Overdyed Vintage Denim',
    '12.5 Oz High-Density Acid-Washed Cotton Denim',
    '13 Oz Ring-Spun Left-Hand Twill Cotton Denim',
    '12 Oz Eco-Washed Organic Cotton Indigo Denim'
  ];

  const badgesPool = [
    '13.5 Oz Rigid Denim',
    'Export Bestseller',
    'Comfort Stretch Denim',
    'Selvedge Denim',
    'Acid Washed',
    'Vintage Indigo',
    'Stone Washed',
    'Wide Leg Fit',
    'Utility Cargo Denim',
    'High-Rise Flared',
    'New Drop'
  ];

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  const products = [];

  clusters.forEach((c, index) => {
    const numIndex = index + 1;
    const sku = `WST-DNM-${100 + numIndex}`;
    const id = `dnm-${numIndex.toString().padStart(3, '0')}`;

    const baseTitle = titlesPool[(numIndex - 1) % titlesPool.length];
    const title = numIndex > titlesPool.length ? `${baseTitle} (Edition ${Math.ceil(numIndex / titlesPool.length)})` : baseTitle;
    const slug = `${slugify(title)}-${numIndex}`;

    const fabric = fabricsPool[(numIndex - 1) % fabricsPool.length];
    const badge = badgesPool[(numIndex - 1) % badgesPool.length];

    const images = c.map(item => `/denim-collection/${item.file}`);

    const desc = `The ${title} (${sku}) is an export-grade denim essential from Wastram's premier Denim Collection wholesale catalogue. Engineered in ${fabric}, it features reinforced copper rivets, high-tensile dual-needle felled seams, authentic enzyme stone-washing, and precision tailoring designed for high-turnover boutique retail, denim brands, and international department stores.`;

    const details = [
      `Crafted in ${fabric} with reinforced copper rivets and bar-tack stress points`,
      'Pre-shrunk enzyme wash with authentic hand-sanded whiskering and zero torquing',
      'Export pre-pack ratio across sizes (Waist 26, 28, 30, 32, 34, 36)',
      'Flexible B2B wholesale MOQ: 20 pcs per style / custom branding & leather patch options available'
    ];

    products.push({
      id,
      title,
      slug,
      tab: 'denim-collection',
      category: 'denim-collection',
      badge,
      regularPrice: 0,
      salePrice: 0,
      images,
      sizes: ['26', '28', '30', '32', '34', '36'],
      description: desc,
      fabric,
      details,
      moq: '20 pcs / Flexible Wholesale Pack',
      sku
    });
  });

  const tsContent = `// Auto-generated Denim Collection catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const DENIM_COLLECTION: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

  const outputPath = path.join(__dirname, '..', 'data', 'denim-collection.ts');
  fs.writeFileSync(outputPath, tsContent, 'utf8');
  console.log(`Generated data/denim-collection.ts with ${products.length} products!`);
}

main().catch(console.error);
