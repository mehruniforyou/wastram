'use client';

import React from 'react';
import Link from 'next/link';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'ETHNIC WEAR SETS',
      image: '/ethnic-wear-sets/Screenshot_2026-05-04-23-09-15-24_a23b203fd3aafc6dcb84e438dda678b6.jpg.jpeg',
      href: '/collections/ethnic-wear-sets',
    },
    {
      title: 'UMBRELLA DRESSES',
      image: '/umbrella-dresses/4726.jpg.jpeg',
      href: '/collections/umbrella-dresses',
    },
    {
      title: 'DENIM COLLECTION',
      image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
      href: '/collections/denim-collection',
    },
    {
      title: 'WESTERN DRESSES',
      image: '/western-dresses/1668.jpg.jpeg',
      href: '/collections/western-dresses',
    },
    {
      title: 'CO-ORD SETS',
      image: '/cord-sets/_MG_7607.JPG.jpeg',
      href: '/collections/cord-sets',
    },
    {
      title: 'SHORT & LONG KAFTAN',
      image: '/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
      href: '/collections/short-long-kaftan',
    }
  ];

  return (
    <section className="w-full p-2 md:p-4 bg-[#FAF9F6] font-serif">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 max-w-[1540px] mx-auto">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="group relative bg-white shadow-xs hover:shadow-md transition-all block overflow-hidden rounded-xl"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF9F6]">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-3 bg-white text-center flex flex-col justify-center">
              <span className="font-serif text-[11px] md:text-xs tracking-widest uppercase text-[#0B2D7F] group-hover:text-[#F58220] transition-colors line-clamp-1 font-medium">
                {cat.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
