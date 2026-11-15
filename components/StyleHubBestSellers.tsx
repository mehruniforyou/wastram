'use client';

import React from 'react';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import StyleHubSectionHeader from './StyleHubSectionHeader';

export default function StyleHubBestSellers() {
  // Select 4 best sellers (e.g. umbrella dresses, tops-shirts, kaftans)
  const bestSellers = NISHORAMA_PRODUCTS.filter(
    (p) =>
      p.category === 'Umbrella Dresses' ||
      p.category === 'Kaftans (Short & Long)' ||
      p.badge === 'BESTSELLER' ||
      p.tab === 'best'
  ).slice(0, 4);

  return (
    <section className="container-x mt-24 md:mt-32">
      <StyleHubSectionHeader
        eyebrow="Best Sellers"
        title="Wardrobe cornerstones"
        cta="All best sellers"
        to="/products?filter=bestseller"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
