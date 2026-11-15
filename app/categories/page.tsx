'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import { CATEGORIES } from '@/data/categories';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-28 pb-24">
        <div className="container-x">
          {/* Page Heading */}
          <div className="pt-8 md:pt-12 pb-10 border-b border-foreground/10">
            <div className="eyebrow mb-3 text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <span>✦</span>
              <span>Departments</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[0.95] text-[#0B2D7F] dark:text-foreground">
              Curated Categories
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground/70 max-w-xl font-body leading-relaxed">
              Every department is curated with pure fabrics, authentic artisanal handwork,
              and tailored cuts suited for discerning boutique buyers worldwide.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group border border-foreground/10 bg-card overflow-hidden hover:border-[#0B2D7F]/30 dark:hover:border-[#D4AF37]/40 hover:shadow-cardHover transition-all duration-300 flex flex-col"
              >
                {/* Image Container with Zoom */}
                <div className="relative aspect-[4/5] bg-secondary image-zoom-wrap overflow-hidden">
                  <img
                    src={cat.image || cat.heroImage || '/placeholder.jpg'}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-background/90 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-widerest text-foreground font-medium border border-foreground/10">
                      {cat.itemCount || 100}+ Silhouettes
                    </span>
                  </div>

                  {/* Title overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight drop-shadow-sm">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                {/* Card Description & CTA */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs md:text-sm text-foreground/70 leading-relaxed font-body">
                    {cat.description ||
                      'Export-grade handloom apparel tailored for boutique storefronts and resort collections.'}
                  </p>

                  <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between text-xs uppercase tracking-widerest font-medium text-foreground group-hover:text-[#0B2D7F] dark:group-hover:text-gold transition-colors">
                    <span>Explore Department</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
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
