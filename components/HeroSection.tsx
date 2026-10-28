'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F5F5F5]">
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center">
          <p className="text-[0.8vw] font-archivo uppercase tracking-widest text-black/70 font-light mb-1">
            [Ends Tonight]
          </p>

          <h1 className="text-[3.2vw] font-black font-archivo tracking-[-2px] text-[#FF2F00] uppercase leading-none drop-shadow-sm">
            FREE PANTS worth ₹1399
          </h1>

          <p className="text-[2.2vw] font-bold font-archivo tracking-[-0.1vw] text-white drop-shadow-md mt-1 mb-4">
            On order above ₹2999
          </p>

          <Link
            href="/collections/shop-all"
            className="diwali-hero-button uppercase tracking-wider"
          >
            SHOP ALL
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HERO VIEW (Screens < 1024px)                            */}
      {/* ============================================================== */}
      <div className="block lg:hidden relative w-full h-[85vh] min-h-[560px]">
        {/* Mobile Portrait Image */}
        <img
          src="/nishorama-images/hero-mobile.png"
          alt="FREE PANTS worth ₹1399"
          className="w-full h-full object-cover object-top"
        />

        {/* Faded Watermark Wordmark */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span className="text-[18vw] font-black text-black/[0.05] tracking-tighter uppercase whitespace-nowrap font-archivo leading-none">
            NISHORAMA
          </span>
        </div>

        {/* Mobile Overlay Content */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center w-[85%]">
          <span className="text-[10px] font-archivo uppercase tracking-widest text-black/70 font-light mb-1">
            [Ends Tonight]
          </span>

          <h1 className="text-3xl font-black font-archivo tracking-tight text-[#FF2F00] uppercase leading-tight drop-shadow-sm">
            FREE PANTS worth ₹1399
          </h1>

          <p className="text-base font-bold font-archivo text-white drop-shadow-md mt-0.5 mb-4">
            On order above ₹2999
          </p>

          <Link
            href="/collections/shop-all"
            className="diwali-hero-button uppercase tracking-wider"
          >
            SHOP ALL
          </Link>
        </div>
      </div>
    </section>
  );
}
