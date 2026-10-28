'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { wishlist, toggleWishlist, addToCart, openTapAndView } = useCart();

  const wishlistedProducts = NISHORAMA_PRODUCTS.filter(p => wishlist.includes(p.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-archivo">
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <StoryViewerModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="max-w-[1400px] w-full mx-auto px-3 md:px-6 py-8 md:py-14 flex-1 text-[#482922]">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-xs uppercase tracking-widest text-[#FF2F00] font-bold">
            Saved Styles
          </span>
          <h1 className="text-2xl md:text-5xl font-extrabold uppercase tracking-tight mt-1 text-[#482922]">
            My Wishlist
          </h1>
          <p className="text-xs text-black/60 mt-1">
            {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} saved in your personal collection
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-black/5 max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#482922]/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="30"
                viewBox="0 0 12.39 18.53"
                className="fill-none stroke-current"
              >
                <path
                  id="savewishlist"
                  strokeWidth="1.2"
                  d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#482922] uppercase tracking-wide">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-black/60 leading-relaxed">
              Browse our signature collections and tap the bookmark icon on any style to save it here for easy checkout.
            </p>
            <Link
              href="/collections/shop-all"
              className="inline-block mt-2 px-8 py-3 rounded-full bg-[#482922] text-[#F6C582] text-xs font-bold uppercase tracking-wider shadow hover:bg-[#38201a] transition-all"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 lg:gap-5">
            {wishlistedProducts.map(p => (
              <div
                key={p.id}
                className="group relative flex flex-col bg-transparent"
              >
                {/* Media Container with Exact Nishorama Roundness */}
                <div className="relative aspect-[400/700] md:aspect-[400/680] w-full bg-[#EEEEEE] rounded-[4vw] md:rounded-[1vw] overflow-hidden">
                  <Link href={`/products/${p.slug}`} className="block w-full h-full">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Sale Badge Pill */}
                  <div className="cust-badges-wrapper absolute top-2 left-2 md:top-2.5 md:left-2.5 z-10">
                    <span className="cust-sale-badge">{p.badge}</span>
                  </div>

                  {/* Actions: Remove Wishlist & Tap & View */}
                  <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 z-10 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.slug)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white flex items-center justify-center text-[#FF2F00] transition-transform active:scale-90"
                      aria-label="Remove from wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="16"
                        viewBox="0 0 12.39 18.53"
                        className="fill-[#FF2F00] text-[#FF2F00]"
                      >
                        <path
                          id="savewishlist"
                          strokeWidth="1.2"
                          d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => openTapAndView(p)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white flex items-center justify-center text-[#482922] transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
                      title="Tap & View Lightbox"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Card Information */}
                <div className="pt-2 md:pt-2.5 pb-1 flex flex-col justify-between flex-1 gap-1">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex flex-col flex-1">
                      <Link
                        href={`/products/${p.slug}`}
                        className="font-archivo font-bold text-[2.8vw] md:text-[0.85vw] text-[#482922] hover:text-[#FF2F00] transition-colors line-clamp-1 uppercase tracking-tight"
                      >
                        {p.title}
                      </Link>

                      <div className="flex items-center gap-1.5 mt-0.5 font-archivo">
                        <span className="text-[2.4vw] md:text-[0.75vw] line-through text-black/50">
                          ₹ {p.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#FF2F00]">
                          ₹ {p.salePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(p, 'M', 1)}
                      className="px-2.5 md:px-3 py-1 rounded-full border border-[#482922] bg-[#482922] text-[#F6C582] hover:bg-[#38201a] font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold transition-all flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-2xs"
                    >
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <PopularSearches />
    </div>
  );
}
