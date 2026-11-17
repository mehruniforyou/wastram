'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Factory, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';

export default function StoryPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-neutral-900 selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-8 md:py-16">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="section-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>Sanganer Atelier Heritage</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#0B2D7F] dark:text-white font-normal leading-tight">
            The Wastram Story &amp; <span className="text-[#D4AF37] italic font-normal">Jaipur Atelier.</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed">
            Bridging 500 years of Sanganer hand-block printing heritage with modern, versatile silhouettes crafted for women across the world.
          </p>
        </div>

        {/* Narrative Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-6">
            <div className="section-pill mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
              <span>Sanganer Lineage</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal mb-4">
              Where Every Block &amp; <span className="text-[#D4AF37] italic font-normal">Has a Soul.</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans mb-4">
              Wastram was founded in the historic artisan township of Sanganer, just south of Jaipur's walled city. 
              Here, hand block printing is not a commercial process — it is an inherited family lineage where seasoned 
              carvers spend weeks hand-chiseling delicate butis, paisleys, and floral jaals from solid teakwood blocks.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              Our master block-printers align every impression with their eyes and hands, gently tapping the block 
              into pure mulmul cotton with an unmistakable organic irregularity that machines can never replicate.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-neutral-200/50">
              <img
                src="/cord-sets/12550.jpg.jpeg"
                alt="Wastram Sanganer Atelier"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Narrative Section 2: Factory Direct */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-neutral-200/50">
              <img
                src="/traditional-gowns/16668.jpg.jpeg"
                alt="Artisan Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="section-pill mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
              <span>Transparent Atelier</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal mb-4">
              Own Factory &amp; <span className="text-[#D4AF37] italic font-normal">Zero Middlemen.</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans mb-4">
              Unlike typical fashion brands that subcontract orders through multiple agents, Wastram owns and operates 
              its complete production facility in the Sanganer Textile Industrial Area. Every pattern is cut, 
              stitched, checked, and ironed by our team of 50+ craftspeople and master tailors.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              This vertical integration allows us to offer genuine boutique quality at honest, uninflated prices, 
              while ensuring fair living wages, safe working environments, and genuine artisan dignity.
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            <Factory size={24} className="text-neutral-800 dark:text-neutral-200 mb-3" />
            <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-white mb-2">
              Pure Natural Fabrics
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              We exclusively work with 100% fine cotton (60-60 cambric), modal silks, and Chanderi weaves that breathe effortlessly and soften with every wash.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            <Users size={24} className="text-neutral-800 dark:text-neutral-200 mb-3" />
            <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-white mb-2">
              True Inclusivity: S to XXL
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              Fashion belongs to all women. We don't just scale up a small pattern — each size has its own proportional curve grading for shoulder, bust, and armholes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            <Sparkles size={24} className="text-neutral-800 dark:text-neutral-200 mb-3" />
            <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-white mb-2">
              Direct Global Air Cargo
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              Whether shipping sample pieces or 500 handblock dresses to a boutique overseas, our logistics guarantee customs-cleared, insured delivery.
            </p>
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
