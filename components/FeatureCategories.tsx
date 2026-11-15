'use client';

import React from 'react';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  badge?: string;
  moq: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'kurta-sets',
    title: 'Kurta Suit Sets',
    subtitle: '3-Piece Sets with Handblock Dupattas',
    image: '/images/categories/cat-ethnic-wear-sets-editorial.webp',
    href: '/collections/ethnic-wear-sets',
    badge: 'TOP SOURCED',
    moq: 'MOQ 20 Pcs',
  },
  {
    id: 'anarkalis',
    title: 'Anarkali & Kalidar Gowns',
    subtitle: 'Flared Festive Silhouettes in Mulmul & Silk',
    image: '/images/categories/cat-umbrella-dresses.webp',
    href: '/collections/umbrella-dresses',
    badge: 'FESTIVE EDIT',
    moq: 'MOQ 20 Pcs',
  },
  {
    id: 'coords',
    title: 'Designer Co-ord Sets',
    subtitle: 'Modern Runway Co-ords & Resort Pairs',
    image: '/images/categories/cat-cord-sets.webp',
    href: '/collections/cord-sets',
    badge: 'TRENDING',
    moq: 'MOQ 20 Pcs',
  },
  {
    id: 'kaftans',
    title: 'Artisanal Kaftans',
    subtitle: 'Short & Long Kaftans with Zari Tassels',
    image: '/images/categories/cat-short-long-kaftan.webp',
    href: '/collections/short-long-kaftan',
    badge: 'EXPORT FAVORITE',
    moq: 'MOQ 20 Pcs',
  },
  {
    id: 'western',
    title: 'Western Dresses',
    subtitle: 'Tiered Maxis, Midis & Bohemian Silhouettes',
    image: '/images/categories/cat-western-dresses-editorial.webp',
    href: '/collections/western-dresses',
    badge: 'RESORT WEAR',
    moq: 'MOQ 20 Pcs',
  },
  {
    id: 'denim-atelier',
    title: 'Denim & Fusion Atelier',
    subtitle: 'Embroidered Denim Jackets, Tunics & Shirts',
    image: '/images/categories/cat-denim-collection.webp',
    href: '/collections/denim-collection',
    badge: 'CONTEMPORARY',
    moq: 'MOQ 25 Pcs',
  },
];

export default function FeatureCategories() {
  const handleWhatsAppCategory = (categoryTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(
        `Hello Wastram Jaipur, I am interested in wholesale boutique sourcing for your "${categoryTitle}" category. Please send the latest catalogue and MOQ details.`
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#FAF9F6] relative overflow-hidden">
      {/* Subtle Jaipur Zari Mandala Background Tint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#FAF5E6]/60 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-[1500px] mx-auto relative z-10 flex flex-col gap-10 sm:gap-14">
        {/* Section Header Matching Gulmohar Jaipur */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="text-[11px] sm:text-[12px] font-jost uppercase tracking-[0.22em] text-[#0B2D7F] font-semibold">
              Curated Silhouettes
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-jost font-normal text-[#071F59] uppercase tracking-[0.08em] mb-2">
            Shop By Category
          </h2>

          <p className="text-xs sm:text-sm font-jost text-[#555555] max-w-xl tracking-wide">
            Handcrafted in Sanganer & Bagru • Wholesale Batch MOQs • Worldwide Boutique Air Freight
          </p>
        </div>

        {/* 3x2 Grid on Desktop, 2-Column on Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#0B2D7F]/10 hover:border-[#D4AF37] shadow-soft hover:shadow-cardHover transition-all duration-500"
            >
              {/* Image Media Container with Traditional Jharokha Arch Framing */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF9F6]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
                  loading="lazy"
                />

                {/* Delicate Jharokha / Architectural Top Arch Overlay Silhouette */}
                <div className="absolute inset-0 border-[6px] sm:border-[8px] border-white/90 rounded-2xl pointer-events-none transition-all duration-500 group-hover:border-[#D4AF37]/40" />

                {/* Floating Top Badge */}
                {cat.badge && (
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#071F59]/90 text-white text-[9px] sm:text-[10px] font-jost uppercase tracking-[0.12em] font-semibold backdrop-blur-sm shadow-xs">
                      {cat.badge}
                    </span>
                  </div>
                )}

                {/* MOQ Badge Top Right */}
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/95 text-[#071F59] text-[9px] sm:text-[10px] font-jost uppercase tracking-[0.1em] font-semibold shadow-xs border border-[#0B2D7F]/10">
                    {cat.moq}
                  </span>
                </div>

                {/* Bottom Scrim for Title Contrast on Card Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071F59]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                  <button
                    type="button"
                    onClick={(e) => handleWhatsAppCategory(cat.title, e)}
                    className="w-full py-2.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-jost text-[11px] font-semibold uppercase tracking-[0.12em] shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Enquire Wholesale</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>

              {/* Text Info Below Image */}
              <div className="p-3.5 sm:p-5 flex flex-col items-center text-center bg-white transition-colors group-hover:bg-[#FAF9F6]/50">
                <h3 className="text-xs sm:text-sm lg:text-base font-jost font-medium text-[#071F59] uppercase tracking-[0.06em] group-hover:text-[#0B2D7F] transition-colors">
                  {cat.title}
                </h3>
                <p className="hidden sm:block text-[11px] font-jost text-[#777777] mt-1 line-clamp-1">
                  {cat.subtitle}
                </p>

                {/* Subtle explore link */}
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-jost uppercase tracking-[0.12em] text-[#D4AF37] font-semibold mt-2 group-hover:underline">
                  <span>Explore Edit</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
