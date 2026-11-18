'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';

import SearchModal from '@/components/SearchModal';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const { cart, updateQuantity, removeFromCart, cartCount, cartSubtotal } = useCart();

  const freeShippingThreshold = 1499;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === 'first10' || promoCode.trim().toLowerCase() === 'jaipur') {
      setPromoApplied(true);
    }
  };

  const discountAmount = promoApplied ? Math.round(cartSubtotal * 0.1) : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const itemsSummary = cart
    .map(
      (item, i) =>
        `${i + 1}. ${item.product.title} (SKU: ${item.product.sku || item.product.id}, Size: ${item.size}, Qty: ${item.quantity})`
    )
    .join('\n');
  const wholesaleMessage = `Hello Wastram Atelier, I would like to submit a wholesale enquiry for:\n${itemsSummary}\n\nPlease share wholesale tier pricing, MOQ terms, and air cargo delivery lead time.`;
  const checkoutUrl = `https://wa.me/918003088838?text=${encodeURIComponent(wholesaleMessage)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-neutral-900 selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 flex-1">
        <div className="text-center mb-10">
          <div className="section-pill mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
            <span>Wholesale &amp; Sourcing Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal mt-1">
            Enquiry Selections &amp; <span className="text-[#D4AF37] italic font-normal">Boutique Bag ({cartCount}).</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center border border-neutral-200/80 dark:border-white/5 max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mx-auto">
              <ShoppingBag size={28} />
            </div>
            <h2 className="font-serif text-2xl font-normal text-neutral-900 dark:text-white">
              Your enquiry bag is empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans">
              Discover authentic handblock co-ords, kurta sets, and dresses crafted directly in our Jaipur atelier.
            </p>
            <Link
              href="/collections/shop-all"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
            >
              <span>Explore Collections</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List */}
            <div className="lg:col-span-7 space-y-4">
              {/* Atelier info bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/5 shadow-2xs flex items-center justify-between text-xs font-medium text-neutral-800 dark:text-neutral-200">
                <span className="text-neutral-900 dark:text-white font-semibold">Direct Sanganer Atelier Supply</span>
                <span className="text-neutral-500">Worldwide Air Cargo Dispatch</span>
              </div>

              {cart.map((item, idx) => {
                const rawImg = (item.product.images && item.product.images[0]) || item.product.image || (item.product as any).featured_image || '/placeholder.jpg';
                const displayImg = typeof rawImg === 'string' ? rawImg : (rawImg?.url || rawImg?.src || '/placeholder.jpg');
                return (
                  <div
                    key={`${item.product.id}-${item.size}-${idx}`}
                    className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/5 shadow-2xs flex gap-4"
                  >
                    <img
                      src={displayImg}
                      alt={item.product.title}
                      className="w-20 h-28 object-cover object-top rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-base font-medium text-neutral-900 dark:text-white line-clamp-1">
                            {item.product.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-neutral-400 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Size Pre-Pack: <span className="font-semibold text-neutral-900 dark:text-white">{item.size}</span>
                        </p>
                        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                          Wholesale Sourcing Item (MOQ: 20 Pcs)
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center border border-neutral-200 dark:border-white/10 rounded-full bg-[#FFFEFE] dark:bg-neutral-800">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-neutral-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/5 shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-medium text-neutral-900 dark:text-white">
                Enquiry Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans">
                <div className="flex justify-between">
                  <span>Selected Styles</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Selected Units</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sourcing Type</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">Boutique Wholesale / Sampling</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch Window</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">2–3 Business Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Cargo &amp; Freight</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">Insured Worldwide Air Cargo</span>
                </div>
              </div>

              {/* Checkout Button */}
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-sm text-center block transition-all shadow-md"
              >
                WhatsApp
              </a>

              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-white/10 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-neutral-700 dark:text-neutral-300 shrink-0" />
                  <span>Verified 3-stage quality checks on every garment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-neutral-700 dark:text-neutral-300 shrink-0" />
                  <span>Handcrafted in Jaipur atelier · Worldwide air freight</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <SizeGuideModal />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
