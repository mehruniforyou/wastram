'use client';

import React from 'react';
import Link from 'next/link';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'Ethnic Wear Sets',
      image: '/ethnic-wear-sets/Screenshot_2026-05-04-23-09-15-24_a23b203fd3aafc6dcb84e438dda678b6.jpg.jpeg',
      href: '/collections/ethnic-wear-sets',
      highlight: true
    },
    {
      title: 'Umbrella Dresses',
      image: '/umbrella-dresses/4726.jpg.jpeg',
      href: '/collections/umbrella-dresses',
      highlight: false
    },
    {
      title: 'Denim Collection',
      image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
      href: '/collections/denim-collection',
      highlight: false
    },
    {
      title: 'Western Dresses',
      image: '/western-dresses/1668.jpg.jpeg',
      href: '/collections/western-dresses',
      highlight: false
    },
    {
      title: 'Co-ord Sets',
      image: '/cord-sets/_MG_7607.JPG.jpeg',
      href: '/collections/cord-sets',
      highlight: false
    },
    {
      title: 'Resort Kaftans',
      image: '/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
      href: '/collections/short-long-kaftan',
      highlight: false
    }
  ];

  return (
    <section className="w-full py-10 md:py-16 px-4 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-[1540px] mx-auto flex flex-col gap-8 md:gap-12">
        {/* Elegant Section Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1">
            Handcrafted Jaipuri Artistry
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
            Curated Silhouettes
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mt-3" />
        </div>

        {/* 6 Category Cards Grid (Border-free, soft luxury elevation) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative bg-white shadow-soft hover:shadow-card transition-all duration-400 block overflow-hidden rounded-2xl hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF9F6]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                  loading="lazy"
                />
                {cat.highlight && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0B2D7F] text-white text-[9px] font-medium uppercase tracking-[0.15em] shadow-soft">
                      Signature
                    </span>
                  </div>
                )}
              </div>

              {/* Minimal Clean Title (No body text) */}
              <div className="p-3 bg-white text-center">
                <span className="text-xs md:text-sm font-serif font-medium text-[#0B2D7F] group-hover:text-[#4A7BC6] transition-colors line-clamp-1 tracking-wide">
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
