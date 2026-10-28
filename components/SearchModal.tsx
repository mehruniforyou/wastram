'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? NISHORAMA_PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.fabric.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularTags = [
    'White Pants',
    'Corset Kurti',
    'Mulmul Cover Up',
    'Skirt Set',
    'Modest Kurti',
    'Jacquard Set',
    'Under ₹999'
  ];

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black/60 backdrop-blur-sm">
      <div className="w-full bg-[#FAF8F5] shadow-xl p-4 md:p-8 flex flex-col gap-6 max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Search Input Row */}
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between gap-4 border-b-2 border-[#482922] pb-3">
          <div className="flex items-center gap-3 flex-1">
            <svg className="w-6 h-6 text-[#482922]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for Kurtis, Sets, Tops, Pants, Fabrics..."
              className="w-full bg-transparent text-lg md:text-xl font-archivo text-[#482922] placeholder:text-black/40 focus:outline-none"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 text-[#482922] transition-colors"
            aria-label="Close search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Popular Tags */}
        {!query.trim() && (
          <div className="max-w-4xl w-full mx-auto flex flex-col gap-3">
            <span className="text-xs font-archivo uppercase tracking-wider text-black/50 font-semibold">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-4 py-1.5 rounded-full bg-white border border-black/10 text-xs font-archivo text-[#482922] hover:bg-[#482922] hover:text-white transition-all shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query.trim() && (
          <div className="max-w-4xl w-full mx-auto">
            <div className="flex items-center justify-between mb-4 text-xs font-archivo text-black/60">
              <span>{filteredProducts.length} Results for "{query}"</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-black/50 font-archivo">
                <p className="text-sm">No styles found matching "{query}"</p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-3 text-xs underline font-semibold text-[#482922]"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.map(p => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="group flex flex-col bg-white rounded-lg overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">
                        {p.badge}
                      </span>
                    </div>
                    <div className="p-2.5 flex flex-col gap-1">
                      <h4 className="text-xs font-medium font-archivo text-black/80 line-clamp-1">
                        {p.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-archivo">
                        <span className="line-through text-black/40 text-[11px]">₹ {p.regularPrice.toLocaleString()}</span>
                        <span className="font-bold text-[#FF2F00]">₹ {p.salePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dismiss backdrop */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
