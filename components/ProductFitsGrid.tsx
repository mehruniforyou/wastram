'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';

export default function ProductFitsGrid() {
  const [activeTab, setActiveTab] = useState<string>('ethnic-wear-sets');

  const tabs = [
    { id: 'ethnic-wear-sets', label: 'Kurta Suit Sets' },
    { id: 'umbrella-dresses', label: 'Anarkalis & Kalidars' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'short-long-kaftan', label: 'Artisanal Kaftans' },
    { id: 'western-dresses', label: 'Western Dresses' },
    { id: 'denim-collection', label: 'Denim Atelier' },
    { id: 'bestsellers', label: 'Bestsellers' },
  ];

  const currentProducts = useMemo(() => {
    return NISHORAMA_PRODUCTS.filter((p) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'ethnic-wear-sets') return p.category === 'ethnic-wear-sets';
      if (activeTab === 'umbrella-dresses') return p.category === 'umbrella-dresses';
      if (activeTab === 'cord-sets') return p.category === 'cord-sets';
      if (activeTab === 'short-long-kaftan') return p.category === 'short-long-kaftan';
      if (activeTab === 'western-dresses') return p.category === 'western-dresses';
      if (activeTab === 'denim-collection') return p.category === 'denim-collection';
      if (activeTab === 'bestsellers') return p.badge?.toLowerCase().includes('bestseller') || p.badge?.toLowerCase().includes('signature');
      return p.category === activeTab;
    }).slice(0, 12);
  }, [activeTab]);

  const handleWhatsAppCustomOrder = () => {
    window.open(
      'https://wa.me/918003088838?text=Hello%20Wastram%20Jaipur,%20I%20have%20a%20custom%20boutique%20or%20export%20inquiry.%20Please%20connect%20me%20with%20your%20Master%20Merchandiser.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#FFFEFE] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-10 sm:gap-14">
        {/* Section Header Matching Gulmohar Jaipur */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="text-[11px] sm:text-[12px] font-jost uppercase tracking-[0.22em] text-[#0B2D7F] font-semibold">
              Atelier Runway
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-jost font-normal text-[#071F59] uppercase tracking-[0.08em] mb-2">
            New Arrivals &amp; Festive Drops
          </h2>

          <p className="text-xs sm:text-sm font-jost text-[#555555] max-w-xl tracking-wide">
            Over 1,400+ Handcrafted Silhouettes • Direct Loom Sourcing • Instant WhatsApp B2B Quotes
          </p>

          {/* Decorative Gold Shimmer Accent Line */}
          <div className="w-20 h-[1.5px] gold-shimmer-line mt-3 rounded-full" />
        </div>

        {/* Animated Interactive Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-4 sm:mx-0 px-4 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-jost uppercase tracking-[0.1em] font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#071F59] text-white shadow-md shadow-[#071F59]/20 scale-102'
                    : 'bg-white text-[#071F59] hover:bg-[#FFFEFE] hover:text-[#0B2D7F] border border-[#0B2D7F]/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4-to-5 Column Product Grid (2-Column on Mobile matching Gulmohar) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-7 animate-fade-slide">
          {currentProducts.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} priority={idx < 4} />
          ))}
        </div>

        {/* B2B Wholesale Banner Action */}
        <div className="mt-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#071F59] via-[#0B2D7F] to-[#071F59] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevated border border-[#D4AF37]/30">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[10px] sm:text-[11px] font-jost uppercase tracking-[0.24em] text-[#D4AF37] font-semibold mb-1">
              Direct Manufacturer • Sanganer Textile Hub
            </span>
            <h3 className="text-lg sm:text-2xl font-jost uppercase tracking-[0.06em] font-normal text-white">
              Need Custom Quantities, Colors or Private Labelling?
            </h3>
            <p className="text-xs sm:text-sm font-jost text-white/80 mt-1">
              Connect directly with our Master Production Merchandiser on WhatsApp for line sheets &amp; factory rates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleWhatsAppCustomOrder}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white font-jost font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.228-.588-1.782-.751-2.906-2.559-2.996-2.678-.088-.119-.716-.954-.716-1.821 0-.867.453-1.294.614-1.467.161-.173.351-.216.468-.216.117 0 .234.002.336.007.108.005.253-.041.395.3.144.347.491 1.196.533 1.282.042.086.07.187.014.3-.056.113-.085.183-.17.283-.085.1-.179.224-.256.3-.085.085-.174.178-.075.348.099.17.439.723.942 1.172.646.577 1.191.756 1.361.841.17.085.27.071.37-.044.1-.115.428-.499.542-.67.114-.171.228-.143.385-.085.157.057.994.469 1.165.555.171.085.285.128.328.2.043.072.043.418-.101.823z" />
              </svg>
              <span>Chat with Merchandiser</span>
            </button>

            <Link
              href="/collections/shop-all"
              className="hidden lg:inline-flex px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-jost font-semibold text-xs uppercase tracking-[0.12em] border border-white/20 transition-all"
            >
              View Full Index
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
