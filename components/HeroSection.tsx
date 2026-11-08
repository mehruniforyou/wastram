'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F6] font-serif">
      {/* ============================================================== */}
      {/* DESKTOP HERO VIEW (Screens >= 1024px)                          */}
      {/* ============================================================== */}
      <div className="hidden lg:block relative w-full h-[88vh] min-h-[600px] max-h-[880px]">
        {/* Background Image */}
        <img
          src="/nishorama-images/hero-desktop.png"
          alt="Wastram Authentic Indian Textiles & Contemporary Fashion"
          className="w-full h-full object-cover object-center"
        />

        {/* Faded Watermark Background Wordmark */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span className="text-[12vw] font-serif font-bold text-[#0B2D7F]/[0.05] tracking-widest uppercase whitespace-nowrap leading-none">
            WASTRAM
          </span>
        </div>

        {/* Overlay Content Centered at Bottom: Only Subtitle, Heading & CTA */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center max-w-4xl px-4">
          <p className="text-xs md:text-sm font-serif italic tracking-[0.25em] text-[#0B2D7F] uppercase mb-2">
            Direct B2B Manufacturer &amp; Global Export House
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#0B2D7F] uppercase leading-tight drop-shadow-sm mb-6">
            Authentic Textiles &amp; Contemporary Luxury
          </h1>

          <div className="flex items-center gap-3">
            <Link
              href="/collections/shop-all"
              className="px-8 py-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all font-serif text-xs uppercase tracking-widest shadow-navy"
            >
              Explore Collections
            </Link>
            <Link
              href="/pages/contact"
              className="px-8 py-3 rounded-full bg-white/90 text-[#0B2D7F] hover:bg-white transition-all font-serif text-xs uppercase tracking-widest shadow-xs"
            >
              Wholesale Quote
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HERO VIEW (Screens < 1024px)                            */}
      {/* ============================================================== */}
      <div className="block lg:hidden relative w-full h-[82vh] min-h-[520px]">
        {/* Mobile Portrait Image */}
        <img
          src="/nishorama-images/hero-mobile.png"
          alt="Wastram Indian Handcrafted Apparel"
          className="w-full h-full object-cover object-top"
        />

        {/* Faded Watermark Wordmark */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span className="text-[16vw] font-serif font-bold text-[#0B2D7F]/[0.05] tracking-widest uppercase whitespace-nowrap leading-none">
            WASTRAM
          </span>
        </div>

        {/* Mobile Overlay Content: Only Subtitle, Heading & CTA */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center w-[90%]">
          <span className="text-[11px] font-serif italic tracking-widest text-[#0B2D7F] uppercase mb-2">
            Direct B2B Manufacturer
          </span>

          <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#0B2D7F] uppercase leading-tight drop-shadow-xs mb-5">
            Authentic Textiles &amp; Contemporary Luxury
          </h1>

          <Link
            href="/collections/shop-all"
            className="w-full max-w-[280px] py-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all font-serif text-xs uppercase tracking-widest shadow-navy text-center"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
