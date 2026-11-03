const fs = require('fs');
const path = require('path');

// 1. Update data/nishorama-data.ts - Remove ORIGINAL_PRODUCTS completely
const dataPath = path.join(__dirname, '..', 'data', 'nishorama-data.ts');
let dataCode = fs.readFileSync(dataPath, 'utf8');

// Replace the entire ORIGINAL_PRODUCTS array and export
const productArrayRegex = /const ORIGINAL_PRODUCTS: NishoramaProduct\[\] = \[[\s\S]*?\n\];\s*export const NISHORAMA_PRODUCTS: NishoramaProduct\[\] = \[[\s\S]*?\n\];/;

const newProductsExport = `export const NISHORAMA_PRODUCTS: NishoramaProduct[] = [
  ...WESTERN_DRESSES
];`;

if (productArrayRegex.test(dataCode)) {
  dataCode = dataCode.replace(productArrayRegex, newProductsExport);
  console.log('Removed ORIGINAL_PRODUCTS array from nishorama-data.ts');
} else {
  console.warn('Could not regex match ORIGINAL_PRODUCTS in nishorama-data.ts');
}

// Update NISHORAMA_STORIES to use real western dress images
dataCode = dataCode.replace(
  /export const NISHORAMA_STORIES = \[[\s\S]*?\n\];/,
  `export const NISHORAMA_STORIES = [
  {
    id: 1,
    title: 'WESTERN DRESSES',
    image: '/western-dresses/1668.jpg.jpeg',
    subtitle: '170+ Export Designs',
    tag: 'NEW'
  },
  {
    id: 2,
    title: 'TIERED MAXI',
    image: '/western-dresses/5494.jpg.jpeg',
    subtitle: 'Silk Crepe & Georgette',
    tag: 'BESTSELLER'
  },
  {
    id: 3,
    title: 'SLIP & COWL',
    image: '/western-dresses/10096.jpg.jpeg',
    subtitle: 'Evening & Occasion',
    tag: 'TRENDING'
  },
  {
    id: 4,
    title: 'RESORT WEAR',
    image: '/western-dresses/10426.jpg.jpeg',
    subtitle: 'Boutique Collection',
    tag: 'WHOLESALE'
  }
];`
);

// Update NISHORAMA_POPULAR_SEARCHES to Western Dresses
dataCode = dataCode.replace(
  /export const NISHORAMA_POPULAR_SEARCHES = \{[\s\S]*?\n\};/,
  `export const NISHORAMA_POPULAR_SEARCHES = {
  'Western Dresses': [
    { text: 'All Western Dresses', href: '/collections/western-dresses' },
    { text: 'Maxi Dresses', href: '/collections/maxi-dresses' },
    { text: 'Midi Dresses', href: '/collections/midi-dress' },
    { text: 'Mini Dresses', href: '/collections/mini-dress' },
    { text: 'Slip Dresses', href: '/collections/western-dresses' },
    { text: 'Tiered Dresses', href: '/collections/western-dresses' }
  ],
  'Silhouettes': [
    { text: 'Cowl Neck Slip', href: '/collections/western-dresses' },
    { text: 'Cutout Halter', href: '/collections/western-dresses' },
    { text: 'Ruched Bodycon', href: '/collections/western-dresses' },
    { text: 'Fluted Hem Midi', href: '/collections/western-dresses' },
    { text: 'Puff Sleeve Flounce', href: '/collections/western-dresses' }
  ],
  'Export Collections': [
    { text: 'Shop All (170+ Styles)', href: '/collections/shop-all' },
    { text: 'Export Bestsellers', href: '/collections/most-wanted' },
    { text: 'New Arrivals 2026', href: '/collections/new-in' }
  ],
  'Wholesale Information': [
    { text: 'About Wastram Wholesale', href: '/pages/about-us' },
    { text: 'Export & Shipping Terms', href: '/pages/refund-policy' },
    { text: 'Buyer FAQs', href: '/pages/faqs' },
    { text: 'Contact Export Desk', href: '/pages/contact' }
  ]
};`
);

fs.writeFileSync(dataPath, dataCode, 'utf8');
console.log('Saved nishorama-data.ts without Nishorama products!');

// 2. Update ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
let gridCode = fs.readFileSync(gridPath, 'utf8');

const oldGridState = /const tabs: \{[\s\S]*?\} = \[[\s\S]*?\];\s*const currentProducts = NISHORAMA_PRODUCTS\.filter\(p => p\.tab === activeTab\);/;

