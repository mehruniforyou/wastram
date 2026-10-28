'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function BodyMeasurementModal() {
  const { isSizeGuideOpen, closeSizeGuide } = useCart();
  const [unit, setUnit] = useState<'inch' | 'cm'>('inch');

  if (!isSizeGuideOpen) return null;

  const measurementsInch = [
    { size: 'XXS', bust: '30-32', waist: '24-26', hip: '32-34' },
    { size: 'XS', bust: '32-34', waist: '26-28', hip: '34-36' },
    { size: 'S', bust: '34-36', waist: '28-30', hip: '36-38' },
    { size: 'M', bust: '36-38', waist: '30-32', hip: '38-40' },
    { size: 'L', bust: '38-40', waist: '32-34', hip: '40-42' },
    { size: 'XL', bust: '40-42', waist: '34-36', hip: '42-44' },
    { size: 'XXL', bust: '42-44', waist: '36-38', hip: '44-46' },
  ];

  const measurementsCm = [
    { size: 'XXS', bust: '76-81', waist: '61-66', hip: '81-86' },
    { size: 'XS', bust: '81-86', waist: '66-71', hip: '86-91' },
    { size: 'S', bust: '86-91', waist: '71-76', hip: '91-97' },
    { size: 'M', bust: '91-97', waist: '76-81', hip: '97-102' },
    { size: 'L', bust: '97-102', waist: '81-86', hip: '102-107' },
    { size: 'XL', bust: '102-107', waist: '86-91', hip: '107-112' },
    { size: 'XXL', bust: '107-112', waist: '91-97', hip: '112-117' },
  ];

  const data = unit === 'inch' ? measurementsInch : measurementsCm;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#482922]/70 backdrop-blur-sm transition-opacity"
        onClick={closeSizeGuide}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/10 z-10 font-archivo animate-toast">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 bg-white">
          <h3 className="text-sm md:text-base font-bold text-[#482922] uppercase tracking-wide">
            Body Measurement
          </h3>

          <div className="flex items-center gap-3">
            {/* Unit Toggle Pill */}
            <div className="flex items-center bg-[#F1EFEF] p-1 rounded-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUnit('inch')}
                className={`px-3 py-1 rounded-full transition-all ${
                  unit === 'inch'
                    ? 'bg-[#482922] text-[#F6C582] shadow-sm'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-full transition-all ${
                  unit === 'cm'
                    ? 'bg-[#482922] text-[#F6C582] shadow-sm'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                CM
              </button>
            </div>

            {/* Close X button */}
            <button
              onClick={closeSizeGuide}
              className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#482922] text-sm font-bold transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#F1EFEF] text-[11px] md:text-xs text-[#482922] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Bust ({unit})</th>
                <th className="py-2.5 px-3">Waist ({unit})</th>
                <th className="py-2.5 px-3">Hip ({unit})</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#121212]">
              {data.map((row, idx) => (
                <tr
                  key={row.size}
                  className={`border-b border-black/5 transition-colors hover:bg-[#FAF8F5] ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]/60'
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-[#482922]">{row.size}</td>
                  <td className="py-2.5 px-3">{row.bust}</td>
                  <td className="py-2.5 px-3">{row.waist}</td>
                  <td className="py-2.5 px-3">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Notes & Fit Tags */}
        <div className="bg-[#482922] text-white p-4 flex flex-col gap-2.5">
          <div className="flex gap-2">
            <span className="bg-[#6B4036] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">
              Regular Fit
            </span>
            <span className="bg-[#6B4036] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">
              True to Size
            </span>
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed font-light">
            Measurements above indicate recommended body dimensions in {unit === 'inch' ? 'inches' : 'centimetres'}. For comfortable and modest drape, choose your exact fit.
          </p>
        </div>
      </div>
    </div>
  );
}
