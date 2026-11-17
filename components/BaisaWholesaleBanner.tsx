'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, ShieldCheck, Plane, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function BaisaWholesaleBanner() {
  const whatsappUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    'Hello Wastram Export Atelier, I would like to inquire about wholesale boutique sourcing and catalog line sheets.'
  )}`;

  return (
    <section className="py-8 md:py-14 container-x">
      <ScrollReveal direction="scale" duration={900}>
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#051336] via-[#091D4B] to-[#030B22] text-white p-7 sm:p-10 lg:p-14 shadow-2xl border border-white/15">
          {/* Subtle Heritage Jaali Texture Background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Ambient Warm Golden Glow Halo */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-[#0B2D7F]/40 blur-3xl pointer-events-none" />

          {/* 2-Column Responsive Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Sourcing Proposition & CTAs (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Glowing Gold Pill Badge (Clean & Ultra-Legible) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#D4AF37] text-[11px] font-sans font-semibold uppercase tracking-widest mb-4 self-start shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span>Direct Jaipur Factory Sourcing</span>
              </div>

              {/* Main Editorial Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] text-white">
                Direct Sourcing for <span className="text-[#D4AF37] italic font-normal">Boutiques Worldwide.</span>
              </h2>

              {/* Minimal & Clear Copy */}
              <p className="mt-3.5 text-xs sm:text-sm text-neutral-200/90 leading-relaxed font-sans max-w-xl">
                Direct atelier manufacturing for independent fashion boutiques and overseas diaspora labels. Low batch MOQ from 20 pieces, custom branding tags, graded sizes S to XXL, and door-to-door global air freight.
              </p>

              {/* Symmetric Action CTAs */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href="/wholesale"
                  className="px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#C5A059] text-neutral-950 font-semibold text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-[#D4AF37]/25 inline-flex items-center gap-2 group active:scale-98"
                >
                  <span>Explore Trade Terms</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full border border-white/25 hover:border-[#25D366] hover:bg-[#25D366]/15 text-white font-medium text-xs sm:text-sm transition-all inline-flex items-center gap-2 group active:scale-98"
                >
                  <MessageCircle size={15} className="text-[#25D366] transition-transform group-hover:scale-110" />
                  <span>WhatsApp Trade Desk</span>
                </a>
              </div>

              {/* Quick Sourcing Perks Strip */}
              <div className="mt-9 pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-neutral-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
                  <span>MOQ from 20 pieces</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
                  <span>Door-to-door Air Cargo</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
                  <span>Custom Label Tagging</span>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Editorial Atelier Photography Frame (5 Columns) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Ambient Backlight Aura */}
              <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-3xl blur-2xl transform rotate-3 scale-95 pointer-events-none" />

              {/* Primary Atelier Model Frame */}
              <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[4/5] rounded-[28px] overflow-hidden shadow-2xl border-2 border-white/20 bg-neutral-900 group">
                <img
                  src="/traditional-gowns/16668.jpg.jpeg"
                  alt="Wastram Sanganer Atelier Batch"
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gentle Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Floating Air Cargo Pill */}
                <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 flex items-center gap-1.5 text-[10.5px] font-sans font-medium text-white shadow-sm">
                  <Plane size={12} className="text-[#D4AF37]" />
                  <span>Worldwide Air Cargo</span>
                </div>

                {/* Bottom Floating Atelier Batch Glass Pill */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-between text-white shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-serif text-xs font-medium">Sanganer Handblock</span>
                      <span className="text-[10px] text-white/70 font-sans">Graded Sizes S to XXL</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-2 py-0.5 rounded-full shrink-0">
                    MOQ 20 Pcs
                  </span>
                </div>
              </div>

              {/* Secondary Floating Accent Badge (Left Flank) */}
              <div className="hidden sm:flex absolute -left-4 sm:-left-6 top-1/4 -translate-y-1/2 bg-[#061435]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 shadow-xl items-center gap-2.5 text-white">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Sparkles size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9.5px] text-white/60 uppercase tracking-widest font-sans font-semibold">Quality</span>
                  <span className="text-xs font-serif font-medium text-white">Export Grade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
