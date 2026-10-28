'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartCount, cartSubtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2999;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl z-10 flex flex-col font-archivo animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 border-b border-black/10 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#482922] uppercase tracking-wide">
              Your Bag
            </h3>
            <span className="text-xs text-black/50">({cartCount} items)</span>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#482922]"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="p-3 bg-[#FAF8F5] border-b border-black/10 text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-black/70 mb-1.5 text-[11px]">
              Add <strong className="text-[#FF2F00]">₹ {remainingForFreeShipping.toLocaleString()}</strong> more to get <strong>FREE SHIPPING &amp; PANTS</strong>!
            </p>
          ) : (
            <p className="text-emerald-700 font-bold mb-1.5 text-[11px] flex items-center gap-1">
              <span>🎉</span>
              <span>You unlocked FREE SHIPPING &amp; FREE PANTS!</span>
            </p>
          )}

          <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF2F00] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 divide-y divide-black/5 no-scrollbar">
          {cart.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center text-black/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-sm text-black/60 font-medium">Your shopping bag is empty</p>
              <Link
                href="/collections/shop-all"
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#482922] text-[#F6C582] text-xs font-bold uppercase tracking-wider"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.size}`} className="pt-3 first:pt-0 flex gap-3">
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F5F5F5] flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-semibold text-[#482922] line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-black/40 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] text-black/60 mt-0.5">
                      Size: <span className="font-semibold text-black">{item.size}</span>
                    </p>
                  </div>

                  {/* Qty & Price */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-black/20 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-black/70 hover:bg-black/5"
                      >
                        −
                      </button>
                      <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-black/70 hover:bg-black/5"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#FF2F00]">
                        ₹ {(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-black/10 bg-[#FAF8F5] flex flex-col gap-3">
            {/* Promo code */}
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                placeholder="Discount code (e.g. DIWALI50)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-black/15 bg-white focus:outline-none uppercase"
              />
              <button
                onClick={() => setPromoApplied(true)}
                className="px-3 py-1.5 rounded-lg bg-[#482922] text-[#F6C582] text-xs font-semibold uppercase tracking-wider"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p className="text-[10px] text-emerald-700 font-semibold">
                ✓ Coupon code applied! Extra 10% Diwali discount added.
              </p>
            )}

            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm font-archivo pt-2 border-t border-black/5">
              <span className="text-black/70 font-medium">Subtotal</span>
              <span className="text-base font-extrabold text-[#482922]">
                ₹ {cartSubtotal.toLocaleString()}
              </span>
            </div>

            <p className="text-[10px] text-black/50 text-center">
              Shipping &amp; taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <button
              onClick={() => {
                alert('Order received! Proceeding to secure checkout...');
              }}
              className="w-full py-3.5 rounded-full bg-[#FF2F00] hover:bg-[#e02900] text-white font-archivo font-black text-xs uppercase tracking-widest shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <span>&bull;</span>
              <span>₹ {cartSubtotal.toLocaleString()}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
