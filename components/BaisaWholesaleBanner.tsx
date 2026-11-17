'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BaisaWholesaleBanner() {
  const whatsappUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    'Hello Wastram Export Atelier, I would like to inquire about wholesale boutique sourcing and catalog line sheets.'
  )}`;

  return (
    <section className="py-14 md:py-20 container-x">
      <div className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-neutral-800">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="section-pill mb-4 border-white/20 bg-white/10 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Global B2B Supply</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
            Direct Sourcing for Boutiques Worldwide
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans max-w-xl">
            Direct atelier manufacturing for fashion boutiques and diaspora retail. Low batch MOQ from 20 pieces, custom branding tags, graded S to XXL, and door-to-door global air freight.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/wholesale"
              className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-medium text-xs sm:text-sm transition-all duration-300 shadow-sm inline-flex items-center gap-2 group"
            >
              <span>Explore Trade Terms</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full border border-white/25 hover:bg-white/10 text-white font-medium text-xs sm:text-sm transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle size={15} className="text-white" />
              <span>WhatsApp Trade Desk</span>
            </a>
          </div>

          {/* Quick Perks */}
          <div className="mt-10 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-white shrink-0" />
              <span>MOQ from 20 pieces</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-white shrink-0" />
              <span>Door-to-door Air Cargo</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <ShieldCheck size={15} className="text-white shrink-0" />
              <span>Custom Label Tagging</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
