'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale' | 'none';
  distance?: number; // px
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number;
  className?: string;
  staggerChildren?: boolean;
  staggerDelay?: number; // ms between consecutive children
  once?: boolean;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  distance = 28,
  delay = 0,
  duration = 850,
  threshold = 0.12,
  className = '',
  staggerChildren = false,
  staggerDelay = 90,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if IntersectionObserver is available
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsRevealed(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Determine direction class
  let dirClass = 'reveal-init';
  if (direction === 'left') dirClass = 'reveal-left';
  if (direction === 'right') dirClass = 'reveal-right';
  if (direction === 'scale') dirClass = 'reveal-scale';
  if (direction === 'none') dirClass = 'opacity-0 transition-opacity';

  const style: React.CSSProperties = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={`${dirClass} ${isRevealed ? 'reveal-in' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Helper hook for stagger revealing multiple items
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
