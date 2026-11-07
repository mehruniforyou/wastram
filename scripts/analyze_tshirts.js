const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'T-shirts-all-product-image');
const files = fs.readdirSync(dir);

console.log('Total files:', files.length);

const categories = {
  fb: [],
  wa: [],
  mg: [],
  img_camera: [],
  pure_numeric: [],
  hash: [],
  screenshot: [],
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
  } else if (f.startsWith('Screenshot_')) {
    categories.screenshot.push(f);
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
  console.log('Other files:', categories.other.slice(0, 15));
}

function sample(arr, n = 5) {
  return arr.slice(0, n);
}

for (const [k, arr] of Object.entries(categories)) {
  if (arr.length > 0) {
    console.log(`${k} sample:`, sample(arr));
  }
}
