const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '3-piece-sets-all-product-image');
const files = fs.readdirSync(dir);

const ss = files.filter(f => f.startsWith('Screenshot_'));
console.log('Screenshots:', ss);

const wa = files.filter(f => /^IMG-\d+-WA\d+/i.test(f)).map(f => {
  const m = f.match(/IMG-(\d+)-WA(\d+)/i);
  return { file: f, date: m ? m[1] : '', num: m ? parseInt(m[2], 10) : 0 };
}).sort((a,b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.num - b.num);

console.log('WA dates:', [...new Set(wa.map(w => w.date))]);
console.log('WA first 15:', wa.slice(0, 15));

const fb = files.filter(f => f.startsWith('FB_IMG_')).map(f => {
  const m = f.match(/FB_IMG_(\d+)/);
  return { file: f, time: m ? parseInt(m[1], 10) : 0 };
}).sort((a,b) => a.time - b.time);

console.log('FB first 15:', fb.slice(0, 15));
