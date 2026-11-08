import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-4 font-archivo text-[#0B2D7F] text-center">
      <span className="text-xs uppercase tracking-widest text-[#F58220] font-bold">
        Error 404
      </span>
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mt-2">
        Page Not Found
      </h1>
      <p className="text-xs md:text-sm text-black/60 max-w-md mt-3 mb-8">
        The style or collection you are looking for may have moved or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-[#0B2D7F] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#071F59] transition-colors"
        >
          Return to Home
        </Link>
        <Link
          href="/collections/shop-all"
          className="px-8 py-3 rounded-full bg-white border border-black/15 text-[#0B2D7F] text-xs font-bold uppercase tracking-wider hover:border-black/30 transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    </div>
  );
}
