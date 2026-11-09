'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import Header from './Header';
import Footer from './Footer';
import StoryViewerModal from './StoryViewerModal';
import SearchModal from './SearchModal';
import QuickAddModal from './QuickAddModal';
import ProductCard from './ProductCard';

const PAGE_SIZE = 24;

export default function CollectionsCatalogue({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('featured');
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
    { id: 'short-long-kaftan', label: 'Kaftans' },
    { id: 'ethnic-wear-sets', label: 'Ethnic Wear Sets' },
    { id: 'tops-shirts', label: 'Tops & Shirts' },
    { id: 'cord-sets', label: 'Co-ord Sets' },
    { id: 'traditional-gowns', label: 'Traditional Gowns' },
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Header
        onOpenStory={() => setIsStoryOpen(true)}
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

      <div className="max-w-[1540px] w-full mx-auto px-4 md:px-8 py-8 md:py-12 flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#0B2D7F]/60 mb-6">
          <Link href="/" className="hover:text-[#0B2D7F] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#0B2D7F] font-medium capitalize">
            {selectedCategory === 'all' ? 'All Collections' : selectedCategory.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4">
          <div>
            <span className="font-serif italic text-base text-[#D4AF37] block mb-1">
              Curated Wholesale Edit
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-normal text-[#0B2D7F] uppercase tracking-wide">
              {selectedCategory === 'all' ? 'Signature Collections' : selectedCategory.replace(/-/g, ' ')}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Pills (Minimal luxury) */}
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

            {/* Sort By Dropdown (Soft shadow, no harsh border) */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium bg-white shadow-soft rounded-full px-4 py-2 text-[#0B2D7F] focus:outline-none cursor-pointer border-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#0B2D7F]/70">No styles found in this selection.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#0B2D7F] text-white text-xs font-medium uppercase tracking-wider shadow-soft"
            >
              View All Styles
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
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
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-8 py-3.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] text-xs font-medium uppercase tracking-[0.15em] shadow-soft hover:shadow-card transition-all"
                >
                  Load More Styles ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
