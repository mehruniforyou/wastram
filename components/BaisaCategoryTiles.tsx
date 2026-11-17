'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CategoryTile {
  name: string;
  slug: string;
  image: string;
  tag: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    name: 'Co-ord sets',
    slug: 'cord-sets',
    image: '/cord-sets/12550.jpg.jpeg',
    tag: 'Handblock Mulmul',
  },
  {
    name: 'Kurta sets',
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
  {
    name: 'Gowns & Anarkalis',
    slug: 'traditional-gowns',
    image: '/traditional-gowns/16668.jpg.jpeg',
    tag: 'Gota Patti Needlework',
  },
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

export default function BaisaCategoryTiles() {
  return (
    <section className="py-12 md:py-16 container-x">
      <div className="flex items-end justify-between mb-8 pb-3">
        <div>
          <p className="eyebrow text-xs tracking-[0.2em] uppercase text-[#0B2D7F] dark:text-amber-400 font-medium">
            CURATED EDITS FROM SANGANER
          </p>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl text-ink-950 dark:text-white font-normal">
            Find your next outfit
          </h2>
        </div>
        <Link
          href="/collections/shop-all"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#0B2D7F] dark:text-amber-400 hover:opacity-80 transition-opacity"
        >
          <span>All collections</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {CATEGORY_TILES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/collections/${cat.slug}`}
            className="group flex flex-col focus:outline-none"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-sm group-hover:shadow-xl border border-neutral-200/80 dark:border-white/10 group-hover:border-[#0B2D7F] dark:group-hover:border-amber-400 group-hover:-translate-y-1.5 transition-all duration-300 ease-out">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 dark:bg-black/80 backdrop-blur-xs text-ink-900 dark:text-white truncate max-w-full">
                  {cat.tag}
                </span>
              </div>
            </div>
            <div className="mt-2.5 text-center">
              <h3 className="font-serif text-sm font-medium text-ink-950 dark:text-white group-hover:text-[#0B2D7F] dark:group-hover:text-amber-400 transition-colors">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
