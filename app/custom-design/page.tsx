'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scissors, 
  Sparkles, 
  MessageCircle, 
  Check, 
  ArrowRight, 
  Ruler, 
  Layers, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Heart,
  Palette
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import ScrollReveal from '@/components/ScrollReveal';

const SILHOUETTE_OPTIONS = [
  {
    id: 'coord-set',
    title: 'Co-ord Set',
    subtitle: '2-Piece / 3-Piece Tailored Suits',
    image: '/cord-sets/12550.jpg.jpeg',
    desc: 'Structured notched lapel or Mandarin collar tunic paired with tapered, elasticated pocket trousers.',
  },
  {
    id: 'anarkali-gown',
    title: 'Festive Anarkali & Gown',
    subtitle: 'Flared Kalidar Silhouette',
    image: '/traditional-gowns/16668.jpg.jpeg',
    desc: 'Generous 4 to 6-meter sweep with custom neckline depth, potli buttons, and gota patti borders.',
  },
  {
    id: 'western-dress',
    title: 'Western Tiered Dress',
    subtitle: 'Midi & Maxi Lengths',
    image: '/western-dresses/10045.jpg.jpeg',
    desc: 'Breathable tiered gathers, flutter or lantern sleeves, cinched smocked waist, and dual side pockets.',
  },
  {
    id: 'kaftan-loungewear',
    title: 'Resort Kaftan & Tunic',
    subtitle: 'Free-Flowing Ease',
    image: '/short-long-kaftan/023fdea0b48306bda8bc878660bf429f.jpg.jpeg',
    desc: 'Breezy kimono sleeves, bohemian tassel drawstrings, and side slits designed for effortless movement.',
  },
  {
    id: 'umbrella-dress',
    title: 'Flared Umbrella Dress',
    subtitle: 'Full 360° Circular Sweep',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    desc: 'Seamless circular umbrella flare crafted in lightweight mulmul for dance and golden hour celebrations.',
  },
  {
    id: 'kurta-trousseau',
    title: 'Occasion Kurta Suit',
    subtitle: 'Straight & A-Line Cut',
    image: '/ethnic-wear-sets/FB_IMG_1754660373365.jpg.jpeg',
    desc: 'Classic royal kurta paired with straight pants or flared palazzo and matching handblock dupatta.',
  },
];

const FABRIC_OPTIONS = [
  {
    id: 'cambric-cotton',
    name: '60-60 Cambric Cotton',
    badge: 'Signature',
    desc: 'High-density pure cotton yarn with crisp, razor-sharp block registration and daily wash durability.',
  },
  {
    id: 'pure-mulmul',
    name: 'Pure Mulmul Cotton',
    badge: 'Super Breathable',
    desc: 'Featherlight cloud-soft muslin woven for tropical humidity, softening luxuriously with each wash.',
  },
  {
    id: 'modal-silk',
    name: 'Royal Modal Silk',
    badge: 'Glossy Luster',
    desc: 'Satin-finish fluid drape derived from natural beechwood pulp, blending silken sheen with natural breathability.',
  },
  {
    id: 'chanderi-silk',
    name: 'Chanderi Zari Silk',
    badge: 'Festive Sheen',
    desc: 'Traditional transparent sheer weave interwoven with metallic gold threads for royal evening events.',
  },
  {
    id: 'cotton-linen',
    name: 'Structured Cotton Linen',
    badge: 'Architectural',
    desc: 'Crisp tactile weave with organic slub texture, ideal for tailored trousers and modern resort co-ords.',
  },
];

const CRAFT_ACCENTS = [
  {
    id: 'sanganer-floral',
    name: 'Sanganer Floral Jaal',
    technique: 'Teak Block Print',
    desc: 'Curvilinear rose, marigold, and lotus vines hand-stamped with pinpoint dual-block registration.',
  },
  {
    id: 'bagru-dabu',
    name: 'Bagru Mud-Resist Dabu',
    technique: 'Clay & Indigo Vat',
    desc: 'Black mud resist paste immersed in 12-foot underground indigo vats for rich, earthy depth.',
  },
  {
    id: 'gota-patti',
    name: 'Jaipur Gota Patti & Zari',
    technique: 'Royal Needlework',
    desc: 'Hand-sewn gold and copper ribbon borders along hemlines, cuffs, and dupattas.',
  },
  {
    id: 'dip-dye',
    name: 'Artisan Dip-Dye & Ombré',
    technique: 'Hand Vat Gradient',
    desc: 'Subtle two-tone sunrise and twilight color gradients created through gradual vat immersion.',
  },
];

