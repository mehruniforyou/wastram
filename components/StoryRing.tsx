'use client';

import React from 'react';

export default function StoryRing({
  onClick,
  size = 'w-9 h-9'
}: {
  onClick?: () => void;
  size?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${size} flex items-center justify-center rounded-full group cursor-pointer focus:outline-none`}
      aria-label="View Wastram Artisan Stories"
      title="View Wastram Artisan Stories"
    >
      {/* Animated gradient spinning ring in Wastram Brand Colors */}
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
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#wastram-story-grad)" strokeWidth="12" />
      </svg>

      {/* Inner circular avatar displaying the Wastram Ornate Sewing Craft Emblem */}
      <div className="w-[82%] h-[82%] rounded-full bg-[#FAF9F6] flex items-center justify-center z-10 shadow-sm group-hover:scale-105 transition-transform overflow-hidden p-0.5">
        <img
          src="/images/brand/wastram-craft-emblem.png"
          alt="Wastram Artisan Emblem"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>
    </button>
  );
}
