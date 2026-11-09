'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SHORT_LONG_KAFTANS } from '@/data/short-long-kaftan';
import { CORD_SETS } from '@/data/cord-sets';
import ProductCard from './ProductCard';

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
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
        {/* Header with Navigation Controls */}
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
              className="w-10 h-10 rounded-full bg-white text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white transition-colors shadow-soft flex items-center justify-center text-sm font-bold cursor-pointer"
              aria-label="Scroll left"
            >
              &larr;
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white transition-colors shadow-soft flex items-center justify-center text-sm font-bold cursor-pointer"
              aria-label="Scroll right"
            >
              &rarr;
            </button>
          </div>
        </div>

        {/* Horizontal Filmstrip Runway Track */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        >
          {resortProducts.map((product, idx) => (
            <div
              key={product.id || idx}
              className="w-[220px] sm:w-[260px] md:w-[280px] shrink-0"
            >
              <ProductCard
                product={product}
                priority={idx < 2}
              />
            </div>
          ))}
        </div>

        {/* Minimal Luxury View All Button */}
        <div className="flex justify-center pt-2">
          <Link
            href="/collections/short-long-kaftan"
            className="px-8 py-3 rounded-full bg-white text-[#0B2D7F] hover:bg-[#FAF9F6] transition-all text-xs font-sans font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card cursor-pointer flex items-center gap-2 active:scale-98"
          >
            <span>Explore All Resort Styles</span>
            <span className="text-xs">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
