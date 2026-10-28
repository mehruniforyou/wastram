'use client';

import React, { useState, useEffect } from 'react';

export default function PromoPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show after 2 seconds if not dismissed previously
    const dismissed = localStorage.getItem('nishorama_popup_dismissed') || sessionStorage.getItem('nishorama_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('nishorama_popup_dismissed', 'true');
    sessionStorage.setItem('nishorama_popup_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-[620px] rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10 flex flex-col">
        {/* Top Cyan Bar */}
        <div className="w-full bg-[#5CE1E6] py-1.5 px-3 text-center text-black font-archivo font-black text-[11px] tracking-wider uppercase">
          DIWALI SALE &bull; UP TO 50% OFF SITEWIDE &bull; TILL MON 26 OCT
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-3.5 z-20 text-white/80 hover:text-white p-1 rounded-full bg-black/40 hover:bg-black/80 transition-colors"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[380px]">
          {/* Left: Models Image */}
          <div className="relative h-48 md:h-full bg-neutral-900 overflow-hidden">
            <img
              src="/nishorama-images/hero-mobile.png"
              alt="Diwali Sale Nishorama"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          {/* Right: Pitch & Form */}
          <div className="p-6 md:p-8 flex flex-col justify-center text-center text-white font-archivo">
            <span className="text-xs uppercase tracking-widest font-bold text-white/80 mb-1">
              NISHORAMA
            </span>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
              IT'S LIVE.
              <span className="block text-[#5CE1E6]">UP TO 50% OFF SITEWIDE.</span>
            </h2>

            <p className="text-xs text-white/80 mt-2 mb-5">
              Get each day's deal before anyone else.
            </p>

            {submitted ? (
              <div className="p-4 bg-[#5CE1E6]/20 rounded-lg border border-[#5CE1E6]/40 text-[#5CE1E6] font-semibold text-xs">
                Deal code unlocked! Happy shopping.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-2.5 rounded-md bg-white text-black text-xs font-archivo placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#5CE1E6] hover:bg-[#4dd2d7] text-black font-archivo font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  SHOW ME THE DETAILS
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[11px] text-white/60 hover:text-white underline mt-1"
                >
                  No thanks
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
