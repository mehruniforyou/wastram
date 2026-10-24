'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { Product, getFeaturedProducts } from '@/data/products';
import { buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function FeaturedProducts() {
  const allFeatured = getFeaturedProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Featured' },
    { id: '3-piece-sets', label: '3-Piece Sets' },
    { id: 'co-ord-sets', label: 'Ethnic Co-Ords' },
    { id: 'dresses', label: 'Tiered Dresses' },
    { id: 'satin-shirts', label: 'Satin Shirts' },
    { id: 'lehengas', label: 'Lehengas' },
  ];

  const filtered =
    selectedCategory === 'all'
      ? allFeatured
      : allFeatured.filter((p) => p.categoryId === selectedCategory);

  return (
    <section className="py-16 lg:py-24 bg-ivory/50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-50 border border-blush-200 text-navy text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Wholesale Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy tracking-tight">
              Featured Export Highlights
            </h2>
            <p className="text-charcoal-muted text-sm sm:text-base max-w-xl">
              Hand-picked bestsellers from our current production runs. Click any design to send an immediate wholesale enquiry directly via WhatsApp.
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy hover:text-gold uppercase tracking-wider transition-colors"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-navy text-white shadow-subtle'
                  : 'bg-white text-charcoal hover:bg-blush-50 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const productWhatsAppUrl = buildWhatsAppLink(
              whatsappMessages.product(product.name, product.sku, product.categoryName)
            );

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-subtle hover:shadow-card-hover transition-all duration-300"
              >
                {/* Product Image & Link */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-ivory block"
                  aria-label={`View ${product.name} details`}
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.fabric}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* SKU & Category Badges */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-navy text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border border-gray-200">
                    {product.sku}
                  </div>

                  <div className="absolute top-3 right-3 bg-navy/85 backdrop-blur-xs text-gold text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider">
                    {product.fabric}
                  </div>

                  {/* Hover Quick View Button */}
                  <div className="absolute inset-0 bg-navy/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 bg-white text-navy px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-gold" />
                      <span>View Specifications</span>
                    </span>
                  </div>
                </Link>

                {/* Card Information */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-blush-500 uppercase tracking-wider">
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

                  {/* WhatsApp Direct Enquiry Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <a
                      href={productWhatsAppUrl}
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

      </div>
    </section>
  );
}
