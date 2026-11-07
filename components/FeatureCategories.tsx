'use client';

import React from 'react';
import Link from 'next/link';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'DENIM COLLECTION',
      count: '140+ Export Styles',
      image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
      href: '/collections/denim-collection',
      highlight: true
    },
    {
      title: 'WESTERN DRESSES',
      count: '170+ Export Designs',
      image: '/western-dresses/1668.jpg.jpeg',
      href: '/collections/western-dresses'
    },
    {
      title: 'HOODIES & SWEATSHIRTS',
      count: '40+ Streetwear Styles',
      image: '/hoodies-sweatshirts/16885.jpg.jpeg',
      href: '/collections/hoodies-sweatshirts'
    },
    {
      title: 'T-SHIRTS',
      count: '50+ Streetwear Tees',
      image: '/t-shirts/13665.jpg.jpeg',
      href: '/collections/t-shirts'
    },
    {
      title: 'CO-ORD SETS',
      count: '95+ Designer Sets',
      image: '/cord-sets/_MG_7607.JPG.jpeg',
      href: '/collections/cord-sets'
    },
    {
      title: 'EXPORT BESTSELLERS',
      count: 'Top Wholesale Picks',
      image: '/western-dresses/10426.jpg.jpeg',
      href: '/collections/most-wanted'
    }
  ];

  return (
    <section className="w-full p-2 md:p-4 bg-[#F5F5F5]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="group relative diwali-capsule-border bg-white shadow-sm hover:shadow-md transition-all block overflow-hidden rounded-lg"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE8E1]">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {cat.highlight && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-[#FF2F00] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                    NEW DROP
                  </span>
                </div>
              )}
            </div>
            <div className="p-2 md:p-2.5 bg-white text-center border-t border-black/5 flex flex-col gap-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#482922] group-hover:text-[#FF2F00] transition-colors line-clamp-1">
                {cat.title}
              </span>
              <span className="text-[10px] text-black/50 font-medium">
                {cat.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
