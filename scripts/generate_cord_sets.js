const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'cord-set-all-product-images');
const files = fs.readdirSync(dir);

function getGroups() {
  // 1. MG
  const mgFiles = files.filter(f => f.startsWith('_MG_')).sort();
  const mgGroups = [];
  let currMg = [mgFiles[0]];
  for (let i = 1; i < mgFiles.length; i++) {
    const prevNum = parseInt(mgFiles[i-1].match(/_MG_(\d+)/i)[1], 10);
    const currNum = parseInt(mgFiles[i].match(/_MG_(\d+)/i)[1], 10);
    if (currNum - prevNum > 2 || currMg.length >= 6) {
      mgGroups.push(currMg);
      currMg = [mgFiles[i]];
    } else {
      currMg.push(mgFiles[i]);
    }
  }
  if (currMg.length > 0) mgGroups.push(currMg);

  // 2. SS
  const ssFiles = files.filter(f => f.startsWith('Screenshot_')).sort();
  const ssGroups = [];
  let currSs = [ssFiles[0]];
  for (let i = 1; i < ssFiles.length; i++) {
    const prevMin = ssFiles[i-1].slice(0, 26);
    const currMin = ssFiles[i].slice(0, 26);
    if (prevMin !== currMin || currSs.length >= 5) {
      ssGroups.push(currSs);
      currSs = [ssFiles[i]];
    } else {
      currSs.push(ssFiles[i]);
    }
  }
  if (currSs.length > 0) ssGroups.push(currSs);

  // 3. WA
  const waFiles = files.filter(f => /^IMG-\d+-WA\d+/i.test(f)).map(f => {
    const m = f.match(/IMG-(\d+)-WA(\d+)/i);
    return { file: f, date: m ? m[1] : '', num: m ? parseInt(m[2], 10) : 0 };
  }).sort((a,b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.num - b.num);

  const waGroups = [];
  let currWa = [waFiles[0].file];
  for (let i = 1; i < waFiles.length; i++) {
    const prev = waFiles[i-1];
    const curr = waFiles[i];
    if (prev.date !== curr.date || curr.num - prev.num > 3 || currWa.length >= 5) {
      waGroups.push(currWa);
      currWa = [curr.file];
    } else {
      currWa.push(curr.file);
    }
  }
  if (currWa.length > 0) waGroups.push(currWa);

  // 4. FB
  const fbFiles = files.filter(f => f.startsWith('FB_IMG_')).map(f => {
    const m = f.match(/FB_IMG_(\d+)/);
    return { file: f, time: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.time - b.time);

  const fbGroups = [];
  let currFb = [fbFiles[0].file];
  for (let i = 1; i < fbFiles.length; i++) {
    const prev = fbFiles[i-1];
    const curr = fbFiles[i];
    if (curr.time - prev.time > 40000 || currFb.length >= 6) {
      fbGroups.push(currFb);
      currFb = [curr.file];
    } else {
      currFb.push(curr.file);
    }
  }
  if (currFb.length > 0) fbGroups.push(currFb);

  // 5. Numeric
  const numFiles = files.filter(f => /^\d+\.jpg\.jpeg$/i.test(f)).map(f => {
    const m = f.match(/^(\d+)/);
    return { file: f, num: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.num - b.num);

  const numGroups = [];
  let currNum = [numFiles[0].file];
  for (let i = 1; i < numFiles.length; i++) {
    const prev = numFiles[i-1];
    const curr = numFiles[i];
    if (curr.num - prev.num > 25 || currNum.length >= 4) {
      numGroups.push(currNum);
      currNum = [curr.file];
    } else {
      currNum.push(curr.file);
    }
  }
  if (currNum.length > 0) numGroups.push(currNum);

  // 6. Hash
  const hashFiles = files.filter(f => /^[0-9a-f]{32}/i.test(f)).sort();
  const hashGroups = [];
  for (let i = 0; i < hashFiles.length; i += 3) {
    hashGroups.push(hashFiles.slice(i, i + 3));
  }

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

  const cleanMg = mergeSmall(mgGroups, 7);
  const cleanSs = mergeSmall(ssGroups, 6);
  const cleanWa = mergeSmall(waGroups, 6);
  const cleanFb = mergeSmall(fbGroups, 6);
  const cleanNum = mergeSmall(numGroups, 5);
  const cleanHash = mergeSmall(hashGroups, 4);

  return [...cleanMg, ...cleanSs, ...cleanWa, ...cleanFb, ...cleanNum, ...cleanHash];
}

const merged = getGroups();
console.log('Clustered into', merged.length, 'Co-ord Set products from', files.length, 'images.');

const names = [
  "Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia",
  "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi",
  "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha",
  "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika",
  "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee",
  "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii",
  "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya",
  "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha",
  "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri",
  "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"
];

const styles = [
  "Linen Tunic & Wide-Leg Trousers Set",
  "Silk Kimono & Tailored Pant Co-ord Set",
  "Embroidered Peplum Top & Dhoti Pant Set",
  "Pleated Blazer & High-Waist Trouser Set",
  "Hand-Block Chanderi Top & Culottes Set",
  "Printed Kaftan & Straight Pant Co-ord Set",
  "Tiered Crop Top & Flared Palazzo Set",
  "Schiffli Cotton Shirt & Relaxed Pant Set",
  "Handcrafted Corset & Wide Palazzo Set",
  "Organza Draped Cape & Trousers Set",
  "Jacquard Belted Kurta & Cigarette Pant Set",
  "Monochromatic Satin Shirt & Trouser Set",
  "Bandhani Peplum Kurti & Sharara Pant Set",
  "Embroidered Vest & Wide-Leg Pant Set",
  "Chikankari Short Kurta & Flared Pant Set",
  "Minimalist Linen Wrap Top & Pant Set",
  "Notch-Collar Silk Shirt & Trouser Co-ord Set",
  "Asymmetric Flounce Top & Slim Pants Set",
  "Sleeveless Draped Tunic & Cigarette Pant Set",
  "Geometric Print Blazer & Culottes Co-ord Set"
];

const fabrics = [
  "Pure Cotton 60:60 with Enzyme Soft Wash",
  "Lustrous Chanderi Silk with Cotton Crepe Lining",
  "Belgian Linen Blend with Soft Garment Finish",
  "Artisanal Flowing Satin Crepe",
  "Hand-Block Modal Silk Blend",
  "Fine Muslin with Delicate Thread Detailing",
  "Luxe Pleated Georgette with Full Lining",
  "Jacquard Viscose with Subtle Natural Sheen",
  "Pure Mulmul Cotton with Hand-Blocked Motifs",
  "Rich Poly-Viscose Suiting Crepe"
];

const badges = [
  "Export Bestseller",
  "Chic Tailoring",
  "Artisan Handcraft",
  "Luxe Silk Edition",
  "Resort Luxe",
  "High-Demand Pack"
];

const detailsOptions = [
  ['Relaxed-fit two-piece silhouette with premium tailored finishes', 'Elasticated back waistband with functional side pockets', 'Available in assorted export size packs (XS-XXL)', 'Flexible B2B wholesale MOQ: 20 pcs'],
  ['Coordinated contemporary set with handcrafted seam accents', 'Fully lined top and high-rise relaxed-fit bottom', 'Export-grade reinforcement stitching and colour-fast fabric', 'Custom private label and branding options available'],
  ['Versatile desk-to-dinner co-ord set with refined drapery', 'Pre-shrunk breathable textiles tailored for international fit', 'Assorted size packs or bespoke size grading for overseas boutiques', 'Door-to-door air express & sea container cargo shipping'],
  ['Modern artisanal print with coordinated two-piece styling', 'Comfort-stretch waistband and concealed zip closure', 'Meets European & North American export quality standards', 'Worldwide DHL/FedEx courier & ocean freight dispatch']
];

const products = merged.map((group, index) => {
  const prefix = names[index % names.length];
  const style = styles[(index * 7 + 3) % styles.length];
  const title = `${prefix} ${style}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${index + 1}`;
  const id = `cs-${String(index + 1).padStart(3, '0')}`;
  const sku = `WST-CS-${String(index + 101).padStart(3, '0')}`;
  const fabric = fabrics[index % fabrics.length];
  const details = detailsOptions[index % detailsOptions.length];
  const badge = badges[index % badges.length];

  const imagePaths = group.map(f => `/cord-sets/${encodeURIComponent(f)}`);

  return {
    id,
    title,
    slug,
    tab: 'cord-sets',
    category: 'cord-sets',
    badge,
    regularPrice: 0,
    salePrice: 0,
    images: imagePaths,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: `The ${title} (${sku}) is an elegant, contemporary two-piece ensemble from Wastram's premier Co-ord Sets export collection. Expertly tailored in ${fabric}, it pairs a modern designer silhouette with versatile elegance and export-grade craftsmanship, making it an essential high-margin staple for international boutiques, multi-brand department stores, and resort retailers worldwide.`,
    fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  };
});

const fileContent = `// Auto-generated Co-ord Sets catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const CORD_SETS: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'cord-sets.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully written', products.length, 'Co-ord Sets to', outputPath);
