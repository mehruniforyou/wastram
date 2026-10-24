import React from 'react';
import { Eye, Layers, MessageCircle, HelpCircle, ShieldCheck } from 'lucide-react';

export default function WhyEnquire() {
  const points = [
    {
      icon: Eye,
      title: 'Discover Available Collections in One Place',
      description: 'Explore over 130 genuine catalogue designs with real photography, avoiding guesswork or stock imagery.'
    },
    {
      icon: Layers,
      title: 'Explore Designs by Category & Silhouette',
      description: 'Seamlessly compare 3-piece sets, ethnic co-ords, tiered dresses, kurtas, lehengas, and satin shirts.'
    },
    {
      icon: MessageCircle,
      title: 'Enquire Directly About Individual Products',
      description: 'Every product card and detail page connects to WhatsApp with the exact style code and fabric prefilled.'
    },
    {
      icon: HelpCircle,
      title: 'Discuss Wholesale Requirements Transparently',
      description: 'Clarify order minimums, size assortments, lead times, sample availability, and export paperwork directly.'
    },
    {
      icon: ShieldCheck,
      title: 'Direct Access via Dedicated WhatsApp Line',
      description: 'Skip rigid enquiry portals. Chat in real time with our knowledgeable Jaipur coordination team.'
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-ivory/60 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest">
            Buyer Centric Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy tracking-tight">
            Why Enquire with Wastram?
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-charcoal-muted text-sm sm:text-base">
            Designed specifically for international and domestic wholesale buyers who value clarity, direct communication, and genuine textile quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-subtle hover:shadow-card transition-all duration-300 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blush-50 flex items-center justify-center border border-blush-200/60">
                    <Icon className="w-6 h-6 text-navy" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-navy leading-snug">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                    {pt.description}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-[11px] font-mono font-semibold text-gold">0{idx + 1} / BENEFIT</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
