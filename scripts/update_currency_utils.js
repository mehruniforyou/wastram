const fs = require('fs');
let c = fs.readFileSync('utils/exportDocsTranslations.ts', 'utf8');
c = c.replace(/currency: DocCurrency = "EUR"/g, 'currency: DocCurrency = "INR"');
c = c.replace(/de-DE/g, 'en-IN');
fs.writeFileSync('utils/exportDocsTranslations.ts', c, 'utf8');
console.log('Updated exportDocsTranslations for INR');
