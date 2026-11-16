'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';

export default function TermsAndConditionsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#12100E] text-foreground font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24 flex-1">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#0B2D7F] dark:text-[#D4AF37] font-semibold">
            Atelier Trade Terms
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-normal mt-2 text-ink-950 dark:text-white">
            Terms of Supply &amp; Service
          </h1>
          <p className="mt-3 text-xs md:text-sm text-foreground/70">
            Wastram Jaipur Atelier · Wholesale &amp; Direct Sourcing
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-sm border border-black/5 dark:border-white/10 space-y-6 text-xs md:text-sm text-foreground/80 leading-relaxed font-sans">
          <div>
            <h3 className="font-serif text-base font-semibold text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
              1. Authentic Artisanal Craftsmanship
            </h3>
            <p>
              All Wastram garments are hand block-printed using traditional wooden blocks carved by Jaipur artisans. Subtle variations in pigment saturation, registration, and natural slub textures are characteristic proof of genuine human craft rather than defects.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
              2. Sizing Pre-Packs &amp; Grading
            </h3>
            <p>
              Standard orders are produced in true-to-size proportional grading (S, M, L, XL, XXL) with 2.5 inches of comfort ease. Custom size assortments are accommodated for wholesale accounts upon request.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
              3. Worldwide Air Cargo &amp; Dispatch
            </h3>
            <p>
              Ready styles dispatch within 2–3 business days. Wholesale and custom bulk productions ship under FOB/CIF air freight terms with comprehensive insurance and tracking.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-[#0B2D7F] dark:text-[#D4AF37] mb-2">
              4. Contact &amp; Legal Jurisdiction
            </h3>
            <p>
              All supply agreements are governed under the commercial jurisdiction of the courts of Jaipur, Rajasthan, India. For inquiries, email <strong>exports@wastram.in</strong>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
