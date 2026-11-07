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

if (!nishoContent.includes("import { T_SHIRTS }")) {
  nishoContent = nishoContent.replace(
    "import { UMBRELLA_DRESSES } from './umbrella-dresses';",
    "import { UMBRELLA_DRESSES } from './umbrella-dresses';\nimport { T_SHIRTS } from './t-shirts';"
  );
  nishoContent = nishoContent.replace(
    "...UMBRELLA_DRESSES",
    "...UMBRELLA_DRESSES,\n  ...T_SHIRTS"
  );
  
  // Add story
  const storyTarget = `    title: 'UMBRELLA DRESSES',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    subtitle: '30+ Flared Umbrella Styles',
    tag: 'NEW'
  }`;
  const storyReplacement = `    title: 'UMBRELLA DRESSES',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    subtitle: '30+ Flared Umbrella Styles',
    tag: 'NEW'
  },
  {
    id: 11,
    title: 'T-SHIRTS',
    image: '/t-shirts/13665.jpg.jpeg',
    subtitle: '50+ Heavyweight Streetwear Tees',
    tag: 'NEW'
  }`;
  nishoContent = nishoContent.replace(storyTarget, storyReplacement);

  // Add popular searches
  const searchTarget = `export const NISHORAMA_POPULAR_SEARCHES = {`;
  const searchReplacement = `export const NISHORAMA_POPULAR_SEARCHES = {
  'T-Shirts': [
    { text: 'All T-Shirts', href: '/collections/t-shirts' },
    { text: 'Heavyweight Oversized Tees', href: '/collections/t-shirts' },
    { text: 'Bio-Washed Crewneck T-Shirts', href: '/collections/t-shirts' },
    { text: 'Drop-Shoulder Boxy Tees', href: '/collections/t-shirts' },
    { text: 'Vintage Acid-Wash T-Shirts', href: '/collections/t-shirts' }
  ],`;
  nishoContent = nishoContent.replace(searchTarget, searchReplacement);

  fs.writeFileSync(nishoPath, nishoContent, 'utf8');
  console.log('[data/nishorama-data.ts] Integrated T_SHIRTS, stories, and popular searches');
} else {
  console.log('[data/nishorama-data.ts] Already includes T_SHIRTS');
}

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses' },`;

const newCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 't-shirts', label: 'T-Shirts' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses' },`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue T-Shirts categories list');

const oldCatFilter = `    if (selectedCategory === 'umbrella-dresses' || selectedCategory === 'umbrella') return p.category === 'umbrella-dresses';`;

const newCatFilter = `    if (selectedCategory === 't-shirts' || selectedCategory === 'tshirts' || selectedCategory === 'tee') return p.category === 't-shirts';
    if (selectedCategory === 'umbrella-dresses' || selectedCategory === 'umbrella') return p.category === 'umbrella-dresses';`;

replaceExactOrNorm(catPath, oldCatFilter, newCatFilter, 'CollectionsCatalogue T-Shirts filter logic');

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses' },`;

const newGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 't-shirts', label: 'T-Shirts' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses' },`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid T-Shirts tabs');

const oldGridFilter = `    if (activeTab === 'umbrella-dresses') return p.category === 'umbrella-dresses';`;

const newGridFilter = `    if (activeTab === 't-shirts') return p.category === 't-shirts';
    if (activeTab === 'umbrella-dresses') return p.category === 'umbrella-dresses';`;

replaceExactOrNorm(gridPath, oldGridFilter, newGridFilter, 'ProductFitsGrid T-Shirts filter logic');

// 4. components/Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderLinks = `            <Link
              href="/collections/western-dresses"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00] whitespace-nowrap shrink-0"
            >
              Western Dresses ✦
            </Link>`;

const newHeaderLinks = `            <Link
              href="/collections/western-dresses"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00] whitespace-nowrap shrink-0"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/t-shirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              T-Shirts ✦
            </Link>`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx T-Shirts nav link');

// Update header total styles count
replaceExactOrNorm(headerPath, 'All 730+ Styles', 'All 780+ Styles', 'Header.tsx 780+ styles count');

// 5. components/MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerLinks = `            <li>
              <Link href="/collections/western-dresses" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold block">
                Western Dresses ✦
              </Link>
            </li>`;

const newDrawerLinks = `            <li>
              <Link href="/collections/western-dresses" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold block">
                Western Dresses ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/t-shirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                T-Shirts ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer T-Shirts link');

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
const oldSearchTags = `  const popularTags = [
    'Umbrella Dresses',`;
const newSearchTags = `  const popularTags = [
    'T-Shirts',
    'Umbrella Dresses',`;
replaceExactOrNorm(searchPath, oldSearchTags, newSearchTags, 'SearchModal popular tags');

// 7. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 't-shirts'")) {
  catPageCode = catPageCode.replace(
    "{ category: 'umbrella-dresses' },",
    "{ category: 't-shirts' },\n    { category: 'umbrella-dresses' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('[app/collections/[category]/page.tsx] Added t-shirts static param to page.tsx');
} else {
  console.log('[app/collections/[category]/page.tsx] t-shirts static param already exists');
}
