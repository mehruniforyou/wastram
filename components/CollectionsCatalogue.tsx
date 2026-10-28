'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import Header from './Header';
import Footer from './Footer';
import PopularSearches from './PopularSearches';
import MobileNavDrawer from './MobileNavDrawer';
import StoryViewerModal from './StoryViewerModal';
import SearchModal from './SearchModal';
import QuickAddModal from './QuickAddModal';
import { useCart } from '@/context/CartContext';

export default function CollectionsCatalogue({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<NishoramaProduct | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const { toggleWishlist, isWishlisted, openTapAndView } = useCart();

  const categories = [
    { id: 'all', label: 'Shop All' },
    { id: 'kurtis', label: 'Kurtis' },
    { id: 'sets', label: 'Sets' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'dresses', label: 'Dresses' }
  ];

  let filtered = selectedCategory === 'all'
    ? NISHORAMA_PRODUCTS
    : NISHORAMA_PRODUCTS.filter(p => p.category === selectedCategory || p.tab === selectedCategory);

  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.salePrice - b.salePrice);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.salePrice - a.salePrice);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-archivo">
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <StoryViewerModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <QuickAddModal
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
      <div className="max-w-[1400px] w-full mx-auto px-2.5 md:px-6 py-6 md:py-10 flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-black/50 mb-4">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-[#482922] font-semibold capitalize">
            {selectedCategory === 'all' ? 'All Collections' : selectedCategory}
          </span>
        </div>

        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-black/10">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#482922] uppercase tracking-tight">
              {selectedCategory === 'all' ? 'Signature Collections' : selectedCategory}
            </h1>
            <p className="text-xs text-black/60 mt-1">
              Showing {filtered.length} exclusive styles handcrafted for global fashion lovers
            </p>
          </div>

          {/* Category Filter Pills (Exact 4rem roundness) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`diwali-fit-button whitespace-nowrap ${
                  selectedCategory === cat.id ? 'active' : ''
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-black/60 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-white border border-[#D5D5D5] rounded-full px-3 py-1.5 text-[#482922] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid: Desktop 4-col, Mobile 2-col */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-black/60">No styles found in this selection.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-6 py-2 rounded-full bg-[#482922] text-[#F6C582] text-xs font-bold uppercase"
            >
              View All Styles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 lg:gap-5">
            {filtered.map(product => {
              const isHovered = hoveredProduct === product.id;
              const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];
              const wishlisted = isWishlisted(product.slug);

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group relative flex flex-col bg-transparent"
                >
                  {/* Image Container with Exact Nishorama Roundness */}
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

                    {/* Top Right: Wishlist & Tap & View Buttons */}
                    <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 z-10 flex flex-col gap-1.5">
                      {/* Official Bookmark Wishlist Button */}
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

                      {/* Tap & View Button */}
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
                  </div>

                  {/* Card Info */}
                  <div className="pt-2 md:pt-2.5 pb-1 flex flex-col justify-between flex-1 gap-1">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex flex-col flex-1">
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-archivo font-bold text-[2.8vw] md:text-[0.85vw] text-[#482922] hover:text-[#FF2F00] transition-colors line-clamp-1 leading-snug uppercase tracking-tight"
                        >
                          {product.title}
                        </Link>

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
        )}
      </div>

      <QuickAddModal
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />

      <Footer />
      <PopularSearches />
    </div>
  );
}
