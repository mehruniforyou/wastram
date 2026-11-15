'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { NishoramaProduct } from '@/data/nishorama-data';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: NishoramaProduct;
  priority?: boolean;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function ProductCardComponent({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const { toggleWishlist, isWishlisted, addToCart, openTapAndView } = useCart();
  const wishlisted = isWishlisted(product.slug);

  const hasVariants = Boolean(product.colorVariants && product.colorVariants.length > 0);
  const activeVariant = hasVariants ? product.colorVariants![selectedVariantIdx] : null;
  const activeImages =
    activeVariant && activeVariant.images && activeVariant.images.length > 0
      ? activeVariant.images
      : product.images;

  const totalImages = activeImages.length;
  const displayImage =
    isHovered && totalImages > 1
      ? activeImages[currentImgIdx] || activeImages[0]
      : activeImages[0] || product.images[0];

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % totalImages);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + totalImages) % totalImages);
  };

  // Clean concise MOQ badge
  const rawMoq = product.moq
    ? product.moq.includes('/')
      ? product.moq.split('/')[0].trim()
      : product.moq
    : '20 pcs';
  const displayMoq = rawMoq.toLowerCase().startsWith('moq') ? rawMoq : `MOQ ${rawMoq}`;

  // Technical reference code
  const skuCode = product.sku || `WD-${String(product.id).slice(-3).padStart(3, '0')}`;

  // Direct WhatsApp Enquiry Link
  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello Wastram Jaipur, I am interested in wholesale boutique sourcing for:
• Product: ${product.title}
• SKU: ${skuCode}
• Selected Size: ${selectedSize} (Sizes S-XXL)
• Category: ${product.category || 'Atelier Collection'}

