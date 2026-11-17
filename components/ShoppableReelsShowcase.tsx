'use client';

import React, { useState } from 'react';

interface ReelItem {
  id: string;
  title: string;
  category: string;
  image: string;
  views: string;
  sku: string;
  duration: string;
}

const REEL_ITEMS: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'Maroon Zari Kalidar Anarkali Set',
    category: 'Festive Couture',
    image: '/images/products/wd-261-0.jpg',
    views: '24.5k',
    sku: 'WD-261',
    duration: '0:24',
  },
  {
    id: 'reel-2',
    title: 'Handblock Printed Cotton Kurta Suit',
    category: 'Ethnic Wear',
    image: '/images/products/wd-176-0.jpg',
    views: '18.2k',
    sku: 'WD-176',
    duration: '0:18',
  },
  {
    id: 'reel-3',
    title: 'Ethereal Zari Trim Kaftan with Tassels',
    category: 'Luxury Resort',
    image: '/images/products/wd-175-0.jpg',
    views: '31.8k',
    sku: 'WD-175',
    duration: '0:30',
  },
  {
    id: 'reel-4',
    title: 'Embroidered Denim Fusion Tunic',
    category: 'Denim Atelier',
    image: '/images/products/denim-487-0.jpg',
    views: '15.9k',
    sku: 'WD-487',
    duration: '0:22',
  },
];

export default function ShoppableReelsShowcase() {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);

  const handleEnquireReel = (reel: ReelItem) => {
    const message = `Hello Wastram Jaipur, I saw the Video Reel for "${reel.title}" (SKU: ${reel.sku}) and would like to receive the full video lookbook, wholesale pricing, and fabric specifications.`;
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-10 sm:gap-14">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="text-[11px] sm:text-[12px] font-jost uppercase tracking-[0.22em] text-[#0B2D7F] font-semibold">
              Textiles in Motion
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-jost font-normal text-[#071F59] uppercase tracking-[0.08em] mb-2">
            Shoppable Video Atelier
          </h2>

          <p className="text-xs sm:text-sm font-jost text-[#555555] max-w-xl tracking-wide">
            Witness the drape, gold foil shimmer &amp; authentic needlework captured in high-definition reels
          </p>
        </div>

        {/* 4-Column Shoppable Video Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {REEL_ITEMS.map((reel) => (
            <div
              key={reel.id}
              onClick={() => handleEnquireReel(reel)}
              className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-[#071F59] shadow-soft hover:shadow-cardHover border border-[#0B2D7F]/10 hover:border-[#D4AF37] transition-all duration-500 cursor-pointer select-none"
            >
              {/* Media Thumbnail */}
              <img
                src={reel.image}
                alt={reel.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-106 will-change-transform"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071F59]/95 via-transparent to-black/30 pointer-events-none" />

              {/* Top View Counter & Reel Icon */}
              <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between text-white text-[10px] font-jost uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] animate-pulse" />
                  {reel.views}
                </span>

                <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md font-mono">
                  {reel.duration}
                </span>
              </div>

              {/* Pulsing Play Button Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 text-[#071F59] backdrop-blur-md flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-115 group-hover:bg-[#0B2D7F] group-hover:text-white">
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Floating Product Tag at Bottom */}
              <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-xl bg-white/95 backdrop-blur-md shadow-card border border-white/60 transition-all duration-300 group-hover:bg-white">
                <span className="text-[9px] font-jost uppercase tracking-[0.16em] text-[#D4AF37] font-semibold block mb-0.5">
                  {reel.category} // {reel.sku}
                </span>

                <h3 className="text-xs font-jost font-medium text-[#071F59] uppercase tracking-wide truncate mb-2">
                  {reel.title}
                </h3>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnquireReel(reel);
                  }}
                  className="w-full py-1.5 rounded-lg bg-[#0B2D7F] hover:bg-[#071F59] text-white text-[10px] font-jost font-semibold uppercase tracking-[0.1em] shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.228-.588-1.782-.751-2.906-2.559-2.996-2.678-.088-.119-.716-.954-.716-1.821 0-.867.453-1.294.614-1.467.161-.173.351-.216.468-.216.117 0 .234.002.336.007.108.005.253-.041.395.3.144.347.491 1.196.533 1.282.042.086.07.187.014.3-.056.113-.085.183-.17.283-.085.1-.179.224-.256.3-.085.085-.174.178-.075.348.099.17.439.723.942 1.172.646.577 1.191.756 1.361.841.17.085.27.071.37-.044.1-.115.428-.499.542-.67.114-.171.228-.143.385-.085.157.057.994.469 1.165.555.171.085.285.128.328.2.043.072.043.418-.101.823z" />
                  </svg>
                  <span>Enquire Video Look</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
