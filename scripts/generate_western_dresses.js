const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'western-dresses-all-product-image');
const allFiles = fs.readdirSync(dir);

const numericFiles = [];
const fbFiles = [];
const imgFiles = [];

allFiles.forEach(f => {
  if (f.startsWith('FB_IMG')) fbFiles.push(f);
  else if (f.startsWith('IMG_')) imgFiles.push(f);
  else numericFiles.push(f);
});

numericFiles.sort((a,b) => {
  const na = parseInt((a.match(/\d+/) || [0])[0], 10);
  const nb = parseInt((b.match(/\d+/) || [0])[0], 10);
  return na - nb;
});
fbFiles.sort();
imgFiles.sort();

const orderedFiles = [...numericFiles, ...fbFiles, ...imgFiles];

const rawGroups = [];
let currentGroup = [orderedFiles[0]];

for (let i = 1; i < orderedFiles.length; i++) {
  const prevFile = orderedFiles[i-1];
  const currFile = orderedFiles[i];

  const prevNum = parseInt((prevFile.match(/\d+/) || [0])[0], 10);
  const currNum = parseInt((currFile.match(/\d+/) || [0])[0], 10);

  const isPrevFB = prevFile.startsWith('FB_IMG');
  const isCurrFB = currFile.startsWith('FB_IMG');
  const isPrevIMG = prevFile.startsWith('IMG_');
  const isCurrIMG = currFile.startsWith('IMG_');

  let shouldSplit = false;

  if (isPrevFB !== isCurrFB || isPrevIMG !== isCurrIMG) {
    shouldSplit = true;
  } else if (isCurrFB) {
    if (currentGroup.length >= 5) shouldSplit = true;
  } else if (isCurrIMG) {
    if (currentGroup.length >= 4) shouldSplit = true;
  } else {
    const gap = currNum - prevNum;
    if (gap > 25 && currentGroup.length >= 3) {
      shouldSplit = true;
    } else if (gap > 50) {
      shouldSplit = true;
    } else if (currentGroup.length >= 5 && gap > 2) {
      shouldSplit = true;
    } else if (currentGroup.length >= 6) {
      shouldSplit = true;
    }
  }

  if (shouldSplit) {
    rawGroups.push(currentGroup);
    currentGroup = [currFile];
  } else {
    currentGroup.push(currFile);
  }
}
if (currentGroup.length > 0) {
  rawGroups.push(currentGroup);
}

// Merge small groups so all products have between 3 and 7 images
const merged = [];
for (let i = 0; i < rawGroups.length; i++) {
  const p = rawGroups[i];
  if (p.length <= 2 && merged.length > 0 && merged[merged.length - 1].length + p.length <= 7) {
    merged[merged.length - 1].push(...p);
  } else {
    merged.push(p);
  }
}

for (let i = 0; i < merged.length - 1; i++) {
  if (merged[i].length <= 2 && merged[i+1].length + merged[i].length <= 7) {
    merged[i+1].unshift(...merged[i]);
    merged.splice(i, 1);
    i--;
  }
}

console.log('Grouped into', merged.length, 'products from', orderedFiles.length, 'images.');

const namesList = [
  "Aria", "Sienna", "Elena", "Mila", "Isla", "Chloe", "Freya", "Maya", "Luna", "Zara",
  "Kaia", "Nova", "Bella", "Rhea", "Zoe", "Lyra", "Stella", "Nina", "Cleo", "Ivy",
  "Willow", "Tara", "Kira", "Saffron", "Hazel", "Nadia", "Piper", "Daisy", "Thalia", "Celeste",
  "Iris", "Camille", "Diana", "Giselle", "Tessa", "Bianca", "Daphne", "Paloma", "Vivienne", "Layla",
  "Serena", "Amara", "Astrid", "Gia", "Sora", "Noa", "Lana", "Kora", "Mira", "Veda",
  "Talia", "Leona", "Sloane", "Sable", "Remi", "Maeve", "Reese", "Rowan", "Harper", "Blair",
  "Gemma", "Cora", "Jade", "Ruby", "Opal", "Pearl", "Ember", "Skye", "Eden", "Flora",
  "Dahlia", "Poppy", "Magnolia", "Jasmine", "Lotus", "Sage", "Olive", "Peony", "Camellia", "Vienna",
  "Milan", "Monaco", "Capri", "Santorini", "Kyoto", "Venice", "Ibiza", "St. Tropez", "Verona", "Riviera",
  "Soho", "Chelsea", "Bel Air", "Sorrento", "Amalfi", "Corsica", "Sicily", "Biarritz", "Seville", "Catalina",
  "Geneva", "Florence", "Savannah", "Austin", "Sydney", "Aspen", "Cannes", "Valencia", "Palermo", "Bordeaux",
  "Portofino", "Navona", "Trevi", "Montmartre", "Marais", "Notting Hill", "Mayfair", "Tribeca", "NoHo", "Dumbo",
  "Malibu", "Laguna", "Avalon", "Sedona", "Carmel", "Napa", "Sonoma", "Hampton", "Newport", "Bellevue",
  "Adelaide", "Brisbane", "Marrakech", "Casablanca", "Rhodes", "Mykonos", "Crete", "Dubrovnik", "Ljubljana", "Zurich",
  "Geneva", "Oslo", "Stockholm", "Copenhagen", "Helsinki", "Tallinn", "Riga", "Vilnius", "Prague", "Budapest",
  "Krakow", "Warsaw", "Lisbon", "Porto", "Sintra", "Faro", "Coimbra", "Braga", "Seville", "Granada",
  "Cordoba", "Toledo", "Salamanca", "Bilbao", "San Sebastian", "Oviedo", "Santander", "Leon", "Burgos", "Segovia",
  "Avila", "Caceres", "Merida", "Ronda", "Cadiz", "Jerez", "Marbella", "Malaga", "Alicante", "Murcia"
];

