export function getProductNormalizedCategoryId(product: any): string {
  if (!product) return "";
  const rawCatId = product.category_id || product.categoryId || product.category;
  if (!rawCatId || rawCatId === "none" || rawCatId === "unassigned") return "";
  return String(rawCatId).toLowerCase().trim();
}
