'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  kicker: string;
  scriptSub: string;
  heading: string;
  tagline: string;
  badgeText: string;
  desktopImg: string;
  mobileImg: string;
  whatsappMessage: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    kicker: 'ROYAL JAIPUR FESTIVE ATELIER',
    scriptSub: 'A New Beginning in Haute Luxury',
    heading: 'FESTIVE COUTURE & KALIDAR SUITS',
    tagline: 'Handcrafted in Sanganer & Bagru • Pure Mulmul & Zari Silks • Wholesale Batch MOQs',
    badgeText: 'NEW FESTIVE DROP',
    desktopImg: '/nishorama-images/hero-desktop.png',
    mobileImg: '/nishorama-images/hero-mobile.png',
    whatsappMessage: 'Hello Wastram Jaipur, I would like to enquire about your Festive Couture & Kalidar Suits wholesale collection and receive your lookbook.',
  },
  {
    id: 2,
    kicker: 'HANDLOOM HERITAGE SOURCING',
    scriptSub: 'Woven with Artisanal Precision',
    heading: 'ETHNIC 3-PIECE SUIT SETS',
    tagline: 'Fine Dobby Cottons • Authentic Handblock Prints • Custom Boutique Labelling',
    badgeText: 'BESTSELLER COLLECTION',
    desktopImg: '/nishorama-images/editorial-desktop-1.png',
    mobileImg: '/nishorama-images/editorial-mobile-1.png',
    whatsappMessage: 'Hello Wastram Jaipur, I am interested in wholesale sourcing for your Ethnic 3-Piece Kurta Suit Sets. Please share minimum order quantities and pricing.',
  },
  {
    id: 3,
    kicker: 'CONTEMPORARY RESORT & BOUTIQUE',
    scriptSub: 'Understated Elegance for Global Patrons',
    heading: 'DESIGNER CO-ORDS & KAFTANS',
    tagline: 'Effortless Fluid Silhouettes • Modal Satin & Georgette • Exported to 40+ Countries',
    badgeText: 'EXPORT SIGNATURE',
    desktopImg: '/nishorama-images/editorial-desktop-2.png',
    mobileImg: '/nishorama-images/editorial-mobile-2.png',
    whatsappMessage: 'Hello Wastram Jaipur, please share the catalogue and export pricing for your Designer Co-ords & Luxury Kaftans collection.',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = HERO_SLIDES.length;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto advance slides every 4.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;

    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, isPaused, totalSlides]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const current = HERO_SLIDES[currentSlide];

  const handleWhatsAppEnquiry = (msg: string) => {
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FFFEFE] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Wastram Jaipur Hero Showcase"
    >
      {/* Container with dynamic aspect ratio matching high-fashion editorial */}
      <div className="relative w-full h-[75vh] min-h-[520px] max-h-[820px] sm:h-[82vh] lg:h-[86vh] overflow-hidden">
        {/* Slides rendering with crossfade and Ken-Burns zoom */}
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Desktop Image */}
              <picture className="hidden sm:block w-full h-full">
                <img
                  src={slide.desktopImg}
                  alt={slide.heading}
                  className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </picture>

              {/* Mobile Image */}
              <picture className="block sm:hidden w-full h-full">
                <img
                  src={slide.mobileImg}
                  alt={slide.heading}
                  className={`w-full h-full object-cover object-top transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </picture>

              {/* High-Fashion Vignette & Translucent Scrim for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071F59]/80 via-[#071F59]/30 to-black/20" />
            </div>
          );
        })}

        {/* Floating Brand Watermark Crest */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 select-none opacity-20">
          <span className="text-[12vw] font-jost font-light text-white tracking-[0.2em] uppercase whitespace-nowrap leading-none">
            WASTRAM
          </span>
        </div>

        {/* Overlay Content Centered at Bottom/Middle */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 sm:pb-16 lg:pb-20 text-center px-4 max-w-4xl mx-auto">
          {/* Badge Pill */}
          <div className="mb-3 animate-pulse-badge">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 text-[#071F59] border border-[#D4AF37]/50 text-[10px] sm:text-[11px] font-jost uppercase tracking-[0.2em] font-semibold shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              {current.badgeText}
            </span>
          </div>

          {/* Script Calligraphy Romantic Subtitle (Gulmohar Style) */}
          <p className="font-serif italic text-white/95 text-lg sm:text-2xl lg:text-3xl tracking-wide drop-shadow-md mb-1.5">
            {current.scriptSub}
          </p>

          {/* Main Headline in Uppercase Jost */}
          <h1 className="font-jost text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white uppercase tracking-[0.06em] leading-[1.15] drop-shadow-lg mb-3">
            {current.heading}
          </h1>

          {/* B2B Wholesale Subtitle */}
          <p className="hidden sm:block text-xs sm:text-sm font-jost text-white/85 tracking-[0.1em] uppercase max-w-2xl mb-6 drop-shadow">
            {current.tagline}
          </p>

          {/* Interactive B2B WhatsApp & Catalogue CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2">
            <button
              type="button"
              onClick={() => handleWhatsAppEnquiry(current.whatsappMessage)}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white transition-all duration-300 font-jost font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] shadow-lg flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.228-.588-1.782-.751-2.906-2.559-2.996-2.678-.088-.119-.716-.954-.716-1.821 0-.867.453-1.294.614-1.467.161-.173.351-.216.468-.216.117 0 .234.002.336.007.108.005.253-.041.395.3.144.347.491 1.196.533 1.282.042.086.07.187.014.3-.056.113-.085.183-.17.283-.085.1-.179.224-.256.3-.085.085-.174.178-.075.348.099.17.439.723.942 1.172.646.577 1.191.756 1.361.841.17.085.27.071.37-.044.1-.115.428-.499.542-.67.114-.171.228-.143.385-.085.157.057.994.469 1.165.555.171.085.285.128.328.2.043.072.043.418-.101.823z" />
              </svg>
              <span>Enquire On WhatsApp</span>
            </button>

            <Link
              href="/collections/shop-all"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-white/95 hover:bg-white text-[#071F59] hover:text-[#0B2D7F] border border-white transition-all duration-300 font-jost font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Explore 1,400+ Styles</span>
              <span className="text-[#D4AF37]">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Carousel Navigation Arrow Paddles (Left / Right) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/25 hover:bg-[#071F59] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-90"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/25 hover:bg-[#071F59] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-90"
        >
          <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Progress Indicators & Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-[#D4AF37]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
