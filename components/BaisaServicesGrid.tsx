'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Calendar, Scissors, Truck, ArrowRight } from 'lucide-react';

interface ServiceItem {
  id: string;
  step: string;
  title: string;
  description: string;
  href: string;
  actionText: string;
  icon: React.ElementType;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'ready-styles',
    step: '01',
    title: 'Shop ready styles',
    description: 'Explore our latest season handblock silhouettes. Ready in sizes S to XXL, dispatched in 2–3 days with Cash on Delivery.',
    href: '/collections/shop-all',
    actionText: 'Browse ready collection',
    icon: ShoppingBag,
  },
  {
    id: 'wholesale-sourcing',
    step: '02',
    title: 'Boutique Wholesale Sourcing',
    description: 'Direct factory supply for fashion retailers, boutiques, and overseas labels. Low minimums, custom labeling, and insured worldwide cargo.',
    href: '/wholesale',
    actionText: 'Explore wholesale terms',
    icon: Truck,
  },
  {
    id: 'custom-design',
    step: '03',
    title: 'Made to your brief',
    description: 'Have a dream silhouette in mind? Customize sleeve lengths, necklines, fabric weights, or supply exact body measurements.',
    href: '/custom-design',
    actionText: 'Begin custom brief',
    icon: Scissors,
  },
  {
    id: 'wholesale',
    step: '04',
    title: 'Factory & bulk orders',
    description: 'Direct atelier wholesale sourcing for boutiques, diaspora concept stores, and export labels with worldwide door-to-door air freight.',
    href: '/wholesale',
    actionText: 'B2B wholesale terms',
    icon: Truck,
  },
];

export default function BaisaServicesGrid() {
  return (
    <section className="py-16 md:py-24 container-x">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 gap-4">
        <div>
          <p className="eyebrow text-xs tracking-[0.25em] uppercase text-[#0B2D7F] dark:text-amber-400 font-medium">
            FOUR WAYS TO WEAR WASTRAM
          </p>
          <h2 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl text-ink-950 dark:text-white font-normal">
            Your outfit, your way
          </h2>
        </div>
        <p className="text-sm text-ink-600 dark:text-neutral-400 max-w-md font-sans">
          Whether you want a ready dress for tomorrow, bespoke sizing for an event, or bulk orders for your boutique.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.id}
              href={s.href}
              className="group relative flex flex-col justify-between p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-ink-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-amber-400 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-2xl text-[#C5A059] font-light">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#FFFEFE] dark:bg-neutral-800 flex items-center justify-center text-[#0B2D7F] dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                </div>

                <h3 className="font-serif text-xl text-ink-950 dark:text-white group-hover:text-[#0B2D7F] dark:group-hover:text-amber-400 transition-colors">
                  {s.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-ink-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 pt-4 flex items-center gap-2 text-xs font-semibold text-[#0B2D7F] dark:text-amber-400">
                <span>{s.actionText}</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
