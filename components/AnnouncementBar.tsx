'use client';

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
