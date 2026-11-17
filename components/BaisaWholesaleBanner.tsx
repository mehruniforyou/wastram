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
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071F59] via-[#0B2D7F] to-[#162B55] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-white/10">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <Truck size={14} />
            <span>GLOBAL B2B EXPORTS & WHOLESALE</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
            Direct Sourcing for Boutiques Worldwide
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed font-sans">
            Supply your luxury boutique, resort popup, or concept store directly from our Jaipur handloom atelier. 
            Enjoy low minimums from 20 pieces, custom label tagging, S to XXL grading, and insured worldwide door-to-door air freight.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/wholesale"
              className="px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#bfa032] text-neutral-950 font-medium text-xs sm:text-sm transition-all duration-300 shadow-md inline-flex items-center gap-2 group"
            >
              <span>Explore Trade Terms & Pricing</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full border border-white/30 hover:bg-white/10 text-white font-medium text-xs sm:text-sm transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle size={16} className="text-[#D4AF37]" />
              <span>WhatsApp Trade Concierge</span>
            </a>
          </div>

          {/* Quick Perks */}
          <div className="mt-10 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
              <span>MOQ from 20 pieces</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
              <span>Door-to-door Air Cargo</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
              <span>Private label tagging</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