const newGridState = `const tabs = [
    { id: 'all', label: 'All Western Dresses' },
    { id: 'bestsellers', label: 'Export Bestsellers' },
    { id: 'maxi', label: 'Maxi Dresses' },
    { id: 'midi', label: 'Midi Dresses' },
    { id: 'slip', label: 'Slip & Halter' }
  ];

  const currentProducts = NISHORAMA_PRODUCTS.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'bestsellers') return p.badge === 'Export Bestseller';
    if (activeTab === 'maxi') return p.title.includes('Maxi');
    if (activeTab === 'midi') return p.title.includes('Midi');
    if (activeTab === 'slip') return p.title.includes('Slip') || p.title.includes('Halter');
    return p.tab === activeTab;
  }).slice(0, 16);`;

gridCode = gridCode.replace(oldGridState, newGridState);
fs.writeFileSync(gridPath, gridCode, 'utf8');
console.log('Saved ProductFitsGrid.tsx with Western Dress tabs!');

// 3. Update CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
let catCode = fs.readFileSync(catPath, 'utf8');

const oldCategories = /const categories = \[[\s\S]*?\];\s*let filtered = selectedCategory === 'all'[\s\S]*?p\.tab === selectedCategory\);/;

const newCategories = `const categories = [
    { id: 'all', label: 'All Western Dresses' },
    { id: 'maxi', label: 'Maxi Dresses' },
    { id: 'midi', label: 'Midi Dresses' },
    { id: 'slip', label: 'Slip & Halter' },
    { id: 'tiered', label: 'Tiered & Wrap' }
  ];

  let filtered = NISHORAMA_PRODUCTS.filter(p => {
    if (selectedCategory === 'all' || selectedCategory === 'western-dresses' || selectedCategory === 'shop-all') return true;
    if (selectedCategory === 'maxi' || selectedCategory === 'maxi-dresses') return p.title.includes('Maxi');
    if (selectedCategory === 'midi' || selectedCategory === 'midi-dress') return p.title.includes('Midi');
    if (selectedCategory === 'slip') return p.title.includes('Slip') || p.title.includes('Halter');
    if (selectedCategory === 'tiered') return p.title.includes('Tiered') || p.title.includes('Wrap');
    if (selectedCategory === 'most-wanted') return p.badge === 'Export Bestseller';
    return p.category === selectedCategory || p.tab === selectedCategory;
  });`;

catCode = catCode.replace(oldCategories, newCategories);
fs.writeFileSync(catPath, catCode, 'utf8');
console.log('Saved CollectionsCatalogue.tsx with Western Dress categories!');

// 4. Update Header.tsx nav links
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
let headerCode = fs.readFileSync(headerPath, 'utf8');

const oldHeaderNav = /<nav className="flex items-center gap-1\.5 font-archivo text-xs font-medium text-\[#482922\]">[\s\S]*?<\/nav>/;

const newHeaderNav = `<nav className="flex items-center gap-1.5 font-archivo text-xs font-medium text-[#482922]">
            <Link
              href="/collections/western-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00]"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/maxi-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              Maxi Dresses
            </Link>
            <Link
              href="/collections/midi-dress"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              Midi Dresses
            </Link>
            <Link
              href="/collections/most-wanted"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              <span>Bestsellers</span>
              <span className="cust-red-dot" />
            </Link>
            <Link
              href="/collections/shop-all"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              All 170+ Styles
            </Link>
          </nav>`;

headerCode = headerCode.replace(oldHeaderNav, newHeaderNav);
fs.writeFileSync(headerPath, headerCode, 'utf8');
console.log('Saved Header.tsx with Western Dress navigation!');

// 5. Update FeatureCategories.tsx
const featurePath = path.join(__dirname, '..', 'components', 'FeatureCategories.tsx');
let featureCode = fs.readFileSync(featurePath, 'utf8');

const oldFeatures = /const categories = \[[\s\S]*?\];/;

const newFeatures = `const categories = [
    {
      title: 'WESTERN DRESSES',
      image: '/western-dresses/1668.jpg.jpeg',
      href: '/collections/western-dresses'
    },
    {
      title: 'TIERED MAXI',
      image: '/western-dresses/5494.jpg.jpeg',
      href: '/collections/maxi-dresses'
    },
    {
      title: 'CHIC SLIP & MIDI',
      image: '/western-dresses/10096.jpg.jpeg',
      href: '/collections/midi-dress'
    },
    {
      title: 'EXPORT BESTSELLERS',
      image: '/western-dresses/10426.jpg.jpeg',
      href: '/collections/most-wanted'
    }
  ];`;

