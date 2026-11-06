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

if (!nishoContent.includes("import { SHORT_LONG_KAFTANS }")) {
  nishoContent = nishoContent.replace(
    "import { ETHNIC_WEAR_SETS } from './ethnic-wear-sets';",
    "import { ETHNIC_WEAR_SETS } from './ethnic-wear-sets';\nimport { SHORT_LONG_KAFTANS } from './short-long-kaftan';"
  );
  nishoContent = nishoContent.replace(
    "...ETHNIC_WEAR_SETS",
    "...ETHNIC_WEAR_SETS,\n  ...SHORT_LONG_KAFTANS"
  );
  
  // Add story
  const storyTarget = `    title: 'ETHNIC WEAR SETS',
    image: '/ethnic-wear-sets/Screenshot_2026-05-04-23-09-15-24_a23b203fd3aafc6dcb84e438dda678b6.jpg.jpeg',
    subtitle: '75+ Regal 3-Piece Sets',
    tag: 'ROYAL'
  }`;
  const storyReplacement = `    title: 'ETHNIC WEAR SETS',
    image: '/ethnic-wear-sets/Screenshot_2026-05-04-23-09-15-24_a23b203fd3aafc6dcb84e438dda678b6.jpg.jpeg',
    subtitle: '75+ Regal 3-Piece Sets',
    tag: 'ROYAL'
  },
  {
    id: 9,
    title: 'SHORT & LONG KAFTAN',
    image: '/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
    subtitle: '140+ Resort & Maxi Kaftans',
    tag: 'NEW'
  }`;
  nishoContent = nishoContent.replace(storyTarget, storyReplacement);

  // Add popular searches
  const searchTarget = `export const NISHORAMA_POPULAR_SEARCHES = {`;
  const searchReplacement = `export const NISHORAMA_POPULAR_SEARCHES = {
  'Short & Long Kaftan': [
    { text: 'All Short & Long Kaftans', href: '/collections/short-long-kaftan' },
    { text: 'Silk Crepe Maxi Kaftans', href: '/collections/short-long-kaftan' },
    { text: 'Mulmul Cotton Short Kaftans', href: '/collections/short-long-kaftan' },
    { text: 'Chanderi Embroidered Kaftans', href: '/collections/short-long-kaftan' },
    { text: 'Georgette Resort Kaftans', href: '/collections/short-long-kaftan' }
  ],`;
  nishoContent = nishoContent.replace(searchTarget, searchReplacement);

  fs.writeFileSync(nishoPath, nishoContent, 'utf8');
  console.log('[data/nishorama-data.ts] Integrated SHORT_LONG_KAFTANS, stories, and popular searches');
} else {
  console.log('[data/nishorama-data.ts] Already includes SHORT_LONG_KAFTANS');
}

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

const newCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'short-long-kaftan', label: 'Short & Long Kaftan' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue Short & Long Kaftan categories list');

const oldCatFilter = `    if (selectedCategory === 'ethnic-wear-sets' || selectedCategory === 'ethnic-sets' || selectedCategory === '3-piece') return p.category === 'ethnic-wear-sets';
    if (selectedCategory === 'tops-shirts' || selectedCategory === 'tops' || selectedCategory === 'shirts') return p.category === 'tops-shirts';`;

const newCatFilter = `    if (selectedCategory === 'short-long-kaftan' || selectedCategory === 'kaftans' || selectedCategory === 'kaftan') return p.category === 'short-long-kaftan';
    if (selectedCategory === 'ethnic-wear-sets' || selectedCategory === 'ethnic-sets' || selectedCategory === '3-piece') return p.category === 'ethnic-wear-sets';
    if (selectedCategory === 'tops-shirts' || selectedCategory === 'tops' || selectedCategory === 'shirts') return p.category === 'tops-shirts';`;

replaceExactOrNorm(catPath, oldCatFilter, newCatFilter, 'CollectionsCatalogue Short & Long Kaftan filter logic');

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

const newGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'short-long-kaftan', label: 'Short & Long Kaftan' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid Short & Long Kaftan tabs');

const oldGridFilter = `    if (activeTab === 'ethnic-wear-sets') return p.category === 'ethnic-wear-sets';
    if (activeTab === 'tops-shirts') return p.category === 'tops-shirts';`;

const newGridFilter = `    if (activeTab === 'short-long-kaftan') return p.category === 'short-long-kaftan';
    if (activeTab === 'ethnic-wear-sets') return p.category === 'ethnic-wear-sets';
    if (activeTab === 'tops-shirts') return p.category === 'tops-shirts';`;

replaceExactOrNorm(gridPath, oldGridFilter, newGridFilter, 'ProductFitsGrid Short & Long Kaftan filter logic');

// 4. components/Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderLinks = `            <Link
              href="/collections/ethnic-wear-sets"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Ethnic Wear Sets ✦
            </Link>`;

const newHeaderLinks = `            <Link
              href="/collections/short-long-kaftan"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Short &amp; Long Kaftan ✦
            </Link>
            <Link
              href="/collections/ethnic-wear-sets"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Ethnic Wear Sets ✦
            </Link>`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx Short & Long Kaftan nav link');

// Update header total styles count
replaceExactOrNorm(headerPath, 'All 560+ Styles', 'All 700+ Styles', 'Header.tsx 700+ styles count');

// 5. components/MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerLinks = `            <li>
              <Link href="/collections/ethnic-wear-sets" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Ethnic Wear Sets ✦
              </Link>
            </li>`;

const newDrawerLinks = `            <li>
              <Link href="/collections/short-long-kaftan" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Short &amp; Long Kaftan ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/ethnic-wear-sets" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Ethnic Wear Sets ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer Short & Long Kaftan link');

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
const oldSearchTags = `  const popularTags = [
    'Ethnic Wear Sets',`;
const newSearchTags = `  const popularTags = [
    'Short & Long Kaftan',
    'Ethnic Wear Sets',`;
replaceExactOrNorm(searchPath, oldSearchTags, newSearchTags, 'SearchModal popular tags');

// 7. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 'short-long-kaftan'")) {
  catPageCode = catPageCode.replace(
    "{ category: 'ethnic-wear-sets' },",
    "{ category: 'short-long-kaftan' },\n    { category: 'ethnic-wear-sets' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('[app/collections/[category]/page.tsx] Added short-long-kaftan static param to page.tsx');
} else {
  console.log('[app/collections/[category]/page.tsx] short-long-kaftan static param already exists');
}
