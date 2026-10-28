'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5]">
      {/* ============================================================== */}
      {/* DESKTOP HERO VIEW (Screens >= 1024px)                          */}
      {/* ============================================================== */}
      <div className="hidden lg:block relative w-full h-[90vh] min-h-[640px] max-h-[920px]">
        {/* Background Image */}
        <img
          src="/nishorama-images/hero-desktop.png"
          alt="FREE PANTS worth ₹1399 On order above ₹2999"
          className="w-full h-full object-cover object-center"
        />

        {/* Faded Watermark Background Wordmark */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span className="text-[12vw] font-black text-black/[0.04] tracking-tighter uppercase whitespace-nowrap font-archivo leading-none">
            NISHORAMA
          </span>
        </div>

        {/* Overlay Content Centered at Bottom */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center">
          <p className="text-[11px] font-archivo uppercase tracking-widest text-black/80 font-medium mb-1">
            [Ends Tonight]
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-archivo tracking-tight text-[#FF2F00] uppercase leading-none drop-shadow-sm">
            FREE PANTS worth ₹1399
          </h1>

          <p className="text-xl md:text-2xl font-bold font-archivo tracking-tight text-white/90 drop-shadow-md mt-1 mb-6">
            On order above ₹2999
          </p>

          <Link
            href="/collections/shop-all"
            className="hero-glass-pill uppercase tracking-widest text-xs font-bold"
          >
            SHOP ALL
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HERO VIEW (Screens < 1024px)                            */}
      {/* ============================================================== */}
      <div className="block lg:hidden relative w-full h-[85vh] min-h-[580px]">
        {/* Mobile Portrait Image */}
        <img
          src="/nishorama-images/hero-mobile.png"
          alt="FREE PANTS worth ₹1399"
          className="w-full h-full object-cover object-top"
        />

        {/* Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Mobile Content */}
        <div className="absolute bottom-12 inset-x-4 flex flex-col items-center text-center z-10">
          <p className="text-[10px] font-archivo uppercase tracking-widest text-white/80 font-medium mb-1">
            [Ends Tonight]
          </p>

          <h1 className="text-2xl sm:text-3xl font-black font-archivo tracking-tight text-[#FF2F00] uppercase leading-tight drop-shadow-sm">
            FREE PANTS worth ₹1399
          </h1>

          <p className="text-base sm:text-lg font-bold font-archivo tracking-tight text-white drop-shadow-md mt-0.5 mb-5">
            On order above ₹2999
          </p>

          <Link
            href="/collections/shop-all"
            className="px-8 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-archivo text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/40 shadow-lg transition-all"
          >
            SHOP ALL
          </Link>
        </div>
      </div>
    </section>
  );
}
