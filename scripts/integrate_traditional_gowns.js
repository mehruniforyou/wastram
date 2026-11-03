const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'nishorama-data.ts');
let code = fs.readFileSync(dataPath, 'utf8');

code = code.replace(
  "import { WESTERN_DRESSES } from './western-dresses';",
  "import { WESTERN_DRESSES } from './western-dresses';\nimport { TRADITIONAL_GOWNS } from './traditional-gowns';"
);

code = code.replace(
  `export const NISHORAMA_PRODUCTS: NishoramaProduct[] = [
  ...WESTERN_DRESSES
];`,
  `export const NISHORAMA_PRODUCTS: NishoramaProduct[] = [
  ...WESTERN_DRESSES,
  ...TRADITIONAL_GOWNS
];`
);

// Add to stories
code = code.replace(
  "    tag: 'WHOLESALE'\n  }\n];",
  `    tag: 'WHOLESALE'\n  },\n  {\n    id: 5,\n    title: 'TRADITIONAL GOWNS',\n    image: '/traditional-gowns/16668.jpg.jpeg',\n    subtitle: 'Regal Kalidar Gowns',\n    tag: 'ROYAL'\n  }\n];`
);

// Add to popular searches
code = code.replace(
  "'Western Dresses': [",
  `'Traditional Gowns': [
    { text: 'All Traditional Gowns', href: '/collections/traditional-gowns' },
    { text: 'Zari Flared Gowns', href: '/collections/traditional-gowns' },
    { text: 'Organza Festive Gowns', href: '/collections/traditional-gowns' },
    { text: 'Banarasi Brocade Gowns', href: '/collections/traditional-gowns' },
    { text: 'Chikankari Floor Gowns', href: '/collections/traditional-gowns' }
  ],
  'Western Dresses': [`
);

fs.writeFileSync(dataPath, code, 'utf8');
console.log('Updated data/nishorama-data.ts with Traditional Gowns!');
