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

if (!nishoContent.includes("import { TOPS_SHIRTS }")) {
  nishoContent = nishoContent.replace(
    "import { CORD_SETS } from './cord-sets';",
    "import { CORD_SETS } from './cord-sets';\nimport { TOPS_SHIRTS } from './tops-shirts';"
  );
  nishoContent = nishoContent.replace(
    "...CORD_SETS",
    "...CORD_SETS,\n  ...TOPS_SHIRTS"
  );
  
  // Add story
  const storyTarget = `    title: 'CO-ORD SETS',
    image: '/cord-sets/_MG_7607.JPG.jpeg',
    subtitle: '95+ Designer Sets',
    tag: 'NEW'
  }`;
  const storyReplacement = `    title: 'CO-ORD SETS',
    image: '/cord-sets/_MG_7607.JPG.jpeg',
    subtitle: '95+ Designer Sets',
    tag: 'NEW'
  },
  {
    id: 7,
    title: 'TOPS & SHIRTS',
    image: '/tops-shirts/IMG-20250122-WA0005.jpg.jpeg',
    subtitle: '120+ Designer Tops & Shirts',
    tag: 'NEW'
  }`;
  nishoContent = nishoContent.replace(storyTarget, storyReplacement);

  // Add popular searches
  const searchTarget = `export const NISHORAMA_POPULAR_SEARCHES = {`;
  const searchReplacement = `export const NISHORAMA_POPULAR_SEARCHES = {
  'Tops & Shirts': [
    { text: 'All Tops & Shirts', href: '/collections/tops-shirts' },
    { text: 'Linen Relaxed Shirts', href: '/collections/tops-shirts' },
    { text: 'Embroidered Peplum Tops', href: '/collections/tops-shirts' },
    { text: 'Silk Wrap Blouses', href: '/collections/tops-shirts' },
    { text: 'Schiffli Crop Blouses', href: '/collections/tops-shirts' }
  ],`;
  nishoContent = nishoContent.replace(searchTarget, searchReplacement);

  fs.writeFileSync(nishoPath, nishoContent, 'utf8');
  console.log('[data/nishorama-data.ts] Integrated TOPS_SHIRTS, stories, and popular searches');
} else {
  console.log('[data/nishorama-data.ts] Already includes TOPS_SHIRTS');
}

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

const newCatSetup = `  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue Tops & Shirts categories list');

const oldCatFilter = `    if (selectedCategory === 'cord-sets' || selectedCategory === 'cord-set') return p.category === 'cord-sets';
    if (selectedCategory === 'traditional-gowns') return p.category === 'traditional-gowns';`;

const newCatFilter = `    if (selectedCategory === 'tops-shirts' || selectedCategory === 'tops' || selectedCategory === 'shirts') return p.category === 'tops-shirts';
    if (selectedCategory === 'cord-sets' || selectedCategory === 'cord-set') return p.category === 'cord-sets';
    if (selectedCategory === 'traditional-gowns') return p.category === 'traditional-gowns';`;

replaceExactOrNorm(catPath, oldCatFilter, newCatFilter, 'CollectionsCatalogue Tops & Shirts filter logic');

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

const newGridTabs = `  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid Tops & Shirts tabs');

const oldGridFilter = `    if (activeTab === 'cord-sets') return p.category === 'cord-sets';
    if (activeTab === 'traditional-gowns') return p.category === 'traditional-gowns';`;

const newGridFilter = `    if (activeTab === 'tops-shirts') return p.category === 'tops-shirts';
    if (activeTab === 'cord-sets') return p.category === 'cord-sets';
    if (activeTab === 'traditional-gowns') return p.category === 'traditional-gowns';`;

replaceExactOrNorm(gridPath, oldGridFilter, newGridFilter, 'ProductFitsGrid Tops & Shirts filter logic');

// 4. components/Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderLinks = `            <Link
              href="/collections/cord-sets"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Co-ord Sets ✦
            </Link>`;

const newHeaderLinks = `            <Link
              href="/collections/tops-shirts"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Tops & Shirts ✦
            </Link>
            <Link
              href="/collections/cord-sets"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Co-ord Sets ✦
            </Link>`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx Tops & Shirts nav link');

// Update header total styles count
replaceExactOrNorm(headerPath, 'All 360+ Styles', 'All 480+ Styles', 'Header.tsx 480+ styles count');

// 5. components/MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerLinks = `            <li>
              <Link href="/collections/cord-sets" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Co-ord Sets ✦
              </Link>
            </li>`;

const newDrawerLinks = `            <li>
              <Link href="/collections/tops-shirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Tops & Shirts ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/cord-sets" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Co-ord Sets ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer Tops & Shirts link');

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
const oldSearchTags = `  const popularTags = [
    'Co-ord Sets',`;
const newSearchTags = `  const popularTags = [
    'Tops & Shirts',
    'Co-ord Sets',`;
replaceExactOrNorm(searchPath, oldSearchTags, newSearchTags, 'SearchModal popular tags');

// 7. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 'tops-shirts'")) {
  catPageCode = catPageCode.replace(
    "{ category: 'cord-sets' },",
    "{ category: 'tops-shirts' },\n    { category: 'cord-sets' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('[app/collections/[category]/page.tsx] Added tops-shirts static param to page.tsx');
} else {
  console.log('[app/collections/[category]/page.tsx] tops-shirts static param already exists');
}
