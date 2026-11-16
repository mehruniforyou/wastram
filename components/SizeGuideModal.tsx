'use client';

import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface SizeRow {
  size: string;
  bustInch: string;
  bustCm: string;
  waistInch: string;
  waistCm: string;
  hipInch: string;
  hipCm: string;
}

const SIZE_CHART: SizeRow[] = [
  { size: 'XS', bustInch: '32', bustCm: '81', waistInch: '26', waistCm: '66', hipInch: '35', hipCm: '89' },
  { size: 'S', bustInch: '34', bustCm: '86', waistInch: '28', waistCm: '71', hipInch: '37', hipCm: '94' },
  { size: 'M', bustInch: '36', bustCm: '91', waistInch: '30', waistCm: '76', hipInch: '39', hipCm: '99' },
  { size: 'L', bustInch: '38', bustCm: '97', waistInch: '32', waistCm: '81', hipInch: '41', hipCm: '104' },
  { size: 'XL', bustInch: '40', bustCm: '102', waistInch: '34', waistCm: '86', hipInch: '43', hipCm: '109' },
  { size: '2XL', bustInch: '42', bustCm: '107', waistInch: '36', waistCm: '91', hipInch: '45', hipCm: '114' },
  { size: '3XL', bustInch: '44', bustCm: '112', waistInch: '38', waistCm: '97', hipInch: '47', hipCm: '119' },
  { size: '4XL', bustInch: '46', bustCm: '117', waistInch: '40', waistCm: '102', hipInch: '49', hipCm: '124' },
  { size: '5XL', bustInch: '48', bustCm: '122', waistInch: '42', waistCm: '107', hipInch: '51', hipCm: '130' },
  { size: '6XL', bustInch: '50', bustCm: '127', waistInch: '44', waistCm: '112', hipInch: '53', hipCm: '135' },
  { size: '7XL', bustInch: '52', bustCm: '132', waistInch: '46', waistCm: '117', hipInch: '55', hipCm: '140' },
  { size: '8XL', bustInch: '54', bustCm: '137', waistInch: '48', waistCm: '122', hipInch: '57', hipCm: '145' },
];

export default function SizeGuideModal() {
  const { isSizeGuideOpen, closeSizeGuide } = useCart();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeSizeGuide}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FCFBF7] dark:bg-[#12100E] rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden border border-ink-200/60 dark:border-white/10 font-sans">
        {/* Modal Header */}
        <div className="p-6 border-b border-ink-100 dark:border-white/10 flex items-start justify-between bg-white dark:bg-neutral-900">
          <div>
            <h2 className="font-serif text-2xl text-ink-950 dark:text-white font-normal">
              Size guide
            </h2>
            <p className="mt-1 text-xs text-ink-600 dark:text-neutral-400">
              Body measurements — not garment measurements. Graded true to size from XS to 8XL.
            </p>
          </div>

          <button
            type="button"
            onClick={closeSizeGuide}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-ink-700 dark:text-neutral-300 transition-colors"
            aria-label="Close size guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-700 dark:text-neutral-300 uppercase tracking-wider">
              Measurement Unit
            </span>
            <div className="flex rounded-full bg-neutral-200/60 dark:bg-neutral-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  unit === 'in'
                    ? 'bg-[#0B2D7F] text-white shadow-2xs'
                    : 'text-ink-600 dark:text-neutral-400'
                }`}
              >
                Inches (in)
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  unit === 'cm'
                    ? 'bg-[#0B2D7F] text-white shadow-2xs'
                    : 'text-ink-600 dark:text-neutral-400'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-ink-100 dark:border-white/10 bg-white dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F0] dark:bg-neutral-800 text-ink-900 dark:text-white uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Bust ({unit})</th>
                  <th className="p-3">Waist ({unit})</th>
                  <th className="p-3">Hip ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-white/5">
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-ink-950 dark:text-white">{row.size}</td>
                    <td className="p-3 text-ink-700 dark:text-neutral-300">
                      {unit === 'in' ? row.bustInch : row.bustCm}
                    </td>
                    <td className="p-3 text-ink-700 dark:text-neutral-300">
                      {unit === 'in' ? row.waistInch : row.waistCm}
                    </td>
                    <td className="p-3 text-ink-700 dark:text-neutral-300">
                      {unit === 'in' ? row.hipInch : row.hipCm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tailor Concierge Box */}
          <div className="p-4 rounded-2xl bg-[#f0fdf4] dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                Between sizes or need custom length?
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                Our master tailors in Jaipur customize bust ease, sleeve lengths, and kurtis to your exact brief at no extra charge.
              </p>
            </div>
            <a
              href="https://wa.me/918003088838?text=Hello%20Wastram%2C%20I%20need%20help%20choosing%20the%20right%20size%20for%20my%20measurements."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shrink-0 inline-flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle size={14} />
              <span>Tailor Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
