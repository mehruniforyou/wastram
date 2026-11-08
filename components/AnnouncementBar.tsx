'use client';

import React from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#FAF9F6] text-[#0B2D7F] text-xs font-serif tracking-widest">
      <div className="max-w-[1540px] mx-auto px-4 lg:px-8 py-2 flex items-center justify-between">
        {/* Left: Brand Subtitle */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse shrink-0" />
          <span className="uppercase tracking-[0.2em] text-[#0B2D7F] text-[11px] font-medium">
            WASTRAM • DIRECT B2B EXPORT
          </span>
        </div>

        {/* Right: Contact Subtitle Link */}
        <Link
          href="/pages/contact"
          className="text-[#0B2D7F] hover:text-[#4A7BC6] text-[11px] uppercase tracking-[0.15em] transition-colors flex items-center gap-1 group font-medium"
        >
          <span>Request Wholesale Quote</span>
          <span className="text-[#F58220] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
