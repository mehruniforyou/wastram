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
        <div className="eyebrow mb-2.5">{eyebrow}</div>
        <h2 className="font-display text-3xl md:text-5xl leading-[0.95] tracking-tight max-w-xl text-foreground">
          {title}
        </h2>
      </div>
      {cta && to && (
        <Link
          href={to}
          className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widerest link-underline text-foreground font-medium"
        >
          <span>{cta}</span>
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
