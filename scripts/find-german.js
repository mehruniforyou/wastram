const fs = require('fs');

const code = fs.readFileSync('app/admin/AdminClientPage.tsx', 'utf8');

// German terms from speaker/axos legacy
const germanWords = [
  'Back zu', 'zurück', 'löschen', 'bearbeiten', 'speichern', 'abbrechen',
  'Hauptbild', 'Kupfer', 'Sicken', 'Spule', 'Durchmesser', 'Impedanz',
  'Schwingspule', 'Membran', 'Staubschutzkappe', 'Zentrierspinne',
  'Häufige Fragen', 'Galerie-Imageer', 'Product-Imageer', 'Color Variantsname',
  'Spezifikationen', 'auswählen', 'ausgewählt', 'ausklappen', 'einklappen',
  'hinzufügen', 'Übersicht', 'Bestellungen', 'Kunden', 'Einstellungen',
  'Versand', 'Steuer', 'Rechnung', 'Gutschein', 'Rabatt', 'Lagerbestand'
];

const found = [];
const lines = code.split('\n');
lines.forEach((line, lineNo) => {
  for (const word of germanWords) {
    if (new RegExp('\\b' + word + '\\b', 'i').test(line) || line.includes(word)) {
      found.push({ lineNo: lineNo + 1, word, text: line.trim() });
    }
  }
});

console.log(`Found ${found.length} German matches in AdminClientPage.tsx:`);
found.forEach(f => console.log(`L${f.lineNo}: [${f.word}] ${f.text.slice(0, 100)}`));
