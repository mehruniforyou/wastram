'use client';

import React from 'react';
import StyleHubSectionHeader from './StyleHubSectionHeader';

interface WholesaleOffer {
  id: string;
  code: string;
  title: string;
  description: string;
  benefit: string;
  validity: string;
}

const OFFERS: WholesaleOffer[] = [
  {
    id: 'tier-20',
    code: 'TIER-20',
    title: 'Boutique Starter Slab',
    description:
      'Curate your first seasonal drop with flexible mixed-category bundles. Includes complimentary fabric swatch decks.',
    benefit: 'Special wholesale rates from 20 pcs per silhouette',
    validity: 'Active for all registered boutiques',
  },
  {
    id: 'tier-30',
    code: 'TIER-30',
    title: 'Custom Dye & Private Label',
    description:
      'Volume production with bespoke pantone matching, custom woven neckline labels, and retail-ready poly-packaging.',
    benefit: 'Dedicated atelier line from 50 pcs per colorway',
    validity: 'Priority workshop scheduling',
  },
  {
    id: 'export-vip',
    code: 'EXPORT-VIP',
    title: 'Global Air Freight Logistics',
    description:
      'Doorstep duty-paid express delivery to boutique clients across the USA, UK, UAE, Australia, and European Union.',
    benefit: '5-7 business days air transit with customs clearance',
    validity: 'Comprehensive export documentation',
  },
];

export default function StyleHubOffers() {
  const handleClaimOffer = (offer: WholesaleOffer) => {
    const text = `Hello Wastram Jaipur Atelier, I would like to inquire about your wholesale tier: [${offer.code}] ${offer.title}. Please provide terms and wholesale lookbook.`;
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="container-x mt-24 md:mt-32">
      <StyleHubSectionHeader
        eyebrow="Offers & Sourcing Terms"
        title="Currently at the boutique"
        cta="All wholesale terms"
        to="/offers"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="border border-foreground/10 p-8 bg-card flex flex-col justify-between hover:border-foreground/30 transition-colors"
            data-testid={`home-offer-${offer.id}`}
          >
            <div>
              <div className="eyebrow gold font-mono tracking-widest">
                {offer.code}
              </div>
              <h3 className="font-display text-2xl md:text-3xl mt-3 text-foreground leading-snug">
                {offer.title}
              </h3>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed font-body">
                {offer.description}
              </p>

              <div className="mt-4 p-3 bg-secondary/60 border border-foreground/5 text-xs text-foreground/90 font-medium">
                ✦ {offer.benefit}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-foreground/10 flex items-center justify-between">
              <span className="text-[11px] text-foreground/50 uppercase tracking-wider">
                {offer.validity}
              </span>
              <button
                type="button"
                onClick={() => handleClaimOffer(offer)}
                className="text-xs uppercase tracking-widerest font-medium link-underline text-foreground cursor-pointer"
              >
                Claim Terms →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
