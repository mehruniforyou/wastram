'use client';

import React from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#071F59] text-white border-b border-[#D4AF37]/25 text-[11px] font-archivo tracking-wider">
      <div className="max-w-[1540px] mx-auto px-4 lg:px-8 py-2 flex items-center justify-between">
        {/* Left: Brand / B2B Export Tag */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-semibold uppercase tracking-widest text-white text-[10px] md:text-[11px]">
            WASTRAM B2B WHOLESALE &amp; EXPORT
          </span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/80 hidden sm:inline text-[11px]">
            FOB &amp; CIF Quotes Available Worldwide
          </span>
        </div>

        {/* Center / Right: Minimalist export credentials & Contact link */}
        <div className="flex items-center gap-4 text-white/80 text-[10px] md:text-[11px]">
          <span className="hidden md:inline">Air &amp; Ocean Cargo Dispatch</span>
          <span className="hidden md:inline text-[#D4AF37]/60">•</span>
          <span className="hidden lg:inline">Flexible Wholesale Packs</span>
          <span className="hidden lg:inline text-[#D4AF37]/60">•</span>
          <Link
            href="/pages/contact"
            className="text-[#D4AF37] hover:text-white font-semibold transition-colors flex items-center gap-1 group"
          >
            <span>Request Wholesale Quote</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
