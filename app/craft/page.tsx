'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';

const CRAFT_STAGES = [
  {
    step: 'Stage 01',
    title: 'Wood Carving (Tarkashi & Rekh)',
    desc: 'Master woodcarvers chisel seasoned teak or sheesham wood into intricate outline blocks (Rekh) and background filler blocks (Gad). Each motif takes 7 to 10 days of meticulous carving.',
  },
  {
    step: 'Stage 02',
    title: 'Harda Mordanting & Pre-treatment',
    desc: 'Pure cotton fabric is washed in natural river water and treated with harda (myrobalan) powder. This natural tannic mordant acts as an anchor, allowing organic dyes to bind permanently.',
  },
  {
    step: 'Stage 03',
    title: 'Rhythmic Hand-Block Stamping',
    desc: 'Artisans press the wooden block onto ink pads containing natural mineral pigments, then align each impression onto the stretched fabric using pinpoint eye-to-hand alignment.',
  },
  {
    step: 'Stage 04',
    title: 'Sun-Baking in Jaipur Sunshine',
    desc: 'Printed yardage is laid out in open-air courtyards under the dry Rajasthani sun. The solar heat oxidizes natural vegetable pigments, deepening the rich indigos, madders, and ochres.',
  },
  {
    step: 'Stage 05',
    title: 'Washing, Softening & Tailoring',
    desc: 'The fabrics are washed in running water to clear excess pigment, then passed to our master cutting tailors to be transformed into contemporary co-ords, kurtas, and dresses.',
  },
];

export default function CraftPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-neutral-900 selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-8 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="section-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white" />
            <span>GI-Tagged Rajasthan Heritage</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal leading-tight">
            Five Hundred Years of It — The Craft
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed">
            The ancient art of Sanganer hand block printing is recognized globally for its crisp, delicate floral butas, curvilinear vines, and enduring natural drapes.
          </p>
        </div>

        {/* 5-Stage Craft Timeline */}
        <div className="max-w-3xl mx-auto space-y-8 mb-20">
          {CRAFT_STAGES.map((stage, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-2xs flex flex-col sm:flex-row gap-6 items-start"
            >
              <span className="px-3 py-1 rounded-full text-xs font-serif font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 shrink-0">
                {stage.step}
              </span>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-ink-950 dark:text-white font-medium mb-2">
                  {stage.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-600 dark:text-neutral-300 leading-relaxed font-sans">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Shop Collections */}
        <div className="text-center bg-[#071F59] text-white rounded-3xl p-8 sm:p-14 max-w-4xl mx-auto shadow-xl">
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal mb-3">
            Wear Handcrafted Heritage Today
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto mb-8 font-sans">
            Every garment in our collections is crafted by the hands of real Jaipur artisans. Dispatched directly from our Sanganer workshop with worldwide boutique air cargo.
          </p>
          <Link
            href="/collections/shop-all"
            className="px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#bfa032] text-neutral-950 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2"
          >
            <span>Explore All Pieces</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <SizeGuideModal />
      <FloatingWhatsApp />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
