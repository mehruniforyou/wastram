'use client';

import React from 'react';

interface BrandedLoaderProps {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export default function BrandedLoader({
  label = 'Wastram Jaipur Atelier',
  sublabel = 'Handcrafted Textiles & Boutique Direct Sourcing',
  size = 'md',
}: BrandedLoaderProps) {
  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFEFE] dark:bg-[#0E0C0A] transition-colors select-none">
        {/* Soft Heritage Watermark Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.06)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md mx-auto">
          {/* Glowing Crest in Dual-Ring Halo */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full gold-spinner absolute inset-0 -m-1" />
            <div className="w-22 h-22 rounded-full bg-white dark:bg-black/60 shadow-xl border border-neutral-100 dark:border-white/10 flex items-center justify-center p-3 crest-glow-anim">
              <img
                src="/images/brand/wastram-artisan-crest.png"
                alt="Wastram Atelier Crest"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Editorial Brand Name */}
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#0B2D7F] dark:text-white">
            {label}
          </h2>

          <p className="mt-2 text-xs uppercase tracking-widest text-[#D4AF37] font-sans font-semibold">
            {sublabel}
          </p>

          {/* Shimmering Progress Bar */}
          <div className="mt-6 w-40 h-1 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
            <div className="h-full w-full nav-progress-bar rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 select-none">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-14 h-14 rounded-full gold-spinner absolute inset-0 -m-1" />
        <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900 shadow-md border border-neutral-100 dark:border-white/10 flex items-center justify-center p-2 crest-glow-anim">
          <img
            src="/images/brand/wastram-artisan-crest.png"
            alt="Wastram"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <p className="font-serif text-sm font-medium text-[#0B2D7F] dark:text-white tracking-wide">
        {label}
      </p>
      {sublabel && (
        <p className="mt-1 text-[11px] text-[#D4AF37] font-semibold tracking-wider uppercase font-sans">
          {sublabel}
        </p>
      )}
    </div>
  );
}
