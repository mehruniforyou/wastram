export function getProductNormalizedCategoryId(product: any): string {
  if (!product) return "";
  const rawCatId = product.category_id || product.categoryId || product.category_slug || product.category || product.tab;
  if (!rawCatId || rawCatId === "none" || rawCatId === "unassigned") return "";
  if (typeof rawCatId === "object") {
    return String(rawCatId.id || rawCatId.slug || rawCatId.name || "").toLowerCase().trim();
  }
  return String(rawCatId).toLowerCase().trim();
}
