const fs = require('fs');
const path = require('path');

// 1. components/AnnouncementBar.tsx
const announcementPath = path.join(__dirname, '..', 'components', 'AnnouncementBar.tsx');
const newAnnouncementContent = `'use client';

import React from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#181818] text-white border-b border-white/10 text-[11px] font-archivo tracking-wider">
      <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-2 flex items-center justify-between">
        {/* Left: Brand / B2B Export Tag */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
          <span className="font-semibold uppercase tracking-widest text-white text-[10px] md:text-[11px]">
            B2B WHOLESALE &amp; EXPORT
          </span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/70 hidden sm:inline text-[11px]">
            FOB &amp; CIF Quotes Available
          </span>
        </div>

        {/* Center / Right: Minimalist export credentials & Contact link */}
        <div className="flex items-center gap-4 text-white/70 text-[10px] md:text-[11px]">
          <span className="hidden md:inline">Worldwide Air &amp; Ocean Cargo Dispatch</span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden lg:inline">Flexible Wholesale Packs</span>
          <span className="hidden lg:inline text-white/30">•</span>
          <Link
            href="/pages/contact"
            className="text-[#F6C582] hover:text-white font-medium transition-colors"
          >
            Enquire Now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(announcementPath, newAnnouncementContent, 'utf8');
console.log('[AnnouncementBar.tsx] Replaced with clean minimalist B2B announcement strip (sale timer removed)');

// 2. components/Header.tsx
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
let headerContent = fs.readFileSync(headerPath, 'utf8');

// Replace Desktop Header center & right
const oldCenterAndRight = `        {/* Center: Navigation Pill Links & Tagline */}
        <div className="flex flex-col items-center">
          <nav className="flex items-center gap-1.5 font-archivo text-xs font-medium text-[#482922]">
            <Link
              href="/collections/western-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00]"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/short-long-kaftan"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Short &amp; Long Kaftan ✦
            </Link>
            <Link
              href="/collections/ethnic-wear-sets"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Ethnic Wear Sets ✦
            </Link>
            <Link
              href="/collections/tops-shirts"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Tops & Shirts ✦
            </Link>
            <Link
              href="/collections/cord-sets"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Co-ord Sets ✦
            </Link>
            <Link
              href="/collections/traditional-gowns"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922]"
            >
              Traditional Gowns ✦
            </Link>
            <Link
              href="/collections/maxi-dresses"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              Maxi Dresses
            </Link>
            <Link
              href="/collections/midi-dress"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              Midi Dresses
            </Link>
            <Link
              href="/collections/most-wanted"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              <span>Bestsellers</span>
              <span className="cust-red-dot" />
            </Link>
            <Link
              href="/collections/shop-all"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              All 700+ Styles
            </Link>
          </nav>

          <span className="text-[10px] tracking-widest text-[#482922]/70 font-editorial italic mt-0.5">
            &ldquo; YOU know where to GET IT &rdquo;
          </span>
        </div>

        {/* Right: Leaving Soon pill, Story ring, Wishlist, Search, Account, Cart */}
        <div className="flex items-center gap-3">
          {/* Leaving Soon offer pill */}
          <Link
            href="/collections/goodbyedeals"
            className="flex items-center gap-1.5 h-7 px-3 rounded-full bg-white/80 border border-[#482922]/20 hover:border-[#482922] transition-colors font-archivo shadow-2xs"
          >
            <span className="text-[10px] text-[#482922]/70 uppercase font-medium">Leaving soon</span>
            <span className="text-[10px] font-bold text-[#FF2F00]">30% OFF</span>
          </Link>`;

const newCenterAndRight = `        {/* Center: Minimalist Navigation Pills (no wrapping, no overlapping) */}
        <div className="flex-1 flex justify-center px-4 overflow-hidden">
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <Link
              href="/collections/western-dresses"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#FF2F00] whitespace-nowrap shrink-0"
            >
              Western Dresses ✦
            </Link>
            <Link
              href="/collections/short-long-kaftan"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Kaftans ✦
            </Link>
            <Link
              href="/collections/ethnic-wear-sets"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Ethnic Wear Sets ✦
            </Link>
            <Link
              href="/collections/tops-shirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Tops &amp; Shirts ✦
            </Link>
            <Link
              href="/collections/cord-sets"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Co-ord Sets ✦
            </Link>
            <Link
              href="/collections/traditional-gowns"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Traditional Gowns ✦
            </Link>
            <Link
              href="/collections/shop-all"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              All 700+ Styles
            </Link>
          </nav>
        </div>

        {/* Right: Story ring, Wishlist, Search, Account, Cart */}
        <div className="flex items-center gap-3 shrink-0">`;

const normHeader = headerContent.replace(/\r\n/g, '\n');
const normOld = oldCenterAndRight.replace(/\r\n/g, '\n');

if (normHeader.includes(normOld)) {
  headerContent = normHeader.replace(normOld, newCenterAndRight.replace(/\r\n/g, '\n'));
  console.log('[Header.tsx] Replaced desktop center nav and removed leaving soon pill');
} else {
  console.warn('[Header.tsx] Could not match desktop center nav directly, checking parts...');
}

// Remove mobile subtitle: * YOU know where to GET IT *
const oldMobileSubtitle = `<span className="text-[9px] tracking-wider text-[#482922]/70 font-editorial italic -mt-0.5">
            * YOU know where to GET IT *
          </span>`;
const normOldMobile = oldMobileSubtitle.replace(/\r\n/g, '\n');
if (headerContent.includes(normOldMobile)) {
  headerContent = headerContent.replace(normOldMobile, '');
  console.log('[Header.tsx] Removed mobile tagline');
}

fs.writeFileSync(headerPath, headerContent, 'utf8');

// 3. components/PromoPopupModal.tsx
const promoModalPath = path.join(__dirname, '..', 'components', 'PromoPopupModal.tsx');
let promoModalContent = fs.readFileSync(promoModalPath, 'utf8');
if (!promoModalContent.startsWith('// Disabled for B2B minimalism')) {
  promoModalContent = `// Disabled for B2B minimalism
