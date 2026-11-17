'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Chapter {
  number: string;
  title: string;
  subtitle: string;
  slug: string;
  image: string;
  tag: string;
}

const CHAPTERS: Chapter[] = [
  {
    number: 'CHAPTER 01',
    title: 'The Co-ord Edit',
    subtitle: 'Breathable 2-piece & 3-piece matched sets in handloom cotton & ikat.',
    slug: 'cord-sets',
    image: '/cord-sets/12550.jpg.jpeg',
    tag: 'Bestselling Silhouette',
  },
  {
    number: 'CHAPTER 02',
    title: 'Kurta Sets & Suits',
    subtitle: 'Pure cotton kurtas with farshi salwars, straight trousers & chanderi dupattas.',
    slug: 'ethnic-wear-sets',
    image: '/ethnic-wear-sets/FB_IMG_1754660373365.jpg.jpeg',
    tag: 'Classic Atelier',
  },
  {
    number: 'CHAPTER 03',
    title: 'Western & Tiered Dresses',
    subtitle: 'Flared maxi, tiered midi & shirt dresses tailored for effortless ease.',
    slug: 'western-dresses',
    image: '/western-dresses/10045.jpg.jpeg',
    tag: 'Export Grade',
  },
  {
    number: 'CHAPTER 04',
    title: 'Kaftans & Resort Silhouettes',
    subtitle: 'Flowing bohemian loungewear with tasselled ties & Sanganeri floral prints.',
    slug: 'short-long-kaftan',
    image: '/short-long-kaftan/023fdea0b48306bda8bc878660bf429f.jpg.jpeg',
    tag: 'Summer Lounge',
  },
  {
    number: 'CHAPTER 05',
    title: 'Tops, Tunics & Shirts',
    subtitle: 'Block-printed peplums, mandarin collared tunics & relaxed cotton shirts.',
    slug: 'tops-shirts',
    image: '/tops-shirts/5246.jpg.jpeg',
    tag: 'Everyday Ease',
  },
  {
    number: 'CHAPTER 06',
    title: 'Gowns & Royal Anarkalis',
    subtitle: 'Floor-length flared silhouettes adorned with Gota Patti and zari needlework.',
    slug: 'traditional-gowns',
    image: '/traditional-gowns/16668.jpg.jpeg',
    tag: 'Occasion & Festive',
  },
];

export default function BaisaChapters() {
  return (
    <section className="py-16 md:py-24 container-x bg-[#FFFEFE] dark:bg-[#12100E]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="section-pill mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
          <span>Artisanal Collections</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal">
          The Chapters &amp; <span className="text-[#D4AF37] italic font-normal">Craft Narratives.</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto">
          Dedicated craft narratives from our Jaipur atelier — handloom weaving, dabu printing, and fine gota needlework.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {CHAPTERS.map((chapter) => (
          <Link
            key={chapter.number}
            href={`/collections/${chapter.slug}`}
            className="group flex flex-col bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] shadow-sm hover:shadow-xl hover:shadow-[#0B2D7F]/10 hover:-translate-y-1.5 transition-all duration-300 ease-out"
          >
            {/* Rectangular Image Frame with Rounded Corners */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <img
                src={chapter.image}
                alt={chapter.title}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

              {/* Tag Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#0B2D7F] text-white dark:bg-[#D4AF37] dark:text-neutral-950 backdrop-blur-xs shadow-xs">
                  {chapter.tag}
                </span>
              </div>

              {/* Action Link */}
              <div className="absolute bottom-4 right-4 flex items-center text-white text-xs">
                <span className="underline decoration-white/60 underline-offset-4 group-hover:decoration-white transition-colors">
                  View Chapter →
                </span>
              </div>
            </div>

            {/* Chapter Metadata */}
            <div className="mt-5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase font-sans text-[#D4AF37] font-bold">
                  {chapter.number}
                </p>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white group-hover:text-[#0B2D7F] dark:group-hover:text-[#D4AF37] transition-colors">
                  {chapter.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans line-clamp-2">
                  {chapter.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-xs font-semibold text-[#0B2D7F] dark:text-[#D4AF37]">
                <span>Explore all styles</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
