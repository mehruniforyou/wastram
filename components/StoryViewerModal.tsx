'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { NISHORAMA_STORIES } from '@/data/nishorama-data';
import { useCart } from '@/context/CartContext';

interface StoryViewerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function StoryViewerModal({ isOpen, onClose }: StoryViewerModalProps) {
  const { isStoryOpen: globalStoryOpen, closeStory: globalCloseStory } = useCart();
  const effectiveIsOpen = isOpen !== undefined ? isOpen : globalStoryOpen;

  const handleClose = () => {
    if (onClose) onClose();
    globalCloseStory();
  };

  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  // Sync ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Reset index when opened
  useEffect(() => {
    if (effectiveIsOpen) {
      setCurrentIdx(0);
      setProgress(0);
      setIsPaused(false);
    }
  }, [effectiveIsOpen]);

  // Keyboard navigation & Escape
  useEffect(() => {
    if (!effectiveIsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [effectiveIsOpen, currentIdx]);

  // Timer loop for progressing each showcase
  useEffect(() => {
    if (!effectiveIsOpen) {
      setProgress(0);
      return;
    }

    const intervalMs = 40;
    const durationMs = 4500; // 4.5 seconds per showcase
    const step = 100 / (durationMs / intervalMs);

    const timer = setInterval(() => {
      if (isPausedRef.current) return;

      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIdx < NISHORAMA_STORIES.length - 1) {
            setCurrentIdx((c) => c + 1);
            return 0;
          } else {
            handleClose();
            return 0;
          }
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [effectiveIsOpen, currentIdx]);

  if (!effectiveIsOpen) return null;

  const currentItem = NISHORAMA_STORIES[currentIdx] || NISHORAMA_STORIES[0];

  const goToPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setProgress(0);
    }
  };

  const goToNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIdx < NISHORAMA_STORIES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setProgress(0);
    } else {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md transition-opacity duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button (top right of screen on desktop, inside container on mobile) */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-5 right-5 z-40 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Desktop Prev / Next Buttons */}
      <button
        type="button"
        onClick={goToPrev}
        disabled={currentIdx === 0}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center backdrop-blur-md transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center backdrop-blur-md transition-all cursor-pointer"
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>

      {/* Main Showcase Container (Instagram/Reel style 9:16 aspect ratio) */}
      <div
        className="relative w-full max-w-[440px] h-[92vh] max-h-[820px] bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/15"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bar Strips */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {NISHORAMA_STORIES.map((story, i) => (
            <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{
                  width:
                    i < currentIdx
                      ? '100%'
                      : i === currentIdx
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header */}
        <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/95 p-1 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src="/images/brand/wastram-artisan-crest.png"
                alt="Wastram"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <div>
              <p className="text-xs font-serif font-bold tracking-widest uppercase text-white">
                WASTRAM
              </p>
              <p className="text-[10px] text-white/80 font-sans tracking-wide">
                Jaipur Atelier · {currentItem.tag}
              </p>
            </div>
          </div>
        </div>

        {/* High-Res Showcase Image */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <img
            key={currentItem.id}
            src={currentItem.image}
            alt={currentItem.title}
            className="w-full h-full object-cover object-top animate-fade-in"
          />
          {/* Subtle Lighting Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />
        </div>

        {/* Mobile Left & Right Tap Zones for Navigation */}
        <div
          className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-pointer"
          onClick={goToPrev}
          aria-label="Previous"
        />
        <div
          className="absolute inset-y-16 right-0 w-1/3 z-20 cursor-pointer"
          onClick={goToNext}
          aria-label="Next"
        />

        {/* Bottom Details & Clean One-Word Action */}
        <div className="relative z-30 p-6 pb-7 text-white flex flex-col gap-2 mt-auto">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            {currentItem.subtitle}
          </span>

          <h3 className="text-2xl sm:text-3xl font-serif font-normal tracking-wide uppercase text-white leading-tight">
            {currentItem.title}
          </h3>

          <Link
            href={(currentItem as any).href || '/collections/shop-all'}
            onClick={handleClose}
            className="mt-3 w-full py-3.5 bg-white text-[#0B2D7F] font-semibold text-center text-xs tracking-wider uppercase rounded-full hover:bg-neutral-100 transition-all shadow-lg active:scale-95 cursor-pointer block"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
