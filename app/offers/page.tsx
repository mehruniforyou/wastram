'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import { Tag, CheckCircle2, MessageCircle } from 'lucide-react';

const OFFERS = [
  {
    code: 'TIER-20',
    title: 'Boutique Launch Slab',
    tier: 'Minimum 20 pcs',
    discount: 'Tier 1 Wholesale Rates',
    description:
      'Ideal for independent boutiques testing new silhouettes. Mix and match up to 4 styles with full standard size ranges (S through XXL).',
    perks: [
      'Complete size breakdown across S, M, L, XL, XXL',
      'Complimentary physical fabric swatch deck with order',
      'Direct WhatsApp status updates with lead cutting master',
      'Turnaround: 7-10 days production',
    ],
  },
  {
    code: 'TIER-50',
    title: 'Multi-Style Seasonal Drop',
    tier: 'Minimum 50 pcs',
    discount: 'Tier 2 Volume Slab',
    description:
      'Curated for high-traffic apparel stores. Includes custom Pantone color dipping and personalized brand neckline label insertion.',
    perks: [
      'Free customized woven boutique neck-label stitching',
      'Pantone lab-dip swatch approval prior to bulk dyeing',
      'Retail-ready individually poly-bagged garments with barcodes',
      'Priority workshop scheduling',
    ],
  },
  {
    code: 'EXPORT-VIP',
    title: 'Global Express Air Logistics',
    tier: 'Orders Over 100 pcs',
    discount: 'Doorstep Customs Cleared',
    description:
      'Comprehensive air freight supply to boutiques in the USA, UK, Canada, Australia, and GCC nations with full export compliance.',
    perks: [
      'Door-to-door express air delivery (5-7 business days transit)',
      'Certificate of Origin & GSP documentation included',
      'All export customs declaration paperwork handled by Wastram',
      'Dedicated logistics tracking concierge',
    ],
  },
  {
    code: 'SAMPLE-BOX',
    title: 'Curated Atelier Sample Trunk',
    tier: 'Sample Orders',
    discount: 'Fully Reimbursed on Bulk Order',
    description:
      'Order single physical master samples across our top 5 silhouette categories to personally evaluate fabric weight, drape, and stitch precision.',
    perks: [
      'Includes 5 showroom finish physical samples of your choice',
      'Over 40 fabric swatch cuttings of Pure Mulmul, Modal, and Chanderi',
      'Sample fee is 100% credited against your subsequent production order',
      'Dispatched within 48 hours via express air courier',
    ],
  },
];

export default function OffersPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleClaim = (offer: (typeof OFFERS)[0]) => {
    const text = `Hello Wastram Jaipur Atelier, I would like to book wholesale production under slab: [${offer.code}] ${offer.title}. Please send current price sheet and schedule.`;
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-28 pb-24">
        <div className="container-x">
          {/* Header */}
          <div className="pt-8 md:pt-12 pb-10">
            <div className="eyebrow mb-3">Wholesale Programs</div>
            <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[0.95] text-foreground">
              Sourcing Slabs &amp; Terms
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground/70 max-w-xl font-body leading-relaxed">
              Transparent, volume-tiered pricing designed for boutique retailers, resort buyers,
              and fashion labels seeking dependable Jaipur handloom production.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {OFFERS.map((offer) => (
              <div
                key={offer.code}
                className="rounded-2xl border border-ink-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-amber-400 p-8 md:p-10 bg-card shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow gold font-mono text-sm tracking-widest">
                      {offer.code}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-foreground/60 border border-foreground/10 px-2.5 py-1">
                      {offer.tier}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl md:text-3xl mt-4 text-foreground leading-snug">
                    {offer.title}
                  </h2>
                  <div className="mt-1 text-sm font-medium text-[#0B2D7F] dark:text-gold">
                    {offer.discount}
                  </div>

                  <p className="mt-4 text-sm text-foreground/75 leading-relaxed font-body">
                    {offer.description}
                  </p>

                  <div className="mt-6 pt-4 space-y-2.5">
                    {offer.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/80 font-body">
                        <CheckCircle2 size={14} className="text-[#0B2D7F] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={() => handleClaim(offer)}
                    className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
