'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Scissors, Truck, ArrowRight } from 'lucide-react';

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
    title: 'Curated Wholesale Catalog',
    description: 'Immediate dispatch on seasonal handblock edits, co-ords, and ethnic sets in graded sizes S to XXL.',
    href: '/collections/shop-all',
    actionText: 'View catalog',
    icon: ShoppingBag,
  },
  {
    id: 'custom-design',
    step: '02',
    title: 'Made-to-Brief & White Label',
    description: 'Custom colorways, exclusive handblock development, brand labels, and tailored specs for boutiques.',
    href: '/custom-design',
    actionText: 'Commission custom run',
    icon: Scissors,
  },
  {
    id: 'wholesale',
    step: '03',
    title: 'Global Bulk Supply',
    description: 'Low MOQ from 20 pcs per style with transparent tiered factory pricing and insured door-to-door cargo.',
    href: '/wholesale',
    actionText: 'B2B supply terms',
    icon: Truck,
  },
];

export default function BaisaServicesGrid() {
  return (
    <section className="py-16 md:py-24 container-x">
      {/* Consistent Centered Header (Exact Layout as Artisanal Collections) */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="section-pill mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
          <span>Manufacturing &amp; Supply</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal">
          Atelier Sourcing &amp; <span className="text-[#D4AF37] italic font-normal">Manufacturing.</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto">
          Direct Jaipur factory production for independent boutiques, multi-brand retailers, and private labels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.id}
              href={s.href}
              className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] shadow-sm hover:shadow-xl hover:shadow-[#0B2D7F]/10 hover:-translate-y-1.5 transition-all duration-300 ease-out"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-2xl text-[#D4AF37] font-semibold">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#0B2D7F]/8 dark:bg-[#D4AF37]/15 text-[#0B2D7F] dark:text-[#D4AF37] border border-[#0B2D7F]/15 dark:border-[#D4AF37]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white group-hover:text-[#0B2D7F] dark:group-hover:text-[#D4AF37] transition-colors">
                  {s.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {s.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-[#0B2D7F] dark:text-[#D4AF37] group-hover:text-[#071F59]">
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
