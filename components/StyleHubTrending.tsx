'use client';

import React from 'react';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import StyleHubSectionHeader from './StyleHubSectionHeader';

export default function StyleHubTrending() {
  // Select 4 trending items from Co-ord Sets and Festive collections
  const trendingProducts = NISHORAMA_PRODUCTS.filter(
    (p) =>
      p.category === 'Co-ord Sets' ||
      p.category === 'Traditional Gowns' ||
      p.tab === 'festive'
  ).slice(0, 4);

  return (
    <section className="container-x mt-24 md:mt-32">
      <StyleHubSectionHeader
        eyebrow="Trending Now"
        title="What everyone's coming in for"
        cta="See all trending"
        to="/products?filter=trending"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {trendingProducts.map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
