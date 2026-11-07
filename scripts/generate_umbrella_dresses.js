const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'umbrella-dresses-all-product-image');
const files = fs.readdirSync(dir);

function getGroups() {
  // 1. Pure Numeric files
  const numFiles = files.filter(f => /^\d+[\s\(\)\d]*\.(jpe?g|png)/i.test(f)).map(f => {
    const m = f.match(/^(\d+)/);
    return { file: f, num: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.num - b.num);

  const numGroups = [];
  let currNum = [numFiles[0].file];
  for (let i = 1; i < numFiles.length; i++) {
    const prev = numFiles[i-1];
    const curr = numFiles[i];
    if (curr.num - prev.num > 8 || currNum.length >= 5) {
      numGroups.push(currNum);
      currNum = [curr.file];
    } else {
      currNum.push(curr.file);
    }
  }
  if (currNum.length > 0) numGroups.push(currNum);

  // 2. FB files
  const fbFiles = files.filter(f => f.startsWith('FB_IMG_')).map(f => {
    const m = f.match(/FB_IMG_(\d+)/);
    return { file: f, time: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.time - b.time);

  const fbGroups = [];
  let currFb = [fbFiles[0].file];
  for (let i = 1; i < fbFiles.length; i++) {
    const prev = fbFiles[i-1];
    const curr = fbFiles[i];
    if (curr.time - prev.time > 40000 || currFb.length >= 5) {
      fbGroups.push(currFb);
      currFb = [curr.file];
    } else {
      currFb.push(curr.file);
    }
  }
  if (currFb.length > 0) fbGroups.push(currFb);

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
  const cleanFb = mergeSmall(fbGroups, 6);

  return [...cleanNum, ...cleanFb];
}

const merged = getGroups();
console.log('Clustered into', merged.length, 'Umbrella Dresses products from', files.length, 'images.');

const names = [
  "Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia",
  "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi",
  "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha",
  "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika"
];

const styles = [
  "Handcrafted Chanderi Silk Umbrella Dress",
  "Pure Mulmul Cotton Flared Umbrella Dress",
  "Tiered Georgette Circular Umbrella Maxi",
  "Artisanal Block-Printed Kalidar Umbrella Dress",
  "Luxe Satin Crepe Flared Umbrella Dress",
  "Bandhani Print Flowing Umbrella Dress",
  "Zari Embroidered Yoke Umbrella Gown Dress",
  "Floral Embroidered Notch-Neck Umbrella Dress",
  "Belgian Linen Slub Tiered Umbrella Dress",
  "Chikankari Hand-Embroidered Umbrella Maxi Dress",
  "Pleated Organza Hem Flared Umbrella Dress",
  "Boho Print Asymmetric Hem Umbrella Dress"
];

const fabrics = [
  "Fine Chanderi Silk with Cotton Voile Lining",
  "Pure Mulmul Cotton 60:60 with Natural Plant Dyes",
  "Artisanal Flowing Satin Crepe",
  "Luxe Pleated Georgette with Full Flare",
  "Hand-Block Modal Silk Blend",
  "Belgian Slub Linen with Garment Soft Wash",
  "Breathable Rayon Slub with Vibrant Tone"
];

const badges = [
  "Export Bestseller",
  "Umbrella Flare",
  "Pure Cotton",
  "Silk Edition",
  "Artisan Handcraft",
  "Resort Luxe"
];

const detailsOptions = [
  ['Full circular umbrella flare silhouette offering dramatic volume and graceful movement', 'Concealed side zipper and tailored bodice with breathable cotton lining', 'Available in assorted export size packs (XS-XXL)', 'Flexible B2B wholesale MOQ: 20 pcs per style / print'],
  ['Handcrafted kalidar flared panels with delicate hemline border finish', 'Pre-shrunk premium textile tested for international retail compliance', 'Meets European & American export textile standards', 'Custom private label branding and bespoke tags available'],
  ['Versatile desk-to-evening flared silhouette with refined drapery and concealed finishing', 'Fade-resistant eco-friendly reactive dyes with rich tonal longevity', 'Assorted size breakdown packs or customized grading', 'Doorstep air courier & sea freight container shipping worldwide'],
  ['Opulent circular hem with intricate neckline threadwork', 'Lightweight breathable drape perfect for resort wear, boutique collections, and summer events', 'Export-ready packaging with individual barcode polybags', 'Express worldwide dispatch via DHL, FedEx & ocean cargo']
];

const products = merged.map((group, index) => {
  const prefix = names[index % names.length];
  const style = styles[(index * 5 + 3) % styles.length];
  const title = `${prefix} ${style}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${index + 1}`;
  const id = `ud-${String(index + 1).padStart(3, '0')}`;
  const sku = `WST-UD-${String(index + 101).padStart(3, '0')}`;
  const fabric = fabrics[index % fabrics.length];
  const details = detailsOptions[index % detailsOptions.length];
  const badge = badges[index % badges.length];

  const imagePaths = group.map(f => `/umbrella-dresses/${encodeURIComponent(f)}`);

  return {
    id,
    title,
    slug,
    tab: 'umbrella-dresses',
    category: 'umbrella-dresses',
    badge,
    regularPrice: 0,
    salePrice: 0,
    images: imagePaths,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: `The ${title} (${sku}) is an iconic flared creation from Wastram's premier Umbrella Dresses export collection. Crafted in ${fabric}, it features a sweeping circular umbrella silhouette, exquisite artisanal finishes, and export-grade reinforcement, tailored for international boutiques, luxury summer retail, and high-end fashion distributors worldwide.`,
    fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  };
});

const fileContent = `// Auto-generated Umbrella Dresses catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const UMBRELLA_DRESSES: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'umbrella-dresses.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully written', products.length, 'Umbrella Dresses to', outputPath);
