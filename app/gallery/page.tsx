'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';

const GALLERY_PICTURES = [
  {
    title: 'Seasoned Teakwood Block Carving',
    subtitle: 'Sanganer Carver Hamlet',
    image: '/images/about/craft-blockprint.jpg',
    aspect: 'aspect-square',
  },
  {
    title: 'Natural Indigo Vat Dip & Aeration',
    subtitle: 'Organic Dye Vats',
    image: '/images/about/craft-dyeing.jpg',
    aspect: 'aspect-[4/5]',
  },
  {
    title: 'Pure Mulmul Layering & Flare Check',
    subtitle: 'Master Cutting Table',
    image: '/images/hero/hero-dress.jpg',
    aspect: 'aspect-square',
  },
  {
    title: 'Royal Gota Patti Metallic Needlework',
    subtitle: 'Amber Artisanal Guild',
    image: '/images/hero/hero-coords.jpg',
    aspect: 'aspect-[4/5]',
  },
  {
    title: 'Liquid Modal Silk Finish & Drape',
    subtitle: 'Final Ironing & Inspection',
    image: '/images/hero/hero-satin.jpg',
    aspect: 'aspect-square',
  },
  {
    title: 'Full Circular Umbrella Flare Inspection',
    subtitle: 'Export Finishing Unit',
    image: '/images/hero/hero-lehenga.jpg',
    aspect: 'aspect-[4/5]',
  },
  {
    title: 'Artisan Washed Denim Cutting',
    subtitle: 'Modern Tailoring Line',
    image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
    aspect: 'aspect-square',
  },
  {
    title: 'Export Packaging & Label Attachment',
    subtitle: 'Global Logistics Hub',
    image: '/images/hero/hero-main.jpg',
    aspect: 'aspect-[4/5]',
  },
];

export default function GalleryPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-28 pb-24">
        <div className="container-x">
          {/* Header */}
          <div className="pt-8 md:pt-12 pb-10 border-b border-foreground/10">
            <div className="eyebrow mb-3">Atelier Photography</div>
            <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[0.95] text-foreground">
              Inside the Atelier
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground/70 max-w-xl font-body leading-relaxed">
              A quiet visual chronicle of hands, looms, dye vats, and finishing tables
              inside our Jaipur handloom workshops.
            </p>
          </div>

          {/* Gallery Masonry / Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {GALLERY_PICTURES.map((item, idx) => (
              <div
                key={idx}
                className={`group image-zoom-wrap ${item.aspect} bg-secondary border border-foreground/10 overflow-hidden relative`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div className="text-white">
                    <span className="text-[10px] uppercase tracking-widerest text-white/70 block">
                      {item.subtitle}
                    </span>
                    <h3 className="font-display text-base leading-snug drop-shadow-sm mt-0.5">
                      {item.title}
                    </h3>
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
