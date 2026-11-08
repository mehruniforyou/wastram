'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F6]">
      {/* ============================================================== */}
      {/* DESKTOP HERO VIEW (Screens >= 1024px)                          */}
      {/* ============================================================== */}
      <div className="hidden lg:block relative w-full h-[90vh] min-h-[640px] max-h-[920px]">
        {/* Background Image */}
        <img
          src="/nishorama-images/hero-desktop.png"
          alt="Wastram Authentic Indian Textiles & Contemporary Fashion"
          className="w-full h-full object-cover object-center"
        />

        {/* Faded Watermark Background Wordmark */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span className="text-[12vw] font-black text-[#0B2D7F]/[0.05] tracking-tighter uppercase whitespace-nowrap font-archivo leading-none">
            WASTRAM
          </span>
        </div>

        {/* Overlay Content Centered at Bottom */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center max-w-4xl px-4">
          <p className="text-[11px] font-archivo uppercase tracking-[0.25em] text-[#0B2D7F] font-bold mb-1 px-3 py-0.5 rounded-full bg-white/80 backdrop-blur-xs border border-[#D4AF37]/40 shadow-xs">
            DIRECT B2B MANUFACTURER &amp; EXPORT HOUSE
          </p>

          <h1 className="text-[3.2vw] font-black font-archivo tracking-tight text-[#0B2D7F] uppercase leading-none drop-shadow-sm mt-2">
            AUTHENTIC TEXTILES &amp; CONTEMPORARY FASHION
          </h1>

          <p className="text-[1.3vw] font-semibold font-archivo text-[#0B2D7F] drop-shadow-xs mt-2 mb-5">
            Over 1,400+ Handcrafted Silhouettes • Air &amp; Ocean Cargo Dispatch
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/collections/shop-all"
              className="px-7 py-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all font-archivo text-xs font-bold uppercase tracking-wider shadow-navy border border-[#D4AF37]/50"
            >
              Explore 1,400+ Styles
            </Link>
            <Link
              href="/pages/contact"
              className="px-7 py-3 rounded-full bg-white/90 text-[#0B2D7F] hover:bg-white transition-all font-archivo text-xs font-bold uppercase tracking-wider shadow-xs border border-[#0B2D7F]/20 hover:border-[#D4AF37]"
            >
              Request B2B Quote
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HERO VIEW (Screens < 1024px)                            */}
      {/* ============================================================== */}
      <div className="block lg:hidden relative w-full h-[85vh] min-h-[560px]">
        {/* Mobile Portrait Image */}
        <img
          src="/nishorama-images/hero-mobile.png"
          alt="Wastram Indian Handcrafted Apparel"
          className="w-full h-full object-cover object-top"
        />

        {/* Faded Watermark Wordmark */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span className="text-[18vw] font-black text-[#0B2D7F]/[0.05] tracking-tighter uppercase whitespace-nowrap font-archivo leading-none">
            WASTRAM
          </span>
        </div>

        {/* Mobile Overlay Content */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center w-[90%]">
          <span className="text-[10px] font-archivo uppercase tracking-widest text-[#0B2D7F] font-bold mb-1.5 px-2.5 py-0.5 rounded-full bg-white/85 border border-[#D4AF37]/40">
            DIRECT B2B MANUFACTURER
          </span>

          <h1 className="text-2xl sm:text-3xl font-black font-archivo tracking-tight text-[#0B2D7F] uppercase leading-tight drop-shadow-xs">
            AUTHENTIC TEXTILES &amp; CONTEMPORARY FASHION
          </h1>

          <p className="text-sm font-semibold font-archivo text-[#0B2D7F] mt-1 mb-4">
            Over 1,400+ Handcrafted Silhouettes
          </p>

          <Link
            href="/collections/shop-all"
            className="w-full max-w-[280px] py-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all font-archivo text-xs font-bold uppercase tracking-wider shadow-navy border border-[#D4AF37]/40 text-center"
          >
            Explore 1,400+ Styles
          </Link>
        </div>
      </div>
    </section>
  );
}
