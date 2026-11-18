'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function BaisaHero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFEFE] dark:bg-[#12100E] pt-4 md:pt-8 pb-8 md:pb-12">
      {/* Delicate Sanganeri Block-print Paisley Watermark Motif */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-repeat"
        style={{
          backgroundImage: "url('/images/brand/wastram-artisan-crest.png')",
          backgroundSize: '180px 180px',
        }}
      />

      <div className="container-x relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Right Column (Appears FIRST on mobile, SECOND on desktop): Layered Editorial Photography 3-Image Collage */}
        <ScrollReveal
          direction="scale"
          delay={100}
          duration={900}
          className="order-1 lg:order-2 lg:col-span-6 relative flex items-center justify-center w-full py-4 sm:py-6 lg:py-2 select-none"
        >
          {/* Proportional Collage Box (Fits within mobile 340px width & scales gracefully up to desktop 460px) */}
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] aspect-[4/4.5] flex items-center justify-center mx-auto">
            {/* 1. Tertiary Subtle Background Frame (Top-Left Flank) */}
            <div className="absolute left-0 sm:left-2 top-0 sm:top-2 w-32 sm:w-44 lg:w-48 aspect-[3/4] rounded-2xl overflow-hidden opacity-50 sm:opacity-60 border border-[#E7E5E4] dark:border-white/10 z-0 bg-[#FFFEFE] shadow-sm">
              <img
                src="/traditional-gowns/16668.jpg.jpeg"
                alt="Traditional Gown Silhouette"
                className="w-full h-full object-cover object-top grayscale"
              />
            </div>

            {/* 2. Main Primary Center Model Frame (Anchor) */}
            <div className="relative w-56 sm:w-72 lg:w-80 aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] bg-[#FFFEFE] z-10 group transition-all duration-300 ease-out">
              <img
                src="/western-dresses/10045.jpg.jpeg"
                alt="Wastram Jaipur Handcrafted Ethnic Wear"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Floating Live Product Tag Pill at bottom of frame */}
              <Link
                href="/collections/cord-sets"
                className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 dark:bg-[#12100E]/95 backdrop-blur-md py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-full border border-neutral-200 dark:border-white/15 shadow-sm flex items-center justify-between text-[10.5px] sm:text-xs font-sans text-neutral-900 dark:text-white hover:border-[#0B2D7F] transition-colors"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#0B2D7F] shrink-0" />
                  <span className="font-medium truncate">Morpankh Ikat Co-ord</span>
                  <span className="text-[#0B2D7F] dark:text-[#D4AF37] font-medium">· Batch</span>
                </div>
                <ArrowRight size={13} className="shrink-0 text-[#0B2D7F]" />
              </Link>
            </div>

            {/* 3. Secondary Layered Overlapping Lifestyle Card (Bottom-Right Flank) */}
            <div className="absolute right-0 sm:right-2 -bottom-2 sm:-bottom-4 w-32 sm:w-44 lg:w-52 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white dark:border-[#1E1B18] hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] bg-[#FFFEFE] z-20 transition-all duration-300 ease-out">
              <img
                src="/cord-sets/12550.jpg.jpeg"
                alt="Jaipur Cotton Co-ord"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Left Column (Appears SECOND on mobile, FIRST on desktop): Typographic Editorial Copy */}
        <ScrollReveal
          direction="up"
          duration={800}
          className="order-2 lg:order-1 lg:col-span-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start"
        >
          <div className="section-pill mb-3 sm:mb-4 self-center lg:self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>Jaipur Handloom Atelier</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#0B2D7F] dark:text-white font-normal leading-[1.12] sm:leading-[1.08] tracking-tight">
            Artisanal Handloom Textiles &amp; <span className="italic font-normal text-[#D4AF37]">Boutique Sourcing.</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-xs sm:text-base text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed max-w-xl">
            Direct atelier manufacturing for luxury fashion boutiques and overseas labels. Pure mulmul, modal silks, and authentic Sanganer block prints in graded sizes S to XXL.
          </p>

          {/* Sourcing Proof Points Strip (Placed Above the CTAs) */}
          <div className="mt-5 sm:mt-6 flex flex-wrap justify-center lg:justify-start items-center gap-x-5 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-sans text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
              <span>Direct Sanganer Atelier</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
              <span>Sizes S to XXL</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
              <span>MOQ: 20 Pcs / Style</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs sm:text-sm font-medium tracking-wide shadow-md shadow-[#0B2D7F]/25 transition-all duration-200 active:scale-98"
            >
              <span>Explore</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/wholesale"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-white/30 dark:text-white hover:bg-[#0B2D7F]/5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200"
            >
              <span>Wholesale</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
