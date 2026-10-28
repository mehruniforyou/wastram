'use client';

import React, { useState } from 'react';
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
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#FF2F00]">{product.badge}</span>
            <h4 className="text-sm font-semibold text-[#482922] line-clamp-1">{product.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs line-through text-black/40">₹ {product.regularPrice.toLocaleString()}</span>
              <span className="text-sm font-bold text-[#FF2F00]">₹ {product.salePrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#482922] uppercase tracking-wider">
            Select Size
          </span>
          <div className="grid grid-cols-3 gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  selectedSize === size
                    ? 'border-[#482922] bg-[#482922] text-white shadow-sm'
                    : 'border-black/15 bg-[#FAF8F5] text-[#482922] hover:border-black/40'
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
          className="mt-2 w-full py-3 bg-[#482922] hover:bg-[#38201a] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>Add to Bag</span>
          <span>&bull;</span>
          <span>₹ {product.salePrice.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}
