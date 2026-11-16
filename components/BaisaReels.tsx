'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface ReelItem {
  id: string;
  title: string;
  category: string;
  slug: string;
  thumbnail: string;
  caption: string;
}

const REELS: ReelItem[] = [
  {
    id: '1',
    title: 'Morpankh Ikat 3-Piece Co-ord',
    category: 'Co-ord Sets',
    slug: 'cord-sets',
    thumbnail: '/cord-sets/12550.jpg.jpeg',
    caption: '100% Cotton twirl test in Sanganer sunshine.',
  },
  {
    id: '2',
    title: 'Chanderi Silk Flared Anarkali',
    category: 'Gowns',
    slug: 'traditional-gowns',
    thumbnail: '/traditional-gowns/16668.jpg.jpeg',
    caption: 'Pure Gota Patti needlework along a 5-meter flare.',
  },
  {
    id: '3',
    title: 'Indigo Dabu Handblock Maxi',
    category: 'Western Dresses',
    slug: 'western-dresses',
    thumbnail: '/western-dresses/10045.jpg.jpeg',
    caption: 'Natural mud-resist block printing in Jaipur.',
  },
  {
    id: '4',
    title: 'Boho Kaftan with Tassel Tie',
    category: 'Kaftans',
    slug: 'short-long-kaftan',
    thumbnail: '/short-long-kaftan/023fdea0b48306bda8bc878660bf429f.jpg.jpeg',
    caption: 'Breezy ease for resort mornings and summer travel.',
  },
];

export default function BaisaReels() {
  const [activeReel, setActiveReel] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 container-x">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-ink-100 dark:border-white/10 gap-4">
        <div>
          <p className="eyebrow text-xs tracking-[0.25em] uppercase text-[#0B2D7F] dark:text-amber-400 font-medium">
            FILMED ON OUR REAL PIECES
          </p>
          <h2 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl text-ink-950 dark:text-white font-normal">
            In Motion
          </h2>
          <p className="mt-1.5 text-sm text-ink-600 dark:text-neutral-400 font-sans">
            Witness how our handblock cottons drape, twirl, and breathe in natural movement.
          </p>
        </div>

        <Link
          href="/lookbook"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#0B2D7F] dark:text-amber-400 hover:opacity-80 transition-opacity"
        >
          <span>Explore Lookbook 2026</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {REELS.map((reel) => (
          <div
            key={reel.id}
            className="group relative aspect-[9/16] w-full rounded-3xl overflow-hidden shadow-md bg-neutral-900 border border-neutral-200/40 dark:border-white/10 cursor-pointer"
            onClick={() => setActiveReel(reel.id)}
          >
            {/* Background Media */}
            <img
              src={reel.thumbnail}
              alt={reel.title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            {/* Floating Play Badge */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-colors">
              <Play size={14} className="ml-0.5 fill-current" />
            </div>

            {/* Top Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                {reel.category}
              </span>
            </div>

            {/* Bottom Caption & Product Link */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs text-white/80 line-clamp-2 mb-2 font-sans font-light">
                {reel.caption}
              </p>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-medium leading-snug line-clamp-1">
                    {reel.title}
                  </h4>
                  <p className="text-[11px] text-amber-200">
                    Sanganer Atelier
                  </p>
                </div>
                <Link
                  href={`/collections/${reel.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 rounded-full bg-white text-ink-950 text-[11px] font-medium hover:bg-neutral-200 transition-colors shadow-2xs"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
