'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NishoramaProduct } from '@/data/nishorama-data';
import { useCart } from '@/context/CartContext';

interface QuickAddModalProps {
  product: NishoramaProduct | null;
  onClose: () => void;
}

export default function QuickAddModal({ product, onClose }: QuickAddModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('M');

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, selectedSize, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl flex flex-col gap-4 font-archivo">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/50 hover:text-black p-1 rounded-full"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product mini info */}
        <div className="flex gap-4 items-center border-b border-black/10 pb-4">
          <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#F5F5F5] flex-shrink-0">
            <img
              src={
                (typeof product.images?.[0] === 'string'
                  ? product.images[0]
                  : (product.images?.[0] as any)?.url) ||
                product.image ||
                '/placeholder.jpg'
              }
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">{product.badge}</span>
            <h4 className="text-sm font-semibold text-neutral-900 line-clamp-1">{product.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="px-3 py-1 rounded-full bg-[#0B2D7F] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#071F59] transition-colors shadow-xs"
              >
                Show Details
              </Link>
              <span className="text-[11px] text-neutral-500">• {product.moq || 'MOQ: 20 pcs'}</span>
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
            Select Size
          </span>
          <div className="grid grid-cols-3 gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  selectedSize === size
                    ? 'border-[#0B2D7F] bg-[#0B2D7F] text-white shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-[#0B2D7F]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to bag button */}
        <button
          onClick={handleAdd}
          className="mt-2 w-full py-3 bg-[#0B2D7F] hover:bg-[#071F59] text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-md shadow-[#0B2D7F]/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Add to Enquiry List</span>
        </button>
      </div>
    </div>
  );
}
