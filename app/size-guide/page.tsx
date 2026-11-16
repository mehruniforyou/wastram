'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ruler, MessageCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';

interface SizeRow {
  size: string;
  bustInch: string;
  bustCm: string;
  waistInch: string;
  waistCm: string;
  hipInch: string;
  hipCm: string;
  lengthInch: string;
}

const COMPLETE_SIZE_CHART: SizeRow[] = [
  { size: 'S', bustInch: '34', bustCm: '86', waistInch: '28', waistCm: '71', hipInch: '37', hipCm: '94', lengthInch: '46' },
  { size: 'M', bustInch: '36', bustCm: '91', waistInch: '30', waistCm: '76', hipInch: '39', hipCm: '99', lengthInch: '47' },
  { size: 'L', bustInch: '38', bustCm: '97', waistInch: '32', waistCm: '81', hipInch: '41', hipCm: '104', lengthInch: '47' },
  { size: 'XL', bustInch: '40', bustCm: '102', waistInch: '34', waistCm: '86', hipInch: '43', hipCm: '109', lengthInch: '48' },
  { size: 'XXL', bustInch: '42', bustCm: '107', waistInch: '36', waistCm: '91', hipInch: '45', hipCm: '114', lengthInch: '48' },
];

export default function SizeGuidePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-8 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#0B2D7F]/10 dark:bg-amber-400/20 text-[#0B2D7F] dark:text-amber-400 mb-4">
            FIND YOUR PERFECT FIT
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink-950 dark:text-white font-normal leading-tight">
            Comprehensive Size Guide
          </h1>
          <p className="mt-4 text-sm sm:text-base text-ink-600 dark:text-neutral-300 font-sans leading-relaxed">
            All Wastram silhouettes are cut with true anatomical grading from S up to XXL, ensuring generous armhole ease, relaxed bust fits, and flattering drapes.
          </p>

          {/* Unit Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="flex rounded-full bg-neutral-200/60 dark:bg-neutral-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
                  unit === 'in'
                    ? 'bg-[#0B2D7F] text-white shadow-2xs'
                    : 'text-ink-600 dark:text-neutral-400'
                }`}
              >
                Inches (in)
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
                  unit === 'cm'
                    ? 'bg-[#0B2D7F] text-white shadow-2xs'
                    : 'text-ink-600 dark:text-neutral-400'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>
        </div>

        {/* Master Chart */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-ink-100 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm mb-16">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFFEFE] dark:bg-neutral-800 text-ink-900 dark:text-white uppercase tracking-wider font-semibold border-b border-ink-100 dark:border-white/10">
                <tr>
                  <th className="p-4">Size</th>
                  <th className="p-4">Bust ({unit})</th>
                  <th className="p-4">Waist ({unit})</th>
                  <th className="p-4">Hip ({unit})</th>
                  <th className="p-4">Standard Length (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-white/5">
                {COMPLETE_SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-ink-950 dark:text-white">{row.size}</td>
                    <td className="p-4 text-ink-700 dark:text-neutral-300">
                      {unit === 'in' ? row.bustInch : row.bustCm}
                    </td>
                    <td className="p-4 text-ink-700 dark:text-neutral-300">
                      {unit === 'in' ? row.waistInch : row.waistCm}
                    </td>
                    <td className="p-4 text-ink-700 dark:text-neutral-300">
                      {unit === 'in' ? row.hipInch : row.hipCm}
                    </td>
                    <td className="p-4 text-ink-700 dark:text-neutral-300">
                      {row.lengthInch}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tailor Advice */}
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-[#0B2D7F]/5 dark:bg-[#0B2D7F]/20 border border-[#0B2D7F]/20 dark:border-[#0B2D7F]/40 text-center">
          <h3 className="font-serif text-xl font-medium text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
            Need a Custom Fit or Sizing Help?
          </h3>
          <p className="text-xs sm:text-sm text-[#0B2D7F]/80 dark:text-white/80 leading-relaxed font-sans mb-6">
            Our Jaipur master tailor will guide you through accurate self-measurements, advise on ease for cotton handblocks, and provide complimentary alterations.
          </p>
          <a
            href="https://wa.me/918003088838?text=Hello%20Wastram%2C%20I%20would%20like%20guidance%20with%20finding%20the%20right%20size%20for%20my%20measurements."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#0B2D7F] text-white text-xs font-semibold hover:bg-[#071F59] transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <MessageCircle size={15} />
            <span>Chat with Master Tailor</span>
          </a>
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
