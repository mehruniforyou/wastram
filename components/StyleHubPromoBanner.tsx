'use client';

import React from 'react';
import Link from 'next/link';

export default function StyleHubPromoBanner() {
  return (
    <section className="container-x mt-24 md:mt-32">
      <Link
        href="/offers"
        className="block relative image-zoom-wrap aspect-[16/9] md:aspect-[21/9] border border-foreground/10 overflow-hidden group"
        data-testid="promo-banner"
      >
        <img
          src="/images/banners/banner-sets.webp"
          alt="Featured Atelier Wholesale Sourcing"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Cinematic Backdrop Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

        {/* Text Details */}
        <div className="absolute inset-0 flex items-center p-6 sm:p-10 md:p-14 lg:p-16 text-white">
          <div className="max-w-2xl">
            <div className="eyebrow text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <span>✦</span>
              <span>Featured Wholesale Edit</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 sm:mt-3 leading-tight tracking-tight text-white drop-shadow-sm">
              Pure Mulmul &amp; Modal Silk Drops
            </h2>
            <p className="mt-2 sm:mt-3 max-w-xl text-white/85 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-none">
              Direct Jaipur atelier sourcing for global boutique owners. Enjoy
              exclusive MOQ slabs, door-to-door air freight, and customized private labeling.
            </p>
            <div className="mt-5 sm:mt-7 inline-block rounded-full border border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 text-[11px] sm:text-xs uppercase tracking-widerest font-semibold transition-all duration-200 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-[#071F59]">
              View Wholesale Terms &amp; Offers →
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
