'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SHORT_LONG_KAFTANS } from '@/data/short-long-kaftan';
import { CORD_SETS } from '@/data/cord-sets';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

export default function ResortFilmstripShowcase() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const resortProducts = [...SHORT_LONG_KAFTANS.slice(0, 4), ...CORD_SETS.slice(0, 4)];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-14 md:py-24 px-4 md:px-8 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
        {/* Header with Navigation Controls */}
        <ScrollReveal direction="up" distance={20} duration={800}>
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider block mb-1">
                Breezy Holiday Couture
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
                Resort &amp; Co-ord Silhouettes
              </h2>
            </div>

            {/* Smooth Scroll Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full bg-white text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white transition-all shadow-soft flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Scroll left"
              >
                &larr;
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full bg-white text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white transition-all shadow-soft flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Scroll right"
              >
                &rarr;
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal Filmstrip Carousel */}
        <ScrollReveal direction="up" distance={24} duration={800} delay={100}>
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1"
          >
            {resortProducts.map((product, idx) => (
              <div
                key={product.id || idx}
                className="w-[240px] sm:w-[280px] md:w-[310px] shrink-0"
              >
                <ProductCard
                  product={product}
                  priority={idx < 3}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* View Category Link */}
        <div className="flex justify-center pt-2">
          <Link
            href="/collections/short-long-kaftan"
            className="inline-flex items-center gap-2 text-xs font-sans font-medium tracking-[0.15em] uppercase text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors py-2 border-b border-[#0B2D7F]/30 hover:border-[#4A7BC6]"
          >
            <span>Explore Kaftan &amp; Co-ord Collections</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
