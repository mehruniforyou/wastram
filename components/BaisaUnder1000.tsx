'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import ProductCard from './ProductCard';

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
    <section className="py-14 md:py-20 bg-[#FFFEFE] dark:bg-[#100E0C]">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2D7F]/10 dark:bg-amber-400/20 text-[#0B2D7F] dark:text-[#D4AF37] text-xs font-medium mb-2">
              <Sparkles size={12} />
              <span>SANGANER HANDLOOM ATELIER</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink-950 dark:text-white font-normal">
              Everyday Silhouettes
            </h2>
            <p className="mt-1 text-sm text-ink-600 dark:text-neutral-400 font-sans">
              Where most patrons start — airy cotton kurtis, breezy tunics, and everyday handblocks.
            </p>
          </div>

          <Link
            href="/collections/shop-all"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#0B2D7F] dark:text-amber-400 hover:opacity-80 transition-opacity"
          >
            <span>Explore all silhouettes</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