const CUSTOM_ADDONS = [
  'Concealed Feeding Zippers (Both Sides)',
  'Deep Functional Inseam Pockets',
  'Modest High Neckline / Closed Back',
  'Lined Bodice (Pure Cotton Malmal Lining)',
  'Custom Elasticated / Drawstring Waist',
  'Extra Hem Allowance for Height (>5\'8")',
];

export default function CustomDesignPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSilhouette, setSelectedSilhouette] = useState(SILHOUETTE_OPTIONS[0]);
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[0]);
  const [selectedCraft, setSelectedCraft] = useState(CRAFT_ACCENTS[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['Deep Functional Inseam Pockets']);
  
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
    length: '',
    shoulder: '',
    sleeve: 'Standard 3/4th',
  });

  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    city: '',
    notes: '',
  });

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const briefText = `Hello Wastram Jaipur Atelier, I would like to commission a Bespoke Custom Garment:

• Silhouette: ${selectedSilhouette.title} (${selectedSilhouette.subtitle})
• Fabric: ${selectedFabric.name}
• Craft/Accent: ${selectedCraft.name} (${selectedCraft.technique})
• Special Add-ons: ${selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None'}

• Client Specifications:
  - Name: ${clientInfo.name || 'Patron'}
  - Contact: ${clientInfo.phone || 'N/A'}
  - City / Country: ${clientInfo.city || 'N/A'}
• Measurements (Inches):
  - Bust: ${measurements.bust || 'Standard'}
  - Waist: ${measurements.waist || 'Standard'}
  - Hips: ${measurements.hips || 'Standard'}
  - Desired Length: ${measurements.length || 'Standard'}
  - Shoulder: ${measurements.shoulder || 'Standard'}
  - Sleeve Length: ${measurements.sleeve}
• Custom Tailoring Notes: ${clientInfo.notes || 'None'}

Please review this brief, confirm fabric availability, and share tailoring turnaround and quotation.`;

    window.open(`https://wa.me/918003088838?text=${encodeURIComponent(briefText)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#12100E] text-foreground font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-32 pb-24">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <section className="container-x mb-16 md:mb-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="section-pill mb-4 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>Jaipur Bespoke Atelier · Made to Measure</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0B2D7F] dark:text-white font-normal leading-[1.14] tracking-tight">
                Tailored for Your Form,{' '}
                <span className="text-[#D4AF37] italic font-normal block sm:inline">Crafted in Sanganer.</span>
              </h1>

              <p className="mt-4 text-xs sm:text-base text-neutral-600 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
                Whether you need true anatomical curve grading from S to XXL, concealed nursing zippers, deep functional pockets, or custom sleeve drops — our master craftspeople cut every garment one at a time.
              </p>

              {/* Atelier Guarantees Strip */}
              <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                  <Ruler size={18} className="text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-xs font-semibold block text-neutral-900 dark:text-white">Custom Grading</span>
                    <span className="text-[10px] text-neutral-500 block">S to XXL Precision</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                  <Scissors size={18} className="text-[#0B2D7F] dark:text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-xs font-semibold block text-neutral-900 dark:text-white">Single-Piece Cut</span>
                    <span className="text-[10px] text-neutral-500 block">No Assembly Line</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                  <Clock size={18} className="text-[#0B2D7F] dark:text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-xs font-semibold block text-neutral-900 dark:text-white">7–10 Days Lead</span>
                    <span className="text-[10px] text-neutral-500 block">Fast Atelier Dispatch</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                  <ShieldCheck size={18} className="text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-xs font-semibold block text-neutral-900 dark:text-white">Video Proof</span>
                    <span className="text-[10px] text-neutral-500 block">Approval Before Ship</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE BESPOKE CUSTOMIZER                                            */}
        {/* ========================================================================= */}
        <section className="container-x">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Customization Steps */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Step 1: Silhouette */}
              <ScrollReveal>
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#0B2D7F] text-white dark:bg-[#D4AF37] dark:text-neutral-950 text-xs font-bold flex items-center justify-center">1</span>
                    <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white font-normal">
                      Select Silhouette
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mb-6 font-sans">
                    Choose the foundational drape you would like custom-crafted to your measurements.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {SILHOUETTE_OPTIONS.map((sil) => {
                      const isSelected = selectedSilhouette.id === sil.id;
                      return (
                        <div
                          key={sil.id}
                          onClick={() => setSelectedSilhouette(sil)}
                          className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#0B2D7F] dark:border-[#D4AF37] ring-2 ring-[#0B2D7F]/20 dark:ring-[#D4AF37]/20 shadow-md'
                              : 'border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30'
                          }`}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                            <img
                              src={sil.image}
                              alt={sil.title}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 bg-[#0B2D7F] dark:bg-[#D4AF37] text-white dark:text-neutral-950 p-1 rounded-full shadow-md">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <div className="p-3.5 bg-white dark:bg-neutral-900 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-serif text-sm font-semibold text-neutral-900 dark:text-white">
                                {sil.title}
                              </h3>
                              <span className="text-[10px] text-[#0B2D7F] dark:text-[#D4AF37] font-medium block mb-1.5">
                                {sil.subtitle}
                              </span>
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                {sil.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 2: Fabric Swatches */}
              <ScrollReveal>
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#0B2D7F] text-white dark:bg-[#D4AF37] dark:text-neutral-950 text-xs font-bold flex items-center justify-center">2</span>
                    <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white font-normal">
                      Select Loom Textile
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mb-6 font-sans">
                    Hand-picked natural fibers sourced directly from cooperative weaving clusters across Rajasthan and Madhya Pradesh.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {FABRIC_OPTIONS.map((fab) => {
                      const isSelected = selectedFabric.id === fab.id;
                      return (
                        <div
                          key={fab.id}
                          onClick={() => setSelectedFabric(fab)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#0B2D7F] dark:border-[#D4AF37] bg-neutral-50/80 dark:bg-white/5 ring-1 ring-[#0B2D7F]/20 shadow-xs'
                              : 'border-neutral-200 dark:border-white/10 hover:border-neutral-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-serif text-sm font-semibold text-neutral-900 dark:text-white">
                              {fab.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#0B2D7F]/10 text-[#0B2D7F] dark:bg-[#D4AF37]/15 dark:text-[#D4AF37]">
                              {fab.badge}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            {fab.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 3: Craft & Embellishment */}
              <ScrollReveal>
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#0B2D7F] text-white dark:bg-[#D4AF37] dark:text-neutral-950 text-xs font-bold flex items-center justify-center">3</span>
                    <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white font-normal">
                      Select Craft &amp; Accent
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mb-6 font-sans">
                    Artisanal motifs applied by Jaipur master printers using seasoned carved wooden blocks and natural vegetable vats.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {CRAFT_ACCENTS.map((craft) => {
                      const isSelected = selectedCraft.id === craft.id;
                      return (
                        <div
                          key={craft.id}
                          onClick={() => setSelectedCraft(craft)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#0B2D7F] dark:border-[#D4AF37] bg-neutral-50/80 dark:bg-white/5 ring-1 ring-[#0B2D7F]/20 shadow-xs'
                              : 'border-neutral-200 dark:border-white/10 hover:border-neutral-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif text-sm font-semibold text-neutral-900 dark:text-white">
                              {craft.name}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-sans">
                              {craft.technique}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            {craft.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 4: Special Functional Add-ons */}
              <ScrollReveal>
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#0B2D7F] text-white dark:bg-[#D4AF37] dark:text-neutral-950 text-xs font-bold flex items-center justify-center">4</span>
                    <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white font-normal">
                      Functional Details &amp; Custom Add-ons
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mb-6 font-sans">
                    Check all structural additions you want incorporated into your garment at no extra charge.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CUSTOM_ADDONS.map((addon) => {
                      const isChecked = selectedAddons.includes(addon);
                      return (
                        <label
                          key={addon}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                            isChecked
                              ? 'border-[#0B2D7F] dark:border-[#D4AF37] bg-neutral-50/80 dark:bg-white/5 text-neutral-900 dark:text-white font-semibold'
                              : 'border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-400 hover:border-neutral-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(addon)}
                            className="accent-[#0B2D7F] dark:accent-[#D4AF37] w-4 h-4 rounded"
                          />
                          <span>{addon}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 5: Body Measurements & Client Info */}
              <ScrollReveal>
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#0B2D7F] text-white dark:bg-[#D4AF37] dark:text-neutral-950 text-xs font-bold flex items-center justify-center">5</span>
                    <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white font-normal">
                      Body Measurements &amp; Notes
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mb-6 font-sans">
                    Enter your measurements in inches. If you prefer a standard size (S, M, L, XL, XXL), simply state that in the notes.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Bust (in)</span>
                      <input
                        type="text"
                        placeholder="e.g. 38"
                        value={measurements.bust}
                        onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Waist (in)</span>
                      <input
                        type="text"
                        placeholder="e.g. 32"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Hips (in)</span>
                      <input
                        type="text"
                        placeholder="e.g. 42"
                        value={measurements.hips}
                        onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Desired Length (in)</span>
                      <input
                        type="text"
                        placeholder="e.g. 48"
                        value={measurements.length}
                        onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Shoulder (in)</span>
                      <input
                        type="text"
                        placeholder="e.g. 15"
                        value={measurements.shoulder}
                        onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Sleeve Preference</span>
                      <select
                        value={measurements.sleeve}
                        onChange={(e) => setMeasurements({ ...measurements, sleeve: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      >
                        <option value="Sleeveless">Sleeveless</option>
                        <option value="Short Cap">Short Cap</option>
                        <option value="Elbow Length">Elbow Length</option>
                        <option value="Standard 3/4th">Standard 3/4th</option>
                        <option value="Full Wrist">Full Wrist</option>
                        <option value="Gathered Bell">Gathered Bell</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Your Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Mehra"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">WhatsApp Number *</span>
                      <input
                        type="text"
                        required
                        placeholder="+91 98765 43210"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">City / Country</span>
                      <input
                        type="text"
                        placeholder="e.g. London, UK / Mumbai"
                        value={clientInfo.city}
                        onChange={(e) => setClientInfo({ ...clientInfo, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Specific Notes &amp; Target Event Date
                    </span>
                    <textarea
                      rows={3}
                      placeholder="Share any special instructions, date of event, neckline depth preference, or whether you want matching baby/daughter outfits..."
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* RIGHT COLUMN: Live Order Brief Card */}
            <div className="lg:col-span-4 sticky top-28">
              <ScrollReveal>
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-white/10 shadow-xl">
                  <div className="section-pill mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                    <span>Live Commission Brief</span>
                  </div>

                  <h3 className="font-serif text-xl font-normal text-neutral-900 dark:text-white mb-4">
                    Your Bespoke Piece
                  </h3>

                  {/* Summary Details */}
                  <div className="space-y-3.5 text-xs border-b border-neutral-200/80 dark:border-white/10 pb-5 mb-5">
                    <div className="flex justify-between items-start">
                      <span className="text-neutral-500">Silhouette</span>
                      <span className="font-semibold text-right text-neutral-900 dark:text-white">
                        {selectedSilhouette.title}
                      </span>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-neutral-500">Textile</span>
                      <span className="font-semibold text-right text-[#0B2D7F] dark:text-[#D4AF37]">
                        {selectedFabric.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-neutral-500">Craft / Print</span>
                      <span className="font-semibold text-right text-neutral-900 dark:text-white">
                        {selectedCraft.name}
                      </span>
                    </div>

                    {selectedAddons.length > 0 && (
                      <div className="flex justify-between items-start">
                        <span className="text-neutral-500">Add-ons</span>
                        <span className="font-medium text-right text-neutral-800 dark:text-neutral-200 max-w-[180px] leading-tight">
                          {selectedAddons.length} selected
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-start">
                      <span className="text-neutral-500">Turnaround</span>
                      <span className="font-semibold text-right text-[#25D366]">
                        7–10 Days Handcraft
                      </span>
                    </div>
                  </div>

                  {/* Assurance Points */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                      <CheckCircle2 size={13} className="text-[#D4AF37] shrink-0" />
                      <span>Dedicated Master Cutter assigned</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                      <CheckCircle2 size={13} className="text-[#D4AF37] shrink-0" />
                      <span>Fabric video inspection before cutting</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                      <CheckCircle2 size={13} className="text-[#D4AF37] shrink-0" />
                      <span>Worldwide door-to-door express air delivery</span>
                    </div>
                  </div>

                  {/* Clean 1-Word CTA */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white dark:bg-[#D4AF37] dark:text-neutral-950 dark:hover:bg-[#C5A059] font-semibold text-sm transition-all shadow-md shadow-[#0B2D7F]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <MessageCircle size={16} />
                    <span>Submit</span>
                  </button>

                  <p className="mt-3 text-[10px] text-center text-neutral-400 leading-normal">
                    Tapping Submit opens your pre-filled custom brief on WhatsApp directly with our Sanganer atelier desk.
                  </p>
                </div>
              </ScrollReveal>
            </div>

          </form>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <SizeGuideModal />
      <FloatingWhatsApp />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
