'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WastramLogo from './WastramLogo';
import SocialIcons from './SocialIcons';

export default function Footer() {
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    address: false,
    email: false,
    phone: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full max-w-full overflow-hidden bg-[#FAF9F6] text-[#0B2D7F] pt-12 md:pt-16 pb-8 border-t border-[#0B2D7F]/10">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 md:gap-16">
        {/* ========================================================== */}
        {/* TOP TIER: 5 TRADITIONAL JAIPURI TRUST / VALUE BADGES       */}
        {/* ========================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {/* Badge 1: Jaipur Handcrafted */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-soft border border-[#E8E4DA]/80 hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#0B2D7F] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-2xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h5 className="font-serif text-xs md:text-sm font-semibold uppercase tracking-wider text-[#0B2D7F]">
              Artisanal Jaipuri Craft
            </h5>
            <p className="text-[10.5px] text-[#0B2D7F]/65 mt-1 font-sans">
              Hand-block prints &amp; natural vegetable dyes
            </p>
          </div>

          {/* Badge 2: Wholesale Tiering */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-soft border border-[#E8E4DA]/80 hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#0B2D7F] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-2xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h5 className="font-serif text-xs md:text-sm font-semibold uppercase tracking-wider text-[#0B2D7F]">
              Flexible Boutique MOQ
            </h5>
            <p className="text-[10.5px] text-[#0B2D7F]/65 mt-1 font-sans">
              Low 20 pcs/style minimum &amp; custom batching
            </p>
          </div>

          {/* Badge 3: Pure Natural Fabrics */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-soft border border-[#E8E4DA]/80 hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#0B2D7F] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-2xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h5 className="font-serif text-xs md:text-sm font-semibold uppercase tracking-wider text-[#0B2D7F]">
              Export Standard Quality
            </h5>
            <p className="text-[10.5px] text-[#0B2D7F]/65 mt-1 font-sans">
              Pure mulmul, modal silk &amp; reinforced seams
            </p>
          </div>

          {/* Badge 4: Worldwide Cargo */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-soft border border-[#E8E4DA]/80 hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#0B2D7F] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-2xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h5 className="font-serif text-xs md:text-sm font-semibold uppercase tracking-wider text-[#0B2D7F]">
              Global Doorstep Cargo
            </h5>
            <p className="text-[10.5px] text-[#0B2D7F]/65 mt-1 font-sans">
              Air &amp; sea freight to UK, US, EU, Gulf
            </p>
          </div>

          {/* Badge 5: Made in India */}
          <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-soft border border-[#E8E4DA]/80 hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#0B2D7F] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-2xs">
              <span className="text-sm font-serif font-bold text-[#D4AF37]">IND</span>
            </div>
            <h5 className="font-serif text-xs md:text-sm font-semibold uppercase tracking-wider text-[#0B2D7F]">
              100% Made in India
            </h5>
            <p className="text-[10.5px] text-[#0B2D7F]/65 mt-1 font-sans">
              Sanganer &amp; Bagru master artisan looms
            </p>
          </div>
        </div>

        {/* ========================================================== */}
        {/* MIDDLE TIER: SPLIT LAYOUT (INSPIRED BY GULMOHAR JAIPUR)    */}
        {/* Left: Regal Navy Atelier Card | Right: Curated Link Columns */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT SECTION (REGAL NAVY LUXURY CARD ~ 38% WIDTH) */}
          <div className="lg:col-span-5 bg-[#0B2D7F] text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col gap-6 relative overflow-hidden">
            {/* Subtle Watermark Decoration */}
            <div className="absolute -bottom-8 -right-8 opacity-5 pointer-events-none select-none text-white text-[120px] font-serif leading-none">
              W
            </div>

            {/* Brand Header & Calligraphy Wordmark */}
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md p-1.5 flex items-center justify-center shrink-0 border border-white/20">
                  <img
                    src="/images/brand/wastram-craft-emblem-hd.png"
                    alt="Wastram Logomark"
                    className="w-full h-full object-contain filter brightness-110"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-normal tracking-[0.14em] uppercase text-white leading-tight">
                    WASTRAM ATELIER
                  </h3>
                  <span className="text-[10.5px] font-sans uppercase tracking-[0.2em] text-[#D4AF37] font-medium block">
                    Jaipur Haute Textiles &bull; B2B Wholesale
                  </span>
                </div>
              </div>

              <p className="font-sans text-xs sm:text-[13px] text-white/80 leading-relaxed pt-2">
                &ldquo;Master craft Indian textiles tailored for global luxury boutiques, discerning resort curators, and wholesale buyers across 40+ countries.&rdquo;
              </p>

              {/* Social Media Glyphs */}
              <div className="pt-1">
                <SocialIcons
                  iconSize={15}
                  className="flex items-center gap-2"
                  itemClassName="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0B2D7F] backdrop-blur-md transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                />
              </div>
            </div>

            {/* Interactive Expandable Accordions for Contact & Atelier */}
            <div className="flex flex-col gap-2.5 relative z-10 pt-2 border-t border-white/15">
              {/* Accordion 1: Physical Atelier Address */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <button
                  type="button"
                  onClick={() => toggleAccordion('address')}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">&bull;</span>
                    <span>Jaipur Atelier &amp; Loom Cluster</span>
                  </span>
                  <span className={`text-[#D4AF37] transition-transform duration-300 ${openAccordions.address ? 'rotate-90' : ''}`}>
                    &rsaquo;
                  </span>
                </button>
                {openAccordions.address && (
                  <div className="text-[11.5px] text-white/80 pt-2.5 space-y-1 font-sans border-t border-white/10 mt-2">
                    <p className="font-semibold text-white">Plot No. 14, Sanganer Artisan Cluster, Tonk Road, Jaipur, Rajasthan - 302029</p>
                    <p className="text-white/60">Dispatch Hubs: Jaipur Atelier &bull; Mumbai Seaport Warehouse</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Wholesale Email & Line Sheet Request */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <button
                  type="button"
                  onClick={() => toggleAccordion('email')}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">&bull;</span>
                    <span>Wholesale Concierge Email</span>
                  </span>
                  <span className={`text-[#D4AF37] transition-transform duration-300 ${openAccordions.email ? 'rotate-90' : ''}`}>
                    &rsaquo;
                  </span>
                </button>
                {openAccordions.email && (
                  <div className="text-[11.5px] text-white/80 pt-2.5 space-y-1 font-sans border-t border-white/10 mt-2">
                    <p>Have an RFQ or need a bulk line sheet?</p>
                    <a href="mailto:atelier@wastram.com" className="text-[#D4AF37] hover:underline font-semibold block">
                      atelier@wastram.com &rarr;
                    </a>
                  </div>
                )}
              </div>

              {/* Accordion 3: WhatsApp Concierge & Phone */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <button
                  type="button"
                  onClick={() => toggleAccordion('phone')}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">&bull;</span>
                    <span>Direct B2B WhatsApp Hotline</span>
                  </span>
                  <span className={`text-[#D4AF37] transition-transform duration-300 ${openAccordions.phone ? 'rotate-90' : ''}`}>
                    &rsaquo;
                  </span>
                </button>
                {openAccordions.phone && (
                  <div className="text-[11.5px] text-white/80 pt-2.5 space-y-1 font-sans border-t border-white/10 mt-2">
                    <p>Dedicated wholesale account manager ready on chat:</p>
                    <a
                      href="https://wa.me/918003088838?text=Hello%20Wastram%20Atelier%2C%20I%20am%20interested%20in%20boutique%20wholesale%20sourcing."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>+91 80030 88838 (WhatsApp Concierge)</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Dual High-Contrast Action CTAs */}
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <Link
                href="/collections/shop-all"
                className="py-3 rounded-full bg-white text-[#0B2D7F] hover:bg-[#FAF9F6] text-center text-xs font-semibold uppercase tracking-[0.14em] shadow-soft transition-all cursor-pointer"
              >
                Explore Styles
              </Link>
              <Link
                href="/pages/contact"
                className="py-3 rounded-full bg-transparent hover:bg-white/10 text-white border border-white/30 text-center text-xs font-semibold uppercase tracking-[0.14em] transition-all cursor-pointer"
              >
                Contact Atelier
              </Link>
            </div>
          </div>

          {/* RIGHT SECTION (CURATED 3-COLUMN NAVIGATION ~ 62% WIDTH) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 pt-2">
            {/* Column 1: Top Collections */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#0B2D7F]">
                  Top Collections
                </h4>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs font-sans text-[#0B2D7F]/80">
                <li><Link href="/collections/western-dresses" className="hover:text-[#4A7BC6] transition-colors">Western Dresses</Link></li>
                <li><Link href="/collections/denim-collection" className="hover:text-[#4A7BC6] transition-colors">Denim Collection</Link></li>
                <li><Link href="/collections/ethnic-wear-sets" className="hover:text-[#4A7BC6] transition-colors">Ethnic Wear Sets</Link></li>
                <li><Link href="/collections/umbrella-dresses" className="hover:text-[#4A7BC6] transition-colors">Umbrella Dresses</Link></li>
                <li><Link href="/collections/cord-sets" className="hover:text-[#4A7BC6] transition-colors">Co-ord Sets</Link></li>
                <li><Link href="/collections/short-long-kaftan" className="hover:text-[#4A7BC6] transition-colors">Resort Kaftans</Link></li>
                <li><Link href="/collections/traditional-gowns" className="hover:text-[#4A7BC6] transition-colors">Traditional Gowns</Link></li>
                <li><Link href="/collections/tops-shirts" className="hover:text-[#4A7BC6] transition-colors">Tops &amp; Shirts</Link></li>
              </ul>
            </div>

            {/* Column 2: Atelier & Wholesale Services */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#0B2D7F]">
                  Atelier &amp; Trade
                </h4>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs font-sans text-[#0B2D7F]/80">
                <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Request Digital Lookbook</Link></li>
                <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Custom Private Labelling</Link></li>
                <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Bespoke Fabric Sourcing</Link></li>
                <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Global Cargo Dispatch</Link></li>
                <li><Link href="/collections/shop-all" className="hover:text-[#4A7BC6] transition-colors">Browse 99 Master Silhouettes</Link></li>
                <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Sampling &amp; Swatches</Link></li>
              </ul>
            </div>

            {/* Column 3: Policies & Client Care */}
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#0B2D7F]">
                  Policies &amp; Care
                </h4>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs font-sans text-[#0B2D7F]/80">
                <li><Link href="/pages/refund-policy" className="hover:text-[#4A7BC6] transition-colors">Shipping &amp; Cargo Freight</Link></li>
                <li><Link href="/pages/refund-policy" className="hover:text-[#4A7BC6] transition-colors">Wholesale Returns &amp; Exchange</Link></li>
                <li><Link href="/pages/faqs" className="hover:text-[#4A7BC6] transition-colors">Wholesale FAQs</Link></li>
                <li><Link href="/pages/terms-of-service" className="hover:text-[#4A7BC6] transition-colors">Terms of Service</Link></li>
                <li><Link href="/pages/terms-of-service" className="hover:text-[#4A7BC6] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">B2B Concierge Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* BOTTOM TIER: SUB-FOOTER WITH BACK TO TOP ANCHOR            */}
        {/* ========================================================== */}
        <div className="pt-8 border-t border-[#0B2D7F]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#0B2D7F]/60 font-sans">
          <div className="text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} WASTRAM ATELIER. All Rights Reserved. Handcrafted with pride in Jaipur, India.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-[11px] text-[#0B2D7F]/50">
              Enquiry-Based Wholesale &bull; Global Cargo
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[#0B2D7F] hover:text-[#D4AF37] transition-colors font-medium cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <span className="text-sm">&uarr;</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
