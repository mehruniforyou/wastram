'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 8
  });

  useEffect(() => {
    // Live ticking countdown timer
    const targetDate = new Date();
    targetDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="w-full bg-[#1C1C1C] text-white">
      {/* Mobile Top Timer Bar */}
      <div className="block lg:hidden py-1.5 px-4 text-center border-b border-white/10 text-[11px] font-archivo tracking-wide">
        <span className="text-white/80">Sale ends in: </span>
        <span className="font-semibold text-white">
          {formatNum(timeLeft.hours)} Hours : {formatNum(timeLeft.minutes)} Minutes : {formatNum(timeLeft.seconds)} Seconds
        </span>
      </div>

      {/* Mobile Diwali Banner */}
      <div className="block lg:hidden py-2 px-4 bg-[#231815] text-center border-b border-white/10">
        <div className="flex items-center justify-center gap-3">
          <span className="font-black text-[#FF2F00] text-sm tracking-wider uppercase">DIWALI SALE</span>
          <span className="text-white/40">|</span>
          <span className="text-xs text-white/90">
            UP TO <strong className="text-white font-bold">50%</strong> OFF
          </span>
          <Link
            href="/collections/shop-all"
            className="text-[10px] bg-white text-black font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ml-1"
          >
            SHOP NOW
          </Link>
        </div>
      </div>

      {/* Mobile Notification Strip */}
      <div className="block lg:hidden py-1 px-4 bg-[#2C1F1B] text-center text-[10px] text-[#F6C582] font-archivo tracking-wider border-b border-[#482922]/50">
        10% OFF Automatically Applied on Orders ₹2,599+
      </div>

      {/* Desktop Announcement Strip */}
      <div className="hidden lg:flex items-center justify-between px-8 py-2 text-xs font-archivo border-b border-white/10 bg-[#161616]">
        <div className="flex items-center gap-2">
          <span className="text-white/60">Sale ends in:</span>
          <span className="font-medium text-white tracking-wider">
            {formatNum(timeLeft.hours)} Hours : {formatNum(timeLeft.minutes)} Minutes : {formatNum(timeLeft.seconds)} Seconds
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-black text-[#FF2F00] tracking-wider uppercase">DIWALI SALE</span>
          <span className="text-white/40">|</span>
          <span className="text-white/90">
            UP TO <strong className="font-bold text-white">50%</strong> OFF
          </span>
          <Link
            href="/collections/shop-all"
            className="text-[11px] bg-white text-black font-semibold px-3 py-0.5 rounded-full uppercase tracking-wider hover:bg-white/90 transition-colors"
          >
            SHOP NOW
          </Link>
        </div>

        <div className="text-[#F6C582] text-[11px] font-medium tracking-wide">
          10% OFF Automatically Applied on Orders ₹2,599+
        </div>
      </div>
    </div>
  );
}
