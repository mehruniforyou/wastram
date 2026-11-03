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

// 1. CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
const oldCatSetup = `const categories = [
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

const newCatSetup = `const categories = [
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
    if (selectedCategory === 'traditional-gowns') return p.category === 'traditional-gowns';
    if (selectedCategory === 'anarkali-gowns') return p.category === 'traditional-gowns' || p.title.includes('Anarkali');
    if (selectedCategory === 'maxi' || selectedCategory === 'maxi-dresses') return p.title.includes('Maxi');
    if (selectedCategory === 'midi' || selectedCategory === 'midi-dress') return p.title.includes('Midi');
    if (selectedCategory === 'slip') return p.title.includes('Slip') || p.title.includes('Halter');
    if (selectedCategory === 'tiered') return p.title.includes('Tiered') || p.title.includes('Wrap') || p.title.includes('Flared');
    if (selectedCategory === 'most-wanted') return p.badge.includes('Bestseller');
    return p.category === selectedCategory || p.tab === selectedCategory;
  });`;

replaceExactOrNorm(catPath, oldCatSetup, newCatSetup, 'CollectionsCatalogue Traditional Gowns categories');

// 2. ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
const oldGridTabs = `const tabs = [
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

const newGridTabs = `const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },
    { id: 'bestsellers', label: 'Export Bestsellers' },
    { id: 'maxi', label: 'Maxi Dresses' },
    { id: 'anarkali', label: 'Anarkali Gowns' }
  ];

  const currentProducts = NISHORAMA_PRODUCTS.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'western-dresses') return p.category === 'western-dresses';
    if (activeTab === 'traditional-gowns') return p.category === 'traditional-gowns';
    if (activeTab === 'bestsellers') return p.badge.includes('Bestseller');
    if (activeTab === 'maxi') return p.title.includes('Maxi');
    if (activeTab === 'anarkali') return p.title.includes('Anarkali') || p.category === 'traditional-gowns';
    return p.tab === activeTab;
  }).slice(0, 16);`;

replaceExactOrNorm(gridPath, oldGridTabs, newGridTabs, 'ProductFitsGrid Traditional Gowns tabs');

// 3. Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderLinks = `<Link
              href="/collections/western-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00]"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/maxi-dresses"`;

const newHeaderLinks = `<Link
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
            </Link>
            <Link
              href="/collections/maxi-dresses"`;

replaceExactOrNorm(headerPath, oldHeaderLinks, newHeaderLinks, 'Header.tsx Traditional Gowns nav link');

// 4. MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerLinks = `<li>
              <Link href="/collections/western-dresses" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold block">
                Western Dresses ✦
              </Link>
            </li>`;

const newDrawerLinks = `<li>
              <Link href="/collections/western-dresses" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold block">
                Western Dresses ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/traditional-gowns" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Traditional Gowns ✦
              </Link>
            </li>`;

replaceExactOrNorm(drawerPath, oldDrawerLinks, newDrawerLinks, 'MobileNavDrawer Traditional Gowns link');

// 5. app/collections/[category]/page.tsx
const catPagePath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let catPageCode = fs.readFileSync(catPagePath, 'utf8');

if (!catPageCode.includes("category: 'traditional-gowns'")) {
  catPageCode = catPageCode.replace(
    "{ category: 'western-dresses' },",
    "{ category: 'western-dresses' },\n    { category: 'traditional-gowns' },"
  );
  fs.writeFileSync(catPagePath, catPageCode, 'utf8');
  console.log('Added traditional-gowns static param to page.tsx');
}
