'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import B2BEnquiryModal from '@/components/B2BEnquiryModal';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

interface Props {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<NishoramaProduct>(
    () => NISHORAMA_PRODUCTS.find(p => p.slug === params.slug) || NISHORAMA_PRODUCTS[0]
  );

  // Sync with live product updates from admin console
  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.products)) {
          const found = data.products.find((p: NishoramaProduct) => p.slug === params.slug || p.id === params.slug);
          if (found) setProduct(found);
        }
      })
      .catch(() => {});
  }, [params.slug]);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('XS');
  const [measurementUnit, setMeasurementUnit] = useState<'inch' | 'cm'>('inch');

  const hasVariants = Boolean(product.colorVariants && product.colorVariants.length > 0);
  const activeVariant = hasVariants ? product.colorVariants![selectedVariantIndex] : null;
  const activeImages = activeVariant && activeVariant.images && activeVariant.images.length > 0
    ? activeVariant.images
    : product.images;

  // Accordion states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    shipping: false,
    returns: false,
  });

  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);

  const { toggleWishlist, isWishlisted, openSizeGuide, openTapAndView } = useCart();
  const wishlisted = isWishlisted(product.slug);

  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const measurements = measurementUnit === 'inch'
    ? { chest: '30-32', waist: '26-28', hip: '32-34', unit: 'Inch' }
    : { chest: '76-81', waist: '66-71', hip: '81-86', unit: 'CM' };

  const relatedProducts = NISHORAMA_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Mobile Horizontal Swipe Handler
  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current) return;
    const { scrollLeft, clientWidth } = mobileCarouselRef.current;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== activeImageIndex && newIndex >= 0 && newIndex < activeImages.length) {
        setActiveImageIndex(newIndex);
      }
    }
  };

  const scrollToMobileSlide = (index: number) => {
    if (!mobileCarouselRef.current) return;
    const clientWidth = mobileCarouselRef.current.clientWidth;
    mobileCarouselRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth',
    });
    setActiveImageIndex(index);
  };

  // Clean concise MOQ
  const rawMoq = product.moq
    ? product.moq.includes('/')
      ? product.moq.split('/')[0].trim()
      : product.moq
    : '20 pcs';
  const displayMoq = rawMoq.toLowerCase().startsWith('moq') ? rawMoq : `MOQ ${rawMoq}`;

  const whatsappMessage = encodeURIComponent(
    `Hello Wastram Atelier, I am interested in boutique pricing for ${product.title} (SKU: ${product.sku || product.id}). Please share line sheets and fabric specifications.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Header
        onOpenStory={() => setIsStoryOpen(true)}
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
      <div className="max-w-[1540px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-[#0B2D7F]/60 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0B2D7F] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/collections/shop-all" className="hover:text-[#0B2D7F] transition-colors">Shop All</Link>
        <span>/</span>
        <span className="text-[#0B2D7F] font-medium uppercase tracking-tight truncate">{product.title}</span>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP 3-COLUMN PDP: ONLY CENTER IMAGES SCROLL, SIDES STICKY  */}
      {/* ============================================================== */}
      <div className="hidden lg:grid grid-cols-12 gap-6 xl:gap-8 items-start max-w-[1540px] w-full mx-auto px-6 lg:px-8 py-4">
        {/* ========================================================== */}
        {/* COLUMN 1: LEFT DETAILS & ACCORDIONS (STICKY PINNED)        */}
        {/* ========================================================== */}
        <div className="col-span-4 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar flex flex-col gap-4 py-2 pr-2">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white text-[#0B2D7F] text-[11px] font-medium rounded-full shadow-soft">
              Cotton
            </span>
            <span className="px-3 py-1 bg-white text-[#0B2D7F] text-[11px] font-medium rounded-full shadow-soft">
              Slim Fit
            </span>
            <span className="px-3 py-1 bg-white text-[#0B2D7F] text-[11px] font-medium rounded-full shadow-soft">
              Full sleeves
            </span>
          </div>

          {/* Title & Official Wishlist Bookmark */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl xl:text-3xl font-serif font-normal text-[#0B2D7F] uppercase tracking-wide leading-tight">
              {product.title}
            </h1>

            {/* Bookmark Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-[#0B2D7F] hover:bg-[#FAF9F6] transition-transform active:scale-90 flex-shrink-0 cursor-pointer"
              aria-label="Save to wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="18"
                viewBox="0 0 12.39 18.53"
                className={`transition-all ${
                  wishlisted ? 'fill-[#F58220] text-[#F58220] animate-heart-bounce' : 'fill-none stroke-current'
                }`}
              >
                <path
                  id="savewishlist"
                  strokeWidth="1.3"
                  d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
                />
              </svg>
            </button>
          </div>

          {/* Specs metadata */}
          <div className="flex flex-col gap-2 text-xs text-[#0B2D7F] py-3 border-y border-[#0B2D7F]/10">
            <div className="flex">
              <span className="w-32 opacity-70 font-medium">Style Category</span>
              <span className="font-semibold capitalize">{product.category.replace(/-/g, ' ')}</span>
            </div>
            <div className="flex">
              <span className="w-32 opacity-70 font-medium">Color &amp; Craft</span>
              <span className="font-semibold">{activeVariant ? activeVariant.name : 'Artisanal Jaipuri Craft'}</span>
            </div>
            <div className="flex">
              <span className="w-32 opacity-70 font-medium">Model Fit</span>
              <span className="font-semibold">Model is wearing size XS</span>
            </div>
          </div>

          {/* Accordions (Clean, borderless, soft shadow) */}
          <div className="flex flex-col gap-2">
            {/* Details & Description */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <button
                type="button"
                onClick={() => toggleAccordion('details')}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0B2D7F] cursor-pointer"
              >
                <span>Details &amp; Craftsmanship</span>
                <span className={`transition-transform duration-300 ${openAccordions.details ? 'rotate-90' : '-rotate-90'}`}>
                  &rsaquo;
                </span>
              </button>
              {openAccordions.details && (
                <div className="text-xs text-[#0B2D7F]/80 pt-3 space-y-1.5 leading-relaxed font-sans">
                  <p>&bull; Handcrafted pure cotton silhouette designed for supreme breathability.</p>
                  <p>&bull; Traditional hand-block artisan motifs curated for modern elegance.</p>
                  <p>&bull; Machine wash cold delicate cycle. Do not bleach. Dry in shade.</p>
                </div>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0B2D7F] cursor-pointer"
              >
                <span>Worldwide Delivery &amp; Freight</span>
                <span className={`transition-transform duration-300 ${openAccordions.shipping ? 'rotate-90' : '-rotate-90'}`}>
                  &rsaquo;
                </span>
              </button>
              {openAccordions.shipping && (
                <div className="text-xs text-[#0B2D7F]/80 pt-3 space-y-1.5 leading-relaxed font-sans">
                  <p>&bull; Fast dispatch within 24-48 business hours from Mumbai &amp; Jaipur warehouses.</p>
                  <p>&bull; Worldwide doorstep air &amp; ocean freight dispatch (UK, US, EU, Gulf). MOQ 20 pcs.</p>
                  <p>&bull; Air freight delivery within 4-7 business days with end-to-end tracking.</p>
                </div>
              )}
            </div>

            {/* Return & Exchange */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <button
                type="button"
                onClick={() => toggleAccordion('returns')}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0B2D7F] cursor-pointer"
              >
                <span>Return &amp; Exchange Policy</span>
                <span className={`transition-transform duration-300 ${openAccordions.returns ? 'rotate-90' : '-rotate-90'}`}>
                  &rsaquo;
                </span>
              </button>
              {openAccordions.returns && (
                <div className="text-xs text-[#0B2D7F]/80 pt-3 space-y-1.5 leading-relaxed font-sans">
                  <p>&bull; 7-day hassle-free reverse pickup exchange available directly from account.</p>
                  <p>&bull; Easy size swap and quality assurance guarantee for wholesale orders.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tap & View Hint */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => openTapAndView({ ...product, images: activeImages })}
              className="w-full py-2.5 rounded-full bg-white text-[#0B2D7F] hover:bg-[#0B2D7F] hover:text-white text-xs font-medium uppercase tracking-wider shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔍 Tap &amp; View Lightbox</span>
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* COLUMN 2: CENTER HIGH-RES GALLERY (SCROLLABLE IMAGE LIST)  */}
        {/* ========================================================== */}
        <div className="col-span-4 flex flex-col gap-4">
          {activeImages.map((img, idx) => (
            <div
              key={`${selectedVariantIndex}-${idx}`}
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white shadow-soft cursor-zoom-in group"
              onClick={() => openTapAndView({ ...product, images: activeImages })}
            >
              <img
                src={img}
                alt={`${product.title} - ${activeVariant?.name || ''} angle ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
              />

              {/* Zoom overlay badge */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Click to Zoom
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================== */}
        {/* COLUMN 3: RIGHT SIZES, PRICE & PURCHASE (STICKY PINNED)    */}
        {/* ========================================================== */}
        <div className="col-span-4 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar flex flex-col gap-4 py-2 pl-2">
          {/* Audited Color Variant Swatch Bar (Desktop) */}
          {hasVariants && (
            <div className="flex flex-col gap-2.5 bg-white p-4 rounded-2xl shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0B2D7F]">
                    Colorway:
                  </span>
                  <span className="text-xs font-bold text-[#F58220]">
                    {activeVariant?.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#0B2D7F]/60 font-mono tracking-wider uppercase">
                  {product.colorVariants!.length} {product.colorVariants!.length === 1 ? 'Color Available' : 'Colors Available'}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                {product.colorVariants!.map((variant, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setActiveImageIndex(0);
                      }}
                      title={variant.name}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0B2D7F] bg-[#0B2D7F]/5 ring-2 ring-[#0B2D7F]/20 shadow-xs'
                          : 'border-[#E8E4DA] bg-white hover:border-[#0B2D7F]/30 hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                      <span className={`text-[11px] ${isSelected ? 'font-semibold text-[#0B2D7F]' : 'font-medium text-[#0B2D7F]/75'}`}>
                        {variant.name}
                      </span>
                      <span className="text-[10px] text-[#0B2D7F]/50">
                        ({variant.images.length})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Measurement Bar & Size Guide */}
          <div className="flex items-center justify-between">
            {/* Inches / CM Toggle */}
            <div className="flex items-center bg-white p-1 rounded-full text-xs shadow-soft">
              <button
                type="button"
                onClick={() => setMeasurementUnit('inch')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  measurementUnit === 'inch' ? 'bg-[#0B2D7F] text-white shadow-soft' : 'text-[#0B2D7F]/70'
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setMeasurementUnit('cm')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  measurementUnit === 'cm' ? 'bg-[#0B2D7F] text-white shadow-soft' : 'text-[#0B2D7F]/70'
                }`}
              >
                CM
              </button>
            </div>

            {/* What's my size ? Pill */}
            <button
              type="button"
              onClick={openSizeGuide}
              className="px-3.5 py-1.5 rounded-full bg-[#0B2D7F] text-white text-xs font-medium tracking-wide transition-all shadow-soft cursor-pointer"
            >
              What&apos;s my size ?
            </button>
          </div>

          {/* Body measurements row */}
          <div className="flex items-center justify-between text-xs bg-white px-4 py-3 rounded-2xl shadow-soft text-[#0B2D7F]">
            <div>
              <span className="opacity-60 text-[10px] uppercase font-bold block">Chest</span>
              <span className="font-semibold">{measurements.chest} {measurements.unit}</span>
            </div>
            <div>
              <span className="opacity-60 text-[10px] uppercase font-bold block">High Waist</span>
              <span className="font-semibold">{measurements.waist} {measurements.unit}</span>
            </div>
            <div>
              <span className="opacity-60 text-[10px] uppercase font-bold block">Hip</span>
              <span className="font-semibold">{measurements.hip} {measurements.unit}</span>
            </div>
          </div>

          {/* Size Selector Pills (7 sizes) */}
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
                  className={`relative h-12 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isUnavailable
                      ? 'bg-white text-black/25 border border-dashed border-black/15 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#0B2D7F] text-white shadow-soft'
                      : 'bg-white text-[#0B2D7F] hover:bg-[#FAF9F6] shadow-soft'
                  }`}
                >
                  <span>{size}</span>
                  {isSelected && (
                    <span className="w-3 h-[1.5px] bg-[#D4AF37] rounded-full mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Show Price Button Bar */}
          <div className="flex items-center justify-between py-2 border-y border-[#0B2D7F]/10">
            <button
              type="button"
              onClick={() => setIsEnquiryModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] text-xs font-medium uppercase tracking-wider transition-all shadow-soft cursor-pointer"
            >
              <span>Show Price</span>
            </button>

            <span className="px-3.5 py-1 bg-white text-[#0B2D7F] text-xs font-medium rounded-full shadow-soft uppercase tracking-wider">
              {displayMoq}
            </span>
          </div>

          {/* Primary Atelier Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsEnquiryModalOpen(true)}
              className="py-3 rounded-full bg-white text-[#0B2D7F] hover:bg-[#FAF9F6] text-xs font-medium uppercase tracking-wider transition-all shadow-soft cursor-pointer"
            >
              Inquire for Boutiques
            </button>

            <a
              href={`https://wa.me/918003088838?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] text-xs font-medium uppercase tracking-wider transition-all shadow-soft flex items-center justify-center text-center cursor-pointer"
            >
              WhatsApp Concierge
            </a>
          </div>

          {/* Atelier Sourcing Terms Card */}
          <div className="bg-white p-4 rounded-2xl shadow-soft flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0B2D7F]">
              <span>Atelier Sourcing Terms</span>
              <span className="text-[10px] bg-[#FAF9F6] text-[#0B2D7F] px-2.5 py-0.5 rounded-full font-medium">
                COUTURE STANDARD
              </span>
            </div>

            <div className="bg-[#FAF9F6] p-3 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[#0B2D7F] block">Custom Private Labelling</span>
                <span className="text-[11px] text-[#0B2D7F]/70">Woven tags, barcode stickers &amp; custom packaging</span>
              </div>
              <span className="bg-[#0B2D7F] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full">
                AVAILABLE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF9F6] text-center">
                <span className="text-[10px] text-[#0B2D7F]/60 block uppercase">Flexible Batch MOQ</span>
                <span className="font-semibold text-[#0B2D7F] text-xs">20 Pcs / Style</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF9F6] text-center">
                <span className="text-[10px] text-[#0B2D7F]/60 block uppercase">Global Cargo Dispatch</span>
                <span className="font-semibold text-[#0B2D7F] text-xs">DHL &bull; Air &bull; Sea</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE STACKED PDP WITH BUTTERY SMOOTH HORIZONTAL SWIPE        */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full flex flex-col pb-8">
        {/* Mobile Smooth Swipe Media Carousel Container */}
        <div className="relative w-full h-[125vw] max-h-[560px] bg-white overflow-hidden rounded-b-3xl shadow-soft">
          <div
            ref={mobileCarouselRef}
            onScroll={handleMobileScroll}
            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {activeImages.map((img, idx) => (
              <div
                key={`${selectedVariantIndex}-${idx}`}
                className="w-full h-full flex-shrink-0 snap-center relative overflow-hidden"
                onClick={() => openTapAndView({ ...product, images: activeImages })}
              >
                <img
                  src={img}
                  alt={`${product.title} - ${activeVariant?.name || ''} angle ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {/* Slide Indicator Badge */}
          <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-sans font-medium px-3 py-1 rounded-full shadow-soft pointer-events-none">
            {activeImageIndex + 1} / {activeImages.length}
          </div>

          {/* Inset Tap to Zoom Pill */}
          <button
            type="button"
            onClick={() => openTapAndView({ ...product, images: activeImages })}
            className="absolute bottom-3 right-4 bg-white/95 backdrop-blur-md shadow-soft rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs text-[#0B2D7F] font-medium active:scale-95 cursor-pointer"
          >
            <span>🔍 Zoom</span>
          </button>

          {/* Top Pill Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
            <span className="bg-white/90 backdrop-blur-md text-[#0B2D7F] text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-soft">
              Cotton
            </span>
            <span className="bg-white/90 backdrop-blur-md text-[#0B2D7F] text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-soft">
              Slim Fit
            </span>
          </div>
        </div>

        {/* Thumbnail Dots Bar (Interactive & Synchronized) */}
        {activeImages.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-3 bg-[#FAF9F6]">
            {activeImages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollToMobileSlide(dotIdx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImageIndex === dotIdx ? 'w-5 bg-[#0B2D7F]' : 'w-1.5 bg-[#0B2D7F]/25'
                }`}
                aria-label={`Slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Mobile Info Sheet */}
        <div className="px-4 py-5 flex flex-col gap-4">
          {/* Title Row with Official Wishlist Bookmark */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-serif font-normal text-[#0B2D7F] uppercase tracking-wide">
                {product.title}
              </h1>
              <p className="text-xs text-[#0B2D7F]/70 mt-0.5 capitalize">
                {product.category.replace(/-/g, ' ')} &bull; {activeVariant ? activeVariant.name : 'Handcrafted'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-[#0B2D7F] active:scale-90"
              aria-label="Save to wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="18"
                viewBox="0 0 12.39 18.53"
                className={`transition-all ${
                  wishlisted ? 'fill-[#F58220] text-[#F58220] animate-heart-bounce' : 'fill-none stroke-current'
                }`}
              >
                <path
                  id="savewishlist"
                  strokeWidth="1.3"
                  d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Audited Color Variant Swatch Selector */}
          {hasVariants && (
            <div className="flex flex-col gap-2 bg-white p-3.5 rounded-2xl shadow-soft">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0B2D7F]">
                  Color: <span className="text-[#F58220] font-bold">{activeVariant?.name}</span>
                </span>
                <span className="text-[10px] text-[#0B2D7F]/60">
                  {product.colorVariants!.length} {product.colorVariants!.length === 1 ? 'Color' : 'Colors'}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                {product.colorVariants!.map((variant, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setActiveImageIndex(0);
                        if (mobileCarouselRef.current) {
                          mobileCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all ${
                        isSelected
                          ? 'border-[#0B2D7F] bg-[#0B2D7F]/5 ring-1.5 ring-[#0B2D7F]/20 font-semibold text-[#0B2D7F]'
                          : 'border-[#E8E4DA] bg-white text-[#0B2D7F]/75'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                      <span>{variant.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile Show Price Button Bar */}
          <div className="flex items-center justify-between py-2 border-b border-[#0B2D7F]/10">
            <button
              type="button"
              onClick={() => setIsEnquiryModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0B2D7F] text-white text-xs font-medium uppercase tracking-wider shadow-soft active:scale-95 cursor-pointer"
            >
              <span>Show Price</span>
            </button>
            <span className="px-3 py-1 bg-white text-[#0B2D7F] text-xs font-medium rounded-full shadow-soft uppercase tracking-wider">
              {displayMoq}
            </span>
          </div>

          {/* Measurements & Size Guide */}
          <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-2xl shadow-soft text-xs">
            <span className="font-medium text-[#0B2D7F]">
              Chest {measurements.chest} &bull; Waist {measurements.waist} &bull; Hip {measurements.hip}
            </span>
            <button
              type="button"
              onClick={openSizeGuide}
              className="px-3 py-1 rounded-full bg-[#0B2D7F] text-white text-[10px] font-medium uppercase tracking-wider"
            >
              Size Guide
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
                  className={`h-11 rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-center ${
                    isUnavailable
                      ? 'bg-white text-black/25 border border-dashed border-black/15'
                      : isSelected
                      ? 'bg-[#0B2D7F] text-white shadow-soft'
                      : 'bg-white text-[#0B2D7F] shadow-soft'
                  }`}
                >
                  <span>{size}</span>
                  {isSelected && (
                    <span className="w-3 h-[1.5px] bg-[#D4AF37] rounded-full mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Atelier Action CTAs */}
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsEnquiryModalOpen(true)}
              className="w-full py-3.5 rounded-full bg-white text-[#0B2D7F] font-medium text-xs uppercase tracking-wider shadow-soft active:scale-98"
            >
              Inquire for Boutiques
            </button>
            <a
              href={`https://wa.me/918003088838?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full bg-[#0B2D7F] text-white font-medium text-xs uppercase tracking-wider shadow-soft text-center flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>WhatsApp Concierge &rarr;</span>
            </a>
          </div>

          {/* Atelier Sourcing Terms */}
          <div className="bg-white p-4 rounded-2xl shadow-soft flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0B2D7F]">
              <span>Atelier Sourcing Terms</span>
              <span className="text-[9px] bg-[#FAF9F6] text-[#0B2D7F] px-2 py-0.5 rounded-full font-medium">
                COUTURE STANDARD
              </span>
            </div>
            <div className="bg-[#FAF9F6] p-3 rounded-xl text-xs">
              <span className="font-semibold text-[#0B2D7F] block">Custom Private Labelling &amp; Tags</span>
              <span className="text-[10px] text-[#0B2D7F]/70">MOQ 20 pcs/style &bull; Worldwide Doorstep Air/Sea Cargo</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RELATED PRODUCTS RECOMMENDATION                                */}
      {/* ============================================================== */}
      <section className="w-full py-12 md:py-16 px-4 md:px-8 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col items-center text-center">
            <span className="font-serif italic text-base md:text-lg text-[#D4AF37] tracking-wider mb-1">
              Complementary Silhouettes
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-[0.12em] uppercase text-[#0B2D7F]">
              Curated Pairings
            </h2>
            <div className="w-12 h-[1px] bg-[#D4AF37]/60 mt-3" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </section>

      {/* B2B Enquiry Modal */}
      <B2BEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={product}
        selectedSize={selectedSize}
      />

      <Footer />
    </div>
  );
}
