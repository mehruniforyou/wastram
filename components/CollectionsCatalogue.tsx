'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import Header from './Header';
import Footer from './Footer';
import SearchModal from './SearchModal';
import CartDrawer from './CartDrawer';
import SizeGuideModal from './SizeGuideModal';
import FloatingWhatsApp from './FloatingWhatsApp';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

const PAGE_SIZE = 24;

const CATEGORIES = [
  { id: 'all', label: 'All Collections', chapter: 'ALL CHAPTERS' },
  { id: 'cord-sets', label: 'Co-ord Sets', chapter: 'CHAPTER 01' },
  { id: 'ethnic-wear-sets', label: 'Kurta Sets', chapter: 'CHAPTER 02' },
  { id: 'western-dresses', label: 'Western Dresses', chapter: 'CHAPTER 03' },
  { id: 'short-long-kaftan', label: 'Kaftans', chapter: 'CHAPTER 04' },
  { id: 'tops-shirts', label: 'Tops & Shirts', chapter: 'CHAPTER 05' },
  { id: 'traditional-gowns', label: 'Gowns & Anarkalis', chapter: 'CHAPTER 06' },
  { id: 'umbrella-dresses', label: 'Umbrella Dresses', chapter: 'CHAPTER 07' },
  { id: 'denim-collection', label: 'Denim Collection', chapter: 'CHAPTER 08' },
  { id: 'under-1000', label: 'Everyday Tunics', chapter: 'ATELIER EDIT' },
];

const SIZES = ['All', 'S', 'M', 'L', 'XL', 'XXL'];

