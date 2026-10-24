import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, MapPin, Globe, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'Contact Us | Wholesale Enquiries & Export Desk',
  description:
    'Contact Wastram for Indian women’s wear wholesale enquiries, export catalogue access, sample requests, and international freight discussion. Connect directly on WhatsApp.',
  alternates: {
    canonical: `${siteConfig.productionDomain}/contact`,
  },
};

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());
  const whatsappInternationalUrl = buildWhatsAppLink(whatsappMessages.international());

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-charcoal-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <span className="text-navy font-semibold">Contact Wholesale Desk</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blush-50 border border-blush-200 text-navy text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Direct Manufacturer Communication</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy tracking-tight leading-tight">
            Connect with Wastram Wholesale
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
            We are dedicated to responsive, personal communication with international and domestic boutique buyers, wholesalers, and sourcing companies.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct WhatsApp & Business Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary WhatsApp Card */}
            <div className="bg-gradient-to-br from-navy via-navy to-navy-800 text-white p-7 sm:p-8 rounded-3xl shadow-xl border border-gold/30 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center border border-gold/40">
                <MessageCircle className="w-6 h-6 text-gold fill-gold/20" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gold uppercase tracking-widest">
                  Fastest Communication Channel
                </span>
                <h3 className="text-2xl font-serif font-bold text-white">
                  WhatsApp Export Desk
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">
                  Connect directly with our Jaipur team to request catalogues, discuss volume pricing, and coordinate sample pieces in real time.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-600 text-navy-900 py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md group"
                >
                  <MessageCircle className="w-4 h-4 text-navy-900 fill-navy-900/20 group-hover:scale-110 transition-transform" />
                  <span>Start WhatsApp Chat ({siteConfig.whatsappDisplay})</span>
                </a>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>Mon – Sat: 9:30 AM – 7:30 PM IST</span>
                </span>
                <span className="text-gold font-medium">Quick Response</span>
              </div>
            </div>

            {/* Production Origin Info */}
            <div className="bg-ivory/60 p-6 rounded-3xl border border-gray-100 space-y-4 text-xs sm:text-sm">
              <h4 className="font-serif font-bold text-navy text-base">
                Manufacturing & Dispatch Base
              </h4>

              <div className="flex items-start gap-3 text-charcoal">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy">Wastram Manufacturing Facility</p>
                  <p className="text-charcoal-muted">
                    Sanganer Textile District, Jaipur, Rajasthan 302029, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-charcoal">
                <Globe className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy">International Export Coverage</p>
                  <p className="text-charcoal-muted">
                    Direct shipping worldwide across the UK, USA, Canada, GCC / Middle East, Europe & Australia.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-charcoal">
                <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy">Manufacturer Guarantee</p>
                  <p className="text-charcoal-muted">
                    Direct wholesale pricing, export-standard packaging, and transparent textile disclosures.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Wholesale Enquiry Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}
