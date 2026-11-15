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
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const { toggleWishlist, isWishlisted, openTapAndView } = useCart();
  const wishlisted = isWishlisted(product.slug);

  const hasVariants = Boolean(product.colorVariants && product.colorVariants.length > 0);
  const activeVariant = hasVariants ? product.colorVariants![selectedVariantIdx] : null;
  const activeImages = activeVariant && activeVariant.images && activeVariant.images.length > 0
    ? activeVariant.images
    : product.images;

  const totalImages = activeImages.length;
  const displayImage = isHovered && totalImages > 1
    ? (activeImages[currentImgIdx] || activeImages[0])
    : (activeImages[0] || product.images[0]);

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
  const refCode = product.partNumber || (product.id ? `SPEC-${String(product.id).slice(-4).toUpperCase()}` : 'SPEC-2026');

  // Limit displayed swatches to 6 to keep layout ultra-clean
  const maxSwatches = 6;
  const variants = product.colorVariants || [];
  const visibleVariants = variants.slice(0, maxSwatches);
  const extraVariantCount = variants.length - maxSwatches;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImgIdx(0);
      }}
      className="group relative flex flex-col bg-white rounded-2xl p-2 sm:p-2.5 transition-all duration-300 hover:shadow-card border border-[#0B2D7F]/[0.06] hover:border-[#0B2D7F]/20"
    >
      {/* Image Media Container with Technical Framing */}
      <div className="relative aspect-[3/4.2] w-full bg-[#FAF9F6] rounded-xl overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104 will-change-transform"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Link>

        {/* Minimal Luxury Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#0B2D7F] text-[9.5px] sm:text-[10px] font-sans font-medium uppercase tracking-[0.14em] shadow-soft border border-white/60">
              {product.badge.replace(/Export/gi, 'Signature')}
            </span>
          </div>
        )}

        {/* Top Right: Wishlist & Quick View */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          {/* Wishlist Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.slug);
            }}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-md shadow-soft hover:bg-white flex items-center justify-center text-[#0B2D7F] transition-transform active:scale-90 cursor-pointer"
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
              openTapAndView({ ...product, images: activeImages });
            }}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-md shadow-soft hover:bg-white flex items-center justify-center text-[#0B2D7F] transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
            title="Quick View"
            aria-label="Quick View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>

        {/* Technical Minimalist Size Specification Bar (Strictly S to XXL) */}
        <div className="absolute bottom-2 inset-x-2 z-10 hidden sm:flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/95 backdrop-blur-md shadow-2xs border border-[#0B2D7F]/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-1 group-hover:translate-y-0">
          <span className="text-[9px] font-sans uppercase tracking-wider text-[#0B2D7F] font-semibold">Sizes</span>
          <span className="text-[9px] font-mono tracking-widest text-[#0B2D7F]/85 font-medium">S · M · L · XL · XXL</span>
        </div>

        {/* Carousel Arrow Controls */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-soft items-center justify-center text-[#0B2D7F] text-xs font-bold transition-all cursor-pointer ${
                isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
              }`}
              aria-label="Previous angle"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-soft items-center justify-center text-[#0B2D7F] text-xs font-bold transition-all cursor-pointer ${
                isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
              }`}
              aria-label="Next angle"
            >
              ›
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none sm:group-hover:opacity-0 transition-opacity">
              {activeImages.slice(0, 5).map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1 rounded-full transition-all ${
                    currentImgIdx === dotIdx ? 'w-3 bg-white shadow-xs' : 'w-1 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Details & Wholesale Concierge Action */}
      <div className="pt-2.5 pb-0.5 flex flex-col justify-between flex-1 gap-1.5">
        {/* Technical Specification Chip */}
        <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-mono tracking-wider uppercase text-[#0B2D7F]/50 px-0.5">
          <span>JAIPUR ATELIER</span>
          <span className="truncate max-w-[110px]">{refCode}</span>
        </div>

        {/* Audited Color Variant Swatches */}
        {hasVariants && (
          <div className="flex items-center justify-between px-0.5 py-0.5 min-h-[18px]">
            {variants.length > 1 ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  {visibleVariants.map((variant, vIdx) => {
                    const isSelected = selectedVariantIdx === vIdx;
                    return (
                      <button
                        key={vIdx}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedVariantIdx(vIdx);
                          setCurrentImgIdx(0);
                        }}
                        onMouseEnter={() => {
                          setSelectedVariantIdx(vIdx);
                          setCurrentImgIdx(0);
                        }}
                        title={variant.name}
                        className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'scale-125 border-[#0B2D7F] ring-1.5 ring-[#0B2D7F]/40 shadow-2xs'
                            : 'border-black/20 hover:scale-115 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: variant.colorCode }}
                        aria-label={`Select ${variant.name}`}
                      />
                    );
                  })}
                </div>
                {extraVariantCount > 0 && (
                  <span className="text-[9px] font-mono text-[#0B2D7F]/60">
                    +{extraVariantCount}
                  </span>
                )}
                <span className="text-[9px] font-sans text-[#0B2D7F]/60 ml-auto font-medium tracking-tight">
                  {variants.length} Colors
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 w-full">
                <span
                  className="w-3 h-3 rounded-full border border-black/20 shadow-2xs shrink-0"
                  style={{ backgroundColor: variants[0].colorCode }}
                  title={variants[0].name}
                />
                <span className="text-[9.5px] font-sans text-[#0B2D7F]/75 font-medium truncate max-w-[120px]">
                  {variants[0].name}
                </span>
                <span className="text-[9px] font-sans text-[#0B2D7F]/50 ml-auto font-medium tracking-tight">
                  1 Color
                </span>
              </div>
            )}
          </div>
        )}

        {/* Title and Clean Concise MOQ */}
        <div className="flex items-baseline justify-between gap-2 px-0.5">
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-[13.5px] sm:text-[14.5px] font-medium text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors truncate tracking-wide flex-1"
          >
            {product.title}
          </Link>
          <span className="text-[9.5px] sm:text-[10px] font-sans text-[#0B2D7F]/70 uppercase tracking-wider shrink-0 font-medium">
            {displayMoq}
          </span>
        </div>

        {/* Single Sleek Modern Wholesale Enquiry Action Button (Zero Retail Price) */}
        <div className="pt-1 w-full">
          <Link
            href={`/products/${product.slug}`}
            className="w-full py-2.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-center text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] shadow-soft hover:shadow-card active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer group"
          >
            <span>Enquire for Boutiques</span>
            <span className="text-[#D4AF37] group-hover:translate-x-0.5 transition-transform duration-200 text-xs">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
export default ProductCard;
