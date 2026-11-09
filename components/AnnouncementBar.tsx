'use client';

import React from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <div className="w-full max-w-full overflow-hidden bg-[#FAF9F6] text-[#0B2D7F] text-[11px] font-sans tracking-wide">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-1.5 flex items-center justify-between gap-2">
        {/* Left: Brand / B2B Export Tag */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse shrink-0" />
          <span className="font-semibold uppercase tracking-wider text-[#0B2D7F] text-[10px] sm:text-[11px] truncate">
            WASTRAM B2B EXPORT
          </span>
          <span className="text-[#D4AF37]/70 hidden sm:inline">&bull;</span>
          <span className="text-[#0B2D7F]/75 hidden sm:inline text-[11px] truncate">
            Jaipur Direct Manufacturer
          </span>
        </div>

        {/* Right: Dispatch credentials & Contact CTA */}
        <div className="flex items-center gap-2 text-[#0B2D7F]/80 text-[10px] sm:text-[11px] shrink-0">
          <span className="hidden md:inline">Air &amp; Ocean Cargo Dispatch</span>
          <span className="hidden md:inline text-[#D4AF37]/70">&bull;</span>
          <Link
            href="/pages/contact"
            className="text-[#0B2D7F] hover:text-[#4A7BC6] font-semibold transition-colors flex items-center gap-1 group whitespace-nowrap"
          >
            <span className="underline decoration-[#D4AF37] decoration-1 underline-offset-2">
              <span className="sm:hidden">Wholesale Quote</span>
              <span className="hidden sm:inline">Request Wholesale Quote</span>
            </span>
            <span className="text-[#F58220] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
