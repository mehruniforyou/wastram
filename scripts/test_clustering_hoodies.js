const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'hoodies-sweatshirts-all-product-images');
const allFiles = fs.readdirSync(dir);

console.log('Total files in directory:', allFiles.length);

const products = [];

// 1. Numeric groups
const numericClusters = [
  { range: [16885, 16889], name: 'Heavyweight Boxy Fleece Hoodie' },
  { range: [16890, 16894], name: 'Vintage Acid-Wash Oversized Sweatshirt' },
  { range: [16895, 16899], name: 'Drop-Shoulder French Terry Pullover' },
  { range: [16900, 16904], name: 'Brushed Cotton Kangaroo Pocket Hoodie' },
  { range: [16905, 16909], name: 'Ribbed Trim Relaxed Crewneck Sweatshirt' },
  { range: [16910, 16913], name: 'Garment-Dyed Minimalist Fleece Hoodie' },
  { range: [16914, 16918], name: 'Clean Edge Heavy French Terry Sweatshirt' },
  { range: [16919, 16923], name: 'Raglan Sleeve Export Streetwear Hoodie' },
  { range: [16924, 16927], name: 'Washed Pastel Graphic Print Pullover' },
  { range: [16928, 16930], name: 'Double-Stitched Heavy Fleece Sweatshirt' },
  { range: [16931, 16935], name: 'Classic Streetwear Oversized Hoodie' },
  { range: [16936, 16940], name: 'Subtle Graphic Embroidered Pullover' },
  { range: [16941, 16944], name: 'Athletic Brushed Cotton Crew Sweatshirt' },
  { range: [16945, 16948], name: 'Warm-Toned Earthy Tone Heavy Hoodie' },
  { range: [16949, 16951], name: 'Thermal Lined Streetwear Fleece Pullover' }
];

for (const c of numericClusters) {
  const images = [];
  for (let n = c.range[0]; n <= c.range[1]; n++) {
    const f = `${n}.jpg.jpeg`;
    if (!fs.existsSync(path.join(dir, f))) {
      console.error(`File missing: ${f}`);
    }
    images.push(`/hoodies-sweatshirts/${f}`);
  }
  products.push({ name: c.name, images });
}

// 2. FB groups
const fbClusters = [
  {
    name: 'Export Raw-Edge Oversized Hoodie',
    files: [
      'FB_IMG_1793535753908.jpg.jpeg',
      'FB_IMG_1793535755888.jpg.jpeg',
      'FB_IMG_1793535757844.jpg.jpeg',
      'FB_IMG_1793535759691.jpg.jpeg'
    ]
  },
  {
    name: 'Washed French Terry Graphic Pullover',
    files: [
      'FB_IMG_1793535768703.jpg.jpeg',
      'FB_IMG_1793535770628.jpg.jpeg',
      'FB_IMG_1793535772469.jpg.jpeg',
      'FB_IMG_1793535774414.jpg.jpeg'
    ]
  },
  {
    name: 'Cozy Fleece Pocket Relaxed Sweatshirt',
    files: [
      'FB_IMG_1793535776298.jpg.jpeg',
      'FB_IMG_1793535778331.jpg.jpeg',
      'FB_IMG_1793535780274.jpg.jpeg',
      'FB_IMG_1793535782092.jpg.jpeg'
    ]
  }
];

for (const c of fbClusters) {
  const images = [];
  for (const f of c.files) {
    if (!fs.existsSync(path.join(dir, f))) {
      console.error(`File missing: ${f}`);
    }
    images.push(`/hoodies-sweatshirts/${f}`);
  }
  products.push({ name: c.name, images });
}

