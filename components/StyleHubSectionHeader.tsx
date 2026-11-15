'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface StyleHubSectionHeaderProps {
  eyebrow: string;
  title: string;
  cta?: string;
  to?: string;
}

export default function StyleHubSectionHeader({
  eyebrow,
  title,
  cta,
  to,
}: StyleHubSectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
      <div>
        <div className="eyebrow mb-2.5 text-[#D4AF37] font-semibold tracking-wider flex items-center gap-1.5">
          <span>✦</span>
          <span>{eyebrow}</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl leading-[0.95] tracking-tight max-w-xl text-[#0B2D7F] dark:text-foreground">
          {title}
        </h2>
      </div>
      {cta && to && (
        <Link
          href={to}
          className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widerest link-underline text-[#0B2D7F] dark:text-[#D4AF37] hover:text-[#D4AF37] font-semibold transition-colors"
        >
          <span>{cta}</span>
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
