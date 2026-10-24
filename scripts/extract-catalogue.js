const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const poppler = 'C:\\Users\\aleen\\AppData\\Local\\Microsoft\\WinGet\\Packages\\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\\poppler-25.07.0\\Library\\bin';

console.log('1. Extracting 3-piece-sets...');
execSync(`"${poppler}\\pdfimages.exe" -j -p -f 1 -l 20 "3 PCS SET - DOM.pdf" "public/images/products/3-piece-sets/item"`, { stdio: 'inherit' });

console.log('2. Extracting co-ord-sets...');
execSync(`"${poppler}\\pdfimages.exe" -j -p -f 1 -l 20 "CO-ORDS SET - DOM.pdf" "public/images/products/co-ord-sets/item"`, { stdio: 'inherit' });

console.log('3. Extracting dresses...');
execSync(`"${poppler}\\pdfimages.exe" -j -p -f 1 -l 20 "DRESS - DOM.pdf" "public/images/products/dresses/item"`, { stdio: 'inherit' });

console.log('4. Extracting kurtas...');
execSync(`"${poppler}\\pdfimages.exe" -j -p -f 1 -l 20 "New Kurta.pdf" "public/images/products/kurtas/item"`, { stdio: 'inherit' });

console.log('5. Extracting tops-tunics...');
execSync(`"${poppler}\\pdfimages.exe" -j -p -f 1 -l 20 "TOPS (13).pdf" "public/images/products/tops-tunics/item"`, { stdio: 'inherit' });

console.log('6. Extracting satin-shirts...');
execSync(`"${poppler}\\pdftoppm.exe" -jpeg -r 100 -f 2 -l 17 "satin shirt wholesale.pdf" "public/images/products/satin-shirts/item"`, { stdio: 'inherit' });

console.log('7. Extracting lehengas...');
execSync(`"${poppler}\\pdftoppm.exe" -jpeg -r 100 -f 4 -l 18 "3.pdf" "public/images/products/lehengas/item"`, { stdio: 'inherit' });

console.log('All extractions complete!');
