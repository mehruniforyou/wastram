'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Factory, MessageCircle, FileText, ArrowRight, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';

const TIERS = [
  {
    tier: 'Boutique Starter',
    moq: '20 – 49 Pieces',
    discount: '30% off retail pricing',
    turnaround: '5 – 7 business days',
    features: [
      'Mix and match any silhouettes',
      'Sizes S to XXL included',
      'Quality check inspection video',
      'Door-to-door air freight tracking',
    ],
  },
  {
    tier: 'Concept Store',
    moq: '50 – 199 Pieces',
    discount: '42% off retail pricing',
    turnaround: '10 – 14 business days',
    features: [
      'Custom brand woven neck tags',
      'Exclusive colorway choices',
      'Priority sample dispatch',
      'Dedicated export account manager',
    ],
    popular: true,
  },
  {
    tier: 'Brand Label / Export',
    moq: '200+ Pieces',
    discount: '55% off retail pricing',
    turnaround: '18 – 24 business days',
    features: [
      'Bespoke pattern development',
      'Custom block carving of your motifs',
      'Private barcode & retail swing tags',
      'Sea or air cargo container options',
    ],
  },
];

export default function WholesalePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    country: 'United Kingdom',
    estimatedVolume: '20-50 pieces',
    notes: '',
  });

  const handleRequestCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Wastram Export Atelier, I would like to request the B2B Wholesale Catalog & Line Sheets:
• Store / Boutique: ${formData.storeName || 'Independent Retailer'}
• Buyer Name: ${formData.name || 'Buyer'}
• Email: ${formData.email || 'N/A'}
• WhatsApp: ${formData.phone || 'N/A'}
• Destination Country: ${formData.country}
• Estimated Order Volume: ${formData.estimatedVolume}
• Notes: ${formData.notes || 'None'}`;

    window.open(`https://wa.me/918003088838?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-neutral-900 selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-8 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="section-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>B2B Global Supply</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#0B2D7F] dark:text-white font-normal leading-tight">
            Wholesale Sourcing &amp; <span className="text-[#D4AF37] italic font-normal">Boutique Supply.</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto">
            Direct Jaipur factory production for independent fashion boutiques, multi-brand retailers, and global diaspora labels.
          </p>
        </div>

        {/* Pricing & Volume Slabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 ${
                tier.popular
                  ? 'bg-neutral-950 text-white shadow-xl hover:shadow-2xl border-2 border-neutral-700 hover:border-neutral-500'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white text-neutral-950 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Most Popular For Boutiques
                </div>
              )}

              <div>
                <span className="text-xs font-serif font-bold uppercase tracking-wider block mb-1 opacity-80">
                  {tier.tier}
                </span>
                <h3 className="font-serif text-2xl font-bold mb-1">
                  {tier.moq}
                </h3>
                <p className={`text-xs mb-6 font-semibold ${tier.popular ? 'text-neutral-300' : 'text-neutral-900 dark:text-neutral-200'}`}>
                  {tier.discount}
                </p>

                <div className="space-y-3 pt-4 text-xs">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check size={14} className={tier.popular ? 'text-white' : 'text-neutral-900 dark:text-white'} />
                      <span className="opacity-90">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href={`https://wa.me/918003088838?text=${encodeURIComponent(
                    `Hello Wastram, I am interested in your ${tier.tier} wholesale tier (${tier.moq}). Please share catalog.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-full text-xs font-semibold text-center block transition-colors ${
                    tier.popular
                      ? 'bg-white hover:bg-neutral-100 text-neutral-950'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200'
                  }`}
                >
                  Inquire for Tier
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Catalog Request Form */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-white/10 shadow-md">
          <div className="text-center mb-8">
            <FileText size={24} className="text-neutral-800 dark:text-neutral-200 mx-auto mb-2" />
            <h3 className="font-serif text-2xl text-neutral-900 dark:text-white font-normal">
              Request B2B Line Sheets &amp; Catalog
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Received via WhatsApp within 10 minutes during atelier business hours.
            </p>
          </div>

          <form onSubmit={handleRequestCatalog} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-ink-500 block mb-1">Your Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                />
              </div>
              <div>
                <span className="text-[11px] text-ink-500 block mb-1">Boutique / Store Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bloom & Silk Boutique"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-ink-500 block mb-1">Email</span>
                <input
                  type="email"
                  required
                  placeholder="buyer@boutique.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                />
              </div>
              <div>
                <span className="text-[11px] text-ink-500 block mb-1">WhatsApp Phone Number</span>
                <input
                  type="text"
                  required
                  placeholder="+44 7123 456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-ink-500 block mb-1">Destination Country</span>
              <input
                type="text"
                placeholder="e.g. United States, United Kingdom, Australia, UAE, India"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <MessageCircle size={16} />
              <span>Request Wholesale Line Sheets via WhatsApp</span>
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
