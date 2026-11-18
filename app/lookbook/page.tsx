'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, ArrowRight, MessageCircle, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import SearchModal from '@/components/SearchModal';
import ScrollReveal from '@/components/ScrollReveal';

type LookbookCategory = 'all' | 'coords' | 'festive' | 'western' | 'kaftans' | 'umbrella';

interface LookbookItem {
  id: string;
  title: string;
  categoryTag: string;
  category: LookbookCategory;
  collectionSlug: string;
  image: string;
  fabric: string;
  craft: string;
  season: string;
  caption: string;
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'look-1',
    title: 'The Morpankh Ikat 3-Piece Suite',
    categoryTag: 'Modern Co-ords',
    category: 'coords',
    collectionSlug: 'cord-sets',
    image: '/cord-sets/12550.jpg.jpeg',
    fabric: '60-60 Cambric Cotton',
    craft: 'Hand Teak Blockprint',
    season: 'Spring / Summer 2026',
    caption: 'Clean notched lapel silhouette paired with tapered cigarette trousers. Shot on location in a 17th-century Jaipur haveli.',
  },
  {
    id: 'look-2',
    title: 'Emerald Gota Patti Royal Anarkali',
    categoryTag: 'Festive Trousseau',
    category: 'festive',
    collectionSlug: 'traditional-gowns',
    image: '/traditional-gowns/16668.jpg.jpeg',
    fabric: 'Fine Chanderi Zari Silk',
    craft: 'Authentic Gota Patti Needlework',
    season: 'Festive Atelier 2026',
    caption: 'Generous 5-meter flared sweep accented with hand-beaten gold ribbons and pure mulmul lining.',
  },
  {
    id: 'look-3',
    title: 'Tiered Sanganer Botanical Maxi',
    categoryTag: 'Western Silhouettes',
    category: 'western',
    collectionSlug: 'western-dresses',
    image: '/western-dresses/10045.jpg.jpeg',
    fabric: 'Featherlight Pure Mulmul',
    craft: 'Dual-Pass Rekh & Gad Print',
    season: 'Resort Edit 2026',
    caption: 'Breezy multi-tiered gathers, flutter sleeves, and deep concealed inseam pockets for effortless summer days.',
  },
  {
    id: 'look-4',
    title: 'Boho Indigo Kaftan & Tassel Cord',
    categoryTag: 'Resort Kaftans',
    category: 'kaftans',
    collectionSlug: 'short-long-kaftan',
    image: '/short-long-kaftan/023fdea0b48306bda8bc878660bf429f.jpg.jpeg',
    fabric: '100% Breathable Mulmul',
    craft: 'Bagru Mud-Resist Indigo Vat',
    season: 'Resort Edit 2026',
    caption: 'Free-flowing kimono cut with side vents and artisanal pompom ties, softened through river water wash.',
  },
  {
    id: 'look-5',
    title: '360° Flared Umbrella Sun Dress',
    categoryTag: 'Umbrella Flare',
    category: 'umbrella',
    collectionSlug: 'umbrella-dresses',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    fabric: 'High-Density Cambric',
    craft: 'Botanical Floral Jaal',
    season: 'Spring / Summer 2026',
    caption: 'Full circular umbrella flare cut with micro-pleats that swirl dramatically with movement.',
  },
  {
    id: 'look-6',
    title: 'The Noorani Kurta & Palazzo Ensemble',
    categoryTag: 'Festive Trousseau',
    category: 'festive',
    collectionSlug: 'ethnic-wear-sets',
    image: '/ethnic-wear-sets/FB_IMG_1754660373365.jpg.jpeg',
    fabric: 'Royal Modal Silk',
    craft: 'Zari Border & Handblock Stole',
    season: 'Festive Atelier 2026',
    caption: 'Lustrous modal silk kurta paired with flared palazzo pants and coordinating organza dupatta.',
  },
  {
    id: 'look-7',
    title: 'Minimalist Ivory Tunic & Crop Pant',
    categoryTag: 'Modern Co-ords',
    category: 'coords',
    collectionSlug: 'cord-sets',
    image: '/cord-sets/12560.jpg.jpeg',
    fabric: 'Slub Cotton Linen',
    craft: 'Monochrome Chippa Print',
    season: 'Spring / Summer 2026',
    caption: 'Architectural straight lines and functional details tailored for contemporary cosmopolitan living.',
  },
  {
    id: 'look-8',
    title: 'Kashish Mud Resist Tiered Gown',
    categoryTag: 'Western Silhouettes',
    category: 'western',
    collectionSlug: 'western-dresses',
    image: '/western-dresses/10096.jpg.jpeg',
    fabric: 'Organic Cotton Cambric',
    craft: 'Natural Iron Rust Mud Vat',
    season: 'Resort Edit 2026',
    caption: 'Earth-toned natural dye gradient that deepens with wear and sun exposure, finished with French seams.',
  },
  {
    id: 'look-9',
    title: 'Midnight Zari Kali Anarkali',
    categoryTag: 'Festive Trousseau',
    category: 'festive',
    collectionSlug: 'traditional-gowns',
    image: '/traditional-gowns/16671.jpg.jpeg',
    fabric: 'Mulmul with Zari Weave',
    craft: 'Handblock & Gold Detailing',
    season: 'Festive Atelier 2026',
    caption: 'Intricate 16-kali flared architecture tailored for regal wedding parties and festive soirées.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Looks' },
  { id: 'coords', label: 'Co-ords' },
  { id: 'festive', label: 'Festive Gowns' },
  { id: 'western', label: 'Western Silhouettes' },
  { id: 'kaftans', label: 'Kaftans' },
  { id: 'umbrella', label: 'Umbrella Flare' },
];

