'use client';

import React, { useState } from 'react';
import { Scissors, Sparkles, MessageCircle, Check, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';

const GARMENT_TYPES = [
  'Co-ord Set',
  'Kurta Suit Set',
  'Western Maxi Dress',
  'Occasion Gown / Anarkali',
  'Kaftan & Loungewear',
  'Lehenga & Custom Blouse',
];

const FABRIC_CHOICES = [
  'Pure Mulmul Cotton (Super-breathable)',
  'Cambric 60-60 Cotton (Crisp handblock)',
  'Modal Silk (Glossy royal drape)',
  'Chanderi Silk (Subtle festive sheen)',
  'Cotton Linen (Structured luxury)',
];

const CRAFT_CHOICES = [
  'Sanganer Floral Handblock',
  'Bagru Indigo / Dabu Mud Resist',
  'Handloom Ikat Motif',
  'Zari & Gota Patti Needlework',
  'Solid Artisan Dip-Dye',
];

export default function CustomDesignPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [garment, setGarment] = useState(GARMENT_TYPES[0]);
  const [fabric, setFabric] = useState(FABRIC_CHOICES[0]);
  const [craft, setCraft] = useState(CRAFT_CHOICES[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
    length: '',
    sleeve: 'Standard Full',
  });
  const [notes, setNotes] = useState('');

  const handleSubmitBrief = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello Wastram Jaipur Atelier, I would like to order a Custom Tailored Outfit:
• Garment: ${garment}
• Fabric: ${fabric}
• Craft/Print: ${craft}
• Client Name: ${name || 'Patron'}
• Contact: ${phone || 'N/A'}
• Measurements:
  - Bust: ${measurements.bust || 'Standard'}
  - Waist: ${measurements.waist || 'Standard'}
  - Hips: ${measurements.hips || 'Standard'}
  - Desired Length: ${measurements.length || 'Standard'}
  - Sleeve Preference: ${measurements.sleeve}
• Custom Notes: ${notes || 'None'}

Please guide me on timeline, fabric swatches, and quote.`;

    window.open(`https://wa.me/918003088838?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-8 md:py-14">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2D7F]/10 dark:bg-amber-400/20 text-[#0B2D7F] dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Scissors size={14} />
            <span>BESPOKE JAIPUR ATELIER</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-ink-950 dark:text-white font-normal leading-tight">
            Custom Design Your Outfit
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ink-600 dark:text-neutral-300 font-sans leading-relaxed">
            From S to XXL, feeding zippers, pocket additions, or custom sleeve drops — our master tailors in Sanganer craft garments made uniquely to your body.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-ink-100 dark:border-white/5 shadow-md">
          <form onSubmit={handleSubmitBrief} className="space-y-8">
            {/* 1. Garment Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-white mb-3">
                1. Select Silhouette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {GARMENT_TYPES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGarment(g)}
                    className={`p-3 rounded-2xl text-xs font-medium text-left border transition-all ${
                      garment === g
                        ? 'bg-[#0B2D7F] text-white border-[#0B2D7F] shadow-sm'
                        : 'border-ink-200 dark:border-white/10 text-ink-800 dark:text-neutral-200 hover:border-[#0B2D7F]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Fabric Choice */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-white mb-3">
                2. Select Preferred Fabric
              </label>
              <div className="space-y-2">
                {FABRIC_CHOICES.map((f) => (
                  <label
                    key={f}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-colors ${
                      fabric === f
                        ? 'border-[#0B2D7F] bg-[#FFFEFE] dark:bg-neutral-800 dark:border-amber-400'
                        : 'border-ink-200 dark:border-white/10 text-ink-700 dark:text-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="fabric"
                      checked={fabric === f}
                      onChange={() => setFabric(f)}
                      className="accent-[#0B2D7F]"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Craft Choice */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-white mb-3">
                3. Traditional Craft & Accent
              </label>
              <div className="space-y-2">
                {CRAFT_CHOICES.map((c) => (
                  <label
                    key={c}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-colors ${
                      craft === c
                        ? 'border-[#0B2D7F] bg-[#FFFEFE] dark:bg-neutral-800 dark:border-amber-400'
                        : 'border-ink-200 dark:border-white/10 text-ink-700 dark:text-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="craft"
                      checked={craft === c}
                      onChange={() => setCraft(c)}
                      className="accent-[#0B2D7F]"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Measurements */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-white mb-3">
                4. Your Body Measurements (Inches)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[11px] text-ink-500 block mb-1">Bust (in)</span>
                  <input
                    type="text"
                    placeholder="e.g. 38"
                    value={measurements.bust}
                    onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-ink-500 block mb-1">Waist (in)</span>
                  <input
                    type="text"
                    placeholder="e.g. 32"
                    value={measurements.waist}
                    onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-ink-500 block mb-1">Hips (in)</span>
                  <input
                    type="text"
                    placeholder="e.g. 42"
                    value={measurements.hips}
                    onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-ink-500 block mb-1">Length (in)</span>
                  <input
                    type="text"
                    placeholder="e.g. 48"
                    value={measurements.length}
                    onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                  />
                </div>
              </div>
            </div>

            {/* 5. Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-ink-500 block mb-1">Your Name</span>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                />
              </div>
              <div>
                <span className="text-[11px] text-ink-500 block mb-1">WhatsApp Number</span>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                />
              </div>
            </div>

            {/* 6. Notes */}
            <div>
              <span className="text-[11px] text-ink-500 block mb-1">Specific Requests (Feeding Zippers, Pockets, Neckline Depth)</span>
              <textarea
                rows={3}
                placeholder="Mention any custom sleeve style, pocket requests or specific event date..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} />
              <span>Submit Custom Brief to Master Tailor</span>
            </button>
          </form>
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
