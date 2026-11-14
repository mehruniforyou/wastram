'use client';

import React from 'react';

export default function StoryRing({
  onClick,
  size = 'w-12 h-12 md:w-13 md:h-13'
}: {
  onClick?: () => void;
  size?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${size} flex items-center justify-center rounded-full group cursor-pointer focus:outline-none shrink-0 transition-transform duration-300 hover:scale-106 active:scale-95`}
      aria-label="Wastram Atelier - View Artisan Stories"
      title="Wastram Atelier - View Artisan Stories"
    >
      {/* Animated gradient spinning ring in Wastram Brand Colors - refined jewelry-thin stroke */}
      <svg
        className="absolute inset-0 w-full h-full story-ring-spin"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wastram-story-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#0B2D7F" />     {/* Royal Navy Blue */}
            <stop offset="35%" stopColor="#4A7BC6" />    {/* Ceramic Blue */}
            <stop offset="68%" stopColor="#F4A7B7" />    {/* Heritage Pink */}
            <stop offset="100%" stopColor="#D4AF37" />   {/* Golden Thread */}
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="none" stroke="url(#wastram-story-grad)" strokeWidth="6" />
      </svg>

      {/* Inner circular avatar displaying the HD Wastram Ornate Sewing Craft Logomark */}
      <div className="w-[91%] h-[91%] rounded-full bg-[#FAF9F6] flex items-center justify-center z-10 shadow-soft overflow-hidden p-0.5">
        <picture className="w-full h-full flex items-center justify-center">
          <source srcSet="/images/brand/wastram-craft-emblem-hd.webp" type="image/webp" />
          <img
            src="/images/brand/wastram-craft-emblem-hd.png"
            alt="Wastram Artisan Logomark"
            className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(11,45,127,0.08)] transform group-hover:scale-105 transition-transform duration-300"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>
    </button>
  );
}
