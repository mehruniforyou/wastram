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
    <section className="mt-24 md:mt-32 border-y border-black/10 dark:border-white/10 py-6 md:py-8 overflow-hidden bg-secondary/30">
      <div className="marquee-track font-display text-lg sm:text-xl md:text-2xl tracking-widest uppercase select-none text-foreground/85">
        {[...CRAFTS, ...CRAFTS].map((craft, idx) => (
          <div key={idx} className="flex items-center gap-6 md:gap-10 shrink-0">
            <span>{craft}</span>
            <span className="gold text-lg">·</span>
          </div>
        ))}
      </div>
    </section>
  );
}
