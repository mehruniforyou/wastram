'use client';

import React from 'react';
import Link from 'next/link';
import WastramLogo from './WastramLogo';

export default function Footer() {
  return (
    <footer className="w-full max-w-full overflow-hidden bg-[#FAF9F6] text-[#0B2D7F] pt-16 pb-12 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
        {/* Brand Centerpiece (Horizontal Brand Logo) */}
        <div className="flex flex-col items-center gap-3">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity" aria-label="Wastram Home">
            <WastramLogo variant="horizontal" className="h-10 sm:h-12 md:h-14 w-auto max-w-[280px] sm:max-w-[340px]" priority />
          </Link>
          <span className="font-serif italic text-sm md:text-base text-[#D4AF37] tracking-wider">
            Authentic Indian Textiles &amp; Contemporary Luxury
          </span>
          <div className="w-16 h-[1px] bg-[#D4AF37]/50 mt-1" />
        </div>

        {/* Minimal Curated Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-4xl text-left">
          {/* Column 1: Collections */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.15em] text-[#0B2D7F]">
              Collections
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-sans text-[#0B2D7F]/80">
              <li><Link href="/collections/western-dresses" className="hover:text-[#4A7BC6] transition-colors">Western Dresses</Link></li>
              <li><Link href="/collections/denim-collection" className="hover:text-[#4A7BC6] transition-colors">Denim Collection</Link></li>
              <li><Link href="/collections/ethnic-wear-sets" className="hover:text-[#4A7BC6] transition-colors">Ethnic Wear</Link></li>
              <li><Link href="/collections/umbrella-dresses" className="hover:text-[#4A7BC6] transition-colors">Umbrella Dresses</Link></li>
              <li><Link href="/collections/cord-sets" className="hover:text-[#4A7BC6] transition-colors">Co-ord Sets</Link></li>
              <li><Link href="/collections/short-long-kaftan" className="hover:text-[#4A7BC6] transition-colors">Resort Kaftans</Link></li>
            </ul>
          </div>

          {/* Column 2: B2B Wholesale */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.15em] text-[#0B2D7F]">
              B2B Wholesale
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-sans text-[#0B2D7F]/80">
              <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Request Catalog</Link></li>
              <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Wholesale Pricing</Link></li>
              <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Custom Manufacturing</Link></li>
              <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Global Air &amp; Ocean Cargo</Link></li>
              <li><Link href="/collections/shop-all" className="hover:text-[#4A7BC6] transition-colors">Explore 1,400+ Styles</Link></li>
            </ul>
          </div>

          {/* Column 3: Client Care */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.15em] text-[#0B2D7F]">
              Client Care
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-sans text-[#0B2D7F]/80">
              <li><Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">Contact Concierge</Link></li>
              <li><Link href="/pages/refund-policy" className="hover:text-[#4A7BC6] transition-colors">Shipping &amp; Delivery</Link></li>
              <li><Link href="/apps/quickreturns" className="hover:text-[#4A7BC6] transition-colors">Returns &amp; Exchange</Link></li>
              <li><Link href="/pages/faqs" className="hover:text-[#4A7BC6] transition-colors">FAQs</Link></li>
              <li><Link href="/pages/terms-of-service" className="hover:text-[#4A7BC6] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Quick Connect */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.15em] text-[#0B2D7F]">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-sans text-[#0B2D7F]/85">
              <a
                href="https://wa.me/918003088838"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
              >
                <span>WhatsApp B2B Support</span>
                <span className="text-[10px]">&rarr;</span>
              </a>
              <a href="tel:+918003088838" className="hover:text-[#4A7BC6] transition-colors">
                +91 80030 88838
              </a>
              <a href="mailto:exports@wastram.com" className="hover:text-[#4A7BC6] transition-colors">
                exports@wastram.com
              </a>
              <span className="text-[11px] text-[#0B2D7F]/60 mt-1">
                Jaipur &bull; Mumbai &bull; Global Shipping
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Copyright Line */}
        <div className="pt-8 text-center text-xs text-[#0B2D7F]/60 font-sans">
          <span>&copy; {new Date().getFullYear()} WASTRAM. All Rights Reserved. Handcrafted in India.</span>
        </div>
      </div>
    </footer>
  );
}
