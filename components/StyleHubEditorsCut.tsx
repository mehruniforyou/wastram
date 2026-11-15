'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import ProductCard from './ProductCard';
import StyleHubSectionHeader from './StyleHubSectionHeader';

export default function StyleHubEditorsCut() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 8 Curated editorial pieces
  const editorPicks = NISHORAMA_PRODUCTS.slice(8, 16);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="container-x mt-24 md:mt-32">
      <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
        <div>
          <div className="eyebrow mb-2.5">Editor&apos;s Cut</div>
          <h2 className="font-display text-3xl md:text-5xl leading-[0.95] tracking-tight max-w-xl text-foreground">
            The Featured Edit
          </h2>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="p-2.5 border border-foreground/20 hover:border-foreground text-foreground transition-colors cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={scrollRight}
            className="p-2.5 border border-foreground/20 hover:border-foreground text-foreground transition-colors cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory scroll-smooth"
      >
        {editorPicks.map((product) => (
          <div
            key={product.id || product.slug}
            className="min-w-[260px] sm:min-w-[280px] md:min-w-[320px] snap-start shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
