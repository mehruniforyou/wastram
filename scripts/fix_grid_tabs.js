const fs = require('fs');
const path = require('path');

const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
let code = fs.readFileSync(gridPath, 'utf8');

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted'>('under-999');",
  "const [activeTab, setActiveTab] = useState<string>('western-dresses');"
);

code = code.replace(
  `const tabs: { id: 'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted'; label: string }[] = [
    { id: 'under-999', label: 'UNDER ₹999' },`,
  `const tabs: { id: string; label: string }[] = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'under-999', label: 'UNDER ₹999' },`
);

fs.writeFileSync(gridPath, code, 'utf8');
console.log('ProductFitsGrid tabs updated with Western Dresses!');
