'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Sun, Droplets, Compass, Layers, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import ScrollReveal from '@/components/ScrollReveal';

const CRAFT_STAGES = [
  {
    step: 'Stage 01',
    title: 'Teakwood Chisel · Rekh & Gad',
    subtitle: 'The Architectural Outline',
    desc: 'Master woodcarvers in Sanganer chisel seasoned sheesham or teakwood by eye. Each pattern requires dual blocks: "Rekh" (the hairline outline) and "Gad" (the background ground filler). A single floral buta requires up to 10 days of micro-carving.',
    image: '/images/about/craft-blockprint.jpg',
    tag: 'Carving Guild',
  },
  {
    step: 'Stage 02',
    title: 'Harda Mordant & River Soak',
    subtitle: 'Tannic Fiber Preparation',
    desc: 'Pure unbleached 60-60 cambric cotton is soaked in cold river water, then steeped in natural Harda (crushed myrobalan nuts). The natural tannic acid acts as a biological binder, allowing botanical pigments to fuse permanently with cotton fibers.',
    image: '/images/about/craft-dyeing.jpg',
    tag: 'Natural Mordant',
  },
  {
    step: 'Stage 03',
    title: 'The Chippa Rhythmic Strike',
    subtitle: 'Cadence of the Artisan Table',
    desc: 'The artisan dips the wooden block into a natural color trough, checks the pigment tension, and stamps the stretched fabric with a swift, weighted double-strike of the fist. Pinpoint registration marks guarantee seamless geometric repeats across 12-meter tables.',
    image: '/images/hero/hero-coords.jpg',
    tag: 'Hand Registration',
  },
  {
    step: 'Stage 04',
    title: 'Solar Oxidation in Thar Sun',
    subtitle: 'Nature’s Color Developer',
    desc: 'Printed yardage is carried to open courtyards where the dry Rajasthani sun bakes the natural pigments. Solar ultraviolet light oxidizes organic plant starches, deepening the earthy indigos, madder reds, and rusted iron blacks into permanent, wash-fast tones.',
    image: '/images/hero/hero-dress.jpg',
    tag: 'Solar Fixation',
  },
  {
    step: 'Stage 05',
    title: 'Clear Water Wash & Handloom Tailoring',
    subtitle: 'From Loom to Silhouette',
    desc: 'Fabrics undergo multiple fresh-water dips to release excess starch, revealing buttery soft cotton hand-feel. Then, our master cutters carve each garment according to anatomical grading (S to XXL), with generous ease and reinforced double French seams.',
    image: '/images/hero/hero-lehenga.jpg',
    tag: 'Atelier Finish',
  },
];

const NATURAL_PIGMENTS = [
  {
    name: 'Fermented Indigo (Neel)',
    colorCode: '#1E3A8A',
    source: 'Indigofera Tinctoria Leaves',
    desc: 'Underground vats of naturally fermented indigo leaves, lime, and jaggery yield deep nocturnal blues that breathe with wear.',
  },
  {
    name: 'Kashish (Iron Mud)',
    colorCode: '#262626',
    source: 'Rusted Iron & Molasses',
    desc: 'Scrap iron steeped in jaggery water over 21 days creates an artisanal slate and charcoal black free from coal-tar synthetics.',
  },
  {
    name: 'Alizarin Madder (Lal)',
    colorCode: '#991B1B',
    source: 'Indian Madder Root (Manjistha)',
    desc: 'Crushed madder roots boiled with alum mordant produce our signature terracotta, imperial brick, and crimson hues.',
  },
  {
    name: 'Harda (Golden Ochre)',
    colorCode: '#D97706',
    source: 'Dried Myrobalan Fruit',
    desc: 'Sun-dried myrobalan nuts ground into fine golden powder impart earthy sunlit yellows and prime the fabric for dyes.',
  },
];

