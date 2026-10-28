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
  const [cardImageIndex, setCardImageIndex] = useState<{ [id: string]: number }>({});

  const { toggleWishlist, isWishlisted, openTapAndView } = useCart();

  const tabs: { id: 'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted'; label: string }[] = [
    { id: 'under-999', label: 'UNDER ₹999' },
    { id: 'festive-sets', label: 'Festive Sets' },
    { id: 'upto-50', label: 'UPTO 50%' },
    { id: 'most-wanted', label: 'Most Wanted' }
  ];

  const currentProducts = NISHORAMA_PRODUCTS.filter(p => p.tab === activeTab);

  const handleNextImage = (e: React.MouseEvent, productId: string, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCardImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (e: React.MouseEvent, productId: string, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCardImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <section className="w-full py-6 md:py-10 px-2 md:px-6 bg-[#F5F5F5]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-4 md:gap-6">
        {/* TABS (Exact Nishorama 4rem pill buttons) */}
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
          {currentProducts.map(product => {
            const isHovered = hoveredProduct === product.id;
            const currentImgIdx = cardImageIndex[product.id] || 0;
            const displayImage = product.images[currentImgIdx] || product.images[0];
            const wishlisted = isWishlisted(product.slug);

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative flex flex-col bg-transparent"
              >
                {/* Image Media Container */}
                <div className="relative aspect-[400/700] md:aspect-[400/680] w-full bg-[#EEEEEE] rounded-[4vw] md:rounded-[1vw] overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <img
                      src={displayImage}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* Sale Badge Pill */}
                  <div className="cust-badges-wrapper absolute top-2 left-2 md:top-2.5 md:left-2.5 z-10">
                    <span className="cust-sale-badge">
                      {product.badge}
                    </span>
                  </div>

                  {/* Top Right: Wishlist & Tap-and-View buttons */}
                  <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 z-10 flex flex-col gap-1.5">
                    {/* Official Nishorama Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.slug);
                      }}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white flex items-center justify-center text-[#482922] transition-transform active:scale-90"
                      aria-label="Save to wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="16"
                        viewBox="0 0 12.39 18.53"
                        className={`transition-all duration-300 ${
                          wishlisted
                            ? 'fill-[#FF2F00] text-[#FF2F00] animate-heart-bounce'
                            : 'fill-none stroke-current'
                        }`}
                      >
                        <path
                          id="savewishlist"
                          strokeWidth="1.2"
                          d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
                        />
                      </svg>
                    </button>

                    {/* Tap & View Quick Lightbox Trigger Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openTapAndView(product);
                      }}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white flex items-center justify-center text-[#482922] transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
                      title="Tap & View Lightbox"
                      aria-label="Tap and View"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </button>
                  </div>

                  {/* Swiper Arrow Controls (Appear on hover for products with multiple angles) */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handlePrevImage(e, product.id, product.images.length)}
                        className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/70 backdrop-blur-md shadow-sm items-center justify-center text-[#482922] transition-all ${
                          isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
                        }`}
                        aria-label="Previous photo"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleNextImage(e, product.id, product.images.length)}
                        className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/70 backdrop-blur-md shadow-sm items-center justify-center text-[#482922] transition-all ${
                          isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
                        }`}
                        aria-label="Next photo"
                      >
                        ›
                      </button>

                      {/* Pagination Dots */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                        {product.images.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`h-1 rounded-full transition-all ${
                              currentImgIdx === dotIdx ? 'w-3 bg-white' : 'w-1 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Card Information: Title, Price & Quick Add Button */}
                <div className="pt-2 md:pt-2.5 pb-1 flex flex-col justify-between flex-1 gap-1">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex flex-col flex-1">
                      {/* Product Title */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-archivo font-bold text-[2.8vw] md:text-[0.85vw] text-[#482922] hover:text-[#FF2F00] transition-colors line-clamp-1 leading-snug uppercase tracking-tight"
                      >
                        {product.title}
                      </Link>

                      {/* Price Line */}
                      <div className="flex items-center gap-1.5 mt-0.5 font-archivo">
                        <span className="text-[2.4vw] md:text-[0.75vw] line-through text-black/50">
                          ₹ {product.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#FF2F00]">
                          ₹ {product.salePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Pill Button */}
                    <button
                      type="button"
                      onClick={() => setQuickAddProduct(product)}
                      className="px-2.5 md:px-3 py-1 md:py-1 rounded-full border border-[#482922] bg-white text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold transition-all flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-2xs"
                    >
                      <span className="font-bold">+</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Quick Add Size Modal */}
      <QuickAddModal
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
    </section>
  );
}
