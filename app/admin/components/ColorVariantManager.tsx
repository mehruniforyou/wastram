"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, Upload, Palette, Image as ImageIcon, Loader2 } from "lucide-react";
import { ColorVariant } from "@/data/products";
import { adminFetch } from "../AdminClientPage";
import { optimizeImageFile } from "@/lib/imageOptimizer";

export const JAIPUR_COLOR_PRESETS = [
  { name: "Wine Maroon", code: "#800020" },
  { name: "Jaipur Indigo", code: "#1B2A4A" },
  { name: "Emerald Green", code: "#004D40" },
  { name: "Mustard Gold", code: "#D4AF37" },
  { name: "Coral Peach", code: "#F88379" },
  { name: "Rani Pink", code: "#C2185B" },
  { name: "Midnight Black", code: "#1A1A1A" },
  { name: "Ivory Pearl", code: "#FDFBF7" },
  { name: "Sage Olive", code: "#556B2F" },
  { name: "Terracotta Rust", code: "#B7410E" },
  { name: "Teal Peacock", code: "#008080" },
  { name: "Powder Blue", code: "#B0C4DE" },
];

interface ColorVariantManagerProps {
  variants: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
  productId?: string;
}

export default function ColorVariantManager({
  variants = [],
  onChange,
  productId,
}: ColorVariantManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [variantName, setVariantName] = useState("");
  const [variantColorCode, setVariantColorCode] = useState("#800020");
  const [variantImages, setVariantImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [directUrl, setDirectUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const startCreate = () => {
    setEditingId(null);
    setVariantName("");
    setVariantColorCode("#800020");
    setVariantImages([]);
    setDirectUrl("");
    setErrorMsg("");
    setIsEditing(true);
  };

  const startEdit = (v: ColorVariant) => {
    setEditingId(v.id);
    setVariantName(v.name);
    setVariantColorCode(v.colorCode || "#800020");
    setVariantImages(Array.isArray(v.images) ? [...v.images] : []);
    setDirectUrl("");
    setErrorMsg("");
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedName = variantName.trim();
    if (!trimmedName) {
      setErrorMsg("Please enter a colorway name (e.g. Royal Wine Maroon).");
      return;
    }

    const currentId = editingId || `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newVariant: ColorVariant = {
      id: currentId,
      name: trimmedName,
      colorCode: variantColorCode || "#1A1A1A",
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
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove the "${name}" colorway variant?`)) {
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

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-black stroke-[2]" />
            <h4 className="text-xs font-heading font-black text-black uppercase tracking-wider">
              Colorway Variants ({variants.length})
            </h4>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
            Add multiple color choices. Customers can click color swatches on the live store to switch photos.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={startCreate}
            className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-heading font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Colorway</span>
          </button>
        )}
      </div>

      {/* Editor Card */}
      {isEditing && (
        <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-black space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <span className="text-xs font-heading font-black text-black uppercase tracking-wider flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-neutral-300 shadow-xs inline-block"
                style={{ backgroundColor: variantColorCode }}
              />
              {editingId ? "Edit Colorway" : "Create New Colorway"}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-neutral-500 hover:text-black p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Colorway Name & Hex Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-heading font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Color Name *
              </label>
              <input
                type="text"
                value={variantName}
                onChange={(e) => {
                  setVariantName(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="e.g. Royal Wine Maroon, Emerald Green"
                className="w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3 py-2 text-xs text-black font-medium outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Color Swatch / Hex Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={variantColorCode}
                  onChange={(e) => setVariantColorCode(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-xl border-2 border-neutral-300 bg-white cursor-pointer"
                />
                <input
                  type="text"
                  value={variantColorCode}
                  onChange={(e) => setVariantColorCode(e.target.value)}
                  placeholder="#800020"
                  className="flex-1 bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3 py-2 text-xs text-black font-mono font-bold outline-none transition-colors uppercase"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-[10px] font-heading font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              Quick Jaipuri Palette Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {JAIPUR_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => {
                    setVariantColorCode(preset.code);
                    if (!variantName.trim()) {
                      setVariantName(preset.name);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                    variantColorCode.toLowerCase() === preset.code.toLowerCase()
                      ? "border-black bg-white shadow-xs font-bold text-black"
                      : "border-neutral-200 bg-white hover:border-neutral-400 text-neutral-700"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block shrink-0"
                    style={{ backgroundColor: preset.code }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colorway Photos */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-heading font-bold text-neutral-700 uppercase tracking-wider">
                Photos for this Colorway ({variantImages.length})
              </label>
              <span className="text-[10px] text-neutral-500 font-medium">
                When customers select this color, these photos will display on the storefront.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Drop / Upload */}
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
                className="sm:col-span-2 border-2 border-dashed border-neutral-300 hover:border-black rounded-xl p-3 flex items-center justify-center gap-2 bg-white cursor-pointer transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Upload className="w-4 h-4 text-black stroke-[2]" />
                )}
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-black">
                  {isUploading ? "Uploading photos..." : "Upload Colorway Photos"}
                </span>
              </div>

              {/* URL Input */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-2.5 py-1.5 text-xs text-black outline-none"
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
                  Add
                </button>
              </div>
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
                      alt={`Colorway photo ${i + 1}`}
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-red-600 animate-fade-in">{errorMsg}</p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border-2 border-neutral-200 hover:border-black rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{editingId ? "Update Colorway" : "Save Colorway"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Existing Variants List */}
      {variants.length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
          <p className="text-xs font-medium text-neutral-500">
            No color variants created yet. Click "+ Add Colorway" above to define colors for this style.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {variants.map((v) => (
            <div
              key={v.id}
              className="p-3.5 rounded-xl border-2 border-neutral-200 hover:border-black bg-white transition-all shadow-xs flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-6 h-6 rounded-full border-2 border-white ring-2 ring-neutral-300 shadow-xs shrink-0"
                    style={{ backgroundColor: v.colorCode || "#1A1A1A" }}
                  />
                  <div>
                    <h5 className="font-heading font-bold text-xs text-black leading-tight">
                      {v.name}
                    </h5>
                    <span className="font-mono text-[10px] text-neutral-400 font-semibold uppercase">
                      {v.colorCode || "#1A1A1A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(v)}
                    className="p-1 text-neutral-400 hover:text-black rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Edit colorway"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id, v.name)}
                    className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete colorway"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Photos Count & Mini Thumbnails */}
              <div className="pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between text-[10px] text-neutral-500 font-medium mb-1.5">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>{v.images?.length || 0} Photos</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(v)}
                    className="text-neutral-800 hover:underline font-bold"
                  >
                    Manage Photos →
                  </button>
                </div>

                {v.images && v.images.length > 0 ? (
                  <div className="flex items-center gap-1 overflow-hidden">
                    {v.images.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded border border-neutral-200 overflow-hidden shrink-0 bg-neutral-50"
                      >
                        <img
                          src={img}
                          alt={`${v.name} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {v.images.length > 4 && (
                      <span className="text-[10px] font-bold text-neutral-400 pl-1">
                        +{v.images.length - 4}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-neutral-400 italic">No photos attached to this color yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
