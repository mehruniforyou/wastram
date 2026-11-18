'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
  } = useCart();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1499;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#FFFEFE] dark:bg-[#12100E] shadow-2xl z-10 flex flex-col font-sans animate-slide-left border-l border-ink-200/60 dark:border-white/10">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-ink-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-neutral-900 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl text-ink-950 dark:text-white font-normal">
              Your bag
            </h2>
            {cartCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-ink-700 dark:text-neutral-300 transition-colors"
            aria-label="Close bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Ribbon */}
        <div className="px-6 py-3 bg-[#FFFEFE] dark:bg-neutral-900/60 border-b border-ink-100 dark:border-white/5">
          <p className="text-xs text-ink-800 dark:text-neutral-200 font-medium flex items-center justify-between">
            <span className="text-neutral-900 dark:text-white font-medium">Jaipur Handloom Atelier Direct</span>
            <span className="text-[11px] text-foreground/60">Worldwide Air Cargo</span>
          </p>
        </div>

        {/* Cart Items or Empty State */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-serif text-xl text-ink-950 dark:text-white font-normal">
                Your bag is empty
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-ink-600 dark:text-neutral-400 max-w-xs font-sans leading-relaxed">
                Every piece is hand-checked and shipped from our Sanganer workshop in Jaipur.
              </p>
              <Link
                href="/collections/shop-all"
                onClick={closeCart}
                className="mt-6 px-6 py-3 rounded-full border border-[#0B2D7F] text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white dark:border-[#D4AF37] dark:text-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-neutral-950 text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>Explore All Silhouettes</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => {
              const rawImg = (item.product.images && item.product.images[0]) || item.product.image || (item.product as any).featured_image || '/placeholder.jpg';
              const displayImage = typeof rawImg === 'string' ? rawImg : (rawImg?.url || rawImg?.src || '/placeholder.jpg');
              return (
                <div
                  key={`${item.product.id}-${item.size}-${idx}`}
                  className="flex gap-4 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-ink-100 dark:border-white/5 shadow-2xs"
                >
                  <img
                    src={displayImage}
                    alt={item.product.title}
                    className="w-20 h-24 object-cover object-top rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm text-ink-950 dark:text-white font-medium line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-ink-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-ink-500 dark:text-neutral-400 mt-0.5">
                        Size: <span className="font-semibold text-ink-800 dark:text-white">{item.size}</span>
                      </p>
                      <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                        Wholesale Inquiry Item
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-ink-200 dark:border-white/10 rounded-full bg-[#FFFEFE] dark:bg-neutral-800">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-ink-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-ink-950 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-ink-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white dark:bg-neutral-900 border-t border-ink-100 dark:border-white/10 space-y-4">
            <div className="space-y-1.5 text-xs text-ink-600 dark:text-neutral-400 font-sans">
              <div className="flex justify-between">
                <span>Order Type</span>
                <span className="font-semibold text-ink-950 dark:text-white">Wholesale &amp; Sample Quote</span>
              </div>
              <div className="flex justify-between">
                <span>Freight &amp; Cargo</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Worldwide Air Cargo</span>
              </div>
              <p className="text-[11px] text-ink-500 pt-1">
                Direct atelier dispatch from Sanganer, Jaipur. Final invoice provided upon inquiry confirmation.
              </p>
            </div>

            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full py-3.5 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white dark:bg-[#D4AF37] dark:text-neutral-950 dark:hover:bg-[#C5A059] text-sm font-semibold text-center block transition-all shadow-md shadow-[#0B2D7F]/25 cursor-pointer"
            >
              Quote
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
