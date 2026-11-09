'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';

export default function ProductFitsGrid() {
  const [activeTab, setActiveTab] = useState<string>('western-dresses');

  const tabs = [
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'denim-collection', label: 'Denim Collection' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'short-long-kaftan', label: 'Kaftans' },
    { id: 'hoodies-sweatshirts', label: 'Hoodies' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'bestsellers', label: 'Export Bestsellers' },
  ];

  const currentProducts = useMemo(() => {
    return NISHORAMA_PRODUCTS.filter(p => {
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
      if (activeTab === 'bestsellers') return p.badge.includes('Bestseller');
      return p.tab === activeTab;
    }).slice(0, 16);
  }, [activeTab]);

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-[1540px] mx-auto flex flex-col gap-8 md:gap-12">
        {/* Elegant Section Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1">
            Global Export Ready
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
            Featured Collections
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mt-3" />
        </div>

        {/* Minimal Luxury Filter Tabs (Soft shadows, border-free) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1 px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`diwali-fit-button whitespace-nowrap ${
                activeTab === tab.id ? 'active' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID: Desktop 4 columns, Mobile 2 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {currentProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>

        {/* Minimal Luxury View All Button */}
        <div className="flex justify-center pt-4">
          <Link
            href="/collections/shop-all"
            className="px-8 py-3.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-xs font-sans font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card cursor-pointer"
          >
            Explore All 1,400+ Styles &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
