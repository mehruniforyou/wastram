'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F6]">
      {/* ============================================================== */}
      {/* DESKTOP HERO VIEW (Screens >= 1024px)                          */}
      {/* ============================================================== */}
      <div className="hidden lg:block relative w-full h-[88vh] min-h-[620px] max-h-[880px]">
        {/* Background Image */}
        <img
          src="/nishorama-images/hero-desktop.png"
          alt="Wastram Authentic Indian Textiles & Contemporary Fashion"
          className="w-full h-full object-cover object-center"
        />

        {/* Subtle Watermark Wordmark */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span className="text-[11vw] font-serif font-light text-[#0B2D7F]/[0.04] tracking-[0.1em] uppercase whitespace-nowrap leading-none">
            WASTRAM
          </span>
        </div>

        {/* Overlay Content Centered at Bottom */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center max-w-4xl px-4 w-full">
          {/* Section Kicker Pill (Minimal, shadow, no harsh border) */}
          <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#0B2D7F] font-semibold mb-3 px-4 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-soft">
            Direct B2B Manufacturer &amp; Export House
          </span>

          {/* Grand Elegant Heading */}
          <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-serif font-normal tracking-wide text-[#0B2D7F] uppercase leading-[1.1] mb-6 drop-shadow-sm">
            Authentic Textiles &amp; Contemporary Luxury
          </h1>

          {/* Clear, High-Contrast Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/collections/shop-all"
              className="px-8 py-3.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-xs font-medium uppercase tracking-[0.15em] shadow-navy hover:shadow-elevated"
            >
              Explore 1,400+ Styles
            </Link>
            <Link
              href="/pages/contact"
              className="px-8 py-3.5 rounded-full bg-white/95 text-[#0B2D7F] hover:bg-white transition-all text-xs font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card"
            >
              Request B2B Quote
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

        {/* Mobile Watermark */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span className="text-[16vw] font-serif font-light text-[#0B2D7F]/[0.04] tracking-widest uppercase whitespace-nowrap leading-none">
            WASTRAM
          </span>
        </div>

        {/* Mobile Overlay Content */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center w-[92%] max-w-sm">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#0B2D7F] font-semibold mb-2.5 px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-md shadow-soft">
            Direct B2B Manufacturer
          </span>

          <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-wide text-[#0B2D7F] uppercase leading-tight mb-5 drop-shadow-sm">
            Authentic Textiles &amp; Contemporary Luxury
          </h1>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <Link
              href="/collections/shop-all"
              className="w-full py-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-xs font-medium uppercase tracking-[0.15em] shadow-navy text-center"
            >
              Explore 1,400+ Styles
            </Link>
            <Link
              href="/pages/contact"
              className="w-full py-3 rounded-full bg-white/95 text-[#0B2D7F] hover:bg-white transition-all text-xs font-medium uppercase tracking-[0.15em] shadow-soft text-center"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
