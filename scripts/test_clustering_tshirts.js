const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'T-shirts-all-product-image');
const files = fs.readdirSync(dir);

// 1. FB files: 3 files
const fbFiles = files.filter(f => f.startsWith('FB_IMG_')).sort();
const fbGroups = fbFiles.length > 0 ? [fbFiles] : [];

// 2. Pure Numeric files: sort by integer and cluster consecutive/close numbers into 3-5 images
const numFiles = files.filter(f => /^\d+[\s\(\)\d]*\.(jpe?g|png)/i.test(f)).map(f => {
  const m = f.match(/^(\d+)/);
  return { file: f, num: m ? parseInt(m[1], 10) : 0 };
}).sort((a,b) => a.num - b.num);

const numGroups = [];
let currNum = [numFiles[0].file];
for (let i = 1; i < numFiles.length; i++) {
  const prev = numFiles[i-1];
  const curr = numFiles[i];
  // If gap > 6 or group has reached 5 images
  if (curr.num - prev.num > 6 || currNum.length >= 5) {
    numGroups.push(currNum);
    currNum = [curr.file];
  } else {
    currNum.push(curr.file);
  }
}
if (currNum.length > 0) numGroups.push(currNum);

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
const all = [...cleanNum, ...fbGroups];

console.log('Total clustered T-Shirts products:', all.length);
console.log('Numeric:', cleanNum.length, 'FB:', fbGroups.length);

let totalImg = 0;
all.forEach(g => totalImg += g.length);
console.log('Total images accounted for:', totalImg, 'of', files.length);

const sizeDist = {};
all.forEach(g => {
  sizeDist[g.length] = (sizeDist[g.length] || 0) + 1;
});
console.log('Group sizes distribution:', sizeDist);
