'use client';

import React from 'react';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import StyleHubSectionHeader from './StyleHubSectionHeader';

export default function StyleHubNewArrivals() {
  // Select 4 striking new arrival pieces
  const newArrivals = NISHORAMA_PRODUCTS.filter(
    (p) => p.badge === 'NEW' || p.new_arrival || p.category === 'Western Dresses'
  ).slice(0, 4);

  return (
    <section className="container-x mt-24 md:mt-32">
      <StyleHubSectionHeader
        eyebrow="New Arrivals"
        title="Just landed in the atelier"
        cta="See all new drops"
        to="/products?filter=new"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 items-stretch">
        {newArrivals.map((product, idx) => {
          const isFeaturedFirst = idx === 0;
          return (
            <div
              key={product.id || product.slug}
              className={
                isFeaturedFirst
                  ? 'sm:col-span-2 md:col-span-6 md:row-span-2 flex flex-col'
                  : 'md:col-span-3 flex flex-col'
              }
            >
              <ProductCard product={product} priority={isFeaturedFirst} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
