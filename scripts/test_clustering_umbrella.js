const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'umbrella-dresses-all-product-image');
const files = fs.readdirSync(dir);

// 1. Pure Numeric files: sort by number and cluster consecutive/close numbers into groups of 3-5 images
const numFiles = files.filter(f => /^\d+[\s\(\)\d]*\.(jpe?g|png)/i.test(f)).map(f => {
  const m = f.match(/^(\d+)/);
  return { file: f, num: m ? parseInt(m[1], 10) : 0 };
}).sort((a,b) => a.num - b.num);

const numGroups = [];
let currNum = [numFiles[0].file];
for (let i = 1; i < numFiles.length; i++) {
  const prev = numFiles[i-1];
  const curr = numFiles[i];
  if (curr.num - prev.num > 8 || currNum.length >= 5) {
    numGroups.push(currNum);
    currNum = [curr.file];
  } else {
    currNum.push(curr.file);
  }
}
if (currNum.length > 0) numGroups.push(currNum);

// 2. FB files: parse timestamp and cluster
const fbFiles = files.filter(f => f.startsWith('FB_IMG_')).map(f => {
  const m = f.match(/FB_IMG_(\d+)/);
  return { file: f, time: m ? parseInt(m[1], 10) : 0 };
}).sort((a,b) => a.time - b.time);

const fbGroups = [];
let currFb = [fbFiles[0].file];
for (let i = 1; i < fbFiles.length; i++) {
  const prev = fbFiles[i-1];
  const curr = fbFiles[i];
  if (curr.time - prev.time > 40000 || currFb.length >= 5) {
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

const cleanNum = mergeSmall(numGroups, 5);
const cleanFb = mergeSmall(fbGroups, 6);

const all = [...cleanNum, ...cleanFb];
console.log('Total clustered Umbrella Dresses products:', all.length);
console.log('Numeric:', cleanNum.length, 'FB:', cleanFb.length);

let totalImg = 0;
all.forEach(g => totalImg += g.length);
console.log('Total images accounted for:', totalImg, 'of', files.length);

const sizeDist = {};
all.forEach(g => {
  sizeDist[g.length] = (sizeDist[g.length] || 0) + 1;
});
console.log('Group sizes distribution:', sizeDist);
