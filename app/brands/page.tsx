'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import { ArrowRight, Sparkles } from 'lucide-react';

const EDITS = [
  {
    id: 'sanganer-handblock',
    name: 'Sanganer Handblock House',
    origin: 'Jaipur, Rajasthan',
    fabric: 'Pure Cotton & Mulmul',
    description:
      'Hand-carved seasoned teakwood blocks dipped in natural botanical dyes, rhythmic stamping passed down through seven generations of Chippa artisans.',
    image: '/images/about/craft-blockprint.jpg',
    category: 'western-dresses',
  },
  {
    id: 'modal-silk',
    name: 'Modal Silk Evening Edit',
    origin: 'Atelier Sanganer',
    fabric: 'High-Density Modal Silk',
    description:
      'Liquid-drape modal silk characterized by a subtle satin sheen, wrinkle resistance, and luxurious handfeel, crafted for festive and destination edits.',
    image: '/images/hero/hero-satin.jpg',
    category: 'traditional-gowns',
  },
  {
    id: 'gota-patti',
    name: 'Royal Gota Patti Atelier',
    origin: 'Amber & Jaipur Workshops',
    fabric: 'Gold & Silver Metallic Ribbon',
    description:
      'Intricate appliqué needlework utilizing real metallic ribbon crushed and stitched by master needleworkers into floral, bird, and mughal jali motifs.',
    image: '/images/hero/hero-coords.jpg',
    category: 'cord-sets',
  },
  {
    id: 'bagru-indigo',
    name: 'Organic Bagru Indigo Vats',
    origin: 'Bagru Craft Hamlet',
    fabric: 'Kashish & Fermented Indigo',
    description:
      'Ancient mud-resist (Dabu) mud paste printing and multiple cold dip vats yielding deep indigos, rusts, and earthy ochres with rich vintage depth.',
    image: '/images/about/craft-dyeing.jpg',
    category: 'tops-shirts',
  },
  {
    id: 'chanderi-zari',
    name: 'Chanderi Zari Weaving Line',
    origin: 'Madhya Pradesh & Jaipur Finishing',
    fabric: 'Silk Cotton Zari Weave',
    description:
      'Feather-light translucent silk-cotton textures interwoven with delicate metallic zari warp threads, providing an ethereal sheer drape.',
    image: '/images/hero/hero-dress.jpg',
    category: 'umbrella-dresses',
  },
  {
    id: 'resort-denim',
    name: 'Artisan Denim & Indigo Stitch',
    origin: 'Jaipur Tailoring Guild',
    fabric: 'Hand-washed Raw & Washed Denim',
    description:
      'Modern export denim silhouettes, overshirts, and utility jackets treated with bio-enzyme washes and detailed with contrast artisan topstitching.',
    image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
    category: 'denim-collection',
  },
];

export default function BrandsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-28 pb-24">
        <div className="container-x">
          {/* Header */}
          <div className="pt-8 md:pt-12 pb-10 border-b border-foreground/10">
            <div className="eyebrow mb-3 text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <span>✦</span>
              <span>Atelier Edits &amp; Fabric Houses</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[0.95] text-[#0B2D7F] dark:text-foreground">
              Artisan Craft Guilds
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground/70 max-w-xl font-body leading-relaxed">
              Every edit represents a distinct Rajasthani textile discipline — from ancient
              mud-resist indigo vats to regal court zari and modal silk tailoring.
            </p>
          </div>

          {/* Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EDITS.map((edit) => (
              <div
                key={edit.id}
                className="group border border-foreground/10 bg-card hover:border-[#0B2D7F]/30 dark:hover:border-[#D4AF37]/40 hover:shadow-cardHover transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-secondary image-zoom-wrap overflow-hidden">
                  <img
                    src={edit.image}
                    alt={edit.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-widerest text-foreground font-medium border border-foreground/10">
                    {edit.origin}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="eyebrow gold text-[10px]">
                      {edit.fabric}
                    </span>
                    <h2 className="font-display text-2xl mt-1.5 text-foreground leading-snug">
                      {edit.name}
                    </h2>
                    <p className="mt-3 text-sm text-foreground/70 leading-relaxed font-body">
                      {edit.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-foreground/10 flex items-center justify-between">
                    <Link
                      href={`/products?category=${edit.category}`}
                      className="text-xs uppercase tracking-widerest font-medium link-underline text-foreground flex items-center gap-1.5"
                    >
                      <span>Explore Silhouettes</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
