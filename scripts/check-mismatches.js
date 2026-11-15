const fs = require('fs');

const code = fs.readFileSync('data/products.ts', 'utf8');

// Match every product block in PRODUCTS array
// A product starts with `  {\n    "id":` and ends with `  },`
const blocks = code.split(/\n\s*\{\s*\n\s*"id":/);
console.log('Total blocks found:', blocks.length - 1);

const issues = [];
for (let i = 1; i < blocks.length; i++) {
  const b = '{"id":' + blocks[i].split(/\n\s*\},/)[0] + '}';
  const idMatch = b.match(/"id":\s*"([^"]+)"/);
  const nameMatch = b.match(/"name":\s*"([^"]+)"/);
  const catMatch = b.match(/"category":\s*"([^"]+)"/);

  if (!idMatch || !nameMatch || !catMatch) continue;

  const id = idMatch[1];
  const name = nameMatch[1];
  const cat = catMatch[1];
  const n = name.toLowerCase();

  let reason = '';
  if (cat === 'traditional-gowns') {
    if (n.includes('shirt') || n.includes('top ') || n.includes('hoodie') || n.includes('tee') || n.includes('kaftan') || n.includes('co-ord')) {
      reason = 'Traditional gown named as ' + name;
    }
  } else if (cat === 'tops-shirts') {
    if (n.includes('gown') || n.includes('anarkali') || n.includes('umbrella') || n.includes('maxi dress') || n.includes('kaftan') || n.includes('co-ord')) {
      reason = 'Top/shirt named as ' + name;
    }
  } else if (cat === 'cord-sets') {
    if (n.includes('gown') || n.includes('anarkali') || n.includes('umbrella') || n.includes('shirtdress') || n.includes('kaftan') || n.includes('maxi dress')) {
      reason = 'Co-ord set named as ' + name;
    }
  } else if (cat === 'denim-collection') {
    if (n.includes('gown') || n.includes('anarkali') || n.includes('kaftan') || n.includes('umbrella')) {
      reason = 'Denim named as ' + name;
    }
  } else if (cat === 'short-long-kaftan') {
    if (n.includes('gown') || n.includes('shirtdress') || n.includes('hoodie') || n.includes('tee') || n.includes('co-ord')) {
      reason = 'Kaftan named as ' + name;
    }
  } else if (cat === 'umbrella-dresses') {
    if (n.includes('shirtdress') || n.includes('hoodie') || n.includes('tee') || n.includes('co-ord') || n.includes('kaftan')) {
      reason = 'Umbrella dress named as ' + name;
    }
  } else if (cat === 't-shirts') {
    if (n.includes('gown') || n.includes('dress') || n.includes('kaftan') || n.includes('co-ord')) {
      reason = 'T-shirt named as ' + name;
    }
  } else if (cat === 'hoodies-sweatshirts') {
    if (n.includes('gown') || n.includes('dress') || n.includes('kaftan') || n.includes('co-ord')) {
      reason = 'Hoodie named as ' + name;
    }
  }

  if (reason) {
    issues.push({ id, name, cat, reason });
  }
}

console.log('Total contradictory products found:', issues.length);
console.log(JSON.stringify(issues, null, 2));
