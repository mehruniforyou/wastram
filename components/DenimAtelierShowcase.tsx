'use client';

import React from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

export default function DenimAtelierShowcase() {
  const spotlightDenim = NISHORAMA_PRODUCTS.filter(
    p => !(p as any).deleted && !(p as any).is_hidden && p.category === 'denim-collection'
  ).slice(0, 4);

  return (
    <section className="w-full py-12 md:py-20 px-3.5 sm:px-6 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
        {/* Split-Screen Studio Atelier Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Atmospheric Denim Campaign Poster Card (5 Cols) */}
          <ScrollReveal direction="left" distance={28} duration={800} className="lg:col-span-5 flex">
            <div className="relative rounded-3xl overflow-hidden shadow-soft bg-[#071F59] flex flex-col justify-between p-6 sm:p-8 md:p-12 text-white min-h-[380px] lg:min-h-[460px] w-full">
              {/* Background Campaign Image */}
              <img
                src="/denim-collection/IMG-20261102-WA0488.jpg.jpeg"
                alt="Denim Atelier Showcase"
                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071F59] via-[#0B2D7F]/70 to-[#0B2D7F]/40" />

              {/* Top Brand Badges */}
              <div className="relative z-10 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium tracking-[0.15em] uppercase text-white border border-white/25">
                  Atelier Series
                </span>
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/30 backdrop-blur-md text-[10px] font-medium tracking-[0.15em] uppercase text-[#F6C582] border border-[#D4AF37]/40">
                  100% Selvedge &amp; Flare
                </span>
              </div>

              {/* Center/Bottom Content */}
              <div className="relative z-10 flex flex-col gap-4 mt-auto pt-16">
                <div>
                  <span className="font-serif italic text-base md:text-lg text-[#D4AF37] block mb-1">
                    Artisanal Denim Craft
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal uppercase tracking-wide leading-[1.15] text-white drop-shadow-sm">
                    The Denim Atelier Edit
                  </h3>
                </div>

                <div className="pt-2">
                  <Link
                    href="/collections/denim-collection"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF9F6] text-[#0B2D7F] hover:bg-white transition-all text-xs font-sans font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card active:scale-98 cursor-pointer"
                  >
                    <span>Explore Denim Silhouettes</span>
                    <span className="text-xs">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Curated 4-Product Mini Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {spotlightDenim.map((product, idx) => (
              <ScrollReveal
                key={product.id || idx}
                direction="up"
                distance={20}
                duration={700}
                delay={idx * 60}
              >
                <ProductCard
                  product={product}
                  priority={idx < 2}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
