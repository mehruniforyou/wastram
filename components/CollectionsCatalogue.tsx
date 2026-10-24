'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MessageCircle, Eye, X, ArrowRight, Sparkles } from 'lucide-react';
import { products, Product } from '@/data/products';
import { categories } from '@/data/categories';
import { buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function CollectionsCatalogue() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>('default');

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        p.categoryId === selectedCategory ||
        p.categorySlug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'sku') return a.sku.localeCompare(b.sku);
      return 0; // default order
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="space-y-3 mb-8">
          <nav className="flex items-center space-x-2 text-xs text-charcoal-muted">
            <Link href="/" className="hover:text-navy transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy font-semibold">Collections Catalogue</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy tracking-tight">
                Wholesale Product Catalogue
              </h1>
              <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
                Explore our comprehensive collection of Indian women's wear available for international boutique wholesale and bulk manufacturing.
              </p>
            </div>

            <div className="text-xs text-navy font-mono bg-ivory px-3.5 py-1.5 rounded-full border border-gray-200 self-start md:self-auto">
              Showing <span className="font-bold">{filteredProducts.length}</span> of {products.length} Designs
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-ivory/60 p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, SKU (e.g. WST-SET), or fabric (e.g. Chanderi, Cotton)..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-charcoal placeholder:text-gray-400 focus:outline-hidden focus:border-navy focus:ring-1 focus:ring-navy"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sortSelect" className="text-xs font-semibold text-charcoal-muted uppercase whitespace-nowrap">
                Sort:
              </label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-charcoal py-2.5 px-3 focus:outline-hidden focus:border-navy"
              >
                <option value="default">Featured First</option>
                <option value="name-asc">Product Name (A-Z)</option>
                <option value="name-desc">Product Name (Z-A)</option>
                <option value="sku">Style Reference (SKU)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-white text-charcoal hover:bg-blush-50 border border-gray-200'
              }`}
            >
              All Categories ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-white text-charcoal hover:bg-blush-50 border border-gray-200'
                }`}
              >
                {cat.name} ({cat.itemCount})
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const whatsappUrl = buildWhatsAppLink(
                whatsappMessages.product(product.name, product.sku, product.categoryName)
              );

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-subtle hover:shadow-card-hover transition-all duration-300"
                >
                  {/* Image Container */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-ivory block"
                    aria-label={`View details for ${product.name}`}
                  >
                    <Image
                      src={product.image}
                      alt={`${product.name} - ${product.fabric} Indian Women's Wear`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* SKU badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-navy text-[11px] font-mono font-medium px-2 py-0.5 rounded-md border border-gray-200">
                      {product.sku}
                    </div>

                    {/* Fabric pill */}
                    <div className="absolute top-3 right-3 bg-navy/85 backdrop-blur-xs text-gold text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {product.fabric}
                    </div>

                    {/* Quick view hover button */}
                    <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 bg-white text-navy px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-gold" />
                        <span>View Details</span>
                      </span>
                    </div>
                  </Link>

                  {/* Product Information */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-blush-500 uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                      <Link
                        href={`/products/${product.slug}`}
                        className="block text-sm font-serif font-bold text-navy hover:text-gold transition-colors mt-0.5 line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-charcoal-muted mt-1">
                        Sizes: <span className="font-medium text-charcoal">{product.sizes.join(', ')}</span>
                      </p>
                    </div>

                    {/* Action button */}
                    <div className="pt-2 border-t border-gray-100">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-700 text-white py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-xs group/btn"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-gold fill-gold/20 group-hover/btn:scale-110 transition-transform" />
                        <span>Enquire About This Design</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty / No Results State */
          <div className="bg-ivory/50 rounded-2xl border border-gray-200 p-12 text-center space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-blush-100 flex items-center justify-center mx-auto text-navy">
              <Search className="w-8 h-8 text-navy" />
            </div>
            <h3 className="text-xl font-serif font-bold text-navy">
              No matching products found
            </h3>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto">
              We couldn't find any designs matching "{searchQuery}". Try searching by another keyword, resetting your filters, or browsing by category.
            </p>
            <div className="pt-2">
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-navy-700 transition-colors"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
