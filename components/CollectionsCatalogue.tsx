'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import Header from './Header';
import Footer from './Footer';
import PopularSearches from './PopularSearches';
import MobileNavDrawer from './MobileNavDrawer';
import StoryViewerModal from './StoryViewerModal';
import SearchModal from './SearchModal';
import QuickAddModal from './QuickAddModal';
import ProductCard from './ProductCard';

const PAGE_SIZE = 24;

export default function CollectionsCatalogue({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<NishoramaProduct | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { id: 'all', label: 'All Collections' },
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
    { id: 'maxi', label: 'Maxi Dresses' },
    { id: 'anarkali-gowns', label: 'Anarkali Gowns' },
    { id: 'tiered', label: 'Tiered & Flared' }
  ];

  // Reset pagination when category or sort changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, sortBy]);

  const filtered = useMemo(() => {
    let list = NISHORAMA_PRODUCTS.filter(p => {
      if (selectedCategory === 'all' || selectedCategory === 'shop-all') return true;
      if (selectedCategory === 'western-dresses') return p.category === 'western-dresses';
      if (selectedCategory === 'denim-collection' || selectedCategory === 'denim' || selectedCategory === 'jeans') return p.category === 'denim-collection';
      if (selectedCategory === 'hoodies-sweatshirts' || selectedCategory === 'hoodies' || selectedCategory === 'sweatshirts' || selectedCategory === 'hoodie') return p.category === 'hoodies-sweatshirts';
      if (selectedCategory === 't-shirts' || selectedCategory === 'tshirts' || selectedCategory === 'tee') return p.category === 't-shirts';
      if (selectedCategory === 'umbrella-dresses' || selectedCategory === 'umbrella') return p.category === 'umbrella-dresses';
      if (selectedCategory === 'short-long-kaftan' || selectedCategory === 'kaftans' || selectedCategory === 'kaftan') return p.category === 'short-long-kaftan';
      if (selectedCategory === 'ethnic-wear-sets' || selectedCategory === 'ethnic-sets' || selectedCategory === '3-piece') return p.category === 'ethnic-wear-sets';
      if (selectedCategory === 'tops-shirts' || selectedCategory === 'tops' || selectedCategory === 'shirts') return p.category === 'tops-shirts';
      if (selectedCategory === 'cord-sets' || selectedCategory === 'cord-set') return p.category === 'cord-sets';
      if (selectedCategory === 'traditional-gowns') return p.category === 'traditional-gowns';
      if (selectedCategory === 'anarkali-gowns') return p.category === 'traditional-gowns' || p.title.includes('Anarkali');
      if (selectedCategory === 'maxi' || selectedCategory === 'maxi-dresses') return p.title.includes('Maxi');
      if (selectedCategory === 'midi' || selectedCategory === 'midi-dress') return p.title.includes('Midi');
      if (selectedCategory === 'slip') return p.title.includes('Slip') || p.title.includes('Halter');
      if (selectedCategory === 'tiered') return p.title.includes('Tiered') || p.title.includes('Wrap') || p.title.includes('Flared');
      if (selectedCategory === 'most-wanted') return p.badge.includes('Bestseller');
      return p.category === selectedCategory || p.tab === selectedCategory;
    });

    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.salePrice - a.salePrice);
    }

    return list;
  }, [selectedCategory, sortBy]);

  const visibleProducts = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  // Infinite Scroll Observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filtered.length));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] font-archivo">
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
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
          <span className="text-[#0B2D7F] font-semibold capitalize">
            {selectedCategory === 'all' ? 'All Collections' : selectedCategory}
          </span>
        </div>

        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-black/10">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#0B2D7F] uppercase tracking-tight">
              {selectedCategory === 'all' ? 'Signature Collections' : selectedCategory}
            </h1>
            <p className="text-xs text-black/60 mt-1">
              Showing {visibleProducts.length} of {filtered.length} exclusive styles handcrafted for global fashion lovers
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
              className="text-xs font-semibold bg-white border border-[#D5D5D5] rounded-full px-3 py-1.5 text-[#0B2D7F] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-black/60">No styles found in this selection.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-6 py-2 rounded-full bg-[#0B2D7F] text-[#FAF9F6] text-xs font-bold uppercase"
            >
              View All Styles
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 lg:gap-5">
              {visibleProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx < 4}
                />
              ))}
            </div>

            {/* Infinite Scroll Trigger Sentinel */}
            <div ref={sentinelRef} className="h-10 w-full" />

            {/* Load More Button */}
            {visibleCount < filtered.length && (
              <div className="flex flex-col items-center justify-center gap-2 py-8">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-8 py-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] font-archivo text-xs font-bold uppercase tracking-wider shadow-navy border border-[#D4AF37]/40 transition-all hover:scale-102 active:scale-98"
                >
                  Load More Styles ({filtered.length - visibleCount} remaining)
                </button>
                <span className="text-[11px] text-black/50">
                  Showing {visibleProducts.length} of {filtered.length} styles
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
      <PopularSearches />
    </div>
  );
}
