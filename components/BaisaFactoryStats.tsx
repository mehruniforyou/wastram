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
    desc: 'Standard international grading ensuring accurate bust, waist, and shoulder fall.',
  },
  {
    icon: ShieldCheck,
    title: 'Low Batch MOQs',
    desc: 'Flexible sourcing starting from 20 pieces per style with tiered volume rates.',
  },
  {
    icon: RotateCcw,
    title: 'Export Quality Control',
    desc: 'Pre-dispatch needle checks, colorfast dyes, and secure export-grade packaging.',
  },
  {
    icon: MessageCircle,
    title: 'B2B Trade Concierge',
    desc: 'Dedicated production desk ready for line sheets, custom tags, and air cargo quotes.',
  },
];

const ORDER_STEPS = [
  {
    step: '01',
    title: 'Select Silhouettes',
    desc: 'Browse our ready wholesale edits or submit custom specification sheets.',
  },
  {
    step: '02',
    title: 'Size & Volume Breakdown',
    desc: 'Choose your desired ratio of S to XXL with low minimums per colorway.',
  },
  {
    step: '03',
    title: 'Factory Invoice & Proof',
    desc: 'Receive transparent proforma with fabric certificates and lead times.',
  },
  {
    step: '04',
    title: 'Air Cargo Dispatch',
    desc: 'Steam-pressed, batch-packed, and shipped door-to-door with live tracking.',
  },
];

export default function BaisaFactoryStats() {
  return (
    <section className="py-16 md:py-24 bg-[#FFFEFE] dark:bg-[#12100E]">
      {/* 1. Craft & Heritage Intro */}
      <div className="container-x mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <div className="section-pill mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
              <span>Jaipur Heritage</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal leading-tight">
              The Craft of Sanganer &amp; <span className="text-[#D4AF37] italic font-normal">Jaipur Legacy.</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed max-w-xl">
              Every print begins with seasoned teakwood blocks hand-carved by master woodworkers in Jaipur. 
              Our artisans stamp natural vegetable dyes onto pure mulmul and cambric cotton in rhythmic synchrony, 
              preserving Rajasthan’s GI-tagged heritage in modern, wearable silhouettes.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/craft"
                className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
              >
                Read our craft story
              </Link>
              <Link
                href="/story"
                className="px-6 py-3 rounded-full border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white text-xs sm:text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
                className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0 border border-neutral-200/50 dark:border-white/10 shadow-2xs">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white">
                    {b.title}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
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
          <div className="section-pill mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>Order Fulfillment</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
            How Bulk Ordering Works &amp; <span className="text-[#D4AF37] italic font-normal">Global Dispatch.</span>
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-md mx-auto">
            A transparent 4-stage process from silhouette curation to door-to-door global air freight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {ORDER_STEPS.map((s) => (
            <div
              key={s.step}
              className="relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between cursor-default"
            >
              <div>
                <span className="font-serif text-2xl text-neutral-400 dark:text-neutral-500 font-light">
                  {s.step}
                </span>
                <h4 className="mt-2 font-serif text-lg font-medium text-neutral-900 dark:text-white">
                  {s.title}
                </h4>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
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
