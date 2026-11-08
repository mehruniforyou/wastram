'use client';

import React from 'react';
import Image from 'next/image';

interface WastramLogoProps {
  className?: string;
  variant?: 'header' | 'emblem' | 'full' | 'stacked';
  alt?: string;
  priority?: boolean;
}

export default function WastramLogo({
  className = 'h-8 w-auto',
  variant = 'header',
  alt = 'Wastram - Authentic Indian Textiles & Contemporary Fashion',
  priority = true,
}: WastramLogoProps) {
  if (variant === 'emblem') {
    return (
      <img
        src="/images/brand/wastram-craft-emblem.png"
        alt={alt}
        className={`object-contain ${className}`}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  if (variant === 'full') {
    return (
      <img
        src="/images/brand/wastram-sewing-emblem-logo.png"
        alt={alt}
        className={`object-contain ${className}`}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  if (variant === 'stacked') {
    return (
      <img
        src="/images/brand/wastram-artisan-heritage-emblem.png"
        alt={alt}
        className={`object-contain ${className}`}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  // Default: variant === 'header'
  // The official transparent script wordmark with golden thread & needle
  return (
    <img
      src="/images/brand/wastram-header-logo-trimmed.png"
      alt={alt}
      className={`object-contain block ${className}`}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}
