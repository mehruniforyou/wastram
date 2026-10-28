'use client';

import React from 'react';
import Link from 'next/link';

export default function EditorialBanners() {
  const banners = [
    {
      subtitle: 'most',
      heading: 'WANTED',
      description: 'Your most-loved styles, now even more irresistible. Shop Most Wanted this Diwali with up to 50% off.',
      image: '/nishorama-images/banner-most-wanted.png',
      href: '/collections/most-wanted',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'upto 50%',
      heading: 'SETS',
      description: 'Your most-loved styles, now even more irresistible. Shop Most Wanted this Diwali with up to 50% off.',
      image: '/nishorama-images/banner-sets.png',
      href: '/collections/sets',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'upto 50%',
      heading: 'KURTIES',
      description: 'Your most-loved styles, now even more irresistible. Shop Most Wanted this Diwali with up to 50% off.',
      image: '/nishorama-images/banner-kurtis.png',
      href: '/collections/kurtis',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'upto 50%',
      heading: 'TOPS',
      description: 'Your most-loved styles, now even more irresistible. Shop Most Wanted this Diwali with up to 50% off.',
      image: '/nishorama-images/banner-tops.png',
      href: '/collections/tops',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'upto 50%',
      heading: 'DRESSES',
      description: 'Your most-loved styles, now even more irresistible. Shop Most Wanted this Diwali with up to 50% off.',
      image: '/nishorama-images/banner-dresses.png',
      href: '/collections/dresses',
      aspect: 'aspect-[2/1] lg:aspect-[3/1] lg:col-span-2'
    }
  ];

  return (
    <section className="w-full p-2 md:p-4 bg-[#FAF8F5]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {banners.map((item, idx) => (
          <div
            key={idx}
            className={`group relative rounded-xl md:rounded-2xl overflow-hidden shadow-sm bg-[#3D2E24] cursor-pointer ${item.aspect}`}
          >
            {/* Background image */}
            <img
              src={item.image}
              alt={`${item.subtitle} ${item.heading}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />

            {/* Dark warm chocolate overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

            {/* Banner Content */}
            <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end text-white z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                {/* Titles & Buttons */}
                <div className="flex flex-col">
                  <span className="font-serif italic text-lg md:text-2xl text-white/90 leading-tight">
                    {item.subtitle}
                  </span>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-black font-archivo tracking-tight uppercase leading-none text-white drop-shadow">
                    {item.heading}
                  </h2>

                  {/* Buttons */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Link
                      href={item.href}
                      className="glass-btn px-4 md:px-6 py-1.5 md:py-2 text-[11px] md:text-xs font-archivo font-semibold tracking-wider uppercase text-white rounded-full flex items-center"
                    >
                      Shop All
                    </Link>
                    <Link
                      href={item.href}
                      className="glass-btn w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white"
                      aria-label={`Explore ${item.heading}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Description Text */}
                <p className="max-w-xs text-[11px] md:text-xs font-archivo text-white/70 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
