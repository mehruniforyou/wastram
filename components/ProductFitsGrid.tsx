'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

export default function ProductFitsGrid() {
  const [activeTab, setActiveTab] = useState<string>('western-dresses');

  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses', count: '15 Styles' },
    { id: 'denim-collection', label: 'Denim Collection', count: '9 Styles' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets', count: '9 Styles' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses', count: '9 Styles' },
    { id: 'cord-sets', label: 'Co-ord Sets', count: '9 Styles' },
    { id: 'short-long-kaftan', label: 'Kaftans', count: '9 Styles' },
    { id: 'traditional-gowns', label: 'Traditional Gowns', count: '12 Styles' },
    { id: 'tops-shirts', label: 'Tops & Shirts', count: '9 Styles' },
    { id: 'hoodies-sweatshirts', label: 'Hoodies', count: '9 Styles' },
  ];

  const currentProducts = useMemo(() => {
    return NISHORAMA_PRODUCTS.filter(p => {
      if ((p as any).deleted || (p as any).is_hidden) return false;
      if (activeTab === 'all') return true;
      if (activeTab === 'western-dresses') return p.category === 'western-dresses';
      if (activeTab === 'denim-collection') return p.category === 'denim-collection';
      if (activeTab === 'hoodies-sweatshirts') return p.category === 'hoodies-sweatshirts';
      if (activeTab === 't-shirts') return p.category === 't-shirts';
      if (activeTab === 'umbrella-dresses') return p.category === 'umbrella-dresses';
      if (activeTab === 'short-long-kaftan') return p.category === 'short-long-kaftan';
      if (activeTab === 'ethnic-wear-sets') return p.category === 'ethnic-wear-sets';
      if (activeTab === 'tops-shirts') return p.category === 'tops-shirts';
      if (activeTab === 'cord-sets') return p.category === 'cord-sets';
      if (activeTab === 'traditional-gowns') return p.category === 'traditional-gowns';
      return p.category === activeTab || p.tab === activeTab;
    }).slice(0, 16);
  }, [activeTab]);

  return (
    <section className="w-full py-12 md:py-20 px-3.5 sm:px-6 md:px-8 bg-[#FAF9F6] border-t border-[#0B2D7F]/5">
      <div className="max-w-[1540px] mx-auto flex flex-col gap-8 md:gap-12">
        {/* Section Heading with Technical Minimalist Spec */}
        <ScrollReveal direction="up" distance={20} duration={800}>
          <div className="flex flex-col items-center text-center">
            <span className="text-[9.5px] sm:text-[10px] font-mono tracking-[0.25em] text-[#0B2D7F]/60 uppercase mb-2">
              JAIPUR ATELIER SPECIFICATION // 26.9124° N, 75.7873° E
            </span>
            <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1 flex items-center gap-2">
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
              Artisanal Curation
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.14em] uppercase text-[#0B2D7F]">
              Featured Collections
            </h2>
            <div className="w-16 h-[1.5px] gold-shimmer-line mt-3 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Minimalist Filter Tabs with smooth horizontal touch scroll */}
        <ScrollReveal direction="up" distance={16} duration={700} delay={100}>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 sm:justify-center">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`diwali-fit-button whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-60 font-mono tracking-tight">[{tab.count}]</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* PRODUCT GRID: Desktop 4 columns, Mobile 2 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {currentProducts.map((product, idx) => (
            <ScrollReveal
              key={product.id}
              direction="up"
              distance={20}
              duration={650}
              delay={Math.min(idx * 35, 210)}
            >
              <ProductCard
                product={product}
                priority={idx < 4}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Minimal Luxury View All Button */}
        <ScrollReveal direction="up" distance={16} duration={700} delay={100}>
          <div className="flex justify-center pt-4">
            <Link
              href="/collections/shop-all"
              className="px-8 py-3.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-xs font-sans font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card cursor-pointer inline-flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Explore All 99 Master Silhouettes &amp; 1,400+ Colorways</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
