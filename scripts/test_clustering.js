const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'cord-set-all-product-images');
const files = fs.readdirSync(dir);

function getGroups() {
  // 1. MG
  const mgFiles = files.filter(f => f.startsWith('_MG_')).sort();
  const mgGroups = [];
  let currMg = [mgFiles[0]];
  for (let i = 1; i < mgFiles.length; i++) {
    const prevNum = parseInt(mgFiles[i-1].match(/_MG_(\d+)/i)[1], 10);
    const currNum = parseInt(mgFiles[i].match(/_MG_(\d+)/i)[1], 10);
    if (currNum - prevNum > 2 || currMg.length >= 6) {
      mgGroups.push(currMg);
      currMg = [mgFiles[i]];
    } else {
      currMg.push(mgFiles[i]);
    }
  }
  if (currMg.length > 0) mgGroups.push(currMg);

  // 2. SS
  const ssFiles = files.filter(f => f.startsWith('Screenshot_')).sort();
  const ssGroups = [];
  let currSs = [ssFiles[0]];
  for (let i = 1; i < ssFiles.length; i++) {
    const prevMin = ssFiles[i-1].slice(0, 26);
    const currMin = ssFiles[i].slice(0, 26);
    if (prevMin !== currMin || currSs.length >= 5) {
      ssGroups.push(currSs);
      currSs = [ssFiles[i]];
    } else {
      currSs.push(ssFiles[i]);
    }
  }
  if (currSs.length > 0) ssGroups.push(currSs);

  // 3. WA
  const waFiles = files.filter(f => /^IMG-\d+-WA\d+/i.test(f)).map(f => {
    const m = f.match(/IMG-(\d+)-WA(\d+)/i);
    return { file: f, date: m ? m[1] : '', num: m ? parseInt(m[2], 10) : 0 };
  }).sort((a,b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.num - b.num);

  const waGroups = [];
  let currWa = [waFiles[0].file];
  for (let i = 1; i < waFiles.length; i++) {
    const prev = waFiles[i-1];
    const curr = waFiles[i];
    if (prev.date !== curr.date || curr.num - prev.num > 3 || currWa.length >= 5) {
      waGroups.push(currWa);
      currWa = [curr.file];
    } else {
      currWa.push(curr.file);
    }
  }
  if (currWa.length > 0) waGroups.push(currWa);

  // 4. FB
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

  // 5. Numeric: cluster consecutive or small-gap items up to 4 images
  const numFiles = files.filter(f => /^\d+\.jpg\.jpeg$/i.test(f)).map(f => {
    const m = f.match(/^(\d+)/);
    return { file: f, num: m ? parseInt(m[1], 10) : 0 };
  }).sort((a,b) => a.num - b.num);

  const numGroups = [];
  let currNum = [numFiles[0].file];
  for (let i = 1; i < numFiles.length; i++) {
    const prev = numFiles[i-1];
    const curr = numFiles[i];
    if (curr.num - prev.num > 25 || currNum.length >= 4) {
      numGroups.push(currNum);
      currNum = [curr.file];
    } else {
      currNum.push(curr.file);
    }
  }
  if (currNum.length > 0) numGroups.push(currNum);

  // 6. Hash
  const hashFiles = files.filter(f => /^[0-9a-f]{32}/i.test(f)).sort();
  const hashGroups = [];
  for (let i = 0; i < hashFiles.length; i += 3) {
    hashGroups.push(hashFiles.slice(i, i + 3));
  }

  // Combine and merge small groups within each bucket
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
    // Final check: if still any singleton, merge with neighbor unconditionally
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

  const cleanMg = mergeSmall(mgGroups, 7);
  const cleanSs = mergeSmall(ssGroups, 6);
  const cleanWa = mergeSmall(waGroups, 6);
  const cleanFb = mergeSmall(fbGroups, 6);
  const cleanNum = mergeSmall(numGroups, 5);
  const cleanHash = mergeSmall(hashGroups, 4);

  const all = [...cleanMg, ...cleanSs, ...cleanWa, ...cleanFb, ...cleanNum, ...cleanHash];
  return { all, cleanMg, cleanSs, cleanWa, cleanFb, cleanNum, cleanHash };
}

const { all, cleanMg, cleanSs, cleanWa, cleanFb, cleanNum, cleanHash } = getGroups();
console.log('Final clustered products:', all.length);
console.log('Mg:', cleanMg.length, 'Ss:', cleanSs.length, 'Wa:', cleanWa.length, 'Fb:', cleanFb.length, 'Num:', cleanNum.length, 'Hash:', cleanHash.length);

let totalImg = 0;
all.forEach(g => totalImg += g.length);
console.log('Total images accounted for:', totalImg, 'of 406');

const sizeDist = {};
all.forEach(g => {
  sizeDist[g.length] = (sizeDist[g.length] || 0) + 1;
});
console.log('Group sizes distribution:', sizeDist);