export default function CollectionsCatalogue({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [liveProducts, setLiveProducts] = useState<NishoramaProduct[]>(NISHORAMA_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Background fetch to ensure instant reflection of any Admin panel updates
  useEffect(() => {
    const loadCatalog = () => {
      fetch(`/api/products?t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          const prods = Array.isArray(data) ? data : data?.products || [];
          if (prods.length > 0) {
            setLiveProducts(prods);
          }
        })
        .catch(() => {});
    };

    loadCatalog();

    try {
      const ch1 = new BroadcastChannel('wastram_products_sync');
      const ch2 = new BroadcastChannel('ixos_products_sync');
      const onMsg = () => loadCatalog();
      ch1.onmessage = onMsg;
      ch2.onmessage = onMsg;
      return () => {
        ch1.close();
        ch2.close();
      };
    } catch (_) {}
  }, []);

  // Synchronize category state when initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Reset pagination when filter or sort changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, selectedSize, sortBy]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (typeof window !== 'undefined') {
      const targetUrl = catId === 'all' ? '/collections/shop-all' : `/collections/${catId}`;
      window.history.pushState(null, '', targetUrl);
    }
  };

  const filtered = useMemo(() => {
    let list = liveProducts.filter((p) => {
      if ((p as any).deleted || (p as any).is_hidden) return false;

      // Category matching
      if (selectedCategory !== 'all' && selectedCategory !== 'shop-all') {
        if (selectedCategory === 'under-1000') {
          if (p.category !== 'tops-shirts' && p.category !== 'western-dresses') return false;
        } else if (selectedCategory === 'western-dresses' || selectedCategory === 'dresses') {
          if (p.category !== 'western-dresses') return false;
        } else if (selectedCategory === 'denim-collection' || selectedCategory === 'denim' || selectedCategory === 'jeans') {
          if (p.category !== 'denim-collection') return false;
        } else if (
          selectedCategory === 'ethnic-wear-sets' ||
          selectedCategory === 'ethnic-wear' ||
          selectedCategory === 'ethnic-sets' ||
          selectedCategory === '3-piece-sets' ||
          selectedCategory === '3-piece' ||
          selectedCategory === 'sets'
        ) {
          if (p.category !== 'ethnic-wear-sets') return false;
        } else if (selectedCategory === 'umbrella-dresses' || selectedCategory === 'umbrella') {
          if (p.category !== 'umbrella-dresses') return false;
        } else if (
          selectedCategory === 'cord-sets' ||
          selectedCategory === 'co-ords' ||
          selectedCategory === 'co-ord-sets' ||
          selectedCategory === 'coord-sets' ||
          selectedCategory === 'cord-set'
        ) {
          if (p.category !== 'cord-sets') return false;
        } else if (selectedCategory === 'short-long-kaftan' || selectedCategory === 'kaftans' || selectedCategory === 'kaftan') {
          if (p.category !== 'short-long-kaftan') return false;
        } else if (
          selectedCategory === 'traditional-gowns' ||
          selectedCategory === 'gowns' ||
          selectedCategory === 'kurtis' ||
          selectedCategory === 'kurtas'
        ) {
          if (p.category !== 'traditional-gowns') return false;
        } else if (selectedCategory === 'tops-shirts' || selectedCategory === 'tops' || selectedCategory === 'shirts') {
          if (p.category !== 'tops-shirts') return false;
        } else if (selectedCategory === 'bestsellers' || selectedCategory === 'most-wanted') {
          if (!p.badge?.includes('Bestseller') && !p.is_featured) return false;
        } else if (p.category !== selectedCategory && p.tab !== selectedCategory) {
          return false;
        }
      }

      // Size matching
      if (selectedSize !== 'All') {
        const availableSizes = p.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
        if (!availableSizes.includes(selectedSize)) return false;
      }

      return true;
    });

    if (sortBy === 'newest') {
      list = [...list].reverse();
    }

    return list;
  }, [liveProducts, selectedCategory, selectedSize, sortBy]);

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
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const currentCategoryLabel =
    currentCategoryObj?.label ||
    (selectedCategory === 'all'
      ? 'All Collections'
      : selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));

  const activeChapter = currentCategoryObj?.chapter || 'COLLECTION EDIT';

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('All');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedSize !== 'All' || sortBy !== 'featured';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-neutral-900 selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-6 md:py-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections/shop-all" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-medium">
            {currentCategoryLabel}
          </span>
        </div>

        {/* Hero Section with Rajasthani Arch Motifs */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 p-6 sm:p-10 mb-8 shadow-2xs">
          <div className="max-w-2xl">
            <div className="section-pill mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
              <span>{activeChapter}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal">
              {currentCategoryLabel} &amp; <span className="text-[#D4AF37] italic font-normal">Jaipur Edits.</span>
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-ink-600 dark:text-neutral-300 font-sans leading-relaxed">
              Hand-block printed in Sanganer and tailored in our Jaipur workshop. Pure mulmul, cambric 60-60 cotton, and modal silks graded from S to XXL.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span>Handcrafted in Sanganer Atelier</span>
              <span>·</span>
              <span>Direct Boutique Sourcing</span>
              <span>·</span>
              <span>Low Batch MOQs</span>
            </div>
          </div>
        </div>

        {/* Category Switcher Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0B2D7F] text-white shadow-md shadow-[#0B2D7F]/20 font-semibold'
                  : 'bg-white dark:bg-neutral-900 border border-ink-200/80 dark:border-white/10 text-ink-800 dark:text-neutral-200 hover:border-[#0B2D7F] hover:text-[#0B2D7F] dark:hover:border-[#D4AF37] dark:hover:text-[#D4AF37]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* The Baisa Horizontal Filter Pill Bar (Size, Price, Sort) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 mb-8 shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-ink-600 dark:text-neutral-400 mr-1">
              <SlidersHorizontal size={14} />
              <span>Filters:</span>
            </div>

            {/* Size Dropdown */}
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="appearance-none text-xs font-medium bg-[#FFFEFE] dark:bg-neutral-800 border border-ink-200 dark:border-white/10 rounded-full pl-3 pr-7 py-1.5 text-ink-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {SIZES.map((sz) => (
                  <option key={sz} value={sz}>
                    Size: {sz}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500" />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 transition-colors"
              >
                <span>Clear</span>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-500 dark:text-neutral-400 hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none text-xs font-medium bg-[#FFFEFE] dark:bg-neutral-800 border border-ink-200 dark:border-white/10 rounded-full pl-3 pr-7 py-1.5 text-ink-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Atelier Styles</option>
                <option value="newest">New Releases</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500" />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-ink-100 dark:border-white/5 my-8">
            <h3 className="font-serif text-2xl text-ink-950 dark:text-white font-normal">
              No matching pieces found
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-ink-600 dark:text-neutral-400 max-w-md mx-auto">
              We couldn't find any designs matching the current size and price filters.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-6 px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-medium transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {visibleProducts.map((product, i) => (
              <ScrollReveal
                key={product.id}
                direction="up"
                delay={(i % 4) * 60}
                duration={750}
              >
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="h-10 mt-8" />

        {/* Bottom Sanganer Buying Advice & Craft Accordions */}
        <div className="mt-20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-sans text-neutral-700 dark:text-neutral-300">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white mb-2">
              Choosing Your Fit (S to XXL)
            </h4>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
              All Wastram garments are graded to Indian body measurements with 2–3 inches of ease. If you are between sizes, we recommend sizing up for cotton pieces.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white mb-2">
              Sanganer Handblock Care
            </h4>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
              For initial washes, hand wash separately in cold water with mild detergent. Dry in the shade to maintain the vivid brilliance of natural vegetable pigments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white mb-2">
              Custom Necklines &amp; Lengths
            </h4>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
              Need custom sleeve length, feeding zippers, or an ankle-length hem? Chat with our master tailor on WhatsApp for complimentary customizations.
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <SizeGuideModal />
      <FloatingWhatsApp />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
