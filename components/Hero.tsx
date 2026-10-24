import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight, Sparkles, Shield, Globe2 } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function Hero() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ivory via-white to-white py-12 lg:py-20 border-b border-gray-100">
      {/* Decorative Blush & Navy Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blush-100/60 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-50/60 rounded-full blur-3xl -z-10 pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Conversion Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush-50 border border-blush-200/80 text-navy text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>International Wholesale & Export Collections</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-navy tracking-tight leading-[1.15]">
              Indian Women's Wear, <br className="hidden sm:inline" />
              <span className="text-blush-500 italic font-normal">Made for Global Markets</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Explore our women's wear collections for wholesale buyers, fashion retailers and international sourcing partners. Discover designs from India and connect with us directly to discuss your requirements.
            </p>

            {/* Primary & Secondary Call To Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-navy hover:bg-navy-700 text-white px-7 py-4 rounded-full text-sm font-semibold tracking-wider uppercase shadow-card hover:shadow-card-hover transition-all duration-300 border-2 border-navy group"
              >
                <MessageCircle className="w-4 h-4 text-gold fill-gold/20 group-hover:scale-110 transition-transform" />
                <span>Contact Us</span>
              </a>

              <Link
                href="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-blush-50 text-navy hover:text-navy-700 px-7 py-4 rounded-full text-sm font-semibold tracking-wider uppercase border border-gray-200 hover:border-blush-300 transition-all duration-300 shadow-xs"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>

            {/* Quick Sourcing Badges */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gold" />
                  <span>Jaipur Craft</span>
                </div>
                <p className="text-xs text-gray-500">Authentic Sanganer roots</p>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-gold" />
                  <span>Global Export</span>
                </div>
                <p className="text-xs text-gray-500">Air & sea dispatch</p>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-gold" />
                  <span>Fast WhatsApp</span>
                </div>
                <p className="text-xs text-gray-500">Direct buyer dialogue</p>
              </div>
            </div>
          </div>

          {/* Right Column: Large High-Fashion Photography Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Fashion Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/hero/hero-main.jpg"
                  alt="Wastram Premium Indian Women's Wear - Royal Chanderi Anarkali Suit Set"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                
                {/* Elegant overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-gold/30 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-gold">Featured Heritage Ensemble</p>
                      <h2 className="text-sm font-serif font-bold text-navy">Royal Chanderi Anarkali Suit</h2>
                      <p className="text-xs text-charcoal-muted">Handcrafted Farshi Salwar & Zari Dupatta</p>
                    </div>
                    <span className="text-[11px] font-semibold text-navy bg-blush-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      Wholesale Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Floating Floating Accent Card */}
              <div className="hidden sm:block absolute -top-6 -right-6 w-36 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border-3 border-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/images/hero/hero-coords.jpg"
                  alt="Wastram Designer Cotton Co-Ord Set"
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent flex items-end p-2">
                  <p className="text-[10px] font-semibold text-white tracking-wide">Ethnic Co-Ords</p>
                </div>
              </div>

              {/* Third Floating Floating Accent Card */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 w-32 sm:w-40 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border-3 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/images/hero/hero-dress.jpg"
                  alt="Wastram Tiered Floral Chiffon Dress"
                  fill
                  sizes="(max-width: 640px) 128px, 160px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent flex items-end p-2">
                  <p className="text-[10px] font-semibold text-white tracking-wide">Tiered Dresses</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
