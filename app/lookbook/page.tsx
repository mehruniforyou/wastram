'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';

const LOOKBOOK_ITEMS = [
  {
    title: 'The Morpankh Ikat 3-Piece Edit',
    category: 'Co-ord Sets',
    slug: 'cord-sets',
    image: '/cord-sets/12550.jpg.jpeg',
    span: 'col-span-1 md:col-span-2 row-span-2',
    caption: 'Shot on location in an authentic heritage courtyard, Jaipur.',
  },
  {
    title: 'Emerald Gota Patti Royal Anarkali',
    category: 'Festive Gowns',
    slug: 'traditional-gowns',
    image: '/traditional-gowns/16668.jpg.jpeg',
    span: 'col-span-1',
    caption: 'Handcrafted zari embellishment along a 5-meter flare.',
  },
  {
    title: 'Tiered Sanganer Handblock Maxi',
    category: 'Western Dresses',
    slug: 'western-dresses',
    image: '/western-dresses/10045.jpg.jpeg',
    span: 'col-span-1',
    caption: 'Breezy multi-tiered cotton silhouette for golden hour.',
  },
  {
    title: 'Boho Indigo Kaftan with Tasselled Tie',
    category: 'Kaftans',
    slug: 'short-long-kaftan',
    image: '/short-long-kaftan/023fdea0b48306bda8bc878660bf429f.jpg.jpeg',
    span: 'col-span-1',
    caption: 'Effortless resort drape in 100% mulmul.',
  },
  {
    title: 'Sanganer Floral Peplum Tunic',
    category: 'Tops & Shirts',
    slug: 'tops-shirts',
    image: '/tops-shirts/5246.jpg.jpeg',
    span: 'col-span-1 md:col-span-2',
    caption: 'Everyday elegance paired with relaxed trousers.',
  },
  {
    title: '360° Flared Umbrella Dress',
    category: 'Umbrella Dresses',
    slug: 'umbrella-dresses',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    span: 'col-span-1',
    caption: 'Dynamic movement and joyful handblock floral patterns.',
  },
];

export default function LookbookPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-neutral-900 selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-8 md:py-14">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="section-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white" />
            <span>Visual Chronicles</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal leading-tight">
            Lookbook 2026
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed">
            A visual documentation of our seasonal handblock motifs, flowing silhouettes, and artisanal textile expressions photographed in Jaipur.
          </p>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOOKBOOK_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={`/collections/${item.slug}`}
              className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-neutral-900 border border-neutral-200/50 dark:border-white/10 ${item.span} min-h-[380px] flex flex-col justify-end p-6`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="relative z-10 text-white">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-white/20 backdrop-blur-md mb-2 border border-white/20">
                  {item.category}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-white/80 line-clamp-2 font-sans font-light">
                  {item.caption}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Shop Silhouette</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <SizeGuideModal />
      <FloatingWhatsApp />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
