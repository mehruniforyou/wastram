'use client';

import React from 'react';
import Link from 'next/link';
import { NISHORAMA_POPULAR_SEARCHES } from '@/data/nishorama-data';

export default function PopularSearches() {
  return (
    <section className="w-full bg-[#FAF9F6] px-4 py-8 md:py-12 border-t border-black/10 font-archivo">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {Object.entries(NISHORAMA_POPULAR_SEARCHES).map(([category, items]) => (
          <div key={category} className="flex flex-col gap-2 pb-4 border-b border-[#0B2D7F]/20 last:border-b-0">
            <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#0B2D7F]">
              {category}
            </h4>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] md:text-xs text-[#0B2D7F]/75">
              {items.map((item, idx) => (
                <React.Fragment key={item.text}>
                  <Link
                    href={item.href}
                    className="hover:text-black hover:underline transition-colors"
                  >
                    {item.text}
                  </Link>
                  {idx < items.length - 1 && (
                    <span className="text-[#0B2D7F]/40 select-none">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
