'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function BaisaHero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFEFE] dark:bg-[#12100E] pt-8 md:pt-12 pb-16 md:pb-24">
      {/* Delicate Sanganeri Block-print Paisley Watermark Motif */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-repeat"
        style={{
          backgroundImage: "url('/images/brand/wastram-artisan-crest.png')",
          backgroundSize: '180px 180px',
        }}
      />

      <div className="container-x relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Typographic Editorial Copy */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="section-pill mb-4 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>Jaipur Handloom Atelier</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0B2D7F] dark:text-white font-normal leading-[1.08] tracking-tight">
            Artisanal Handloom Textiles &amp; <span className="italic font-normal text-[#D4AF37]">Boutique Sourcing.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed max-w-xl">
            Direct atelier manufacturing for luxury fashion boutiques and overseas labels. Pure mulmul, modal silks, and authentic Sanganer block prints in graded sizes S to XXL.
          </p>

          {/* Sourcing Proof Points Strip (Placed Above the CTAs) */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm font-sans text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
              <span>Direct Sanganer Atelier</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
              <span>Sizes S to XXL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
              <span>MOQ: 20 Pcs / Style</span>
            </div>
          </div>

          {/* Action Buttons: Placed at the very bottom of this editorial column */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-sm font-medium tracking-wide shadow-md shadow-[#0B2D7F]/25 transition-all duration-200 active:scale-98"
            >
              <span>Explore collection</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/wholesale"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-white/30 dark:text-white hover:bg-[#0B2D7F]/5 text-sm font-medium tracking-wide transition-all duration-200"
            >
              <span>Wholesale &amp; Trade Terms</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Layered Editorial Photography Frame */}
        <div className="lg:col-span-6 relative flex items-center justify-center w-full max-w-full overflow-hidden sm:overflow-visible py-2">
          {/* Main Primary Model Frame (Rectangular with Rounded Corners) */}
          <div className="relative w-full max-w-[310px] sm:max-w-[380px] md:max-w-[420px] aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-neutral-200 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] hover:-translate-y-1.5 bg-[#FFFEFE] z-10 group mx-auto transition-all duration-300 ease-out">
            <img
              src="/western-dresses/10045.jpg.jpeg"
              alt="Wastram Jaipur Handcrafted Ethnic Wear"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Floating Live Product Tag Pill at bottom of frame */}
            <Link
              href="/collections/cord-sets"
              className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 bg-white/95 dark:bg-[#12100E]/95 backdrop-blur-md py-2 sm:py-2.5 px-3 sm:px-4 rounded-full border border-neutral-200 dark:border-white/15 shadow-sm flex items-center justify-between text-[11px] sm:text-xs font-sans text-neutral-900 dark:text-white hover:border-[#0B2D7F] transition-colors"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-[#0B2D7F] shrink-0" />
                <span className="font-medium truncate">Morpankh Ikat Co-ord</span>
                <span className="text-[#0B2D7F] dark:text-[#D4AF37] font-medium">· Atelier Batch</span>
              </div>
              <ArrowRight size={13} className="shrink-0 text-[#0B2D7F]" />
            </Link>
          </div>

          {/* Secondary Layered Overlapping Lifestyle Card */}
          <div className="hidden md:block absolute -right-2 lg:-right-4 -bottom-6 w-40 lg:w-52 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl border-4 border-white dark:border-[#1E1B18] hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] hover:-translate-y-1.5 bg-[#FFFEFE] z-20 transition-all duration-300 ease-out">
            <img
              src="/cord-sets/12550.jpg.jpeg"
              alt="Jaipur Cotton Co-ord"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Tertiary Subtle Background Frame */}
          <div className="hidden lg:block absolute -left-8 top-10 w-48 aspect-[3/4] rounded-2xl overflow-hidden opacity-40 border border-[#E7E5E4] bg-[#FFFEFE] -z-0">
            <img
              src="/traditional-gowns/16668.jpg.jpeg"
              alt="Traditional Gown Silhouette"
              className="w-full h-full object-cover object-top grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
