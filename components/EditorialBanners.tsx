'use client';

import React from 'react';
import Link from 'next/link';

export default function EditorialBanners() {
  const banners = [
    {
      subtitle: 'Most Wanted',
      heading: 'SIGNATURE EDIT',
      image: '/nishorama-images/banner-most-wanted.png',
      href: '/collections/most-wanted',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Wholesale',
      heading: 'ETHNIC SETS',
      image: '/nishorama-images/banner-sets.png',
      href: '/collections/sets',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Artisanal',
      heading: 'KURTIS & TUNICS',
      image: '/nishorama-images/banner-kurtis.png',
      href: '/collections/kurtis',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Contemporary',
      heading: 'TOPS & SHIRTS',
      image: '/nishorama-images/banner-tops.png',
      href: '/collections/tops',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'B2B Export',
      heading: 'DENIM COLLECTION',
      image: '/denim-collection/IMG-20261102-WA0488.jpg.jpeg',
      href: '/collections/denim-collection',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Resort & Kalidar',
      heading: 'DRESSES',
      image: '/nishorama-images/banner-dresses.png',
      href: '/collections/dresses',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    }
  ];

  return (
    <section className="w-full p-2 md:p-4 bg-[#FAF9F6] font-serif">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {banners.map((item, idx) => (
          <div
            key={idx}
            className={`group relative rounded-xl md:rounded-2xl overflow-hidden shadow-sm bg-[#071F59] cursor-pointer ${item.aspect}`}
          >
            {/* Background image */}
            <img
              src={item.image}
              alt={`${item.subtitle} ${item.heading}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />

            {/* Dark warm overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

            {/* Banner Content: Only Subtitle and Heading + Minimal Explore Button */}
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-white z-10">
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col">
                  <span className="font-serif italic text-lg md:text-2xl text-white/90 leading-tight">
                    {item.subtitle}
                  </span>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-tight uppercase leading-none text-white drop-shadow mt-1">
                    {item.heading}
                  </h2>
                </div>

                <Link
                  href={item.href}
                  className="px-5 py-2 text-xs font-serif tracking-widest uppercase text-white rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all whitespace-nowrap shrink-0"
                >
                  Explore &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
