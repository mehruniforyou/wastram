'use client';

import React from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

export default function BestsellersShowcase() {
  const bestsellers = NISHORAMA_PRODUCTS.filter(
    p => p.badge?.includes('Bestseller') || p.badge?.includes('Export')
  ).slice(0, 4);

  return (
    <section className="w-full py-14 md:py-24 px-4 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-14">
        {/* Section Heading with Scroll Reveal */}
        <ScrollReveal direction="up" distance={20} duration={800}>
          <div className="flex flex-col items-center text-center">
            <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1.5 flex items-center gap-2">
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
              Signature Silhouettes &amp; Handcrafted Design
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.14em] uppercase text-[#0B2D7F]">
              Signature Atelier Creations
            </h2>
            <div className="w-16 h-[1.5px] gold-shimmer-line mt-3 rounded-full" />
          </div>
        </ScrollReveal>

        {/* 4-Podium Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {bestsellers.map((product, idx) => (
            <ScrollReveal
              key={product.id || idx}
              direction="up"
              distance={24}
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

        {/* Minimal Luxury Atelier Credentials Bar */}
        <ScrollReveal direction="up" distance={16} duration={750} delay={100}>
          <div className="w-full max-w-4xl mx-auto p-4 md:p-5 rounded-2xl bg-white shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border border-[#E8E4DA]/50">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-6 text-xs font-sans text-[#0B2D7F]/80">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#D4AF37]">&bull;</span>
                Flexible Batch MOQ 20 Pcs
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#D4AF37]">&bull;</span>
                Worldwide Doorstep Delivery
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#D4AF37]">&bull;</span>
                Bespoke Private Labelling
              </span>
            </div>

            <Link
              href="/pages/contact"
              className="px-6 py-2.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-[11px] font-sans font-medium uppercase tracking-[0.12em] shadow-soft shrink-0 hover:-translate-y-0.5"
            >
              Inquire for Boutiques &rarr;
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
