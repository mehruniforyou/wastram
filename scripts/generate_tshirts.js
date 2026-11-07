const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'T-shirts-all-product-image');
const files = fs.readdirSync(dir);

function getGroups() {
  const fbFiles = files.filter(f => f.startsWith('FB_IMG_')).sort();
  const fbGroups = fbFiles.length > 0 ? [fbFiles] : [];

  const numFiles = files.filter(f => /^\d+[\s\(\)\d]*\.(jpe?g|png)/i.test(f)).map(f => {
    const m = f.match(/^(\d+)/);
    return { file: f, num: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.num - b.num);

  const numGroups = [];
  let currNum = [numFiles[0].file];
  for (let i = 1; i < numFiles.length; i++) {
    const prev = numFiles[i-1];
    const curr = numFiles[i];
    if (curr.num - prev.num > 6 || currNum.length >= 5) {
      numGroups.push(currNum);
      currNum = [curr.file];
    } else {
      currNum.push(curr.file);
    }
  }
  if (currNum.length > 0) numGroups.push(currNum);

  function mergeSmall(groups, maxLen = 6) {
    let res = [];
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      if (g.length <= 1 && res.length > 0 && res[res.length - 1].length + g.length <= maxLen) {
        res[res.length - 1].push(...g);
      } else {
        res.push([...g]);
      }
    }
    for (let i = 0; i < res.length - 1; i++) {
      if (res[i].length <= 1 && res[i+1].length + res[i].length <= maxLen) {
        res[i+1].unshift(...res[i]);
        res.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < res.length; i++) {
      if (res[i].length === 1) {
        if (i > 0) {
          res[i-1].push(...res[i]);
          res.splice(i, 1);
          i--;
        } else if (i < res.length - 1) {
          res[i+1].unshift(...res[i]);
          res.splice(i, 1);
          i--;
        }
      }
    }
    return res;
  }

  const cleanNum = mergeSmall(numGroups, 5);
  return [...cleanNum, ...fbGroups];
}

const merged = getGroups();
console.log('Clustered into', merged.length, 'T-Shirts products from', files.length, 'images.');

const names = [
  "Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia",
  "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi",
  "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha",
  "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika",
  "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee",
  "Tamannaah"
];

const styles = [
  "Heavyweight Combed Cotton Oversized T-Shirt",
  "Relaxed Drop-Shoulder Boxy Tee",
  "Vintage Washed Organic Cotton Graphic T-Shirt",
  "Ribbed Crewneck Classic Fit Bio-Washed Tee",
  "Artisanal Screen-Printed Acid-Wash T-Shirt",
  "Minimalist Embroidered Chest Pocket Tee",
  "French Terry Cotton Boxy Crop T-Shirt",
  "Distressed Hem Streetwear Oversized Tee",
  "Garment-Dyed Heavyweight Relaxed T-Shirt",
  "Premium Ring-Spun Cotton Lounge Tee",
  "Contrast Ribbed Collar Retro Ringer T-Shirt",
  "Slub Jersey Breathable Casual Tee"
];

const fabrics = [
  "240 GSM Heavyweight 100% Combed Cotton Single Jersey",
  "220 GSM Bio-Washed Ring-Spun Organic Cotton",
  "Acid-Washed Vintage Cotton with Silicone Soft Wash",
  "French Terry 260 GSM Loopback Cotton",
  "Breathable Slub Cotton Jersey with Pre-Shrunk Finish",
  "Garment-Dyed 210 GSM Compact Cotton"
];

const badges = [
  "Export Bestseller",
  "Heavyweight 240 GSM",
  "100% Bio-Washed",
  "Oversized Fit",
  "Organic Cotton",
  "High-Demand Pack"
];

const detailsOptions = [
  ['Heavyweight luxury drape with double-needle reinforcement on collar, cuffs, and hem', 'Pre-shrunk 100% combed cotton jersey with zero-shrinkage guarantee', 'Available in assorted export size packs (XS-XXL)', 'Flexible B2B wholesale MOQ: 20 pcs per style / colourway'],
  ['Drop-shoulder street silhouette engineered for international boutique and streetwear retail', 'Lycra-ribbed collar maintains shape after repeated industrial laundering', 'Meets European & American export textile compliance', 'Custom private label branding, woven neck tags, and bespoke prints available'],
  ['Silicone bio-washed fabric for an ultra-soft hand feel and pill-resistant durability', 'Fade-resistant eco-friendly reactive dyes with rich tonal longevity', 'Assorted size breakdown packs or customized grading', 'Doorstep air courier & sea freight container shipping worldwide'],
  ['Relaxed boxy contemporary cut with reinforced side split seams', '100% organic ring-spun cotton certified for international retail distribution', 'Export-ready packaging with individual barcode polybags', 'Express worldwide dispatch via DHL, FedEx & ocean cargo']
];

const products = merged.map((group, index) => {
  const prefix = names[index % names.length];
  const style = styles[(index * 5 + 2) % styles.length];
  const title = `${prefix} ${style}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${index + 1}`;
  const id = `tsh-${String(index + 1).padStart(3, '0')}`;
  const sku = `WST-TSH-${String(index + 101).padStart(3, '0')}`;
  const fabric = fabrics[index % fabrics.length];
  const details = detailsOptions[index % detailsOptions.length];
  const badge = badges[index % badges.length];

  const imagePaths = group.map(f => `/t-shirts/${encodeURIComponent(f)}`);

  return {
    id,
    title,
    slug,
    tab: 't-shirts',
    category: 't-shirts',
    badge,
    regularPrice: 0,
    salePrice: 0,
    images: imagePaths,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: `The ${title} (${sku}) is a premium heavyweight streetwear creation from Wastram's premier T-Shirts wholesale export collection. Crafted in ${fabric}, it features an oversized modern drape, reinforced neckline construction, and export-grade finishing, engineered for high-turnover boutique fashion, streetwear labels, and global retail chains.`,
    fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  };
});

const fileContent = `// Auto-generated T-Shirts catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const T_SHIRTS: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 't-shirts.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully written', products.length, 'T-Shirts to', outputPath);
