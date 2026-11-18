'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  Factory, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Gem
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import ScrollReveal from '@/components/ScrollReveal';

const ATELIER_METRICS = [
  { value: '2011', label: 'Atelier Founded', sub: 'Sanganer, Jaipur' },
  { value: '120+', label: 'Artisan Families', sub: 'Printers, Dyers & Cutters' },
  { value: '18', label: 'Global Destinations', sub: 'Express Doorstep Cargo' },
  { value: 'S–XXL', label: 'Anatomical Grading', sub: 'Zero Scaled Compromise' },
];

const ATELIER_VALUES = [
  {
    number: '01',
    title: 'Pure Loom Integrity',
    subtitle: 'Zero Synthetic Blends',
    desc: 'We weave and print exclusively on 100% cotton (60-60 cambric), featherlight river-washed mulmul, lustrous modal silks, and Chanderi weaves. Every meter breathes with natural fibers that grow softer with every wash.',
  },
  {
    number: '02',
    title: 'Anatomical Size Grading',
    subtitle: 'Crafted for Real Bodies',
    desc: 'Unlike fast-fashion brands that simply scale up a small pattern proportionally, our master pattern masters draft independent anatomical curves for sizes S to XXL—ensuring graceful bust ease, relaxed shoulders, and deep pockets.',
  },
  {
    number: '03',
    title: 'Chippa Guild Dignity',
    subtitle: 'Year-Round Living Wages',
    desc: 'Our printing workshops in Sanganer provide well-ventilated, sunlit tables, continuous year-round employment, fair living wages, and health protections for our generational carvers and block-printers.',
  },
  {
    number: '04',
    title: 'Direct Loom Trade',
    subtitle: '20-Piece Low MOQ',
    desc: 'By eliminating trading intermediaries, commission agents, and showroom markups, we deliver authentic Jaipur artisan clothing directly to independent boutiques worldwide at genuine factory pricing.',
  },
];

const MASTER_ARTISANS = [
  {
    name: 'Ramji Lal Chippa',
    role: 'Master Block Carver · 4th Generation',
    experience: '38 Years Lineage',
    quote: 'The teakwood must speak before the chisel touches it. A true Sanganer buta holds the air of our ancestors.',
    image: '/images/about/craft-blockprint.jpg',
  },
  {
    name: 'Mangilal Verma',
    role: 'Master Indigo Vat Alchemist',
    experience: '29 Years in Natural Dyes',
    quote: 'Fermented indigo is alive. You listen to the bubbles in the morning sun to know when the blue is ready for cotton.',
    image: '/images/about/craft-dyeing.jpg',
  },
  {
    name: 'Shanti Devi',
    role: 'Head of Quality & Finishing',
    experience: '22 Years Atelier Craft',
    quote: 'Every button, pocket stitch, and hemline gets checked with the care I would give a bridal garment for my own daughter.',
    image: '/images/hero/hero-coords.jpg',
  },
];

export default function AboutPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const whatsappInquiryUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    'Hello Wastram Jaipur Atelier, I would like to learn more about your story and boutique partnership.'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#12100E] text-foreground font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-32 pb-24">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: The Atelier & Sanganer Genesis                           */}
        {/* ========================================================================= */}
        <section className="container-x mb-16 md:mb-24">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="section-pill mb-4 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>The Sanganer Atelier · Established 2011</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0B2D7F] dark:text-white font-normal leading-[1.12] tracking-tight">
                Where Ancient Craft Meets{' '}
                <span className="text-[#D4AF37] italic font-normal block sm:inline">Contemporary Silhouette.</span>
              </h1>

              <p className="mt-5 text-xs sm:text-base text-neutral-600 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
                Founded in 2011 in the historic artisan township of Sanganer, Wastram operates as a direct-to-boutique artisanal manufacturing atelier. We preserve 500 years of GI-tagged Mughal hand block printing while delivering export-grade precision to apparel retailers across 18 countries.
              </p>

              {/* Metrics Grid */}
              <div className="mt-10 pt-8 border-t border-neutral-200/80 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
                {ATELIER_METRICS.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                    <span className="text-[#0B2D7F] dark:text-[#D4AF37] font-serif text-2xl sm:text-3xl font-semibold block">
                      {m.value}
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white block mt-1">
                      {m.label}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">
                      {m.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 2. OUR GENESIS STORY: The Streets of Sanganer                             */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-neutral-200/80 dark:border-white/10">
                  <img
                    src="/images/about/craft-blockprint.jpg"
                    alt="Wastram Master Carver and Block Printer at Work"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 hidden sm:block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl p-4 shadow-lg max-w-xs">
                  <span className="text-xs font-serif italic text-[#0B2D7F] dark:text-[#D4AF37] block">
                    "Every block strike carries the memory of Rajasthan’s winds and rivers."
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-1">
                    — Sanganer Artisan Proverb
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="section-pill mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                  <span>The Sanganer Genesis</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal leading-tight">
                  Born to Defend Pure Craft from{' '}
                  <span className="text-[#D4AF37] italic font-normal">Synthetic Fast Fashion.</span>
                </h2>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                  In recent decades, commercial market pressure flooded the textile industry with synthetic polyester digital prints falsely labeled as "Jaipur prints." Real hand block printing—steeped in 500 years of Chippa community heritage—was being pushed to the margins.
                </p>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                  Wastram was established in Sanganer with a singular conviction: to create a modern, vertically integrated manufacturing atelier that works directly with master woodcarvers, natural vat dyers, and expert pattern-makers. No trading intermediaries. No synthetic compromise.
                </p>

                <div className="pt-2">
                  <Link
                    href="/craft"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white dark:bg-[#D4AF37] dark:text-neutral-950 font-semibold text-xs tracking-wide transition-all shadow-md cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 3. ATELIER VALUES & THE HANDLOOM CODE                                     */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="section-pill mb-3 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>The Handloom Code</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
                Four Pillars of the <span className="text-[#D4AF37] italic font-normal">Wastram Atelier.</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Ethical textile creation from raw cotton yarn to doorstep international cargo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ATELIER_VALUES.map((val, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                      {val.number} · {val.subtitle}
                    </span>
                    <h3 className="font-serif text-xl text-neutral-900 dark:text-white font-normal mb-3">
                      {val.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 4. MASTER ARTISANS SPOTLIGHT                                              */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="section-pill mb-3 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>Generational Craftspeople</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
                The Hands Behind <span className="text-[#D4AF37] italic font-normal">Every Impression.</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Meet the master woodcarvers, natural vat alchemists, and master cutters who lead our Sanganer workshop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MASTER_ARTISANS.map((art, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={art.image}
                      alt={art.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37] block mb-1">
                        {art.experience}
                      </span>
                      <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                        {art.name}
                      </h3>
                      <span className="text-xs text-[#0B2D7F] dark:text-neutral-400 font-medium block mb-3">
                        {art.role}
                      </span>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 italic font-sans leading-relaxed">
                        "{art.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 5. RAJASTHAN RAMPART CTA BANNER                                           */}
        {/* ========================================================================= */}
        <section className="container-x">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden bg-[#071F59] text-white p-8 sm:p-14 lg:p-16 shadow-2xl text-center">
              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 text-[#D4AF37] border border-white/15 mb-4">
                  ✦ Direct Factory Sourcing
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-4">
                  Visit the Sanganer Atelier or{' '}
                  <span className="text-[#D4AF37] italic font-normal">Connect via WhatsApp.</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans mb-8">
                  Whether you are a boutique owner seeking low-MOQ handcrafted collections or a patron wanting bespoke couture, we welcome you to experience our workshop.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
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
