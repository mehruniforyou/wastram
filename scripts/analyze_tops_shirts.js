const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'skirt-top-all-product-images');
const files = fs.readdirSync(dir);

console.log('Total files:', files.length);

const categories = {
  fb: [],
  wa: [],
  mg: [],
  img_camera: [],
  pure_numeric: [],
  hash: [],
  other: []
};

files.forEach(f => {
  if (f.startsWith('FB_IMG_')) {
    categories.fb.push(f);
  } else if (/^IMG-\d+-WA\d+/i.test(f)) {
    categories.wa.push(f);
  } else if (f.startsWith('_MG_')) {
    categories.mg.push(f);
  } else if (/^IMG_?\d{8}/i.test(f)) {
    categories.img_camera.push(f);
  } else if (/^[0-9a-f]{32}/i.test(f)) {
    categories.hash.push(f);
  } else if (/^\d+[\s\(\)\d]*\.(jpe?g|png)/i.test(f)) {
    categories.pure_numeric.push(f);
  } else {
    categories.other.push(f);
  }
});

for (const [k, arr] of Object.entries(categories)) {
  console.log(`${k}: ${arr.length} files`);
}

if (categories.other.length > 0) {
  console.log('Other files:', categories.other);
}

console.log('--- Pure numeric sample ---');
console.log(categories.pure_numeric.slice(0, 10));

console.log('--- IMG camera sample ---');
console.log(categories.img_camera.slice(0, 15));

console.log('--- WA sample ---');
console.log(categories.wa.slice(0, 10));
