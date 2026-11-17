'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryTile {
  name: string;
  slug: string;
  image: string;
  tag: string;
}

const TILE_LEFT: CategoryTile = {
  name: 'Co-ord Sets',
  slug: 'cord-sets',
  image: '/cord-sets/12550.jpg.jpeg',
  tag: 'Handblock Mulmul',
};

const TILES_CENTER_COL1: CategoryTile[] = [
  {
    name: 'Kurta Sets',
    slug: 'ethnic-wear-sets',
    image: '/ethnic-wear-sets/FB_IMG_1754660373365.jpg.jpeg',
    tag: 'Zari & Chanderi',
  },
  {
    name: 'Western Dresses',
    slug: 'western-dresses',
    image: '/western-dresses/10045.jpg.jpeg',
    tag: 'Crepe Georgette',
  },
];

const TILES_CENTER_COL2: CategoryTile[] = [
  {
    name: 'Kaftans',
    slug: 'short-long-kaftan',
    image: '/short-long-kaftan/023fdea0b48306bda8bc878660bf429f.jpg.jpeg',
    tag: 'Resort Silhouette',
  },
  {
    name: 'Tops & Shirts',
    slug: 'tops-shirts',
    image: '/tops-shirts/5246.jpg.jpeg',
    tag: 'Pure Cambric 60-60',
  },
];

const TILES_CENTER_COL3: CategoryTile[] = [
  {
    name: 'Umbrella Dresses',
    slug: 'umbrella-dresses',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    tag: 'Flared Heritage Cut',
  },
  {
    name: 'Everyday Tunics',
    slug: 'tops-shirts',
    image: '/western-dresses/10096.jpg.jpeg',
    tag: 'Atelier Signature',
  },
];

const TILE_RIGHT: CategoryTile = {
  name: 'Gowns & Anarkalis',
  slug: 'traditional-gowns',
  image: '/traditional-gowns/16668.jpg.jpeg',
  tag: 'Gota Patti Needlework',
};

function CategoryCollageCard({
  cat,
  className = '',
  isFeatured = false,
}: {
  cat: CategoryTile;
  className?: string;
  isFeatured?: boolean;
}) {
  return (
    <Link
      href={`/collections/${cat.slug}`}
      className={`group relative overflow-hidden rounded-3xl bg-[#FAF9F5] dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] shadow-sm hover:shadow-2xl hover:shadow-[#0B2D7F]/15 hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-end p-4 sm:p-5 ${className}`}
    >
      {/* Background Image */}
      <img
        src={cat.image}
        alt={cat.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
      />

      {/* Luxury Gradient Overlay for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-65 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Floating Category Glass Content */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <span className="self-start inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#0B2D7F] text-white dark:bg-[#D4AF37] dark:text-neutral-950 backdrop-blur-md shadow-xs">
          {cat.tag}
        </span>
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`font-serif text-white font-medium drop-shadow-sm group-hover:text-[#D4AF37] transition-colors ${
              isFeatured ? 'text-lg sm:text-xl lg:text-2xl' : 'text-sm sm:text-base lg:text-lg'
            }`}
          >
            {cat.name}
          </h3>
          <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#0B2D7F] group-hover:text-white transition-all shadow-xs shrink-0">
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BaisaCategoryTiles() {
  return (
    <section className="py-12 md:py-20 container-x">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 pb-3 gap-4">
        <div>
          <div className="section-pill mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>Curated Silhouettes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
            Boutique Silhouettes &amp; <span className="text-[#D4AF37] italic font-normal">Jaipur Edits.</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl">
            Pure cambric cotton and artisan block prints, available for bulk supply across sizes S to XXL.
          </p>
        </div>
        <Link
          href="/collections/shop-all"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#0B2D7F] hover:text-[#071F59] dark:text-[#D4AF37] transition-colors"
        >
          <span>All collections</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Desktop Layout: Nishorama-Style 5-Section Symmetric Collage Grid (12 Columns) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* Left Bookend: Tall Feature Card (3 Columns, spans 540px) */}
        <div className="lg:col-span-3 flex flex-col">
          <CategoryCollageCard
            cat={TILE_LEFT}
            className="h-full min-h-[540px]"
            isFeatured={true}
          />
        </div>

        {/* Center Column 1: Two Stacked Cards (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-5">
          <CategoryCollageCard
            cat={TILES_CENTER_COL1[0]}
            className="h-[258px]"
          />
          <CategoryCollageCard
            cat={TILES_CENTER_COL1[1]}
            className="h-[258px]"
          />
        </div>

        {/* Center Column 2: Two Stacked Cards (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-5">
          <CategoryCollageCard
            cat={TILES_CENTER_COL2[0]}
            className="h-[258px]"
          />
          <CategoryCollageCard
            cat={TILES_CENTER_COL2[1]}
            className="h-[258px]"
          />
        </div>

        {/* Center Column 3: Two Stacked Cards (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-5">
          <CategoryCollageCard
            cat={TILES_CENTER_COL3[0]}
            className="h-[258px]"
          />
          <CategoryCollageCard
            cat={TILES_CENTER_COL3[1]}
            className="h-[258px]"
          />
        </div>

        {/* Right Bookend: Tall Feature Card (3 Columns, spans 540px) */}
        <div className="lg:col-span-3 flex flex-col">
          <CategoryCollageCard
            cat={TILE_RIGHT}
            className="h-full min-h-[540px]"
            isFeatured={true}
          />
        </div>
      </div>

      {/* Mobile & Tablet Layout: Curated 2-Column Responsive Bento Collage */}
      <div className="grid grid-cols-2 lg:hidden gap-3 sm:gap-4">
        {/* Lead Feature Card 1 (Span 2) */}
        <CategoryCollageCard
          cat={TILE_LEFT}
          className="col-span-2 min-h-[260px] sm:min-h-[300px] aspect-[16/10] sm:aspect-[16/9]"
          isFeatured={true}
        />

        {/* Center Pairs (Span 1 each) */}
        <CategoryCollageCard
          cat={TILES_CENTER_COL1[0]}
          className="col-span-1 min-h-[200px] sm:min-h-[230px] aspect-[3/4]"
        />
        <CategoryCollageCard
          cat={TILES_CENTER_COL1[1]}
          className="col-span-1 min-h-[200px] sm:min-h-[230px] aspect-[3/4]"
        />
        <CategoryCollageCard
          cat={TILES_CENTER_COL2[0]}
          className="col-span-1 min-h-[200px] sm:min-h-[230px] aspect-[3/4]"
        />
        <CategoryCollageCard
          cat={TILES_CENTER_COL2[1]}
          className="col-span-1 min-h-[200px] sm:min-h-[230px] aspect-[3/4]"
        />
        <CategoryCollageCard
          cat={TILES_CENTER_COL3[0]}
          className="col-span-1 min-h-[200px] sm:min-h-[230px] aspect-[3/4]"
        />
        <CategoryCollageCard
          cat={TILES_CENTER_COL3[1]}
          className="col-span-1 min-h-[200px] sm:min-h-[230px] aspect-[3/4]"
        />

        {/* Closing Feature Card 8 (Span 2) */}
        <CategoryCollageCard
          cat={TILE_RIGHT}
          className="col-span-2 min-h-[260px] sm:min-h-[300px] aspect-[16/10] sm:aspect-[16/9]"
          isFeatured={true}
        />
      </div>
    </section>
  );
}
