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

if (!nishoContent.includes("import { DENIM_COLLECTION }")) {
  nishoContent = nishoContent.replace(
    "import { HOODIES_SWEATSHIRTS } from './hoodies-sweatshirts';",
    "import { HOODIES_SWEATSHIRTS } from './hoodies-sweatshirts';\nimport { DENIM_COLLECTION } from './denim-collection';"
  );
  nishoContent = nishoContent.replace(
    "...HOODIES_SWEATSHIRTS",
    "...HOODIES_SWEATSHIRTS,\n  ...DENIM_COLLECTION"
  );

  // Add story
  const storyTarget = `    title: 'HOODIES & SWEATSHIRTS',
    image: '/hoodies-sweatshirts/16885.jpg.jpeg',
    subtitle: '40+ Heavyweight Streetwear Hoodies',
    tag: 'NEW'
  }`;
  const storyReplacement = `    title: 'HOODIES & SWEATSHIRTS',
    image: '/hoodies-sweatshirts/16885.jpg.jpeg',
    subtitle: '40+ Heavyweight Streetwear Hoodies',
    tag: 'NEW'
  },
  {
    id: 13,
    title: 'DENIM COLLECTION',
    image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
    subtitle: '140+ Premium Rigid & Stretch Denim Styles',
    tag: 'NEW'
  }`;
  nishoContent = nishoContent.replace(storyTarget, storyReplacement);

  // Add popular searches
  const searchTarget = `export const NISHORAMA_POPULAR_SEARCHES = {`;
  const searchReplacement = `export const NISHORAMA_POPULAR_SEARCHES = {
  'Denim Collection': [
    { text: 'All Denim Collection', href: '/collections/denim-collection' },
    { text: 'High-Rise Vintage Flared Denim', href: '/collections/denim-collection' },
    { text: 'Wide-Leg Rigid Cotton Jeans', href: '/collections/denim-collection' },
    { text: 'Acid-Washed Barrel Leg Denim', href: '/collections/denim-collection' },
    { text: 'Raw Indigo Selvedge Denim Trousers', href: '/collections/denim-collection' }
  ],`;
  nishoContent = nishoContent.replace(searchTarget, searchReplacement);

  fs.writeFileSync(nishoPath, nishoContent, 'utf8');
  console.log('[data/nishorama-data.ts] Integrated DENIM_COLLECTION, story, and popular searches');
} else {
  console.log('[data/nishorama-data.ts] Already includes DENIM_COLLECTION');
}

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'hoodies-sweatshirts', label: 'Hoodies & Sweatshirts' },`;

const newCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'denim-collection', label: 'Denim Collection' },
    { id: 'hoodies-sweatshirts', label: 'Hoodies & Sweatshirts' },`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue Denim Collection categories list');

const oldCatFilter = `    if (selectedCategory === 'hoodies-sweatshirts' || selectedCategory === 'hoodies' || selectedCategory === 'sweatshirts' || selectedCategory === 'hoodie') return p.category === 'hoodies-sweatshirts';`;

const newCatFilter = `    if (selectedCategory === 'denim-collection' || selectedCategory === 'denim' || selectedCategory === 'jeans') return p.category === 'denim-collection';
    if (selectedCategory === 'hoodies-sweatshirts' || selectedCategory === 'hoodies' || selectedCategory === 'sweatshirts' || selectedCategory === 'hoodie') return p.category === 'hoodies-sweatshirts';`;

replaceExactOrNorm(catPath, oldCatFilter, newCatFilter, 'CollectionsCatalogue Denim Collection filter logic');

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'hoodies-sweatshirts', label: 'Hoodies & Sweatshirts' },`;

const newGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'denim-collection', label: 'Denim Collection' },
    { id: 'hoodies-sweatshirts', label: 'Hoodies & Sweatshirts' },`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid Denim Collection tabs');

const oldGridFilter = `    if (activeTab === 'hoodies-sweatshirts') return p.category === 'hoodies-sweatshirts';`;

const newGridFilter = `    if (activeTab === 'denim-collection') return p.category === 'denim-collection';
    if (activeTab === 'hoodies-sweatshirts') return p.category === 'hoodies-sweatshirts';`;

replaceExactOrNorm(gridPath, oldGridFilter, newGridFilter, 'ProductFitsGrid Denim Collection filter logic');

// 4. components/Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderLinks = `            <Link
              href="/collections/hoodies-sweatshirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Hoodies &amp; Sweatshirts ✦
            </Link>`;

const newHeaderLinks = `            <Link
              href="/collections/denim-collection"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Denim Collection ✦
            </Link>
            <Link
              href="/collections/hoodies-sweatshirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Hoodies &amp; Sweatshirts ✦
            </Link>`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx Denim Collection nav link');

// Update header total styles count
replaceExactOrNorm(headerPath, 'All 830+ Styles', 'All 970+ Styles', 'Header.tsx 970+ styles count');

// 5. components/MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerLinks = `            <li>
              <Link href="/collections/hoodies-sweatshirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Hoodies &amp; Sweatshirts ✦
              </Link>
            </li>`;

const newDrawerLinks = `            <li>
              <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Denim Collection ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/hoodies-sweatshirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Hoodies &amp; Sweatshirts ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer Denim Collection link');
replaceExactOrNorm(drawerPath, 'ALL 700+ STYLES', 'ALL 970+ STYLES', 'MobileNavDrawer 970+ styles count');

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
const oldSearchTags = `  const popularTags = [
    'Hoodies & Sweatshirts',`;
const newSearchTags = `  const popularTags = [
    'Denim Collection',
    'Hoodies & Sweatshirts',`;
replaceExactOrNorm(searchPath, oldSearchTags, newSearchTags, 'SearchModal popular tags');

// 7. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 'denim-collection'")) {
  catPageCode = catPageCode.replace(
    "{ category: 'hoodies-sweatshirts' },",
    "{ category: 'denim-collection' },\n    { category: 'denim' },\n    { category: 'hoodies-sweatshirts' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('[app/collections/[category]/page.tsx] Added denim-collection and denim static params');
} else {
  console.log('[app/collections/[category]/page.tsx] denim-collection static param already exists');
}
