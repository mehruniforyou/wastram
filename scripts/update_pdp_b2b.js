const fs = require('fs');
const path = require('path');

const pdpPath = path.join(__dirname, '..', 'app', 'products', '[slug]', 'page.tsx');
let code = fs.readFileSync(pdpPath, 'utf8');

// 1. Add import for B2BEnquiryModal
if (!code.includes('B2BEnquiryModal')) {
  code = code.replace(
    "import SearchModal from '@/components/SearchModal';",
    "import SearchModal from '@/components/SearchModal';\nimport B2BEnquiryModal from '@/components/B2BEnquiryModal';"
  );
}

// 2. Add state for isEnquiryModalOpen
if (!code.includes('isEnquiryModalOpen')) {
  code = code.replace(
    'const [isSearchOpen, setIsSearchOpen] = useState(false);',
    'const [isSearchOpen, setIsSearchOpen] = useState(false);\n  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);'
  );
}

// 3. Replace Desktop Price Line, Buttons, Offers & Trust Badges
const oldDesktopPriceSection = `{/* Price Line */}
              <div className="flex items-center justify-between py-2 border-y border-black/10">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-sm line-through text-black/40">
                    ₹ {product.regularPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-black text-[#FF2F00]">
                    ₹ {product.salePrice.toLocaleString()}
                  </span>
                </div>

                <span className="px-2.5 py-0.5 bg-white border border-[#CDCDCD] text-[#121212] text-xs font-bold rounded">
                  Sale
                </span>
              </div>

              {/* Primary Action Buttons */}
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

const newDesktopPriceSection = `{/* B2B Wholesale Pricing Bar */}
              <div className="flex items-center justify-between py-2.5 border-y border-black/10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold">
                    Wholesale B2B Pricing
                  </span>
                  <span className="text-xl font-black text-[#482922]">
                    Price on Enquiry
                  </span>
                </div>

                <span className="px-3 py-1 bg-white border border-[#482922]/20 text-[#482922] text-xs font-bold rounded-full shadow-2xs">
                  {product.moq || 'MOQ: 20 pcs'}
                </span>
              </div>

              {/* Primary B2B Action Buttons */}
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

code = code.replace(oldDesktopPriceSection, newDesktopPriceSection);

// 4. Replace Mobile Price Line, Action CTAs, Offers
const oldMobilePriceSection = `{/* Price Line */}
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span className="text-xs line-through text-black/40">
                ₹ {product.regularPrice.toLocaleString()}
              </span>
              <span className="text-lg font-black text-[#FF2F00]">
                ₹ {product.salePrice.toLocaleString()}
              </span>
            </div>
            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-black/15 text-[#482922] text-[10px] font-bold rounded">
              Sale
            </span>
          </div>`;

const newMobilePriceSection = `{/* B2B Wholesale Pricing Line */}
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-black/50 font-bold">
                B2B Export Pricing
              </span>
              <span className="text-base font-black text-[#482922]">
                Price on Enquiry
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#FAF8F5] border border-black/15 text-[#482922] text-[10px] font-bold rounded">
              {product.moq || 'MOQ: 20 pcs'}
            </span>
          </div>`;

code = code.replace(oldMobilePriceSection, newMobilePriceSection);

const oldMobileCTAs = `{/* Action CTAs */}
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
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#482922]">
              <span>Exclusive Offers & Savings</span>
              <span className="text-[9px] bg-white text-[#FF2F00] px-2 py-0.5 rounded border border-[#FF2F00]/20">
                ACTIVE
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-black/5 text-xs">
              <span className="font-bold text-[#482922] block">Free pant on ₹2999+ orders</span>
              <span className="text-[10px] text-black/60">Choose your pant and size at cart</span>
            </div>
          </div>`;

const newMobileCTAs = `{/* B2B Action CTAs */}
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

code = code.replace(oldMobileCTAs, newMobileCTAs);

// 5. Replace Related Products pricing and button
const oldRelatedPricing = `<div className="flex items-center gap-1.5 mt-0.5 text-xs font-archivo">
                        <span className="text-[2.4vw] md:text-[0.75vw] line-through text-black/50">
                          ₹ {rel.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#FF2F00]">
                          ₹ {rel.salePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openTapAndView(rel)}
                      className="px-2.5 py-1 rounded-full border border-[#482922] bg-white text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold"
                    >
                      + Add
                    </button>`;

const newRelatedPricing = `<div className="flex items-center gap-1.5 mt-0.5 text-xs font-archivo">
                        <span className="text-[2.4vw] md:text-[0.75vw] font-bold text-[#482922]">
                          Price on Enquiry
                        </span>
                      </div>
                    </div>

                    <Link
                      href={\`/products/\${rel.slug}\`}
                      className="px-2.5 py-1 rounded-full border border-[#482922] bg-white text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold"
                    >
                      Enquire
                    </Link>`;

code = code.replace(oldRelatedPricing, newRelatedPricing);

// 6. Mount B2BEnquiryModal before </main>
if (!code.includes('<B2BEnquiryModal')) {
  code = code.replace(
    '</main>',
    `  <B2BEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={product}
        selectedSize={selectedSize}
      />\n    </main>`
  );
}

fs.writeFileSync(pdpPath, code, 'utf8');
console.log('PDP B2B update applied successfully!');
