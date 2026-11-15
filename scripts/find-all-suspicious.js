const fs = require('fs');

const code = fs.readFileSync('data/products.ts', 'utf8');

// Find all products by splitting on { "id": or similar
const parts = code.split(/\{\s*"id":/g);
console.log('Parts count:', parts.length);

const allProducts = [];
for (let i = 1; i < parts.length; i++) {
  const block = '{"id":' + parts[i].split(/\n\s*\},/)[0] + '}';
  try {
    // extract key fields using regex to avoid JSON parse errors
    const id = block.match(/"id":\s*"([^"]+)"/)?.[1];
    const name = block.match(/"name":\s*"([^"]+)"/)?.[1];
    const title = block.match(/"title":\s*"([^"]+)"/)?.[1];
    const cat = block.match(/"category":\s*"([^"]+)"/)?.[1];
    const catName = block.match(/"categoryName":\s*"([^"]+)"/)?.[1];
    const mainImg = block.match(/"mainImage":\s*"([^"]+)"/)?.[1];
    const partNumber = block.match(/"partNumber":\s*"([^"]+)"/)?.[1];
    if (id && name) {
      allProducts.push({ id, name, title, cat, catName, mainImg, partNumber, index: i });
    }
  } catch (e) {}
}

console.log('Successfully extracted products:', allProducts.length);

// Let's check distribution of categories
const catCounts = {};
allProducts.forEach(p => {
  catCounts[p.cat] = (catCounts[p.cat] || 0) + 1;
});
console.log('Category counts:', catCounts);

// Check all suspicious products
const suspicious = [];
allProducts.forEach(p => {
  const n = (p.name || '').toLowerCase();
  const c = p.cat || '';
  const img = (p.mainImg || '').toLowerCase();

  // Check if image folder differs from category
  let imgCat = '';
  if (img.startsWith('/')) {
    imgCat = img.split('/')[1];
  }

  // Check name vs category logic
  let issue = null;
  if (c === 'traditional-gowns' && (n.includes('shirt') || n.includes('hoodie') || n.includes('tee') || n.includes('kaftan') || n.includes('top '))) {
    issue = 'Gown has non-gown name: ' + p.name;
  } else if (c === 'tops-shirts' && (n.includes('gown') || n.includes('maxi') || n.includes('anarkali') || n.includes('suit') || n.includes('kaftan'))) {
    issue = 'Top/shirt has gown/dress name: ' + p.name;
  } else if (c === 'cord-sets' && (n.includes('gown') || n.includes('shirtdress') || n.includes('kaftan'))) {
    issue = 'Cord set has dress/gown name: ' + p.name;
  } else if (c === 'denim-collection' && !n.includes('denim') && (n.includes('gown') || n.includes('kaftan') || n.includes('anarkali'))) {
    issue = 'Denim has non-denim name: ' + p.name;
  } else if (c === 'short-long-kaftan' && (n.includes('gown') || n.includes('shirtdress') || n.includes('hoodie'))) {
    issue = 'Kaftan has non-kaftan name: ' + p.name;
  } else if (c === 'umbrella-dresses' && (n.includes('shirt') || n.includes('hoodie') || n.includes('co-ord'))) {
    issue = 'Umbrella dress has non-dress name: ' + p.name;
  }

  if (issue || (imgCat && imgCat !== c)) {
    suspicious.push({ id: p.id, name: p.name, cat: c, imgCat, issue });
  }
});

console.log('Total suspicious products:', suspicious.length);
console.log(JSON.stringify(suspicious.slice(0, 30), null, 2));
