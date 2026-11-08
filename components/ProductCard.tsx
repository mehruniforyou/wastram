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

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImgIdx(0);
      }}
      className="group relative flex flex-col bg-transparent"
    >
      {/* Image Media Container */}
      <div className="relative aspect-[400/700] md:aspect-[400/680] w-full bg-[#FAF9F6] border border-[#0B2D7F]/10 rounded-[4vw] md:rounded-[1vw] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Link>

        {/* Sale / Collection Badge Pill */}
        <div className="cust-badges-wrapper absolute top-2 left-2 md:top-2.5 md:left-2.5 z-10 pointer-events-none">
          <span className="cust-sale-badge">
            {product.badge}
          </span>
        </div>

        {/* Top Right: Wishlist & Tap & View Buttons */}
        <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 z-10 flex flex-col gap-1.5">
          {/* Wishlist Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.slug);
            }}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs hover:bg-white flex items-center justify-center text-[#0B2D7F] transition-transform active:scale-90"
            aria-label="Save to wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
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
                strokeWidth="1.2"
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
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs hover:bg-white flex items-center justify-center text-[#0B2D7F] transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            title="Tap & View Lightbox"
            aria-label="Tap and View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>

        {/* Carousel Arrow Controls (Appear on hover when multiple angles available) */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md shadow-xs items-center justify-center text-[#0B2D7F] text-sm font-bold transition-all ${
                isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
              }`}
              aria-label="Previous angle"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md shadow-xs items-center justify-center text-[#0B2D7F] text-sm font-bold transition-all ${
                isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
              }`}
              aria-label="Next angle"
            >
              ›
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none">
              {product.images.slice(0, 5).map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1 rounded-full transition-all ${
                    currentImgIdx === dotIdx ? 'w-3 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Info */}
      <div className="pt-2 md:pt-2.5 pb-1 flex flex-col justify-between flex-1 gap-1">
        <div className="flex items-start justify-between gap-1">
          <div className="flex flex-col flex-1 min-w-0">
            <Link
              href={`/products/${product.slug}`}
              className="font-archivo font-bold text-[2.8vw] md:text-[0.85vw] text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors line-clamp-1 leading-snug uppercase tracking-tight"
            >
              {product.title}
            </Link>

            <div className="flex items-center gap-1.5 mt-1 font-archivo">
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0B2D7F] text-[#FAF9F6] border border-[#D4AF37]/40 hover:bg-[#071F59] font-archivo text-[2.2vw] md:text-[0.72vw] font-bold uppercase tracking-wider transition-all shadow-2xs"
              >
                <span>Show Price</span>
              </Link>
              <span className="text-[2.2vw] md:text-[0.68vw] text-black/50">
                • {product.moq || 'MOQ 20 pcs'}
              </span>
            </div>
          </div>

          {/* Enquire Pill Button */}
          <Link
            href={`/products/${product.slug}`}
            className="px-2.5 md:px-3 py-1 md:py-1 rounded-full border border-[#0B2D7F] bg-white text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold transition-all flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-2xs"
          >
            <span>Enquire</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
export default ProductCard;