// 3. Hex multi-shot groups
const hexMulti = [
  {
    name: 'Premium Studio Boxy Cut Hoodie',
    files: [
      '5cbec775a0f32f4f73331b694757cdbb.jpg.jpeg',
      '5cbec775a0f32f4f73331b694757cdbb_1.jpg.jpeg',
      '5cbec775a0f32f4f73331b694757cdbb_2.jpg.jpeg'
    ]
  },
  {
    name: 'Essential Ribbed Cuff Fleece Sweatshirt',
    files: [
      'a4c71a3e354fef1cabdfa4c07f86aecf.jpg.jpeg',
      'a4c71a3e354fef1cabdfa4c07f86aecf_1.jpg.jpeg',
      'a4c71a3e354fef1cabdfa4c07f86aecf_2.jpg.jpeg'
    ]
  }
];

for (const c of hexMulti) {
  const images = [];
  for (const f of c.files) {
    if (!fs.existsSync(path.join(dir, f))) {
      console.error(`File missing: ${f}`);
    }
    images.push(`/hoodies-sweatshirts/${f}`);
  }
  products.push({ name: c.name, images });
}

// 4. Hex single-shot groups
const hexSingles = [
  '05f0493ca29232f8f185133c8fa9b6a7.jpg.jpeg',
  '0eaab8af0d3dcfa8ef0848387ca79b93.jpg.jpeg',
  '0f1d4f9a8712aefde424da5cd04f363d.jpg.jpeg',
  '1839e9e2eedb0439915b007ceef9ee83_1.jpg.jpeg',
  '2237a0df7f0dce89ab73ce0dc2b2655d.jpg.jpeg',
  '2f3db7a63a3fa0bfd5065cf543087f82_1.jpg.jpeg',
  '35b4089af9f3c5c467681ff33308dd20_1.jpg.jpeg',
  '37335e5e038a2396e7e4128169aa1d56.jpg.jpeg',
  '391bab0608ee2705b67e6cc51d94ddd3.jpg.jpeg',
  '3fde9df66507611c402c0089883f939f.jpg.jpeg',
  '46444ad3468548eb3239d1c9ca11e172.jpg.jpeg',
  '67d89e042487ec5da58debeb511243b4_1.jpg.jpeg',
  '6b55f74b2c23a818e656de0bd3479842.jpg.jpeg',
  '6e45bff49968fd60c720bc1f05f5df54.jpg.jpeg',
  '73b4def989ffc741687aef8c312cd4ac_1.jpg.jpeg',
  '775f7ff959045d0e9495e9301c1563c8.jpg.jpeg',
  '798d29b78bd6df65196a30f4bb6eb9a7.jpg.jpeg',
  '8fc98bca625be47c1c8bdeae714799ab.jpg.jpeg',
  '96cd2adf4641e8d7c4acb62ee06827d7.jpg.jpeg',
  '9c7d34b2fa2a00c93157318ccad30aab.jpg.jpeg',
  'a695f0cfb64ee7a04f808201d0caf078.jpg.jpeg',
  'a811d6868275ec7893c51ba1f408559a_1.jpg.jpeg',
  'effd48a6978428e5efe909ce904b55ee.jpg.jpeg',
  'faf97b35833ec28dda765b4399a003a6_1.jpg.jpeg'
];

hexSingles.forEach((f, idx) => {
  if (!fs.existsSync(path.join(dir, f))) {
    console.error(`File missing: ${f}`);
  }
  products.push({
    name: `Wholesale Catalog Fleece Pullover Style ${idx + 1}`,
    images: [`/hoodies-sweatshirts/${f}`]
  });
});

console.log(`Clustered ${products.length} products`);
let totalImages = 0;
const usedSet = new Set();
products.forEach(p => {
  totalImages += p.images.length;
  p.images.forEach(img => {
    const filename = path.basename(img);
    if (usedSet.has(filename)) {
      console.error(`Duplicate image used: ${filename}`);
    }
    usedSet.add(filename);
  });
});

console.log(`Total images across all products: ${totalImages}`);
console.log(`Unique images: ${usedSet.size}`);

const unused = allFiles.filter(f => !usedSet.has(f));
console.log(`Unused/orphan files: ${unused.length}`, unused);
