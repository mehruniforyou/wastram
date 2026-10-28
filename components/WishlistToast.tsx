'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function WishlistToast() {
  const { wishlistToast, clearWishlistToast } = useCart();

  if (!wishlistToast || !wishlistToast.show) return null;

  return (
    <div className="fixed bottom-5 right-4 md:right-8 z-[100] animate-toast">
      <div className="flex items-center gap-3 bg-[#482922] text-white px-4 py-2.5 rounded-full shadow-2xl border border-[#F6C582]/40 backdrop-blur-md">
        {/* Bookmark Icon */}
        <div className="w-6 h-6 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="15"
            viewBox="0 0 12.39 18.53"
            className="text-[#F6C582] fill-current"
          >
            <path
              id="savewishlist"
              d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-xs font-archivo flex items-center gap-1.5 pr-1">
          <span className="font-semibold text-white">{wishlistToast.message}</span>
          {wishlistToast.product && (
            <span className="opacity-80 line-clamp-1 max-w-[140px] md:max-w-[200px] text-[#FAF8F5]/90">
              • {wishlistToast.product.title}
            </span>
          )}
        </div>

        {/* View Link */}
        <Link
          href="/pages/swym-wishlist"
          onClick={clearWishlistToast}
          className="text-[11px] font-bold text-[#F6C582] hover:text-white uppercase tracking-wider underline pl-1 transition-colors"
        >
          View
        </Link>

        {/* Close Button */}
        <button
          onClick={clearWishlistToast}
          className="text-white/60 hover:text-white text-xs ml-1 focus:outline-none"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