Please share your wholesale tiered pricing, lookbook, and production lead time.`;

    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleAddToShortlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImgIdx(0);
      }}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#0B2D7F]/10 hover:border-[#D4AF37] shadow-soft hover:shadow-cardHover transition-all duration-400 select-none"
    >
      {/* 1. Portrait 3:4 Media Container Matching Gulmohar Jaipur */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF9F6]">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Link>

        {/* Top-Left: Badge (e.g. MOQ or Handcrafted) */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#071F59]/90 text-white text-[9px] sm:text-[10px] font-jost uppercase tracking-[0.1em] font-semibold backdrop-blur-sm shadow-xs border border-white/20">
            {product.badge || displayMoq}
          </span>
        </div>

        {/* Top-Right: Circular Pulsing Discount / Wholesale Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#071F59] text-[#D4AF37] text-[10px] sm:text-[11px] font-jost font-bold flex items-center justify-center border border-[#D4AF37]/60 shadow-md">
            -50%
          </span>
        </div>

        {/* Bottom-Right: Wishlist Heart Button (Gulmohar Style) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.slug);
          }}
          className="absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-soft hover:bg-white flex items-center justify-center text-[#071F59] transition-transform active:scale-90 cursor-pointer"
          aria-label="Add to wishlist"
          title="Save to Wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            className={`transition-colors ${
              wishlisted ? 'fill-[#F58220] stroke-[#F58220]' : 'fill-none stroke-current'
            }`}
            strokeWidth="1.8"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* Tap & View Quick Peek Button (Top-Right under badge) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openTapAndView({ ...product, images: activeImages });
          }}
          className="absolute top-13 right-2.5 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-soft hover:bg-white flex items-center justify-center text-[#071F59] transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
          title="Quick View"
          aria-label="Quick View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* In-Card Multi-Image Carousel Arrows (Gulmohar Jaipur feature) */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous Image"
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-soft flex items-center justify-center text-[#071F59] text-sm font-bold transition-all cursor-pointer ${
                isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
              }`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next Image"
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-soft flex items-center justify-center text-[#071F59] text-sm font-bold transition-all cursor-pointer ${
                isHovered ? 'opacity-90 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
              }`}
            >
              ›
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none">
              {activeImages.slice(0, 5).map((_, dotIdx) => (
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

      {/* 2. Product Details & B2B Wholesale Info */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-2 bg-white">
        {/* Color Swatches if available */}
        {hasVariants && product.colorVariants!.length > 1 && (
          <div className="flex items-center gap-1.5 min-h-[18px]">
            {product.colorVariants!.map((variant, vIdx) => {
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
                  title={variant.name}
                  className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'scale-125 border-[#071F59] ring-1.5 ring-[#D4AF37]'
                      : 'border-black/20 hover:scale-110 opacity-75 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: variant.colorCode }}
                  aria-label={`Select ${variant.name}`}
                />
              );
            })}
            <span className="text-[10px] font-jost text-[#888888] ml-auto">
              {product.colorVariants!.length} Shades
            </span>
          </div>
        )}

        {/* 5-Star Judge.me Review Stars (Gulmohar Style in Gold) */}
        <div className="flex items-center gap-1.5 text-[#D4AF37] text-[11px] leading-none">
          <div className="flex items-center tracking-tighter">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
          <span className="text-[10px] font-jost text-[#777777] font-medium">
            (4.9) • 18 reviews
          </span>
        </div>

        {/* Product Title in Uppercase Jost, clamped to 2 lines */}
        <Link
          href={`/products/${product.slug}`}
          className="font-jost text-[12.5px] sm:text-[13.5px] font-medium text-[#071F59] hover:text-[#0B2D7F] transition-colors uppercase tracking-[0.04em] line-clamp-2 leading-[1.35]"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Technical SKU and Wholesale Status */}
        <div className="flex items-center justify-between text-[10px] font-jost uppercase tracking-wider text-[#777777] pt-0.5 border-t border-[#0B2D7F]/5">
          <span className="font-mono text-[#071F59] font-medium">{skuCode}</span>
          <span className="text-[#25D366] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            Wholesale Ready
          </span>
        </div>

        {/* Size Selection Pill Combobox */}
        <div className="flex items-center justify-between gap-1 py-1">
          <span className="text-[10px] font-jost uppercase tracking-wider text-[#888888]">
            Sizes:
          </span>
          <div className="flex items-center gap-1">
            {AVAILABLE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`w-6 h-5.5 rounded text-[9.5px] font-jost font-semibold uppercase transition-all cursor-pointer flex items-center justify-center ${
                  selectedSize === size
                    ? 'bg-[#071F59] text-white shadow-xs'
                    : 'bg-[#FAF9F6] text-[#071F59] hover:bg-[#071F59]/10 border border-[#0B2D7F]/10'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Action Buttons: Direct WhatsApp Enquiry & Shortlist */}
        <div className="grid grid-cols-[1fr_auto] gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleWhatsAppEnquiry}
            className="w-full py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-jost text-[11px] font-semibold uppercase tracking-[0.1em] shadow-soft flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            title="Enquire on WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.228-.588-1.782-.751-2.906-2.559-2.996-2.678-.088-.119-.716-.954-.716-1.821 0-.867.453-1.294.614-1.467.161-.173.351-.216.468-.216.117 0 .234.002.336.007.108.005.253-.041.395.3.144.347.491 1.196.533 1.282.042.086.07.187.014.3-.056.113-.085.183-.17.283-.085.1-.179.224-.256.3-.085.085-.174.178-.075.348.099.17.439.723.942 1.172.646.577 1.191.756 1.361.841.17.085.27.071.37-.044.1-.115.428-.499.542-.67.114-.171.228-.143.385-.085.157.057.994.469 1.165.555.171.085.285.128.328.2.043.072.043.418-.101.823z" />
            </svg>
            <span className="truncate">Enquire on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleAddToShortlist}
            className="w-9 h-9 rounded-lg bg-[#FAF9F6] hover:bg-[#071F59] text-[#071F59] hover:text-white border border-[#0B2D7F]/15 transition-all flex items-center justify-center cursor-pointer active:scale-90"
            title="Add to Enquiry Shortlist"
            aria-label="Add to Enquiry Shortlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
export default ProductCard;
