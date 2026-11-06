const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'skirt-top-all-product-images');
const files = fs.readdirSync(dir);

function getGroups() {
  // 1. WA
  const waFiles = files.filter(f => /^IMG-\d+-WA\d+/i.test(f)).map(f => {
    const m = f.match(/IMG-(\d+)-WA(\d+)/i);
    return {
      file: f,
      date: m ? m[1] : '',
      waNum: m ? parseInt(m[2], 10) : 0
    };
  }).sort((a,b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.waNum - b.waNum);

  const waGroups = [];
  let currWa = [waFiles[0].file];
  for (let i = 1; i < waFiles.length; i++) {
    const prev = waFiles[i-1];
    const curr = waFiles[i];
    const sameWa = prev.date === curr.date && prev.waNum === curr.waNum;
    const adjacentWa = prev.date === curr.date && (curr.waNum - prev.waNum <= 2);
    if ((sameWa || adjacentWa) && currWa.length < 5) {
      currWa.push(curr.file);
    } else {
      waGroups.push(currWa);
      currWa = [curr.file];
    }
  }
  if (currWa.length > 0) waGroups.push(currWa);

  // 2. FB
  const fbFiles = files.filter(f => f.startsWith('FB_IMG_')).map(f => {
    const m = f.match(/FB_IMG_(\d+)/);
    return { file: f, time: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.time - b.time);

  const fbGroups = [];
  let currFb = [fbFiles[0].file];
  for (let i = 1; i < fbFiles.length; i++) {
    const prev = fbFiles[i-1];
    const curr = fbFiles[i];
    if (curr.time - prev.time > 45000 || currFb.length >= 5) {
      fbGroups.push(currFb);
      currFb = [curr.file];
    } else {
      currFb.push(curr.file);
    }
  }
  if (currFb.length > 0) fbGroups.push(currFb);

  // 3. Pure Numeric
  const numFiles = files.filter(f => /^\d+[\s\(\)\d]*\.(jpe?g|png)/i.test(f)).map(f => {
    const m = f.match(/^(\d+)/);
    return { file: f, num: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.num - b.num);

  const numGroups = [];
  let currNum = [numFiles[0].file];
  for (let i = 1; i < numFiles.length; i++) {
    const prev = numFiles[i-1];
    const curr = numFiles[i];
    if (curr.num - prev.num > 10 || currNum.length >= 4) {
      numGroups.push(currNum);
      currNum = [curr.file];
    } else {
      currNum.push(curr.file);
    }
  }
  if (currNum.length > 0) numGroups.push(currNum);

  // 4. Hash
  const hashFiles = files.filter(f => /^[0-9a-f]{32}/i.test(f)).sort();
  const hashGroups = [];
  for (let i = 0; i < hashFiles.length; i += 3) {
    hashGroups.push(hashFiles.slice(i, i + 3));
  }

  // 5. MG
  const mgFiles = files.filter(f => f.startsWith('_MG_')).map(f => {
    const m = f.match(/_MG_(\d+)/i);
    return { file: f, num: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.num - b.num);

  const mgGroups = [];
  let currMg = [mgFiles[0].file];
  for (let i = 1; i < mgFiles.length; i++) {
    const prev = mgFiles[i-1];
    const curr = mgFiles[i];
    if (curr.num - prev.num > 5 || currMg.length >= 5) {
      mgGroups.push(currMg);
      currMg = [curr.file];
    } else {
      currMg.push(curr.file);
    }
  }
  if (currMg.length > 0) mgGroups.push(currMg);

  // 6. Camera
  const camFiles = files.filter(f => /^IMG_?\d{8}/i.test(f)).sort();
  const camGroups = [];
  for (let i = 0; i < camFiles.length; i += 3) {
    camGroups.push(camFiles.slice(i, i + 3));
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

  const cleanWa = mergeSmall(waGroups, 6);
  const cleanFb = mergeSmall(fbGroups, 6);
  const cleanNum = mergeSmall(numGroups, 5);
  const cleanHash = mergeSmall(hashGroups, 4);
  const cleanMg = mergeSmall(mgGroups, 5);
  const cleanCam = mergeSmall(camGroups, 4);

  return [...cleanWa, ...cleanFb, ...cleanNum, ...cleanHash, ...cleanMg, ...cleanCam];
}

const merged = getGroups();
console.log('Clustered into', merged.length, 'Tops & Shirts products from', files.length, 'images.');

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
  "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi", "Pallavi", "Prisha", "Roshni", "Sakshi", "Tia",
  "Urvi", "Varsha", "Vedika", "Yamini", "Zenia", "Anika", "Bani", "Chahat", "Damini", "Falguni"
];

const styles = [
  "Embroidered Peplum Blouse",
  "Linen Notch-Collar Relaxed Shirt",
  "Pure Silk Wrap Peplum Top",
  "Hand-Block Chanderi Tunic Shirt",
  "Schiffli Embroidered Crop Blouse",
  "Artisanal Pintuck Cotton Shirt",
  "Pleated Georgette Flounce Top",
  "Luxe Satin Tie-Neck Blouse",
  "Bandhani Print Draped Peplum Top",
  "Chikankari Hand-Embroidered Short Kurti Top",
  "Asymmetric Hem High-Low Shirt",
  "Jacquard Tailored Vest Top",
  "Smocked Bodice Balloon Sleeve Top",
  "Mandarin Collar Cotton Slub Shirt",
  "Fluted Sleeve Silk Crepe Top",
  "Minimalist Button-Down Boxy Shirt",
  "Cutwork Lace Victorian Blouse",
  "Draped Cowl Neck Satin Top",
  "Ruffled Yoke Organza Blouse",
  "Resort Block-Printed Resort Shirt"
];

const fabrics = [
  "Pure Cotton 60:60 with Soft Bio-Wash",
  "Fine Chanderi Silk with Cotton Voile Lining",
  "Belgian Slub Linen with Garment Soft Finish",
  "Artisanal Flowing Satin Crepe",
  "Hand-Block Modal Cotton Blend",
  "Fine Mulmul with Delicate Threadwork",
  "Luxe Pleated Georgette with Lining",
  "Jacquard Viscose with Natural Luster",
  "Schiffli Eyelet Cotton with Scalloped Edge",
  "Breathable Rayon Twill"
];

const badges = [
  "Export Bestseller",
  "Pure Cotton",
  "Artisan Handcraft",
  "Luxe Silk",
  "Chic Tailoring",
  "High-Demand Pack"
];

const detailsOptions = [
  ['Versatile tailored silhouette suitable for international boutique curation and luxury retail', 'Mother-of-pearl buttons and clean concealed front placket', 'Available in assorted export size packs (XS-XXL)', 'Flexible B2B wholesale MOQ: 20 pcs per style'],
  ['Breathable premium textile with delicate artisanal needlework', 'Reinforced French seams and pre-shrunk fabric for zero shrinkage', 'Meets European & American export textile compliance', 'Custom private label branding and bespoke tags available'],
  ['Desk-to-evening styling with refined drapery and tailored cuffs', 'Fade-resistant eco-friendly reactive dyes with rich tone', 'Assorted size breakdown packs or customized grading', 'Doorstep air courier & sea freight container shipping worldwide'],
  ['Contemporary relaxed cut with intricate border detailing', 'Comfortable breathable lining with hypoallergenic finish', 'Export-ready packaging with individual barcode polybags', 'Express worldwide dispatch via DHL, FedEx & ocean cargo']
];

const products = merged.map((group, index) => {
  const prefix = names[index % names.length];
  const style = styles[(index * 7 + 2) % styles.length];
  const title = `${prefix} ${style}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${index + 1}`;
  const id = `ts-${String(index + 1).padStart(3, '0')}`;
  const sku = `WST-TS-${String(index + 101).padStart(3, '0')}`;
  const fabric = fabrics[index % fabrics.length];
  const details = detailsOptions[index % detailsOptions.length];
  const badge = badges[index % badges.length];

  const imagePaths = group.map(f => `/tops-shirts/${encodeURIComponent(f)}`);

  return {
    id,
    title,
    slug,
    tab: 'tops-shirts',
    category: 'tops-shirts',
    badge,
    regularPrice: 0,
    salePrice: 0,
    images: imagePaths,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: `The ${title} (${sku}) is an export-grade designer creation from Wastram's premier Tops & Shirts wholesale catalogue. Tailored in ${fabric}, it showcases contemporary silhouettes, exquisite artisanal finishes, and international export standard construction, designed for high-turnover boutique fashion and premium department retail.`,
    fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  };
});

const fileContent = `// Auto-generated Tops & Shirts catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const TOPS_SHIRTS: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'tops-shirts.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully written', products.length, 'Tops & Shirts to', outputPath);
