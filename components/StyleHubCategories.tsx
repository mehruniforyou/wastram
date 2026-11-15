'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import StyleHubSectionHeader from './StyleHubSectionHeader';

export default function StyleHubCategories() {
  const displayCategories = CATEGORIES.slice(0, 6);

  return (
    <section className="container-x mt-20 md:mt-28">
      <StyleHubSectionHeader
        eyebrow="Categories"
        title="Explore by category"
        cta="See all categories"
        to="/categories"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group image-zoom-wrap relative aspect-[3/4] bg-secondary border border-foreground/10 overflow-hidden block"
            data-testid={`home-cat-${cat.slug}`}
          >
            <img
              src={cat.image || cat.heroImage || '/placeholder.jpg'}
              alt={cat.name}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

            {/* Bottom Content */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white">
              <div className="font-display text-sm sm:text-base leading-tight font-medium drop-shadow-sm">
                {cat.name}
              </div>
              <div className="mt-1 text-[10px] sm:text-[11px] text-white/80 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                <span>Shop</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
