'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

export default function StyleHubHero() {
  const handleWhatsAppBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hello Wastram Jaipur Atelier, I would like to book a wholesale sourcing consultation / video walkthrough for my boutique. Please connect me with your lead buyer.`;
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="container-x pt-6 md:pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        {/* Left Column: Editorial Hero Visual (Aspect 4/5 md:3/4) */}
        <div className="lg:col-span-7 relative">
          <div className="image-zoom-wrap relative aspect-[4/5] md:aspect-[3/4] bg-secondary border border-foreground/10 overflow-hidden">
            <img
              src="/images/hero/hero-main.jpg"
              alt="Wastram Jaipur Atelier Collection"
              loading="eager"
              className="w-full h-full object-cover object-top"
            />
            {/* Subtle Royal Atelier Tag with Artisan Crest */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-[#071F59]/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/35 shadow-soft flex items-center gap-2.5">
              <img
                src="/images/brand/wastram-artisan-crest.jpg"
                alt="Wastram Artisan Hallmark"
                className="w-5 h-5 rounded-full object-cover border border-[#D4AF37]/50 shadow-sm shrink-0"
              />
              <span className="eyebrow text-[10px] tracking-widerest text-[#0B2D7F] dark:text-[#D4AF37] font-semibold">
                👑 Jaipur Atelier · Est. 2011
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Typographic Copy */}
        <div className="lg:col-span-5 flex flex-col justify-end pb-2 lg:pb-6">
          <div className="eyebrow mb-3 text-[#D4AF37] font-semibold tracking-widest flex items-center gap-1.5">
            <span>✦</span>
            <span>Autumn / Winter &apos;26 Atelier</span>
          </div>

          <h1 className="font-jost font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-[0.05em] uppercase text-[#0B2D7F] dark:text-foreground">
            A quiet study
            <br />
            in form, fabric
            <br />
            and finish.
          </h1>

          <p className="mt-6 text-foreground/70 max-w-md text-sm md:text-base font-body leading-relaxed">
            Curated silhouettes in Pure Mulmul, Modal Silk, Chanderi and Sanganeri
            Handblocks. Handcrafted in our Jaipur atelier for premier boutiques
            and independent designers worldwide.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <Link
              href="/products"
              className="btn-primary"
            >
              Explore Collection
            </Link>
            <button
              onClick={handleWhatsAppBooking}
              className="btn-outline cursor-pointer"
            >
              Book Atelier Consultation
            </button>
          </div>

          {/* Store / Atelier Metadata Indicators */}
          <div className="mt-10 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs text-foreground/60">
            <div className="flex items-center gap-2">
              <MapPin size={15} strokeWidth={1.5} className="text-foreground shrink-0" />
              <span>Jaipur Atelier, Rajasthan, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} strokeWidth={1.5} className="text-foreground shrink-0" />
              <span>WhatsApp Concierge Active (10am - 8pm IST)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
