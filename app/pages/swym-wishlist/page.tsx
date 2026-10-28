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

  const { wishlist, toggleWishlist, addToCart } = useCart();

  const wishlistedProducts = NISHORAMA_PRODUCTS.filter(p => wishlist.includes(p.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
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

      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-10 md:py-16 flex-1 font-archivo text-[#482922]">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-xs uppercase tracking-widest text-[#FF2F00] font-bold">
            Saved Styles
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1">
            My Wishlist
          </h1>
          <p className="text-xs text-black/60 mt-1">
            {wishlistedProducts.length} items saved for later
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-black/5 max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#482922]/40">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#482922]">Your Wishlist is Empty</h3>
            <p className="text-xs text-black/60">
              Explore our festive Diwali collection and tap the bookmark icon on any style to save it here.
            </p>
            <Link
              href="/collections/shop-all"
              className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#482922] text-[#F6C582] text-xs font-bold uppercase tracking-wider shadow"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistedProducts.map(p => (
              <div
                key={p.id}
                className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                  <Link href={`/products/${p.slug}`} className="block w-full h-full">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(p.slug)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#FF2F00] shadow"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 md:p-4 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold text-[#482922] line-clamp-1">{p.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] line-through text-black/40">₹ {p.regularPrice.toLocaleString()}</span>
                      <span className="text-xs md:text-sm font-bold text-[#FF2F00]">₹ {p.salePrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(p, 'M', 1)}
                    className="w-full py-2 rounded-full bg-[#482922] hover:bg-[#38201a] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Move to Bag
                  </button>
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
