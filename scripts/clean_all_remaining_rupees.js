const fs = require('fs');
const path = require('path');

function replaceAllInFile(relPath, replaces) {
  const fullPath = path.join(__dirname, '..', relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const [find, rep] of replaces) {
    content = content.split(find).join(rep);
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Cleaned ${relPath}`);
}

// 1. app/cart/page.tsx
replaceAllInFile('app/cart/page.tsx', [
  ["<span>{cartSubtotal >= freeShippingThreshold ? <strong className=\"text-emerald-700\">FREE</strong> : '₹ 150'}</span>", "<span>Calculated on destination</span>"],
  ["<span className=\"text-[#FF2F00]\">₹ {cartSubtotal.toLocaleString()}</span>", "<span className=\"text-[#482922] font-bold\">On Quotation</span>"],
  ["<span className=\"text-[#FF2F00]\">Show Price</span>", "<span className=\"px-3 py-1 rounded-full bg-[#482922] text-[#F6C582] text-xs font-bold uppercase\">Show Price</span>"]
]);

// 2. components/CartDrawer.tsx
replaceAllInFile('components/CartDrawer.tsx', [
  ["<span className=\"text-base text-[#FF2F00]\">₹ {cartSubtotal.toLocaleString()}</span>", "<span className=\"text-sm text-[#482922]\">On Quotation</span>"],
  ["<span>₹ {cartSubtotal.toLocaleString()}</span>", "<span>On Quotation</span>"],
  ["<span className=\"text-xs font-bold text-[#FF2F00]\">\n                        Show Price\n                      </span>", "<span className=\"px-2.5 py-0.5 rounded-full bg-[#482922] text-[#F6C582] text-[10px] font-bold uppercase\">Show Price</span>"]
]);

// 3. components/HeroSection.tsx
replaceAllInFile('components/HeroSection.tsx', [
  ['alt="FREE PANTS worth ₹1399 On order above ₹2999"', 'alt="Wastram Western Dresses Wholesale"'],
  ['alt="FREE PANTS worth ₹1399"', 'alt="Western Dresses 170+ Designs"'],
  ['FREE PANTS worth ₹1399', 'WESTERN DRESSES WHOLESALE'],
  ['On order above ₹2999', 'Over 170+ Contemporary Silhouettes']
]);

// 4. components/MobileNavDrawer.tsx
replaceAllInFile('components/MobileNavDrawer.tsx', [
  ['UNDER ₹1299', 'MAXI DRESSES'],
  ['/collections/under-1299', '/collections/maxi-dresses'],
  ['UNDER ₹999', 'MIDI DRESSES'],
  ['/collections/under-999', '/collections/midi-dress'],
  ['FLAT 50% OFF', 'EXPORT BESTSELLERS'],
  ['/collections/50-off', '/collections/most-wanted'],
  ['FLAT 40% OFF', 'ALL 170+ STYLES'],
  ['/collections/40-off', '/collections/shop-all']
]);

// 5. components/SearchModal.tsx
replaceAllInFile('components/SearchModal.tsx', [
  ["'Under ₹999'", "'Maxi Dresses'"]
]);

// 6. app/products/[slug]/page.tsx
replaceAllInFile('app/products/[slug]/page.tsx', [
  ['Free shipping all over India on orders above ₹2,999.', 'Worldwide doorstep air & sea freight dispatch (UK, US, EU, Gulf). MOQ 20 pcs.'],
  ['Free shipping across India on orders above ₹2,999.', 'Worldwide doorstep air & sea freight dispatch (UK, US, EU, Gulf). MOQ 20 pcs.']
]);

// 7. components/TapAndViewModal.tsx
replaceAllInFile('components/TapAndViewModal.tsx', [
  ['Free shipping & pants on orders above ₹2,999', 'Worldwide export shipping via DHL / Air / Sea cargo']
]);

// 8. app/pages/refund-policy/page.tsx
replaceAllInFile('app/pages/refund-policy/page.tsx', [
  ['Free Shipping on all orders above ₹2,999', 'Doorstep export cargo dispatch with tracking for international shipments']
]);

console.log('Finished total rupee cleanup!');
