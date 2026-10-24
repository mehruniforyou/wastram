import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, MapPin, Globe, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';
import { categories } from '@/data/categories';

export default function Footer() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());
  const whatsappInternationalUrl = buildWhatsAppLink(whatsappMessages.international());

  return (
    <footer className="bg-navy text-white pt-16 pb-10 border-t-2 border-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info & Mission (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block" aria-label="Wastram Home">
              <div className="relative h-14 w-56">
                <Image
                  src="/images/brand/wastram-logo-footer.png"
                  alt="Wastram - Indian Women's Wear Wholesale & Export"
                  fill
                  sizes="224px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Wastram is an export-focused Indian women's wear manufacturer and wholesale supplier based in Jaipur, Rajasthan.
              We partner with international fashion boutiques, clothing wholesalers, and retailers across the UK, USA, Europe, the Middle East, and worldwide.
            </p>

            <div className="flex flex-col space-y-2.5 text-xs text-gray-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Textile Craft Hub, Sanganer, Jaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold flex-shrink-0" />
                <span>International B2B Wholesale & Worldwide Air/Sea Export Enquiries</span>
              </div>
            </div>

            {/* Direct WhatsApp Action Box */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-gold hover:bg-gold-600 text-navy-900 font-semibold px-5 py-3 rounded-full text-xs sm:text-sm tracking-wide transition-all shadow-md group"
              >
                <MessageCircle className="w-4 h-4 text-navy-900 fill-navy-900/20 group-hover:scale-110 transition-transform" />
                <span>Enquire via WhatsApp: {siteConfig.whatsappDisplay}</span>
              </a>
            </div>
          </div>

          {/* Product Categories (Col 3) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-gold uppercase font-serif">
              Our Collections
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="hover:text-gold transition-colors inline-block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/collections"
                  className="text-xs font-medium text-blush-300 hover:text-white transition-colors pt-1 block"
                >
                  View Complete Catalogue &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation (Col 4) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-gold uppercase font-serif">
              Wholesale & Business
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Our Craft & Heritage
                </Link>
              </li>
              <li>
                <Link href="/wholesale-exports" className="hover:text-gold transition-colors">
                  Wholesale & International Exports
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  Wholesale FAQ & Process
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Wholesale Department
                </Link>
              </li>
              <li>
                <a
                  href={whatsappInternationalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blush-300 hover:text-white transition-colors block"
                >
                  International Buyer Consultation &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Export Assurance (Col 5) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-gold uppercase font-serif">
              Export Assurance
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="bg-navy-800/80 p-3.5 rounded-lg border border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Genuine Factory Direct</span>
                </div>
                <p className="text-gray-400 leading-normal">
                  No intermediaries. Deal directly with our production facility in Jaipur for reliable pricing and fabric consistency.
                </p>
              </div>

              <div className="bg-navy-800/80 p-3.5 rounded-lg border border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <Sparkles className="w-4 h-4 text-blush" />
                  <span>Verified Indian Craftsmanship</span>
                </div>
                <p className="text-gray-400 leading-normal">
                  Chanderi, pure cotton 60:60, Farshi salwars, zari work, handblock motifs and premium satin shirts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</span>
            <span>Made in Jaipur, India for Global Boutiques & Wholesalers.</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-gray-200 transition-colors">
              About
            </Link>
            <Link href="/wholesale-exports" className="hover:text-gray-200 transition-colors">
              Exports
            </Link>
            <Link href="/faq" className="hover:text-gray-200 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-gray-200 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
