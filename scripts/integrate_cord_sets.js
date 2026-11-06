const fs = require('fs');
const path = require('path');

function replaceExactOrNorm(filePath, searchStr, replaceStr, label) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[${path.basename(filePath)}] Applied exact: ${label}`);
  } else {
    const normContent = content.replace(/\r\n/g, '\n');
    const normSearch = searchStr.replace(/\r\n/g, '\n');
    if (normContent.includes(normSearch)) {
      content = normContent.replace(normSearch, replaceStr.replace(/\r\n/g, '\n'));
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[${path.basename(filePath)}] Applied normalized: ${label}`);
    } else {
      console.warn(`[${path.basename(filePath)}] NOT matched: ${label}`);
    }
  }
}

// 1. data/nishorama-data.ts
const nishoPath = path.join(__dirname, '..', 'data', 'nishorama-data.ts');
let nishoContent = fs.readFileSync(nishoPath, 'utf8');

if (!nishoContent.includes("import { CORD_SETS }")) {
  nishoContent = nishoContent.replace(
    "import { TRADITIONAL_GOWNS } from './traditional-gowns';",
    "import { TRADITIONAL_GOWNS } from './traditional-gowns';\nimport { CORD_SETS } from './cord-sets';"
  );
  nishoContent = nishoContent.replace(
    "...TRADITIONAL_GOWNS",
    "...TRADITIONAL_GOWNS,\n  ...CORD_SETS"
  );
  
  // Add story
  const storyTarget = `    title: 'TRADITIONAL GOWNS',
    image: '/traditional-gowns/16668.jpg.jpeg',
    subtitle: 'Regal Kalidar Gowns',
    tag: 'ROYAL'
  }`;
  const storyReplacement = `    title: 'TRADITIONAL GOWNS',
    image: '/traditional-gowns/16668.jpg.jpeg',
    subtitle: 'Regal Kalidar Gowns',
    tag: 'ROYAL'
  },
  {
    id: 6,
    title: 'CO-ORD SETS',
    image: '/cord-sets/_MG_7607.JPG.jpeg',
    subtitle: '95+ Designer Sets',
    tag: 'NEW'
  }`;
  nishoContent = nishoContent.replace(storyTarget, storyReplacement);

  // Add popular searches
  const searchTarget = `export const NISHORAMA_POPULAR_SEARCHES = {`;
  const searchReplacement = `export const NISHORAMA_POPULAR_SEARCHES = {
  'Co-ord Sets': [
    { text: 'All Co-ord Sets', href: '/collections/cord-sets' },
    { text: 'Tailored Blazer Sets', href: '/collections/cord-sets' },
    { text: 'Linen Tunic & Trouser Sets', href: '/collections/cord-sets' },
    { text: 'Handcrafted Silk Sets', href: '/collections/cord-sets' },
    { text: 'Resort Wear Sets', href: '/collections/cord-sets' }
  ],`;
  nishoContent = nishoContent.replace(searchTarget, searchReplacement);

  fs.writeFileSync(nishoPath, nishoContent, 'utf8');
  console.log('[data/nishorama-data.ts] Integrated CORD_SETS, stories, and popular searches');
} else {
  console.log('[data/nishorama-data.ts] Already includes CORD_SETS');
}

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },
    { id: 'maxi', label: 'Maxi Dresses' },
    { id: 'anarkali-gowns', label: 'Anarkali Gowns' },
    { id: 'tiered', label: 'Tiered & Flared' }
  ];

  let filtered = NISHORAMA_PRODUCTS.filter(p => {
    if (selectedCategory === 'all' || selectedCategory === 'shop-all') return true;
    if (selectedCategory === 'western-dresses') return p.category === 'western-dresses';
    if (selectedCategory === 'traditional-gowns') return p.category === 'traditional-gowns';`;

const newCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },
    { id: 'maxi', label: 'Maxi Dresses' },
    { id: 'anarkali-gowns', label: 'Anarkali Gowns' },
    { id: 'tiered', label: 'Tiered & Flared' }
  ];

  let filtered = NISHORAMA_PRODUCTS.filter(p => {
    if (selectedCategory === 'all' || selectedCategory === 'shop-all') return true;
    if (selectedCategory === 'western-dresses') return p.category === 'western-dresses';
    if (selectedCategory === 'cord-sets' || selectedCategory === 'cord-set') return p.category === 'cord-sets';
    if (selectedCategory === 'traditional-gowns') return p.category === 'traditional-gowns';`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue Co-ord Sets categories and filter');

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },
    { id: 'bestsellers', label: 'Export Bestsellers' },
    { id: 'maxi', label: 'Maxi Dresses' },
    { id: 'anarkali', label: 'Anarkali Gowns' }
  ];

  const currentProducts = NISHORAMA_PRODUCTS.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'western-dresses') return p.category === 'western-dresses';
    if (activeTab === 'traditional-gowns') return p.category === 'traditional-gowns';`;

const newGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },
    { id: 'bestsellers', label: 'Export Bestsellers' },
    { id: 'maxi', label: 'Maxi Dresses' }
  ];

  const currentProducts = NISHORAMA_PRODUCTS.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'western-dresses') return p.category === 'western-dresses';
    if (activeTab === 'cord-sets') return p.category === 'cord-sets';
    if (activeTab === 'traditional-gowns') return p.category === 'traditional-gowns';`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid Co-ord Sets tabs and filter');

// 4. components/Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderLinks = `            <Link
              href="/collections/western-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00]"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/traditional-gowns"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Traditional Gowns ✦
            </Link>`;

const newHeaderLinks = `            <Link
              href="/collections/western-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00]"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/cord-sets"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Co-ord Sets ✦
            </Link>
            <Link
              href="/collections/traditional-gowns"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Traditional Gowns ✦
            </Link>`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx Co-ord Sets nav link');

// Update header total styles link
replaceExactOrNorm(headerPath, 'All 170+ Styles', 'All 360+ Styles', 'Header.tsx 360+ styles count');

// 5. components/MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerLinks = `            <li>
              <Link href="/collections/western-dresses" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold block">
                Western Dresses ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/traditional-gowns" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Traditional Gowns ✦
              </Link>
            </li>`;

const newDrawerLinks = `            <li>
              <Link href="/collections/western-dresses" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold block">
                Western Dresses ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/cord-sets" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Co-ord Sets ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/traditional-gowns" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Traditional Gowns ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer Co-ord Sets link');

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
const oldSearchTags = `  const popularTags = [
    'White Pants',`;
const newSearchTags = `  const popularTags = [
    'Co-ord Sets',
    'White Pants',`;
replaceExactOrNorm(searchPath, oldSearchTags, newSearchTags, 'SearchModal popular tags');

// 7. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 'cord-sets'")) {
  catPageCode = catPageCode.replace(
    "{ category: 'traditional-gowns' },",
    "{ category: 'cord-sets' },\n    { category: 'traditional-gowns' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('[app/collections/[category]/page.tsx] Added cord-sets static param to page.tsx');
} else {
  console.log('[app/collections/[category]/page.tsx] cord-sets static param already exists');
}