'use client';

export default function PromoPopupModal() {
  return null;
}
`;
  fs.writeFileSync(promoModalPath, promoModalContent, 'utf8');
  console.log('[PromoPopupModal.tsx] Disabled retail discount pop-up for B2B minimalism');
}

// 4. components/HeroSection.tsx
const heroPath = path.join(__dirname, '..', 'components', 'HeroSection.tsx');
let heroContent = fs.readFileSync(heroPath, 'utf8');

// Remove [Ends Tonight]
heroContent = heroContent.replace(
  `<span className="text-[10px] font-archivo uppercase tracking-widest text-black/70 font-light mb-1">
            [Ends Tonight]
          </span>`,
  `<span className="text-[10px] font-archivo uppercase tracking-widest text-black/70 font-bold mb-1">
            [ DIRECT MANUFACTURER & EXPORT ]
          </span>`
);

// Update 170+ to 700+ in desktop and mobile
heroContent = heroContent.replace('Over 170+ Contemporary Silhouettes • Worldwide Cargo Dispatch', 'Over 700+ Designer Silhouettes • Worldwide Cargo Dispatch');
heroContent = heroContent.replace('Over 170+ Contemporary Silhouettes', 'Over 700+ Designer Silhouettes');

fs.writeFileSync(heroPath, heroContent, 'utf8');
console.log('[HeroSection.tsx] Removed [Ends Tonight] and updated counts to 700+');

// 5. components/EditorialBanners.tsx
const editBannersPath = path.join(__dirname, '..', 'components', 'EditorialBanners.tsx');
let editBannersContent = fs.readFileSync(editBannersPath, 'utf8');
editBannersContent = editBannersContent.replace(
  /subtitle: 'upto 50%'/g,
  "subtitle: 'WHOLESALE'"
);
editBannersContent = editBannersContent.replace(
  /Shop Most Wanted this Diwali with up to 50% off\./g,
  "Curated high-turnover silhouettes engineered for international boutiques."
);
fs.writeFileSync(editBannersPath, editBannersContent, 'utf8');
console.log('[EditorialBanners.tsx] Cleaned up Diwali 50% off text');

// 6. components/MobileNavDrawer.tsx
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
let drawerContent = fs.readFileSync(drawerPath, 'utf8');
drawerContent = drawerContent.replace('ALL 170+ STYLES', 'ALL 700+ STYLES');
fs.writeFileSync(drawerPath, drawerContent, 'utf8');
console.log('[MobileNavDrawer.tsx] Updated 170+ to 700+ styles');

// 7. components/CartDrawer.tsx & app/cart/page.tsx
const cartDrawerPath = path.join(__dirname, '..', 'components', 'CartDrawer.tsx');
if (fs.existsSync(cartDrawerPath)) {
  let cd = fs.readFileSync(cartDrawerPath, 'utf8');
  cd = cd.replace('Coupon code applied! Extra 10% Diwali discount added.', 'Wholesale inquiry code applied.');
  cd = cd.replace('placeholder="Discount code (e.g. DIWALI50)"', 'placeholder="Trade / Buyer Ref Code"');
  fs.writeFileSync(cartDrawerPath, cd, 'utf8');
  console.log('[CartDrawer.tsx] Cleaned retail Diwali discount text');
}

console.log('All minimalism UI fixes applied!');
