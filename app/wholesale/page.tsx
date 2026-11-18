'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  ShieldCheck, 
  Factory, 
  MessageCircle, 
  FileText, 
  ArrowRight, 
  Check, 
  Clock, 
  Globe, 
  Tag, 
  Layers, 
  ChevronDown 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import SearchModal from '@/components/SearchModal';
import ScrollReveal from '@/components/ScrollReveal';

const WHOLESALE_PILLARS = [
  {
    icon: Factory,
    title: 'Direct Sanganer Pricing',
    desc: 'Boutiques source straight from our Jaipur factory floor. No agent commissions, distributor markups, or middleman fees.',
  },
  {
    icon: Layers,
    title: 'Low 20-Pc Flexible MOQ',
    desc: 'Freedom to mix and match any silhouette, print, and sizes (S to XXL) within a single 20-piece opening trial order.',
  },
  {
    icon: Tag,
    title: 'Private Label & Branding',
    desc: 'Woven neck labels, branded wash care tags, custom retail swing tags, and exclusive custom block carving services.',
  },
  {
    icon: Globe,
    title: 'Doorstep Air Cargo',
    desc: 'Insured express door-to-door air freight via DHL/FedEx with full commercial invoices and Certificate of Origin.',
  },
];

const WHOLESALE_TIERS = [
  {
    tier: 'Boutique Starter',
    moq: '20 – 49 Pieces',
    discount: '30% Off Retail Rates',
    turnaround: '5 – 7 Business Days',
    desc: 'Perfect for independent boutiques and new online stockists testing handcrafted Jaipur silhouettes.',
    popular: false,
    features: [
      'Mix and match any silhouettes & prints',
      'Sizes S to XXL included with zero surcharge',
      'High-definition video QC before dispatch',
      'Door-to-door tracked air freight',
      'Access to ready-to-ship stock inventory',
    ],
  },
  {
    tier: 'Concept Store',
    moq: '50 – 199 Pieces',
    discount: '42% Off Retail Rates',
    turnaround: '10 – 14 Business Days',
    desc: 'Our most favored tier for multi-brand boutiques and growing sustainable lifestyle stockists.',
    popular: true,
    features: [
      'Custom brand woven neck tags & labels',
      'Exclusive colorway & fabric swatch options',
      'Priority sample dispatch within 48 hours',
      'Dedicated export account manager on WhatsApp',
      'Free high-res photoshoot marketing assets',
    ],
  },
  {
    tier: 'Brand Label / Export',
    moq: '200+ Pieces',
    discount: '55% Off Retail Rates',
    turnaround: '18 – 24 Business Days',
    desc: 'Full-scale contract manufacturing for established fashion labels and diaspora retail chains.',
    popular: false,
    features: [
      'Bespoke pattern drafting & grading to your specs',
      'Custom teak block carving of your proprietary motifs',
      'Private barcode labeling & retail swing tags',
      'Ocean container or air freight consolidation',
      'Dedicated production line & lab dip approvals',
    ],
  },
];

const B2B_FAQS = [
  {
    q: 'Can I mix and match different styles and sizes in my 20-piece order?',
    a: 'Yes, absolutely. Our 20-piece minimum opening order allows you complete freedom to curate any mix of co-ord sets, dresses, kaftans, and traditional gowns across sizes S through XXL.',
  },
  {
    q: 'How does international shipping and customs clearance work?',
    a: 'We ship door-to-door via DHL Express and FedEx Air Cargo to over 18 countries including the USA, UK, UAE, Australia, Canada, and Europe. Every consignment includes export documentation, HS code certification, and Certificate of Origin.',
  },
  {
    q: 'Can you manufacture with our own brand labels and tags?',
    a: 'Yes. For orders of 50 pieces and above, we provide custom brand woven neck labels, care tags, and retail swing tags. You can also commission custom handblock carvings of your own exclusive motifs.',
  },
  {
    q: 'What is the payment terms and ordering workflow?',
    a: 'We operate on a standard 50% advance deposit to initiate cutting and handblock printing, and 50% balance upon final video inspection approval right before dispatch.',
  },
];

export default function WholesalePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    country: 'United Kingdom',
    estimatedVolume: '20 – 49 Pieces (Boutique Starter)',
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
• Notes / Requests: ${formData.notes || 'None'}

