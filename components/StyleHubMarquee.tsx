'use client';

import React from 'react';

const CRAFTS = [
  'Pure Mulmul',
  'Modal Silk',
  'Gota Patti Handwork',
  'Chanderi Zari Weave',
  'Sanganeri Handblock',
  'Organic Bagru Indigo',
  'Direct Jaipur Atelier',
  'B2B Wholesale Supply',
  'Worldwide Boutique Air Freight',
  'Custom Private Labeling',
];

export default function StyleHubMarquee() {
  return (
    <section className="mt-24 md:mt-32 border-y border-[#D4AF37]/30 py-6 md:py-8 overflow-hidden bg-[#FAF5E6]/40 dark:bg-[#071F59]/30">
      <div className="marquee-track font-jost text-lg sm:text-xl md:text-2xl tracking-[0.08em] font-light uppercase select-none text-[#0B2D7F] dark:text-foreground">
        {[...CRAFTS, ...CRAFTS].map((craft, idx) => (
          <div key={idx} className="flex items-center gap-6 md:gap-10 shrink-0">
            <span>{craft}</span>
            <span className="text-[#D4AF37] text-base">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
}
