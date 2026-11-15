'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function HeroSection() {
  return (
    <section className="relative w-full max-w-full overflow-hidden bg-[#FAF9F6]">
      {/* ============================================================== */}
      {/* DESKTOP HERO VIEW (Screens >= 1024px)                          */}
      {/* ============================================================== */}
      <div className="hidden lg:block relative w-full h-[88vh] min-h-[620px] max-h-[880px] overflow-hidden">
        {/* Background Image with subtle scale */}
        <img
          src="/nishorama-images/hero-desktop.png"
          alt="Wastram Authentic Indian Textiles & Contemporary Fashion"
          className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out hover:scale-102"
        />

        {/* Subtle Watermark Wordmark */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 max-w-full overflow-hidden">
          <span className="text-[11vw] font-serif font-light text-[#0B2D7F]/[0.04] tracking-[0.1em] uppercase whitespace-nowrap leading-none">
            WASTRAM
          </span>
        </div>

        {/* Overlay Content Centered at Bottom */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center max-w-4xl px-4 w-full">
          <ScrollReveal direction="up" distance={20} duration={800} delay={100}>
            {/* Section Kicker Pill */}
            <span className="inline-block text-[11px] font-sans uppercase tracking-[0.22em] text-[#0B2D7F] font-semibold mb-3 px-4 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-soft border border-white/60">
              Jaipur Haute Textiles &amp; Bespoke Production
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={24} duration={850} delay={200}>
            {/* Grand Elegant Heading */}
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-serif font-normal tracking-wide text-[#0B2D7F] uppercase leading-[1.1] mb-6 drop-shadow-sm">
              Authentic Textiles &amp; Contemporary Luxury
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} duration={900} delay={300}>
            {/* Clear, High-Contrast Action Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/collections/shop-all"
                className="group relative px-8 py-3.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-xs font-medium uppercase tracking-[0.15em] shadow-navy hover:shadow-elevated overflow-hidden"
              >
                <span className="relative z-10">Explore 1,400+ Styles</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </Link>
              <Link
                href="/pages/contact"
                className="px-8 py-3.5 rounded-full bg-white/95 text-[#0B2D7F] hover:bg-white hover:border-[#D4AF37]/50 border border-transparent transition-all text-xs font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card"
              >
                Boutique Inquiries
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Minimalist Jaipuri Scroll Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[9px] uppercase tracking-[0.25em] font-sans text-[#0B2D7F]/75">Discover</span>
          <div className="w-[1px] h-3.5 bg-gradient-to-b from-[#D4AF37] to-transparent animate-scroll-bob" />
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HERO VIEW (Screens < 1024px)                            */}
      {/* ============================================================== */}
      <div className="block lg:hidden relative w-full h-[82vh] min-h-[520px] overflow-hidden">
        {/* Mobile Portrait Image */}
        <img
          src="/nishorama-images/hero-mobile.png"
          alt="Wastram Indian Handcrafted Apparel"
          className="w-full h-full object-cover object-top"
        />

        {/* Mobile Watermark */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 w-full overflow-hidden flex justify-center">
          <span className="text-5xl sm:text-7xl font-serif font-light text-[#0B2D7F]/[0.05] tracking-[0.25em] uppercase whitespace-nowrap leading-none">
            WASTRAM
          </span>
        </div>

        {/* Mobile Overlay Content */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center w-[92%] max-w-sm">
          <ScrollReveal direction="up" distance={16} duration={700}>
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#0B2D7F] font-semibold mb-2.5 px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-md shadow-soft border border-white/60">
              Artisanal Textile Atelier
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} duration={750} delay={100}>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-wide text-[#0B2D7F] uppercase leading-tight mb-5 drop-shadow-sm">
              Authentic Textiles &amp; Contemporary Luxury
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} duration={800} delay={200} className="w-full">
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
                Boutique Inquiries
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
