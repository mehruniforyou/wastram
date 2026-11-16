'use client';

import React from 'react';

interface TrustBadge {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

const TRUST_BADGES: TrustBadge[] = [
  {
    id: 'badge-1',
    icon: '🪡',
    title: 'Direct Atelier Sourcing',
    desc: 'Crafted in Sanganer & Bagru looms with zero middlemen markups.',
  },
  {
    id: 'badge-2',
    icon: '📦',
    title: 'Flexible Batch MOQs',
    desc: 'Starting from just 20 pieces per style with assorted sizes (S to XXL).',
  },
  {
    id: 'badge-3',
    icon: '👑',
    title: 'Haute Quality Guarantee',
    desc: 'GOTS-certified natural dyes, pure mulmul, and hand-inspected zari trims.',
  },
  {
    id: 'badge-4',
    icon: '✈️',
    title: 'Worldwide Express Freight',
    desc: 'Doorstep air delivery across US, UK, Europe, GCC & Asia in 4–7 days.',
  },
  {
    id: 'badge-5',
    icon: '💬',
    title: 'WhatsApp Concierge',
    desc: 'Direct line sheets, real-time video swatches & instant trade quotes.',
  },
];

export default function TrustBadges() {
  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white border-t border-[#0B2D7F]/5 select-none">
      <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.id}
            className="group relative p-5 sm:p-6 rounded-2xl bg-[#FFFEFE] border border-[#0B2D7F]/10 hover:border-[#D4AF37] transition-all duration-300 flex flex-col items-center text-center shadow-2xs hover:shadow-cardHover hover:-translate-y-1"
          >
            {/* Traditional Architectural Arch / Circle Icon Accent */}
            <div className="w-12 h-12 rounded-full bg-white shadow-soft border border-[#D4AF37]/40 flex items-center justify-center text-xl sm:text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {badge.icon}
            </div>

            <h4 className="text-xs sm:text-[13px] font-jost font-semibold text-[#071F59] uppercase tracking-wider mb-1">
              {badge.title}
            </h4>

            <p className="text-[11px] font-jost text-[#666666] leading-relaxed">
              {badge.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
