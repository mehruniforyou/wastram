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

  const { toggleWishlist, isWishlisted } = useCart();

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
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

      {/* Collection Title Banner */}
      <div className="w-full bg-white border-b border-black/10 py-6 md:py-10 text-center font-archivo">
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-black/50 font-bold">
          NISHORAMA COLLECTIONS
        </span>
        <h1 className="text-2xl md:text-4xl font-black text-[#482922] uppercase tracking-tight mt-1">
          {categories.find(c => c.id === selectedCategory)?.label || 'Shop All'}
        </h1>
        <p className="text-xs text-black/60 mt-1">
          Showing {filtered.length} curated designs
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-archivo text-xs border-b border-black/5">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#482922] text-[#F6C582] font-semibold shadow-sm'
                  : 'bg-white text-black/70 border border-black/15 hover:border-black/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-black/50">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-white border border-black/15 text-[#482922] font-medium focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl w-full mx-auto px-3 md:px-8 py-8 flex-1">
        {filtered.length === 0 ? (
          <div className="py-24 text-center font-archivo text-black/50">
            <p className="text-sm">No styles currently found in this collection.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-3 text-xs underline font-semibold text-[#482922]"
            >
              View all products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {filtered.map(product => {
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
