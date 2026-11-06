const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '3-piece-sets-all-product-image');
const files = fs.readdirSync(dir);

// 1. Screenshots: cluster by minute / group
const ssFiles = files.filter(f => f.startsWith('Screenshot_')).sort();
const ssGroups = [];
if (ssFiles.length > 0) {
  ssGroups.push(ssFiles);
}

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
  const gap = curr.num - prev.num;
  if (!sameDate || gap > 4 || currWa.length >= 6) {
    waGroups.push(currWa);
    currWa = [curr.file];
  } else {
    currWa.push(curr.file);
  }
}
if (currWa.length > 0) waGroups.push(currWa);

// 3. FB files: parse timestamp
const fbFiles = files.filter(f => f.startsWith('FB_IMG_')).map(f => {
  const m = f.match(/FB_IMG_(\d+)/);
  return { file: f, time: m ? parseInt(m[1], 10) : 0 };
}).sort((a,b) => a.time - b.time);

const fbGroups = [];
let currFb = [fbFiles[0].file];
for (let i = 1; i < fbFiles.length; i++) {
  const prev = fbFiles[i-1];
  const curr = fbFiles[i];
  if (curr.time - prev.time > 40000 || currFb.length >= 6) {
    fbGroups.push(currFb);
    currFb = [curr.file];
  } else {
    currFb.push(curr.file);
  }
}
if (currFb.length > 0) fbGroups.push(currFb);

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

const cleanSs = ssGroups;
const cleanWa = mergeSmall(waGroups, 6);
const cleanFb = mergeSmall(fbGroups, 6);

const all = [...cleanSs, ...cleanWa, ...cleanFb];
console.log('Total clustered Ethnic Wear Sets products:', all.length);
console.log('Ss:', cleanSs.length, 'Wa:', cleanWa.length, 'Fb:', cleanFb.length);

let totalImg = 0;
all.forEach(g => totalImg += g.length);
console.log('Total images accounted for:', totalImg, 'of', files.length);

const sizeDist = {};
all.forEach(g => {
  sizeDist[g.length] = (sizeDist[g.length] || 0) + 1;
});
console.log('Group sizes distribution:', sizeDist);
