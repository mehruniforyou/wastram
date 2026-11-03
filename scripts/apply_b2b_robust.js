const fs = require('fs');
const path = require('path');

function updateFile(filePath, transforms) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const { search, replace, name } of transforms) {
    if (search instanceof RegExp) {
      if (search.test(content)) {
        content = content.replace(search, replace);
        console.log(`[${path.basename(filePath)}] Applied ${name}`);
      } else {
        console.warn(`[${path.basename(filePath)}] Regex not matched for ${name}`);
      }
    } else {
      const normalizedSearch = search.replace(/\r\n/g, '\n');
      const normalizedContent = content.replace(/\r\n/g, '\n');
      if (normalizedContent.includes(normalizedSearch)) {
        const updated = normalizedContent.replace(normalizedSearch, replace.replace(/\r\n/g, '\n'));
        content = updated;
        console.log(`[${path.basename(filePath)}] Applied string replacement for ${name}`);
      } else {
        console.warn(`[${path.basename(filePath)}] String not found for ${name}`);
      }
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Saved ${path.basename(filePath)}`);
  }
}

// 1. CollectionsCatalogue.tsx
updateFile(path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx'), [
  {
    name: 'Add Western Dresses category chip',
    search: /\{\s*id:\s*['"]all['"],\s*label:\s*['"]Shop All['"]\s*\},/g,
    replace: `{ id: 'all', label: 'Shop All' },\n    { id: 'western-dresses', label: 'Western Dresses' },`
  },
  {
    name: 'Replace catalogue price line and Add button with Enquire',
    search: /<div className="flex items-center gap-1\.5 mt-0\.5 font-archivo">[\s\S]*?₹ \{product\.salePrice\.toLocaleString\(\)\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<button[\s\S]*?<span>Add<\/span>[\s\S]*?<\/button>/,
    replace: `<div className="flex items-center gap-1.5 mt-0.5 font-archivo">
                          <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#482922]">
                            Price on Enquiry
                          </span>
                          <span className="text-[2.2vw] md:text-[0.68vw] text-black/50">
                            • {product.moq || 'MOQ 20 pcs'}
                          </span>
                        </div>
                      </div>

                      {/* Enquire Pill Button */}
                      <Link
                        href={\`/products/\${product.slug}\`}
                        className="px-2.5 md:px-3 py-1 md:py-1 rounded-full border border-[#482922] bg-white text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold transition-all flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-2xs"
                      >
                        <span>Enquire</span>
                      </Link>`
  }
]);

// 2. ProductFitsGrid.tsx
updateFile(path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx'), [
  {
    name: 'Add Western Dresses tab',
    search: /const tabs: \{[\s\S]*?\} = \[[\s\S]*?\{\s*id:\s*['"]under-999['"]/,
    replace: `const tabs: { id: string; label: string }[] = [\n    { id: 'western-dresses', label: 'Western Dresses' },\n    { id: 'under-999'`
  },
  {
    name: 'Replace grid card price and Add button with Enquire',
    search: /<div className="flex items-center gap-1\.5 mt-0\.5 font-archivo">[\s\S]*?₹ \{product\.salePrice\.toLocaleString\(\)\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<button[\s\S]*?<span>Add<\/span>[\s\S]*?<\/button>/,
    replace: `<div className="flex items-center gap-1.5 mt-0.5 font-archivo">
                        <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#482922]">
                          Price on Enquiry
                        </span>
                        <span className="text-[2.2vw] md:text-[0.68vw] text-black/50">
                          • {product.moq || 'MOQ 20 pcs'}
                        </span>
                      </div>
                    </div>

                    {/* Enquire Pill Button */}
                    <Link
                      href={\`/products/\${product.slug}\`}
                      className="px-2.5 md:px-3 py-1 md:py-1 rounded-full border border-[#482922] bg-white text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold transition-all flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-2xs"
                    >
                      <span>Enquire</span>
                    </Link>`
  }
]);

// 3. QuickAddModal.tsx
updateFile(path.join(__dirname, '..', 'components', 'QuickAddModal.tsx'), [
  {
    name: 'Replace quick add price',
    search: /<div className="flex items-center gap-2 mt-1">[\s\S]*?₹ \{product\.salePrice\.toLocaleString\(\)\}[\s\S]*?<\/div>/,
    replace: `<div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-[#482922]">Price on Enquiry</span>
              <span className="text-[11px] text-black/50">• {product.moq || 'MOQ: 20 pcs'}</span>
            </div>`
  },
  {
    name: 'Replace Add to Bag button label',
    search: /<span>Add to Bag<\/span>[\s\S]*?₹ \{product\.salePrice\.toLocaleString\(\)\}<\/span>/,
    replace: `<span>Add to Enquiry List</span>`
  }
]);

// 4. SearchModal.tsx
updateFile(path.join(__dirname, '..', 'components', 'SearchModal.tsx'), [
  {
    name: 'Replace search price',
    search: /<div className="flex items-center gap-2 text-xs font-archivo">[\s\S]*?₹ \{p\.salePrice\.toLocaleString\(\)\}[\s\S]*?<\/div>/,
    replace: `<div className="flex items-center gap-2 text-xs font-archivo">
                        <span className="font-bold text-[#482922]">Price on Enquiry</span>
                        <span className="text-[10px] text-black/50">• {p.moq || 'MOQ 20 pcs'}</span>
                      </div>`
  }
]);

// 5. Header.tsx
updateFile(path.join(__dirname, '..', 'components', 'Header.tsx'), [
  {
    name: 'Add Western Dresses nav pill in Desktop Header',
    search: /<Link\s+href="\/collections\/new-in"/,
    replace: `<Link
              href="/collections/western-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00]"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/new-in"`
  }
]);

// 6. MobileNavDrawer.tsx
updateFile(path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx'), [
  {
    name: 'Add Western Dresses link in Mobile Drawer',
    search: /<Link href="\/collections\/shop-all" onClick=\{onClose\} className="hover:text-\[#FF2F00\] block">\s*Shop All\s*<\/Link>\s*<\/li>/,
    replace: `<Link href="/collections/shop-all" onClick={onClose} className="hover:text-[#FF2F00] block">
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/collections/western-dresses" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold block">
                Western Dresses ✦
              </Link>
            </li>`
  }
]);

// 7. app/collections/[category]/page.tsx
updateFile(path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx'), [
  {
    name: 'Add western-dresses static param',
    search: /\{\s*category:\s*['"]shop-all['"]\s*\},/,
    replace: `{ category: 'shop-all' },\n    { category: 'western-dresses' },`
  }
]);
