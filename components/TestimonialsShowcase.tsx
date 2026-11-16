'use client';

import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  city: string;
  avatar: string;
  quote: string;
  orderedStyles: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Pooja Chhabra',
    role: 'Boutique Owner',
    city: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    quote:
      'We sourced 120 pieces of the 3-Piece Kalidar Anarkali sets for our festive edit. The stitching precision, gota lace finishes, and fabric fall exceeded our expectations. Our customers sold out the stock in 48 hours!',
    orderedStyles: 'Kalidar Anarkali & Kurta Sets',
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    role: 'Ethnic Wear Curator',
    city: 'London, United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    quote:
      'Ordering via WhatsApp was effortless. The Wastram merchandiser shared high-res videos, swatches, and DHL tracked our air consignment directly to London in 5 days. Exceptional Jaipur craftsmanship.',
    orderedStyles: 'Designer Co-ords & Pure Mulmul Sets',
  },
  {
    id: 3,
    name: 'Fatima Al-Mansoor',
    role: 'Fashion Buyer',
    city: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
    quote:
      'The luxury kaftans with zari tassels are of true haute quality. Pure modal silk, perfect drape, and custom boutique tag stitching made them a major hit with our Middle Eastern clientele.',
    orderedStyles: 'Artisanal Kaftans & Resort Tunics',
  },
  {
    id: 4,
    name: 'Simran Khurana',
    role: 'Multi-Designer Studio',
    city: 'Delhi, India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    quote:
      'Wastram is our most reliable wholesale manufacturer. Zero dye bleeding, authentic Sanganeri handblock prints, and consistent sizing from S to XXL. Looking forward to our next festive order!',
    orderedStyles: 'Handblock Dobby Kurtas & 3-Pc Sets',
  },
];

export default function TestimonialsShowcase() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const total = TESTIMONIALS.length;

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % total);
  };

  const current = TESTIMONIALS[currentIdx];

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#FFFEFE] border-t border-[#0B2D7F]/5 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto flex flex-col gap-10 sm:gap-14">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="text-[11px] sm:text-[12px] font-jost uppercase tracking-[0.22em] text-[#0B2D7F] font-semibold">
              Client Praises
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-jost font-normal text-[#071F59] uppercase tracking-[0.08em] mb-2">
            What Our Patrons Say
          </h2>

          <p className="text-xs sm:text-sm font-jost text-[#555555] max-w-xl tracking-wide">
            Trusted by over 450+ boutiques, retail stores, and export partners worldwide
          </p>
        </div>

        {/* Split Grid (Gulmohar Jaipur Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Summary Box (4 cols) */}
          <div className="lg:col-span-4 p-8 rounded-2xl bg-white shadow-soft border border-[#0B2D7F]/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF5E6] flex items-center justify-center text-[#D4AF37] text-3xl mb-4">
              👑
            </div>

            <span className="text-4xl sm:text-5xl font-jost font-bold text-[#071F59] tracking-tight">
              4.9 / 5.0
            </span>

            {/* 5 Gold Stars */}
            <div className="flex items-center gap-1 text-[#D4AF37] text-xl my-2">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            <span className="text-xs font-jost uppercase tracking-[0.14em] text-[#0B2D7F] font-semibold">
              Overall Boutique Satisfaction Score
            </span>

            <p className="text-xs font-jost text-[#777777] mt-3">
              Based on verified wholesale dispatch reviews across India, GCC, UK, US, and Canada.
            </p>

            <a
              href="https://wa.me/918003088838?text=Hello%20Wastram%20Jaipur,%20I%20would%20like%20to%20view%20more%20boutique%20references%20and%20client%20reviews."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-jost uppercase tracking-[0.12em] text-[#0B2D7F] font-semibold hover:text-[#D4AF37] transition-colors"
            >
              <span>Connect with Wholesale Desk</span>
              <span>&rarr;</span>
            </a>
          </div>

          {/* Right Sliding Testimonial Card (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative pt-6">
              {/* Distinctive 5-Star Ribbon Badge centered on Top Border (Gulmohar Style) */}
              <div className="absolute top-0 left-8 z-10 px-4 py-1 rounded-full bg-[#071F59] text-[#D4AF37] text-xs font-jost font-semibold uppercase tracking-[0.14em] shadow-md border border-[#D4AF37]/50 flex items-center gap-1.5">
                <span>★★★★★</span>
                <span className="text-white text-[10px] font-normal">Verified Buyer</span>
              </div>

              {/* Card Container */}
              <div className="p-8 sm:p-10 rounded-2xl bg-white shadow-soft border border-[#0B2D7F]/10 flex flex-col justify-between min-h-[260px]">
                {/* Quote Text */}
                <p className="text-sm sm:text-base lg:text-lg font-jost font-normal text-[#333333] leading-relaxed italic mb-6">
                  &ldquo;{current.quote}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between border-t border-[#0B2D7F]/5 pt-5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]/40 shadow-xs"
                    />
                    <div>
                      <h4 className="font-jost text-sm sm:text-base font-semibold text-[#071F59] uppercase tracking-wide">
                        {current.name}
                      </h4>
                      <p className="text-[11px] font-jost text-[#777777]">
                        {current.role} • <span className="text-[#0B2D7F] font-medium">{current.city}</span>
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block text-[10px] font-jost uppercase tracking-wider text-[#D4AF37] font-semibold bg-[#FAF5E6] px-3 py-1 rounded-full">
                    {current.orderedStyles}
                  </span>
                </div>
              </div>
            </div>

            {/* Slider Navigation Controls & Progress Dots */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentIdx(dotIdx)}
                    aria-label={`Go to review ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIdx === currentIdx ? 'w-8 bg-[#071F59]' : 'w-2 bg-[#071F59]/20'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous Review"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#071F59] text-[#071F59] hover:text-white border border-[#0B2D7F]/15 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next Review"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#071F59] text-[#071F59] hover:text-white border border-[#0B2D7F]/15 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
