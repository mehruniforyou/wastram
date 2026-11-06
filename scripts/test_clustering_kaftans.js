const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'short-long-kaftan-all-product-images');
const files = fs.readdirSync(dir);

// 1. Hash files: group by 32-character hash prefix
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

// 2. WA files: sort by date and waNum
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

// 3. MG files: sort by camera sequence number
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

// 4. FB files: parse timestamp
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

// 5. Camera files: sort and group
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

const all = [...cleanHash, ...cleanWa, ...cleanMg, ...cleanFb, ...cleanCam];
console.log('Total clustered Kaftans products:', all.length);
console.log('Hash:', cleanHash.length, 'Wa:', cleanWa.length, 'Mg:', cleanMg.length, 'Fb:', cleanFb.length, 'Cam:', cleanCam.length);

let totalImg = 0;
all.forEach(g => totalImg += g.length);
console.log('Total images accounted for:', totalImg, 'of', files.length);

const sizeDist = {};
all.forEach(g => {
  sizeDist[g.length] = (sizeDist[g.length] || 0) + 1;
});
console.log('Group sizes distribution:', sizeDist);
