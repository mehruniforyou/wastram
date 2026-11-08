'use client';

import React from 'react';
import Link from 'next/link';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'ETHNIC WEAR SETS',
      count: '100+ Regal Sets',
      image: '/ethnic-wear-sets/Screenshot_2026-05-04-23-09-15-24_a23b203fd3aafc6dcb84e438dda678b6.jpg.jpeg',
      href: '/collections/ethnic-wear-sets',
      highlight: true
    },
    {
      title: 'UMBRELLA DRESSES',
      count: '315+ Flared Styles',
      image: '/umbrella-dresses/4726.jpg.jpeg',
      href: '/collections/umbrella-dresses',
      highlight: false
    },
    {
      title: 'DENIM COLLECTION',
      count: '140+ Export Styles',
      image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
      href: '/collections/denim-collection',
      highlight: false
    },
    {
      title: 'WESTERN DRESSES',
      count: '260+ Export Designs',
      image: '/western-dresses/1668.jpg.jpeg',
      href: '/collections/western-dresses',
      highlight: false
    },
    {
      title: 'CO-ORD SETS',
      count: '110+ Designer Sets',
      image: '/cord-sets/_MG_7607.JPG.jpeg',
      href: '/collections/cord-sets',
      highlight: false
    },
    {
      title: 'SHORT & LONG KAFTAN',
      count: '150+ Resort Styles',
      image: '/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
      href: '/collections/short-long-kaftan',
      highlight: false
    }
  ];

  return (
    <section className="w-full p-2 md:p-4 bg-[#FAF9F6]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 max-w-[1540px] mx-auto">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="group relative bg-white border border-[#0B2D7F]/10 hover:border-[#D4AF37] shadow-xs hover:shadow-md transition-all block overflow-hidden rounded-xl"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF9F6]">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {cat.highlight && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-[#F58220] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs border border-white/40">
                    SIGNATURE
                  </span>
                </div>
              )}
            </div>
            <div className="p-2 md:p-2.5 bg-white text-center border-t border-[#0B2D7F]/5 flex flex-col gap-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2D7F] group-hover:text-[#F58220] transition-colors line-clamp-1">
                {cat.title}
              </span>
              <span className="text-[10px] text-[#0B2D7F]/60 font-medium">
                {cat.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
