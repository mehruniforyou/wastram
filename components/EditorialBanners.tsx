'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

export default function EditorialBanners() {
  return (
    <section className="w-full py-14 md:py-24 px-4 md:px-8 bg-[#FAF9F6] relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-14">
        {/* Section Heading with Scroll Reveal */}
        <ScrollReveal direction="up" distance={20} duration={800}>
          <div className="flex flex-col items-center text-center">
            <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1.5 flex items-center gap-2">
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
              Haute Couture &amp; Atelier Ensembles
              <span className="inline-block w-4 h-[1px] bg-[#D4AF37]/50" />
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.14em] uppercase text-[#0B2D7F]">
              The Signature Edits
            </h2>
            {/* Animated Golden Thread Shimmer Line */}
            <div className="w-16 h-[1.5px] gold-shimmer-line mt-3 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Asymmetrical High-Fashion Editorial Spread */}
        <div className="flex flex-col gap-6 md:gap-7">
          {/* 1. Grand Panoramic Campaign Banner with Scroll Reveal */}
          <ScrollReveal direction="up" distance={30} duration={850}>
            <Link
              href="/collections/most-wanted"
              className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-[0_20px_45px_rgba(11,45,127,0.14)] transition-all duration-600 bg-[#FAF9F6] border border-[#E8E4DA]/80 block aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.3/1] w-full group-hover:-translate-y-1.5"
            >
              <Image
                src="/images/banners/banner-most-wanted.webp"
                alt="Most Wanted Haute Couture Edit"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover group-hover:scale-104 transition-transform duration-800 ease-out will-change-transform"
              />
              {/* Soft editorial text protection gradient on left */}
              <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-1/2 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/75 to-transparent pointer-events-none" />

              <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center sm:justify-end z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-xl">
                  <div>
                    <span className="font-serif italic text-base md:text-2xl text-[#D4AF37] block mb-1">
                      Couture Spotlight
                    </span>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-wide uppercase leading-none text-[#0B2D7F]">
                      Most Wanted
                    </h3>
                  </div>

                  <div className="flex items-center group-hover:translate-x-2 transition-transform duration-400">
                    <span className="relative px-6 py-2.5 text-xs font-sans font-medium tracking-[0.15em] uppercase text-white rounded-full bg-[#0B2D7F] group-hover:bg-[#071F59] shadow-soft transition-colors whitespace-nowrap overflow-hidden">
                      <span className="relative z-10 flex items-center gap-1.5">
                        <span>Explore Edit</span>
                        <span>&rarr;</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* 2. Asymmetric Dual Editorial (Tall Portrait + Landscape Duo) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-7">
            {/* Left: Atmospheric Signature Sets (5 cols) */}
            <ScrollReveal direction="up" distance={28} duration={800} delay={100} className="lg:col-span-5 flex">
              <Link
                href="/collections/cord-sets"
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-[0_20px_45px_rgba(11,45,127,0.14)] transition-all duration-600 bg-[#FAF9F6] border border-[#E8E4DA]/80 block aspect-[4/3] lg:aspect-auto min-h-[340px] lg:min-h-[460px] w-full group-hover:-translate-y-1.5"
              >
                <Image
                  src="/images/banners/banner-sets.webp"
                  alt="Signature Atelier Sets"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-104 transition-transform duration-800 ease-out will-change-transform"
                />
                {/* Soft gradient overlay at bottom for editorial legibility */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#FAF9F6]/95 via-[#FAF9F6]/75 to-transparent pointer-events-none" />

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
                  <span className="font-serif italic text-base md:text-xl text-[#D4AF37] mb-1">
                    Coordinated Elegance
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-wide uppercase leading-none text-[#0B2D7F] mb-4">
                    Signature Sets
                  </h3>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-sans font-medium tracking-[0.15em] uppercase text-white rounded-full bg-[#0B2D7F] group-hover:bg-[#071F59] shadow-soft transition-colors group-hover:translate-x-1 duration-300">
                      <span>View Silhouettes</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Right: Stacked Landscape Duo (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-7">
              {/* Kurtis Banner */}
              <ScrollReveal direction="up" distance={24} duration={800} delay={150}>
                <Link
                  href="/collections/ethnic-wear-sets"
                  className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-[0_20px_45px_rgba(11,45,127,0.14)] transition-all duration-600 bg-[#FAF9F6] border border-[#E8E4DA]/80 block aspect-[16/9] lg:aspect-[2.1/1] group-hover:-translate-y-1.5"
                >
                  <Image
                    src="/images/banners/banner-kurtis.webp"
                    alt="Artisan Kurtis"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-104 transition-transform duration-800 ease-out will-change-transform"
                  />
                  <div className="absolute inset-y-0 left-0 w-3/4 sm:w-2/3 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/75 to-transparent pointer-events-none" />

                  <div className="absolute inset-0 p-5 md:p-8 flex items-end justify-between z-10">
                    <div>
                      <span className="font-serif italic text-sm md:text-base text-[#D4AF37] block">
                        Jaipur Needlework
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-wide uppercase text-[#0B2D7F]">
                        Artisan Kurtis
                      </h3>
                    </div>
                    <span className="px-4 py-1.5 text-[11px] font-sans font-medium tracking-wider uppercase text-white rounded-full bg-[#0B2D7F] group-hover:bg-[#071F59] shadow-soft transition-colors whitespace-nowrap group-hover:translate-x-1 duration-300">
                      Explore &rarr;
                    </span>
                  </div>
                </Link>
              </ScrollReveal>

              {/* Dresses Banner */}
              <ScrollReveal direction="up" distance={24} duration={800} delay={200}>
                <Link
                  href="/collections/western-dresses"
                  className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-[0_20px_45px_rgba(11,45,127,0.14)] transition-all duration-600 bg-[#FAF9F6] border border-[#E8E4DA]/80 block aspect-[16/9] lg:aspect-[2.1/1] group-hover:-translate-y-1.5"
                >
                  <Image
                    src="/images/banners/banner-dresses.webp"
                    alt="Atelier Dresses"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-104 transition-transform duration-800 ease-out will-change-transform"
                  />
                  <div className="absolute inset-y-0 left-0 w-3/4 sm:w-2/3 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/75 to-transparent pointer-events-none" />

                  <div className="absolute inset-0 p-5 md:p-8 flex items-end justify-between z-10">
                    <div>
                      <span className="font-serif italic text-sm md:text-base text-[#D4AF37] block">
                        Artisanal Mastery
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-wide uppercase text-[#0B2D7F]">
                        Atelier Dresses
                      </h3>
                    </div>
                    <span className="px-4 py-1.5 text-[11px] font-sans font-medium tracking-wider uppercase text-white rounded-full bg-[#0B2D7F] group-hover:bg-[#071F59] shadow-soft transition-colors whitespace-nowrap group-hover:translate-x-1 duration-300">
                      Explore &rarr;
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
