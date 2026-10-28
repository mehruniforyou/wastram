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
      aria-label="View Stories"
    >
      {/* Animated gradient spinning ring */}
      <svg
        className="absolute inset-0 w-full h-full story-ring-spin"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="story-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#8034B0" />
            <stop offset="33%" stopColor="#DD2A7B" />
            <stop offset="66%" stopColor="#FDDA76" />
            <stop offset="100%" stopColor="#F48529" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#story-grad)" strokeWidth="12" />
      </svg>

      {/* Inner background with Devanagari 'नी' monogram */}
      <div className="w-[82%] h-[82%] rounded-full bg-[#FAF8F5] flex items-center justify-center z-10 shadow-sm group-hover:scale-105 transition-transform">
        <span className="font-serif font-bold text-xs text-[#482922]">नी</span>
      </div>
    </button>
  );
}
