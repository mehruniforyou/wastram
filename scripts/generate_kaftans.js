const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'short-long-kaftan-all-product-images');
const files = fs.readdirSync(dir);

function getGroups() {
  // 1. Hash files
  const hashFiles = files.filter(f => /^[0-9a-f]{32}/i.test(f)).map(f => {
    const hash = f.slice(0, 32).toLowerCase();
    return { file: f, hash };
  }).sort((a,b) => a.hash.localeCompare(b.hash));

  const hashGroupsMap = new Map();
  hashFiles.forEach(item => {
    if (!hashGroupsMap.has(item.hash)) {
      hashGroupsMap.set(item.hash, []);
    }
    hashGroupsMap.get(item.hash).push(item.file);
  });
  let hashGroups = Array.from(hashGroupsMap.values());

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
    const sameNum = sameDate && prev.num === curr.num;
    const adjacent = sameDate && (curr.num - prev.num <= 2);
    if ((sameNum || adjacent) && currWa.length < 5) {
      currWa.push(curr.file);
    } else {
      waGroups.push(currWa);
      currWa = [curr.file];
    }
  }
  if (currWa.length > 0) waGroups.push(currWa);

  // 3. MG files
  const mgFiles = files.filter(f => f.startsWith('_MG_')).map(f => {
    const m = f.match(/_MG_(\d+)/i);
    return { file: f, num: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.num - b.num);

  const mgGroups = [];
  let currMg = [mgFiles[0].file];
  for (let i = 1; i < mgFiles.length; i++) {
    const prev = mgFiles[i-1];
    const curr = mgFiles[i];
    if (curr.num - prev.num > 3 || currMg.length >= 5) {
      mgGroups.push(currMg);
      currMg = [curr.file];
    } else {
      currMg.push(curr.file);
    }
  }
  if (currMg.length > 0) mgGroups.push(currMg);

  // 4. FB files
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

  // 5. Camera files
  const camFiles = files.filter(f => /^IMG_?\d{8}/i.test(f)).sort();
  const camGroups = camFiles.length > 0 ? [camFiles] : [];

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

  const cleanHash = mergeSmall(hashGroups, 5);
  const cleanWa = mergeSmall(waGroups, 6);
  const cleanMg = mergeSmall(mgGroups, 6);
  const cleanFb = mergeSmall(fbGroups, 6);
  const cleanCam = camGroups;

  return [...cleanHash, ...cleanWa, ...cleanMg, ...cleanFb, ...cleanCam];
}

const merged = getGroups();
console.log('Clustered into', merged.length, 'Short & Long Kaftan products from', files.length, 'images.');

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
  "Urvi", "Varsha", "Vedika", "Yamini", "Zenia", "Anika", "Bani", "Chahat", "Damini", "Falguni",
  "Gul", "Heena", "Iravati", "Juhi", "Kiran", "Leela", "Madhavi", "Nandini", "Ojasvi", "Payal"
];

const styles = [
  "Printed Silk Crepe Maxi Kaftan",
  "Hand-Block Mulmul Cotton Short Kaftan",
  "Embroidered Chanderi Silk Long Kaftan",
  "Flowing Georgette Drawstring Kaftan Dress",
  "Bandhani Print Kimono Sleeve Long Kaftan",
  "Pure Linen Button-Front Tunic Kaftan",
  "Zari Embroidered Yoke Ankle Kaftan",
  "Tie-Dye Modal Silk Short Kaftan",
  "Lustrous Satin V-Neck Lounge Kaftan",
  "Schiffli Lace Trimmed Resort Kaftan",
  "Artisanal Block-Print Asymmetric Kaftan",
  "Foil Print Festive Kalidar Maxi Kaftan",
  "Chikankari Hand-Embroidered Long Kaftan",
  "Boho Tassel Tie Waist Short Kaftan",
  "Pleated Satin Halter-Neck Evening Kaftan",
  "Handcrafted Mirror-Work Flared Kaftan"
];

const fabrics = [
  "Lustrous Silk Crepe with Soft Flowing Drape",
  "Pure Mulmul Cotton 60:60 with Enzyme Soft Wash",
  "Fine Chanderi Silk with Breathable Cotton Lining",
  "Artisanal Flowing Satin Crepe",
  "Hand-Block Modal Silk Blend",
  "Belgian Slub Linen with Garment Soft Finish",
  "Luxe Pleated Georgette with Subtle Sheen",
  "Breathable Rayon Slub with Vibrant Fast Colours"
];

const badges = [
  "Export Bestseller",
  "Resort Luxe",
  "Pure Cotton",
  "Silk Crepe",
  "Artisan Handcraft",
  "High-Demand Pack"
];

const detailsOptions = [
  ['Relaxed flowing silhouette with adjustable internal drawstring waist and tassel ties', 'Hand-finished neck embroidery with reinforced export-grade stitching', 'Available in assorted export size packs (XS-XXL + Free Size)', 'Flexible B2B wholesale MOQ: 20 pcs per style / print'],
  ['Dramatic kimono sleeves with side vents for graceful movement and breeze', 'Pre-shrunk breathable luxury textile tested for international retail compliance', 'Meets European & American export textile standards', 'Custom private label branding and bespoke tags available'],
  ['Versatile resort-to-evening styling with refined drapery and concealed finishing', 'Fade-resistant eco-friendly reactive dyes with rich tonal longevity', 'Assorted size breakdown packs or customized grading', 'Doorstep air courier & sea freight container shipping worldwide'],
  ['Contemporary bohemian luxury silhouette with delicate artisan needlework', 'Lightweight breathable drape perfect for holiday, lounge, and high-end resort wear', 'Export-ready packaging with individual barcode polybags', 'Express worldwide dispatch via DHL, FedEx & ocean cargo']
];

const products = merged.map((group, index) => {
  const prefix = names[index % names.length];
  const style = styles[(index * 7 + 1) % styles.length];
  const title = `${prefix} ${style}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${index + 1}`;
  const id = `kf-${String(index + 1).padStart(3, '0')}`;
  const sku = `WST-KF-${String(index + 101).padStart(3, '0')}`;
  const fabric = fabrics[index % fabrics.length];
  const details = detailsOptions[index % detailsOptions.length];
  const badge = badges[index % badges.length];

  const imagePaths = group.map(f => `/short-long-kaftan/${encodeURIComponent(f)}`);

  return {
    id,
    title,
    slug,
    tab: 'short-long-kaftan',
    category: 'short-long-kaftan',
    badge,
    regularPrice: 0,
    salePrice: 0,
    images: imagePaths,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    description: `The ${title} (${sku}) is a distinguished piece from Wastram's premier Short & Long Kaftan wholesale export collection. Expertly tailored in ${fabric}, it combines effortless bohemian luxury, fluid silhouettes, and export-grade craftsmanship, making it an essential high-margin staple for international boutiques, luxury resort wear, and global fashion department stores.`,
    fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  };
});

const fileContent = `// Auto-generated Short & Long Kaftan catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const SHORT_LONG_KAFTANS: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'short-long-kaftan.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully written', products.length, 'Short & Long Kaftans to', outputPath);