const silhouettes = [
  "Satin Slip Dress", "Pleated Midi Dress", "Cutout Halter Dress", "Tiered Maxi Dress",
  "Ruched Bodycon Dress", "Floral Wrap Dress", "Linen Sundress", "Corset Mini Dress",
  "Smocked Flounce Dress", "Draped Column Dress", "Cowl Neck Slip Dress", "Puff Sleeve Midi Dress",
  "Backless Maxi Dress", "Ribbed Knit Dress", "Broderie Tier Dress", "Asymmetric Wrap Dress",
  "Sweetheart Flare Dress", "Belted Shirtdress", "Organza Tiered Dress", "High-Slit Slip Dress",
  "Flutter Sleeve Dress", "Fluted Hem Midi Dress", "Off-Shoulder Maxi Dress", "Empire Waist Dress",
  "Bias-Cut Slip Dress", "Shirred Tiered Dress", "Keyhole Shift Dress", "Strapless Column Dress",
  "Babydoll Mini Dress", "Plunge Fluted Dress", "Pleated A-Line Dress", "Embroidered Midi Dress"
];

const fabrics = [
  "Lustrous Crepe Silk", "Premium Viscose Rayon", "Breathable Cotton Voile", "Luxe Satin Georgette",
  "Fine Broderie Anglaise", "Printed Habotai Silk", "Airy Organza Blend", "Textured Linen Crepe",
  "Silk Chiffon", "Mercerized Cotton Knit", "Soft Twill Rayon", "Modal Satin Blend"
];

const detailsOptions = [
  ['Export-grade precision stitching and hem finishing', 'Available in assorted size packs (XS-XXL)', 'Bulk MOQ: 20 pcs per style', 'Custom private label and packaging available'],
  ['Premium wrinkle-resistant drape fabrication', 'Concealed side zipper with tailored waist darts', 'Reinforced seams for international commercial export', 'Flexible wholesale packaging & hanger packs'],
  ['Breathable double-lined bodice for modest coverage', 'High tensile tear-resistant stitching', 'Export compliance with EU/US textile safety norms', 'Custom colorways available on 100+ pcs bulk orders'],
  ['Hand-cut and precision draped silhouette', 'Soft touch pre-shrunk fabric with vibrant fast colors', 'Complete size grading from XS to XXL', 'Worldwide DHL/FedEx courier & Sea cargo dispatch']
];

const products = merged.map((group, index) => {
  const prefix = namesList[index % namesList.length];
  const silhouette = silhouettes[(index * 7 + 3) % silhouettes.length];
  const title = `${prefix} ${silhouette}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${index + 1}`;
  const id = `wd-${String(index + 1).padStart(3, '0')}`;
  const sku = `WST-WD-${String(index + 101).padStart(3, '0')}`;
  const fabric = fabrics[index % fabrics.length];
  const details = detailsOptions[index % detailsOptions.length];

  const imagePaths = group.map(f => `/western-dresses/${encodeURIComponent(f)}`);

  return {
    id,
    title,
    slug,
    tab: 'western-dresses',
    category: 'western-dresses',
    badge: index % 5 === 0 ? 'Export Bestseller' : (index % 3 === 0 ? 'New Design' : 'Wholesale Only'),
    regularPrice: 0,
    salePrice: 0,
    images: imagePaths,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: `The ${title} (${sku}) is an export-grade women's Western dress crafted for international boutiques, retailers, and private label brands. Built with ${fabric}, it features an elegant tailored fit, premium lining, and reinforced seam work for global commercial distribution.`,
    fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  };
});

const fileContent = `// Auto-generated Western Dresses catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const WESTERN_DRESSES: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'western-dresses.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully written', products.length, 'products to', outputPath);