export default function LookbookPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<LookbookCategory>('all');

  const filteredLooks = activeCategory === 'all'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#12100E] text-foreground font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-32 pb-24">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <section className="container-x mb-14 md:mb-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="section-pill mb-4 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>Visual Chronicles · Editorial 2026</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0B2D7F] dark:text-white font-normal leading-[1.14] tracking-tight">
                Atelier Chronicles &amp;{' '}
                <span className="text-[#D4AF37] italic font-normal block sm:inline">Seasonal Forms.</span>
              </h1>

              <p className="mt-4 text-xs sm:text-base text-neutral-600 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
                A visual journey documenting hand-carved teak motifs, pure vegetable pigments, and architectural drapes photographed in the courtyards and palaces of Jaipur.
              </p>

              {/* Category Filter Pills */}
              <div className="mt-10 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as LookbookCategory)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#0B2D7F] text-white shadow-md shadow-[#0B2D7F]/25 dark:bg-[#D4AF37] dark:text-neutral-950'
                        : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/80 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* EDITORIAL MASONRY / GRID                                                  */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLooks.map((look) => {
              const whatsappUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
                `Hello Wastram Atelier, I am inquiring about Lookbook Piece: "${look.title}" (${look.season}). Please share availability and linesheet.`
              )}`;

              return (
                <ScrollReveal key={look.id}>
                  <div className="group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                    
                    {/* Image Wrap */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={look.image}
                        alt={look.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/95 dark:bg-neutral-900/95 text-[#0B2D7F] dark:text-[#D4AF37] backdrop-blur-md shadow-sm">
                          {look.categoryTag}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-md">
                          {look.season}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-[#D4AF37] font-serif font-medium uppercase tracking-wider mb-1.5">
                          <span>{look.fabric}</span>
                          <span>•</span>
                          <span>{look.craft}</span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white font-normal leading-snug mb-2 group-hover:text-[#0B2D7F] dark:group-hover:text-[#D4AF37] transition-colors">
                          {look.title}
                        </h3>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed line-clamp-2 mb-4">
                          {look.caption}
                        </p>
                      </div>

                      {/* Clean 1-Word Action CTAs */}
                      <div className="pt-4 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                        <Link
                          href={`/collections/${look.collectionSlug}`}
                          className="px-4 py-2.5 rounded-full border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white hover:border-[#0B2D7F] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Explore</span>
                          <ArrowRight size={13} />
                        </Link>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHOLESALE LOOKBOOK & LINESHEET BANNER                                     */}
        {/* ========================================================================= */}
        <section className="container-x">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden bg-[#071F59] text-white p-8 sm:p-14 lg:p-16 shadow-2xl text-center">
              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 text-[#D4AF37] border border-white/15 mb-4">
                  ✦ Trade &amp; Boutique Buyers
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-4">
                  Request the Complete 2026{' '}
                  <span className="text-[#D4AF37] italic font-normal">Lookbook &amp; Line Sheet.</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans mb-8">
                  Get high-resolution lookbook spreads, silhouette tech specs, MOQ breakdowns, and boutique pricing delivered directly on WhatsApp.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <a
                    href={`https://wa.me/918003088838?text=${encodeURIComponent(
                      'Hello Wastram Atelier, please share the full 2026 Editorial Lookbook & Line Sheet PDF.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href="/wholesale"
                    className="px-8 py-3.5 rounded-full bg-white text-[#071F59] hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Explore</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <SizeGuideModal />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
