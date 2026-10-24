import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function WholesaleIntro() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.international());

  const highlights = [
    'Export-oriented manufacturing hub rooted in Jaipur, Rajasthan',
    'Carefully curated women’s ethnic wear, co-ords, dresses & satin shirts',
    'Transparent wholesale dialogue directly through dedicated WhatsApp export desk',
    'Flexible initial order quantities for international boutique trial runs',
    'Fabric integrity assurance: pure cotton 60:60, Chanderi, rayon & silk blends',
    'Custom packaging and consolidated air/sea dispatch coordination'
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                <Image
                  src="/images/hero/hero-coords.jpg"
                  alt="Wastram Ethnic Co-Ord Set Wholesale"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white mt-8">
                <Image
                  src="/images/hero/hero-satin.jpg"
                  alt="Wastram Luxe Satin Shirt Wholesale"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Experience Pill */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-navy text-white px-6 py-3 rounded-full shadow-xl border border-gold/40 flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span>International Wholesale & Boutique Sourcing</span>
            </div>
          </div>

          {/* Right Column: Editorial Text & Benefits */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gold uppercase tracking-widest">
                International Sourcing Desk
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy tracking-tight leading-tight">
                Your Partner for Indian Women's Wear Sourcing
              </h2>
            </div>

            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
              Browse our collections and contact us to discuss wholesale requirements, product availability, order quantities and international sourcing enquiries.
            </p>

            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Whether you are an independent fashion boutique owner in London, an ethnic wear distributor in Dubai, or a multi-brand retailer in New York, Wastram delivers reliable production consistency, authentic Indian artisanal craft, and direct manufacturer pricing.
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {highlights.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-navy hover:bg-navy-700 text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-subtle hover:shadow-card transition-all"
              >
                <MessageCircle className="w-4 h-4 text-gold fill-gold/20" />
                <span>Discuss Wholesale Requirements</span>
              </a>

              <Link
                href="/wholesale-exports"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-navy hover:text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase py-3.5 transition-colors"
              >
                <span>Read Export Details</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
