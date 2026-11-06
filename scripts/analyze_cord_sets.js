const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'cord-set-all-product-images');
const files = fs.readdirSync(dir);

function sample(arr, n = 10) {
  return arr.slice(0, n);
}

const fb = files.filter(f => f.startsWith('FB_IMG_'));
const wa = files.filter(f => /^IMG-\d+-WA\d+/i.test(f));
const mg = files.filter(f => f.startsWith('_MG_'));
const numeric = files.filter(f => /^\d+\.jpg\.jpeg$/i.test(f));
const screenshot = files.filter(f => f.startsWith('Screenshot_'));
const hash = files.filter(f => /^[0-9a-f]{32}/i.test(f));

console.log('--- FB samples ---');
console.log(sample(fb));

console.log('--- WA samples ---');
console.log(sample(wa));

console.log('--- MG samples ---');
console.log(sample(mg));

console.log('--- Numeric samples ---');
console.log(sample(numeric));

console.log('--- Screenshot samples ---');
console.log(screenshot);

console.log('--- Hash samples ---');
console.log(hash);
