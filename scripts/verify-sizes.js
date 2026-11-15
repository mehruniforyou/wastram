const fs = require('fs');

const files = [
  'data/products.ts',
  'app/products/[slug]/page.tsx',
  'components/TapAndViewModal.tsx',
  'components/BodyMeasurementModal.tsx',
  'app/admin/AdminClientPage.tsx',
  'lib/productsStore.ts'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const xsMatches = content.match(/["'](?:XXS|XS)["']/g);
  console.log(f, 'XS/XXS count:', xsMatches ? xsMatches.length : 0);
});
