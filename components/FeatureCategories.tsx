'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'Ethnic Wear Sets',
      image: '/images/categories/cat-ethnic-wear-sets.webp',
      href: '/collections/ethnic-wear-sets',
      highlight: true
    },
    {
      title: 'Western Dresses',
      image: '/images/categories/cat-western-dresses.webp',
      href: '/collections/western-dresses',
      highlight: false
    },
    {
      title: 'Umbrella Dresses',
      image: '/images/categories/cat-umbrella-dresses.webp',
      href: '/collections/umbrella-dresses',
      highlight: false
    },
    {
      title: 'Denim Collection',
      image: '/images/categories/cat-denim-collection.webp',
      href: '/collections/denim-collection',
      highlight: false
    },
    {
      title: 'Co-ord Sets',
      image: '/images/categories/cat-cord-sets.webp',
      href: '/collections/cord-sets',
      highlight: false
    },
    {
      title: 'Resort Kaftans',
      image: '/images/categories/cat-short-long-kaftan.webp',
      href: '/collections/short-long-kaftan',
      highlight: false
    },
    {
      title: 'Traditional Gowns',
      image: '/images/categories/cat-traditional-gowns.webp',
      href: '/collections/traditional-gowns',
      highlight: false
    },
    {
      title: 'Tops & Shirts',
      image: '/images/categories/cat-tops-shirts.webp',
      href: '/collections/tops-shirts',
      highlight: false
    }
  ];

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-14">
        {/* Architectural Section Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1">
            Handcrafted Jaipuri Artistry
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
            Curated Silhouettes
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mt-3" />
        </div>

        {/* 8 Arched Luxury Portals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-4.5">
          {categories.map((cat, idx) => (
            <Link
              key={cat.href || idx}
              href={cat.href}
              className="group flex flex-col items-center gap-3 transition-transform duration-400 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Arched Architectural Portal Frame */}
              <div className="relative aspect-[3/4.2] w-full rounded-t-[3.5rem] md:rounded-t-[4.5rem] rounded-b-2xl overflow-hidden bg-[#FAF9F6] border border-[#E8E4DA]/70 shadow-soft hover:shadow-cardHover transition-all duration-400">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  priority={idx < 4}
                  className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out will-change-transform"
                />

                {cat.highlight && (
                  <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0B2D7F]/90 backdrop-blur-md text-white text-[9px] font-medium uppercase tracking-[0.15em] shadow-soft whitespace-nowrap">
                      Signature
                    </span>
                  </div>
                )}
              </div>

              {/* Minimalist Serif Title */}
              <div className="text-center px-1">
                <span className="text-xs md:text-sm font-serif italic text-[#0B2D7F] group-hover:text-[#4A7BC6] transition-colors line-clamp-1 tracking-wide">
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