export default function CraftPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const whatsappInquiryUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    'Hello Wastram Jaipur Atelier, I am interested in your authentic handloom craft and wholesale pieces.'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#12100E] text-foreground font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-32 pb-20">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Heritage Craft & Geographical Indication                */}
        {/* ========================================================================= */}
        <section className="container-x mb-16 md:mb-24">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="section-pill mb-4 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>GI-Tagged Rajasthan Heritage · Sanganer Atelier</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0B2D7F] dark:text-white font-normal leading-[1.12] tracking-tight">
                Five Centuries of Wood, Indigo &amp; Sun.{' '}
                <span className="text-[#D4AF37] italic font-normal block sm:inline">The Sanganer Craft.</span>
              </h1>

              <p className="mt-5 text-xs sm:text-base text-neutral-600 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
                Recognized globally under India’s Geographical Indication (GI) registry, authentic Sanganeri hand block printing is celebrated for its delicate curvilinear floral jaals, pure river water washes, and breathable natural drapes.
              </p>

              {/* Quick Metrics Strip */}
              <div className="mt-8 pt-8 border-t border-neutral-200/80 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                  <span className="text-[#D4AF37] font-serif text-xl sm:text-2xl font-semibold block">500+ Yrs</span>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mt-0.5">Chippa Lineage</span>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                  <span className="text-[#0B2D7F] dark:text-[#D4AF37] font-serif text-xl sm:text-2xl font-semibold block">100% Teak</span>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mt-0.5">Hand-Carved Blocks</span>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                  <span className="text-[#0B2D7F] dark:text-[#D4AF37] font-serif text-xl sm:text-2xl font-semibold block">Natural Dyes</span>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mt-0.5">River &amp; Solar Alchemy</span>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                  <span className="text-[#D4AF37] font-serif text-xl sm:text-2xl font-semibold block">Zero Plastic</span>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mt-0.5">Pure Cambric &amp; Mulmul</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE 5 SACRED CRAFT STAGES (Interactive Editorial Showcase)             */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="section-pill mb-3 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>The Alchemy of Handloom</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
                From Raw Teak to <span className="text-[#D4AF37] italic font-normal">Boutique Silhouette.</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Explore each disciplined phase in the creation of an authentic Wastram handblock garment.
              </p>
            </div>

            {/* Stages Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 justify-start sm:justify-center no-scrollbar">
              {CRAFT_STAGES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeStage === idx
                      ? 'bg-[#0B2D7F] text-white shadow-md shadow-[#0B2D7F]/25 dark:bg-[#D4AF37] dark:text-neutral-950'
                      : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70'
                  }`}
                >
                  <span>{s.step}</span>
                  <span className="hidden md:inline ml-1.5">· {s.title.split('·')[0]}</span>
                </button>
              ))}
            </div>

            {/* Active Stage Highlight Card */}
            <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
              <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[300px] overflow-hidden">
                <img
                  src={CRAFT_STAGES[activeStage].image}
                  alt={CRAFT_STAGES[activeStage].title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 dark:bg-neutral-900/95 text-[#0B2D7F] dark:text-[#D4AF37] shadow-sm backdrop-blur-md">
                    {CRAFT_STAGES[activeStage].tag}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                  {CRAFT_STAGES[activeStage].step}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 dark:text-white font-normal mb-1">
                  {CRAFT_STAGES[activeStage].title}
                </h3>
                <span className="text-xs sm:text-sm text-[#0B2D7F] dark:text-[#D4AF37] font-medium block mb-4 italic">
                  {CRAFT_STAGES[activeStage].subtitle}
                </span>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                  {CRAFT_STAGES[activeStage].desc}
                </p>

                <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                    <span className="text-xs text-neutral-500">Live Atelier Process</span>
                  </div>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2D7F] dark:text-[#D4AF37] hover:underline"
                  >
                    <span>Inquire</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 3. THE BOTANICAL PIGMENT PALETTE (Colorways & Natural Ingredients)         */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="section-pill mb-3 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>Zero Synthetic Chemicals</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
                Earth Pigments &amp; <span className="text-[#D4AF37] italic font-normal">Botanical Vats.</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Our workshop utilizes traditional vegetable dyes that age gracefully, enhancing with each wash.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {NATURAL_PIGMENTS.map((pigment, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-6 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-8 h-8 rounded-full border border-black/10 shrink-0 shadow-inner"
                      style={{ backgroundColor: pigment.colorCode }}
                    />
                    <div>
                      <h4 className="font-serif text-base font-semibold text-neutral-900 dark:text-white leading-tight">
                        {pigment.name}
                      </h4>
                      <span className="text-[11px] text-neutral-500 font-sans block">
                        {pigment.source}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                    {pigment.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 4. RAJASTHAN RAMPART DIVIDER & LUXURY ATELIER CALL TO ACTION              */}
        {/* ========================================================================= */}
        <section className="container-x">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden bg-[#071F59] text-white p-8 sm:p-14 lg:p-16 shadow-2xl text-center">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-white/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 text-[#D4AF37] border border-white/15 mb-4">
                  ✦ Direct Factory Sourcing
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-4">
                  Preserve Handloom &amp; <span className="text-[#D4AF37] italic font-normal">Dress Your Boutique.</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans mb-8">
                  Direct Sanganer loom pricing, low 20-piece flexible MOQs, true anatomical grading S to XXL, and door-to-door worldwide express air cargo.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    WhatsApp
                  </a>

                  <Link
                    href="/collections/shop-all"
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
      <FloatingWhatsApp />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
