'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';

export default function PrivacyPolicyPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#12100E] text-foreground font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24 flex-1">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#0B2D7F] dark:text-[#D4AF37] font-semibold">
            Privacy &amp; Data Protection
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-normal mt-2 text-ink-950 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs md:text-sm text-foreground/70">
            Last Updated: November 2026 · Wastram Jaipur Handloom Atelier
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-sm border border-black/5 dark:border-white/10 space-y-6 text-xs md:text-sm text-foreground/80 leading-relaxed font-sans">
          <div>
            <h3 className="font-serif text-base font-semibold text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
              1. Information We Collect
            </h3>
            <p>
              When you visit Wastram (wastram.in) or place wholesale and bespoke orders, we collect personal information you provide to us, including your name, boutique business name, billing and shipping address, email address, phone/WhatsApp number, and order details.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
              2. How We Use Your Information
            </h3>
            <p>
              We use your data solely to fulfill orders, coordinate insured air freight logistics, send tracking updates, provide artisan tailoring support, and communicate seasonal catalog drops if you subscribed to our Boutique Newsletter.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
              3. Protection &amp; Confidentiality
            </h3>
            <p>
              We implement industry-standard encryption protocols. We do not sell, rent, or trade your personal information with third-party advertising brokers. Your information is shared only with verified logistics partners (such as DHL, FedEx, and BlueDart) strictly for delivery purposes.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
              4. Contact Us
            </h3>
            <p>
              For inquiries regarding your personal data or to request account deletion, reach our data privacy officer at <strong>privacy@wastram.in</strong> or write to Sanganer Textile Industrial Area, Jaipur, Rajasthan 302029.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
