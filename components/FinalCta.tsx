import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function FinalCta() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());

  return (
    <section className="relative py-20 lg:py-24 bg-navy text-white overflow-hidden">
      {/* Subtle luxury glow backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blush/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold text-xs font-semibold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct Manufacturer Partnership</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Looking for Indian Women's Wear for Your Business?
        </h2>

        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Explore our collections and contact us to discuss your wholesale requirements, product availability, order quantities, and international delivery.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-600 text-navy-900 font-semibold px-9 py-4 rounded-full text-sm tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            <MessageCircle className="w-5 h-5 text-navy-900 fill-navy-900/20 group-hover:scale-110 transition-transform" />
            <span>Contact Us via WhatsApp</span>
          </a>

          <Link
            href="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full text-sm tracking-wider uppercase border border-white/30 hover:border-white transition-all duration-300"
          >
            <span>Browse Complete Catalogue</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

        {/* Direct number reminder */}
        <p className="text-xs text-gray-400 pt-4">
          Direct Line & WhatsApp:{' '}
          <span className="text-gold font-mono font-semibold">{siteConfig.whatsappDisplay}</span>
          {' '}&bull; Export Hub: Jaipur, Rajasthan, India
        </p>

      </div>
    </section>
  );
}
