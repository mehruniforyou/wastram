const fs = require('fs');
const path = require('path');

const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
let code = fs.readFileSync(gridPath, 'utf8');

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted'>('under-999');",
  "const [activeTab, setActiveTab] = useState<string>('all');"
);

const oldTabsSection = `const tabs: { id: 'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted'; label: string }[] = [
    { id: 'under-999', label: 'UNDER ₹999' },
    { id: 'festive-sets', label: 'Festive Sets' },
    { id: 'upto-50', label: 'UPTO 50%' },
    { id: 'most-wanted', label: 'Most Wanted' }
  ];

  const currentProducts = NISHORAMA_PRODUCTS.filter(p => p.tab === activeTab);`;

const newTabsSection = `const tabs = [
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

if (code.includes(oldTabsSection)) {
  code = code.replace(oldTabsSection, newTabsSection);
} else {
  // Normalize
  const normCode = code.replace(/\r\n/g, '\n');
  const normSearch = oldTabsSection.replace(/\r\n/g, '\n');
  code = normCode.replace(normSearch, newTabsSection.replace(/\r\n/g, '\n'));
}

fs.writeFileSync(gridPath, code, 'utf8');
console.log('ProductFitsGrid cleanly updated with zero rupee tabs!');
