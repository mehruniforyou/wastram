import React from 'react';
import { Package, MessageCircle, Layers, Globe, Sparkles } from 'lucide-react';

export default function TrustStrip() {
  const benefits = [
    {
      icon: Sparkles,
      title: 'Indian Ethnic Collections',
      description: 'Chanderi suits, co-ords, tiered dresses, kurtas & festive lehengas',
    },
    {
      icon: Package,
      title: 'Direct Wholesale Enquiries',
      description: 'Transparent communication for boutique stockists & importers',
    },
    {
      icon: Layers,
      title: 'Curated Catalogue Browsing',
      description: 'Detailed category views with authentic studio photography',
    },
    {
      icon: MessageCircle,
      title: 'Direct Buyer Dialogue',
      description: 'Instant WhatsApp discussions on pricing, MOQ & customization',
    },
    {
      icon: Globe,
      title: 'Global Sourcing Desk',
      description: 'Catering to fashion businesses in the UK, USA, Europe & worldwide',
    },
  ];

  return (
    <section className="bg-white border-b border-gray-100 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-ivory/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blush-50 flex items-center justify-center flex-shrink-0 border border-blush-200/50">
                  <Icon className="w-5 h-5 text-navy" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-navy tracking-wide font-serif">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
