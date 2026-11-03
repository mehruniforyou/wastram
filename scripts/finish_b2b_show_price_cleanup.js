const fs = require('fs');
const path = require('path');

function replaceExact(filePath, searchStr, replaceStr, name) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[${path.basename(filePath)}] Applied exact: ${name}`);
  } else {
    // Try normalizing line breaks
    const normContent = content.replace(/\r\n/g, '\n');
    const normSearch = searchStr.replace(/\r\n/g, '\n');
    if (normContent.includes(normSearch)) {
      content = normContent.replace(normSearch, replaceStr.replace(/\r\n/g, '\n'));
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[${path.basename(filePath)}] Applied normalized: ${name}`);
    } else {
      console.warn(`[${path.basename(filePath)}] NOT found: ${name}`);
    }
  }
}

// 1. Update app/products/[slug]/page.tsx
const pdpPath = path.join(__dirname, '..', 'app', 'products', '[slug]', 'page.tsx');

// Desktop Action buttons + Offers + Trust badges
const oldDesktopButtonsAndOffers = `{/* Primary Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => addToCart(product, selectedSize, 1)}
                  className="py-3 rounded-full bg-white border border-[#482922] text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  ADD TO CART
                </button>

                <button
                  type="button"
                  onClick={() => addToCart(product, selectedSize, 1)}
                  className="py-3 rounded-full bg-[#482922] text-white hover:bg-[#38201a] font-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  BUY IT NOW
                </button>
              </div>

              {/* Exclusive Offers & Savings */}
              <div className="bg-white p-3.5 rounded-2xl border border-black/5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#482922]">
                  <span>Exclusive Offers & Savings</span>
                  <span className="text-[10px] bg-[#FAF8F5] text-[#FF2F00] px-2 py-0.5 rounded border border-[#FF2F00]/20">
                    LIMITED TIME
                  </span>
                </div>

                {/* Offer 1 */}
                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-black/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#482922] block">Free pant on ₹2999+ orders</span>
                    <span className="text-[11px] text-black/60">Select your favourite pant and size at cart</span>
                  </div>
                  <span className="bg-[#482922] text-[#F6C582] text-[10px] font-bold px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                {/* Offer 2 & 3 Coupon Boxes */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white text-center">
                    <span className="text-[10px] text-black/60 block">Orders ₹3,999+</span>
                    <span className="font-black text-[#FF2F00] text-xs">SAVE₹200</span>
                  </div>
                  <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white text-center">
                    <span className="text-[10px] text-black/60 block">Orders ₹4,999+</span>
                    <span className="font-black text-[#FF2F00] text-xs">SAVE₹400</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-black/70 px-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <span>🚚</span>
                  <span>Cash On Delivery Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🔄</span>
                  <span>Easy 7 Days Returns</span>
                </div>
              </div>`;

const newDesktopButtonsAndOffers = `{/* Primary B2B Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="py-3 rounded-full bg-white border border-[#482922] text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  REQUEST B2B QUOTE
                </button>

                <a
                  href={\`https://wa.me/919876543210?text=\${encodeURIComponent(\`Hello Wastram, I am interested in wholesale pricing for \${product.title} (SKU: \${product.sku || product.id})\`)}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-full bg-[#482922] text-white hover:bg-[#38201a] font-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center text-center"
                >
                  WHATSAPP CHAT
                </a>
              </div>

              {/* B2B Wholesale & Export Specifications */}
              <div className="bg-white p-3.5 rounded-2xl border border-black/5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#482922]">
                  <span>Wholesale & Export Terms</span>
                  <span className="text-[10px] bg-[#FAF8F5] text-[#482922] px-2 py-0.5 rounded border border-[#482922]/20 font-semibold">
                    EXPORT GRADE
                  </span>
                </div>

                {/* Term 1 */}
                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-black/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#482922] block">Custom Private Labelling</span>
                    <span className="text-[11px] text-black/60">Woven tags, barcode stickers & custom packaging</span>
                  </div>
                  <span className="bg-[#482922] text-[#F6C582] text-[10px] font-bold px-2 py-0.5 rounded">
                    AVAILABLE
                  </span>
                </div>

                {/* Term 2 & 3 Boxes */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white text-center">
                    <span className="text-[10px] text-black/60 block">Flexible Batch MOQ</span>
                    <span className="font-bold text-[#482922] text-xs">20 Pcs / Style</span>
                  </div>
                  <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white text-center">
                    <span className="text-[10px] text-black/60 block">Global Cargo Dispatch</span>
                    <span className="font-bold text-[#482922] text-xs">DHL / Air / Sea</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-black/70 px-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <span>🌐</span>
                  <span>Worldwide Export (UK, US, EU, Gulf)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>Verified Export Quality</span>
                </div>
              </div>`;

