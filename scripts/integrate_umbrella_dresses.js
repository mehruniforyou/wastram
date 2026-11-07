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

if (!nishoContent.includes("import { UMBRELLA_DRESSES }")) {
  nishoContent = nishoContent.replace(
    "import { SHORT_LONG_KAFTANS } from './short-long-kaftan';",
    "import { SHORT_LONG_KAFTANS } from './short-long-kaftan';\nimport { UMBRELLA_DRESSES } from './umbrella-dresses';"
  );
  nishoContent = nishoContent.replace(
    "...SHORT_LONG_KAFTANS",
    "...SHORT_LONG_KAFTANS,\n  ...UMBRELLA_DRESSES"
  );
  
  // Add story
  const storyTarget = `    title: 'SHORT & LONG KAFTAN',
    image: '/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
    subtitle: '140+ Resort & Maxi Kaftans',
    tag: 'NEW'
  }`;
  const storyReplacement = `    title: 'SHORT & LONG KAFTAN',
    image: '/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
    subtitle: '140+ Resort & Maxi Kaftans',
    tag: 'NEW'
  },
  {
    id: 10,
    title: 'UMBRELLA DRESSES',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    subtitle: '30+ Flared Umbrella Styles',
    tag: 'NEW'
  }`;
  nishoContent = nishoContent.replace(storyTarget, storyReplacement);

  // Add popular searches
  const searchTarget = `export const NISHORAMA_POPULAR_SEARCHES = {`;
  const searchReplacement = `export const NISHORAMA_POPULAR_SEARCHES = {
  'Umbrella Dresses': [
    { text: 'All Umbrella Dresses', href: '/collections/umbrella-dresses' },
    { text: 'Chanderi Kalidar Umbrella Dresses', href: '/collections/umbrella-dresses' },
    { text: 'Pure Mulmul Flared Dresses', href: '/collections/umbrella-dresses' },
    { text: 'Tiered Circular Umbrella Maxis', href: '/collections/umbrella-dresses' },
    { text: 'Block-Printed Umbrella Dresses', href: '/collections/umbrella-dresses' }
  ],`;
  nishoContent = nishoContent.replace(searchTarget, searchReplacement);

  fs.writeFileSync(nishoPath, nishoContent, 'utf8');
  console.log('[data/nishorama-data.ts] Integrated UMBRELLA_DRESSES, stories, and popular searches');
} else {
  console.log('[data/nishorama-data.ts] Already includes UMBRELLA_DRESSES');
}

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'short-long-kaftan', label: 'Short & Long Kaftan' },`;

const newCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses' },
    { id: 'short-long-kaftan', label: 'Short & Long Kaftan' },`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue Umbrella Dresses categories list');

const oldCatFilter = `    if (selectedCategory === 'short-long-kaftan' || selectedCategory === 'kaftans' || selectedCategory === 'kaftan') return p.category === 'short-long-kaftan';`;

const newCatFilter = `    if (selectedCategory === 'umbrella-dresses' || selectedCategory === 'umbrella') return p.category === 'umbrella-dresses';
    if (selectedCategory === 'short-long-kaftan' || selectedCategory === 'kaftans' || selectedCategory === 'kaftan') return p.category === 'short-long-kaftan';`;

replaceExactOrNorm(catPath, oldCatFilter, newCatFilter, 'CollectionsCatalogue Umbrella Dresses filter logic');

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'short-long-kaftan', label: 'Short & Long Kaftan' },`;

const newGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses' },
    { id: 'short-long-kaftan', label: 'Short & Long Kaftan' },`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid Umbrella Dresses tabs');

const oldGridFilter = `    if (activeTab === 'short-long-kaftan') return p.category === 'short-long-kaftan';`;

const newGridFilter = `    if (activeTab === 'umbrella-dresses') return p.category === 'umbrella-dresses';
    if (activeTab === 'short-long-kaftan') return p.category === 'short-long-kaftan';`;

replaceExactOrNorm(gridPath, oldGridFilter, newGridFilter, 'ProductFitsGrid Umbrella Dresses filter logic');

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
              href="/collections/umbrella-dresses"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Umbrella Dresses ✦
            </Link>`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx Umbrella Dresses nav link');

// Update header total styles count
replaceExactOrNorm(headerPath, 'All 700+ Styles', 'All 730+ Styles', 'Header.tsx 730+ styles count');

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
              <Link href="/collections/umbrella-dresses" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Umbrella Dresses ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer Umbrella Dresses link');

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
const oldSearchTags = `  const popularTags = [
    'Short & Long Kaftan',`;
const newSearchTags = `  const popularTags = [
    'Umbrella Dresses',
    'Short & Long Kaftan',`;
replaceExactOrNorm(searchPath, oldSearchTags, newSearchTags, 'SearchModal popular tags');

// 7. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 'umbrella-dresses'")) {
  catPageCode = catPageCode.replace(
    "{ category: 'short-long-kaftan' },",
    "{ category: 'umbrella-dresses' },\n    { category: 'short-long-kaftan' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('[app/collections/[category]/page.tsx] Added umbrella-dresses static param to page.tsx');
} else {
  console.log('[app/collections/[category]/page.tsx] umbrella-dresses static param already exists');
}
