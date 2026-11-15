'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import ProductCard from '@/components/ProductCard';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import { CATEGORIES } from '@/data/categories';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialFilter = searchParams.get('filter') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'title'>('featured');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return NISHORAMA_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = CATEGORIES.find(
          (c) => c.slug === selectedCategory || c.id === selectedCategory
        );
        const targetName = catObj ? catObj.name.toLowerCase() : selectedCategory.toLowerCase();
        const prodCat = (product.category || '').toLowerCase();
        if (!prodCat.includes(targetName) && !targetName.includes(prodCat)) {
          return false;
        }
      }

      // Special Filter
      if (activeFilter === 'new' && product.badge !== 'NEW' && !product.new_arrival) {
        return false;
      }
      if (
        activeFilter === 'bestseller' &&
        product.badge !== 'BESTSELLER' &&
        product.tab !== 'best'
      ) {
        return false;
      }
      if (activeFilter === 'trending' && !product.trending && product.tab !== 'festive') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.title.toLowerCase().includes(q) ||
          (product.fabric && product.fabric.toLowerCase().includes(q)) ||
          (product.category && product.category.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.id || '').localeCompare(a.id || '');
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [selectedCategory, activeFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-28 pb-20">
        <div className="container-x">
          {/* Page Heading */}
          <div className="pt-8 md:pt-12 pb-8 border-b border-foreground/10">
            <div className="eyebrow mb-3">The Collection</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[0.95] text-foreground">
                  {selectedCategory === 'all'
                    ? 'All Silhouettes'
                    : CATEGORIES.find((c) => c.slug === selectedCategory)?.name ||
                      'Atelier Collection'}
                </h1>
                <p className="mt-3 text-sm text-foreground/70 max-w-xl font-body">
                  Curated wholesale catalogue crafted in Jaipur. Each piece is tailored
                  for export-grade quality, comfort, and commercial durability.
                </p>
              </div>

              <div className="text-xs uppercase tracking-wider text-foreground/60 font-body">
                Showing {filteredProducts.length} pieces
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-foreground/10">
            {/* Category Chips (Horizontal Scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveFilter('all');
                }}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'all' && activeFilter === 'all'
                    ? 'bg-foreground text-background font-semibold'
                    : 'border border-foreground/15 text-foreground/80 hover:border-foreground'
                }`}
              >
                All Departments
              </button>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setActiveFilter('all');
                  }}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-foreground text-background font-semibold'
                      : 'border border-foreground/15 text-foreground/80 hover:border-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort & Quick Filter */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/70">
                <ArrowUpDown size={13} />
                <span>Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border border-foreground/15 text-xs uppercase tracking-wider px-3 py-1.5 text-foreground outline-none cursor-pointer focus:border-foreground"
              >
                <option value="featured" className="bg-background text-foreground">
                  Featured
                </option>
                <option value="newest" className="bg-background text-foreground">
                  Newest
                </option>
                <option value="title" className="bg-background text-foreground">
                  Alphabetical
                </option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-8">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display text-2xl text-foreground">
                  No matching silhouettes found
                </p>
                <p className="text-sm text-foreground/60 mt-2 font-body">
                  Try clearing your filters or search query to browse our complete collection.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-6 btn-outline"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id || product.slug} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="eyebrow animate-pulse">Loading Collection...</div>
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
