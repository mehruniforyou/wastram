const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '3-piece-sets-all-product-image');
const files = fs.readdirSync(dir);

function getGroups() {
  // 1. Screenshots
  const ssFiles = files.filter(f => f.startsWith('Screenshot_')).sort();
  const ssGroups = [];
  if (ssFiles.length > 0) {
    ssGroups.push(ssFiles);
  }

  // 2. WA files
  const waFiles = files.filter(f => /^IMG-\d+-WA\d+/i.test(f)).map(f => {
    const m = f.match(/IMG-(\d+)-WA(\d+)/i);
    return {
      file: f,
      date: m ? m[1] : '',
      num: m ? parseInt(m[2], 10) : 0
    };
  }).sort((a,b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.num - b.num);

  const waGroups = [];
  let currWa = [waFiles[0].file];
  for (let i = 1; i < waFiles.length; i++) {
    const prev = waFiles[i-1];
    const curr = waFiles[i];
    const sameDate = prev.date === curr.date;
    const gap = curr.num - prev.num;
    if (!sameDate || gap > 4 || currWa.length >= 6) {
      waGroups.push(currWa);
      currWa = [curr.file];
    } else {
      currWa.push(curr.file);
    }
  }
  if (currWa.length > 0) waGroups.push(currWa);

  // 3. FB files
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

  const cleanSs = ssGroups;
  const cleanWa = mergeSmall(waGroups, 6);
  const cleanFb = mergeSmall(fbGroups, 6);

  return [...cleanSs, ...cleanWa, ...cleanFb];
}

const merged = getGroups();
console.log('Clustered into', merged.length, 'Ethnic Wear Sets products from', files.length, 'images.');

const names = [
  "Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia",
  "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi",
  "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha",
  "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika",
  "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee",
  "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii",
  "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya",
  "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi"
];

const styles = [
  "Embroidered Kurta, Pant & Organza Dupatta 3-Piece Set",
  "Chanderi Silk Kalidar Anarkali & Dupatta 3-Piece Set",
  "Handcrafted Gota Patti Kurti & Sharara 3-Piece Set",
  "Zari Flared Angrakha & Palazzo Dupatta 3-Piece Set",
  "Chikankari Hand-Embroidered Kurta & Pant Set with Dupatta",
  "Bandhani Print Tiered Kurta & Flared Pant 3-Piece Set",
  "Luxe Georgette Sequinned Kurta & Gharara 3-Piece Set",
  "Pure Mulmul Block-Printed Kurta, Pant & Chiffon Dupatta Set",
  "Banarasi Brocade Yoke Kurta & Cigarette Pant 3-Piece Set",
  "Mirror-Work Peplum Kurti & Dhoti Pant 3-Piece Set",
  "Resham Embroidered Straight Kurta & Trouser Dupatta Set",
  "Artisanal Modal Silk Flared Kurta & Palazzo 3-Piece Set",
  "Jacquard Woven Festive Kurta & Sharara 3-Piece Set",
  "Foil Print Anarkali Kurta & Churidar Dupatta Set",
  "Floral Embroidered Notch-Neck Kurta & Pant 3-Piece Set"
];

const fabrics = [
  "Lustrous Chanderi Silk with Cotton Voile Lining",
  "Pure Mulmul Cotton 60:60 with Hand-Block Print",
  "Fine Georgette with Scalloped Organza Dupatta",
  "Pure Modal Silk Blend with Gota Accents",
  "Artisanal Slub Cotton Silk with Zari Motifs",
  "Rich Banarasi Weave with Crepe Silk Lining",
  "Fine Muslin with Hand-Embroidery",
  "Breathable Rayon Slub with Metallic Highlights"
];

const badges = [
  "Export Bestseller",
  "3-Piece Set",
  "Artisan Handcraft",
  "Chanderi Silk",
  "Festive Edition",
  "Pure Mulmul"
];

const detailsOptions = [
  ['Complete 3-piece designer ensemble: Tailored Kurta, Coordinating Pant/Palazzo, and Finished Dupatta', 'Handcrafted Zari & Resham embroidery on neckline and sleeves', 'Available in assorted export size packs (XS-XXL)', 'Flexible B2B wholesale MOQ: 20 pcs per style'],
  ['Opulent kalidar flare with pre-shrunk cotton lining for all-day comfort', 'Intricate Gota Patti border detailing on hemline and dupatta edges', 'Meets European & American export textile compliance', 'Custom private label branding and bespoke tags available'],
  ['Versatile festive wear ensemble with rich tonal accents and matching bottom', 'Fade-resistant eco-friendly reactive dyes with vibrant colorfastness', 'Assorted size breakdown packs or customized grading', 'Doorstep air courier & sea freight container shipping worldwide'],
  ['Contemporary heritage cut with delicate artisan needlework', 'Lightweight breathable dupatta with scallop embroidered borders', 'Export-ready packaging with individual barcode polybags', 'Express worldwide dispatch via DHL, FedEx & ocean cargo']
];

const products = merged.map((group, index) => {
  const prefix = names[index % names.length];
  const style = styles[(index * 7 + 4) % styles.length];
  const title = `${prefix} ${style}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${index + 1}`;
  const id = `ew-${String(index + 1).padStart(3, '0')}`;
  const sku = `WST-EW-${String(index + 101).padStart(3, '0')}`;
  const fabric = fabrics[index % fabrics.length];
  const details = detailsOptions[index % detailsOptions.length];
  const badge = badges[index % badges.length];

  const imagePaths = group.map(f => `/ethnic-wear-sets/${encodeURIComponent(f)}`);

  return {
    id,
    title,
    slug,
    tab: 'ethnic-wear-sets',
    category: 'ethnic-wear-sets',
    badge,
    regularPrice: 0,
    salePrice: 0,
    images: imagePaths,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: `The ${title} (${sku}) is an opulent 3-piece ethnic wear creation from Wastram's premier wholesale export collection. Expertly crafted in ${fabric}, it pairs an exquisitely embroidered kurta, coordinated trousers or palazzo, and a designer dupatta, crafted to international export standards for boutique curation, festive occasions, and global ethnic retail.`,
    fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  };
});

const fileContent = `// Auto-generated Ethnic Wear Sets (3-Piece Sets) catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const ETHNIC_WEAR_SETS: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'ethnic-wear-sets.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully written', products.length, 'Ethnic Wear Sets to', outputPath);
