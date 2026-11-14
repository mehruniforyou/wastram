'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'Ethnic Wear Sets',
      image: '/images/categories/cat-ethnic-wear-sets-editorial.webp',
      href: '/collections/ethnic-wear-sets',
      highlight: true
    },
    {
      title: 'Western Dresses',
      image: '/images/categories/cat-western-dresses-editorial.webp',
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
    },
    {
      title: 'Hoodies & Sweatshirts',
      image: '/images/categories/cat-hoodies-sweatshirts.webp',
      href: '/collections/hoodies-sweatshirts',
      highlight: false
    },
    {
      title: 'T-Shirts',
      image: '/images/categories/cat-t-shirts.webp',
      href: '/collections/t-shirts',
      highlight: false
    }
  ];

  return (
    <section className="w-full py-14 md:py-24 px-4 md:px-8 bg-[#FAF9F6] relative overflow-hidden">
      {/* Delicate background ambient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FAF5E6]/40 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-14 relative z-10">
        {/* Architectural Section Heading with Scroll Reveal */}
        <ScrollReveal direction="up" distance={20} duration={800}>
          <div className="flex flex-col items-center text-center">
            <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1.5 flex items-center gap-2">
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
              Handcrafted Jaipuri Artistry
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.14em] uppercase text-[#0B2D7F]">
              Curated Silhouettes
            </h2>
            {/* Animated Golden Thread Shimmer Line */}
            <div className="w-16 h-[1.5px] gold-shimmer-line mt-3 rounded-full" />
          </div>
        </ScrollReveal>

        {/* 10 Arched Luxury Portals Grid: 5 columns x 2 rows on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
          {categories.map((cat, idx) => (
            <ScrollReveal
              key={cat.href || idx}
              direction="up"
              distance={24}
              delay={idx * 55}
              duration={700}
            >
              <Link
                href={cat.href}
                className="group flex flex-col items-center gap-3 transition-transform duration-400 cursor-pointer select-none"
              >
                {/* Arched Architectural Portal Frame */}
                <div className="relative aspect-[3/4.2] w-full rounded-t-[3.5rem] md:rounded-t-[4.5rem] rounded-b-2xl overflow-hidden bg-[#FAF9F6] border border-[#E8E4DA]/80 shadow-soft group-hover:shadow-[0_16px_36px_rgba(11,45,127,0.12)] group-hover:border-[#D4AF37]/60 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    priority={idx < 5}
                    className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out will-change-transform"
                  />

                  {/* Signature Luxury Tag */}
                  {cat.highlight && (
                    <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10 animate-float-gentle">
                      <span className="px-3 py-0.5 rounded-full bg-[#0B2D7F]/95 backdrop-blur-md text-[#FAF9F6] text-[9px] font-medium uppercase tracking-[0.16em] shadow-soft border border-[#D4AF37]/40 whitespace-nowrap">
                        Signature
                      </span>
                    </div>
                  )}

                  {/* Soft architectural arch inner rim lighting on hover */}
                  <div className="absolute inset-0 rounded-t-[3.5rem] md:rounded-t-[4.5rem] rounded-b-2xl border border-transparent group-hover:border-white/40 transition-colors pointer-events-none" />
                </div>

                {/* Minimalist Serif Title */}
                <div className="text-center px-1">
                  <span className="text-xs md:text-sm font-serif italic text-[#0B2D7F] group-hover:text-[#4A7BC6] group-hover:tracking-wider transition-all duration-300 line-clamp-1 tracking-wide">
                    {cat.title}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