featureCode = featureCode.replace(oldFeatures, newFeatures);
fs.writeFileSync(featurePath, featureCode, 'utf8');
console.log('Saved FeatureCategories.tsx with Western Dress photography!');

// 6. Update HeroSection.tsx
const heroPath = path.join(__dirname, '..', 'components', 'HeroSection.tsx');
let heroCode = fs.readFileSync(heroPath, 'utf8');

// Replace desktop hero headlines
heroCode = heroCode.replace(
  /<p className="text-\[0\.8vw\] font-archivo uppercase tracking-widest text-black\/70 font-light mb-1">[\s\S]*?<\/p>/,
  `<p className="text-[0.8vw] font-archivo uppercase tracking-widest text-black/70 font-bold mb-1">
            [ DIRECT MANUFACTURER & EXPORT ]
          </p>`
);

heroCode = heroCode.replace(
  /<h1 className="text-\[3\.2vw\] font-black font-archivo tracking-\[-2px\] text-\[#FF2F00\] uppercase leading-none drop-shadow-sm">[\s\S]*?<\/h1>/,
  `<h1 className="text-[3.2vw] font-black font-archivo tracking-[-2px] text-[#FF2F00] uppercase leading-none drop-shadow-sm">
            WESTERN DRESSES WHOLESALE
          </h1>`
);

heroCode = heroCode.replace(
  /<p className="text-\[2\.2vw\] font-bold font-archivo tracking-\[-0\.1vw\] text-white drop-shadow-md mt-1 mb-4">[\s\S]*?<\/p>/,
  `<p className="text-[1.8vw] font-bold font-archivo text-white drop-shadow-md mt-1 mb-4">
            Over 170+ Contemporary Silhouettes • Worldwide Cargo Dispatch
          </p>`
);

// Replace mobile hero headlines
heroCode = heroCode.replace(
  /<h2 className="text-\[8vw\] font-black text-\[#FF2F00\] uppercase leading-none font-archivo">[\s\S]*?<\/h2>/,
  `<h2 className="text-[8vw] font-black text-[#FF2F00] uppercase leading-none font-archivo">
              WESTERN DRESSES
            </h2>`
);

heroCode = heroCode.replace(
  /<p className="text-\[4\.5vw\] font-bold text-white mb-4 font-archivo">[\s\S]*?<\/p>/,
  `<p className="text-[3.8vw] font-bold text-white mb-4 font-archivo">
              170+ Export Designs • MOQ 20 pcs
            </p>`
);

fs.writeFileSync(heroPath, heroCode, 'utf8');
console.log('Saved HeroSection.tsx with B2B Western Dress copy!');

// 7. Update AnnouncementBar.tsx
const barPath = path.join(__dirname, '..', 'components', 'AnnouncementBar.tsx');
let barCode = fs.readFileSync(barPath, 'utf8');

barCode = barCode.replace(
  /<span className="font-black text-\[#FF2F00\] text-sm tracking-wider uppercase">DIWALI SALE<\/span>[\s\S]*?UP TO[\s\S]*?50%[\s\S]*?OFF[\s\S]*?<\/span>/,
  `<span className="font-black text-[#FF2F00] text-sm tracking-wider uppercase">WHOLESALE & EXPORT</span>
          <span className="text-white/40">|</span>
          <span className="text-xs text-white/90">
            FOB / CIF QUOTES AVAILABLE
          </span>`
);

barCode = barCode.replace(
  '10% OFF Automatically Applied on Orders ₹2,599+',
  'Worldwide Doorstep Air & Sea Cargo Dispatch • UK, USA, EU & Gulf'
);

barCode = barCode.replace(
  /<span className="font-black text-\[#FF2F00\] tracking-wider uppercase">DIWALI SALE<\/span>[\s\S]*?UP TO[\s\S]*?50%[\s\S]*?OFF[\s\S]*?<\/span>/,
  `<span className="font-black text-[#FF2F00] tracking-wider uppercase">WHOLESALE & EXPORT</span>
          <span className="text-white/40">|</span>
          <span className="text-white/90">
            FOB / CIF QUOTES AVAILABLE
          </span>`
);

fs.writeFileSync(barPath, barCode, 'utf8');
console.log('Saved AnnouncementBar.tsx with Wholesale details!');
