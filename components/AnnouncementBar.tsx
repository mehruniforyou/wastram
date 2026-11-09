'use client';

import React from 'react';
import Link from 'next/link';
import StoryRing from './StoryRing';
import { useCart } from '@/context/CartContext';

export default function AnnouncementBar() {
  const { openStory, openB2BQuote } = useCart();

  return (
    <div className="w-full max-w-full overflow-hidden bg-[#FAF9F6] text-[#0B2D7F] text-[11px] font-sans tracking-wide">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-1.5 flex items-center justify-between gap-2">
        {/* Left: Mobile Story Icon (Replacing raw text) / Desktop Atelier Tag */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile Story Icon */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            <StoryRing onClick={openStory} size="w-5 h-5" />
            <button
              type="button"
              onClick={openStory}
              className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors cursor-pointer"
              title="Watch Artisan Stories"
            >
              Stories
            </button>
          </div>

          {/* Desktop Tag: WASTRAM ATELIER • Jaipur Artisan Heritage */}
          <div className="hidden sm:flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[#0B2D7F] text-[11px] truncate">
              WASTRAM ATELIER
            </span>
            <span className="text-[#D4AF37]/70">&bull;</span>
            <span className="text-[#0B2D7F]/75 text-[11px] truncate">
              Jaipur Haute Textiles &amp; Bespoke Production
            </span>
          </div>
        </div>

        {/* Right: Atelier Delivery & Boutique Inquiry CTA */}
        <div className="flex items-center gap-2 text-[#0B2D7F]/80 text-[10px] sm:text-[11px] shrink-0">
          <span className="hidden md:inline">Worldwide Atelier Delivery</span>
          <span className="hidden md:inline text-[#D4AF37]/70">&bull;</span>
          <button
            type="button"
            onClick={openB2BQuote}
            className="text-[#0B2D7F] hover:text-[#4A7BC6] font-semibold transition-colors flex items-center gap-1 group whitespace-nowrap cursor-pointer"
          >
            <span className="underline decoration-[#D4AF37] decoration-1 underline-offset-2">
              <span className="sm:hidden">Boutique Inquiry</span>
              <span className="hidden sm:inline">Boutique &amp; Trade Inquiries</span>
            </span>
            <span className="text-[#F58220] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
