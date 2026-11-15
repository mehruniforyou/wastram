const fs = require('fs');
const path = require('path');

const germanTerms = [
  /\bAlle\b/i,
  /\binsgesamt\b/i,
  /\bSpezifikation/i,
  /\bwählen\b/i,
  /\bzurück\b/i,
  /\bKatalog\b/i,
  /\bLagerbestand/i,
  /\bBestellung/i,
  /\bhinzufügen\b/i,
  /\blöschen\b/i,
  /\bbearbeiten\b/i,
  /\babbrechen\b/i,
  /\bspeichern\b/i,
  /\bÜbersicht\b/i,
  /\bEinstellungen\b/i,
  /\bKunden\b/i,
  /\bWährung\b/i,
  /\bPreis\b/i,
  /\bArtikel/i,
  /\bHauptbild\b/i
];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'dist'].includes(entry.name)) continue;
      scanDir(full);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && !full.includes('scripts')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        for (const term of germanTerms) {
          if (term.test(line)) {
            // Check if it's not an English word (like "allergy" or "alleles" or "allegiance")
            if (/\balle\b/i.test(line) && /\b(gallery|allerg|alleg|parallel|pallet|valley)/i.test(line)) continue;
            console.log(`${full}:${idx + 1}: ${line.trim()}`);
            break;
          }
        }
      });
    }
  }
}

scanDir('.');
