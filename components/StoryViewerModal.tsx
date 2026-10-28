'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NISHORAMA_STORIES } from '@/data/nishorama-data';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryViewerModal({ isOpen, onClose }: StoryViewerModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const interval = 50; // update every 50ms
    const step = 100 / (4000 / interval); // 4 seconds per story

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIdx < NISHORAMA_STORIES.length - 1) {
            setCurrentIdx(c => c + 1);
            return 0;
          } else {
            onClose();
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentIdx, onClose]);

  if (!isOpen) return null;

  const currentStory = NISHORAMA_STORIES[currentIdx];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIdx < NISHORAMA_STORIES.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 text-white/80 hover:text-white p-2 rounded-full bg-black/30"
        aria-label="Close stories"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Story Container */}
      <div className="relative w-full max-w-[420px] h-[85vh] max-h-[780px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
          {NISHORAMA_STORIES.map((story, i) => (
            <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    i < currentIdx
                      ? '100%'
                      : i === currentIdx
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-7 left-4 right-4 z-20 flex items-center justify-between text-white font-archivo">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center">
              <span className="font-serif font-bold text-xs text-[#482922]">नी</span>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider">NISHORAMA</p>
              <p className="text-[10px] text-white/70">{currentStory.tag}</p>
            </div>
          </div>
        </div>

        {/* Story Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentStory.image}
            alt={currentStory.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        </div>

        {/* Tap areas for prev / next */}
        <div className="absolute inset-y-16 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-16 right-0 w-1/3 z-10 cursor-pointer" onClick={handleNext} />

        {/* Bottom Story Content */}
        <div className="relative z-20 p-6 pb-8 text-white flex flex-col gap-2 mt-auto">
          <span className="text-xs uppercase tracking-widest text-[#F6C582] font-semibold">
            {currentStory.subtitle}
          </span>
          <h3 className="text-2xl font-black tracking-tight uppercase font-archivo">
            {currentStory.title}
          </h3>
          <Link
            href="/collections/shop-all"
            onClick={onClose}
            className="mt-3 w-full py-3 bg-white text-black font-archivo font-bold text-center text-xs tracking-wider uppercase rounded-full hover:bg-[#FAF8F5] transition-colors"
          >
            SHOP COLLECTION →
          </Link>
        </div>
      </div>
    </div>
  );
}
