'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface CategoryTile {
  name: string;
  slug: string;
  image: string;
}

// 6 Curated Categories arranged in Nishorama-style 4-column mosaic
const COL1_HERO: CategoryTile = {
  name: 'Gowns & Anarkalis',
  slug: 'traditional-gowns',
  image: '/traditional-gowns/16668.jpg.jpeg',
};

const COL2_TOP: CategoryTile = {
  name: 'Co-ord Sets',
  slug: 'cord-sets',
  image: '/cord-sets/12550.jpg.jpeg',
};

const COL2_BOTTOM: CategoryTile = {
  name: 'Kurta Sets',
  slug: 'ethnic-wear-sets',
  image: '/ethnic-wear-sets/FB_IMG_1754660373365.jpg.jpeg',
};

const COL3_TOP: CategoryTile = {
  name: 'Western Edit',
  slug: 'western-dresses',
  image: '/western-dresses/10045.jpg.jpeg',
};

const COL3_BOTTOM: CategoryTile = {
  name: 'Kaftans',
  slug: 'short-long-kaftan',
  image: '/short-long-kaftan/023fdea0b48306bda8bc878660bf429f.jpg.jpeg',
};

const COL4_HERO: CategoryTile = {
  name: 'Tops & Shirts',
  slug: 'tops-shirts',
  image: '/tops-shirts/5246.jpg.jpeg',
};

function NishoramaCategoryCard({
  cat,
  className = '',
}: {
  cat: CategoryTile;
  className?: string;
}) {
  return (
    <Link
      href={`/collections/${cat.slug}`}
      className={`group relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/70 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] shadow-xs hover:shadow-2xl hover:shadow-[#0B2D7F]/15 hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col justify-end ${className}`}
    >
      {/* Background Photography Frame */}
      <img
        src={cat.image}
        alt={cat.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
      />

      {/* Gentle Subtle Bottom Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

      {/* Minimal Frosted Glass Capsule (Zero Text Clutter) */}
      <div className="relative z-10 p-3 sm:p-4 self-start">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/75 backdrop-blur-md text-[11px] sm:text-xs font-serif font-medium text-neutral-900 dark:text-white shadow-xs border border-white/40 group-hover:bg-[#0B2D7F] group-hover:text-white group-hover:border-[#0B2D7F] transition-all duration-300">
          <span>{cat.name}</span>
          <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default function BaisaCategoryTiles() {
  return (
    <section className="py-8 md:py-14 container-x">
      {/* Consistent Centered Header (Exact Layout as Artisanal Collections) */}
      <ScrollReveal direction="up" duration={800} className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="section-pill mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
          <span>Curated Silhouettes</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal">
          Boutique Silhouettes &amp; <span className="text-[#D4AF37] italic font-normal">Jaipur Edits.</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto">
          Handcrafted Jaipur silhouettes tailored in pure cotton, mulmul, and modal silks for boutique collections worldwide.
        </p>
        <div className="mt-4">
          <Link
            href="/collections/shop-all"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B2D7F] hover:text-[#071F59] dark:text-[#D4AF37] transition-colors"
          >
            <span>All collections</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>

      {/* Desktop Layout: Authentic Nishorama 4-Column Editorial Mosaic (600px Height) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-3.5 lg:gap-4.5 items-stretch h-[600px]">
        {/* Column 1 (3 Cols): Left Tall Bookend */}
        <ScrollReveal direction="up" delay={0} duration={800} className="lg:col-span-3 h-full">
          <NishoramaCategoryCard
            cat={COL1_HERO}
            className="w-full h-full rounded-[32px]"
          />
        </ScrollReveal>

        {/* Column 2 (2 Cols): Stacked Portrait Pair */}
        <ScrollReveal direction="up" delay={100} duration={800} className="lg:col-span-2 flex flex-col gap-3.5 lg:gap-4.5 h-full">
          <NishoramaCategoryCard
            cat={COL2_TOP}
            className="flex-1 rounded-[28px]"
          />
          <NishoramaCategoryCard
            cat={COL2_BOTTOM}
            className="flex-1 rounded-[28px]"
          />
        </ScrollReveal>

        {/* Column 3 (3 Cols): Asymmetric Stacked Pair */}
        <ScrollReveal direction="up" delay={200} duration={800} className="lg:col-span-3 flex flex-col gap-3.5 lg:gap-4.5 h-full">
          <NishoramaCategoryCard
            cat={COL3_TOP}
            className="h-[57%] rounded-[28px]"
          />
          <NishoramaCategoryCard
            cat={COL3_BOTTOM}
            className="h-[43%] rounded-[28px]"
          />
        </ScrollReveal>

        {/* Column 4 (4 Cols): Prominent Hero Card with Large Curved Corner */}
        <ScrollReveal direction="up" delay={300} duration={800} className="lg:col-span-4 h-full">
          <NishoramaCategoryCard
            cat={COL4_HERO}
            className="w-full h-full rounded-[36px] rounded-tl-[64px]"
          />
        </ScrollReveal>
      </div>

      {/* Mobile & Tablet Layout: Curated 2-Column Pinterest/Editorial Flow (< 1024px) */}
      <div className="grid grid-cols-2 lg:hidden gap-3 sm:gap-4">
        {/* Card 1: Tall Left Portrait */}
        <NishoramaCategoryCard
          cat={COL1_HERO}
          className="col-span-1 aspect-[3/4] sm:aspect-[4/5] rounded-[24px]"
        />

        {/* Card 2: Tall Right Portrait */}
        <NishoramaCategoryCard
          cat={COL2_TOP}
          className="col-span-1 aspect-[3/4] sm:aspect-[4/5] rounded-[24px]"
        />

        {/* Card 3: Full Width Editorial Banner */}
        <NishoramaCategoryCard
          cat={COL4_HERO}
          className="col-span-2 aspect-[16/10] sm:aspect-[16/9] rounded-[28px]"
        />

        {/* Card 4: Paired Card Left */}
        <NishoramaCategoryCard
          cat={COL2_BOTTOM}
          className="col-span-1 aspect-[3/4] sm:aspect-[4/5] rounded-[24px]"
        />

        {/* Card 5: Paired Card Right */}
        <NishoramaCategoryCard
          cat={COL3_TOP}
          className="col-span-1 aspect-[3/4] sm:aspect-[4/5] rounded-[24px]"
        />

        {/* Card 6: Closing Wide Card */}
        <NishoramaCategoryCard
          cat={COL3_BOTTOM}
          className="col-span-2 aspect-[16/9] rounded-[28px]"
        />
      </div>
    </section>
  );
}
