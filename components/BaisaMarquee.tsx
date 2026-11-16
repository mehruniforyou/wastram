'use client';

import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

const MARQUEE_ITEMS = [
  'Free delivery on orders of ₹1,499 and above',
  'Direct from our Jaipur factory',
  'Sizes XS to 8XL with true grading',
  'Hand block-printed in Sanganer',
  'Pure 60-60 Cotton & Modal Silks',
  'Worldwide Boutique Air Cargo',
  'Cash on Delivery available across India',
  '3-Stage Quality Check on every piece',
];

export default function BaisaMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="relative border-y border-ink-200/80 dark:border-white/10 bg-[#FAF9F6] dark:bg-[#12100E] py-3 overflow-hidden select-none">
      <div className="flex items-center">
        {/* Animated Marquee Strip */}
        <div
          className={`flex gap-12 whitespace-nowrap animate-marquee font-body text-xs sm:text-sm tracking-wide text-ink-800 dark:text-neutral-200 ${
            isPaused ? 'animation-paused' : ''
          }`}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-4">
              <span>{item}</span>
              <span className="text-[#C5A059] text-xs">✦</span>
            </span>
          ))}
        </div>

        {/* Pause / Resume Button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pl-4 bg-gradient-to-l from-[#FAF9F6] via-[#FAF9F6] dark:from-[#12100E] dark:via-[#12100E] to-transparent">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-ink-600 dark:text-neutral-400 bg-white/80 dark:bg-neutral-800/80 rounded-full border border-ink-200 dark:border-white/10 hover:text-ink-900 transition-colors shadow-2xs"
            aria-label={isPaused ? 'Resume marquee ticker' : 'Pause marquee ticker'}
          >
            {isPaused ? <Play size={10} /> : <Pause size={10} />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
