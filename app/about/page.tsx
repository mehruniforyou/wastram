import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'About Wastram | Indian Women’s Wear Manufacturer & Wholesale Supplier',
  description:
    'Learn about Wastram, an export-oriented Indian women’s clothing manufacturer based in Jaipur, Rajasthan. Supplying handcrafted ethnic wear, co-ords, and dresses to global boutiques and wholesalers.',
  alternates: {
    canonical: `${siteConfig.productionDomain}/about`,
  },
};

export default function AboutPage() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-charcoal-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <span className="text-navy font-semibold">About Wastram</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blush-50 border border-blush-200 text-navy text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Our Craft & Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy tracking-tight leading-tight">
            Rooted in Jaipur's Textile Legacy, Designed for Global Markets
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-charcoal-muted text-base sm:text-lg leading-relaxed">
            Wastram is an Indian women's wear manufacturer and wholesale supplier dedicated to bridging centuries of Rajasthani textile artistry with contemporary international fashion.
          </p>
        </div>

        {/* Narrative & Craft Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold text-gold uppercase tracking-widest">
              Jaipur, Rajasthan
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy">
              Craftsmanship Centred in the Sanganer Textile Hub
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-charcoal-muted leading-relaxed">
              <p>
                From the historic craft clusters of Sanganer and Jaipur, Rajasthan, Wastram creates women's clothing collections celebrating traditional hand-block motifs, delicate zari embroidery, authentic Farshi salwars, and vibrant dyed textiles.
              </p>
              <p>
                Every collection we develop is tailored for commercial longevity. We select export-grade pure cotton 60:60, breathable Chanderi silks, soft slub rayons, and fluid satins that withstand international transport, retain rich colour depth, and provide luxurious drape for your end customers.
              </p>
              <p>
                As a manufacturer, our role is not merely producing garments, but acting as a reliable, transparent supply partner for overseas fashion retailers who need dependable communication, truthful fabric information, and flexible batch orders.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-navy">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Sanganer Textile District, Jaipur, Rajasthan, India</span>
            </div>
          </div>

          {/* Craft Photos */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <Image
                src="/images/about/craft-dyeing.jpg"
                alt="Artisanal Fabric Dyeing & Tie-Dye in Jaipur"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-semibold text-white">Artisanal Dyeing</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100 mt-6">
              <Image
                src="/images/about/craft-blockprint.jpg"
                alt="Traditional Jaipur Woodblock Printing Craft"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-semibold text-white">Heritage Printing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Values for Global Sourcing Partners */}
        <div className="bg-ivory/60 rounded-3xl p-8 sm:p-12 border border-gray-100 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-navy">
              Our Wholesale Commitments
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted">
              We operate with honesty, verifiable specifications, and direct communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-blush-50 flex items-center justify-center text-navy font-bold">
                1
              </div>
              <h4 className="text-base font-serif font-bold text-navy">Direct Factory Pricing</h4>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                Connect directly with our Jaipur manufacturing unit. By eliminating export agents and middle trading firms, we offer competitive volume pricing that protects your retail margins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-blush-50 flex items-center justify-center text-navy font-bold">
                2
              </div>
              <h4 className="text-base font-serif font-bold text-navy">Verified Fabric Standards</h4>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                We clearly disclose real fabric contents, whether pure 60:60 cambric cotton, Chanderi blends, or fluid satin. We do not make exaggerated or false claims about material composition.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-blush-50 flex items-center justify-center text-navy font-bold">
                3
              </div>
              <h4 className="text-base font-serif font-bold text-navy">Responsive WhatsApp Line</h4>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                International buyers do not have time for unanswered emails. Our export coordinators are available on WhatsApp to answer style queries, send live videos of garments, and discuss delivery timelines.
              </p>
            </div>
          </div>
        </div>

        {/* Conversion CTA */}
        <div className="bg-navy text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white max-w-2xl mx-auto">
            Ready to explore Indian women's wear collections for your store?
          </h3>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Contact us on WhatsApp to discuss catalogue access, MOQ, sample shipments, and wholesale pricing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-navy-900 font-semibold px-8 py-3.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-navy-900 fill-navy-900/20" />
              <span>Connect on WhatsApp</span>
            </a>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-white hover:text-gold text-xs sm:text-sm font-semibold uppercase tracking-wider py-3.5 transition-colors"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
