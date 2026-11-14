'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { NishoramaProduct } from '@/data/nishorama-data';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: NishoramaProduct;
  priority?: boolean;
}

function ProductCardComponent({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const { toggleWishlist, isWishlisted, openTapAndView } = useCart();
  const wishlisted = isWishlisted(product.slug);

  const totalImages = product.images.length;
  const displayImage = isHovered && totalImages > 1
    ? (product.images[currentImgIdx] || product.images[0])
    : product.images[0];

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx(prev => (prev + 1) % totalImages);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx(prev => (prev - 1 + totalImages) % totalImages);
  };

  // Clean concise MOQ badge
  const rawMoq = product.moq
    ? product.moq.includes('/')
      ? product.moq.split('/')[0].trim()
      : product.moq
    : '20 pcs';
  const displayMoq = rawMoq.toLowerCase().startsWith('moq') ? rawMoq : `MOQ ${rawMoq}`;

  // Technical reference code
  const refCode = product.id ? `SPEC-${String(product.id).slice(-4).toUpperCase()}` : 'SPEC-2026';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImgIdx(0);
      }}
      className="group relative flex flex-col bg-transparent"
    >
      {/* Image Media Container with Technical Framing */}
      <div className="relative aspect-[400/660] w-full bg-white shadow-soft hover:shadow-card transition-all duration-400 rounded-2xl overflow-hidden border border-[#E8E4DA]/60 group-hover:border-[#0B2D7F]/20">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104 will-change-transform"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Link>

        {/* Minimal Luxury Badge */}
        {product.badge && (
          <div className="cust-badges-wrapper absolute top-3 left-3 z-10 pointer-events-none">
            <span className="cust-sale-badge">
              {product.badge.replace(/Export/gi, 'Signature')}
            </span>
          </div>
        )}

        {/* Top Right: Wishlist & Quick View */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          {/* Wishlist Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.slug);
            }}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-soft hover:bg-white flex items-center justify-center text-[#0B2D7F] transition-transform active:scale-90 cursor-pointer"
            aria-label="Save to wishlist"
            title="Save to Wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="16"
              viewBox="0 0 12.39 18.53"
              className={`transition-all duration-300 ${
                wishlisted
                  ? 'fill-[#F58220] text-[#F58220] animate-heart-bounce'
                  : 'fill-none stroke-current'
              }`}
            >
              <path
                id="savewishlist"
                strokeWidth="1.3"
                d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
              />
            </svg>
          </button>

          {/* Tap & View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openTapAndView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-soft hover:bg-white flex items-center justify-center text-[#0B2D7F] transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
            title="Quick View"
            aria-label="Quick View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>

        {/* Technical Minimalist Size Specification Bar (MAE Inspired) */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-10 hidden sm:flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-xs border border-[#0B2D7F]/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-1 group-hover:translate-y-0">
          <span className="text-[9.5px] font-sans uppercase tracking-wider text-[#0B2D7F] font-semibold">Available</span>
          <span className="text-[9px] font-mono tracking-widest text-[#0B2D7F]/80">XS · S · M · L · XL · 2XL</span>
        </div>

        {/* Carousel Arrow Controls */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className={`hidden md:flex absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-soft items-center justify-center text-[#0B2D7F] text-sm font-bold transition-all cursor-pointer ${
                isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
              }`}
              aria-label="Previous angle"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className={`hidden md:flex absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-soft items-center justify-center text-[#0B2D7F] text-sm font-bold transition-all cursor-pointer ${
                isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
              }`}
              aria-label="Next angle"
            >
              ›
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none">
              {product.images.slice(0, 5).map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1 rounded-full transition-all ${
                    currentImgIdx === dotIdx ? 'w-3 bg-white' : 'w-1 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Info & Dual Balanced CTAs with Technical Minimalism */}
      <div className="pt-3 pb-1 flex flex-col justify-between flex-1 gap-2">
        {/* Technical Specification Chip */}
        <div className="flex items-center justify-between text-[9px] font-mono tracking-wider uppercase text-[#0B2D7F]/50 px-0.5">
          <span>JAIPUR ATELIER // LOOM</span>
          <span>{refCode}</span>
        </div>

        {/* Title and Clean Concise MOQ */}
        <div className="flex items-baseline justify-between gap-2 px-0.5">
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-[14px] md:text-[15px] font-medium text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors truncate tracking-wide flex-1"
          >
            {product.title}
          </Link>
          <span className="text-[10px] md:text-[11px] font-sans text-[#0B2D7F]/70 uppercase tracking-wider shrink-0 font-medium">
            {displayMoq}
          </span>
        </div>

        {/* Symmetrical Dual Action CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full pt-1">
          <Link
            href={`/products/${product.slug}`}
            className="w-full py-2 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-center text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.12em] shadow-soft hover:shadow-card active:scale-[0.98] flex items-center justify-center cursor-pointer"
          >
            Show Price
          </Link>

          <Link
            href={`/products/${product.slug}`}
            className="w-full py-2 rounded-full bg-white text-[#0B2D7F] hover:bg-[#FAF9F6] border border-[#0B2D7F]/15 hover:border-[#0B2D7F]/30 transition-all text-center text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.12em] shadow-soft hover:shadow-card active:scale-[0.98] flex items-center justify-center cursor-pointer"
          >
            Enquire
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
export default ProductCard;
