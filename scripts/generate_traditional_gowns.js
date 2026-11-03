const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'traditional-gown-all-product-images');
const files = fs.readdirSync(dir);

const parsed = files.map(f => {
  const isFB = f.startsWith('FB_IMG_');
  let key = 0;
  if (isFB) {
    const m = f.match(/FB_IMG_(\d+)/);
    key = m ? parseInt(m[1], 10) : 0;
  } else {
    const m = f.match(/^(\d+)/);
    key = m ? parseInt(m[1], 10) : 0;
  }
  return { file: f, isFB, key };
});

const numericFiles = parsed.filter(x => !x.isFB).sort((a,b) => a.key - b.key);
const fbFiles = parsed.filter(x => x.isFB).sort((a,b) => a.key - b.key);

// Cluster numeric
const numericGroups = [];
let currNum = [numericFiles[0]];
for (let i = 1; i < numericFiles.length; i++) {
  const prev = numericFiles[i-1];
  const curr = numericFiles[i];
  const gap = curr.key - prev.key;
  if (gap > 6 || currNum.length >= 6) {
    numericGroups.push(currNum);
    currNum = [curr];
  } else {
    currNum.push(curr);
  }
}
if (currNum.length > 0) numericGroups.push(currNum);

// Cluster FB
const fbGroups = [];
let currFB = [fbFiles[0]];
for (let i = 1; i < fbFiles.length; i++) {
  const prev = fbFiles[i-1];
  const curr = fbFiles[i];
  const diff = curr.key - prev.key;
  if (diff > 35000 || currFB.length >= 6) {
    fbGroups.push(currFB);
    currFB = [curr];
  } else {
    currFB.push(curr);
  }
}
if (currFB.length > 0) fbGroups.push(currFB);

const allRaw = [...numericGroups, ...fbGroups];

// Merge small groups (1 or 2 images) with adjacent
const merged = [];
for (let i = 0; i < allRaw.length; i++) {
  const p = allRaw[i];
  if (p.length <= 2 && merged.length > 0 && merged[merged.length - 1].length + p.length <= 7 && merged[merged.length - 1][0].isFB === p[0].isFB) {
    merged[merged.length - 1].push(...p);
  } else {
    merged.push(p);
  }
}
for (let i = 0; i < merged.length - 1; i++) {
  if (merged[i].length <= 2 && merged[i+1].length + merged[i].length <= 7 && merged[i][0].isFB === merged[i+1][0].isFB) {
    merged[i+1].unshift(...merged[i]);
    merged.splice(i, 1);
    i--;
  }
}

// Any remaining <= 2 length groups, merge with next regardless
for (let i = 0; i < merged.length - 1; i++) {
  if (merged[i].length <= 2) {
    merged[i+1].unshift(...merged[i]);
    merged.splice(i, 1);
    i--;
  }
}

console.log('Clustered into', merged.length, 'Traditional Gowns products from', files.length, 'images.');

const names = [
  "Ananya", "Noor", "Mehr", "Zoya", "Riddhi", "Sitara", "Aanya", "Tara", "Saanvi", "Diya",
  "Kiara", "Ishita", "Naira", "Reet", "Pari", "Kavya", "Tanvi", "Meera", "Siya", "Avani",
  "Rhea", "Isha", "Bhavna", "Radhika", "Pooja", "Shreya", "Aditi", "Simran", "Trisha", "Vanya",
  "Alia", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha",
  "Madhuri", "Juhi", "Rani", "Kajol", "Rekha", "Sridevi", "Hema", "Jaya", "Vidya", "Kangana",
  "Tabu", "Kriti", "Disha", "Kiara", "Tara", "Bhumi", "Yami", "Taapsee", "Nushrratt", "Tamannaah",
  "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Trisha", "Kajal", "Hansika", "Raashii",
  "Mrinal", "Sanya", "Fatima", "Sobhita", "Radhika", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly",
  "Ananya", "Rhea", "Shanaya", "Khushi", "Suhana", "Navya", "Alanna", "Aaliyah", "Palak", "Ibrahim",
  "Roohi", "Inaaya", "Mehr", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya"
];

