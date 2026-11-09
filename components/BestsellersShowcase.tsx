'use client';

import React from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';

export default function BestsellersShowcase() {
  const bestsellers = NISHORAMA_PRODUCTS.filter(
    p => p.badge?.includes('Bestseller') || p.badge?.includes('Export')
  ).slice(0, 4);

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-12">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1">
            High-Turnover Boutique Favorites
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
            Global Export Bestsellers
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mt-3" />
        </div>

        {/* 4-Podium Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {bestsellers.map((product, idx) => (
            <ProductCard
              key={product.id || idx}
              product={product}
              priority={idx < 2}
            />
          ))}
        </div>

        {/* Minimal Luxury B2B Wholesale Credentials Bar */}
        <div className="w-full max-w-4xl mx-auto p-4 md:p-5 rounded-2xl bg-white shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-6 text-xs font-sans text-[#0B2D7F]/80">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-[#D4AF37]">&bull;</span>
              Direct Factory MOQ 20 Pcs
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-[#D4AF37]">&bull;</span>
              Worldwide Air &amp; Ocean Cargo
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-[#D4AF37]">&bull;</span>
              Custom Private Label &amp; Tagging
            </span>
          </div>

          <Link
            href="/pages/contact"
            className="px-6 py-2.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-[11px] font-sans font-medium uppercase tracking-[0.12em] shadow-soft shrink-0"
          >
            Request B2B Quote &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
