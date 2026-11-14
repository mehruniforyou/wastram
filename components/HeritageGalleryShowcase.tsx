'use client';

import React from 'react';
import Link from 'next/link';
import { ETHNIC_WEAR_SETS } from '@/data/ethnic-wear-sets';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

export default function HeritageGalleryShowcase() {
  const heritageSets = ETHNIC_WEAR_SETS.slice(0, 4);

  const romanNumerals = ['No. 01', 'No. 02', 'No. 03', 'No. 04'];

  return (
    <section className="w-full py-14 md:py-24 px-4 md:px-8 bg-[#FAF5E6]/35 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-14">
        {/* Royal Section Heading with Scroll Reveal */}
        <ScrollReveal direction="up" distance={20} duration={800}>
          <div className="flex flex-col items-center text-center">
            <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1.5 flex items-center gap-2">
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
              Royal Jaipuri Needlework
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.14em] uppercase text-[#0B2D7F]">
              Handcrafted Heritage
            </h2>
            <div className="w-16 h-[1.5px] gold-shimmer-line mt-3 rounded-full" />
          </div>
        </ScrollReveal>

        {/* 4 Curated Bespoke Editions with Roman Numeral Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {heritageSets.map((product, idx) => (
            <ScrollReveal
              key={product.id || idx}
              direction="up"
              distance={24}
              duration={700}
              delay={idx * 70}
            >
              <div className="flex flex-col gap-2">
                {/* Editorial Curation Marker */}
                <div className="flex items-center justify-between px-1">
                  <span className="font-serif italic text-xs tracking-[0.2em] text-[#D4AF37] uppercase font-medium">
                    {romanNumerals[idx] || `No. 0${idx + 1}`}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#0B2D7F]/50 font-sans">
                    Regal Edition
                  </span>
                </div>

                {/* Product Card */}
                <ProductCard
                  product={product}
                  priority={idx < 2}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Minimal Luxury View All Button */}
        <ScrollReveal direction="up" distance={16} duration={700} delay={100}>
          <div className="flex justify-center pt-2">
            <Link
              href="/collections/ethnic-wear-sets"
              className="px-8 py-3.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-xs font-sans font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card cursor-pointer inline-flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Explore All Ethnic Wear Sets</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
