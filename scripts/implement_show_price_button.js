const fs = require('fs');
const path = require('path');

// Helper to replace with regex
function replaceInFile(filePath, regex, replacement, label) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[${path.basename(filePath)}] Successfully applied: ${label}`);
  } else {
    console.warn(`[${path.basename(filePath)}] Regex not matched for: ${label}`);
  }
}

// 1. app/products/[slug]/page.tsx
const pdpPath = path.join(__dirname, '..', 'app', 'products', '[slug]', 'page.tsx');

// Desktop price line replacement
replaceInFile(
  pdpPath,
  /\{\/\* Price Line \*\/\}[\s\S]*?₹ \{product\.regularPrice\.toLocaleString\(\)\}[\s\S]*?₹ \{product\.salePrice\.toLocaleString\(\)\}[\s\S]*?Sale[\s\S]*?<\/div>/,
  `{/* Show Price Button Bar */}
              <div className="flex items-center justify-between py-2.5 border-y border-black/10">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#482922] text-[#F6C582] hover:bg-[#38201a] font-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>Show Price</span>
                </button>

                <span className="px-3 py-1 bg-white border border-[#482922]/20 text-[#482922] text-xs font-bold rounded-full shadow-2xs">
                  {product.moq || 'MOQ: 20 pcs'}
                </span>
              </div>`,
  'Desktop Show Price Button'
);

// Mobile price line replacement
replaceInFile(
  pdpPath,
  /\{\/\* Price Line \*\/\}[\s\S]*?₹ \{product\.regularPrice\.toLocaleString\(\)\}[\s\S]*?₹ \{product\.salePrice\.toLocaleString\(\)\}[\s\S]*?Sale[\s\S]*?<\/div>/,
  `{/* Mobile Show Price Button */}
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <button
              type="button"
              onClick={() => setIsEnquiryModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#482922] text-[#F6C582] font-archivo text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Show Price</span>
            </button>
            <span className="px-2.5 py-0.5 bg-[#FAF8F5] border border-black/15 text-[#482922] text-[10px] font-bold rounded">
              {product.moq || 'MOQ: 20 pcs'}
            </span>
          </div>`,
  'Mobile Show Price Button'
);

// Related products pricing replacement on PDP
replaceInFile(
  pdpPath,
  /<div className="flex items-center gap-1\.5 mt-0\.5 text-xs font-archivo">[\s\S]*?₹ \{rel\.salePrice\.toLocaleString\(\)\}[\s\S]*?<\/div>/,
  `<div className="mt-1">
                        <Link
                          href={\`/products/\${rel.slug}\`}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#482922] text-[#F6C582] font-archivo text-[2.2vw] md:text-[0.72vw] font-bold uppercase tracking-wider hover:bg-[#38201a] transition-all"
                        >
                          <span>Show Price</span>
                        </Link>
                      </div>`,
  'PDP Related Products Show Price Button'
);

// 2. components/CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
replaceInFile(
  catPath,
  /<div className="flex items-center gap-1\.5 mt-0\.5 font-archivo">[\s\S]*?Price on Enquiry[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-1.5 mt-1 font-archivo">
                          <Link
                            href={\`/products/\${product.slug}\`}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#482922] text-[#F6C582] hover:bg-[#38201a] font-archivo text-[2.2vw] md:text-[0.72vw] font-bold uppercase tracking-wider transition-all shadow-2xs"
                          >
                            <span>Show Price</span>
                          </Link>
                          <span className="text-[2.2vw] md:text-[0.68vw] text-black/50">
                            • {product.moq || 'MOQ 20 pcs'}
                          </span>
                        </div>`,
  'Collections Catalogue Show Price Button'
);

// 3. components/ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
replaceInFile(
  gridPath,
  /<div className="flex items-center gap-1\.5 mt-0\.5 font-archivo">[\s\S]*?Price on Enquiry[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-1.5 mt-1 font-archivo">
                        <Link
                          href={\`/products/\${product.slug}\`}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#482922] text-[#F6C582] hover:bg-[#38201a] font-archivo text-[2.2vw] md:text-[0.72vw] font-bold uppercase tracking-wider transition-all shadow-2xs"
                        >
                          <span>Show Price</span>
                        </Link>
                        <span className="text-[2.2vw] md:text-[0.68vw] text-black/50">
                          • {product.moq || 'MOQ 20 pcs'}
                        </span>
                      </div>`,
  'ProductFitsGrid Show Price Button'
);

// 4. components/TapAndViewModal.tsx
const tapPath = path.join(__dirname, '..', 'components', 'TapAndViewModal.tsx');
replaceInFile(
  tapPath,
  /\{\/\* Price \*\/\}[\s\S]*?₹ \{tapAndViewProduct\.regularPrice\.toLocaleString\(\)\}[\s\S]*?₹ \{tapAndViewProduct\.salePrice\.toLocaleString\(\)\}[\s\S]*?Sale[\s\S]*?<\/div>/,
  `{/* Show Price Button Bar */}
            <div className="flex items-center gap-3">
              <Link
                href={\`/products/\${tapAndViewProduct.slug}\`}
                onClick={closeTapAndView}
                className="px-4 py-1.5 rounded-full bg-[#482922] text-[#F6C582] font-archivo text-xs font-bold uppercase tracking-wider hover:bg-[#38201a] transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Show Price</span>
              </Link>
              <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#482922] border border-black/15 px-2 py-0.5 rounded">
                {tapAndViewProduct.moq || 'MOQ: 20 pcs'}
              </span>
            </div>`,
  'TapAndViewModal Show Price Button'
);

// 5. components/QuickAddModal.tsx
const quickPath = path.join(__dirname, '..', 'components', 'QuickAddModal.tsx');
replaceInFile(
  quickPath,
  /<div className="flex items-center gap-2 mt-1">[\s\S]*?Price on Enquiry[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-2 mt-1">
              <Link
                href={\`/products/\${product.slug}\`}
                onClick={onClose}
                className="px-3 py-1 rounded-full bg-[#482922] text-[#F6C582] font-archivo text-[11px] font-bold uppercase tracking-wider hover:bg-[#38201a]"
              >
                Show Price
              </Link>
              <span className="text-[11px] text-black/50">• {product.moq || 'MOQ: 20 pcs'}</span>
            </div>`,
  'QuickAddModal Show Price Button'
);

// 6. components/SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
replaceInFile(
  searchPath,
  /<div className="flex items-center gap-2 text-xs font-archivo">[\s\S]*?Price on Enquiry[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-2 text-xs font-archivo mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#482922] text-[#F6C582] text-[10px] font-bold uppercase tracking-wider">
                          Show Price
                        </span>
                        <span className="text-[10px] text-black/50">• {p.moq || 'MOQ 20 pcs'}</span>
                      </div>`,
  'SearchModal Show Price Button'
);

// 7. app/cart/page.tsx
const cartPath = path.join(__dirname, '..', 'app', 'cart', 'page.tsx');
replaceInFile(
  cartPath,
  /<span className="text-sm font-bold text-\[#FF2F00\]">[\s\S]*?₹ \{(item\.product\.salePrice \* item\.quantity)\.toLocaleString\(\)\}[\s\S]*?<\/span>/,
  `<Link
                        href={\`/products/\${item.product.slug}\`}
                        className="px-3 py-1 rounded-full bg-[#482922] text-[#F6C582] text-[11px] font-bold uppercase tracking-wider"
                      >
                        Show Price
                      </Link>`,
  'Cart Page Show Price Button'
);

// 8. components/CartDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'CartDrawer.tsx');
replaceInFile(
  drawerPath,
  /<span className="text-xs font-bold text-\[#FF2F00\]">[\s\S]*?₹ \{(item\.product\.salePrice \* item\.quantity)\.toLocaleString\(\)\}[\s\S]*?<\/span>/,
  `<Link
                        href={\`/products/\${item.product.slug}\`}
                        onClick={closeCart}
                        className="px-2.5 py-0.5 rounded-full bg-[#482922] text-[#F6C582] text-[10px] font-bold uppercase tracking-wider"
                      >
                        Show Price
                      </Link>`,
  'Cart Drawer Show Price Button'
);
