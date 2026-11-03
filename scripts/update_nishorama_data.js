const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'nishorama-data.ts');
let code = fs.readFileSync(filePath, 'utf8');

const newInterface = `import { WESTERN_DRESSES } from './western-dresses';

export interface NishoramaProduct {
  id: string;
  title: string;
  slug: string;
  tab: string;
  category: string;
  badge: string;
  regularPrice?: number;
  salePrice?: number;
  images: string[];
  sizes: string[];
  description: string;
  fabric: string;
  details: string[];
  moq?: string;
  sku?: string;
}`;

code = code.replace(/export interface NishoramaProduct \{[\s\S]*?details:\s*string\[\];[\r\n]+}/, newInterface);

code = code.replace(
  'export const NISHORAMA_PRODUCTS: NishoramaProduct[] = [',
  'const ORIGINAL_PRODUCTS: NishoramaProduct[] = ['
);

code = code.replace(
  /(\n\];\s*export const NISHORAMA_EDITORIAL_BANNERS)/,
  `\n];\n\nexport const NISHORAMA_PRODUCTS: NishoramaProduct[] = [\n  ...WESTERN_DRESSES,\n  ...ORIGINAL_PRODUCTS\n];$1`
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Updated data/nishorama-data.ts cleanly!');
