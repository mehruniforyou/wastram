'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Image as ImageIcon,
  Save,
  Upload,
  RefreshCw,
  FolderOpen,
  Check,
  X,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  Film,
  Compass,
  Factory,
  Globe,
  Copy,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import defaultHomeCovers from '@/data/home-covers.json';
import { HomeCoversStore } from '@/lib/homeCoversStore';
import { notifyAdmin } from './AdminToast';

interface CategoryImageMeta {
  url: string;
  filename: string;
}

export default function HomeCoversTab() {
  const [covers, setCovers] = useState<HomeCoversStore>(defaultHomeCovers as unknown as HomeCoversStore);
  const [initialCovers, setInitialCovers] = useState<HomeCoversStore>(defaultHomeCovers as unknown as HomeCoversStore);
  const [categoryImages, setCategoryImages] = useState<Record<string, CategoryImageMeta[]>>({});
  const [categoriesMeta, setCategoriesMeta] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Media Library Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<{
    section: 'hero' | 'categories' | 'chapters' | 'reels' | 'craftStats' | 'wholesaleBanner';
    key: string | number;
    field?: string;
    label: string;
  } | null>(null);
  const [pickerCategory, setPickerCategory] = useState<string>('western-dresses');
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerPage, setPickerPage] = useState(1);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const PICKER_PAGE_SIZE = 48;

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when picker modal is open
  useEffect(() => {
    if (!isPickerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPickerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPickerOpen]);

  // Hidden upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  // Fetch covers and available gallery images
  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/home-covers?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.covers) {
          setCovers(data.covers);
          setInitialCovers(data.covers);
        }
        if (data.categoryImages) {
          setCategoryImages(data.categoryImages);
        }
        if (data.categoriesMeta) {
          setCategoriesMeta(data.categoriesMeta);
        }
      }
    } catch (err: any) {
      notifyAdmin('error', 'Home Covers', 'Failed to load home covers: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(covers) !== JSON.stringify(initialCovers);
  }, [covers, initialCovers]);

  // Handle Save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/home-covers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(covers),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      const data = await res.json();
      if (data.covers) {
        setCovers(data.covers);
        setInitialCovers(data.covers);
      }

      // Broadcast live sync
      try {
        const ch = new BroadcastChannel('wastram_home_covers_sync');
        ch.postMessage({ covers });
        ch.close();
      } catch (_) {}

      notifyAdmin('success', 'Home Covers', 'Home page cover images saved & synchronized successfully!');
    } catch (err: any) {
      notifyAdmin('error', 'Home Covers', 'Error saving home covers: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Reset all home cover images to original system defaults? Any unsaved edits will be discarded.')) {
      setCovers(defaultHomeCovers as unknown as HomeCoversStore);
      notifyAdmin('info', 'Home Covers', 'Reset covers to defaults. Click "Save Changes" to apply.');
    }
  };

  // Update specific cover slot
  const updateSlotImage = (
    section: 'hero' | 'categories' | 'chapters' | 'reels' | 'craftStats' | 'wholesaleBanner',
    key: string | number,
    field: string = 'image',
    newUrl: string
  ) => {
    setCovers((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (section === 'hero') {
        if (next.hero[key as string]) {
          next.hero[key as string][field] = newUrl;
        }
      } else if (section === 'categories') {
        if (next.categories[key as string]) {
          next.categories[key as string][field] = newUrl;
        }
      } else if (section === 'chapters') {
        const idx = Number(key);
        if (next.chapters[idx]) {
          next.chapters[idx][field] = newUrl;
        }
      } else if (section === 'reels') {
        const idx = Number(key);
        if (next.reels[idx]) {
          next.reels[idx][field] = newUrl;
        }
      } else if (section === 'craftStats') {
        next.craftStats[field] = newUrl;
      } else if (section === 'wholesaleBanner') {
        next.wholesaleBanner[field] = newUrl;
      }
      return next;
    });
  };

  // Open Image Picker Modal
  const openPicker = (
    section: 'hero' | 'categories' | 'chapters' | 'reels' | 'craftStats' | 'wholesaleBanner',
    key: string | number,
    field: string,
    label: string,
    suggestedCategory?: string
  ) => {
    setTargetSlot({ section, key, field, label });
    if (suggestedCategory && categoryImages[suggestedCategory]) {
      setPickerCategory(suggestedCategory);
    }
    setPickerSearch('');
    setPickerPage(1);
    setIsPickerOpen(true);
  };

  // Confirm Selection from Picker
  const handleSelectFromPicker = (imageUrl: string) => {
    if (!targetSlot) return;
    updateSlotImage(targetSlot.section, targetSlot.key, targetSlot.field, imageUrl);
    setIsPickerOpen(false);
    setTargetSlot(null);
    notifyAdmin('success', 'Home Covers', `Applied selected photo to ${targetSlot.label}`);
  };

  // Trigger file upload for a slot
  const handleUploadClick = (slotId: string, section: any, key: any, field: string) => {
    setUploadingSlot(slotId);
    setTargetSlot({ section, key, field, label: slotId });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetSlot) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      notifyAdmin('info', 'Uploads', 'Uploading image to /uploads...');
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      if (data.url) {
        updateSlotImage(targetSlot.section, targetSlot.key, targetSlot.field, data.url);
        notifyAdmin('success', 'Uploads', 'Image uploaded and set successfully!');
      }
    } catch (err: any) {
      notifyAdmin('error', 'Uploads', 'Upload error: ' + err.message);
    } finally {
      setUploadingSlot(null);
      setTargetSlot(null);
    }
  };

  // Filter images for picker modal
  const filteredPickerImages = useMemo(() => {
    const list = categoryImages[pickerCategory] || [];
    if (!pickerSearch.trim()) return list;
    const q = pickerSearch.toLowerCase().trim();
    return list.filter((img) => img.filename.toLowerCase().includes(q) || img.url.toLowerCase().includes(q));
  }, [categoryImages, pickerCategory, pickerSearch]);

  const totalPickerPages = Math.max(1, Math.ceil(filteredPickerImages.length / PICKER_PAGE_SIZE));
  const pagedPickerImages = useMemo(() => {
    const start = (pickerPage - 1) * PICKER_PAGE_SIZE;
    return filteredPickerImages.slice(start, start + PICKER_PAGE_SIZE);
  }, [filteredPickerImages, pickerPage]);

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-neutral-500">
        <RefreshCw className="animate-spin mb-3 text-[#0B2D7F]" size={28} />
        <p className="text-sm font-medium">Loading home page cover images...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-16 font-sans">
      {/* Hidden File Input for Direct Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* ── Top Header & Global Actions Bar ── */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#0B2D7F]/10 text-[#0B2D7F] dark:bg-[#D4AF37]/15 dark:text-[#D4AF37]">
              <ImageIcon size={20} />
            </span>
            <h2 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-white">
              Home Page Cover Images Management
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Control every cover image, collage frame, category tile, chapter card, and showcase banner on the main storefront homepage in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasChanges && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-medium animate-pulse">
              <AlertCircle size={13} />
              <span>Unsaved Edits</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ${
              hasChanges
                ? 'bg-[#0B2D7F] hover:bg-[#071F59] text-white shadow-[#0B2D7F]/20'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isSaving ? 'Saving...' : 'Save All Home Covers'}</span>
          </button>
        </div>
      </div>

      {/* ── Section Quick Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-white/10 no-scrollbar">
        {[
          { id: 'all', label: 'All Sections (25)', icon: Layers },
          { id: 'hero', label: 'Hero Collage (3)', icon: Sparkles },
          { id: 'categories', label: 'Category Tiles (10)', icon: Compass },
          { id: 'chapters', label: 'The Chapters (6)', icon: Layers },
          { id: 'reels', label: 'In Motion Reels (4)', icon: Film },
          { id: 'craftStats', label: 'Craft Showcase (1)', icon: Factory },
          { id: 'wholesaleBanner', label: 'Wholesale Banner (1)', icon: Globe },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#0B2D7F] text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-[#0B2D7F]'
              }`}
            >
              <Icon size={14} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── SECTION 1: HERO COLLAGE COVERS ── */}
      {(activeSection === 'all' || activeSection === 'hero') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
            <div>
              <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#0B2D7F] dark:text-[#D4AF37]" />
                <span>Editorial Split Hero (3 Collage Frames)</span>
              </h3>
              <p className="text-xs text-neutral-500">
                The visual 3-card photography arrangement featured on top of the home page.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Section 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Primary Center Frame */}
            <CoverImageCard
              title={covers.hero.primary.label}
              subtitle="Center Anchor Model Frame (3:4 aspect ratio)"
              image={covers.hero.primary.image}
              onUrlChange={(val) => updateSlotImage('hero', 'primary', 'image', val)}
              onBrowseClick={() => openPicker('hero', 'primary', 'image', 'Hero Primary Anchor Frame', 'western-dresses')}
              onUploadClick={() => handleUploadClick('hero_primary', 'hero', 'primary', 'image')}
            />

            {/* 2. Secondary Bottom-Right Flank */}
            <CoverImageCard
              title={covers.hero.secondary.label}
              subtitle="Overlapping Lifestyle Frame (3:4 aspect ratio)"
              image={covers.hero.secondary.image}
              onUrlChange={(val) => updateSlotImage('hero', 'secondary', 'image', val)}
              onBrowseClick={() => openPicker('hero', 'secondary', 'image', 'Hero Secondary Flank', 'cord-sets')}
              onUploadClick={() => handleUploadClick('hero_secondary', 'hero', 'secondary', 'image')}
            />

            {/* 3. Tertiary Top-Left Background Flank */}
            <CoverImageCard
              title={covers.hero.tertiary.label}
              subtitle="Subtle Architectural Silhouette Frame (3:4 aspect ratio)"
              image={covers.hero.tertiary.image}
              onUrlChange={(val) => updateSlotImage('hero', 'tertiary', 'image', val)}
              onBrowseClick={() => openPicker('hero', 'tertiary', 'image', 'Hero Tertiary Background', 'traditional-gowns')}
              onUploadClick={() => handleUploadClick('hero_tertiary', 'hero', 'tertiary', 'image')}
            />
          </div>
        </div>
      )}

      {/* ── SECTION 2: CATEGORY COVERS (ALL 10 COLLECTIONS) ── */}
      {(activeSection === 'all' || activeSection === 'categories') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
            <div>
              <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Compass size={18} className="text-[#0B2D7F] dark:text-[#D4AF37]" />
                <span>Curated Category Mosaic &amp; Collection Covers (All 10 Collections)</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Updating these alters the homepage category mosaic tiles as well as the master category covers.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Section 2</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {Object.entries(covers.categories).map(([catKey, catObj]) => (
              <CoverImageCard
                key={catKey}
                title={catObj.name}
                subtitle={`Slug: /collections/${catObj.slug}`}
                image={catObj.image}
                onUrlChange={(val) => updateSlotImage('categories', catKey, 'image', val)}
                onBrowseClick={() => openPicker('categories', catKey, 'image', `${catObj.name} Cover`, catKey)}
                onUploadClick={() => handleUploadClick(`cat_${catKey}`, 'categories', catKey, 'image')}
                aspect="aspect-[3/4]"
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 3: THE CHAPTERS (6 CRAFT NARRATIVES) ── */}
      {(activeSection === 'all' || activeSection === 'chapters') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
            <div>
              <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Layers size={18} className="text-[#0B2D7F] dark:text-[#D4AF37]" />
                <span>The Chapters &amp; Craft Narratives (6 Arch Doorway Cards)</span>
              </h3>
              <p className="text-xs text-neutral-500">
                The six storytelling chapter cards on the homepage displaying artisanal Jaipur techniques.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Section 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {covers.chapters.map((chap, idx) => (
              <CoverImageCard
                key={chap.id}
                title={`${chap.number} — ${chap.title}`}
                subtitle={`Target: /collections/${chap.slug}`}
                image={chap.image}
                onUrlChange={(val) => updateSlotImage('chapters', idx, 'image', val)}
                onBrowseClick={() => openPicker('chapters', idx, 'image', `${chap.number} ${chap.title}`, chap.slug)}
                onUploadClick={() => handleUploadClick(`chapter_${chap.id}`, 'chapters', idx, 'image')}
                aspect="aspect-[3/4]"
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 4: REAL SILHOUETTES & REELS (4 VIDEO POSTERS) ── */}
      {(activeSection === 'all' || activeSection === 'reels') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
            <div>
              <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Film size={18} className="text-[#0B2D7F] dark:text-[#D4AF37]" />
                <span>Fabric in Motion &amp; Vertical Reels (4 Video Covers)</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Vertical 9:16 silhouette covers showing drape, movement, and natural atelier fall.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Section 8</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {covers.reels.map((reel, idx) => (
              <CoverImageCard
                key={reel.id}
                title={reel.title}
                subtitle={`${reel.category} (9:16 Aspect)`}
                image={reel.thumbnail}
                onUrlChange={(val) => updateSlotImage('reels', idx, 'thumbnail', val)}
                onBrowseClick={() => openPicker('reels', idx, 'thumbnail', `Reel: ${reel.title}`, reel.slug)}
                onUploadClick={() => handleUploadClick(`reel_${reel.id}`, 'reels', idx, 'thumbnail')}
                aspect="aspect-[9/16]"
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 5 & 6: CRAFT SHOWCASE & WHOLESALE BANNER ── */}
      {(activeSection === 'all' || activeSection === 'craftStats' || activeSection === 'wholesaleBanner') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
            <div>
              <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Factory size={18} className="text-[#0B2D7F] dark:text-[#D4AF37]" />
                <span>Feature Showcase &amp; Wholesale Authority Banners</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Editorial photography featured inside the factory story and the worldwide wholesale banner.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Sections 9 &amp; 10</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Craft & Factory Showcase */}
            <CoverImageCard
              title={covers.craftStats.label}
              subtitle="The Craft of Sanganer Feature (4:3 aspect ratio)"
              image={covers.craftStats.image}
              onUrlChange={(val) => updateSlotImage('craftStats', 'craftStats', 'image', val)}
              onBrowseClick={() => openPicker('craftStats', 'craftStats', 'image', 'Craft Showcase Image', 'traditional-gowns')}
              onUploadClick={() => handleUploadClick('craft_stats_hero', 'craftStats', 'craftStats', 'image')}
              aspect="aspect-[4/3]"
            />

            {/* Wholesale Trade Authority Banner */}
            <CoverImageCard
              title={covers.wholesaleBanner.label}
              subtitle="Direct Sourcing for Boutiques Editorial Frame (4:5 aspect ratio)"
              image={covers.wholesaleBanner.image}
              onUrlChange={(val) => updateSlotImage('wholesaleBanner', 'wholesaleBanner', 'image', val)}
              onBrowseClick={() => openPicker('wholesaleBanner', 'wholesaleBanner', 'image', 'Wholesale Banner Model Frame', 'traditional-gowns')}
              onUploadClick={() => handleUploadClick('wholesale_banner_model', 'wholesaleBanner', 'wholesaleBanner', 'image')}
              aspect="aspect-[4/5]"
            />
          </div>
        </div>
      )}

      {/* ── MEDIA LIBRARY IMAGE PICKER MODAL (PORTAL TO ROOT BODY) ── */}
      {isPickerOpen && isClientMounted && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPickerOpen(false);
          }}
        >
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/15 rounded-3xl w-full max-w-5xl h-[88vh] max-h-[820px] flex flex-col shadow-2xl overflow-hidden min-h-0">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-white dark:bg-neutral-900">
              <div className="min-w-0 pr-4">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 truncate">
                  <FolderOpen size={18} className="text-[#0B2D7F] dark:text-[#D4AF37] shrink-0" />
                  <span className="truncate">Select Cover: {targetSlot?.label}</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  Pick any authentic photoshoot image from your catalog categories or uploads.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                title="Close (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Controls: Category Tabs & Search Bar */}
            <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
              {/* Category selector pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:max-w-2xl pb-1 no-scrollbar min-w-0">
                {categoriesMeta.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setPickerCategory(cat.id);
                      setPickerPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                      pickerCategory === cat.id
                        ? 'bg-[#0B2D7F] text-white font-semibold shadow-xs'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-[#0B2D7F]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                {categoryImages['uploads'] && categoryImages['uploads'].length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPickerCategory('uploads');
                      setPickerPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                      pickerCategory === 'uploads'
                        ? 'bg-[#0B2D7F] text-white font-semibold shadow-xs'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-[#0B2D7F]'
                    }`}
                  >
                    Custom Uploads
                  </button>
                )}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-60 shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter by filename..."
                  value={pickerSearch}
                  onChange={(e) => {
                    setPickerSearch(e.target.value);
                    setPickerPage(1);
                  }}
                  className="w-full text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-full pl-8 pr-4 py-1.5 text-neutral-900 dark:text-white focus:outline-none focus:border-[#0B2D7F]"
                />
              </div>
            </div>

            {/* Modal Image Grid with Bound Scroll Container */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 bg-neutral-100/50 dark:bg-neutral-950/40">
              {filteredPickerImages.length === 0 ? (
                <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center text-neutral-400 text-xs">
                  <FolderOpen size={32} className="mb-2 opacity-40 text-neutral-400" />
                  <p className="font-medium text-neutral-600 dark:text-neutral-300">No images match your filter</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Try clearing the search or picking another category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {pagedPickerImages.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => handleSelectFromPicker(img.url)}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-neutral-200/80 dark:border-white/10 hover:border-[#0B2D7F] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0B2D7F] transition-all bg-white dark:bg-neutral-800 cursor-pointer text-left"
                    >
                      <img
                        src={img.url}
                        alt={img.filename}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <span className="self-end px-2 py-0.5 rounded-full bg-[#0B2D7F] text-white text-[10px] font-semibold">
                          Apply
                        </span>
                        <span className="text-[10px] text-white truncate w-full font-mono bg-black/60 px-1 py-0.5 rounded">
                          {img.filename}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer with Pagination Controls */}
            <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400 shrink-0">
              <span className="text-[11px] sm:text-xs font-medium">
                Showing {filteredPickerImages.length > 0 ? (pickerPage - 1) * PICKER_PAGE_SIZE + 1 : 0}–
                {Math.min(pickerPage * PICKER_PAGE_SIZE, filteredPickerImages.length)} of {filteredPickerImages.length} images
              </span>

              {/* Pagination Next/Prev */}
              {totalPickerPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={pickerPage <= 1}
                    onClick={() => setPickerPage((prev) => Math.max(1, prev - 1))}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Page {pickerPage} of {totalPickerPages}
                  </span>
                  <button
                    type="button"
                    disabled={pickerPage >= totalPickerPages}
                    onClick={() => setPickerPage((prev) => Math.min(totalPickerPages, prev + 1))}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium transition-colors cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ── Visual Card Component for Single Cover Slot ──

interface CoverImageCardProps {
  title: string;
  subtitle: string;
  image: string;
  aspect?: string;
  onUrlChange: (newUrl: string) => void;
  onBrowseClick: () => void;
  onUploadClick: () => void;
}

function CoverImageCard({
  title,
  subtitle,
  image,
  aspect = 'aspect-[3/4]',
  onUrlChange,
  onBrowseClick,
  onUploadClick,
}: CoverImageCardProps) {
  const [inputValue, setInputValue] = useState(image);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setInputValue(image);
  }, [image]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onUrlChange(e.target.value);
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(inputValue);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      notifyAdmin('info', 'Clipboard', 'Copied image URL to clipboard');
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl p-4 shadow-xs hover:border-[#0B2D7F]/40 transition-all flex flex-col justify-between min-w-0">
      {/* Title & Description */}
      <div className="mb-3">
        <h4 className="font-serif text-sm font-semibold text-neutral-900 dark:text-white truncate">
          {title}
        </h4>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
          {subtitle}
        </p>
      </div>

      {/* Visual Live Preview Frame */}
      <div className={`relative ${aspect} w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 group mb-3 shadow-inner`}>
        <img
          src={inputValue}
          alt={title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/brand/wastram-artisan-crest.png';
          }}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-104"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-2xs">
          <button
            type="button"
            onClick={onBrowseClick}
            className="px-3 py-1.5 rounded-full bg-white/95 text-neutral-900 text-xs font-medium shadow-md hover:bg-[#0B2D7F] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
          >
            <FolderOpen size={12} />
            <span>Browse</span>
          </button>
          <button
            type="button"
            onClick={onUploadClick}
            className="px-3 py-1.5 rounded-full bg-white/95 text-neutral-900 text-xs font-medium shadow-md hover:bg-[#0B2D7F] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
          >
            <Upload size={12} />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Input & Action Strip */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="/category/filename.jpg"
            className="w-full text-xs font-mono bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#0B2D7F]"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onBrowseClick}
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-[#0B2D7F]/10 hover:text-[#0B2D7F] text-neutral-700 dark:text-neutral-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            <FolderOpen size={13} className="shrink-0" />
            <span className="truncate">Choose from Catalog</span>
          </button>

          <button
            type="button"
            onClick={onUploadClick}
            title="Upload from computer"
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <Upload size={13} />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy path"
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            {copySuccess ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
