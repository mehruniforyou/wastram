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

if (!nishoContent.includes("import { HOODIES_SWEATSHIRTS }")) {
  nishoContent = nishoContent.replace(
    "import { T_SHIRTS } from './t-shirts';",
    "import { T_SHIRTS } from './t-shirts';\nimport { HOODIES_SWEATSHIRTS } from './hoodies-sweatshirts';"
  );
  nishoContent = nishoContent.replace(
    "...T_SHIRTS",
    "...T_SHIRTS,\n  ...HOODIES_SWEATSHIRTS"
  );

  // Add story
  const storyTarget = `    title: 'T-SHIRTS',
    image: '/t-shirts/13665.jpg.jpeg',
    subtitle: '50+ Heavyweight Streetwear Tees',
    tag: 'NEW'
  }`;
  const storyReplacement = `    title: 'T-SHIRTS',
    image: '/t-shirts/13665.jpg.jpeg',
    subtitle: '50+ Heavyweight Streetwear Tees',
    tag: 'NEW'
  },
  {
    id: 12,
    title: 'HOODIES & SWEATSHIRTS',
    image: '/hoodies-sweatshirts/16885.jpg.jpeg',
    subtitle: '40+ Heavyweight Streetwear Hoodies',
    tag: 'NEW'
  }`;
  nishoContent = nishoContent.replace(storyTarget, storyReplacement);

  // Add popular searches
  const searchTarget = `export const NISHORAMA_POPULAR_SEARCHES = {`;
  const searchReplacement = `export const NISHORAMA_POPULAR_SEARCHES = {
  'Hoodies & Sweatshirts': [
    { text: 'All Hoodies & Sweatshirts', href: '/collections/hoodies-sweatshirts' },
    { text: 'Heavyweight Boxy Fleece Hoodies', href: '/collections/hoodies-sweatshirts' },
    { text: 'French Terry Drop-Shoulder Pullovers', href: '/collections/hoodies-sweatshirts' },
    { text: 'Acid-Wash Vintage Sweatshirts', href: '/collections/hoodies-sweatshirts' },
    { text: 'Carbon-Brushed Cotton Hoodies', href: '/collections/hoodies-sweatshirts' }
  ],`;
  nishoContent = nishoContent.replace(searchTarget, searchReplacement);

  fs.writeFileSync(nishoPath, nishoContent, 'utf8');
  console.log('[data/nishorama-data.ts] Integrated HOODIES_SWEATSHIRTS, story, and popular searches');
} else {
  console.log('[data/nishorama-data.ts] Already includes HOODIES_SWEATSHIRTS');
}

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 't-shirts', label: 'T-Shirts' },`;

const newCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'hoodies-sweatshirts', label: 'Hoodies & Sweatshirts' },
    { id: 't-shirts', label: 'T-Shirts' },`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue Hoodies & Sweatshirts categories list');

const oldCatFilter = `    if (selectedCategory === 't-shirts' || selectedCategory === 'tshirts' || selectedCategory === 'tee') return p.category === 't-shirts';`;

const newCatFilter = `    if (selectedCategory === 'hoodies-sweatshirts' || selectedCategory === 'hoodies' || selectedCategory === 'sweatshirts' || selectedCategory === 'hoodie') return p.category === 'hoodies-sweatshirts';
    if (selectedCategory === 't-shirts' || selectedCategory === 'tshirts' || selectedCategory === 'tee') return p.category === 't-shirts';`;

replaceExactOrNorm(catPath, oldCatFilter, newCatFilter, 'CollectionsCatalogue Hoodies & Sweatshirts filter logic');

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 't-shirts', label: 'T-Shirts' },`;

const newGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'hoodies-sweatshirts', label: 'Hoodies & Sweatshirts' },
    { id: 't-shirts', label: 'T-Shirts' },`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid Hoodies & Sweatshirts tabs');

const oldGridFilter = `    if (activeTab === 't-shirts') return p.category === 't-shirts';`;

const newGridFilter = `    if (activeTab === 'hoodies-sweatshirts') return p.category === 'hoodies-sweatshirts';
    if (activeTab === 't-shirts') return p.category === 't-shirts';`;

replaceExactOrNorm(gridPath, oldGridFilter, newGridFilter, 'ProductFitsGrid Hoodies & Sweatshirts filter logic');

// 4. components/Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderLinks = `            <Link
              href="/collections/t-shirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              T-Shirts ✦
            </Link>`;

const newHeaderLinks = `            <Link
              href="/collections/hoodies-sweatshirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Hoodies &amp; Sweatshirts ✦
            </Link>
            <Link
              href="/collections/t-shirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              T-Shirts ✦
            </Link>`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx Hoodies & Sweatshirts nav link');

// Update header total styles count
replaceExactOrNorm(headerPath, 'All 780+ Styles', 'All 830+ Styles', 'Header.tsx 830+ styles count');

// 5. components/MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerLinks = `            <li>
              <Link href="/collections/t-shirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                T-Shirts ✦
              </Link>
            </li>`;

const newDrawerLinks = `            <li>
              <Link href="/collections/hoodies-sweatshirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Hoodies &amp; Sweatshirts ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/t-shirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                T-Shirts ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer Hoodies & Sweatshirts link');

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
const oldSearchTags = `  const popularTags = [
    'T-Shirts',`;
const newSearchTags = `  const popularTags = [
    'Hoodies & Sweatshirts',
    'T-Shirts',`;
replaceExactOrNorm(searchPath, oldSearchTags, newSearchTags, 'SearchModal popular tags');

// 7. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 'hoodies-sweatshirts'")) {
  catPageCode = catPageCode.replace(
    "{ category: 't-shirts' },",
    "{ category: 'hoodies-sweatshirts' },\n    { category: 't-shirts' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('[app/collections/[category]/page.tsx] Added hoodies-sweatshirts static param to page.tsx');
} else {
  console.log('[app/collections/[category]/page.tsx] hoodies-sweatshirts static param already exists');
}