replaceExact(pdpPath, oldDesktopButtonsAndOffers, newDesktopButtonsAndOffers, 'Desktop B2B buttons and terms');

// Mobile Action buttons + Offers
const oldMobileButtonsAndOffers = `{/* Action CTAs */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => addToCart(product, selectedSize, 1)}
              className="w-full py-3.5 rounded-full bg-white border border-[#482922] text-[#482922] font-bold text-xs uppercase tracking-wider"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              onClick={() => addToCart(product, selectedSize, 1)}
              className="w-full py-3.5 rounded-full bg-[#482922] text-white font-bold text-xs uppercase tracking-wider"
            >
              BUY IT NOW
            </button>
          </div>

          {/* Exclusive Offers & Savings */}
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-black/5 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#482922]">
              Free pant on orders ₹2,999+
            </span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white font-bold text-[#FF2F00]">
                SAVE₹200
              </div>
              <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white font-bold text-[#FF2F00]">
                SAVE₹400
              </div>
            </div>
          </div>`;

const newMobileButtonsAndOffers = `{/* B2B Action CTAs */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEnquiryModalOpen(true)}
              className="w-full py-3.5 rounded-full bg-white border border-[#482922] text-[#482922] font-bold text-xs uppercase tracking-wider shadow-xs"
            >
              REQUEST B2B QUOTE
            </button>
            <a
              href={\`https://wa.me/919876543210?text=\${encodeURIComponent(\`Hello Wastram, I am interested in wholesale pricing for \${product.title} (SKU: \${product.sku || product.id})\`)}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full bg-[#482922] text-white font-bold text-xs uppercase tracking-wider shadow-xs text-center flex items-center justify-center gap-1.5"
            >
              <span>💬 WHATSAPP ENQUIRY</span>
            </a>
          </div>

          {/* B2B Wholesale & Export Terms */}
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-black/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#482922]">
              <span>Wholesale & Export Terms</span>
              <span className="text-[9px] bg-white text-[#482922] px-2 py-0.5 rounded border border-[#482922]/20 font-semibold">
                EXPORT GRADE
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-black/5 text-xs">
              <span className="font-bold text-[#482922] block">Custom Private Labelling & Tags</span>
              <span className="text-[10px] text-black/60">MOQ 20 pcs/style • Worldwide Doorstep Air/Sea Cargo</span>
            </div>
          </div>`;

replaceExact(pdpPath, oldMobileButtonsAndOffers, newMobileButtonsAndOffers, 'Mobile B2B buttons and terms');

// 2. Update app/cart/page.tsx
const cartPath = path.join(__dirname, '..', 'app', 'cart', 'page.tsx');
let cartCode = fs.readFileSync(cartPath, 'utf8');

cartCode = cartCode.replace(
  `Add <strong className="text-[#FF2F00]">₹ {remainingForFreeShipping.toLocaleString()}</strong> more to unlock <strong>FREE SHIPPING &amp; FREE PANTS</strong>!`,
  `B2B Wholesale Quotation Basket • Direct Manufacturer Dispatch (UK, USA, EU, Gulf)`
);

cartCode = cartCode.replace(
  `₹ {(item.product.salePrice * item.quantity).toLocaleString()}`,
  `Show Price`
);

cartCode = cartCode.replace(
  `₹ {cartSubtotal.toLocaleString()}`,
  `Price on Request`
);

fs.writeFileSync(cartPath, cartCode, 'utf8');
console.log('Saved app/cart/page.tsx with Show Price and B2B basket');

// 3. Update components/CartDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'CartDrawer.tsx');
let drawerCode = fs.readFileSync(drawerPath, 'utf8');

drawerCode = drawerCode.replace(
  `Add <strong className="text-[#FF2F00]">₹ {remainingForFreeShipping.toLocaleString()}</strong> more to get <strong>FREE SHIPPING &amp; PANTS</strong>!`,
  `B2B Wholesale Quotation Basket • Flexible 20 pcs MOQ per style`
);

drawerCode = drawerCode.replace(
  `₹ {(item.product.salePrice * item.quantity).toLocaleString()}`,
  `Show Price`
);

drawerCode = drawerCode.replace(
  `₹ {cartSubtotal.toLocaleString()}`,
  `Price on Request`
);

fs.writeFileSync(drawerPath, drawerCode, 'utf8');
console.log('Saved components/CartDrawer.tsx with Show Price');

// 4. Update AnnouncementBar.tsx (remove any remaining ₹2,599)
const barPath = path.join(__dirname, '..', 'components', 'AnnouncementBar.tsx');
let barCode = fs.readFileSync(barPath, 'utf8');
barCode = barCode.replace(/₹2,599\+/g, 'Wholesale Orders');
fs.writeFileSync(barPath, barCode, 'utf8');
console.log('Saved components/AnnouncementBar.tsx');
