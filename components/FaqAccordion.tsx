'use client';

import React, { useState } from 'react';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Do you accept wholesale and international export enquiries?',
      answer:
        'Yes. Wastram works directly with domestic and international clothing retailers, fashion boutiques, wholesalers, and sourcing companies. We welcome enquiries from the UK, North America, Europe, the Middle East, Australia, and worldwide.',
    },
    {
      question: 'How can I enquire about a specific design or style code?',
      answer:
        'Every product on our website features an "Enquire About This Design" button. Clicking this automatically opens WhatsApp on your phone or desktop with a prefilled message containing the exact product name, style code (SKU), and category. Our export coordinator will respond with availability, specifications, and wholesale pricing.',
    },
    {
      question: 'How do I obtain current wholesale pricing?',
      answer:
        'Because wholesale pricing depends on order volumes, fabric specifications, batch sizes, and shipping destinations, we provide customized price quotes directly upon enquiry. Please contact us on WhatsApp with the specific products and estimated quantities you are considering.',
    },
    {
      question: 'What is your Minimum Order Quantity (MOQ)?',
      answer:
        'We understand that independent fashion boutiques and new retail partners often need flexible batch sizes. We discuss order minimums on a case-by-case basis depending on whether the garments are currently in stock or scheduled for fresh production runs. Contact us on WhatsApp to discuss your required assortment.',
    },
    {
      question: 'Can I enquire and order from outside India?',
      answer:
        'Absolutely. A substantial portion of our wholesale enquiries originate from international buyers seeking authentic, export-quality Indian women\'s wear. We communicate fluently in international English and assist with export packing and international freight options.',
    },
    {
      question: 'What product information is available for each garment?',
      answer:
        'Our catalogue displays verified garment types, silhouettes, fabric compositions (such as pure cotton 60:60, Chanderi silk, slub rayon, and chiffon), size ranges (standard M to 3XL or XS to 7XL depending on design), and style references. Additional detail photos and measurements can be shared directly via WhatsApp.',
    },
    {
      question: 'How can I discuss international shipping and delivery?',
      answer:
        'We can coordinate international air courier or consolidated sea freight depending on your order timeline and destination country. Please share your delivery country and postal code when you contact us on WhatsApp so we can provide realistic freight estimates.',
    },
    {
      question: 'Can I request product samples before placing a bulk order?',
      answer:
        'Yes, sample pieces can be arranged for serious commercial buyers to verify stitching standards, fabric drape, and sizing before committing to larger production orders. Enquire directly on WhatsApp to coordinate sample availability.',
    },
  ];

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappGeneralUrl = buildWhatsAppLink(whatsappMessages.general());

  return (
    <section className="py-16 lg:py-24 bg-ivory/40 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-50 border border-blush-200 text-navy text-xs font-semibold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-gold" />
            <span>Buyer Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-charcoal-muted text-sm sm:text-base">
            Everything you need to know about browsing our collections, requesting wholesale pricing, and discussing export requirements.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-subtle overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-hidden focus:bg-blush-50/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-serif font-semibold text-navy pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-navy/5 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-gold/20' : ''
                    }`}
                  >
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-gold' : 'text-navy'}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-charcoal-muted leading-relaxed border-t border-gray-50">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? WhatsApp Box */}
        <div className="mt-10 p-6 bg-white rounded-2xl border border-gold/30 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-serif font-bold text-navy">
              Have a custom requirement or specific question?
            </h4>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Chat directly with our export desk on WhatsApp for instant assistance.
            </p>
          </div>
          <a
            href={whatsappGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-gold fill-gold/20" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
