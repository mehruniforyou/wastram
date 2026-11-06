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

if (!nishoContent.includes("import { ETHNIC_WEAR_SETS }")) {
  nishoContent = nishoContent.replace(
    "import { TOPS_SHIRTS } from './tops-shirts';",
    "import { TOPS_SHIRTS } from './tops-shirts';\nimport { ETHNIC_WEAR_SETS } from './ethnic-wear-sets';"
  );
  nishoContent = nishoContent.replace(
    "...TOPS_SHIRTS",
    "...TOPS_SHIRTS,\n  ...ETHNIC_WEAR_SETS"
  );
  
  // Add story
  const storyTarget = `    title: 'TOPS & SHIRTS',
    image: '/tops-shirts/IMG-20250122-WA0005.jpg.jpeg',
    subtitle: '120+ Designer Tops & Shirts',
    tag: 'NEW'
  }`;
  const storyReplacement = `    title: 'TOPS & SHIRTS',
    image: '/tops-shirts/IMG-20250122-WA0005.jpg.jpeg',
    subtitle: '120+ Designer Tops & Shirts',
    tag: 'NEW'
  },
  {
    id: 8,
    title: 'ETHNIC WEAR SETS',
    image: '/ethnic-wear-sets/Screenshot_2026-05-04-23-09-15-24_a23b203fd3aafc6dcb84e438dda678b6.jpg.jpeg',
    subtitle: '75+ Regal 3-Piece Sets',
    tag: 'ROYAL'
  }`;
  nishoContent = nishoContent.replace(storyTarget, storyReplacement);

  // Add popular searches
  const searchTarget = `export const NISHORAMA_POPULAR_SEARCHES = {`;
  const searchReplacement = `export const NISHORAMA_POPULAR_SEARCHES = {
  'Ethnic Wear Sets': [
    { text: 'All Ethnic Wear Sets', href: '/collections/ethnic-wear-sets' },
    { text: '3-Piece Suit Sets', href: '/collections/ethnic-wear-sets' },
    { text: 'Chanderi Anarkali Sets', href: '/collections/ethnic-wear-sets' },
    { text: 'Gota Patti Sharara Sets', href: '/collections/ethnic-wear-sets' },
    { text: 'Chikankari Kurta & Pant Sets', href: '/collections/ethnic-wear-sets' }
  ],`;
  nishoContent = nishoContent.replace(searchTarget, searchReplacement);

  fs.writeFileSync(nishoPath, nishoContent, 'utf8');
  console.log('[data/nishorama-data.ts] Integrated ETHNIC_WEAR_SETS, stories, and popular searches');
} else {
  console.log('[data/nishorama-data.ts] Already includes ETHNIC_WEAR_SETS');
}

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

const newCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue Ethnic Wear Sets categories list');

const oldCatFilter = `    if (selectedCategory === 'tops-shirts' || selectedCategory === 'tops' || selectedCategory === 'shirts') return p.category === 'tops-shirts';
    if (selectedCategory === 'cord-sets' || selectedCategory === 'cord-set') return p.category === 'cord-sets';`;

const newCatFilter = `    if (selectedCategory === 'ethnic-wear-sets' || selectedCategory === 'ethnic-sets' || selectedCategory === '3-piece') return p.category === 'ethnic-wear-sets';
    if (selectedCategory === 'tops-shirts' || selectedCategory === 'tops' || selectedCategory === 'shirts') return p.category === 'tops-shirts';
    if (selectedCategory === 'cord-sets' || selectedCategory === 'cord-set') return p.category === 'cord-sets';`;

replaceExactOrNorm(catPath, oldCatFilter, newCatFilter, 'CollectionsCatalogue Ethnic Wear Sets filter logic');

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

const newGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid Ethnic Wear Sets tabs');

const oldGridFilter = `    if (activeTab === 'tops-shirts') return p.category === 'tops-shirts';
    if (activeTab === 'cord-sets') return p.category === 'cord-sets';`;

const newGridFilter = `    if (activeTab === 'ethnic-wear-sets') return p.category === 'ethnic-wear-sets';
    if (activeTab === 'tops-shirts') return p.category === 'tops-shirts';
    if (activeTab === 'cord-sets') return p.category === 'cord-sets';`;

replaceExactOrNorm(gridPath, oldGridFilter, newGridFilter, 'ProductFitsGrid Ethnic Wear Sets filter logic');

// 4. components/Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderLinks = `            <Link
              href="/collections/tops-shirts"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Tops & Shirts ✦
            </Link>`;

const newHeaderLinks = `            <Link
              href="/collections/ethnic-wear-sets"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Ethnic Wear Sets ✦
            </Link>
            <Link
              href="/collections/tops-shirts"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Tops & Shirts ✦
            </Link>`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx Ethnic Wear Sets nav link');

// Update header total styles count
replaceExactOrNorm(headerPath, 'All 480+ Styles', 'All 560+ Styles', 'Header.tsx 560+ styles count');

// 5. components/MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerLinks = `            <li>
              <Link href="/collections/tops-shirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Tops & Shirts ✦
              </Link>
            </li>`;

const newDrawerLinks = `            <li>
              <Link href="/collections/ethnic-wear-sets" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Ethnic Wear Sets ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/tops-shirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Tops & Shirts ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer Ethnic Wear Sets link');

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
const oldSearchTags = `  const popularTags = [
    'Tops & Shirts',`;
const newSearchTags = `  const popularTags = [
    'Ethnic Wear Sets',
    'Tops & Shirts',`;
replaceExactOrNorm(searchPath, oldSearchTags, newSearchTags, 'SearchModal popular tags');

// 7. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 'ethnic-wear-sets'")) {
  catPageCode = catPageCode.replace(
    "{ category: 'tops-shirts' },",
    "{ category: 'ethnic-wear-sets' },\n    { category: 'tops-shirts' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('[app/collections/[category]/page.tsx] Added ethnic-wear-sets static param to page.tsx');
} else {
  console.log('[app/collections/[category]/page.tsx] ethnic-wear-sets static param already exists');
}
