'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import { ArrowRight, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-28 pb-24">
        <div className="container-x">
          {/* Hero Section */}
          <div className="pt-8 md:pt-12 pb-12 border-b border-foreground/10">
            <div className="eyebrow mb-3 text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <span>✦</span>
              <span>The Atelier · Jaipur, Rajasthan</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tight leading-[0.95] text-[#0B2D7F] dark:text-foreground max-w-4xl">
              Where heritage craft meets contemporary form.
            </h1>
            <p className="mt-6 text-sm md:text-lg text-foreground/75 max-w-2xl font-body leading-relaxed">
              Founded in 2011 in the heart of Sanganer, Wastram operates as a
              direct-to-boutique artisanal manufacturing atelier. We preserve ancient
              Mughal block-printing, organic vegetable vats, and handloom weaving while
              delivering strict export-grade precision to apparel stockists across 18 countries.
            </p>
          </div>

          {/* Visual Showcase (Two-Column) */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="image-zoom-wrap aspect-[4/3] bg-secondary border border-foreground/10 overflow-hidden">
                <img
                  src="/images/about/craft-blockprint.jpg"
                  alt="Jaipur Chippa Artisan Block Printing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="eyebrow gold text-xs">01 / The Handloom Code</div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
                Slow textiles made without compromise.
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed font-body">
                Every print begins with seasoned teak wood, hand-chiseled by master carvers
                whose families have practiced the craft for centuries. We blend traditional
                dabu mud resist and natural fermented indigo with modern liquid modal silks
                and high-density mulmuls.
              </p>
              <div className="pt-2">
                <Link href="/gallery" className="btn-outline">
                  View Atelier Gallery →
                </Link>
              </div>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="mt-24 pt-16 border-t border-foreground/10">
            <div className="eyebrow mb-8">Atelier Values</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-foreground/10 p-8 bg-card">
                <div className="eyebrow gold mb-2">01 · Direct Sourcing</div>
                <h3 className="font-display text-2xl text-foreground mb-3">Zero Middlemen</h3>
                <p className="text-sm text-foreground/70 font-body leading-relaxed">
                  Boutique stockists work directly with our Jaipur workshop managers, ensuring
                  transparent tiered pricing, custom lab dips, and exact production lead times.
                </p>
              </div>

              <div className="border border-foreground/10 p-8 bg-card">
                <div className="eyebrow gold mb-2">02 · Ethical Artisan Wages</div>
                <h3 className="font-display text-2xl text-foreground mb-3">Chippa Guild Respect</h3>
                <p className="text-sm text-foreground/70 font-body leading-relaxed">
                  We champion safe workshop conditions, year-round fair living wages, and
                  pension guarantees for our community of over 120 block-printers, dyers,
                  and needleworkers.
                </p>
              </div>

              <div className="border border-foreground/10 p-8 bg-card">
                <div className="eyebrow gold mb-2">03 · Global Logistics</div>
                <h3 className="font-display text-2xl text-foreground mb-3">Doorstep Air Cargo</h3>
                <p className="text-sm text-foreground/70 font-body leading-relaxed">
                  Seamless express air transit with full export clearance, Certificates of
                  Origin, and duty assistance across North America, Europe, Australia, and the Middle East.
                </p>
              </div>
            </div>
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
