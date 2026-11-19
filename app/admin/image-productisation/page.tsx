'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Layers,
  FolderPlus,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowLeft,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Edit2,
  Plus,
  Maximize2,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  Filter,
  ArrowRight,
  FolderSymlink,
  Split,
  Merge,
  Sparkles,
  Save,
  Check,
  ShieldAlert,
  Loader2,
  Boxes,
  HelpCircle
} from 'lucide-react';

interface VariantSubset {
  id: string;
  name: string;
  colorCode?: string;
  images: string[];
}

interface ProductGroup {
  id: string;
  name: string;
  categoryId: string;
  generalImages: string[];
  variants: VariantSubset[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryState {
  categoryId: string;
  categoryName: string;
  status: 'not_started' | 'in_progress' | 'completed';
  approvedExclusions?: string[];
  lastUpdated: string;
}

interface CategoryDef {
  id: string;
  name: string;
  folder: string;
}

interface ImageItem {
  filename: string;
  url: string;
  categoryId: string;
  categoryName: string;
}

export default function ImageProductisationPage({ onBack }: { onBack?: () => void } = {}) {
  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [categories, setCategories] = useState<CategoryDef[]>([]);
  const [imagesByCategory, setImagesByCategory] = useState<Record<string, ImageItem[]>>({});
  const [groups, setGroups] = useState<ProductGroup[]>([]);
  const [categoriesState, setCategoriesState] = useState<Record<string, CategoryState>>({});
  
  // Active Category
  const [activeCatId, setActiveCatId] = useState<string>('traditional-gowns');

  // Image Pool Filters & Selection
  const [poolFilter, setPoolFilter] = useState<'all' | 'unproductised' | 'productised' | 'variant'>('all');
  const [poolSearch, setPoolSearch] = useState('');
  const [poolSort, setPoolSort] = useState<'name_asc' | 'name_desc' | 'unproductised_first'>('unproductised_first');
  const [selectedImageUrls, setSelectedImageUrls] = useState<Set<string>>(new Set());
  const [poolPage, setPoolPage] = useState<number>(1);
  const [poolPageSize, setPoolPageSize] = useState<number>(48);
  const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(new Set());

  // Groups Pane Filter & Expanded state
  const [groupSearch, setGroupSearch] = useState('');
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set());

  // Lightbox Preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Review & Finalisation Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [approvedExclusionChecked, setApprovedExclusionChecked] = useState(false);

  // Merge / Split Modals
  const [mergeSourceGroupId, setMergeSourceGroupId] = useState<string | null>(null);
  const [mergeTargetGroupId, setMergeTargetGroupId] = useState<string>('');

  // Undo History Stack
  const [history, setHistory] = useState<{ groups: ProductGroup[]; categoriesState: Record<string, CategoryState> }[]>([]);

  // Push state to undo stack before modifications
  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-15), { groups: JSON.parse(JSON.stringify(groups)), categoriesState: JSON.parse(JSON.stringify(categoriesState)) }]);
  }, [groups, categoriesState]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setGroups(previous.groups);
    setCategoriesState(previous.categoriesState);
    setHistory((prev) => prev.slice(0, -1));
    triggerAutoSave(previous.groups, previous.categoriesState);
  };

  const LOCAL_STORAGE_KEY = 'wastram_image_productisation_v1';

  // Fetch initial data with instant localStorage hydration
  const fetchData = async () => {
    setLoading(true);
    let localStore: { groups: ProductGroup[]; categoriesState: Record<string, CategoryState>; updatedAt?: string } | null = null;
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.groups)) {
            localStore = parsed;
            // Pre-populate UI immediately from local storage so user never sees a flash of empty groups on refresh
            setGroups(parsed.groups);
            if (parsed.categoriesState) setCategoriesState(parsed.categoriesState);
          }
        }
      }
    } catch (_) {}

    try {
      const res = await fetch('/api/admin/image-productisation');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        setImagesByCategory(data.imagesByCategory || {});

        const serverGroups = Array.isArray(data.groups) ? data.groups : [];
        const localGroups = localStore && Array.isArray(localStore.groups) ? localStore.groups : [];

        if (serverGroups.length > 0) {
          const serverTime = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;
          const localTime = localStore?.updatedAt ? new Date(localStore.updatedAt).getTime() : 0;

          if (localGroups.length > 0 && localTime > serverTime + 1000) {
            setGroups(localGroups);
            if (localStore?.categoriesState) setCategoriesState(localStore.categoriesState);
            triggerAutoSave(localGroups, localStore?.categoriesState || {}, true);
          } else {
            setGroups(serverGroups);
            setCategoriesState(data.categoriesState || {});
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                groups: serverGroups,
                categoriesState: data.categoriesState || {},
                updatedAt: data.updatedAt || new Date().toISOString()
              }));
            } catch (_) {}
          }
        } else if (localGroups.length > 0) {
          setGroups(localGroups);
          if (localStore?.categoriesState) setCategoriesState(localStore.categoriesState);
          triggerAutoSave(localGroups, localStore?.categoriesState || {}, true);
        } else {
          setGroups([]);
          setCategoriesState(data.categoriesState || {});
        }

        if (data.categories && data.categories.length > 0 && !data.categories.some((c: any) => c.id === activeCatId)) {
          setActiveCatId(data.categories[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching image productisation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-save logic (Immediate localStorage + Debounced Cloud Firestore save)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerAutoSave = useCallback((updatedGroups: ProductGroup[], updatedCatState: Record<string, CategoryState>, immediate = false) => {
    const timestamp = new Date().toISOString();

    // 1. Synchronously persist to browser localStorage immediately (0ms delay)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          groups: updatedGroups,
          categoriesState: updatedCatState,
          updatedAt: timestamp
        }));
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    // 2. Debounced save to Firestore Cloud Database
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    const executeCloudSave = async () => {
      setSaving(true);
      try {
        const res = await fetch('/api/admin/image-productisation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save',
            groups: updatedGroups,
            categoriesState: updatedCatState
          })
        });
        if (res.ok) {
          setSaveSuccessToast(true);
          setTimeout(() => setSaveSuccessToast(false), 2000);
        }
      } catch (e) {
        console.error('Cloud auto-save failed:', e);
      } finally {
        setSaving(false);
      }
    };

    if (immediate) {
      executeCloudSave();
    } else {
      saveTimeoutRef.current = setTimeout(executeCloudSave, 600);
    }
  }, []);

  const handleForceSave = () => {
    triggerAutoSave(groups, categoriesState, true);
  };

  // Safe beforeunload handler to flush state on tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          groups,
          categoriesState,
          updatedAt: new Date().toISOString()
        }));
      } catch (_) {}
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [groups, categoriesState]);

  // Update groups helper with auto-save & history
  const updateGroupsAndSave = (updater: (prev: ProductGroup[]) => ProductGroup[]) => {
    pushHistory();
    setGroups((prev) => {
      const next = updater(prev);
      // Auto-update category status to in_progress if not completed
      const nextCatState = { ...categoriesState };
      if (nextCatState[activeCatId] && nextCatState[activeCatId].status === 'not_started') {
        nextCatState[activeCatId].status = 'in_progress';
        setCategoriesState(nextCatState);
      }
      triggerAutoSave(next, nextCatState);
      return next;
    });
  };

  // Current category images
  const currentCategoryImages = useMemo(() => {
    return imagesByCategory[activeCatId] || [];
  }, [imagesByCategory, activeCatId]);

  // Current category groups
  const currentCategoryGroups = useMemo(() => {
    return groups.filter((g) => g.categoryId === activeCatId);
  }, [groups, activeCatId]);

  // Map image URL to its assignment state
  const imageAssignmentMap = useMemo(() => {
    const map = new Map<string, {
      state: 'unproductised' | 'productised' | 'variant';
      groupId?: string;
      groupName?: string;
      variantId?: string;
      variantName?: string;
    }>();

    for (const g of currentCategoryGroups) {
      for (const url of g.generalImages) {
        map.set(url, {
          state: 'productised',
          groupId: g.id,
          groupName: g.name
        });
      }
      for (const v of g.variants) {
        for (const url of v.images) {
          map.set(url, {
            state: 'variant',
            groupId: g.id,
            groupName: g.name,
            variantId: v.id,
            variantName: v.name
          });
        }
      }
    }

    return map;
  }, [currentCategoryGroups]);

  // Real-time statistics for active category
  const activeStats = useMemo(() => {
    const total = currentCategoryImages.length;
    let productised = 0;
    let variantAssigned = 0;
    let unproductised = 0;

    for (const img of currentCategoryImages) {
      const assignment = imageAssignmentMap.get(img.url);
      if (!assignment) {
        unproductised++;
      } else if (assignment.state === 'productised') {
        productised++;
      } else if (assignment.state === 'variant') {
        variantAssigned++;
      }
    }

    let totalVariantSubsets = 0;
    for (const g of currentCategoryGroups) {
      totalVariantSubsets += (g.variants || []).length;
    }

    return {
      total,
      unproductised,
      productised,
      variantAssigned,
      totalGroups: currentCategoryGroups.length,
      totalVariantSubsets,
      percentDone: total > 0 ? Math.round(((productised + variantAssigned) / total) * 100) : 0
    };
  }, [currentCategoryImages, imageAssignmentMap, currentCategoryGroups]);

  // Sitewide statistics
  const sitewideStats = useMemo(() => {
    let grandTotalImages = 0;
    for (const list of Object.values(imagesByCategory)) {
      grandTotalImages += list.length;
    }

    let totalGroupedImages = 0;
    let totalVariants = 0;

    for (const g of groups) {
      totalGroupedImages += g.generalImages.length;
      for (const v of g.variants) {
        totalGroupedImages += v.images.length;
        totalVariants++;
      }
    }

    return {
      grandTotalImages,
      totalGroupedImages,
      totalUnproductised: Math.max(0, grandTotalImages - totalGroupedImages),
      totalGroups: groups.length,
      totalVariants
    };
  }, [imagesByCategory, groups]);

  // Filtered & Sorted Images for Pool
  const filteredPoolImages = useMemo(() => {
    let list = currentCategoryImages;

    // Filter by state
    if (poolFilter === 'unproductised') {
      list = list.filter((img) => !imageAssignmentMap.has(img.url));
    } else if (poolFilter === 'productised') {
      list = list.filter((img) => imageAssignmentMap.get(img.url)?.state === 'productised');
    } else if (poolFilter === 'variant') {
      list = list.filter((img) => imageAssignmentMap.get(img.url)?.state === 'variant');
    }

    // Filter by search
    if (poolSearch.trim()) {
      const q = poolSearch.toLowerCase().trim();
      list = list.filter((img) => img.filename.toLowerCase().includes(q));
    }

    // Sort
    const sorted = [...list];
    if (poolSort === 'name_asc') {
      sorted.sort((a, b) => a.filename.localeCompare(b.filename));
    } else if (poolSort === 'name_desc') {
      sorted.sort((a, b) => b.filename.localeCompare(a.filename));
    } else if (poolSort === 'unproductised_first') {
      sorted.sort((a, b) => {
        const aAssigned = imageAssignmentMap.has(a.url);
        const bAssigned = imageAssignmentMap.has(b.url);
        if (!aAssigned && bAssigned) return -1;
        if (aAssigned && !bAssigned) return 1;
        return a.filename.localeCompare(b.filename);
      });
    }

    return sorted;
  }, [currentCategoryImages, poolFilter, poolSearch, poolSort, imageAssignmentMap]);

  // Reset pool page on filter/category changes
  useEffect(() => {
    setPoolPage(1);
  }, [activeCatId, poolFilter, poolSearch, poolSort, poolPageSize]);

  // Paginated Pool Images
  const totalPoolPages = poolPageSize === 0 ? 1 : Math.max(1, Math.ceil(filteredPoolImages.length / poolPageSize));
  const paginatedPoolImages = useMemo(() => {
    if (poolPageSize === 0) return filteredPoolImages;
    const start = (poolPage - 1) * poolPageSize;
    return filteredPoolImages.slice(start, start + poolPageSize);
  }, [filteredPoolImages, poolPage, poolPageSize]);

  // Filtered Groups
  const filteredGroups = useMemo(() => {
    if (!groupSearch.trim()) return currentCategoryGroups;
    const q = groupSearch.toLowerCase().trim();
    return currentCategoryGroups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.variants.some((v) => v.name.toLowerCase().includes(q))
    );
  }, [currentCategoryGroups, groupSearch]);

  // Selection handlers
  const handleToggleSelectImage = (url: string) => {
    setSelectedImageUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    setSelectedImageUrls(new Set(filteredPoolImages.map((img) => img.url)));
  };

  const handleClearSelection = () => {
    setSelectedImageUrls(new Set());
  };

  const handleInvertSelection = () => {
    setSelectedImageUrls((prev) => {
      const next = new Set<string>();
      for (const img of filteredPoolImages) {
        if (!prev.has(img.url)) next.add(img.url);
      }
      return next;
    });
  };

  // WORKFLOW ACTION 1: Create New Product Group from Selection
  const handleCreateGroupFromSelection = () => {
    const urls = Array.from(selectedImageUrls);
    if (urls.length === 0) {
      alert('Please select at least 1 image to create a product group.');
      return;
    }

    const nextIndex = currentCategoryGroups.length + 1;
    const paddedIndex = String(nextIndex).padStart(3, '0');
    const newGroupId = `pg-${activeCatId.slice(0, 4)}-${Date.now().toString().slice(-4)}`;
    const newGroupName = `Product Group ${paddedIndex}`;

    // Remove selected images from any previous groups first
    updateGroupsAndSave((prev) => {
      const cleaned = prev.map((g) => {
        if (g.categoryId !== activeCatId) return g;
        return {
          ...g,
          generalImages: g.generalImages.filter((u) => !selectedImageUrls.has(u)),
          variants: g.variants.map((v) => ({
            ...v,
            images: v.images.filter((u) => !selectedImageUrls.has(u))
          }))
        };
      });

      const newGroup: ProductGroup = {
        id: newGroupId,
        name: newGroupName,
        categoryId: activeCatId,
        generalImages: urls,
        variants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return [newGroup, ...cleaned];
    });

    // Expand new group and clear selection
    setExpandedGroupIds((prev) => new Set([...prev, newGroupId]));
    setSelectedImageUrls(new Set());
  };

  // WORKFLOW ACTION 2: Add Selected Images to an Existing Group
  const handleAddSelectionToGroup = (targetGroupId: string) => {
    if (!targetGroupId) return;
    const urls = Array.from(selectedImageUrls);
    if (urls.length === 0) return;

    updateGroupsAndSave((prev) => {
      return prev.map((g) => {
        if (g.id === targetGroupId) {
          const combined = Array.from(new Set([...g.generalImages, ...urls]));
          return { ...g, generalImages: combined, updatedAt: new Date().toISOString() };
        }
        // Remove from other groups
        return {
          ...g,
          generalImages: g.generalImages.filter((u) => !selectedImageUrls.has(u)),
          variants: g.variants.map((v) => ({
            ...v,
            images: v.images.filter((u) => !selectedImageUrls.has(u))
          }))
        };
      });
    });

    setExpandedGroupIds((prev) => new Set([...prev, targetGroupId]));
    setSelectedImageUrls(new Set());
  };

  // Group Management Actions
  const handleRenameGroup = (groupId: string, newName: string) => {
    if (!newName.trim()) return;
    updateGroupsAndSave((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName.trim(), updatedAt: new Date().toISOString() } : g))
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this product group? All images will return to the unproductised image pool.'
      )
    )
      return;
    updateGroupsAndSave((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleRemoveImageFromGroup = (groupId: string, url: string) => {
    updateGroupsAndSave((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          generalImages: g.generalImages.filter((u) => u !== url),
          variants: g.variants.map((v) => ({
            ...v,
            images: v.images.filter((u) => u !== url)
          })),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Variant Subset Actions
  const handleAddVariantSubset = (groupId: string) => {
    const targetGroup = groups.find((g) => g.id === groupId);
    if (!targetGroup) return;
    const vIndex = (targetGroup.variants || []).length + 1;
    const newVariant: VariantSubset = {
      id: `var-${Date.now().toString().slice(-4)}-${vIndex}`,
      name: `Variant ${String.fromCharCode(64 + vIndex)}`,
      colorCode: '#1A1A1A',
      images: []
    };

    updateGroupsAndSave((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          variants: [...g.variants, newVariant],
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const handleRenameVariant = (groupId: string, variantId: string, newName: string) => {
    if (!newName.trim()) return;
    updateGroupsAndSave((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          variants: g.variants.map((v) => (v.id === variantId ? { ...v, name: newName.trim() } : v)),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const handleDeleteVariant = (groupId: string, variantId: string) => {
    updateGroupsAndSave((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const targetV = g.variants.find((v) => v.id === variantId);
        const imagesToRestore = targetV ? targetV.images : [];
        return {
          ...g,
          generalImages: Array.from(new Set([...g.generalImages, ...imagesToRestore])),
          variants: g.variants.filter((v) => v.id !== variantId),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const handleMoveImageToVariant = (groupId: string, url: string, targetVariantId: string) => {
    updateGroupsAndSave((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        // Remove from general images & all variants
        const nextGeneral = g.generalImages.filter((u) => u !== url);
        const nextVariants = g.variants.map((v) => {
          if (v.id === targetVariantId) {
            return { ...v, images: Array.from(new Set([...v.images, url])) };
          }
          return { ...v, images: v.images.filter((u) => u !== url) };
        });
        return { ...g, generalImages: nextGeneral, variants: nextVariants, updatedAt: new Date().toISOString() };
      })
    );
  };

  const handleMoveImageToGeneral = (groupId: string, url: string) => {
    updateGroupsAndSave((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const nextGeneral = Array.from(new Set([...g.generalImages, url]));
        const nextVariants = g.variants.map((v) => ({
          ...v,
          images: v.images.filter((u) => u !== url)
        }));
        return { ...g, generalImages: nextGeneral, variants: nextVariants, updatedAt: new Date().toISOString() };
      })
    );
  };

  // Merge Groups
  const handleConfirmMergeGroups = () => {
    if (!mergeSourceGroupId || !mergeTargetGroupId || mergeSourceGroupId === mergeTargetGroupId) {
      alert('Please select a valid target group to merge into.');
      return;
    }

    const source = groups.find((g) => g.id === mergeSourceGroupId);
    const target = groups.find((g) => g.id === mergeTargetGroupId);
    if (!source || !target) return;

    updateGroupsAndSave((prev) => {
      return prev
        .filter((g) => g.id !== mergeSourceGroupId)
        .map((g) => {
          if (g.id !== mergeTargetGroupId) return g;
          return {
            ...g,
            generalImages: Array.from(new Set([...g.generalImages, ...source.generalImages])),
            variants: [...g.variants, ...source.variants],
            updatedAt: new Date().toISOString()
          };
        });
    });

    setMergeSourceGroupId(null);
    setMergeTargetGroupId('');
  };

  // Category Completion Status Toggle
  const handleToggleCategoryStatus = (newStatus: 'not_started' | 'in_progress' | 'completed') => {
    if (newStatus === 'completed' && activeStats.unproductised > 0 && !approvedExclusionChecked) {
      alert(
        `Cannot mark category as completed while ${activeStats.unproductised} images remain unproductised. Please organize them or approve them in the Review modal as intentionally excluded.`
      );
      return;
    }

    const updatedState = {
      ...categoriesState,
      [activeCatId]: {
        categoryId: activeCatId,
        categoryName: categories.find((c) => c.id === activeCatId)?.name || activeCatId,
        status: newStatus,
        approvedExclusions: newStatus === 'completed' ? Array.from(selectedImageUrls) : [],
        lastUpdated: new Date().toISOString()
      }
    };
    setCategoriesState(updatedState);
    triggerAutoSave(groups, updatedState);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        groups,
        categoriesState
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wastram-image-productisation-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.groups || !Array.isArray(json.groups)) {
          alert('Invalid backup file format.');
          return;
        }
        if (confirm('Importing will replace your current groupings with this backup. Continue?')) {
          setGroups(json.groups);
          if (json.categoriesState) setCategoriesState(json.categoriesState);
          triggerAutoSave(json.groups, json.categoriesState || {});
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-[#0B2D7F] text-white flex items-center justify-center animate-spin mb-4 shadow-lg">
          <Loader2 className="w-6 h-6" />
        </div>
        <h2 className="text-base font-heading font-black text-black uppercase tracking-wider">
          Loading Image Productisation Workspace...
        </h2>
        <p className="text-xs text-neutral-500 mt-1">Scanning photo pool across all categories...</p>
      </div>
    );
  }

  const activeCatMeta = categories.find((c) => c.id === activeCatId) || {
    id: activeCatId,
    name: 'Selected Category',
    folder: activeCatId
  };
  const activeCatState = categoriesState[activeCatId] || {
    categoryId: activeCatId,
    categoryName: activeCatMeta.name,
    status: 'not_started',
    lastUpdated: ''
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* ─── TOP STATUS NOTIFICATION BAR ─── */}
      {saveSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-heading font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          <span>Image groupings saved to database</span>
        </div>
      )}

      {/* ─── HEADER BAR ─── */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-2 border border-neutral-200 hover:border-black rounded-xl text-neutral-600 hover:text-black transition-colors"
                title="Return to Admin Console"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/admin"
                className="p-2 border border-neutral-200 hover:border-black rounded-xl text-neutral-600 hover:text-black transition-colors"
                title="Return to Admin Console"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#0B2D7F]/10 text-[#0B2D7F] text-[10px] font-heading font-black uppercase tracking-wider">
                  <ImageIcon className="w-3 h-3" />
                  Classification Workspace
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Manual Photo Grouping & Variant Subsets
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-heading font-black text-black tracking-tight leading-tight">
                Image Productisation Workspace
              </h1>
            </div>
          </div>

          {/* Action buttons & Backup */}
          <div className="flex items-center gap-2">
            {saving ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span className="hidden sm:inline">Saving to Cloud...</span>
                <span className="sm:hidden">Saving...</span>
              </div>
            ) : saveSuccessToast ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span className="hidden sm:inline">Saved to Cloud</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleForceSave}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Save workspace immediately to Cloud Firestore and Local Storage"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Workspace</span>
              </button>
            )}

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleUndo}
                className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-black text-black text-xs font-heading font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                title="Undo last action"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-black text-black text-xs font-heading font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              title="Download full JSON snapshot backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backup JSON</span>
            </button>

            <label className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-black text-black text-xs font-heading font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restore</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-1.5 bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs font-heading font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              <span>Review Category</span>
            </button>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="border-t border-neutral-200 bg-neutral-50/80 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-[1720px] mx-auto flex items-center gap-2 py-2">
            {categories.map((cat) => {
              const catImages = imagesByCategory[cat.id] || [];
              const catGroups = groups.filter((g) => g.categoryId === cat.id);
              let groupedImgs = 0;
              for (const g of catGroups) {
                groupedImgs += g.generalImages.length;
                for (const v of g.variants) groupedImgs += v.images.length;
              }
              const st = categoriesState[cat.id]?.status || 'not_started';
              const isActive = cat.id === activeCatId;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCatId(cat.id);
                    setSelectedImageUrls(new Set());
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-white text-black border-black shadow-xs ring-1 ring-black'
                      : 'bg-white/60 text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:bg-white'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      st === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : groupedImgs > 0
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {groupedImgs}/{catImages.length}
                  </span>
                  {st === 'completed' && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ─── METRICS DASHBOARD ─── */}
      <section className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4">
        <div className="max-w-[1720px] mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-heading font-black text-black uppercase tracking-wider">
                {activeCatMeta.name} Progress
              </span>
              <span
                className={`text-[11px] font-heading font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                  activeCatState.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeCatState.status === 'in_progress'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {activeCatState.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                {activeCatState.status === 'in_progress' && <Sparkles className="w-3 h-3 text-amber-600" />}
                {activeCatState.status === 'completed'
                  ? 'Completed'
                  : activeCatState.status === 'in_progress'
                  ? 'In Progress'
                  : 'Not Started'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span>Sitewide: {sitewideStats.totalGroupedImages} of {sitewideStats.grandTotalImages} photos classified</span>
              <span>•</span>
              <span>{sitewideStats.totalGroups} groups across all categories</span>
            </div>
          </div>

          {/* 6 Real-Time Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <span className="text-[10px] font-heading font-bold text-neutral-500 uppercase tracking-wider block">
                Total Available Photos
              </span>
              <span className="text-xl font-heading font-black text-black">{activeStats.total}</span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="text-[10px] font-heading font-bold text-amber-800 uppercase tracking-wider block">
                Unproductised Photos
              </span>
              <span className="text-xl font-heading font-black text-amber-900">{activeStats.unproductised}</span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="text-[10px] font-heading font-bold text-blue-800 uppercase tracking-wider block">
                Main Product Photos
              </span>
              <span className="text-xl font-heading font-black text-[#0B2D7F]">{activeStats.productised}</span>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
              <span className="text-[10px] font-heading font-bold text-purple-800 uppercase tracking-wider block">
                Variant Subsets Photos
              </span>
              <span className="text-xl font-heading font-black text-purple-900">{activeStats.variantAssigned}</span>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-heading font-bold text-emerald-800 uppercase tracking-wider block">
                Product Groups Created
              </span>
              <span className="text-xl font-heading font-black text-emerald-900">{activeStats.totalGroups}</span>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
              <span className="text-[10px] font-heading font-bold text-indigo-800 uppercase tracking-wider block">
                Variant Subsets Created
              </span>
              <span className="text-xl font-heading font-black text-indigo-900">{activeStats.totalVariantSubsets}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0B2D7F] h-full transition-all duration-300"
              style={{ width: `${activeStats.percentDone}%` }}
            />
          </div>
        </div>
      </section>

      {/* ─── DUAL WORKSPACE LAYOUT (IMAGE POOL vs. PRODUCT GROUPS) ─── */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ═══════════════════════════════════════════════════════════════════
            LEFT / MAIN PANE: AVAILABLE IMAGE POOL (col-span-7)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div>
              <h2 className="text-sm font-heading font-black text-black uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#0B2D7F]" />
                <span>Available Image Pool</span>
                <span className="text-xs font-mono font-bold text-neutral-500">
                  ({filteredPoolImages.length} visible)
                </span>
              </h2>
              <p className="text-[11px] text-neutral-500">
                Multi-select images below to create a new product group or append to an existing one.
              </p>
            </div>

            {/* Selection Counters & Clear */}
            {selectedImageUrls.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading font-black bg-[#0B2D7F] text-white px-3 py-1 rounded-lg">
                  {selectedImageUrls.size} Selected
                </span>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-xs text-neutral-500 hover:text-black underline font-semibold"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Action Toolbars (Search, Filter, Sort) */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Pool State Filter */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-heading font-bold">
                <button
                  type="button"
                  onClick={() => setPoolFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    poolFilter === 'all' ? 'bg-white text-black shadow-xs' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  All ({currentCategoryImages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPoolFilter('unproductised')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    poolFilter === 'unproductised'
                      ? 'bg-amber-100 text-amber-900 shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  Unproductised ({activeStats.unproductised})
                </button>
                <button
                  type="button"
                  onClick={() => setPoolFilter('productised')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    poolFilter === 'productised'
                      ? 'bg-blue-100 text-blue-900 shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  Main ({activeStats.productised})
                </button>
                <button
                  type="button"
                  onClick={() => setPoolFilter('variant')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    poolFilter === 'variant'
                      ? 'bg-purple-100 text-purple-900 shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  Variant ({activeStats.variantAssigned})
                </button>
              </div>

              {/* Selection Shortcuts */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const pageItems = poolPageSize === 0 ? filteredPoolImages : paginatedPoolImages;
                    setSelectedImageUrls((prev) => {
                      const next = new Set(prev);
                      pageItems.forEach((img) => next.add(img.url));
                      return next;
                    });
                  }}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 font-semibold cursor-pointer"
                  title="Select all images on current page"
                >
                  Select Page
                </button>
                <button
                  type="button"
                  onClick={handleSelectAllVisible}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 font-semibold cursor-pointer"
                  title="Select all filtered images in this category"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleInvertSelection}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 font-semibold cursor-pointer"
                >
                  Invert
                </button>
                {selectedImageUrls.size > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-800 font-bold cursor-pointer"
                  >
                    Clear ({selectedImageUrls.size})
                  </button>
                )}
              </div>
            </div>

            {/* Search & Sort Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search image filename..."
                  value={poolSearch}
                  onChange={(e) => setPoolSearch(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-black rounded-xl pl-8 pr-3 py-1.5 text-xs text-black font-medium outline-none"
                />
              </div>

              <select
                value={poolSort}
                onChange={(e: any) => setPoolSort(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-black outline-none cursor-pointer"
              >
                <option value="unproductised_first">Sort: Unproductised First</option>
                <option value="name_asc">Sort: Filename A-Z</option>
                <option value="name_desc">Sort: Filename Z-A</option>
              </select>
            </div>
          </div>

          {/* Floating / Anchored Selection Action Bar */}
          {selectedImageUrls.size > 0 && (
            <div className="p-3 bg-blue-50 border-2 border-[#0B2D7F] rounded-xl flex flex-wrap items-center justify-between gap-2.5 animate-scale-up">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0B2D7F]" />
                <span className="text-xs font-heading font-black text-[#0B2D7F]">
                  {selectedImageUrls.size} images selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCreateGroupFromSelection}
                  className="px-3.5 py-1.5 bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs font-heading font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create New Product Group</span>
                </button>

                {currentCategoryGroups.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddSelectionToGroup(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="bg-white border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-heading font-bold text-black outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      + Add to Existing Group...
                    </option>
                    {currentCategoryGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.generalImages.length} imgs)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          {/* Thumbnail Grid */}
          {filteredPoolImages.length === 0 ? (
            <div className="p-12 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
              <ImageIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-xs font-heading font-bold text-neutral-600">No images match current filter/search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[640px] overflow-y-auto pr-1">
                {paginatedPoolImages.map((img) => {
                  const isSelected = selectedImageUrls.has(img.url);
                  const assignment = imageAssignmentMap.get(img.url);
                  const isBroken = failedImageUrls.has(img.url);

                  return (
                    <div
                      key={img.url}
                      onClick={() => handleToggleSelectImage(img.url)}
                      className={`group relative rounded-xl border-2 overflow-hidden transition-all cursor-pointer bg-neutral-100 flex flex-col ${
                        isSelected
                          ? 'border-[#0B2D7F] ring-2 ring-[#0B2D7F]/30 shadow-md'
                          : assignment?.state === 'productised'
                          ? 'border-blue-300'
                          : assignment?.state === 'variant'
                          ? 'border-purple-300'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="aspect-square relative bg-neutral-200/60 overflow-hidden flex items-center justify-center">
                        {isBroken ? (
                          <div className="p-3 text-center flex flex-col items-center justify-center gap-1.5 w-full h-full bg-neutral-50 text-neutral-400">
                            <ImageIcon className="w-6 h-6 opacity-60" />
                            <span className="text-[9px] font-mono text-neutral-500 break-all line-clamp-2 px-1">
                              {img.filename}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFailedImageUrls((prev) => {
                                  const next = new Set(prev);
                                  next.delete(img.url);
                                  return next;
                                });
                              }}
                              className="px-2 py-0.5 text-[9px] font-bold text-[#0B2D7F] hover:underline bg-white border border-neutral-200 rounded shadow-2xs"
                            >
                              Retry
                            </button>
                          </div>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={encodeURI(img.url)}
                            alt={img.filename}
                            loading="lazy"
                            onError={() => {
                              setFailedImageUrls((prev) => new Set(prev).add(img.url));
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-[#0B2D7F] text-white shadow-xs' : 'bg-white/80 border border-neutral-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Zoom Preview Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(img.url);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white hover:bg-black transition-colors opacity-0 group-hover:opacity-100"
                          title="Full-size Preview"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        {/* State Pill */}
                        <div className="absolute bottom-2 left-2 right-2">
                          {assignment?.state === 'productised' ? (
                            <span className="block truncate px-1.5 py-0.5 rounded-md bg-blue-600/90 text-white text-[9px] font-heading font-black uppercase tracking-wider text-center shadow-xs">
                              {assignment.groupName || 'Grouped'}
                            </span>
                          ) : assignment?.state === 'variant' ? (
                            <span className="block truncate px-1.5 py-0.5 rounded-md bg-purple-600/90 text-white text-[9px] font-heading font-black uppercase tracking-wider text-center shadow-xs">
                              {assignment.variantName || 'Variant'}
                            </span>
                          ) : (
                            <span className="block truncate px-1.5 py-0.5 rounded-md bg-amber-500/90 text-white text-[9px] font-heading font-black uppercase tracking-wider text-center shadow-xs">
                              Unproductised
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Filename Caption */}
                      <div className="p-2 bg-white flex-1 flex flex-col justify-center border-t border-neutral-100">
                        <span className="text-[10px] font-mono text-neutral-700 truncate block" title={img.filename}>
                          {img.filename}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Image Pool Pagination Bar ── */}
              {filteredPoolImages.length > 0 && (
                <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-neutral-600 font-medium">
                    <span>
                      Showing {poolPageSize === 0 ? 1 : Math.min((poolPage - 1) * poolPageSize + 1, filteredPoolImages.length)}–
                      {poolPageSize === 0 ? filteredPoolImages.length : Math.min(poolPage * poolPageSize, filteredPoolImages.length)} of {filteredPoolImages.length} images
                    </span>
                    <span className="text-neutral-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-neutral-500">Per page:</span>
                      <select
                        value={poolPageSize}
                        onChange={(e) => {
                          setPoolPageSize(Number(e.target.value));
                          setPoolPage(1);
                        }}
                        className="bg-white border border-neutral-200 rounded-lg px-2 py-1 text-xs font-bold text-black outline-none cursor-pointer"
                      >
                        <option value={24}>24</option>
                        <option value={48}>48 (Fast)</option>
                        <option value={96}>96</option>
                        <option value={192}>192</option>
                        <option value={0}>All ({filteredPoolImages.length})</option>
                      </select>
                    </div>
                  </div>

                  {totalPoolPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={poolPage <= 1}
                        onClick={() => setPoolPage((p) => Math.max(1, p - 1))}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer text-xs"
                      >
                        Prev
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPoolPages) }, (_, i) => {
                          let pageNum =
                            poolPage <= 3
                              ? i + 1
                              : poolPage >= totalPoolPages - 2
                              ? totalPoolPages - 4 + i
                              : poolPage - 2 + i;
                          if (pageNum < 1 || pageNum > totalPoolPages) return null;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setPoolPage(pageNum)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                                poolPage === pageNum
                                  ? 'bg-[#0B2D7F] text-white shadow-xs'
                                  : 'bg-white border border-neutral-200 text-black hover:bg-neutral-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        {totalPoolPages > 5 && poolPage < totalPoolPages - 2 && (
                          <>
                            <span className="px-1 text-neutral-400">...</span>
                            <button
                              type="button"
                              onClick={() => setPoolPage(totalPoolPages)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                                poolPage === totalPoolPages
                                  ? 'bg-[#0B2D7F] text-white shadow-xs'
                                  : 'bg-white border border-neutral-200 text-black hover:bg-neutral-50'
                              }`}
                            >
                              {totalPoolPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={poolPage >= totalPoolPages}
                        onClick={() => setPoolPage((p) => Math.min(totalPoolPages, p + 1))}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer text-xs"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            RIGHT PANE: PRODUCT GROUPS & VARIANT SUBSETS (col-span-5)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div>
              <h2 className="text-sm font-heading font-black text-black uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                <span>Product Groups ({currentCategoryGroups.length})</span>
              </h2>
              <p className="text-[11px] text-neutral-500">
                Organised collections of images representing individual products and their variant subsets.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextIndex = currentCategoryGroups.length + 1;
                const newGroupId = `pg-${activeCatId.slice(0, 4)}-${Date.now().toString().slice(-4)}`;
                const newGroup: ProductGroup = {
                  id: newGroupId,
                  name: `Product Group ${String(nextIndex).padStart(3, '0')}`,
                  categoryId: activeCatId,
                  generalImages: [],
                  variants: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                updateGroupsAndSave((prev) => [newGroup, ...prev]);
                setExpandedGroupIds((prev) => new Set([...prev, newGroupId]));
              }}
              className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Empty Group</span>
            </button>
          </div>

          {/* Group Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product groups..."
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-black rounded-xl pl-8 pr-3 py-1.5 text-xs text-black font-medium outline-none"
            />
          </div>

          {/* Groups List */}
          {filteredGroups.length === 0 ? (
            <div className="p-12 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300 space-y-2">
              <FolderPlus className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="text-xs font-heading font-bold text-neutral-700">No Product Groups Created Yet</h3>
              <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                Select images from the image pool on the left, then click &ldquo;Create New Product Group&rdquo; to start organising.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredGroups.map((group) => {
                const isExpanded = expandedGroupIds.has(group.id);
                const totalImgs =
                  group.generalImages.length +
                  group.variants.reduce((acc, v) => acc + (v.images || []).length, 0);

                return (
                  <div
                    key={group.id}
                    className="border-2 border-neutral-200 rounded-xl bg-white overflow-hidden shadow-xs hover:border-neutral-300 transition-colors"
                  >
                    {/* Group Header */}
                    <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedGroupIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(group.id)) next.delete(group.id);
                              else next.add(group.id);
                              return next;
                            });
                          }}
                          className="text-neutral-500 hover:text-black p-0.5"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        <input
                          type="text"
                          defaultValue={group.name}
                          onBlur={(e) => handleRenameGroup(group.id, e.target.value)}
                          className="font-heading font-black text-xs text-black bg-transparent border-b border-transparent hover:border-neutral-400 focus:border-black outline-none px-1 py-0.5 flex-1 min-w-0"
                          title="Click to rename group"
                        />
                      </div>

                      {/* Group Badges & Quick Action Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono font-bold bg-[#0B2D7F]/10 text-[#0B2D7F] px-2 py-0.5 rounded-md">
                          {totalImgs} photos
                        </span>

                        {group.variants.length > 0 && (
                          <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                            {group.variants.length} vars
                          </span>
                        )}

                        {/* Merge Button */}
                        <button
                          type="button"
                          onClick={() => setMergeSourceGroupId(group.id)}
                          className="p-1 text-neutral-400 hover:text-blue-600 rounded-md hover:bg-neutral-200 transition-colors"
                          title="Merge into another group"
                        >
                          <Merge className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Group */}
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded-md hover:bg-neutral-200 transition-colors"
                          title="Delete group (return images to pool)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Group Body (Expanded) */}
                    {isExpanded && (
                      <div className="p-3 space-y-3.5 bg-white">
                        {/* ─── GENERAL IMAGES SUBSECTION ─── */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-heading font-black text-neutral-500 uppercase tracking-wider">
                              Main Product Images ({group.generalImages.length})
                            </span>
                          </div>

                          {group.generalImages.length === 0 ? (
                            <p className="text-[10px] text-neutral-400 italic">No main images assigned.</p>
                          ) : (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                              {group.generalImages.map((url) => (
                                <div
                                  key={url}
                                  className="group/img relative aspect-square rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={encodeURI(url)} alt="img" className="w-full h-full object-cover" />

                                  {/* Overlay Controls */}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col justify-between p-1">
                                    <div className="flex justify-between items-center">
                                      <button
                                        type="button"
                                        onClick={() => setPreviewImage(url)}
                                        className="text-white hover:text-blue-300 p-0.5"
                                        title="Preview"
                                      >
                                        <Eye className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImageFromGroup(group.id, url)}
                                        className="text-white hover:text-red-400 p-0.5"
                                        title="Remove from group"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>

                                    {/* Move to Variant Selector */}
                                    {group.variants.length > 0 && (
                                      <select
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            handleMoveImageToVariant(group.id, url, e.target.value);
                                          }
                                        }}
                                        defaultValue=""
                                        className="bg-black/80 text-white text-[8px] font-heading font-bold rounded p-0.5 outline-none cursor-pointer"
                                      >
                                        <option value="" disabled>
                                          Move to Var...
                                        </option>
                                        {group.variants.map((v) => (
                                          <option key={v.id} value={v.id}>
                                            {v.name}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* ─── VARIANT SUBSETS SUBSECTION ─── */}
                        <div className="space-y-2.5 pt-2 border-t border-neutral-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-heading font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>Variant Subsets ({group.variants.length})</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleAddVariantSubset(group.id)}
                              className="text-[10px] font-heading font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Variant Subset</span>
                            </button>
                          </div>

                          {group.variants.length === 0 ? (
                            <p className="text-[10px] text-neutral-400 italic">
                              No variants (this product has a single uniform styling).
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {group.variants.map((v) => (
                                <div
                                  key={v.id}
                                  className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-200 space-y-2"
                                >
                                  {/* Variant Header */}
                                  <div className="flex items-center justify-between gap-2">
                                    <input
                                      type="text"
                                      defaultValue={v.name}
                                      onBlur={(e) => handleRenameVariant(group.id, v.id, e.target.value)}
                                      className="font-heading font-black text-[11px] text-purple-900 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-700 outline-none px-1 py-0.5 flex-1 min-w-0"
                                      title="Click to rename variant"
                                    />

                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[9px] font-mono text-purple-700 font-bold">
                                        {v.images.length} photos
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteVariant(group.id, v.id)}
                                        className="text-neutral-400 hover:text-red-600 p-0.5"
                                        title="Delete variant subset"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Variant Images */}
                                  {v.images.length === 0 ? (
                                    <p className="text-[9px] text-neutral-400 italic">
                                      No images in this variant subset.
                                    </p>
                                  ) : (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                                      {v.images.map((url) => (
                                        <div
                                          key={url}
                                          className="group/vimg relative aspect-square rounded-md border border-purple-200 overflow-hidden bg-white"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={encodeURI(url)} alt="vimg" className="w-full h-full object-cover" />

                                          {/* Overlay Controls */}
                                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/vimg:opacity-100 transition-opacity flex flex-col justify-between p-1">
                                            <div className="flex justify-between items-center">
                                              <button
                                                type="button"
                                                onClick={() => setPreviewImage(url)}
                                                className="text-white hover:text-blue-300 p-0.5"
                                                title="Preview"
                                              >
                                                <Eye className="w-2.5 h-2.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveImageFromGroup(group.id, url)}
                                                className="text-white hover:text-red-400 p-0.5"
                                                title="Remove"
                                              >
                                                <X className="w-2.5 h-2.5" />
                                              </button>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() => handleMoveImageToGeneral(group.id, url)}
                                              className="bg-black/80 text-white text-[7px] font-heading font-bold rounded p-0.5 text-center hover:bg-black"
                                              title="Move to Main Images"
                                            >
                                              To Main
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ─── MODAL 1: FULL-SIZE LIGHTBOX IMAGE PREVIEW ─── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-neutral-800 truncate">{previewImage}</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-neutral-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-neutral-100 flex items-center justify-center overflow-auto flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={encodeURI(previewImage)} alt="preview" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: MERGE GROUPS ─── */}
      {mergeSourceGroupId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border-2 border-black animate-scale-up">
            <h3 className="text-sm font-heading font-black text-black uppercase tracking-wider flex items-center gap-2">
              <Merge className="w-4 h-4 text-blue-600" />
              <span>Merge Product Group</span>
            </h3>
            <p className="text-xs text-neutral-600 font-medium">
              Merge &ldquo;{groups.find((g) => g.id === mergeSourceGroupId)?.name}&rdquo; into another product group in this category. All images and variants will be combined.
            </p>

            <div>
              <label className="block text-[11px] font-heading font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Select Destination Group
              </label>
              <select
                value={mergeTargetGroupId}
                onChange={(e) => setMergeTargetGroupId(e.target.value)}
                className="w-full bg-white border-2 border-neutral-200 rounded-xl px-3 py-2 text-xs font-heading font-bold text-black outline-none"
              >
                <option value="">Choose target group...</option>
                {currentCategoryGroups
                  .filter((g) => g.id !== mergeSourceGroupId)
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.generalImages.length} images)
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setMergeSourceGroupId(null)}
                className="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-heading font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMergeGroups}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-heading font-black uppercase tracking-wider"
              >
                Merge Groups
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: REVIEW & FINALISATION DRAWER / MODAL ─── */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border-2 border-black overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
              <div>
                <h3 className="text-sm font-heading font-black text-black uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Review & Finalisation: {activeCatMeta.name}</span>
                </h3>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Verify all product groups and variant allocations before marking this category as completely organised.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-neutral-400 hover:text-black p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Summary Stats Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-neutral-100 rounded-xl text-center">
                  <span className="text-[10px] font-heading font-bold text-neutral-500 uppercase block">Total Photos</span>
                  <span className="text-lg font-heading font-black text-black">{activeStats.total}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-center">
                  <span className="text-[10px] font-heading font-bold text-emerald-700 uppercase block">Product Groups</span>
                  <span className="text-lg font-heading font-black text-emerald-900">{activeStats.totalGroups}</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl text-center">
                  <span className="text-[10px] font-heading font-bold text-purple-700 uppercase block">Variant Subsets</span>
                  <span className="text-lg font-heading font-black text-purple-900">{activeStats.totalVariantSubsets}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl text-center">
                  <span className="text-[10px] font-heading font-bold text-amber-700 uppercase block">Unproductised</span>
                  <span className="text-lg font-heading font-black text-amber-900">{activeStats.unproductised}</span>
                </div>
              </div>

              {/* Warning if unproductised images remain */}
              {activeStats.unproductised > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-heading font-black uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>{activeStats.unproductised} Photos Remain Unproductised</span>
                  </div>
                  <p className="text-[11px] text-amber-900">
                    Per requirements, a category cannot be marked as completed while unproductised images remain, unless you explicitly approve them as intentionally excluded.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={approvedExclusionChecked}
                      onChange={(e) => setApprovedExclusionChecked(e.target.checked)}
                      className="w-4 h-4 text-[#0B2D7F] rounded"
                    />
                    <span className="text-xs text-amber-950 font-bold">
                      I confirm and approve the remaining {activeStats.unproductised} photos as intentionally excluded.
                    </span>
                  </label>
                </div>
              )}

              {/* Group Breakdown Table */}
              <div className="space-y-2">
                <span className="text-xs font-heading font-black text-black uppercase tracking-wider">
                  Product Group Breakdown
                </span>
                <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200">
                  {currentCategoryGroups.map((g, idx) => (
                    <div key={g.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-heading font-bold text-black block">{g.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {g.generalImages.length} main photos • {g.variants.length} variant subsets
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {g.variants.map((v) => (
                          <span
                            key={v.id}
                            className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold"
                          >
                            {v.name}: {v.images.length}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-heading font-bold text-neutral-700"
              >
                Close & Continue Organising
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleCategoryStatus('in_progress')}
                  className="px-3 py-2 border border-amber-300 bg-amber-50 text-amber-900 rounded-xl text-xs font-heading font-bold"
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleCategoryStatus('completed');
                    setReviewModalOpen(false);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Mark Category Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
