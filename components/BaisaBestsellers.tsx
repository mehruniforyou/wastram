'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import ScrollReveal from '@/components/ScrollReveal';

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
    <section className="py-8 md:py-14 bg-[#FFFEFE] dark:bg-[#0E0C0A] transition-colors border-y border-ink-100 dark:border-white/5">
      <div className="container-x">
        {/* Consistent Centered Header (Exact Layout as Artisanal Collections) */}
        <ScrollReveal direction="up" duration={800} className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="section-pill mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>Bestselling Silhouettes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal">
            Reordered Silhouettes &amp; <span className="text-[#D4AF37] italic font-normal">Atelier Staples.</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto">
            Consistent top-reordered silhouettes from our Sanganer workshop — graded S to XXL with low batch MOQs.
          </p>

          <div className="mt-5 flex items-center justify-center gap-4">
            <Link
              href="/collections/bestsellers"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B2D7F] hover:text-[#071F59] dark:text-[#D4AF37] transition-colors"
            >
              <span>All bestsellers</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Circular Carousel Controls */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-neutral-300 dark:border-white/15">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full border border-[#0B2D7F]/30 hover:border-[#0B2D7F] text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white dark:border-[#D4AF37]/40 dark:text-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-neutral-950 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                aria-label="Previous bestsellers"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full border border-[#0B2D7F]/30 hover:border-[#0B2D7F] text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white dark:border-[#D4AF37]/40 dark:text-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-neutral-950 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                aria-label="Next bestsellers"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Snap Horizontal Carousel */}
        <ScrollReveal direction="up" delay={150} duration={850}>
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
        </ScrollReveal>

        {/* Scroll Progress Bar */}
        <div className="mt-6 w-full max-w-md mx-auto h-0.5 bg-neutral-200/50 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0B2D7F] via-[#2563EB] to-[#D4AF37] rounded-full transition-all duration-300"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
