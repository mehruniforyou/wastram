'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import { ProductCardSkeleton } from '@/components/BrandedSkeleton';

export default function BaisaUnder1000() {
  const [products, setProducts] = useState<NishoramaProduct[]>([]);

  useEffect(() => {
    fetch(`/api/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const prods = Array.isArray(data) ? data : data?.products || [];
        if (prods.length > 0) {
          const active = prods.filter((p: any) => !p.deleted && !p.is_hidden);
          if (active.length >= 4) {
            setProducts(active.slice(0, 8));
            return;
          }
        }
        setProducts(NISHORAMA_PRODUCTS.slice(0, 8));
      })
      .catch(() => {
        setProducts(NISHORAMA_PRODUCTS.slice(0, 8));
      });
  }, []);

  return (
    <section className="py-8 md:py-14 bg-[#FFFEFE] dark:bg-[#100E0C]">
      <div className="container-x">
        {/* Consistent Centered Header (Exact Layout as Artisanal Collections) */}
        <ScrollReveal direction="up" duration={800} className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="section-pill mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>Everyday Handblocks</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal">
            Everyday Silhouettes &amp; <span className="text-[#D4AF37] italic font-normal">Daily Co-ords.</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto">
            Pure 60-60 cambric cotton tunics and breathable daily coords crafted for bulk boutique inventory.
          </p>
          <div className="mt-4">
            <Link
              href="/collections/shop-all"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B2D7F] hover:text-[#071F59] dark:text-[#D4AF37] transition-colors"
            >
              <span>Explore all silhouettes</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.length === 0
            ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p, i) => (
                <ScrollReveal key={p.id} direction="up" delay={(i % 4) * 80} duration={800}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  );
}
