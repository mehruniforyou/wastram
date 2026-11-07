const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = path.join(__dirname, '..', 'umbrella-dresses-all-product-image', 'new-umbrella-dress');
  const files = fs.readdirSync(dir);

  console.log(`Processing ${files.length} images from new-umbrella-dress...`);

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

  console.log(`Clustered into ${clusters.length} products`);

  const titlesPool = [
    'Aria Artisanal Block-Printed Kalidar Umbrella Dress',
    'Sienna Belgian Linen Slub Tiered Umbrella Dress',
    'Zephyr Printed Mulmul Flared Umbrella Maxi Dress',
    'Kyoto Circular Chanderi Flared Umbrella Dress',
    'Milan Hand-Block Printed Cotton Umbrella Dress',
    'Orion Cascading Tiered Georgette Umbrella Dress',
    'Nova Floral Kalamkari Umbrella Anarkali Dress',
    'Rowan Royal Jaipuri Gota Patti Umbrella Dress',
    'Zuri Pastel Mulmul Summer Flare Umbrella Dress',
    'Elysia Chiffon Ombre Flared Umbrella Maxi',
    'Vesper Indigo Dabu Hand-Dyed Umbrella Dress',
    'Astrid Fine Chanderi Zari Bordered Umbrella Dress',
    'Terra Earth-Toned Ajrakh Print Umbrella Dress',
    'Luxe Silk Crepe Flared Festive Umbrella Gown',
    'Solstice Bohemian Tiered Ruffle Umbrella Dress',
    'Blakely Heritage Bandhani Kalidar Umbrella Dress',
    'Emerson Pure Cotton Voile Flared Umbrella Sundress',
    'Oslo Minimalist Solid Linen Umbrella Flare Dress',
    'Vance Handcrafted Bagru Print Umbrella Dress',
    'Reese Embroidered Yoke Chanderi Umbrella Maxi',
    'Cruz Golden Mukaish Work Georgette Umbrella Dress',
    'Harlow Smocked Bodice Flared Umbrella Dress',
    'Kenzo Sanganeri Block Print Tiered Umbrella Dress',
    'Sage Pastel Floral Organza Umbrella Dress',
    'Dallas Flared Bohemian Prairie Umbrella Dress',
    'Nico Layered Chiffon Circular Umbrella Dress',
    'Indie Vibrant Ikat Woven Cotton Umbrella Dress',
    'Marlow Flowing Rayon Twill Umbrella Maxi Dress',
    'Bodhi Royal Kalidar Anarkali Umbrella Dress',
    'Sora Breezy Summer Cotton Flared Umbrella Dress',
    'Remi Embroidered Mirror Work Umbrella Dress',
    'Eden Dual-Tone Ombre Tiered Umbrella Dress',
    'Atlas Vintage Floral Printed Umbrella Dress',
    'Juno Elegant High-Neck Umbrella Evening Dress',
    'Phoenix Festive Sequinned Net Umbrella Gown',
    'Lennon Flared Hem Casual Cotton Umbrella Dress',
    'Cairo Golden Thread Kalidar Umbrella Dress',
    'Milo Modern Minimalist Flared Umbrella Dress',
    'Shiloh Traditional Handloom Cotton Umbrella Dress',
    'Jasper Whimsical Tiered Ruffle Umbrella Dress',
    'Dune Dusty Rose Mulmul Umbrella Maxi Dress',
    'River Seafoam Green Chanderi Umbrella Dress',
    'Zenith Export Edition Grand Flare Umbrella Gown'
  ];

  const fabricsPool = [
    'Fine Chanderi Silk with Cotton Voile Lining',
    'Pure 60s Mulmul Cotton with Pre-Shrunk Finish',
    'Artisanal Hand-Block Printed 100% Slub Cotton',
    'Flowing Viscose Georgette with Butter Crepe Lining',
    'Belgian Linen Slub with Breathable Voile Underlayer',
    'Lightweight Chiffon with Micro-Pleated Umbrella Flare',
    'Pure Handloom Cotton with Vegetable Dye Finish',
    'Luxe Silk Crepe with Artisanal Drape'
  ];

  const badgesPool = [
    'Full Umbrella Flare',
    'Export Bestseller',
    'Pure Mulmul Cotton',
    'Chanderi Silk',
    'Hand-Block Printed',
    'Circular Kalidar',
    'Festive Edition',
    'New Drop',
    'Tiered Maxi Flare',
    'Boutique Exclusive'
  ];

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Read existing umbrella dresses
  const existingPath = path.join(__dirname, '..', 'data', 'umbrella-dresses.ts');
  const existingCode = fs.readFileSync(existingPath, 'utf8');
  // Extract JSON array
  const match = existingCode.match(/export const UMBRELLA_DRESSES: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/);
  let existingProducts = [];
  if (match) {
    existingProducts = JSON.parse(match[1]);
  } else {
    console.error('Could not parse existing UMBRELLA_DRESSES!');
    process.exit(1);
  }

  console.log(`Found ${existingProducts.length} existing umbrella dress products.`);

  const startIndex = existingProducts.length; // 31
  const newProducts = [];

  clusters.forEach((c, index) => {
    const overallIndex = startIndex + index + 1; // 32, 33, ...
    const sku = `WST-UD-${100 + overallIndex}`;
    const id = `ud-${overallIndex.toString().padStart(3, '0')}`;

    const baseTitle = titlesPool[index % titlesPool.length];
    const edition = Math.floor(index / titlesPool.length) + 1;
    const title = edition > 1 ? `${baseTitle} (Edition ${edition})` : baseTitle;
    const slug = `${slugify(title)}-${overallIndex}`;

    const fabric = fabricsPool[index % fabricsPool.length];
    const badge = badgesPool[index % badgesPool.length];

    const images = c.map(item => `/umbrella-dresses/new-umbrella-dress/${item.file}`);

    const desc = `The ${title} (${sku}) is an exquisite creation from Wastram's premier Umbrella Dresses wholesale export collection. Crafted in ${fabric}, it features a sweeping circular umbrella flare silhouette, exquisite artisanal finishes, and export-grade seam reinforcement, tailored for international boutiques, luxury summer retail, and high-end fashion distributors worldwide.`;

    const details = [
      `Full circular umbrella flare silhouette offering dramatic volume and graceful movement`,
      `Concealed side zipper and tailored bodice with breathable cotton lining in ${fabric}`,
      'Available in assorted export size packs (XS-XXL)',
      'Flexible B2B wholesale MOQ: 20 pcs per style / print'
    ];

    newProducts.push({
      id,
      title,
      slug,
      tab: 'umbrella-dresses',
      category: 'umbrella-dresses',
      badge,
      regularPrice: 0,
      salePrice: 0,
      images,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description: desc,
      fabric,
      details,
      moq: '20 pcs / Flexible Wholesale Pack',
      sku
    });
  });

  const combined = [...existingProducts, ...newProducts];
  console.log(`Total combined umbrella dress products: ${combined.length}`);

  const newTsContent = `// Auto-generated Umbrella Dresses catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const UMBRELLA_DRESSES: NishoramaProduct[] = ${JSON.stringify(combined, null, 2)};
`;

  fs.writeFileSync(existingPath, newTsContent, 'utf8');
  console.log(`Updated data/umbrella-dresses.ts with ${combined.length} products!`);
}

main().catch(console.error);
