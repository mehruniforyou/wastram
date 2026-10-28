'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import { useCart } from '@/context/CartContext';

interface Props {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = NISHORAMA_PRODUCTS.find(p => p.slug === params.slug) || NISHORAMA_PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('XS');
  const [measurementUnit, setMeasurementUnit] = useState<'inch' | 'cm'>('inch');
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // Accordion states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    shipping: false,
    returns: false
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { addToCart, toggleWishlist, isWishlisted, openSizeGuide, openTapAndView } = useCart();
  const wishlisted = isWishlisted(product.slug);

  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const measurements = measurementUnit === 'inch'
    ? { chest: '30-32', waist: '26-28', hip: '32-34', unit: 'Inch' }
    : { chest: '76-81', waist: '66-71', hip: '81-86', unit: 'CM' };

  const relatedProducts = NISHORAMA_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-archivo">
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

      <StoryViewerModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1440px] w-full mx-auto px-3 md:px-6 py-2.5 text-xs text-black/50 flex items-center gap-2">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/collections/shop-all" className="hover:text-black">Shop All</Link>
        <span>/</span>
        <span className="text-[#482922] font-semibold uppercase tracking-tight line-clamp-1">{product.title}</span>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP 3-COLUMN PDP LAYOUT (Screens >= 950px)                 */}
      {/* ============================================================== */}
      <div className="hidden lg:block max-w-[1440px] w-full mx-auto px-6 py-4">
        <div className="flex gap-[1.5%] items-start">
          {/* ========================================================== */}
          {/* COLUMN 1: LEFT DETAILS & ACCORDIONS (Width: 32%)           */}
          {/* ========================================================== */}
          <div className="w-[32%] sticky top-20 flex flex-col justify-between min-h-[calc(100vh-6rem)] py-2">
            <div className="flex flex-col gap-4">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-white text-[#482922] text-[11px] font-medium rounded-full shadow-2xs">
                  Cotton
                </span>
                <span className="px-3 py-1 bg-white text-[#482922] text-[11px] font-medium rounded-full shadow-2xs">
                  Slim Fit
                </span>
                <span className="px-3 py-1 bg-white text-[#482922] text-[11px] font-medium rounded-full shadow-2xs">
                  Full sleeves
                </span>
              </div>

              {/* Title & Official Wishlist Bookmark */}
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-xl xl:text-2xl font-bold text-[#482922] uppercase tracking-tight leading-tight">
                  {product.title}
                </h1>

                {/* Bookmark Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.slug)}
                  className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#482922] hover:bg-[#FAF8F5] transition-transform active:scale-90 flex-shrink-0"
                  aria-label="Save to wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12.39"
                    height="18.53"
                    viewBox="0 0 12.39 18.53"
                    className={`transition-all ${
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
              </div>

              {/* Specs metadata */}
              <div className="flex flex-col gap-1.5 text-xs text-[#482922] py-2 border-y border-black/10">
                <div className="flex">
                  <span className="w-28 opacity-70 font-medium">Style</span>
                  <span className="font-semibold">{product.category} Special</span>
                </div>
                <div className="flex">
                  <span className="w-28 opacity-70 font-medium">Color</span>
                  <span className="font-semibold">Handblock Floral</span>
                </div>
                <div className="flex">
                  <span className="w-28 opacity-70 font-medium">Model Fit Check</span>
                  <span className="font-semibold">Model is wearing size XS</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="flex flex-col gap-1">
                {/* Details & Description */}
                <div className="border-b border-black/10 py-3">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('details')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/80 hover:text-[#482922]"
                  >
                    <span>Details & Description</span>
                    <span className={`transition-transform duration-300 ${openAccordions.details ? 'rotate-90' : '-rotate-90'}`}>
                      ›
                    </span>
                  </button>
                  {openAccordions.details && (
                    <div className="text-xs text-black/70 pt-2.5 space-y-1.5 leading-relaxed">
                      <p>• Handcrafted pure cotton silhouette designed for supreme breathability.</p>
                      <p>• Traditional hand-block artisan motifs curated for modern elegance.</p>
                      <p>• Machine wash cold delicate cycle. Do not bleach. Dry in shade.</p>
                    </div>
                  )}
                </div>

                {/* Shipping & Delivery */}
                <div className="border-b border-black/10 py-3">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/80 hover:text-[#482922]"
                  >
                    <span>Shipping & Delivery</span>
                    <span className={`transition-transform duration-300 ${openAccordions.shipping ? 'rotate-90' : '-rotate-90'}`}>
                      ›
                    </span>
                  </button>
                  {openAccordions.shipping && (
                    <div className="text-xs text-black/70 pt-2.5 space-y-1.5 leading-relaxed">
                      <p>• Fast dispatch within 24-48 business hours from Mumbai warehouse.</p>
                      <p>• Free shipping all over India on orders above ₹2,999.</p>
                      <p>• Standard delivery within 3-5 working days.</p>
                    </div>
                  )}
                </div>

                {/* Return & Exchange */}
                <div className="border-b border-black/10 py-3">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('returns')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/80 hover:text-[#482922]"
                  >
                    <span>Return & Exchange</span>
                    <span className={`transition-transform duration-300 ${openAccordions.returns ? 'rotate-90' : '-rotate-90'}`}>
                      ›
                    </span>
                  </button>
                  {openAccordions.returns && (
                    <div className="text-xs text-black/70 pt-2.5 space-y-1.5 leading-relaxed">
                      <p>• 7-day hassle-free reverse pickup exchange available.</p>
                      <p>• Easy size swap directly from your customer account.</p>
                      <p>• Must be unworn with original tags and packaging intact.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tap & View Hint */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => openTapAndView(product)}
                className="w-full py-2.5 rounded-full border border-black/20 bg-white hover:bg-[#482922] hover:text-white text-[#482922] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>🔍 Tap & View Lightbox</span>
              </button>
            </div>
          </div>

          {/* ========================================================== */}
          {/* COLUMN 2: CENTER HIGH-RES GALLERY (Width: 34%)             */}
          {/* ========================================================== */}
          <div className="w-[34%] flex flex-col gap-3">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#EEEEEE] cursor-zoom-in group shadow-2xs"
                onMouseEnter={() => setIsZoomActive(true)}
                onMouseLeave={() => setIsZoomActive(false)}
                onMouseMove={handleMouseMove}
                onClick={() => openTapAndView(product)}
              >
                <img
                  src={img}
                  alt={`${product.title} angle ${idx + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105`}
                />

                {/* Zoom overlay badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to Zoom
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================== */}
          {/* COLUMN 3: RIGHT SIZES, PRICE & PURCHASE (Width: 32%)       */}
          {/* ========================================================== */}
          <div className="w-[32%] sticky top-20 flex flex-col justify-between min-h-[calc(100vh-6rem)] py-2">
            <div className="flex flex-col gap-4">
              {/* Measurement Bar & Size Guide */}
              <div className="flex items-center justify-between">
                {/* Inches / CM Toggle */}
                <div className="flex items-center bg-[#EBE9E9] p-0.5 rounded-full text-xs">
                  <button
                    type="button"
                    onClick={() => setMeasurementUnit('inch')}
                    className={`px-3 py-1 rounded-full font-semibold transition-all ${
                      measurementUnit === 'inch' ? 'bg-white text-black shadow-2xs' : 'text-black/60'
                    }`}
                  >
                    Inches
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeasurementUnit('cm')}
                    className={`px-3 py-1 rounded-full font-semibold transition-all ${
                      measurementUnit === 'cm' ? 'bg-white text-black shadow-2xs' : 'text-black/60'
                    }`}
                  >
                    CM
                  </button>
                </div>

                {/* What's my size ? Pill */}
                <button
                  type="button"
                  onClick={openSizeGuide}
                  className="px-3.5 py-1.5 rounded-full bg-[#482922] text-white/90 hover:text-white text-xs font-semibold tracking-wide transition-all shadow-2xs"
                >
                  What&apos;s my size ?
                </button>
              </div>

              {/* Body measurements row */}
              <div className="flex items-center justify-between text-xs bg-white px-3.5 py-2 rounded-xl border border-black/5 text-[#482922]">
                <div>
                  <span className="opacity-60 text-[10px] uppercase font-bold block">Chest</span>
                  <span className="font-bold">{measurements.chest} {measurements.unit}</span>
                </div>
                <div>
                  <span className="opacity-60 text-[10px] uppercase font-bold block">High Waist</span>
                  <span className="font-bold">{measurements.waist} {measurements.unit}</span>
                </div>
                <div>
                  <span className="opacity-60 text-[10px] uppercase font-bold block">Hip</span>
                  <span className="font-bold">{measurements.hip} {measurements.unit}</span>
                </div>
              </div>

              {/* Size Selector Pills (Exact Nishorama 8.64px roundness) */}
              <div className="grid grid-cols-7 gap-1.5">
                {sizes.map(size => {
                  const isSelected = selectedSize === size;
                  const isUnavailable = size === 'XXL';

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => setSelectedSize(size)}
                      className={`relative h-12 rounded-[8.64px] font-archivo text-xs font-bold transition-all flex flex-col items-center justify-center ${
                        isUnavailable
                          ? 'bg-white text-black/25 border border-dashed border-black/15 cursor-not-allowed'
                          : isSelected
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

              {/* Price Line */}
              <div className="flex items-center justify-between py-2 border-y border-black/10">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-sm line-through text-black/40">
                    ₹ {product.regularPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-black text-[#FF2F00]">
                    ₹ {product.salePrice.toLocaleString()}
                  </span>
                </div>

                <span className="px-2.5 py-0.5 bg-white border border-[#CDCDCD] text-[#121212] text-xs font-bold rounded">
                  Sale
                </span>
              </div>

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => addToCart(product, selectedSize, 1)}
                  className="py-3 rounded-full bg-white border border-[#482922] text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  ADD TO CART
                </button>

                <button
                  type="button"
                  onClick={() => addToCart(product, selectedSize, 1)}
                  className="py-3 rounded-full bg-[#482922] text-white hover:bg-[#38201a] font-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  BUY IT NOW
                </button>
              </div>

              {/* Exclusive Offers & Savings */}
              <div className="bg-white p-3.5 rounded-2xl border border-black/5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#482922]">
                  <span>Exclusive Offers & Savings</span>
                  <span className="text-[10px] bg-[#FAF8F5] text-[#FF2F00] px-2 py-0.5 rounded border border-[#FF2F00]/20">
                    LIMITED TIME
                  </span>
                </div>

                {/* Offer 1 */}
                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-black/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#482922] block">Free pant on ₹2999+ orders</span>
                    <span className="text-[11px] text-black/60">Select your favourite pant and size at cart</span>
                  </div>
                  <span className="bg-[#482922] text-[#F6C582] text-[10px] font-bold px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                {/* Offer 2 & 3 Coupon Boxes */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white text-center">
                    <span className="text-[10px] text-black/60 block">Orders ₹3,999+</span>
                    <span className="font-black text-[#FF2F00] text-xs">SAVE₹200</span>
                  </div>
                  <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white text-center">
                    <span className="text-[10px] text-black/60 block">Orders ₹4,999+</span>
                    <span className="font-black text-[#FF2F00] text-xs">SAVE₹400</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-black/70 px-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <span>🚚</span>
                  <span>Cash On Delivery Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🔄</span>
                  <span>Easy 7 Days Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE STACKED PDP LAYOUT (Screens < 950px)                   */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full flex flex-col pb-8">
        {/* Main Media Carousel Container */}
        <div className="relative w-full h-[130vw] max-h-[580px] bg-[#EEEEEE] overflow-hidden rounded-b-[4vw]">
          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />

          {/* Slide Indicator */}
          <div className="absolute bottom-3 left-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
            {activeImageIndex + 1} / {product.images.length}
          </div>

          {/* Inset "Touch to zoom in" floating preview */}
          <button
            type="button"
            onClick={() => openTapAndView(product)}
            className="absolute bottom-3 right-4 bg-white/90 backdrop-blur-md shadow-md rounded-xl p-2 flex items-center gap-2 text-left"
          >
            <div className="w-8 h-11 rounded overflow-hidden bg-black/10">
              <img
                src={product.images[1] || product.images[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] font-bold text-[#482922] uppercase tracking-wide pr-1">
              Touch to zoom in
            </span>
          </button>

          {/* Top Pill Tags on Image */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="bg-white/90 backdrop-blur-sm text-[#482922] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
              Cotton
            </span>
            <span className="bg-white/90 backdrop-blur-sm text-[#482922] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
              Slim Fit
            </span>
            <span className="bg-white/90 backdrop-blur-sm text-[#482922] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
              Full sleeves
            </span>
          </div>
        </div>

        {/* Thumbnail Dots Bar */}
        {product.images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-2.5 bg-white">
            {product.images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setActiveImageIndex(dotIdx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeImageIndex === dotIdx ? 'w-4 bg-[#482922]' : 'w-1.5 bg-black/20'
                }`}
                aria-label={`Slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Mobile Info Sheet */}
        <div className="bg-white px-4 py-5 rounded-[4vw] -mt-3 shadow-sm flex flex-col gap-4">
          {/* Title Row with Official Wishlist Bookmark */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-base font-bold text-[#482922] uppercase tracking-tight">
                {product.title}
              </h1>
              <p className="text-xs text-black/60 mt-0.5">Floral Print Handcrafted Kurti</p>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className="w-9 h-9 rounded-full bg-[#FAF8F5] shadow-sm flex items-center justify-center text-[#482922] active:scale-90"
              aria-label="Save to wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="18"
                viewBox="0 0 12.39 18.53"
                className={`transition-all ${
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
          </div>

          {/* Price Line */}
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span className="text-xs line-through text-black/40">
                ₹ {product.regularPrice.toLocaleString()}
              </span>
              <span className="text-lg font-black text-[#FF2F00]">
                ₹ {product.salePrice.toLocaleString()}
              </span>
            </div>
            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-black/15 text-[#482922] text-[10px] font-bold rounded">
              Sale
            </span>
          </div>

          {/* Measurements & Size Guide */}
          <div className="flex items-center justify-between bg-[#F5F5F5] p-2 rounded-xl text-[11px]">
            <span className="font-semibold text-[#482922]">
              Chest {measurements.chest} • Waist {measurements.waist} • Hip {measurements.hip}
            </span>
            <button
              type="button"
              onClick={openSizeGuide}
              className="px-2.5 py-1 rounded-full bg-[#482922] text-white text-[10px] font-bold"
            >
              What&apos;s my size ?
            </button>
          </div>

          {/* Size Pills Grid (7 columns) */}
          <div className="grid grid-cols-7 gap-1.5">
            {sizes.map(size => {
              const isSelected = selectedSize === size;
              const isUnavailable = size === 'XXL';

              return (
                <button
                  key={size}
                  type="button"
                  disabled={isUnavailable}
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 rounded-[2.8vw] font-archivo text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    isUnavailable
                      ? 'bg-white text-black/25 border border-dashed border-black/15'
                      : isSelected
                      ? 'bg-[#482922] text-white border-2 border-[#482922]'
                      : 'bg-white text-[#121212] border border-[#D8D8D8]'
                  }`}
                >
                  <span>{size}</span>
                  {isSelected && (
                    <span className="w-3 h-[1.5px] bg-[#F6C582] rounded-full mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => addToCart(product, selectedSize, 1)}
              className="w-full py-3.5 rounded-full bg-white border border-[#482922] text-[#482922] font-bold text-xs uppercase tracking-wider"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              onClick={() => addToCart(product, selectedSize, 1)}
              className="w-full py-3.5 rounded-full bg-[#482922] text-white font-bold text-xs uppercase tracking-wider"
            >
              BUY IT NOW
            </button>
          </div>

          {/* Exclusive Offers & Savings */}
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-black/5 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#482922]">
              Free pant on orders ₹2,999+
            </span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white font-bold text-[#FF2F00]">
                SAVE₹200
              </div>
              <div className="p-2 border border-dashed border-[#482922]/40 rounded-xl bg-white font-bold text-[#FF2F00]">
                SAVE₹400
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-black/10 pt-2 space-y-2 text-xs">
            <details className="py-2 border-b border-black/5" open>
              <summary className="font-bold text-[#482922] uppercase tracking-wider cursor-pointer">
                Details & Description
              </summary>
              <p className="mt-2 text-black/70 leading-relaxed">
                Handcrafted pure cotton silhouette designed for supreme breathability. Traditional hand-block artisan motifs curated for modern elegance.
              </p>
            </details>
            <details className="py-2 border-b border-black/5">
              <summary className="font-bold text-[#482922] uppercase tracking-wider cursor-pointer">
                Shipping & Delivery
              </summary>
              <p className="mt-2 text-black/70 leading-relaxed">
                Fast dispatch within 24-48 business hours from Mumbai. Free shipping across India on orders above ₹2,999.
              </p>
            </details>
            <details className="py-2 border-b border-black/5">
              <summary className="font-bold text-[#482922] uppercase tracking-wider cursor-pointer">
                Return & Exchange
              </summary>
              <p className="mt-2 text-black/70 leading-relaxed">
                7-day hassle-free reverse pickup exchange available directly from your account.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RELATED PRODUCTS RECOMMENDATION                                */}
      {/* ============================================================== */}
      <section className="w-full py-8 md:py-12 px-3 md:px-6 bg-[#FAF8F5] border-t border-black/10">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-tight text-[#482922]">
              You May Also Like
            </h2>
            <p className="text-xs text-black/60 mt-0.5">Complementary styles from our signature collections</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 lg:gap-5">
            {relatedProducts.map(rel => {
              const relWish = isWishlisted(rel.slug);
              return (
                <div key={rel.id} className="group relative flex flex-col bg-transparent">
                  <div className="relative aspect-[400/700] md:aspect-[400/680] w-full bg-[#EEEEEE] rounded-[4vw] md:rounded-[1vw] overflow-hidden">
                    <Link href={`/products/${rel.slug}`} className="block w-full h-full">
                      <img
                        src={rel.images[0]}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    <div className="cust-badges-wrapper absolute top-2 left-2 md:top-2.5 md:left-2.5 z-10">
                      <span className="cust-sale-badge">{rel.badge}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(rel.slug);
                      }}
                      className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#482922]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="16"
                        viewBox="0 0 12.39 18.53"
                        className={`transition-all ${relWish ? 'fill-[#FF2F00] text-[#FF2F00]' : 'fill-none stroke-current'}`}
                      >
                        <path
                          id="savewishlist"
                          strokeWidth="1.2"
                          d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="pt-2 flex items-start justify-between gap-1">
                    <div className="flex flex-col">
                      <Link
                        href={`/products/${rel.slug}`}
                        className="font-archivo font-bold text-[2.8vw] md:text-[0.85vw] text-[#482922] hover:text-[#FF2F00] line-clamp-1 uppercase"
                      >
                        {rel.title}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs font-archivo">
                        <span className="text-[2.4vw] md:text-[0.75vw] line-through text-black/50">
                          ₹ {rel.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#FF2F00]">
                          ₹ {rel.salePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openTapAndView(rel)}
                      className="px-2.5 py-1 rounded-full border border-[#482922] bg-white text-[#482922] hover:bg-[#482922] hover:text-white font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <PopularSearches />
    </div>
  );
}
