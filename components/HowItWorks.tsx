import React from 'react';
import { Search, MessageSquare, Handshake, ArrowRight } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function HowItWorks() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());

  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Explore the Catalogue',
      description: 'Browse our genuine collections across 7 categories. Review high-resolution imagery, silhouettes, fabric specifications, and design references.'
    },
    {
      number: '02',
      icon: MessageSquare,
      title: 'Send Your Enquiry',
      description: 'Click any "Enquire About This Design" or "Contact Us" button to start an instant WhatsApp chat prefilled with the exact items you are evaluating.'
    },
    {
      number: '03',
      icon: Handshake,
      title: 'Discuss Your Requirements',
      description: 'Confirm live product availability, volume-tiered wholesale pricing, minimum order quantities, delivery destinations, and export details directly.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 lg:mb-16">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy tracking-tight">
            How Wholesale Enquiries Work
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-charcoal-muted text-sm sm:text-base">
            We keep wholesale purchasing transparent, personal, and responsive. No complicated portals or automated dead ends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="relative bg-ivory/50 p-7 sm:p-8 rounded-2xl border border-gray-100 space-y-4 hover:bg-white hover:shadow-card transition-all duration-300"
              >
                {/* Step Number */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif font-bold text-gold">
                    {st.number}
                  </span>
                  <div className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-navy" />
                  </div>
                </div>

                <h3 className="text-lg font-serif font-bold text-navy">
                  {st.title}
                </h3>

                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  {st.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-700 text-white font-semibold px-8 py-4 rounded-full text-xs sm:text-sm tracking-wider uppercase shadow-subtle hover:shadow-card transition-all"
          >
            <span>Start Your Enquiry on WhatsApp</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </a>
        </div>

      </div>
    </section>
  );
}
