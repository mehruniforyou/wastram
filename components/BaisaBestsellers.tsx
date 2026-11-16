'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import ProductCard from './ProductCard';

export default function BaisaBestsellers() {
  const [products, setProducts] = useState<NishoramaProduct[]>(NISHORAMA_PRODUCTS.slice(0, 12));
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const prods = Array.isArray(data) ? data : data?.products || [];
        if (prods.length > 0) {
          // Filter bestsellers or top featured
          const best = prods.filter(
            (p: any) => !p.deleted && !p.is_hidden && (p.badge === 'Bestseller' || p.is_featured || p.rating >= 4.7)
          );
          setProducts(best.length >= 6 ? best.slice(0, 12) : prods.slice(0, 12));
        }
      })
      .catch(() => {});
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-20 bg-[#FFFEFE] dark:bg-[#0E0C0A] transition-colors border-y border-ink-100 dark:border-white/5">
      <div className="container-x">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="eyebrow text-xs tracking-[0.2em] uppercase text-[#0B2D7F] dark:text-amber-400 font-medium">
              ORDERED MOST, MONTH AFTER MONTH
            </p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl text-ink-950 dark:text-white font-normal">
              Bestsellers
            </h2>
            <p className="mt-1.5 text-sm text-ink-500 dark:text-neutral-400 font-sans max-w-xl">
              Signature pieces made in our Sanganer workshop — hand-block printed, true to size, dispatched in 2–3 days.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/collections/bestsellers"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#0B2D7F] dark:text-amber-400 hover:opacity-80 transition-opacity mr-2"
            >
              <span>All bestsellers</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Circular Carousel Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-ink-200 dark:border-white/10 flex items-center justify-center hover:bg-ink-100 dark:hover:bg-white/10 text-ink-800 dark:text-white transition-colors"
                aria-label="Previous bestsellers"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-ink-200 dark:border-white/10 flex items-center justify-center hover:bg-ink-100 dark:hover:bg-white/10 text-ink-800 dark:text-white transition-colors"
                aria-label="Next bestsellers"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Snap Horizontal Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory"
        >
          {products.map((prod) => (
            <div
              key={prod.id}
              className="w-[260px] sm:w-[280px] lg:w-[300px] flex-shrink-0 snap-start"
            >
              <ProductCard product={prod} />
            </div>
          ))}
        </div>

        {/* Scroll Progress Bar */}
        <div className="mt-6 w-full max-w-md mx-auto h-0.5 bg-ink-200/50 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0B2D7F] dark:bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
