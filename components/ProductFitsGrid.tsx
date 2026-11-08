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
    { id: 'hoodies-sweatshirts', label: 'Hoodies & Sweatshirts' },
    { id: 't-shirts', label: 'T-Shirts' },
    { id: 'umbrella-dresses', label: 'Umbrella Dresses' },
    { id: 'short-long-kaftan', label: 'Short & Long Kaftan' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },
    { id: 'bestsellers', label: 'Export Bestsellers' },
    { id: 'maxi', label: 'Maxi Dresses' }
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
      if (activeTab === 'maxi') return p.title.includes('Maxi');
      if (activeTab === 'anarkali') return p.title.includes('Anarkali') || p.category === 'traditional-gowns';
      return p.tab === activeTab;
    }).slice(0, 16);
  }, [activeTab]);

  return (
    <section className="w-full py-6 md:py-10 px-2 md:px-6 bg-[#FAF9F6]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-4 md:gap-6">
        {/* TABS (Exact 4rem pill buttons) */}
        <div className="flex items-center justify-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar pb-1">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-5">
          {currentProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center pt-2">
          <Link
            href="/collections/shop-all"
            className="diwali-fit-button active uppercase tracking-wider text-center"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
}