const styles = [
  "Zari Flared Anarkali Gown",
  "Embroidered Organza Festive Gown",
  "Handcrafted Chanderi Silk Gown",
  "Sequin Embellished Party Gown",
  "Gota Patti Royal Flared Gown",
  "Chikankari Pleated Floor Gown",
  "Banarasi Brocade Evening Gown",
  "Foil Print Tiered Festive Gown",
  "Mirror Work Flared Anarkali Gown",
  "Luxe Georgette Draped Gown",
  "Bandhani Print Festive Gown",
  "Velvet Bodice Flared Gown",
  "Jacquard Weave Royal Gown",
  "Hand-Block Printed Silk Gown",
  "Asymmetric Flounce Evening Gown",
  "Zardozi Work Bridal Gown"
];

const fabrics = [
  "Fine Chanderi Silk with Zari Border",
  "Luxe Organza Silk with Resham Embroidery",
  "Artisanal Flowing Georgette",
  "Pure Banarasi Brocade Silk",
  "Lustrous Velvet Crepe",
  "Pure Mulmul Silk Blend",
  "Fine Cotton Silk with Gota Accents",
  "Lustrous Satin Habotai"
];

const detailsOptions = [
  ['Handcrafted Zari & Resham neckline embroidery', 'Full flared floor-length kalidar silhouette', 'Available in assorted size packs (XS-XXL)', 'Flexible B2B wholesale MOQ: 20 pcs'],
  ['Intricate Gota Patti border with hand-finished hem', 'Concealed side zipper with tailored bust padding', 'Export-grade reinforcement seams for international retail', 'Custom private label and branding available'],
  ['Lustrous metallic foil print with artisan tassels', 'Double-lined bodice with breathable crepe lining', 'Export compliance with UK/EU textile standards', 'Doorstep air & sea cargo dispatch worldwide'],
  ['Rich heritage festive silhouette with heavy flare', 'Colour-fast pre-shrunk fabrics with vibrant tone', 'Assorted size packs or custom bespoke size grading', 'Worldwide DHL/FedEx courier & ocean freight']
];

const products = merged.map((group, index) => {
  const prefix = names[index % names.length];
  const style = styles[(index * 5 + 2) % styles.length];
  const title = `${prefix} ${style}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${index + 1}`;
  const id = `tg-${String(index + 1).padStart(3, '0')}`;
  const sku = `WST-TG-${String(index + 101).padStart(3, '0')}`;
  const fabric = fabrics[index % fabrics.length];
  const details = detailsOptions[index % detailsOptions.length];

  const imagePaths = group.map(f => `/traditional-gowns/${encodeURIComponent(f.file)}`);

  return {
    id,
    title,
    slug,
    tab: 'traditional-gowns',
    category: 'traditional-gowns',
    badge: index % 4 === 0 ? 'Royal Bestseller' : (index % 3 === 0 ? 'Artisan Handcraft' : 'Export Grade'),
    regularPrice: 0,
    salePrice: 0,
    images: imagePaths,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: `The ${title} (${sku}) is a regal Indian traditional gown from Wastram's export collection. Crafted in ${fabric}, it combines traditional artisan detailing, an opulent flared silhouette, and export-grade finishing for international fashion boutiques, ethnic retailers, and global bridal markets.`,
    fabric,
    details,
    moq: '20 pcs / Flexible Wholesale Pack',
    sku
  };
});

const fileContent = `// Auto-generated Traditional Gowns catalogue dataset for B2B Wholesale
import { NishoramaProduct } from './nishorama-data';

export const TRADITIONAL_GOWNS: NishoramaProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'traditional-gowns.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully written', products.length, 'traditional gowns to', outputPath);
