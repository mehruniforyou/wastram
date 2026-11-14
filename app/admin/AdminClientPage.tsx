'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Layers, Package, Plus, Search, Edit3, Trash2, Eye, EyeOff, Check, X,
  Upload, RefreshCw, Database, Sparkles, Filter, ChevronRight, AlertCircle,
  ExternalLink, ArrowLeft, LogOut, ShieldCheck, Tag, Info, Image as ImageIcon
} from 'lucide-react';
import { optimizeImageFile } from '@/lib/imageOptimizer';

interface ColorVariant {
  id: string;
  name: string;
  colorCode: string;
  images: string[];
}

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  tab: string;
  badge: string;
  regularPrice: number;
  salePrice: number;
  images: string[];
  colorVariants?: ColorVariant[];
  sizes: string[];
  fabric: string;
  description: string;
  details: string[];
  moq?: string;
  sku?: string;
  is_hidden?: boolean;
  is_featured?: boolean;
}

const CATEGORIES = [
  { id: 'western-dresses', name: 'Western Dresses' },
  { id: 'traditional-gowns', name: 'Traditional Gowns' },
  { id: 'cord-sets', name: 'Co-ord Sets' },
  { id: 'tops-shirts', name: 'Tops & Shirts' },
  { id: 'ethnic-wear-sets', name: 'Ethnic Wear Sets' },
  { id: 'short-long-kaftan', name: 'Kaftans' },
  { id: 'umbrella-dresses', name: 'Umbrella Dresses' },
  { id: 't-shirts', name: 'T-Shirts' },
  { id: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts' },
  { id: 'denim-collection', name: 'Denim Collection' }
];

export default function AdminClientPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'database'>('products');

  // Edit / Add Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(Boolean(data.isAuthenticated));
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid passcode');
      }
    } catch {
      setAuthError('Connection error during authentication.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'live' && !p.is_hidden) ||
        (selectedStatus === 'hidden' && p.is_hidden);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Toggle Hide / Publish
  const toggleHideProduct = async (p: Product) => {
    const updatedHidden = !p.is_hidden;
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, is_hidden: updatedHidden }),
      });
      if (res.ok) {
        setProducts(prev =>
          prev.map(item => (item.id === p.id ? { ...item, is_hidden: updatedHidden } : item))
        );
        showToast(`Product ${p.sku || p.id} ${updatedHidden ? 'hidden' : 'published to live site'}.`);
      }
    } catch {
      showToast('Error updating product status.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the catalogue?`)) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast(`Product ${id} permanently removed.`);
      }
    } catch {
      showToast('Error deleting product.');
    }
  };

  // Open Edit Modal
  const openEditModal = (p: Product) => {
    setModalMode('edit');
    setEditingProduct({ ...p, colorVariants: p.colorVariants ? JSON.parse(JSON.stringify(p.colorVariants)) : [] });
    setIsModalOpen(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    setModalMode('add');
    const newId = `custom-${Date.now().toString().slice(-6)}`;
    setEditingProduct({
      id: newId,
      title: '',
      category: 'western-dresses',
      tab: 'western-dresses',
      badge: 'Signature Collection',
      regularPrice: 0,
      salePrice: 0,
      images: [],
      colorVariants: [
        {
          id: 'var-1',
          name: 'Lime Green',
          colorCode: '#A2C55A',
          images: []
        }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      fabric: 'Fine Chanderi Silk with Cotton Voile Lining',
      description: '',
      details: [
        'Signature tailored silhouette with artisanal finishing',
        'Available in export pre-packs (XS-XXL)',
        'Reinforced French seams and premium breathable lining',
        'Flexible B2B wholesale MOQ: 20 pcs per style / pack'
      ],
      moq: '20 pcs / Flexible Wholesale Pack',
      sku: `WST-AT-${Date.now().toString().slice(-4)}`,
    });
    setIsModalOpen(true);
  };

  // Handle Save in Modal
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.title) {
      alert('Product title is required.');
      return;
    }

    setIsSaving(true);
    try {
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      // Ensure primary images reflect variant 1
      const allVariantImages = (editingProduct.colorVariants || []).flatMap(v => v.images);
      const payload = {
        ...editingProduct,
        images: allVariantImages.length > 0 ? allVariantImages : editingProduct.images || [],
      };

      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Product "${editingProduct.title}" saved & synced to live storefront.`);
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert(data.error || 'Failed to save product.');
      }
    } catch {
      alert('Error communicating with product server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Image Upload with Automatic Compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Client-Side Image Pre-Compression (< 150KB WebP)
      const compressedFile = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });

      // 2. Upload compressed file
      const formData = new FormData();
      formData.append('file', compressedFile);
      if (editingProduct?.id) {
        formData.append('product_id', editingProduct.id);
      }

      const res = await fetch('/api/product-images', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const uploadedUrl = data.url;

        setEditingProduct(prev => {
          if (!prev) return prev;
          const nextImages = [...(prev.images || []), uploadedUrl];
          const nextVariants = [...(prev.colorVariants || [])];

          if (variantIndex !== undefined && nextVariants[variantIndex]) {
            nextVariants[variantIndex] = {
              ...nextVariants[variantIndex],
              images: [...nextVariants[variantIndex].images, uploadedUrl],
            };
          }

          return {
            ...prev,
            images: nextImages,
            colorVariants: nextVariants,
          };
        });

        showToast(`Photo compressed (${Math.round(data.sizeBytes / 1024)} KB WebP) and attached.`);
      } else {
        alert('Image upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error during image compression: ' + err.message);
    }
  };

  // ─── LOGIN SCREEN ───────────────────────────────────────────────
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-card border border-[#E8E4DA]/80">
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#0B2D7F]/60 block mb-1">
              WASTRAM ATELIER // JAIPUR
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#0B2D7F]">
              Administrative Portal
            </h1>
            <p className="text-xs text-[#0B2D7F]/70 mt-1">
              Enter your Atelier security passcode to manage live collections, Firestore sync &amp; wholesale catalog.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase text-[#0B2D7F] tracking-wider block mb-1.5">
                Security Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. Wastram@2026)"
                className="w-full px-4 py-3 rounded-xl border border-[#0B2D7F]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2D7F]/20 focus:border-[#0B2D7F]"
                required
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 rounded-full bg-[#0B2D7F] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#071F59] transition-all shadow-soft active:scale-[0.98] cursor-pointer"
            >
              {isSubmittingAuth ? 'Verifying...' : 'Authenticate Console'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E8E4DA]/60 text-center">
            <Link href="/" className="text-xs text-[#0B2D7F]/60 hover:text-[#0B2D7F] flex items-center justify-center gap-1">
              <ArrowLeft size={12} /> Return to Wastram Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN ADMIN CONSOLE ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F4EF] flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B2D7F] text-white px-5 py-3 rounded-2xl shadow-card flex items-center gap-3 animate-fade-in text-xs font-medium">
          <Check size={16} className="text-[#A2C55A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E4DA] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#0B2D7F]">
            Wastram
          </Link>
          <span className="text-[10px] bg-[#0B2D7F]/10 text-[#0B2D7F] px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
            ATELIER ADMIN
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-full border border-[#E8E4DA]">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-[#0B2D7F] text-white shadow-soft' : 'text-[#0B2D7F]/70 hover:text-[#0B2D7F]'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-[#0B2D7F] text-white shadow-soft' : 'text-[#0B2D7F]/70 hover:text-[#0B2D7F]'
            }`}
          >
            10 Categories
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'database' ? 'bg-[#0B2D7F] text-white shadow-soft' : 'text-[#0B2D7F]/70 hover:text-[#0B2D7F]'
            }`}
          >
            Database &amp; Firestore
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#0B2D7F] hover:bg-[#FAF9F6] border border-[#E8E4DA]"
          >
            <span>Live Store</span>
            <ExternalLink size={12} />
          </Link>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-[#0B2D7F]/60 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-5">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-soft border border-[#E8E4DA]/60">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B2D7F]/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by Title, SKU or ID..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA] text-xs text-[#0B2D7F] focus:outline-none focus:border-[#0B2D7F]"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA] text-xs text-[#0B2D7F] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All 10 Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* Status Dropdown */}
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA] text-xs text-[#0B2D7F] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="live">Published (Live)</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B2D7F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#071F59] transition-all shadow-soft cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add New Product</span>
                </button>

                <button
                  onClick={fetchProducts}
                  title="Reload"
                  className="p-2 rounded-full text-[#0B2D7F] hover:bg-[#FAF9F6] border border-[#E8E4DA]"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-soft border border-[#E8E4DA]/60 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E8E4DA] flex items-center justify-between text-xs text-[#0B2D7F]">
                <span className="font-semibold">
                  Showing {filteredProducts.length} of {products.length} Products
                </span>
                <span className="text-[11px] text-[#0B2D7F]/60">
                  Total Photoshoots: 4,908 Images Indexed
                </span>
              </div>

              {isLoading ? (
                <div className="p-12 text-center text-xs text-[#0B2D7F]/60">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#0B2D7F]" />
                  Loading Atelier Catalog &amp; Overrides...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#0B2D7F]/60">
                  No products found matching your search.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F6] text-[#0B2D7F]/70 font-mono uppercase text-[10px] tracking-wider border-b border-[#E8E4DA]">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">SKU / Code</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Audited Colors</th>
                        <th className="py-3 px-4">MOQ</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E4DA]/60">
                      {filteredProducts.slice(0, 100).map(p => (
                        <tr key={p.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0] || '/icon.png'}
                                alt={p.title}
                                className="w-10 h-12 object-cover rounded-lg bg-[#E8E4DA]/40 border border-[#E8E4DA]"
                              />
                              <div className="flex flex-col">
                                <Link
                                  href={`/products/${p.slug}`}
                                  target="_blank"
                                  className="font-medium text-[#0B2D7F] hover:underline line-clamp-1 max-w-[220px]"
                                >
                                  {p.title}
                                </Link>
                                <span className="text-[10px] text-[#0B2D7F]/50 font-mono">
                                  {p.images.length} Photos
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-[#0B2D7F]/80">
                            {p.sku || p.id}
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#0B2D7F] border border-[#E8E4DA] text-[10px] font-medium capitalize">
                              {p.category.replace(/-/g, ' ')}
                            </span>
                          </td>

                          {/* Real Audited Color Swatches */}
                          <td className="py-3 px-4">
                            {p.colorVariants && p.colorVariants.length > 0 ? (
                              <div className="flex items-center gap-1.5">
                                {p.colorVariants.slice(0, 5).map(v => (
                                  <span
                                    key={v.id}
                                    title={`${v.name} (${v.images.length} photos)`}
                                    className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                                    style={{ backgroundColor: v.colorCode }}
                                  />
                                ))}
                                <span className="text-[10px] text-[#0B2D7F]/60 ml-1 font-medium">
                                  {p.colorVariants.length} {p.colorVariants.length === 1 ? 'Color' : 'Colors'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-[#0B2D7F]/40">1 Color</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-[#0B2D7F]/70 text-[11px]">
                            {p.moq || '20 pcs'}
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleHideProduct(p)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                                p.is_hidden
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.is_hidden ? <EyeOff size={10} /> : <Eye size={10} />}
                              <span>{p.is_hidden ? 'Hidden' : 'Live'}</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(p)}
                                title="Edit Product"
                                className="p-1.5 text-[#0B2D7F]/70 hover:text-[#0B2D7F] hover:bg-[#FAF9F6] rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 size={14} />
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                title="Delete Product"
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES EXPLORER */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map(c => {
              const count = products.filter(p => p.category === c.id || p.tab === c.id).length;
              return (
                <div key={c.id} className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DA]/60 flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#0B2D7F]/50 block">
                      CATALOGUE SLUG // {c.id}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#0B2D7F] mt-1">
                      {c.name}
                    </h3>
                    <p className="text-xs text-[#0B2D7F]/70 mt-1">
                      {count} Unified Products Active
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DA]/60">
                    <button
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setActiveTab('products');
                      }}
                      className="text-xs text-[#0B2D7F] font-semibold hover:underline"
                    >
                      Filter Products &rarr;
                    </button>

                    <Link
                      href={`/collections/${c.id}`}
                      target="_blank"
                      className="text-xs text-[#0B2D7F]/60 hover:text-[#0B2D7F] flex items-center gap-1"
                    >
                      <span>View Live</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: DATABASE & FIRESTORE STATUS */}
        {activeTab === 'database' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DA]/60">
              <div className="flex items-center gap-3 mb-4">
                <Database size={24} className="text-[#0B2D7F]" />
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#0B2D7F]">
                    Google Cloud Firestore Connection &amp; Overrides
                  </h2>
                  <p className="text-xs text-[#0B2D7F]/70">
                    Dual-layer hybrid sync: Firestore Cloud Database + Zero-latency Local Cache.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA]">
                  <span className="text-[10px] font-mono text-[#0B2D7F]/60 uppercase block">Total Catalogue Products</span>
                  <span className="text-2xl font-bold text-[#0B2D7F]">{products.length}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA]">
                  <span className="text-[10px] font-mono text-[#0B2D7F]/60 uppercase block">All Photoshoots Preserved</span>
                  <span className="text-2xl font-bold text-[#0B2D7F]">4,908 Photos</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA]">
                  <span className="text-[10px] font-mono text-[#0B2D7F]/60 uppercase block">Image Compression</span>
                  <span className="text-2xl font-bold text-emerald-700">WebP Active</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#0B2D7F] flex items-start gap-3">
                <Info size={16} className="shrink-0 mt-0.5 text-[#0B2D7F]" />
                <div>
                  <span className="font-bold block mb-1">Firestore Setup Instructions:</span>
                  1. Paste your Firebase Web Config into <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">.env.local</code> (Project ID, API Key, Auth Domain).<br />
                  2. All edits, creations, and deletions made in this admin panel automatically sync to the <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">products</code> collection in Firestore.<br />
                  3. Image uploads are automatically compressed to lightweight WebP files (&lt; 150KB) before saving.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── ADD / EDIT PRODUCT MODAL ──────────────────────────────── */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-card border border-[#E8E4DA] overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-[#E8E4DA] flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0B2D7F]">
                  {modalMode === 'add' ? 'Create New Ensemble' : `Edit Product: ${editingProduct.title}`}
                </h3>
                <span className="text-[10px] font-mono text-[#0B2D7F]/60 uppercase">
                  ID: {editingProduct.id} • SKU: {editingProduct.sku}
                </span>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#0B2D7F]/60 hover:text-[#0B2D7F] rounded-full hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs text-[#0B2D7F]">
              {/* Title & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Product Title</label>
                  <input
                    type="text"
                    value={editingProduct.title || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E4DA] bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#0B2D7F]"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">SKU Reference</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E4DA] bg-[#FAF9F6] text-xs font-mono focus:outline-none focus:border-[#0B2D7F]"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'western-dresses'}
                    onChange={e => setEditingProduct(prev => ({ ...prev, category: e.target.value, tab: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E4DA] bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#0B2D7F]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. Signature Bestseller"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E4DA] bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#0B2D7F]"
                  />
                </div>
              </div>

              {/* Fabric Specification */}
              <div>
                <label className="font-semibold block mb-1">Fabric &amp; Craftsmanship</label>
                <input
                  type="text"
                  value={editingProduct.fabric || ''}
                  onChange={e => setEditingProduct(prev => ({ ...prev, fabric: e.target.value }))}
                  placeholder="e.g. Fine Chanderi Silk with Cotton Voile Lining"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E4DA] bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#0B2D7F]"
                />
              </div>

              {/* Color Variants Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold block">
                    Audited Color Variants ({editingProduct.colorVariants?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...(editingProduct.colorVariants || [])];
                      next.push({
                        id: `var-${next.length + 1}`,
                        name: 'New Color',
                        colorCode: '#0B2D7F',
                        images: []
                      });
                      setEditingProduct(prev => ({ ...prev, colorVariants: next }));
                    }}
                    className="text-[11px] font-semibold text-[#0B2D7F] hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Colorway
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {(editingProduct.colorVariants || []).map((v, vIdx) => (
                    <div key={v.id || vIdx} className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA] flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={v.colorCode}
                          onChange={e => {
                            const next = [...(editingProduct.colorVariants || [])];
                            next[vIdx].colorCode = e.target.value;
                            setEditingProduct(prev => ({ ...prev, colorVariants: next }));
                          }}
                          className="w-7 h-7 rounded border-none cursor-pointer"
                        />
                        <input
                          type="text"
                          value={v.name}
                          onChange={e => {
                            const next = [...(editingProduct.colorVariants || [])];
                            next[vIdx].name = e.target.value;
                            setEditingProduct(prev => ({ ...prev, colorVariants: next }));
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-[#E8E4DA] bg-white text-xs"
                          placeholder="Color Name (e.g. Lime Green)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = (editingProduct.colorVariants || []).filter((_, i) => i !== vIdx);
                            setEditingProduct(prev => ({ ...prev, colorVariants: next }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Image List for this variant */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {v.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="relative group w-12 h-14 rounded-lg overflow-hidden border border-[#E8E4DA]">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...(editingProduct.colorVariants || [])];
                                next[vIdx].images = next[vIdx].images.filter((_, i) => i !== imgIdx);
                                setEditingProduct(prev => ({ ...prev, colorVariants: next }));
                              }}
                              className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        {/* Upload Compressed Photo for this Variant */}
                        <label className="w-12 h-14 rounded-lg border border-dashed border-[#0B2D7F]/40 flex flex-col items-center justify-center text-[#0B2D7F]/60 hover:bg-white hover:text-[#0B2D7F] cursor-pointer transition-colors">
                          <Upload size={14} />
                          <span className="text-[8px] mt-0.5">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleImageUpload(e, vIdx)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold block mb-1">Wholesale Luxury Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E4DA] bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#0B2D7F]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E4DA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E8E4DA] text-xs font-semibold text-[#0B2D7F] hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-full bg-[#0B2D7F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#071F59] transition-all shadow-soft"
                >
                  {isSaving ? 'Saving...' : 'Save & Publish to Live Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
