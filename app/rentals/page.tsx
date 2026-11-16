'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, ShieldCheck, Sparkles, Truck, RotateCcw, MessageCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';

const RENTAL_STEPS = [
  {
    step: '01',
    title: 'Choose outfit & dates',
    desc: 'Pick your favourite lehenga, anarkali or gown and select your 3, 5 or 7 day event window.',
  },
  {
    step: '02',
    title: 'Doorstep delivery',
    desc: 'Your piece arrives 24 hours prior to your event, steam-pressed, sanitized, and ready to wear.',
  },
  {
    step: '03',
    title: 'Wear & celebrate',
    desc: 'Enjoy your special occasion with zero worries. Minor accidental spills are covered by us.',
  },
  {
    step: '04',
    title: 'Complimentary pickup',
    desc: 'Simply place the outfit back in the original garment bag. We handle the reverse courier & dry cleaning.',
  },
];

export default function RentalsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const rentalProducts = NISHORAMA_PRODUCTS.filter(
    (p) => p.category === 'traditional-gowns' || p.category === 'ethnic-wear-sets'
  ).slice(0, 8);

  const whatsappUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    'Hello Wastram Atelier, I am interested in renting an outfit for an upcoming occasion. Please share available dates and rental catalog.'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF7] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-8 md:py-14">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2D7F]/10 dark:bg-amber-400/20 text-[#0B2D7F] dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calendar size={14} />
            <span>OCCASION WEAR ON YOUR TERMS</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-ink-950 dark:text-white font-normal leading-tight">
            Rent an Outfit
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ink-600 dark:text-neutral-300 font-sans leading-relaxed">
            Wear opulent hand-embroidered anarkalis, festive lehengas, and silk co-ords for weddings, sangeets, and celebrations without the commitment of buying.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs sm:text-sm font-semibold transition-all shadow-md inline-flex items-center gap-2"
            >
              <MessageCircle size={16} />
              <span>Book via WhatsApp Concierge</span>
            </a>
            <Link
              href="#how-it-works"
              className="px-6 py-3.5 rounded-full border border-ink-300 dark:border-white/20 text-ink-900 dark:text-white text-xs sm:text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              How Rentals Work
            </Link>
          </div>
        </div>

        {/* 4 Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 text-center">
            <Sparkles size={20} className="text-[#C5A059] mx-auto mb-2" />
            <h4 className="font-serif text-sm font-medium">Couture Sanitized</h4>
            <p className="text-[11px] text-ink-500 mt-1">Hospital-grade steam cleaned</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 text-center">
            <Truck size={20} className="text-[#0B2D7F] dark:text-amber-400 mx-auto mb-2" />
            <h4 className="font-serif text-sm font-medium">Free Express Delivery</h4>
            <p className="text-[11px] text-ink-500 mt-1">Delivered 24 hrs in advance</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 text-center">
            <ShieldCheck size={20} className="text-emerald-600 mx-auto mb-2" />
            <h4 className="font-serif text-sm font-medium">Stain Insurance</h4>
            <p className="text-[11px] text-ink-500 mt-1">Minor party spills covered</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 text-center">
            <RotateCcw size={20} className="text-[#C5A059] mx-auto mb-2" />
            <h4 className="font-serif text-sm font-medium">Zero Dry Cleaning</h4>
            <p className="text-[11px] text-ink-500 mt-1">Simply pack & hand over</p>
          </div>
        </div>

        {/* Curated Pieces for Rent */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-ink-100 dark:border-white/5">
            <div>
              <p className="eyebrow text-xs tracking-[0.2em] uppercase text-[#0B2D7F] dark:text-amber-400 font-medium">
                POPULAR FOR OCCASIONS
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-950 dark:text-white font-normal mt-1">
                Featured Rental Silhouettes
              </h2>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#0B2D7F] dark:text-amber-400 hover:opacity-80"
            >
              Ask for custom dates →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {rentalProducts.map((p) => {
              const displayImg = (p.images && p.images[0]) || p.image || '/placeholder.jpg';
              return (
                <div
                  key={p.id}
                  className="group rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 shadow-2xs flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={displayImg}
                      alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 dark:bg-black/80 backdrop-blur-xs text-[#0B2D7F] dark:text-amber-400 shadow-2xs">
                        Rent from ₹599 / 3 days
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-serif text-sm font-medium text-ink-950 dark:text-white line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-ink-500 dark:text-neutral-400 mt-0.5">
                      Retail value: ₹{(p.price || 1499).toLocaleString('en-IN')}
                    </p>
                    <a
                      href={`https://wa.me/918003088838?text=${encodeURIComponent(
                        `Hi Wastram! I would like to rent ${p.title} (ID: ${p.id}). Please let me know dates.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full py-2 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-amber-400 dark:text-amber-400 text-xs font-semibold text-center block hover:bg-[#0B2D7F]/5 transition-colors"
                    >
                      Check Dates
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="py-12 border-t border-ink-100 dark:border-white/5">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="eyebrow text-xs tracking-[0.2em] uppercase text-[#0B2D7F] dark:text-amber-400 font-medium">
              SEAMLESS 4 STEPS
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-950 dark:text-white font-normal mt-1">
              How Outfit Rental Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RENTAL_STEPS.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 shadow-2xs"
              >
                <span className="font-serif text-2xl text-[#C5A059] font-light">{s.step}</span>
                <h4 className="mt-2 font-serif text-lg font-medium text-ink-950 dark:text-white">
                  {s.title}
                </h4>
                <p className="mt-2 text-xs text-ink-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
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
