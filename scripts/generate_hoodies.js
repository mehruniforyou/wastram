const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');

// Product definitions matching our exact clustering (44 products, 109 images)
const productClusters = [
  // 1-15: Numeric clusters (67 images)
  {
    title: 'Aria Heavyweight Brushed Cotton Boxy Hoodie',
    range: [16885, 16889],
    fabric: '380 GSM Heavyweight 100% Combed Cotton Brushed Fleece',
    badge: 'Heavyweight 380 GSM'
  },
  {
    title: 'Zephyr Vintage Acid-Washed Oversized Sweatshirt',
    range: [16890, 16894],
    fabric: '400 GSM Heavyweight Acid-Washed Loopback French Terry',
    badge: 'Acid Wash Vintage'
  },
  {
    title: 'Kaya Drop-Shoulder Diagonal French Terry Pullover',
    range: [16895, 16899],
    fabric: '420 GSM Luxury Diagonal Loopback Cotton Terry',
    badge: 'French Terry 420 GSM'
  },
  {
    title: 'Sienna Kangaroo Pocket Cozy Fleece Streetwear Hoodie',
    range: [16900, 16904],
    fabric: '380 GSM Carbon-Brushed Ultra-Soft Cotton Fleece',
    badge: 'Export Bestseller'
  },
  {
    title: 'Milan Ribbed Trim Relaxed Crewneck Sweatshirt',
    range: [16905, 16909],
    fabric: '360 GSM Heavy Combed Cotton Fleece with 2x2 Rib Hem',
    badge: 'Relaxed Street Fit'
  },
  {
    title: 'Orion Garment-Dyed Minimalist Heavy Fleece Hoodie',
    range: [16910, 16913],
    fabric: '400 GSM Garment-Dyed Pre-Shrunk Fleece',
    badge: 'Garment Dyed'
  },
  {
    title: 'Nova Clean-Edge Luxury French Terry Sweatshirt',
    range: [16914, 16918],
    fabric: '380 GSM High-Density Cotton Loopback French Terry',
    badge: 'Clean Minimalist'
  },
  {
    title: 'Rowan Raglan Sleeve Export Streetwear Pullover Hoodie',
    range: [16919, 16923],
    fabric: '390 GSM Raglan Double-Knit Cotton Fleece',
    badge: 'Raglan Sleeve'
  },
  {
    title: 'Zuri Washed Pastel Graphic Print French Terry Pullover',
    range: [16924, 16927],
    fabric: '360 GSM Pigment-Dyed French Terry Single Knit',
    badge: 'Pastel Streetwear'
  },
  {
    title: 'Elysia Double-Stitched Heavyweight Fleece Sweatshirt',
    range: [16928, 16930],
    fabric: '420 GSM Double-Face Brushed Cotton Blend',
    badge: 'Double-Stitched'
  },
  {
    title: 'Kyoto Classic Streetwear Relaxed Oversized Hoodie',
    range: [16931, 16935],
    fabric: '380 GSM Heavy Ring-Spun Cotton Fleece',
    badge: 'Japanese Street Fit'
  },
  {
    title: 'Vesper Subtle Graphic Embroidered Fleece Pullover',
    range: [16936, 16940],
    fabric: '370 GSM Combed Cotton Brushed Fleece',
    badge: 'High-Density Embroidery'
  },
  {
    title: 'Astrid Athletic Brushed Cotton Crewneck Sweatshirt',
    range: [16941, 16944],
    fabric: '360 GSM Athletic Sport Fleece with Anti-Pill Finish',
    badge: 'Anti-Pilling Fleece'
  },
  {
    title: 'Terra Warm-Toned Earthy Heavyweight Streetwear Hoodie',
    range: [16945, 16948],
    fabric: '400 GSM Mineral-Washed Organic Cotton Fleece',
    badge: 'Mineral Washed'
  },
  {
    title: 'Luxe Thermal-Lined Winter Fleece Streetwear Pullover',
    range: [16949, 16951],
    fabric: '450 GSM Heavy Thermal-Bonded Polar Cotton Fleece',
    badge: 'Thermal Winter 450 GSM'
  },

  // 16-18: FB clusters (12 images)
  {
    title: 'Solstice Export Raw-Edge Oversized Kangaroo Hoodie',
    files: [
      'FB_IMG_1793535753908.jpg.jpeg',
      'FB_IMG_1793535755888.jpg.jpeg',
      'FB_IMG_1793535757844.jpg.jpeg',
      'FB_IMG_1793535759691.jpg.jpeg'
    ],
    fabric: '380 GSM Heavyweight Ringspun Cotton Fleece',
    badge: 'Export Bestseller'
  },
  {
    title: 'Blakely Washed French Terry Vintage Graphic Pullover',
    files: [
      'FB_IMG_1793535768703.jpg.jpeg',
      'FB_IMG_1793535770628.jpg.jpeg',
      'FB_IMG_1793535772469.jpg.jpeg',
      'FB_IMG_1793535774414.jpg.jpeg'
    ],
    fabric: '400 GSM Heavy French Terry with Vintage Silicon Wash',
    badge: 'Silicon Washed'
  },
  {
    title: 'Emerson Cozy Fleece Front-Pocket Relaxed Sweatshirt',
    files: [
      'FB_IMG_1793535776298.jpg.jpeg',
      'FB_IMG_1793535778331.jpg.jpeg',
      'FB_IMG_1793535780274.jpg.jpeg',
      'FB_IMG_1793535782092.jpg.jpeg'
    ],
    fabric: '360 GSM Compact Brushed Cotton Poly Blend',
    badge: 'Cozy Fleece'
  },

  // 19-20: Hex multi-shot clusters (6 images)
  {
    title: 'Oslo Premium Studio Boxy Cut Brushed Hoodie',
    files: [
      '5cbec775a0f32f4f73331b694757cdbb.jpg.jpeg',
      '5cbec775a0f32f4f73331b694757cdbb_1.jpg.jpeg',
      '5cbec775a0f32f4f73331b694757cdbb_2.jpg.jpeg'
    ],
    fabric: '400 GSM Heavyweight Pure Cotton Studio Fleece',
    badge: 'Studio Boxy Fit'
  },
  {
    title: 'Vance Essential Ribbed Cuff Warm Fleece Sweatshirt',
    files: [
      'a4c71a3e354fef1cabdfa4c07f86aecf.jpg.jpeg',
      'a4c71a3e354fef1cabdfa4c07f86aecf_1.jpg.jpeg',
      'a4c71a3e354fef1cabdfa4c07f86aecf_2.jpg.jpeg'
    ],
    fabric: '380 GSM High-Tensile French Terry with Spandex Rib',
    badge: 'Essential Daily'
  },

  // 21-44: Hex single-shot clusters (24 images)
  {
    title: 'Reese Heavy Loopback Dropped Shoulder Crewneck',
    files: ['05f0493ca29232f8f185133c8fa9b6a7.jpg.jpeg'],
    fabric: '370 GSM Loopback French Terry Cotton',
    badge: 'Boutique Export'
  },
  {
    title: 'Cruz Heritage Acid-Wash Heavyweight Streetwear Hoodie',
    files: ['0eaab8af0d3dcfa8ef0848387ca79b93.jpg.jpeg'],
    fabric: '410 GSM Heavy Acid-Washed Cotton Fleece',
    badge: 'Heritage Vintage'
  },
  {
    title: 'Harlow Minimalist Clean Silhouette Fleece Pullover',
    files: ['0f1d4f9a8712aefde424da5cd04f363d.jpg.jpeg'],
    fabric: '360 GSM Carbon-Brushed Super-Soft Jersey Fleece',
    badge: 'Clean Minimalist'
  },
  {
    title: 'Kenzo Urban Relaxed Fit Heavy French Terry Hoodie',
    files: ['1839e9e2eedb0439915b007ceef9ee83_1.jpg.jpeg'],
    fabric: '390 GSM Urban Loopback Terry Cotton',
    badge: 'Urban Streetwear'
  },
  {
    title: 'Sage Carbon-Brushed Luxury Everyday Crewneck',
    files: ['2237a0df7f0dce89ab73ce0dc2b2655d.jpg.jpeg'],
    fabric: '380 GSM Carbon-Brushed 100% Combed Cotton',
    badge: 'Luxury Handfeel'
  },
  {
    title: 'Dallas Western Motif Vintage Washed Sweatshirt',
    files: ['2f3db7a63a3fa0bfd5065cf543087f82_1.jpg.jpeg'],
    fabric: '370 GSM Sun-Washed Vintage Cotton Terry',
    badge: 'Sun-Washed'
  },
  {
    title: 'Nico Premium Garment-Dyed Relaxed Boxy Hoodie',
    files: ['35b4089af9f3c5c467681ff33308dd20_1.jpg.jpeg'],
    fabric: '400 GSM Heavy Garment-Dyed Cotton Fleece',
    badge: 'Boxy Silhouette'
  },
  {
    title: 'Indie Street Culture Diagonal Terry Pullover',
    files: ['37335e5e038a2396e7e4128169aa1d56.jpg.jpeg'],
    fabric: '380 GSM Diagonal Knit French Terry Cotton',
    badge: 'Street Culture'
  },
  {
    title: 'Marlow Heavy Gauge Brushed Cotton Streetwear Hoodie',
    files: ['391bab0608ee2705b67e6cc51d94ddd3.jpg.jpeg'],
    fabric: '420 GSM Ultra-Heavy Brushed Fleece',
    badge: 'Ultra Heavy 420 GSM'
  },
  {
    title: 'Bodhi Minimal Monogram Graphic Fleece Sweatshirt',
    files: ['3fde9df66507611c402c0089883f939f.jpg.jpeg'],
    fabric: '360 GSM Bio-Washed Ring-Spun Cotton Fleece',
    badge: 'Monogram Print'
  },
  {
    title: 'Sora Japanese Street Style Heavyweight Hoodie',
    files: ['46444ad3468548eb3239d1c9ca11e172.jpg.jpeg'],
    fabric: '390 GSM Japanese-Looped Cotton Terry Fleece',
    badge: 'Tokyo Street'
  },
  {
    title: 'Remi Neutral Palette French Terry Crewneck',
    files: ['67d89e042487ec5da58debeb511243b4_1.jpg.jpeg'],
    fabric: '360 GSM Muted-Tone Natural French Terry',
    badge: 'Earth Tones'
  },
  {
    title: 'Eden Vintage Wash Heavyweight Kangaroo Pocket Hoodie',
    files: ['6b55f74b2c23a818e656de0bd3479842.jpg.jpeg'],
    fabric: '400 GSM Heavy Vintage-Washed Fleece',
    badge: 'Vintage Wash'
  },
  {
    title: 'Atlas Oversized Slouchy Streetwear Fleece Pullover',
    files: ['6e45bff49968fd60c720bc1f05f5df54.jpg.jpeg'],
    fabric: '380 GSM Slouchy Oversized Cotton Fleece',
    badge: 'Slouchy Fit'
  },
  {
    title: 'Juno Thermal Comfort Relaxed Crewneck Sweatshirt',
    files: ['73b4def989ffc741687aef8c312cd4ac_1.jpg.jpeg'],
    fabric: '370 GSM Thermal-Knit Lined Cotton Blend',
    badge: 'Thermal Comfort'
  },
  {
    title: 'Phoenix Embroidered Chest Detail Luxury Fleece Hoodie',
    files: ['775f7ff959045d0e9495e9301c1563c8.jpg.jpeg'],
    fabric: '390 GSM Luxury Cotton Fleece with Satin Stitching',
    badge: 'Chest Embroidery'
  },
  {
    title: 'Lennon Raw-Cut Hem Distressed Streetwear Sweatshirt',
    files: ['798d29b78bd6df65196a30f4bb6eb9a7.jpg.jpeg'],
    fabric: '380 GSM Distressed Heavy French Terry',
    badge: 'Distressed Hem'
  },
  {
    title: 'Cairo Golden Sand Heavyweight Loopback Terry Hoodie',
    files: ['8fc98bca625be47c1c8bdeae714799ab.jpg.jpeg'],
    fabric: '400 GSM Warm Sand Pigment-Dyed Loopback Cotton',
    badge: 'Pigment Dyed'
  },
  {
    title: 'Milo Downtown Boxy Dropped Shoulder Pullover',
    files: ['96cd2adf4641e8d7c4acb62ee06827d7.jpg.jpeg'],
    fabric: '360 GSM Boxy Drop-Shoulder Cotton Jersey',
    badge: 'Downtown Street'
  },
  {
    title: 'Shiloh Garment-Washed Heavy Fleece Relaxed Hoodie',
    files: ['9c7d34b2fa2a00c93157318ccad30aab.jpg.jpeg'],
    fabric: '390 GSM Soft Garment-Washed Cotton Fleece',
    badge: 'Soft Washed'
  },
  {
    title: 'Jasper Cozy Rib-Knit Hem Brushed Everyday Sweatshirt',
    files: ['a695f0cfb64ee7a04f808201d0caf078.jpg.jpeg'],
    fabric: '370 GSM Everyday Combed Cotton Fleece',
    badge: 'Everyday Classic'
  },
  {
    title: 'Dune Earth Tone Heavy Diagonal French Terry Hoodie',
    files: ['a811d6868275ec7893c51ba1f408559a_1.jpg.jpeg'],
    fabric: '410 GSM Diagonal Heavy Terry in Dune Tan',
    badge: 'Dune Edition'
  },
  {
    title: 'River Washed Indigo Loopback Streetwear Sweatshirt',
    files: ['effd48a6978428e5efe909ce904b55ee.jpg.jpeg'],
    fabric: '380 GSM Indigo-Dyed Loopback French Terry',
    badge: 'Indigo Washed'
  },
  {
    title: 'Zenith Export Edition 420 GSM Ultra-Heavyweight Hoodie',
    files: ['faf97b35833ec28dda765b4399a003a6_1.jpg.jpeg'],
    fabric: '420 GSM Export-Grade Ultra-Heavyweight Cotton Fleece',
    badge: 'Export Edition 420 GSM'
  }
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const products = [];

productClusters.forEach((c, index) => {
  const numIndex = index + 1;
  const sku = `WST-HSW-${100 + numIndex}`;
  const id = `hsw-${numIndex.toString().padStart(3, '0')}`;
  const slug = `${slugify(c.title)}-${numIndex}`;

  let images = [];
  if (c.range) {
    for (let n = c.range[0]; n <= c.range[1]; n++) {
      images.push(`/hoodies-sweatshirts/${n}.jpg.jpeg`);
    }
  } else if (c.files) {
    images = c.files.map(f => `/hoodies-sweatshirts/${f}`);
  }

  const desc = `The ${c.title} (${sku}) is an export-grade streetwear essential from Wastram's premier Hoodies & Sweatshirts wholesale catalogue. Precision crafted in ${c.fabric}, it features a modern boxy drape, reinforced double-needle seam engineering, pre-shrunk anti-pill finishing, and ribbed hems designed for high-turnover boutique retail, streetwear brands, and global wholesale distribution.`;

  const details = [
    `Crafted in ${c.fabric} with high-density double-needle reinforced construction`,
    'Pre-shrunk anti-pill finish with zero torquing and permanent shape retention',
    'Assorted export packaging across standard size breakdown (XS, S, M, L, XL, XXL)',
    'Flexible B2B wholesale MOQ: 20 pcs per style / custom export packaging available'
  ];

  products.push({
    id,
    title: c.title,
    slug,
    tab: 'hoodies-sweatshirts',
    category: 'hoodies-sweatshirts',
    badge: c.badge,
    regularPrice: 0,
    salePrice: 0,
    images,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: desc,
    fabric: c.fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  });
});

const tsContent = `// Auto-generated Hoodies & Sweatshirts catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const HOODIES_SWEATSHIRTS: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'hoodies-sweatshirts.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');
console.log(`Generated data/hoodies-sweatshirts.ts with ${products.length} products!`);
