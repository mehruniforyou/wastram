const fs = require('fs');
let c = fs.readFileSync('components/admin/layout/NavGroup.tsx', 'utf8');
c = c.replace(/item=\{item\}/g, 'item={item as any}');
fs.writeFileSync('components/admin/layout/NavGroup.tsx', c, 'utf8');
console.log('Fixed NavGroup types');