Please share the current wholesale catalog and wholesale price sheet.`;

    window.open(`https://wa.me/918003088838?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#12100E] text-foreground font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-32 pb-24">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                           */}
        {/* ========================================================================= */}
        <section className="container-x mb-16 md:mb-24">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="section-pill mb-4 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>B2B Global Trade · Sanganer Atelier</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0B2D7F] dark:text-white font-normal leading-[1.12] tracking-tight">
                Direct Loom Sourcing &amp;{' '}
                <span className="text-[#D4AF37] italic font-normal block sm:inline">Boutique Supply.</span>
              </h1>

              <p className="mt-5 text-xs sm:text-base text-neutral-600 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
                Direct factory manufacturing for independent boutiques, multi-brand retailers, and global fashion labels. Enjoy low 20-piece flexible MOQs, true anatomical grading S to XXL, private labeling, and doorstep air cargo.
              </p>

              {/* 4 Pillars Strip */}
              <div className="mt-10 pt-8 border-t border-neutral-200/80 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {WHOLESALE_PILLARS.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                      <Icon size={20} className="text-[#0B2D7F] dark:text-[#D4AF37] mb-2.5" />
                      <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white mb-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 2. WHOLESALE VOLUME TIERS                                                 */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="section-pill mb-3 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>Transparent Slabs</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
                Structured Volume Slabs &amp; <span className="text-[#D4AF37] italic font-normal">Factory Margins.</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Choose the scale that fits your boutique season. Upgrade anytime as your retail sell-through accelerates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {WHOLESALE_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 ${
                    tier.popular
                      ? 'bg-[#071F59] text-white shadow-2xl ring-2 ring-[#D4AF37]'
                      : 'bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-sm hover:shadow-xl'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-neutral-950 text-[10px] font-bold uppercase tracking-wider shadow-md">
                      Most Popular For Boutiques
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-serif font-bold uppercase tracking-widest block mb-1 text-[#D4AF37]">
                      {tier.tier}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-1">
                      {tier.moq}
                    </h3>
                    <p className={`text-xs font-semibold mb-2 ${tier.popular ? 'text-neutral-200' : 'text-[#0B2D7F] dark:text-[#D4AF37]'}`}>
                      {tier.discount} · {tier.turnaround}
                    </p>
                    <p className={`text-xs font-sans mb-6 ${tier.popular ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {tier.desc}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/10 dark:border-white/10 text-xs">
                      {tier.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className={tier.popular ? 'text-white/90' : 'text-neutral-700 dark:text-neutral-300'}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <a
                      href={`https://wa.me/918003088838?text=${encodeURIComponent(
                        `Hello Wastram Atelier, I am interested in your ${tier.tier} tier (${tier.moq}). Please share catalog and linesheet.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 rounded-full text-xs font-semibold text-center block transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
                        tier.popular
                          ? 'bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md'
                          : 'bg-[#0B2D7F] hover:bg-[#071F59] text-white dark:bg-[#D4AF37] dark:text-neutral-950 shadow-md shadow-[#0B2D7F]/20'
                      }`}
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 3. CATALOG REQUEST FORM                                                   */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-white/10 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-10 h-10 rounded-full bg-[#0B2D7F]/10 dark:bg-white/10 text-[#0B2D7F] dark:text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
                  <FileText size={20} />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 dark:text-white font-normal">
                  Request B2B Line Sheets &amp; Lookbook
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 font-sans">
                  Delivered on WhatsApp within 10 minutes during Jaipur atelier hours.
                </p>
              </div>

              <form onSubmit={handleRequestCatalog} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Buyer Name *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Boutique / Store Name *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bloom & Silk Boutique"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Email Address *</span>
                    <input
                      type="email"
                      required
                      placeholder="buyer@boutique.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">WhatsApp Phone *</span>
                    <input
                      type="text"
                      required
                      placeholder="+44 7123 456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Destination Country</span>
                    <input
                      type="text"
                      placeholder="e.g. United Kingdom, USA, UAE, Australia"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Target Volume Slab</span>
                    <select
                      value={formData.estimatedVolume}
                      onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                    >
                      <option value="20 – 49 Pieces (Boutique Starter)">20 – 49 Pieces (Boutique Starter)</option>
                      <option value="50 – 199 Pieces (Concept Store)">50 – 199 Pieces (Concept Store)</option>
                      <option value="200+ Pieces (Brand Label / Export)">200+ Pieces (Brand Label / Export)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Special Notes / Silhouette Inquiries</span>
                  <textarea
                    rows={2}
                    placeholder="Mention specific categories of interest (e.g. Co-ords, Kaftans, Gowns) or required delivery date..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white dark:bg-[#D4AF37] dark:text-neutral-950 dark:hover:bg-[#C5A059] font-semibold text-sm transition-all shadow-md shadow-[#0B2D7F]/25 flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-95"
                >
                  <MessageCircle size={16} />
                  <span>Submit</span>
                </button>
              </form>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 4. B2B TRADE FAQS ACCORDION                                               */}
        {/* ========================================================================= */}
        <section className="container-x mb-20 md:mb-28">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <div className="section-pill mb-3 mx-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                  <span>B2B Clarity</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 dark:text-white font-normal">
                  Frequently Asked Trade Questions
                </h2>
              </div>

              <div className="space-y-3">
                {B2B_FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="font-serif text-base font-medium text-neutral-900 dark:text-white">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`text-neutral-500 transition-transform duration-300 shrink-0 ${
                            isOpen ? 'rotate-180 text-[#0B2D7F] dark:text-[#D4AF37]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed border-t border-neutral-100 dark:border-white/5 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 5. RAJASTHAN RAMPART CTA BANNER                                           */}
        {/* ========================================================================= */}
        <section className="container-x">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden bg-[#071F59] text-white p-8 sm:p-14 lg:p-16 shadow-2xl text-center">
              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 text-[#D4AF37] border border-white/15 mb-4">
                  ✦ Direct Loom Partnership
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-4">
                  Ready to Stock Authentic Sanganer{' '}
                  <span className="text-[#D4AF37] italic font-normal">in Your Boutique?</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans mb-8">
                  Connect directly with our export desk on WhatsApp to review current ready stock, order samples, and receive factory line sheets.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <a
                    href="https://wa.me/918003088838?text=Hello%20Wastram%20Jaipur%2C%20I%20would%20like%20to%20discuss%20a%20wholesale%20boutique%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href="/lookbook"
                    className="px-8 py-3.5 rounded-full bg-white text-[#071F59] hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Explore</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <SizeGuideModal />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
