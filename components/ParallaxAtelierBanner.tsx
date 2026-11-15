'use client';

import React from 'react';

export default function ParallaxAtelierBanner() {
  const handleWhatsAppCatalogue = () => {
    window.open(
      'https://wa.me/918003088838?text=Hello%20Wastram%20Jaipur,%20I%20would%20like%20to%20request%20your%20complete%20wholesale%20catalogue,%20lookbooks,%20and%20factory%20production%20specifications.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-12 overflow-hidden bg-[#071F59] text-white">
      {/* Background with Parallax Feel & Subtle Scale */}
      <div className="absolute inset-0 z-0">
        <img
          src="/nishorama-images/hero-desktop.png"
          alt="Wastram Jaipur Handloom Workshop"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 filter saturate-150"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071F59] via-[#071F59]/80 to-[#071F59]" />
      </div>

      {/* Decorative Golden Thread Border Frame */}
      <div className="absolute inset-4 sm:inset-8 border border-[#D4AF37]/30 rounded-3xl pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Kicker Pill */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-[11px] font-jost uppercase tracking-[0.24em] font-semibold">
            ✦ Sanganer Craft Hub // Jaipur ✦
          </span>
        </div>

        {/* Script Accent Subtitle */}
        <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-[#D4AF37]/90 mb-2">
          From Loom to Luxury Wardrobe
        </p>

        {/* Grand Headline in Uppercase Jost */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-jost font-normal uppercase tracking-[0.08em] leading-tight mb-5">
          Weaving Heritage into Contemporary Luxury
        </h2>

        {/* Body Paragraph */}
        <p className="text-xs sm:text-sm lg:text-base font-jost text-white/80 max-w-2xl leading-relaxed mb-8">
          Every Wastram silhouette is born in our dedicated Jaipur atelier. From pure GOTS-certified organic cottons and natural block print dyes to intricate gota patti hand embroidery, we supply premier fashion boutiques and global exporters with flexible batch MOQs and rapid door-to-door worldwide dispatch.
        </p>

        {/* Direct WhatsApp Concierge CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={handleWhatsAppCatalogue}
            className="px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xs sm:text-sm font-jost font-semibold uppercase tracking-[0.14em] shadow-lg flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.228-.588-1.782-.751-2.906-2.559-2.996-2.678-.088-.119-.716-.954-.716-1.821 0-.867.453-1.294.614-1.467.161-.173.351-.216.468-.216.117 0 .234.002.336.007.108.005.253-.041.395.3.144.347.491 1.196.533 1.282.042.086.07.187.014.3-.056.113-.085.183-.17.283-.085.1-.179.224-.256.3-.085.085-.174.178-.075.348.099.17.439.723.942 1.172.646.577 1.191.756 1.361.841.17.085.27.071.37-.044.1-.115.428-.499.542-.67.114-.171.228-.143.385-.085.157.057.994.469 1.165.555.171.085.285.128.328.2.043.072.043.418-.101.823z" />
            </svg>
            <span>Request Complete Wholesale Catalogue</span>
          </button>
        </div>
      </div>
    </section>
  );
}
