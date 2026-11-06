const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'skirt-top-all-product-images');
const files = fs.readdirSync(dir);

// 1. WA: Group by base WA number (e.g. WA0005, WA0008) or date+waNum
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
  // If same waNum, definitely same product. If waNum difference <= 1 and same date, same product up to 5 shots.
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

// 2. FB: cluster by timestamp seconds (difference <= 45000ms, up to 6 images)
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

// 3. Pure Numeric: sort by integer and cluster consecutive/close numbers into 3-5 images
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

// 4. Hash: chunk into groups of 3
const hashFiles = files.filter(f => /^[0-9a-f]{32}/i.test(f)).sort();
const hashGroups = [];
for (let i = 0; i < hashFiles.length; i += 3) {
  hashGroups.push(hashFiles.slice(i, i + 3));
}

// 5. MG: sort by camera sequence number
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

// 6. IMG Camera: sort by timestamp
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

const all = [...cleanWa, ...cleanFb, ...cleanNum, ...cleanHash, ...cleanMg, ...cleanCam];
console.log('Total clustered Tops & Shirts products:', all.length);
console.log('Wa:', cleanWa.length, 'Fb:', cleanFb.length, 'Num:', cleanNum.length, 'Hash:', cleanHash.length, 'Mg:', cleanMg.length, 'Cam:', cleanCam.length);

let totalImg = 0;
all.forEach(g => totalImg += g.length);
console.log('Total images accounted for:', totalImg, 'of', files.length);

const sizeDist = {};
all.forEach(g => {
  sizeDist[g.length] = (sizeDist[g.length] || 0) + 1;
});
console.log('Group sizes distribution:', sizeDist);
