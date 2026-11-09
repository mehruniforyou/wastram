'use client';

import React from 'react';
import Link from 'next/link';

export default function EditorialBanners() {
  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-14">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1">
            Haute Couture &amp; Wholesale
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
            The Signature Edits
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mt-3" />
        </div>

        {/* Asymmetrical High-Fashion Editorial Spread */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* 1. Grand Panoramic Campaign Banner */}
          <Link
            href="/collections/most-wanted"
            className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-cardHover transition-all duration-500 bg-[#071F59] block aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1] w-full"
          >
            <img
              src="/nishorama-images/banner-most-wanted.png"
              alt="Most Wanted Editorial"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end text-white z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="font-serif italic text-lg md:text-2xl text-[#D4AF37] block mb-1">
                    Couture Spotlight
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-wide uppercase leading-none text-white drop-shadow-sm">
                    Most Wanted
                  </h3>
                </div>

                <div className="flex items-center group-hover:translate-x-1 transition-transform">
                  <span className="px-6 py-2.5 text-xs font-sans font-medium tracking-[0.15em] uppercase text-white rounded-full bg-white/20 backdrop-blur-md shadow-soft border border-white/25">
                    Explore Edit &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* 2. Asymmetric Dual Editorial (Tall Portrait + Landscape Duo) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left: Atmospheric Wholesale Sets (5 cols) */}
            <Link
              href="/collections/sets"
              className="lg:col-span-5 group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-cardHover transition-all duration-500 bg-[#071F59] block aspect-[4/3] lg:aspect-auto min-h-[300px] lg:min-h-[440px]"
            >
              <img
                src="/nishorama-images/banner-sets.png"
                alt="Wholesale Sets"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white z-10">
                <span className="font-serif italic text-base md:text-xl text-[#D4AF37] mb-1">
                  Coordinated Elegance
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-wide uppercase leading-none text-white drop-shadow-sm mb-4">
                  Wholesale Sets
                </h3>
                <div>
                  <span className="inline-block px-5 py-2 text-xs font-sans font-medium tracking-[0.15em] uppercase text-white rounded-full bg-white/20 backdrop-blur-md shadow-soft border border-white/25">
                    View Silhouettes &rarr;
                  </span>
                </div>
              </div>
            </Link>

            {/* Right: Stacked Landscape Duo (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              {/* Kurties Banner */}
              <Link
                href="/collections/kurtis"
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-cardHover transition-all duration-500 bg-[#071F59] block aspect-[16/9] lg:aspect-[2.1/1]"
              >
                <img
                  src="/nishorama-images/banner-kurtis.png"
                  alt="Artisan Kurtis"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-5 md:p-8 flex items-end justify-between text-white z-10">
                  <div>
                    <span className="font-serif italic text-sm md:text-base text-[#D4AF37] block">
                      Jaipur Needlework
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-wide uppercase text-white">
                      Artisan Kurtis
                    </h3>
                  </div>
                  <span className="px-4 py-1.5 text-[11px] font-sans font-medium tracking-wider uppercase text-white rounded-full bg-white/20 backdrop-blur-md border border-white/25">
                    Explore &rarr;
                  </span>
                </div>
              </Link>

              {/* Dresses Banner */}
              <Link
                href="/collections/dresses"
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-cardHover transition-all duration-500 bg-[#071F59] block aspect-[16/9] lg:aspect-[2.1/1]"
              >
                <img
                  src="/nishorama-images/banner-dresses.png"
                  alt="Export Dresses"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-5 md:p-8 flex items-end justify-between text-white z-10">
                  <div>
                    <span className="font-serif italic text-sm md:text-base text-[#D4AF37] block">
                      Global Ready
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-wide uppercase text-white">
                      Export Dresses
                    </h3>
                  </div>
                  <span className="px-4 py-1.5 text-[11px] font-sans font-medium tracking-wider uppercase text-white rounded-full bg-white/20 backdrop-blur-md border border-white/25">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
