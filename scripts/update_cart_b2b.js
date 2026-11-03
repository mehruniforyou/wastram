const fs = require('fs');
const path = require('path');

// 1. Update CartDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'CartDrawer.tsx');
let drawerCode = fs.readFileSync(drawerPath, 'utf8');

drawerCode = drawerCode.replace(
  `<span className="text-xs font-bold text-[#FF2F00]">
                        ₹ {(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>`,
  `<span className="text-xs font-bold text-[#482922]">
                        Price on Request
                      </span>`
);

drawerCode = drawerCode.replace(
  `<div className="flex justify-between items-center text-sm font-bold text-[#482922]">
              <span>Subtotal</span>
              <span className="text-base text-[#FF2F00]">₹ {cartSubtotal.toLocaleString()}</span>
            </div>`,
  `<div className="flex justify-between items-center text-xs font-bold text-[#482922]">
              <span>Wholesale Pricing</span>
              <span className="text-sm text-[#482922]">Provided on Quotation</span>
            </div>`
);

drawerCode = drawerCode.replace(
  `CHECKOUT • ₹ {cartSubtotal.toLocaleString()}`,
  `REQUEST WHOLESALE QUOTE`
);

fs.writeFileSync(drawerPath, drawerCode, 'utf8');
console.log('Updated CartDrawer.tsx');

// 2. Update app/cart/page.tsx
const cartPagePath = path.join(__dirname, '..', 'app', 'cart', 'page.tsx');
let cartCode = fs.readFileSync(cartPagePath, 'utf8');

cartCode = cartCode.replace(
  `<span className="text-sm font-bold text-[#FF2F00]">
                        ₹ {(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>`,
  `<span className="text-sm font-bold text-[#482922]">
                        Price on Request
                      </span>`
);

cartCode = cartCode.replace(
  `<div className="space-y-2 pt-2 border-t border-black/5 text-xs">
                <div className="flex justify-between text-black/70">
                  <span>Subtotal</span>
                  <span>₹ {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Standard Shipping</span>
                  <span>{cartSubtotal >= freeShippingThreshold ? <strong className="text-emerald-700">FREE</strong> : '₹ 150'}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#482922] pt-2 border-t border-black/10">
                  <span>Total Amount</span>
                  <span className="text-[#FF2F00]">₹ {cartSubtotal.toLocaleString()}</span>
                </div>
              </div>`,
  `<div className="space-y-2 pt-2 border-t border-black/5 text-xs">
                <div className="flex justify-between text-black/70">
                  <span>Trade Pricing</span>
                  <span>Calculated on Quotation</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Export Cargo</span>
                  <span>DHL / Air / Sea Freight Available</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#482922] pt-2 border-t border-black/10">
                  <span>Order Terms</span>
                  <span className="text-[#482922]">FOB / CIF Available</span>
                </div>
              </div>`
);

cartCode = cartCode.replace(
  `CHECKOUT SECURELY`,
  `SUBMIT WHOLESALE ENQUIRY`
);

fs.writeFileSync(cartPagePath, cartCode, 'utf8');
console.log('Updated app/cart/page.tsx');
