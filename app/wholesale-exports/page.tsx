import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Globe2, PackageCheck, Layers, FileText, Truck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'Wholesale & International Exports | Indian Women’s Wear Sourcing',
  description:
    'Dedicated international export and wholesale guide for overseas fashion retailers, boutiques, and distributors sourcing authentic Indian women’s clothing from Wastram in Jaipur.',
  alternates: {
    canonical: `${siteConfig.productionDomain}/wholesale-exports`,
  },
};

export default function WholesaleExportsPage() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.international());

  const exportServices = [
    {
      icon: Layers,
      title: 'Full Catalogue Discovery',
      description: 'Access over 130 genuine designs across Royal 3-Piece Suits, Co-Ord Sets, Tiered Dresses, Kurtas, Lehengas, and Satin Shirts with verifiable fabric specifications.'
    },
    {
      icon: MessageCircle,
      title: 'Style-Specific Direct Quotations',
      description: 'Receive volume-tiered wholesale quotes tailored to your exact order size and shipping destination directly through WhatsApp or email.'
    },
    {
      icon: PackageCheck,
      title: 'Flexible Minimum Order Quantities',
      description: 'We accommodate introductory trial orders for independent boutique owners as well as larger production runs for established importers.'
    },
    {
      icon: Truck,
      title: 'International Freight Coordination',
      description: 'We assist with air express couriers (DHL, FedEx, Aramex) for rapid boutique delivery and consolidated air/sea cargo for bulk container consignments.'
    },
    {
      icon: FileText,
      title: 'Export Documentation Assistance',
      description: 'Commercial invoices, packing lists, certificates of origin, and garment tagging prepared to simplify customs clearance in your destination country.'
    },
    {
      icon: Sparkles,
      title: 'Sample Orders & Verification',
      description: 'Order sample pieces to examine fabric drape, color fastness, and stitching quality before finalizing commercial volume production.'
    }
  ];

  const targetMarkets = [
    { region: 'United Kingdom', desc: 'Boutiques in London, Birmingham, Leicester & across the UK' },
    { region: 'North America', desc: 'Retailers across the USA (California, New York, Texas) & Canada' },
    { region: 'Middle East & GCC', desc: 'Fashion distributors in the UAE (Dubai), Qatar, Kuwait & Saudi Arabia' },
    { region: 'Europe', desc: 'Ethnic and contemporary resort boutiques across Germany, France & Netherlands' },
    { region: 'Australia & NZ', desc: 'Diaspora retailers and summer boutique stockists in Sydney & Melbourne' },
    { region: 'Southeast Asia', desc: 'Importers and fashion hubs across Singapore, Malaysia & Mauritius' }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-charcoal-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <span className="text-navy font-semibold">Wholesale & Exports</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-navy text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold text-xs font-semibold uppercase tracking-widest">
              <Globe2 className="w-3.5 h-3.5" />
              <span>International B2B Export Division</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Export Sourcing for Global Fashion Boutiques & Wholesalers
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
              Wastram connects international fashion stockists directly with authentic Indian women's wear manufacturing in Jaipur, Rajasthan. We eliminate intermediary overheads and provide direct, reliable communication on WhatsApp.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-600 text-navy-900 font-semibold px-8 py-3.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md group"
              >
                <MessageCircle className="w-4 h-4 text-navy-900 fill-navy-900/20 group-hover:scale-110 transition-transform" />
                <span>Contact Export Desk on WhatsApp</span>
              </a>

              <Link
                href="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white hover:text-gold text-xs sm:text-sm font-semibold uppercase tracking-wider py-3.5 transition-colors"
              >
                <span>Browse Available Collections</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          </div>

          {/* Decorative Background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden md:block">
            <Image
              src="/images/hero/hero-main.jpg"
              alt="Wastram Export Sourcing"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* 6 Core Export Sourcing Features */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-gold uppercase tracking-widest">
              B2B Services
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy">
              Comprehensive Wholesale Export Services
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto" />
            <p className="text-xs sm:text-sm text-charcoal-muted">
              We make sourcing from India smooth, transparent, and aligned with your business model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exportServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-ivory/50 p-6 sm:p-7 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-card transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-blush-50 flex items-center justify-center border border-blush-200">
                    <Icon className="w-6 h-6 text-navy" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-navy">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How International Ordering Works */}
        <div className="bg-ivory/80 rounded-3xl p-8 sm:p-12 border border-gray-100 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-gold uppercase tracking-widest">
              Export Workflow
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-navy">
              Simple 4-Stage Ordering Workflow
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted">
              Clear milestone progression from your initial WhatsApp inquiry to door-to-door delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2.5 shadow-xs">
              <span className="text-xs font-mono font-bold text-gold">STAGE 01</span>
              <h4 className="text-sm font-serif font-bold text-navy">Catalogue Selection</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Review designs on the website and send style codes (SKUs) of interest to our WhatsApp number.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2.5 shadow-xs">
              <span className="text-xs font-mono font-bold text-gold">STAGE 02</span>
              <h4 className="text-sm font-serif font-bold text-navy">Proforma & Quotation</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                We generate a detailed proforma quote reflecting wholesale unit costs, applicable taxes, and freight estimates.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2.5 shadow-xs">
              <span className="text-xs font-mono font-bold text-gold">STAGE 03</span>
              <h4 className="text-sm font-serif font-bold text-navy">QC & Export Packing</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Garments undergo rigorous needle inspection, measurement checks, individual polybagging, and master carton packing.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2.5 shadow-xs">
              <span className="text-xs font-mono font-bold text-gold">STAGE 04</span>
              <h4 className="text-sm font-serif font-bold text-navy">Dispatch & Tracking</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Consignment is booked with international carriers, with tracking numbers and shipping documents shared promptly.
              </p>
            </div>
          </div>
        </div>

        {/* Global Markets Welcome */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-serif font-bold text-navy">
              Serving Retailers & Wholesalers Worldwide
            </h3>
            <p className="text-xs text-charcoal-muted">
              We regularly handle enquiries from buyers across major international retail markets:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {targetMarkets.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white hover:border-gold/40 transition-colors space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <h4 className="text-sm font-semibold text-navy">{m.region}</h4>
                </div>
                <p className="text-xs text-charcoal-muted pl-6">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Conversion Banner */}
        <div className="bg-blush-50 rounded-3xl p-8 sm:p-10 border border-blush-200 text-center space-y-4">
          <h3 className="text-2xl font-serif font-bold text-navy">
            Discuss Your International Wholesale Order Today
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto">
            Connect directly with Wastram's export coordinator on WhatsApp. We provide prompt assistance with pricing, product videos, and export terms.
          </p>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-700 text-white font-semibold px-7 py-3.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-gold fill-gold/20" />
              <span>Message on WhatsApp ({siteConfig.whatsappDisplay})</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
