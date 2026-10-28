'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const { cart, updateQuantity, removeFromCart, cartCount, cartSubtotal } = useCart();

  const freeShippingThreshold = 2999;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

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

      <main className="max-w-6xl w-full mx-auto px-4 md:px-8 py-10 md:py-16 flex-1 font-archivo text-[#482922]">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-[#FF2F00] font-bold">
            Checkout Summary
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1">
            Shopping Cart ({cartCount})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-black/5 max-w-md mx-auto shadow-sm space-y-4">
            <p className="text-sm text-black/60 font-medium">Your shopping cart is empty.</p>
            <Link
              href="/collections/shop-all"
              className="inline-block px-8 py-3 rounded-full bg-[#482922] text-[#F6C582] text-xs font-bold uppercase tracking-wider shadow"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items list */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-black/5 divide-y divide-black/10">
              {/* Free shipping meter */}
              <div className="pb-4 mb-2 text-xs">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-black/70 mb-2">
                    Add <strong className="text-[#FF2F00]">₹ {remainingForFreeShipping.toLocaleString()}</strong> more to unlock <strong>FREE SHIPPING &amp; FREE PANTS</strong>!
                  </p>
                ) : (
                  <p className="text-emerald-700 font-bold mb-2">
                    🎉 Congratulations! You unlocked FREE SHIPPING &amp; FREE PANTS!
                  </p>
                )}
                <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF2F00] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {cart.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="py-4 flex gap-4 items-center">
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F5F5F5] flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-[#482922]">{item.product.title}</h4>
                        <p className="text-xs text-black/50 mt-0.5">Size: <strong>{item.size}</strong></p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-black/40 hover:text-red-600 p-1"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-black/20 rounded-md bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs text-black/70 hover:bg-black/10"
                        >
                          −
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-black/70 hover:bg-black/10"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#FF2F00]">
                        ₹ {(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary card */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#482922]">
                Order Summary
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Promo Code"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-black/15 bg-[#FAF8F5] uppercase focus:outline-none"
                />
                <button
                  onClick={() => setPromoApplied(true)}
                  className="px-4 py-2 rounded-lg bg-[#482922] text-[#F6C582] text-xs font-bold uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>

              {promoApplied && (
                <p className="text-[11px] text-emerald-700 font-semibold">
                  ✓ DIWALI promo code applied!
                </p>
              )}

              <div className="space-y-2 pt-2 border-t border-black/5 text-xs">
                <div className="flex justify-between text-black/70">
                  <span>Subtotal</span>
                  <span>₹ {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Standard Shipping</span>
                  <span>{cartSubtotal >= freeShippingThreshold ? <strong className="text-emerald-700">FREE</strong> : '₹ 150'}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#482922] pt-2 border-t border-black/10">
                  <span>Total Amount</span>
                  <span className="text-[#FF2F00]">₹ {cartSubtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => alert('Proceeding to payment gateway...')}
                className="w-full mt-2 py-3.5 rounded-full bg-[#FF2F00] hover:bg-[#e02900] text-white font-archivo font-black text-xs uppercase tracking-widest shadow-lg transition-colors"
              >
                CHECKOUT SECURELY
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <PopularSearches />
    </div>
  );
}
