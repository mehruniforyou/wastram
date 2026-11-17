'use client';

import React from 'react';
import Link from 'next/link';
import {
  Factory,
  ShieldCheck,
  Sparkles,
  Users,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';

const TRUST_BADGES = [
  {
    icon: Factory,
    title: 'Own Jaipur Factory',
    desc: 'Never outsourced. Made in our Sanganer atelier under ethical working conditions.',
  },
  {
    icon: Sparkles,
    title: 'Pure Cotton 60-60',
    desc: 'High-thread count, breathable organic cotton certified for all-day comfort.',
  },
  {
    icon: Users,
    title: 'Sizes S to XXL',
    desc: 'Unique graded patterns for every size, ensuring the right shoulder and bust drop.',
  },
  {
    icon: ShieldCheck,
    title: 'Cash on Delivery',
    desc: 'Pay safely at your doorstep across 19,000+ Indian pincodes.',
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    desc: 'Hassle-free size exchanges and doorstep pickup if anything doesn’t fit.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Concierge',
    desc: 'Real master tailors ready to answer measurement and styling questions instantly.',
  },
];

const ORDER_STEPS = [
  {
    step: '01',
    title: 'Pick your piece',
    desc: 'Browse our ready silhouettes, wholesale edits, or custom measurement options.',
  },
  {
    step: '02',
    title: 'Find your size',
    desc: 'Use our guided 3-point size finder (chest, waist, hips) from S up to XXL.',
  },
  {
    step: '03',
    title: 'Place your order',
    desc: 'Submit your wholesale boutique enquiry or place sample orders with rapid air freight.',
  },
  {
    step: '04',
    title: 'Dispatched from Sanganer',
    desc: 'Hand-inspected, steam-pressed, and dispatched in 2–3 days with live tracking.',
  },
];

export default function BaisaFactoryStats() {
  return (
    <section className="py-16 md:py-24 bg-[#FFFEFE] dark:bg-[#12100E]">
      {/* 1. Craft & Heritage Intro */}
      <div className="container-x mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow text-xs tracking-[0.25em] uppercase text-[#0B2D7F] dark:text-amber-400 font-medium">
              FIVE HUNDRED YEARS OF IT
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl text-ink-950 dark:text-white font-normal leading-tight">
              The Craft of Sanganer
            </h2>
            <p className="mt-4 text-sm sm:text-base text-ink-700 dark:text-neutral-300 font-sans leading-relaxed">
              Every print begins with seasoned teakwood blocks hand-carved by master woodworkers in Jaipur. 
              Our artisans stamp natural vegetable dyes onto pure mulmul and cambric cotton in rhythmic synchrony, 
              preserving Rajasthan’s GI-tagged heritage in modern, wearable silhouettes.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/craft"
                className="px-6 py-3 rounded-full bg-[#0B2D7F] text-white text-xs sm:text-sm font-medium hover:bg-[#071F59] transition-colors shadow-sm"
              >
                Read our craft story
              </Link>
              <Link
                href="/story"
                className="px-6 py-3 rounded-full border border-ink-300 dark:border-white/20 text-ink-900 dark:text-white text-xs sm:text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Inside the Jaipur factory
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-neutral-200/60 dark:border-white/10">
              <img
                src="/cord-sets/12550.jpg.jpeg"
                alt="Jaipur Sanganer Hand Block Printing"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-serif text-sm font-medium">Sanganer Textile Craft Hub, Jaipur</p>
                <p className="text-[11px] text-white/80">Every motif aligned and stamped by hand.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Six Circular Trust Badges */}
      <div className="container-x mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-amber-400 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFFEFE] dark:bg-neutral-800 flex items-center justify-center text-[#0B2D7F] dark:text-amber-400 shrink-0 border border-ink-100 dark:border-white/10 shadow-2xs">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-ink-950 dark:text-white">
                    {b.title}
                  </h4>
                  <p className="mt-1 text-xs text-ink-600 dark:text-neutral-400 font-sans leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. How Ordering Works 4-Step Timeline */}
      <div className="container-x">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="eyebrow text-xs tracking-[0.25em] uppercase text-[#0B2D7F] dark:text-amber-400 font-medium">
            SIMPLE & TRANSPARENT
          </p>
          <h3 className="mt-1 font-serif text-2xl sm:text-3xl text-ink-950 dark:text-white font-normal">
            How Ordering Works
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {ORDER_STEPS.map((s, i) => (
            <div
              key={s.step}
              className="relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-amber-400 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between cursor-default"
            >
              <div>
                <span className="font-serif text-2xl text-[#C5A059] font-light">
                  {s.step}
                </span>
                <h4 className="mt-2 font-serif text-lg font-medium text-ink-950 dark:text-white">
                  {s.title}
                </h4>
                <p className="mt-2 text-xs text-ink-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
