import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, HelpCircle, ArrowRight } from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'Wholesale & Export FAQ | Wastram Indian Women’s Wear',
  description:
    'Frequently asked questions about wholesale pricing, MOQs, fabric specifications, international shipping, samples, and WhatsApp ordering with Wastram in Jaipur.',
  alternates: {
    canonical: `${siteConfig.productionDomain}/faq`,
  },
};

export default function FaqPage() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-charcoal-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <span className="text-navy font-semibold">Frequently Asked Questions</span>
        </nav>

        {/* Reusable FAQ Accordion Component */}
        <FaqAccordion />

        {/* Additional Buyer Guidance */}
        <div className="max-w-4xl mx-auto bg-ivory rounded-3xl p-8 sm:p-10 border border-gray-100 space-y-6 text-center">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy">
            Looking for something else or need custom specifications?
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto">
            Our WhatsApp coordination team is always happy to guide first-time international buyers through fabric details, sizing recommendations, and export terms.
          </p>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-700 text-white font-semibold px-7 py-3 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-gold fill-gold/20" />
              <span>Contact Us on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
