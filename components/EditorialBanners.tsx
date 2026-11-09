'use client';

import React from 'react';
import Link from 'next/link';

export default function EditorialBanners() {
  const banners = [
    {
      subtitle: 'Most',
      heading: 'WANTED',
      image: '/nishorama-images/banner-most-wanted.png',
      href: '/collections/most-wanted',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Wholesale',
      heading: 'SETS',
      image: '/nishorama-images/banner-sets.png',
      href: '/collections/sets',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Artisan',
      heading: 'KURTIS',
      image: '/nishorama-images/banner-kurtis.png',
      href: '/collections/kurtis',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Contemporary',
      heading: 'TOPS',
      image: '/nishorama-images/banner-tops.png',
      href: '/collections/tops',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Premium Rigid & Stretch',
      heading: 'DENIM',
      image: '/denim-collection/IMG-20261102-WA0488.jpg.jpeg',
      href: '/collections/denim-collection',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'Export Ready',
      heading: 'DRESSES',
      image: '/nishorama-images/banner-dresses.png',
      href: '/collections/dresses',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    }
  ];

  return (
    <section className="w-full py-10 md:py-16 px-4 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-[1540px] mx-auto flex flex-col gap-8 md:gap-12">
        {/* Elegant Section Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1">
            Haute Couture &amp; Wholesale
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
            The Signature Edits
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mt-3" />
        </div>

        {/* 6 Editorial Banners Grid (Border-free, subtle luxury elevation) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {banners.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-cardHover transition-all duration-500 bg-[#071F59] block ${item.aspect}`}
            >
              {/* Background image */}
              <img
                src={item.image}
                alt={`${item.subtitle} ${item.heading}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* High-end vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/80 transition-colors" />

              {/* Banner Content (Pure Heading & Subtitle, No Body Text) */}
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-white z-10">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-serif italic text-lg md:text-2xl text-white/90 leading-tight">
                      {item.subtitle}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-serif font-normal tracking-wide uppercase leading-none text-white drop-shadow-sm mt-1">
                      {item.heading}
                    </h3>
                  </div>

                  {/* Minimal, clear Action CTA */}
                  <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    <span className="px-5 py-2 text-xs font-sans font-medium tracking-[0.15em] uppercase text-white rounded-full bg-white/20 backdrop-blur-md shadow-soft border border-white/25">
                      Explore Edit &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
