"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Layers,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Copy,
  Search,
  CheckSquare,
  Square,
  Images,
} from "lucide-react";
import { ColorVariant } from "@/data/products";
import { adminFetch } from "../AdminClientPage";
import { optimizeImageFile } from "@/lib/imageOptimizer";
import { generateProductSlug } from "@/utils/slug";
import { safeSetLocalStorage } from "@/lib/safeStorage";
import { notifyAdmin } from "./AdminToast";

export interface ParentProductInfo {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  category?: any;
  category_id?: string;
  category_slug?: string;
  category_name?: string;
  tab?: string;
  price?: number;
  salePrice?: number;
  regularPrice?: number;
  fabric?: string;
  moq?: string;
  sizes?: string[];
  details?: string[];
  description?: string;
  short_desc?: string;
  badge?: string;
  brand?: string;
  featured_image?: string;
  mainImage?: string;
  gallery?: string[];
  images?: string[];
  technical_specs?: any;
}

interface ColorVariantManagerProps {
  variants: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
  productId?: string;
  parentProduct?: ParentProductInfo;
  onProductCreated?: (newProduct: any) => Promise<void> | void;
  existingProducts?: any[];
}

export default function ColorVariantManager({
  variants = [],
  onChange,
  productId,
  parentProduct,
  onProductCreated,
  existingProducts = [],
}: ColorVariantManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [variantName, setVariantName] = useState("");
  const [variantImages, setVariantImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [directUrl, setDirectUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Checkbox for future adding variants: also create as separate product
  const [createAsSeparateOnSave, setCreateAsSeparateOnSave] = useState(false);

  // Split Modal State
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splittingVariant, setSplittingVariant] = useState<ColorVariant | null>(null);
  const [splitProductName, setSplitProductName] = useState("");
  const [splitProductSlug, setSplitProductSlug] = useState("");
  const [keepVariantInCurrent, setKeepVariantInCurrent] = useState(true);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitSuccess, setSplitSuccess] = useState<{
    name: string;
    slug: string;
    url: string;
  } | null>(null);

  // Existing Images Picker Modal State
  const [existingPickerOpen, setExistingPickerOpen] = useState(false);
  const [existingTab, setExistingTab] = useState<"thisProduct" | "catalog">("thisProduct");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedExistingUrls, setSelectedExistingUrls] = useState<Set<string>>(new Set());
  const [catalogProducts, setCatalogProducts] = useState<any[]>(existingProducts || []);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);

  // Keep catalog products synced
  useEffect(() => {
    if (existingProducts && existingProducts.length > 0) {
      setCatalogProducts(existingProducts);
    }
  }, [existingProducts]);

  // Fetch catalog products on-demand if catalog tab is opened and list is empty
  useEffect(() => {
    if (
      existingPickerOpen &&
      existingTab === "catalog" &&
      catalogProducts.length === 0 &&
      !isLoadingCatalog
    ) {
      setIsLoadingCatalog(true);
      adminFetch("/api/products?includeHidden=true")
        .then((res) => res.json())
        .then((data) => {
          const prods = Array.isArray(data) ? data : data?.products || [];
          setCatalogProducts(prods);
        })
        .catch((err) => console.error("Error fetching catalog images:", err))
        .finally(() => setIsLoadingCatalog(false));
    }
  }, [existingPickerOpen, existingTab, catalogProducts.length, isLoadingCatalog]);

  // Compute all existing images belonging to this product
  const thisProductImages = useMemo(() => {
    const list: { url: string; label: string }[] = [];
    const seen = new Set<string>();

    const addImg = (url: any, label: string) => {
      if (!url) return;
      const cleanUrl =
        typeof url === "string"
          ? url.trim()
          : typeof url?.url === "string"
          ? url.url.trim()
          : typeof url?.src === "string"
          ? url.src.trim()
          : "";
      if (cleanUrl && !seen.has(cleanUrl)) {
        seen.add(cleanUrl);
        list.push({ url: cleanUrl, label });
      }
    };

    if (parentProduct?.featured_image) addImg(parentProduct.featured_image, "Cover Photo");
    if (parentProduct?.mainImage && parentProduct.mainImage !== parentProduct.featured_image) {
      addImg(parentProduct.mainImage, "Main Image");
    }

    if (Array.isArray(parentProduct?.gallery)) {
      parentProduct.gallery.forEach((img, idx) => addImg(img, `Gallery #${idx + 1}`));
    }
    if (Array.isArray(parentProduct?.images)) {
      parentProduct.images.forEach((img, idx) => addImg(img, `Photo #${idx + 1}`));
    }

    // Images from other styling variants
    if (Array.isArray(variants)) {
      variants.forEach((v) => {
        if (Array.isArray(v.images)) {
          v.images.forEach((img, idx) => addImg(img, `${v.name || "Variant"} #${idx + 1}`));
        }
      });
    }

    return list;
  }, [parentProduct, variants]);

  // Compute catalog image items (searchable)
  const catalogImageItems = useMemo(() => {
    const list: { url: string; label: string; productName: string }[] = [];
    const seen = new Set<string>();
    const query = catalogSearch.toLowerCase().trim();

    for (const prod of catalogProducts) {
      const pName = prod.name || prod.title || "";
      const pCat = prod.category_name || prod.category || "";
      if (query && !pName.toLowerCase().includes(query) && !pCat.toLowerCase().includes(query)) {
        continue;
      }

      const addProdImg = (url: any, label: string) => {
        if (!url) return;
        const cleanUrl =
          typeof url === "string"
            ? url.trim()
            : typeof url?.url === "string"
            ? url.url.trim()
            : typeof url?.src === "string"
            ? url.src.trim()
            : "";
        if (cleanUrl && !seen.has(cleanUrl)) {
          seen.add(cleanUrl);
          list.push({ url: cleanUrl, label, productName: pName });
        }
      };

      if (prod.featured_image) addProdImg(prod.featured_image, "Cover");
      if (prod.mainImage && prod.mainImage !== prod.featured_image) addProdImg(prod.mainImage, "Main");
      if (Array.isArray(prod.gallery)) prod.gallery.forEach((img: any) => addProdImg(img, "Gallery"));
      if (Array.isArray(prod.images)) prod.images.forEach((img: any) => addProdImg(img, "Photo"));
      if (Array.isArray(prod.colorVariants)) {
        prod.colorVariants.forEach((cv: any) => {
          if (Array.isArray(cv.images)) cv.images.forEach((img: any) => addProdImg(img, cv.name || "Variant"));
        });
      }
    }
    return list;
  }, [catalogProducts, catalogSearch]);

  const handleOpenExistingPicker = () => {
    setSelectedExistingUrls(new Set());
    setCatalogSearch("");
    setExistingTab("thisProduct");
    setExistingPickerOpen(true);
  };

  const toggleSelectExisting = (url: string) => {
    setSelectedExistingUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    const list = existingTab === "thisProduct" ? thisProductImages : catalogImageItems;
    const urls = list.map((item) => item.url);
    setSelectedExistingUrls(new Set(urls));
  };

  const handleDeselectAll = () => {
    setSelectedExistingUrls(new Set());
  };

  const handleAddSelectedImages = () => {
    if (selectedExistingUrls.size === 0) return;
    const toAdd = Array.from(selectedExistingUrls).filter((url) => !variantImages.includes(url));
    setVariantImages((prev) => [...prev, ...toAdd]);
    notifyAdmin(
      "success",
      "Photos Added to Styling",
      `Added ${toAdd.length} existing photo(s) to "${variantName || "Variant"}"`
    );
    setExistingPickerOpen(false);
    setSelectedExistingUrls(new Set());
  };

  const getParentTitle = () => {
    return (parentProduct?.name || parentProduct?.title || "").trim();
  };

  const computeAutoNameAndSlug = (vName: string) => {
    const parentTitle = getParentTitle() || "Atelier Silhouette";
    const cleanVName = vName.trim() || "Variant";

    let autoName = "";
    if (parentTitle.toLowerCase().endsWith(cleanVName.toLowerCase())) {
      autoName = parentTitle;
    } else if (parentTitle.toLowerCase().includes(cleanVName.toLowerCase())) {
      autoName = parentTitle;
    } else {
      autoName = `${parentTitle} - ${cleanVName}`;
    }

    const autoSlug = generateProductSlug(autoName) || `product-${Date.now().toString(36)}`;
    return { autoName, autoSlug };
  };

  const startCreate = () => {
    setEditingId(null);
    setVariantName(`Styling ${variants.length + 1}`);
    setVariantImages([]);
    setDirectUrl("");
    setErrorMsg("");
    setCreateAsSeparateOnSave(false);
    setIsEditing(true);
  };

  const startEdit = (v: ColorVariant) => {
    setEditingId(v.id);
    setVariantName(v.name);
    setVariantImages(Array.isArray(v.images) ? [...v.images] : []);
    setDirectUrl("");
    setErrorMsg("");
    setCreateAsSeparateOnSave(false);
    setIsEditing(true);
  };

  // Open the dedicated Split Modal for an existing variant
  const handleOpenSplitModal = (v: ColorVariant) => {
    const { autoName, autoSlug } = computeAutoNameAndSlug(v.name);
    setSplittingVariant(v);
    setSplitProductName(autoName);
    setSplitProductSlug(autoSlug);
    setKeepVariantInCurrent(true);
    setSplitSuccess(null);
    setSplitModalOpen(true);
  };

  const handleSave = async (forceSeparateProduct: boolean = false) => {
    const trimmedName = variantName.trim();
    if (!trimmedName) {
      setErrorMsg("Please enter a variant / styling name (e.g. Styling 1, Look 2).");
      return;
    }

    const currentId = editingId || `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newVariant: ColorVariant = {
      id: currentId,
      name: trimmedName,
      colorCode: "", // No colorways needed - purely image sets
      images: variantImages,
    };

    let updated: ColorVariant[];
    if (editingId) {
      updated = variants.map((v) => (v.id === editingId ? newVariant : v));
    } else {
      updated = [...variants, newVariant];
    }

    onChange(updated);
    setIsEditing(false);
    setEditingId(null);

    // If "create as separate product" was requested during variant addition:
    if (forceSeparateProduct || createAsSeparateOnSave) {
      handleOpenSplitModal(newVariant);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove the "${name}" styling variant?`)) {
      const updated = variants.filter((v) => v.id !== id);
      onChange(updated);
    }
  };

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;
    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (const file of fileList) {
        const optimized = await optimizeImageFile(file);
        const formData = new FormData();
        formData.append("file", optimized);
        const res = await adminFetch("/api/uploads", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok || !json.url) {
          throw new Error(json?.error || `Upload failed for ${file.name}`);
        }
        urls.push(json.url);
      }
      setVariantImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      alert("Image upload failed: " + (err.message || String(err)));
    } finally {
      setIsUploading(false);
    }
  };

  // Perform API call to create the separate product
  const handleConfirmCreateSeparateProduct = async () => {
    if (!splittingVariant) return;
    const finalName = splitProductName.trim();
    const finalSlug = (splitProductSlug || generateProductSlug(finalName)).trim();

    if (!finalName) {
      alert("Please enter a product name.");
      return;
    }
    if (!finalSlug) {
      alert("Please enter a product URL slug.");
      return;
    }

    setIsSplitting(true);
    try {
      const parentCat =
        parentProduct?.category_id ||
        (typeof parentProduct?.category === "string"
          ? parentProduct?.category
          : parentProduct?.category?.id || parentProduct?.category?.slug) ||
        "western-dresses";

      const parentCatName =
        parentProduct?.category_name ||
        (typeof parentProduct?.category === "object" ? parentProduct?.category?.name : undefined) ||
        parentCat;

      const variantImgs =
        Array.isArray(splittingVariant.images) && splittingVariant.images.length > 0
          ? splittingVariant.images
          : parentProduct?.images || parentProduct?.gallery || [];

      const primaryImage =
        variantImgs[0] || parentProduct?.featured_image || parentProduct?.mainImage || "";

      const newProductId = `prod-${finalSlug.slice(0, 32)}-${Date.now().toString().slice(-4)}`;

      const newProductPayload: any = {
        id: newProductId,
        name: finalName,
        title: finalName,
        slug: finalSlug,
        category: parentCat,
        category_id: parentCat,
        category_name: parentCatName,
        category_slug: parentCat,
        tab: parentProduct?.tab || parentCat,
        price: parentProduct?.price ?? parentProduct?.salePrice ?? 1899,
        regularPrice:
          parentProduct?.regularPrice ??
          (parentProduct?.price ? parentProduct.price + 600 : 2499),
        salePrice: parentProduct?.salePrice ?? parentProduct?.price ?? 1899,
        fabric: parentProduct?.fabric || "Pure Handloom Silk & Cotton",
        moq: parentProduct?.moq || "20 pcs / Flexible Wholesale Pack",
        sizes: parentProduct?.sizes || ["S", "M", "L", "XL", "XXL"],
        badge: parentProduct?.badge || "New Silhouette",
        brand: parentProduct?.brand || "Wastram Atelier",
        featured_image: primaryImage,
        mainImage: primaryImage,
        images: variantImgs,
        gallery: variantImgs,
        description:
          parentProduct?.description ||
          `Authentic ${finalName} handcrafted in Wastram's Jaipur atelier using master-carved teakwood blocks and colorfast natural formulations.`,
        short_desc:
          parentProduct?.short_desc ||
          `Authentic ${finalName} tailored in ${parentProduct?.fabric || "premium breathable fabric"} with precision grading.`,
        details:
          parentProduct?.details && parentProduct.details.length > 0
            ? parentProduct.details
            : [
                `Authentic ${finalName} handcrafted at Wastram's Sanganer, Jaipur atelier`,
                `Tailored in ${parentProduct?.fabric || "breathable premium fabric"} with colour-fast finish`,
                `Precision anatomical grading across sizes S to XXL`,
                `Wholesale export MOQ: ${parentProduct?.moq || "20 pcs / Flexible Wholesale Pack"}`,
              ],
        colorVariants: [],
        isCustomProduct: true,
        inStock: true,
        stockQty: 50,
        deleted: false,
      };

      const res = await adminFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create separate product.");
      }

      // If user chose not to keep the variant in current product:
      if (!keepVariantInCurrent) {
        const updated = variants.filter((v) => v.id !== splittingVariant.id);
        onChange(updated);
      }

      // Sync to local storage for instant availability across tabs
      try {
        const local = JSON.parse(localStorage.getItem("ixos_products_overrides") || "{}");
        local[newProductId] = newProductPayload;
        local[finalSlug] = newProductPayload;
        safeSetLocalStorage("ixos_products_overrides", JSON.stringify(local));
      } catch (_) {}

      // Broadcast update to all admin tabs
      try {
        window.dispatchEvent(new Event("ixos_products_updated"));
        if (typeof BroadcastChannel !== "undefined") {
          const ch = new BroadcastChannel("wastram_products_sync");
          ch.postMessage({ type: "products_updated", timestamp: Date.now() });
          ch.close();
        }
      } catch (_) {}

      notifyAdmin(
        "success",
        "Separate Product Created!",
        `"${finalName}" is now live at /products/${finalSlug}`
      );

      if (onProductCreated) {
        await onProductCreated(newProductPayload);
      }

      setSplitSuccess({
        name: finalName,
        slug: finalSlug,
        url: `/products/${finalSlug}`,
      });
    } catch (err: any) {
      alert("Error creating product: " + (err.message || String(err)));
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0B2D7F] stroke-[2]" />
            <h4 className="text-xs font-heading font-black text-black uppercase tracking-wider">
              Styling Variants ({variants.length})
            </h4>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
            Add different photoshoot sets. You can also turn any available or future variant into its own separate product with 1 tap.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={startCreate}
            className="px-3.5 py-1.5 bg-[#0B2D7F] hover:bg-[#071F59] text-white text-[11px] font-heading font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Variant</span>
          </button>
        )}
      </div>

      {/* Editor Card (For Future Adding Variants) */}
      {isEditing && (
        <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-[#0B2D7F] space-y-4 animate-fade-in shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <span className="text-xs font-heading font-black text-black uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0B2D7F]" />
              {editingId ? "Edit Styling Variant" : "Create New Styling Variant"}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-neutral-500 hover:text-black p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Variant / Styling Name */}
          <div>
            <label className="block text-[11px] font-heading font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Styling Variant Name *
            </label>
            <input
              type="text"
              value={variantName}
              onChange={(e) => {
                setVariantName(e.target.value);
                setErrorMsg("");
              }}
              placeholder="e.g. Styling 1, Styling 2, Festive Look, Classic Drape"
              className="w-full bg-white border-2 border-neutral-200 focus:border-[#0B2D7F] rounded-xl px-3 py-2 text-xs text-black font-medium outline-none transition-colors"
            />
            <p className="text-[10px] text-neutral-400 mt-1">
              Displayed on the live product page in the &ldquo;More Stylings...&rdquo; selector.
            </p>
          </div>

          {/* Variant Photos (Dedicated Image Set) */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-heading font-bold text-neutral-700 uppercase tracking-wider">
                Photos for this Styling ({variantImages.length})
              </label>
              <span className="text-[10px] text-neutral-500 font-medium">
                When customers select this styling, this exact photo set is displayed.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Drop / Upload from Device */}
              <div
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.multiple = true;
                  input.accept = "image/*";
                  input.onchange = () => {
                    if (input.files) handleUploadFiles(input.files);
                  };
                  input.click();
                }}
                className="border-2 border-dashed border-neutral-300 hover:border-[#0B2D7F] rounded-xl p-3 flex items-center gap-2.5 bg-white cursor-pointer transition-all hover:bg-neutral-50/60 group"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-[#0B2D7F]/10 text-[#0B2D7F] flex items-center justify-center shrink-0 transition-colors">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B2D7F]" />
                  ) : (
                    <Upload className="w-4 h-4 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-black block">
                    {isUploading ? "Uploading photos..." : "Upload Photos"}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium block">
                    From computer / device
                  </span>
                </div>
              </div>

              {/* Upload / Select from Existing Product Images */}
              <button
                type="button"
                onClick={handleOpenExistingPicker}
                className="border-2 border-indigo-200 hover:border-[#0B2D7F] bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl p-3 flex items-center gap-2.5 text-left cursor-pointer transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0B2D7F] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Images className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-heading font-black uppercase tracking-wider text-[#0B2D7F] truncate">
                      From Existing Images
                    </span>
                    {thisProductImages.length > 0 && (
                      <span className="bg-[#0B2D7F] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                        {thisProductImages.length}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-600 font-medium block truncate">
                    Pick from cover, gallery or catalog
                  </span>
                </div>
              </button>
            </div>

            {/* Direct URL Input */}
            <div className="flex gap-1.5 pt-0.5">
              <input
                type="text"
                value={directUrl}
                onChange={(e) => setDirectUrl(e.target.value)}
                placeholder="Or paste external image URL..."
                className="flex-1 bg-white border-2 border-neutral-200 focus:border-[#0B2D7F] rounded-xl px-2.5 py-1.5 text-xs text-black outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = directUrl.trim();
                    if (val) {
                      setVariantImages((prev) => [...prev, val]);
                      setDirectUrl("");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const val = directUrl.trim();
                  if (val) {
                    setVariantImages((prev) => [...prev, val]);
                    setDirectUrl("");
                  }
                }}
                className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold rounded-xl cursor-pointer"
              >
                Add URL
              </button>
            </div>

            {/* Thumbnail Preview Grid */}
            {variantImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-2">
                {variantImages.map((imgUrl, i) => (
                  <div
                    key={`${imgUrl}-${i}`}
                    className="relative aspect-square rounded-lg border-2 border-neutral-200 bg-white p-1 overflow-hidden group shadow-2xs"
                  >
                    <img
                      src={imgUrl}
                      alt={`Variant photo ${i + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setVariantImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Option for Future Adding Variants: Checkbox to also create as separate product */}
          <div className="pt-2 border-t border-neutral-200">
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors">
              <input
                type="checkbox"
                checked={createAsSeparateOnSave}
                onChange={(e) => setCreateAsSeparateOnSave(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[#0B2D7F] focus:ring-[#0B2D7F] cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span className="text-xs font-heading font-black text-black uppercase tracking-wider">
                    Also create this variant as a separate standalone product on save
                  </span>
                </div>
                <p className="text-[10px] text-neutral-600 font-medium mt-0.5 leading-relaxed">
                  Automatically generates a new product listing with its own name and URL slug (e.g. &ldquo;{computeAutoNameAndSlug(variantName).autoName}&rdquo; &rarr; &ldquo;/products/{computeAutoNameAndSlug(variantName).autoSlug}&rdquo;).
                </p>
              </div>
            </label>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-red-600 animate-fade-in">{errorMsg}</p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border-2 border-neutral-200 hover:border-black rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Save this variant and immediately launch it as a new separate product"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Save &amp; Make Separate Product</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2 bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{editingId ? "Update Variant" : "Save Variant"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Existing / Available Variants List */}
      {variants.length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
          <p className="text-xs font-medium text-neutral-500">
            No styling variants created yet. Click &ldquo;+ Add Variant&rdquo; above to define different image sets for this product.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {variants.map((v) => (
            <div
              key={v.id}
              className="p-3.5 rounded-xl border-2 border-neutral-200 hover:border-[#0B2D7F] bg-white transition-all shadow-xs flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0B2D7F]/10 border border-[#0B2D7F]/20 flex items-center justify-center text-[#0B2D7F] shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-xs text-black leading-tight">
                      {v.name}
                    </h5>
                    <span className="font-sans text-[10px] text-neutral-500 font-medium">
                      {v.images?.length || 0} {v.images?.length === 1 ? "Photo" : "Photos"} in set
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(v)}
                    className="p-1 text-neutral-400 hover:text-black rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Edit variant"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id, v.name)}
                    className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete variant"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Photos Count & Mini Thumbnails */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-neutral-500 font-medium">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-neutral-400" />
                    <span>Photoshoot Set</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(v)}
                    className="text-[#0B2D7F] hover:underline font-bold"
                  >
                    Manage Photos →
                  </button>
                </div>

                {v.images && v.images.length > 0 ? (
                  <div className="flex items-center gap-1 overflow-hidden">
                    {v.images.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-lg border border-neutral-200 overflow-hidden shrink-0 bg-neutral-50"
                      >
                        <img
                          src={img}
                          alt={`${v.name} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {v.images.length > 4 && (
                      <span className="text-[10px] font-bold text-neutral-500 pl-1">
                        +{v.images.length - 4}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-neutral-400 italic">No photos attached to this variant yet</p>
                )}

                {/* Option for ALL Available Variants: Make Separate Product Button */}
                <button
                  type="button"
                  onClick={() => handleOpenSplitModal(v)}
                  className="w-full mt-2 py-1.5 px-2.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100 hover:border-amber-400 text-amber-950 text-[11px] font-heading font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs group/btn active:scale-98"
                  title="Create a new standalone product with auto-generated name and URL from this variant"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500 group-hover/btn:rotate-12 transition-transform" />
                  <span>Make Separate Product</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── MAKE SEPARATE PRODUCT MODAL ────────────────────────────────────── */}
      {splitModalOpen && splittingVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border-2 border-black rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-scale-up">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                  <Sparkles className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-black uppercase tracking-wider">
                    Make Separate Product from Variant
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    Auto-generates a new standalone listing from &ldquo;{splittingVariant.name}&rdquo;.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSplitModalOpen(false);
                  setSplitSuccess(null);
                }}
                className="text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {splitSuccess ? (
              <div className="py-4 space-y-4 text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-base text-black uppercase tracking-wider">
                    Product Created Successfully!
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 font-medium">
                    &ldquo;{splitSuccess.name}&rdquo; is now active in the Wastram catalogue.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-left space-y-1">
                  <span className="text-[10px] font-heading font-bold text-neutral-500 uppercase tracking-wider block">
                    Live Product URL:
                  </span>
                  <a
                    href={splitSuccess.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-[#0B2D7F] hover:underline flex items-center gap-1.5 break-all"
                  >
                    <span>{splitSuccess.url}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href={splitSuccess.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span>View on Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSplitModalOpen(false);
                      setSplitSuccess(null);
                    }}
                    className="px-5 py-2 bg-[#0B2D7F] hover:bg-[#071F59] text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Configuration / Confirmation State */
              <div className="space-y-4">
                {/* Variant Preview Banner */}
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border border-neutral-200 overflow-hidden bg-white shrink-0">
                    {splittingVariant.images && splittingVariant.images[0] ? (
                      <img
                        src={splittingVariant.images[0]}
                        alt={splittingVariant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-heading font-bold text-neutral-500 uppercase tracking-wider block">
                      Source Styling Variant
                    </span>
                    <span className="font-heading font-bold text-xs text-black truncate block">
                      {splittingVariant.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {splittingVariant.images?.length || 0} Photos included in photoshoot gallery
                    </span>
                  </div>
                </div>

                {/* Auto-Generated Product Name Input */}
                <div>
                  <label className="block text-[11px] font-heading font-black text-black uppercase tracking-wider mb-1">
                    Auto-Generated Product Name *
                  </label>
                  <input
                    type="text"
                    value={splitProductName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSplitProductName(val);
                      setSplitProductSlug(generateProductSlug(val));
                    }}
                    placeholder="Product Title"
                    className="w-full bg-white border-2 border-neutral-200 focus:border-[#0B2D7F] rounded-xl px-3 py-2 text-xs text-black font-semibold outline-none transition-colors"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Auto-generated from parent product and variant name. You can customize it if desired.
                  </p>
                </div>

                {/* Auto-Generated URL Slug Input */}
                <div>
                  <label className="block text-[11px] font-heading font-black text-black uppercase tracking-wider mb-1">
                    Auto-Generated Product URL Slug *
                  </label>
                  <div className="flex items-center rounded-xl border-2 border-neutral-200 focus-within:border-[#0B2D7F] bg-white overflow-hidden">
                    <span className="bg-neutral-100 text-neutral-500 px-2.5 py-2 text-[11px] font-mono border-r border-neutral-200 select-none">
                      /products/
                    </span>
                    <input
                      type="text"
                      value={splitProductSlug}
                      onChange={(e) => setSplitProductSlug(generateProductSlug(e.target.value))}
                      placeholder="product-url-slug"
                      className="flex-1 px-2.5 py-2 text-xs font-mono text-black outline-none font-semibold"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Clean, SEO-friendly handle used for product page routing.
                  </p>
                </div>

                {/* Category & Specifications Confirmation */}
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-neutral-500 font-medium block">Department / Category:</span>
                    <span className="font-heading font-bold text-[#0B2D7F] uppercase tracking-wide">
                      {parentProduct?.category_name || parentProduct?.category || "Western Dresses"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 font-medium block">Wholesale MOQ:</span>
                    <span className="font-bold text-neutral-800">
                      {parentProduct?.moq || "20 pcs"}
                    </span>
                  </div>
                </div>

                {/* Keep Variant Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepVariantInCurrent}
                    onChange={(e) => setKeepVariantInCurrent(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0B2D7F] focus:ring-[#0B2D7F] cursor-pointer"
                  />
                  <span className="text-xs text-neutral-700 font-medium">
                    Keep &ldquo;{splittingVariant.name}&rdquo; as a variant in this product as well
                  </span>
                </label>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSplitModalOpen(false);
                      setSplittingVariant(null);
                    }}
                    disabled={isSplitting}
                    className="px-4 py-2 border-2 border-neutral-200 hover:border-black rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCreateSeparateProduct}
                    disabled={isSplitting}
                    className="px-5 py-2 bg-[#0B2D7F] hover:bg-[#071F59] disabled:opacity-50 text-white text-xs font-heading font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    {isSplitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Product...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>Create Product Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SELECT FROM EXISTING PRODUCT IMAGES MODAL ──────────────────────── */}
      {existingPickerOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border-2 border-black rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-200 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B2D7F] text-white flex items-center justify-center shrink-0">
                  <Images className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-black uppercase tracking-wider">
                    Select from Existing Product Images
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    Pick photos already in the product or catalogue to attach to &ldquo;{variantName || "Styling Variant"}&rdquo;.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExistingPickerOpen(false)}
                className="text-neutral-400 hover:text-black p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs & Search Bar */}
            <div className="p-3 sm:px-5 bg-neutral-50 border-b border-neutral-200 shrink-0 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Tabs */}
                <div className="flex items-center gap-1.5 bg-neutral-200/70 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setExistingTab("thisProduct")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      existingTab === "thisProduct"
                        ? "bg-white text-black shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    <span>This Product&apos;s Photos</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        existingTab === "thisProduct"
                          ? "bg-[#0B2D7F] text-white"
                          : "bg-neutral-300 text-neutral-700"
                      }`}
                    >
                      {thisProductImages.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExistingTab("catalog")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      existingTab === "catalog"
                        ? "bg-white text-black shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    <span>All Catalogue Photos</span>
                    {catalogProducts.length > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          existingTab === "catalog"
                            ? "bg-[#0B2D7F] text-white"
                            : "bg-neutral-300 text-neutral-700"
                        }`}
                      >
                        {catalogImageItems.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Quick Selection Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllVisible}
                    className="px-2.5 py-1 text-[11px] font-heading font-bold text-[#0B2D7F] hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    disabled={selectedExistingUrls.size === 0}
                    className="px-2.5 py-1 text-[11px] font-heading font-bold text-neutral-500 hover:text-black disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
                  >
                    Clear Selection
                  </button>
                  {selectedExistingUrls.size > 0 && (
                    <span className="bg-[#0B2D7F] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {selectedExistingUrls.size} selected
                    </span>
                  )}
                </div>
              </div>

              {/* Search Bar (Shown on Catalog Tab) */}
              {existingTab === "catalog" && (
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search catalogue photos by product title or category..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 focus:border-[#0B2D7F] rounded-xl text-xs text-black outline-none transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Image Grid Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {isLoadingCatalog && existingTab === "catalog" ? (
                <div className="py-16 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0B2D7F] mx-auto" />
                  <p className="text-xs text-neutral-500 font-medium">
                    Loading catalogue images from Wastram...
                  </p>
                </div>
              ) : existingTab === "thisProduct" ? (
                thisProductImages.length === 0 ? (
                  <div className="py-16 text-center space-y-2 border-2 border-dashed border-neutral-200 rounded-xl">
                    <ImageIcon className="w-8 h-8 text-neutral-300 mx-auto" />
                    <p className="text-xs text-neutral-600 font-semibold">
                      No photos attached to this product yet.
                    </p>
                    <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                      Upload photos to this variant, set a cover image in the product form, or switch to the &ldquo;All Catalogue Photos&rdquo; tab above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {thisProductImages.map((item, idx) => {
                      const isSelected = selectedExistingUrls.has(item.url);
                      const isAlreadyInVariant = variantImages.includes(item.url);

                      return (
                        <div
                          key={`this-${item.url}-${idx}`}
                          onClick={() => toggleSelectExisting(item.url)}
                          className={`group relative aspect-square rounded-xl border-2 transition-all cursor-pointer overflow-hidden bg-neutral-100 ${
                            isSelected
                              ? "border-[#0B2D7F] ring-2 ring-[#0B2D7F]/20 shadow-md"
                              : "border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.label}
                            className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                              isSelected ? "brightness-95" : ""
                            }`}
                          />

                          {/* Checkbox badge */}
                          <div
                            className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#0B2D7F] text-white shadow-sm"
                                : "bg-white/80 border border-neutral-300 text-transparent hover:border-[#0B2D7F]"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>

                          {/* Source Label Badge */}
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-col gap-0.5">
                            <span className="bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded truncate">
                              {item.label}
                            </span>
                            {isAlreadyInVariant && (
                              <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1 w-fit">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                <span>In Variant</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : catalogImageItems.length === 0 ? (
                <div className="py-16 text-center space-y-2 border-2 border-dashed border-neutral-200 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="text-xs text-neutral-600 font-semibold">
                    No images match your search.
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Try searching for another product name or clear the search query.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {catalogImageItems.map((item, idx) => {
                    const isSelected = selectedExistingUrls.has(item.url);
                    const isAlreadyInVariant = variantImages.includes(item.url);

                    return (
                      <div
                        key={`cat-${item.url}-${idx}`}
                        onClick={() => toggleSelectExisting(item.url)}
                        className={`group relative aspect-square rounded-xl border-2 transition-all cursor-pointer overflow-hidden bg-neutral-100 ${
                          isSelected
                            ? "border-[#0B2D7F] ring-2 ring-[#0B2D7F]/20 shadow-md"
                            : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.label}
                          className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                            isSelected ? "brightness-95" : ""
                          }`}
                        />

                        {/* Checkbox badge */}
                        <div
                          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-[#0B2D7F] text-white shadow-sm"
                              : "bg-white/80 border border-neutral-300 text-transparent hover:border-[#0B2D7F]"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>

                        {/* Product Title / Label Badge */}
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-col gap-0.5">
                          <span className="bg-black/80 backdrop-blur-xs text-white text-[9px] font-heading font-bold px-1.5 py-0.5 rounded truncate">
                            {item.productName || item.label}
                          </span>
                          {isAlreadyInVariant && (
                            <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1 w-fit">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>In Variant</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-t border-neutral-200 bg-white shrink-0">
              <div className="text-xs font-medium text-neutral-600">
                {selectedExistingUrls.size === 0 ? (
                  <span>Click images above to select</span>
                ) : (
                  <span className="font-bold text-[#0B2D7F]">
                    {selectedExistingUrls.size} {selectedExistingUrls.size === 1 ? "photo" : "photos"} selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExistingPickerOpen(false)}
                  className="px-4 py-2 border-2 border-neutral-200 hover:border-black rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSelectedImages}
                  disabled={selectedExistingUrls.size === 0}
                  className="px-5 py-2 bg-[#0B2D7F] hover:bg-[#071F59] disabled:opacity-40 text-white text-xs font-heading font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    Add Selected ({selectedExistingUrls.size})
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
