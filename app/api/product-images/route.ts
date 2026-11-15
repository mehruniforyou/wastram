import { NextResponse, NextRequest } from "next/server";
import { PRODUCTS } from "@/data/products";
import { getProductOverrides, saveProductOverride } from "@/lib/productsStore";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator privileges required to manage product images." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { product_id, url, replace_url, set_featured } = body;
    if (!product_id || !url) {
      return NextResponse.json({ error: "product_id and url required" }, { status: 400 });
    }

    const cleanId = String(product_id).trim().toLowerCase();
    const overrides = await getProductOverrides();
    const existing: any = overrides[product_id] || Object.values(overrides).find(
      (o: any) => o.slug?.toLowerCase() === cleanId || o.id?.toLowerCase() === cleanId
    ) || {};

    const baseProd = PRODUCTS.find(
      (p) =>
        p.id.toLowerCase() === cleanId ||
        p.slug.toLowerCase() === cleanId ||
        (p.partNumber || (p as any).sku || "").toLowerCase() === cleanId
    );

    // Initial gallery: keep existing gallery/images, or populate from base product
    const baseGallery: string[] = (baseProd?.galleryImages || []).map((img) => img.url);
    if (Array.isArray(baseProd?.images)) {
      baseProd.images.forEach((img) => {
        if (!baseGallery.includes(img)) baseGallery.push(img);
      });
    }
    if (baseGallery.length === 0 && baseProd?.mainImage) {
      baseGallery.push(baseProd.mainImage);
    }

    let currentGallery: string[] = Array.isArray(existing.gallery) && existing.gallery.length > 0
      ? [...existing.gallery]
      : (Array.isArray(existing.images) && existing.images.length > 0 ? [...existing.images] : baseGallery);

    if (replace_url) {
      const rIdx = currentGallery.findIndex((u) => u === replace_url || u.trim() === replace_url.trim());
      if (rIdx !== -1) {
        currentGallery[rIdx] = url;
      } else {
        currentGallery.push(url);
      }
    } else {
      if (!currentGallery.includes(url)) {
        currentGallery.push(url);
      }
    }

    const targetId = existing.id || baseProd?.id || product_id;
    const targetSlug = existing.slug || baseProd?.slug || product_id;

    let newFeatured = existing.featured_image || existing.mainImage;
    if (set_featured || replace_url === existing.featured_image || !newFeatured || newFeatured === baseProd?.mainImage) {
      newFeatured = url;
    }

    const saved = await saveProductOverride(targetId, {
      ...existing,
      id: targetId,
      slug: targetSlug,
      gallery: currentGallery,
      images: currentGallery,
      featured_image: newFeatured,
      mainImage: newFeatured,
    });

    try {
      revalidatePath("/", "page");
      revalidatePath("/collections", "page");
      revalidatePath("/products", "page");
      if (targetSlug) revalidatePath(`/products/${targetSlug}`, "page");
    } catch (_) {}

    return NextResponse.json({ success: true, url, product: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator privileges required to delete product images." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const id = body.id || searchParams.get("id");
    const targetUrl = body.url || searchParams.get("url");
    const productId = body.product_id || searchParams.get("product_id") || body.slug || searchParams.get("slug");

    if (productId) {
      const cleanId = String(productId).trim().toLowerCase();
      const overrides = await getProductOverrides();
      const existing: any = overrides[productId] || Object.values(overrides).find(
        (o: any) => o.slug?.toLowerCase() === cleanId || o.id?.toLowerCase() === cleanId
      ) || {};

      const baseProd = PRODUCTS.find(
        (p) =>
          p.id.toLowerCase() === cleanId ||
          p.slug.toLowerCase() === cleanId ||
          (p.partNumber || (p as any).sku || "").toLowerCase() === cleanId
      );

      const baseGallery: string[] = (baseProd?.galleryImages || []).map((img) => img.url);
      if (Array.isArray(baseProd?.images)) {
        baseProd.images.forEach((img) => {
          if (!baseGallery.includes(img)) baseGallery.push(img);
        });
      }
      if (baseGallery.length === 0 && baseProd?.mainImage) {
        baseGallery.push(baseProd.mainImage);
      }

      const currentGallery: string[] = Array.isArray(existing.gallery) && existing.gallery.length > 0
        ? existing.gallery
        : (Array.isArray(existing.images) && existing.images.length > 0 ? existing.images : baseGallery);

      const targetId = existing.id || baseProd?.id || productId;
      const targetSlug = existing.slug || baseProd?.slug || productId;

      const filteredGallery = currentGallery.filter((imgUrl, idx) => {
        if (targetUrl && (imgUrl === targetUrl || imgUrl.trim() === targetUrl.trim())) return false;
        if (id) {
          if (imgUrl === id || imgUrl.trim() === id.trim()) return false;
          if (id === `img-${productId}-${idx}`) return false;
          if (id === `img-${targetId}-${idx}`) return false;
          if (id === `img-${targetSlug}-${idx}`) return false;
          if (id === `img-${cleanId}-${idx}`) return false;
        }
        return true;
      });

      let newFeatured = existing.featured_image || existing.mainImage;
      const wasFeaturedDeleted =
        (targetUrl && (existing.featured_image === targetUrl || existing.mainImage === targetUrl)) ||
        (id && (existing.featured_image === id || (existing.featured_image && !filteredGallery.includes(existing.featured_image))));

      if (wasFeaturedDeleted) {
        newFeatured = filteredGallery.length > 0 ? filteredGallery[0] : "";
      } else if (!newFeatured && filteredGallery.length > 0) {
        newFeatured = filteredGallery[0];
      }

      await saveProductOverride(targetId, {
        ...existing,
        id: targetId,
        slug: targetSlug,
        gallery: filteredGallery,
        images: filteredGallery,
        featured_image: newFeatured,
        mainImage: newFeatured,
      });

      try {
        revalidatePath("/", "page");
        revalidatePath("/collections", "page");
        revalidatePath("/products", "page");
        if (targetSlug) revalidatePath(`/products/${targetSlug}`, "page");
      } catch (_) {}
    }

    return NextResponse.json({ success: true, message: "Product image deleted permanently." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
