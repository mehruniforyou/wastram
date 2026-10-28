'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import QuickAddModal from './QuickAddModal';
import { useCart } from '@/context/CartContext';

export default function ProductFitsGrid() {
  const [activeTab, setActiveTab] = useState<'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted'>('under-999');
  const [quickAddProduct, setQuickAddProduct] = useState<NishoramaProduct | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { toggleWishlist, isWishlisted } = useCart();

  const tabs: { id: 'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted'; label: string }[] = [
    { id: 'under-999', label: 'UNDER ₹999' },
    { id: 'festive-sets', label: 'Festive Sets' },
    { id: 'upto-50', label: 'UPTO 50%' },
    { id: 'most-wanted', label: 'Most Wanted' }
  ];

  const currentProducts = NISHORAMA_PRODUCTS.filter(p => p.tab === activeTab);

  return (
    <section className="w-full py-8 md:py-12 px-3 md:px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* TABS */}
        <div className="flex items-center justify-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-archivo font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#482922] text-[#F6C582] border border-[#F6C582] shadow-sm'
                  : 'bg-white text-black/70 border border-[#D5D5D5] hover:border-black/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {currentProducts.map(product => {
            const isHovered = hoveredProduct === product.id;
            const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];
            const wishlisted = isWishlisted(product.slug);

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-all"
              >
                {/* Media Container */}
                <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <img
                      src={displayImage}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* Discount Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-white/95 text-[#FF2F00] font-archivo font-black text-[10px] md:text-xs px-2 py-0.5 rounded shadow-sm border border-[#FF2F00]/20">
                    {product.badge}
                  </span>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.slug);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#482922] shadow-sm transition-transform active:scale-90"
                    aria-label="Save to wishlist"
                  >
                    <svg
                      className="w-4 h-4"
                      fill={wishlisted ? '#FF2F00' : 'none'}
                      stroke={wishlisted ? '#FF2F00' : 'currentColor'}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-3 md:p-4 flex flex-col justify-between flex-1 gap-2">
                  <div className="flex flex-col">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs md:text-sm font-medium font-archivo text-[#482922] hover:text-[#FF2F00] transition-colors line-clamp-1"
                    >
                      {product.title}
                    </Link>

                    <div className="flex items-center gap-2 mt-1 font-archivo">
                      <span className="text-[11px] md:text-xs line-through text-black/40">
                        ₹ {product.regularPrice.toLocaleString()}
                      </span>
                      <span className="text-xs md:text-sm font-bold text-[#FF2F00]">
                        ₹ {product.salePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => setQuickAddProduct(product)}
                    className="w-full mt-1 py-1.5 md:py-2 px-3 rounded-full border border-black/15 hover:border-[#482922] hover:bg-[#482922] hover:text-white text-[#482922] font-archivo text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>+</span>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-4">
          <Link
            href="/collections/shop-all"
            className="px-8 py-3 rounded-full bg-[#482922] hover:bg-[#38201a] text-[#F6C582] border border-[#F6C582] font-archivo font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
    </section>
  );
}
