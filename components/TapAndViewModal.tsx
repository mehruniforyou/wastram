'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function TapAndViewModal() {
  const {
    tapAndViewProduct,
    closeTapAndView,
    addToCart,
    toggleWishlist,
    isWishlisted,
    openSizeGuide
  } = useCart();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (!tapAndViewProduct) return null;

  const wishlisted = isWishlisted(tapAndViewProduct.slug);
  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#482922]/75 backdrop-blur-md transition-opacity"
        onClick={closeTapAndView}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/10 z-10 font-archivo flex flex-col md:flex-row max-h-[90vh] animate-toast">
        {/* Close Button */}
        <button
          onClick={closeTapAndView}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#482922] hover:bg-[#482922] hover:text-white transition-all font-bold text-sm"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* LEFT: INTERACTIVE IMAGE VIEWER */}
        <div className="w-full md:w-1/2 bg-[#F5F5F5] relative flex flex-col justify-between overflow-hidden">
          {/* Main Photo with Zoom */}
          <div
            className="relative w-full aspect-[3/4] md:h-full cursor-zoom-in overflow-hidden"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsZoomed(z => !z)}
          >
            <img
              src={tapAndViewProduct.images[activeImageIdx] || tapAndViewProduct.images[0]}
              alt={tapAndViewProduct.title}
              className={`w-full h-full object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
            />

            {/* Discount Badge */}
            <span className="cust-sale-badge absolute top-3 left-3">
              {tapAndViewProduct.badge}
            </span>

            {/* Wishlist Bookmark Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(tapAndViewProduct.slug);
              }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#482922] shadow-sm hover:scale-105 active:scale-95 transition-all"
              aria-label="Save to wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="18"
                viewBox="0 0 12.39 18.53"
                className={`transition-colors ${
                  wishlisted ? 'fill-[#FF2F00] text-[#FF2F00] animate-heart-bounce' : 'fill-none stroke-current'
                }`}
              >
                <path
                  id="savewishlist"
                  strokeWidth="1.2"
                  d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
                />
              </svg>
            </button>

            {/* Tap & Zoom Hint */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full pointer-events-none">
              {isZoomed ? 'Pinch or move to zoom' : 'Hover / Tap to zoom in'}
            </div>
          </div>

          {/* Thumbnails Strip */}
          {tapAndViewProduct.images.length > 1 && (
            <div className="p-2 bg-white/80 backdrop-blur-sm border-t border-black/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {tapAndViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-12 h-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIdx === idx ? 'border-[#482922]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: PRODUCT INFO & QUICK ADD */}
        <div className="w-full md:w-1/2 p-5 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* Title & Category */}
            <div>
              <span className="text-[11px] font-bold text-[#FF2F00] uppercase tracking-wider">
                {tapAndViewProduct.category}
              </span>
              <h2 className="text-lg md:text-2xl font-bold text-[#482922] uppercase tracking-tight mt-1 leading-snug">
                {tapAndViewProduct.title}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base line-through text-black/40">
                ₹ {tapAndViewProduct.regularPrice.toLocaleString()}
              </span>
              <span className="text-xl md:text-2xl font-black text-[#FF2F00]">
                ₹ {tapAndViewProduct.salePrice.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#482922] border border-black/15 px-2 py-0.5 rounded">
                Sale
              </span>
            </div>

            {/* Measurement & Size Guide Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-black/10">
              <span className="text-xs font-semibold text-[#482922]">Select Size</span>
              <button
                type="button"
                onClick={openSizeGuide}
                className="text-[11px] font-bold text-[#482922] bg-[#FAF8F5] px-3 py-1 rounded-full border border-black/15 hover:bg-[#482922] hover:text-white transition-all"
              >
                What&apos;s my size ?
              </button>
            </div>

            {/* Size Pills Grid (Exact Nishorama 8.64px roundness) */}
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {sizes.map(size => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`relative h-11 md:h-12 rounded-[8.64px] font-archivo text-xs font-bold transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#482922] text-white border-2 border-[#482922] shadow-sm'
                        : 'bg-white text-[#121212] border border-[#D8D8D8] hover:border-[#482922]/50'
                    }`}
                  >
                    <span>{size}</span>
                    {isSelected && (
                      <span className="w-3.5 h-[1.5px] bg-[#F6C582] rounded-full mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Features preview */}
            <div className="text-xs text-black/70 space-y-1 pt-2">
              <p>• Premium Pure Fabric with Handcrafted detailing</p>
              <p>• Free shipping & pants on orders above ₹2,999</p>
              <p>• 7-day hassle-free exchange & COD available</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 pt-6 border-t border-black/10">
            <button
              type="button"
              onClick={() => {
                addToCart(tapAndViewProduct, selectedSize, 1);
                closeTapAndView();
              }}
              className="w-full py-3.5 rounded-full bg-[#482922] text-[#F6C582] hover:bg-[#38201a] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Add to Bag • Size {selectedSize}</span>
            </button>

            <Link
              href={`/products/${tapAndViewProduct.slug}`}
              onClick={closeTapAndView}
              className="w-full py-2.5 rounded-full bg-white text-[#482922] border border-[#482922] hover:bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-center transition-all"
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
