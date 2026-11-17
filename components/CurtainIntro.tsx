'use client';

import React, { useState, useEffect } from 'react';

export default function CurtainIntro() {
  const [stage, setStage] = useState<'closed' | 'opening' | 'done'>('closed');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const alreadySeen = sessionStorage.getItem('wastram_curtain_viewed');
      if (alreadySeen) {
        return;
      }
    } catch (_) {}

    setMounted(true);

    // Stage 1: Hold the closed curtain with centered crest for 800ms
    const openTimer = setTimeout(() => {
      setStage('opening');
      try {
        sessionStorage.setItem('wastram_curtain_viewed', 'true');
      } catch (_) {}
    }, 850);

    // Stage 2: Completely unmount after curtains fully part (850ms + 1150ms = 2000ms)
    const doneTimer = setTimeout(() => {
      setStage('done');
      setMounted(false);
    }, 2050);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const handleSkip = () => {
    setStage('opening');
    try {
      sessionStorage.setItem('wastram_curtain_viewed', 'true');
    } catch (_) {}
    setTimeout(() => {
      setStage('done');
      setMounted(false);
    }, 600);
  };

  if (!mounted || stage === 'done') return null;

  const isOpening = stage === 'opening';

  return (
    <div
      className={`fixed inset-0 z-[120] pointer-events-auto select-none overflow-hidden transition-opacity duration-300 ${
        isOpening ? 'pointer-events-none' : ''
      }`}
      onClick={handleSkip}
      role="dialog"
      aria-label="Welcome to Wastram Jaipur Atelier"
    >
      {/* 1. LEFT CURTAIN PANEL (Parts to the Left) */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#081B4B] text-white shadow-2xl transition-transform duration-[1100ms] ease-[cubic-bezier(0.77,0,0.175,1)] will-change-transform flex items-center justify-end overflow-hidden"
        style={{
          transform: isOpening ? 'translateX(-100%)' : 'translateX(0%)',
        }}
      >
        {/* Rajasthani Heritage Jaali Watermark Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Soft Royal Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/25 pointer-events-none" />

        {/* Vertical Gold Zari Seam Line (Right Edge of Left Curtain) */}
        <div className="absolute top-0 bottom-0 right-0 w-[1.5px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
      </div>

      {/* 2. RIGHT CURTAIN PANEL (Parts to the Right) */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#081B4B] text-white shadow-2xl transition-transform duration-[1100ms] ease-[cubic-bezier(0.77,0,0.175,1)] will-change-transform flex items-center justify-start overflow-hidden"
        style={{
          transform: isOpening ? 'translateX(100%)' : 'translateX(0%)',
        }}
      >
        {/* Rajasthani Heritage Jaali Watermark Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Soft Royal Vignette */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-black/25 pointer-events-none" />

        {/* Vertical Gold Zari Seam Line (Left Edge of Right Curtain) */}
        <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
      </div>

      {/* 3. CENTER STAGE ROYAL CREST & ATELIER WORDMARK */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpening
            ? 'opacity-0 scale-110 -translate-y-4 filter blur-xs'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Pulsing Gold Halo Behind Crest */}
        <div className="absolute w-44 h-44 rounded-full bg-[#D4AF37]/15 blur-2xl animate-pulse pointer-events-none" />

        {/* Official Wastram Artisan Logomark */}
        <div className="relative mb-4 drop-shadow-xl animate-in zoom-in-90 duration-700">
          <img
            src="/images/brand/wastram-artisan-crest.png"
            alt="Wastram Jaipur Atelier Emblem"
            className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain"
          />
        </div>

        {/* Brand Wordmark Title */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-[0.22em] uppercase drop-shadow-md">
          Wastram
        </h1>

        {/* Gold Atelier Subtitle */}
        <p className="mt-1.5 text-[10px] sm:text-[11.5px] font-sans font-semibold uppercase tracking-[0.32em] text-[#D4AF37] drop-shadow-sm flex items-center gap-2">
          <span className="w-3 h-[1px] bg-[#D4AF37]/60" />
          <span>Jaipur Handloom Atelier</span>
          <span className="w-3 h-[1px] bg-[#D4AF37]/60" />
        </p>

        {/* Shimmering Zari Thread Accent */}
        <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-3" />

        {/* Provenance Tag */}
        <span className="mt-3 text-[9px] uppercase tracking-[0.25em] text-white/50 font-sans">
          ✦ Direct Sanganer Manufacturing ✦
        </span>
      </div>

      {/* 4. Minimalist Floating "Skip" Pill */}
      <div className="absolute top-6 right-6 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 text-[10.5px] font-sans uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer shadow-xs"
        >
          Skip ✕
        </button>
      </div>
    </div>
  );
}
