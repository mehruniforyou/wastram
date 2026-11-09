'use client';

import React from 'react';
import Link from 'next/link';
import { NishoramaProduct } from '@/data/nishorama-data';
import ProductCard from './ProductCard';

interface ProductShowcaseSectionProps {
  kicker: string;
  heading: string;
  products: NishoramaProduct[];
  viewAllHref: string;
  viewAllLabel?: string;
  limit?: number;
}

export default function ProductShowcaseSection({
  kicker,
  heading,
  products,
  viewAllHref,
  viewAllLabel = 'Explore Collection',
  limit = 4,
}: ProductShowcaseSectionProps) {
  const displayProducts = products.slice(0, limit);

  return (
    <section className="w-full py-12 md:py-18 px-4 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
        {/* Elegant Section Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1">
            {kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
            {heading}
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mt-3" />
        </div>

        {/* 4-Column Desktop / 2-Column Mobile Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {displayProducts.map((product, idx) => (
            <ProductCard
              key={product.id || `${product.slug}-${idx}`}
              product={product}
              priority={idx < 2}
            />
          ))}
        </div>

        {/* Minimal Luxury View All Button */}
        <div className="flex justify-center pt-2">
          <Link
            href={viewAllHref}
            className="px-7 py-3 rounded-full bg-white text-[#0B2D7F] hover:bg-[#FAF9F6] transition-all text-xs font-sans font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card cursor-pointer border-none flex items-center gap-2 active:scale-98"
          >
            <span>{viewAllLabel}</span>
            <span className="text-[11px]">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
