'use client';

import React from 'react';
import Link from 'next/link';

export default function EditorialBanners() {
  const handleWhatsAppEditorial = (editName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(
        `Hello Wastram Jaipur, I am interested in wholesale boutique sourcing for your "${editName}" editorial collection. Please share line sheets and MOQ pricing.`
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#FFFEFE] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-10 sm:gap-14">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="text-[11px] sm:text-[12px] font-jost uppercase tracking-[0.22em] text-[#0B2D7F] font-semibold">
              Editorial Campaigns
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-jost font-normal text-[#071F59] uppercase tracking-[0.08em] mb-2">
            The Festive &amp; Shaadi Edit
          </h2>

          <p className="text-xs sm:text-sm font-jost text-[#555555] max-w-xl tracking-wide">
            Curated ensembles woven with Zari thread work, gota patti embroidery &amp; pure Jaipur mulmul
          </p>
        </div>

        {/* 2-Column Split Promotional Banners (Gulmohar Jaipur Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Banner 1: Ritual Ready */}
          <div className="group relative rounded-2xl overflow-hidden shadow-soft hover:shadow-cardHover border border-[#0B2D7F]/10 hover:border-[#D4AF37] transition-all duration-500 aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/10] bg-[#071F59]">
            <img
              src="/nishorama-images/editorial-desktop-1.png"
              alt="Ritual Ready Festive Suits"
              className="w-full h-full object-cover object-center transition-transform duration-800 ease-out group-hover:scale-106 will-change-transform"
              loading="lazy"
            />

            {/* Gradient Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071F59]/90 via-[#071F59]/35 to-transparent pointer-events-none" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end z-10">
              <span className="text-[10px] sm:text-[11px] font-jost uppercase tracking-[0.24em] text-[#D4AF37] font-semibold mb-1">
                From Festive Lights to Family Nights
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-jost font-normal text-white uppercase tracking-[0.06em] leading-tight mb-2">
                Ritual Ready
              </h3>

              <p className="text-xs sm:text-sm font-jost text-white/85 max-w-md line-clamp-2 mb-5">
                Authentic 3-Piece Kalidar and Kurta sets with organza handblock dupattas tailored for boutique orders.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleWhatsAppEditorial('Ritual Ready Festive Suits', e)}
                  className="px-6 py-2.5 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs font-jost font-semibold uppercase tracking-[0.12em] shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <span>Enquire Edit</span>
                  <span>&rarr;</span>
                </button>

                <Link
                  href="/collections/ethnic-wear-sets"
                  className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#071F59] text-xs font-jost font-semibold uppercase tracking-[0.12em] backdrop-blur-md transition-all"
                >
                  View Lookbook
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2: Royal Wedding Trousseau */}
          <div className="group relative rounded-2xl overflow-hidden shadow-soft hover:shadow-cardHover border border-[#0B2D7F]/10 hover:border-[#D4AF37] transition-all duration-500 aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/10] bg-[#071F59]">
            <img
              src="/nishorama-images/editorial-desktop-2.png"
              alt="Wedding Wardrobe Trousseau"
              className="w-full h-full object-cover object-center transition-transform duration-800 ease-out group-hover:scale-106 will-change-transform"
              loading="lazy"
            />

            {/* Gradient Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071F59]/90 via-[#071F59]/35 to-transparent pointer-events-none" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end z-10">
              <span className="text-[10px] sm:text-[11px] font-jost uppercase tracking-[0.24em] text-[#D4AF37] font-semibold mb-1">
                Woven in Heritage &amp; Glamour
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-jost font-normal text-white uppercase tracking-[0.06em] leading-tight mb-2">
                Wedding Trousseau
              </h3>

              <p className="text-xs sm:text-sm font-jost text-white/85 max-w-md line-clamp-2 mb-5">
                Regal velvet, georgette, and zari silk flared silhouettes crafted for bridal and ceremonial trousseau.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleWhatsAppEditorial('Wedding Wardrobe Trousseau', e)}
                  className="px-6 py-2.5 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs font-jost font-semibold uppercase tracking-[0.12em] shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <span>Enquire Edit</span>
                  <span>&rarr;</span>
                </button>

                <Link
                  href="/collections/umbrella-dresses"
                  className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#071F59] text-xs font-jost font-semibold uppercase tracking-[0.12em] backdrop-blur-md transition-all"
                >
                  View Lookbook
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
