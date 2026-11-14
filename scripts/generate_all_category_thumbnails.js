const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 800;
const H = 1120;

const ALL_10_CATEGORIES = [
  {
    slug: 'ethnic-wear-sets',
    title: 'Ethnic Wear Sets',
    source: 'public/ethnic-wear-sets/dresses-images/IMG-20261102-WA0445.jpg.jpeg',
    outName: 'cat-ethnic-wear-sets.webp',
    threshold: 28,
    feather: 20,
    fitPosition: 'top'
  },
  {
    slug: 'western-dresses',
    title: 'Western Dresses',
    source: 'public/nishorama-images/product-dress-HERO-AI.jpg',
    outName: 'cat-western-dresses.webp',
    threshold: 25,
    feather: 20,
    fitPosition: 'center'
  },
  {
    slug: 'umbrella-dresses',
    title: 'Umbrella Dresses',
    source: 'public/umbrella-dresses/4896.jpg.jpeg',
    outName: 'cat-umbrella-dresses.webp',
    threshold: 30,
    feather: 22,
    fitPosition: 'center'
  },
  {
    slug: 'denim-collection',
    title: 'Denim Collection',
    source: 'public/denim-collection/IMG-20261102-WA0865.jpg.jpeg',
    outName: 'cat-denim-collection.webp',
    threshold: 26,
    feather: 20,
    fitPosition: 'top'
  },
  {
    slug: 'cord-sets',
    title: 'Co-ord Sets',
    source: 'public/nishorama-images/product-alha-hero-AI.jpg',
    outName: 'cat-cord-sets.webp',
    threshold: 28,
    feather: 20,
    fitPosition: 'center'
  },
  {
    slug: 'short-long-kaftan',
    title: 'Resort Kaftans',
    source: 'public/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
    outName: 'cat-short-long-kaftan.webp',
    threshold: 30,
    feather: 20,
    fitPosition: 'center'
  },
  {
    slug: 'traditional-gowns',
    title: 'Traditional Gowns',
    source: 'public/traditional-gowns/16668.jpg.jpeg',
    outName: 'cat-traditional-gowns.webp',
    threshold: 32,
    feather: 22,
    fitPosition: 'center'
  },
  {
    slug: 'tops-shirts',
    title: 'Tops & Shirts',
    source: 'public/nishorama-images/product-noor-hero-ai_e76547a0-cc33-4e0c-a14e-43708ca67de7.jpg',
    outName: 'cat-tops-shirts.webp',
    threshold: 26,
    feather: 20,
    fitPosition: 'center'
  },
  {
    slug: 'hoodies-sweatshirts',
    title: 'Hoodies & Sweatshirts',
    source: 'public/hoodies-sweatshirts/16885.jpg.jpeg',
    outName: 'cat-hoodies-sweatshirts.webp',
    threshold: 25,
    feather: 18,
    fitPosition: 'center'
  },
  {
    slug: 't-shirts',
    title: 'T-Shirts',
    source: 'public/t-shirts/16381.jpg.jpeg',
    outName: 'cat-t-shirts.webp',
    threshold: 25,
    feather: 18,
    fitPosition: 'center'
  }
];

function createBackdropSvg(title) {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ambientGlow" cx="50%" cy="45%" r="48%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
          <stop offset="70%" stop-color="#FAF9F6" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#FAF9F6" stop-opacity="0"/>
        </radialGradient>
      </defs>
      
      <!-- Pure constant site background -->
      <rect width="${W}" height="${H}" fill="#FAF9F6"/>
      <rect width="${W}" height="${H}" fill="url(#ambientGlow)"/>
      
      <!-- Architectural Jaipuri arched vault outline -->
      <path d="M 80 ${H} L 80 340 A 320 320 0 0 1 720 340 L 720 ${H}" fill="#F5F3ED" fill-opacity="0.45" stroke="#E6E2D8" stroke-width="1.5"/>
      <path d="M 105 ${H} L 105 358 A 295 295 0 0 1 695 358 L 695 ${H}" fill="none" stroke="#D4AF37" stroke-opacity="0.32" stroke-width="0.75" stroke-dasharray="4 4"/>
      
      <!-- Subtle luxury studio floor plinth line -->
      <line x1="60" y1="${H - 52}" x2="${W - 60}" y2="${H - 52}" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1"/>
      <text x="${W / 2}" y="${H - 24}" font-family="serif" font-size="11" font-style="italic" fill="#0B2D7F" text-anchor="middle" letter-spacing="4" opacity="0.65">WASTRAM ATELIER • JAIPUR</text>
    </svg>
  `;
}

async function processCategory(cat, emblemBuffer) {
  const rootDir = path.resolve(__dirname, '..');
  const inputPath = path.join(rootDir, cat.source);
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    return;
  }

  const isPureWhite = cat.slug === 'hoodies-sweatshirts' || cat.slug === 't-shirts';

  const resizedBuffer = await sharp(inputPath)
    .resize(W, H, isPureWhite ? { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } } : { fit: 'cover', position: cat.fitPosition || 'center' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data } = resizedBuffer;

  const bgR = isPureWhite ? 255 : (data[0] + data[(W - 1) * 4] + data[20 * 4] + data[(W - 20) * 4]) / 4;
  const bgG = isPureWhite ? 255 : (data[1] + data[(W - 1) * 4 + 1] + data[20 * 4 + 1] + data[(W - 20) * 4 + 1]) / 4;
  const bgB = isPureWhite ? 255 : (data[2] + data[(W - 1) * 4 + 2] + data[20 * 4 + 2] + data[(W - 20) * 4 + 2]) / 4;

  const threshold = cat.threshold || 28;
  const feather = cat.feather || 20;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const diff = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
      const edgeDist = Math.min(x, W - 1 - x, y, H - 1 - y);

      const isFloor = !isPureWhite && y > H - 120 && (x < 180 || x > W - 180);

      if (diff <= threshold || isFloor) {
        data[idx + 3] = 0;
      } else if (diff < threshold + feather) {
        const t = (diff - threshold) / feather;
        data[idx + 3] = Math.round(255 * t);
      } else {
        data[idx + 3] = 255;
      }

      if (edgeDist < (isPureWhite ? 4 : 8)) {
        data[idx + 3] = 0;
      }
    }
  }

  const isolatedModelBuffer = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toBuffer();

  const svg = createBackdropSvg(cat.title);

  const outDir = path.join(rootDir, 'public/images/categories');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, cat.outName);

  await sharp(Buffer.from(svg))
    .composite([
      {
        input: emblemBuffer,
        top: 55,
        left: W - 185,
        blend: 'over'
      },
      {
        input: isolatedModelBuffer,
        top: 0,
        left: 0,
        blend: 'over'
      }
    ])
    .webp({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(outPath);

  console.log(`Successfully generated: ${cat.outName}`);
}

async function run() {
  const rootDir = path.resolve(__dirname, '..');
  const emblemSrc = path.join(rootDir, 'public/images/brand/wastram-emblem-transparent.png');
  const emblemBuffer = await sharp(emblemSrc)
    .resize(130, 130, { fit: 'contain' })
    .toBuffer();

  console.log('Generating all 10 Category Thumbnails...');
  for (const cat of ALL_10_CATEGORIES) {
    await processCategory(cat, emblemBuffer);
  }
  console.log('All 10 Category Thumbnails Generated Successfully!');
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { run, ALL_10_CATEGORIES };
