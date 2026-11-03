const fs = require('fs');
const path = require('path');

// 1. Update CollectionsCatalogue.tsx
const catPath = path.join(__dirname, '..', 'components', 'CollectionsCatalogue.tsx');
let catCode = fs.readFileSync(catPath, 'utf8');

catCode = catCode.replace(
  `  const categories = [
    { id: 'all', label: 'Shop All' },
    { id: 'kurtis', label: 'Kurtis' },`,
  `  const categories = [
    { id: 'all', label: 'Shop All' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'kurtis', label: 'Kurtis' },`
);

const oldCatPrice = `<div className="flex items-center gap-1.5 mt-0.5 font-archivo">
                          <span className="text-[2.4vw] md:text-[0.75vw] line-through text-black/50">
                            ₹ {product.regularPrice.toLocaleString()}
                          </span>
                          <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#FF2F00]">
                            ₹ {product.salePrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Quick Add Pill Button */}
                      <button
                        type="button"
                        onClick={() => setQuickAddProduct(product)}
                        className="px-2.5 md:px-3 py-1 md:py-1 rounded-full border border-[#482922] bg-white text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold transition-all flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-2xs"
                      >
                        <span className="font-bold">+</span>
                        <span>Add</span>
                      </button>`;

const newCatPrice = `<div className="flex items-center gap-1.5 mt-0.5 font-archivo">
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
                      </Link>`;

catCode = catCode.replace(oldCatPrice, newCatPrice);
fs.writeFileSync(catPath, catCode, 'utf8');
console.log('Updated CollectionsCatalogue.tsx');

// 2. Update ProductFitsGrid.tsx
const gridPath = path.join(__dirname, '..', 'components', 'ProductFitsGrid.tsx');
let gridCode = fs.readFileSync(gridPath, 'utf8');

gridCode = gridCode.replace(
  `  const tabs: { id: 'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted'; label: string }[] = [
    { id: 'under-999', label: 'UNDER ₹999' },`,
  `  const tabs: { id: string; label: string }[] = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'under-999', label: 'UNDER ₹999' },`
);

const oldGridPrice = `{/* Price Line */}
                      <div className="flex items-center gap-1.5 mt-0.5 font-archivo">
                        <span className="text-[2.4vw] md:text-[0.75vw] line-through text-black/50">
                          ₹ {product.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#FF2F00]">
                          ₹ {product.salePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Pill Button */}
                    <button
                      type="button"
                      onClick={() => setQuickAddProduct(product)}
                      className="px-2.5 md:px-3 py-1 md:py-1 rounded-full border border-[#482922] bg-white text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold transition-all flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-2xs"
                    >
                      <span className="font-bold">+</span>
                      <span>Add</span>
                    </button>`;

const newGridPrice = `{/* B2B Price Line */}
                      <div className="flex items-center gap-1.5 mt-0.5 font-archivo">
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
                    </Link>`;

gridCode = gridCode.replace(oldGridPrice, newGridPrice);
fs.writeFileSync(gridPath, gridCode, 'utf8');
console.log('Updated ProductFitsGrid.tsx');

// 3. Update QuickAddModal.tsx
const quickPath = path.join(__dirname, '..', 'components', 'QuickAddModal.tsx');
let quickCode = fs.readFileSync(quickPath, 'utf8');

quickCode = quickCode.replace(
  `<div className="flex items-center gap-2 mt-1">
              <span className="text-xs line-through text-black/40">₹ {product.regularPrice.toLocaleString()}</span>
              <span className="text-sm font-bold text-[#FF2F00]">₹ {product.salePrice.toLocaleString()}</span>
            </div>`,
  `<div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-[#482922]">Price on Enquiry</span>
              <span className="text-[11px] text-black/50">• {product.moq || 'MOQ: 20 pcs'}</span>
            </div>`
);

quickCode = quickCode.replace(
  `<span>Add to Bag</span>
          <span>&bull;</span>
          <span>₹ {product.salePrice.toLocaleString()}</span>`,
  `<span>Add to Enquiry List</span>`
);

fs.writeFileSync(quickPath, quickCode, 'utf8');
console.log('Updated QuickAddModal.tsx');

// 4. Update TapAndViewModal.tsx
const tapPath = path.join(__dirname, '..', 'components', 'TapAndViewModal.tsx');
let tapCode = fs.readFileSync(tapPath, 'utf8');

tapCode = tapCode.replace(
  `{/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base line-through text-black/40">
                ₹ {tapAndViewProduct.regularPrice.toLocaleString()}
              </span>
              <span className="text-xl md:text-2xl font-black text-[#FF2F00]">
                ₹ {tapAndViewProduct.salePrice.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#482922] border border-black/15 px-2 py-0.5 rounded">
                Sale
              </span>
            </div>`,
  `{/* B2B Price on Request */}
            <div className="flex items-center gap-3">
              <span className="text-base md:text-lg font-bold text-[#482922]">
                Price on Enquiry
              </span>
              <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#482922] border border-black/15 px-2 py-0.5 rounded">
                {tapAndViewProduct.moq || 'MOQ: 20 pcs'}
              </span>
            </div>`
);

tapCode = tapCode.replace(
  `<span>Add to Bag • Size {selectedSize}</span>`,
  `<span>Add to Enquiry List • Size {selectedSize}</span>`
);

fs.writeFileSync(tapPath, tapCode, 'utf8');
console.log('Updated TapAndViewModal.tsx');

// 5. Update SearchModal.tsx
const searchPath = path.join(__dirname, '..', 'components', 'SearchModal.tsx');
let searchCode = fs.readFileSync(searchPath, 'utf8');

searchCode = searchCode.replace(
  `<div className="flex items-center gap-2 text-xs font-archivo">
                        <span className="line-through text-black/40 text-[11px]">₹ {p.regularPrice.toLocaleString()}</span>
                        <span className="font-bold text-[#FF2F00]">₹ {p.salePrice.toLocaleString()}</span>
                      </div>`,
  `<div className="flex items-center gap-2 text-xs font-archivo">
                        <span className="font-bold text-[#482922]">Price on Enquiry</span>
                        <span className="text-[10px] text-black/50">• {p.moq || 'MOQ 20 pcs'}</span>
                      </div>`
);

fs.writeFileSync(searchPath, searchCode, 'utf8');
console.log('Updated SearchModal.tsx');

// 6. Update app/collections/[category]/page.tsx
const paramPath = path.join(__dirname, '..', 'app', 'collections', '[category]', 'page.tsx');
let paramCode = fs.readFileSync(paramPath, 'utf8');

if (!paramCode.includes("category: 'western-dresses'")) {
  paramCode = paramCode.replace(
    "return [\n    { category: 'shop-all' },",
    "return [\n    { category: 'shop-all' },\n    { category: 'western-dresses' },"
  );
  fs.writeFileSync(paramPath, paramCode, 'utf8');
  console.log('Updated app/collections/[category]/page.tsx');
}

// 7. Update Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
let headerCode = fs.readFileSync(headerPath, 'utf8');

if (!headerCode.includes('/collections/western-dresses')) {
  headerCode = headerCode.replace(
    `<Link
              href="/collections/new-in"`,
    `<Link
              href="/collections/western-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00]"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/new-in"`
  );
  fs.writeFileSync(headerPath, headerCode, 'utf8');
  console.log('Updated Header.tsx');
}
