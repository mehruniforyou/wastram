'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WastramLogo from './WastramLogo';
import SocialIcons from './SocialIcons';

export default function Footer() {
  const [newsletterPhone, setNewsletterPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterPhone.trim()) return;
    setSubscribed(true);
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(
        `Hello Wastram Jaipur, please add my number (${newsletterPhone}) to your WhatsApp VIP Broadcast for new collection lookbooks and factory production alerts.`
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative w-full overflow-hidden text-[#071F59] border-t border-[#0B2D7F]/10 pt-16 pb-8 px-4 sm:px-6 lg:px-12 select-none"
      style={{
        backgroundImage: "url('/images/footer-heritage-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Translucent Warm Parchment/Ivory Wash Overlay for Maximum Text Contrast while retaining the Palace Fresco Artwork */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/96 via-[#FAF9F6]/90 to-[#FAF9F6]/85 pointer-events-none" />

      {/* Decorative Gold Accent Border at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

      <div className="relative z-10 max-w-[1560px] mx-auto flex flex-col gap-12 sm:gap-16">
        {/* ========================================================== */}
        {/* TOP VIP BROADCAST NEWSLETTER (Gulmohar Style)               */}
        {/* ========================================================== */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 backdrop-blur-md shadow-card border border-[#0B2D7F]/10 flex flex-col lg:flex-row items-center justify-between gap-6 max-w-5xl mx-auto w-full">
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-[10px] sm:text-[11px] font-jost uppercase tracking-[0.24em] text-[#D4AF37] font-semibold mb-1">
              ✦ Exclusive B2B VIP Circle ✦
            </span>
            <h3 className="text-xl sm:text-2xl font-jost font-medium uppercase tracking-[0.06em] text-[#071F59]">
              Receive New Drop Lookbooks via WhatsApp
            </h3>
            <p className="text-xs sm:text-sm font-jost text-[#666666] mt-1">
              Get notified of fresh factory drops, fabric swatches, and private trade discounts directly on WhatsApp.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <input
                type="tel"
                value={newsletterPhone}
                onChange={(e) => setNewsletterPhone(e.target.value)}
                placeholder="WhatsApp Number (with country code)"
                className="w-full px-4 py-3 rounded-full bg-[#FAF9F6] border border-[#0B2D7F]/15 focus:border-[#071F59] text-xs sm:text-sm font-jost text-[#071F59] placeholder-[#888888] outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xs sm:text-sm font-jost font-semibold uppercase tracking-[0.12em] shadow-md transition-all active:scale-95 shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.228-.588-1.782-.751-2.906-2.559-2.996-2.678-.088-.119-.716-.954-.716-1.821 0-.867.453-1.294.614-1.467.161-.173.351-.216.468-.216.117 0 .234.002.336.007.108.005.253-.041.395.3.144.347.491 1.196.533 1.282.042.086.07.187.014.3-.056.113-.085.183-.17.283-.085.1-.179.224-.256.3-.085.085-.174.178-.075.348.099.17.439.723.942 1.172.646.577 1.191.756 1.361.841.17.085.27.071.37-.044.1-.115.428-.499.542-.67.114-.171.228-.143.385-.085.157.057.994.469 1.165.555.171.085.285.128.328.2.043.072.043.418-.101.823z" />
              </svg>
              <span>Join VIP</span>
            </button>
          </form>
        </div>

        {/* ========================================================== */}
        {/* MAIN FOOTER GRID (Brand Card Left + Link Columns Right)    */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Brand Identity Box in Royal Midnight Navy (Gulmohar Style) */}
          <div className="lg:col-span-4 p-8 sm:p-9 rounded-3xl bg-[#071F59] text-white shadow-elevated border border-[#D4AF37]/30 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <Link href="/" className="inline-block" aria-label="Wastram Home">
                <WastramLogo
                  variant="horizontal"
                  className="h-10 sm:h-12 w-auto brightness-0 invert"
                  priority
                />
              </Link>

              <span className="font-serif italic text-sm text-[#D4AF37] tracking-wider">
                Authentic Indian Textiles &amp; Contemporary Luxury
              </span>

              <p className="text-xs font-jost text-white/80 leading-relaxed">
                Wastram is a premier Indian textile manufacturer and haute apparel atelier based in Jaipur. We curate handcrafted women’s wear sets, kalidar anarkalis, designer co-ords, and luxury kaftans for fashion boutiques across 40+ countries.
              </p>

              {/* Direct Contact Info */}
              <div className="flex flex-col gap-2.5 text-xs font-jost text-white/90 pt-3 border-t border-white/10">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#D4AF37] text-sm">📍</span>
                  <span>Sanganer Textile Craft Hub, Jaipur, Rajasthan 302029, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#25D366] text-sm">💬</span>
                  <a href="https://wa.me/918003088838" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    WhatsApp: +91 80030 88838
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#D4AF37] text-sm">✉️</span>
                  <a href="mailto:exports@wastram.com" className="hover:underline">
                    Email: exports@wastram.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Icons & WhatsApp Button */}
            <div className="flex flex-col gap-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-jost uppercase tracking-[0.14em] text-[#D4AF37] font-semibold">
                  Follow Atelier:
                </span>
                <SocialIcons
                  iconSize={15}
                  className="flex items-center gap-2"
                  itemClassName="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D4AF37] text-white hover:text-[#071F59] transition-all flex items-center justify-center cursor-pointer shadow-xs"
                />
              </div>

              <a
                href="https://wa.me/918003088838?text=Hello%20Wastram%20Jaipur,%20I%20would%20like%20to%20connect%20with%20your%20Merchandising%20Desk."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-jost font-semibold text-xs uppercase tracking-[0.12em] shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Chat with Head Merchandiser</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right Columns (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#0B2D7F]/10 shadow-soft">
            {/* Column 1: Top Categories with Pill Header */}
            <div className="flex flex-col gap-3.5">
              <div className="inline-block px-3 py-1 rounded-full bg-[#071F59] text-white text-[10px] font-jost font-semibold uppercase tracking-[0.14em] w-max">
                Top Categories
              </div>
              <ul className="flex flex-col gap-2 text-xs font-jost text-[#444444]">
                <li><Link href="/collections/ethnic-wear-sets" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Kurta Suit Sets (3-Pc)</Link></li>
                <li><Link href="/collections/umbrella-dresses" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Anarkali &amp; Kalidars</Link></li>
                <li><Link href="/collections/cord-sets" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Designer Co-ord Sets</Link></li>
                <li><Link href="/collections/short-long-kaftan" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Artisanal Kaftans</Link></li>
                <li><Link href="/collections/western-dresses" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Western Dresses</Link></li>
                <li><Link href="/collections/denim-collection" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Denim Atelier</Link></li>
                <li><Link href="/collections/shop-all" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">View Full Catalogue</Link></li>
              </ul>
            </div>

            {/* Column 2: Wholesale & Exports */}
            <div className="flex flex-col gap-3.5">
              <div className="inline-block px-3 py-1 rounded-full bg-[#071F59] text-white text-[10px] font-jost font-semibold uppercase tracking-[0.14em] w-max">
                Wholesale &amp; Exports
              </div>
              <ul className="flex flex-col gap-2 text-xs font-jost text-[#444444]">
                <li><Link href="/wholesale-exports" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Boutique Sourcing Guide</Link></li>
                <li><Link href="/wholesale-exports" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Flexible Batch MOQs (20 Pcs)</Link></li>
                <li><Link href="/wholesale-exports" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Private Label Tags &amp; Packaging</Link></li>
                <li><Link href="/wholesale-exports" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">International Air Freight</Link></li>
                <li><Link href="/pages/contact" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Request Lookbook PDF</Link></li>
                <li><Link href="/pages/contact" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Custom Textile Weaving</Link></li>
              </ul>
            </div>

            {/* Column 3: Policies & Client Care */}
            <div className="flex flex-col gap-3.5 col-span-2 md:col-span-1">
              <div className="inline-block px-3 py-1 rounded-full bg-[#071F59] text-white text-[10px] font-jost font-semibold uppercase tracking-[0.14em] w-max">
                Policies &amp; Care
              </div>
              <ul className="flex flex-col gap-2 text-xs font-jost text-[#444444]">
                <li><Link href="/pages/refund-policy" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Shipping &amp; Delivery</Link></li>
                <li><Link href="/pages/refund-policy" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Exchange &amp; Quality Guarantee</Link></li>
                <li><Link href="/pages/faqs" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Wholesale FAQs</Link></li>
                <li><Link href="/pages/terms-of-service" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
                <li><Link href="/pages/privacy-policy" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                <li><Link href="/pages/contact" className="hover:text-[#0B2D7F] hover:translate-x-1 transition-all inline-block">Contact Concierge</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* BOTTOM COPYRIGHT BAR & SMOOTH BACK-TO-TOP BUTTON           */}
        {/* ========================================================== */}
        <div className="pt-6 pb-2 border-t border-[#0B2D7F]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-jost text-[#666666]">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} WASTRAM JAIPUR. All Rights Reserved. Handcrafted in Sanganer &amp; Bagru, Rajasthan.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 hover:bg-[#071F59] text-[#071F59] hover:text-white border border-[#0B2D7F]/15 transition-all text-xs font-jost uppercase tracking-wider shadow-xs cursor-pointer active:scale-95"
            title="Scroll back to top"
          >
            <span>&uarr; Back to top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
