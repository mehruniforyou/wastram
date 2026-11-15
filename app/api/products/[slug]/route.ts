import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import {
  getProductOverrides,
  saveProductOverride,
  deleteProductOverride,
  getLiveProductBySlug,
  bumpServerProductsCacheVersion,
} from "@/lib/productsStore";
import { verifyAdminRequest } from "@/lib/adminAuth";

type RouteProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

function revalidateCatalogPaths(slug?: string, categoryId?: string) {
  try {
    if (slug) {
      revalidatePath(`/products/${slug}`, "page");
      revalidatePath(`/${slug}`, "page");
    }
    if (categoryId) {
      revalidatePath(`/${categoryId}`, "page");
    }
    revalidatePath("/products", "page");
    revalidatePath("/collections", "page");
    revalidatePath("/", "page");
    revalidatePath("/sitemap.xml");
  } catch (_) {}
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const rawSlug = resolvedParams.slug;
    if (!rawSlug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const cleanSlug = decodeURIComponent(rawSlug).replace(/\.html$/, "").trim().toLowerCase();
    const liveProd = await getLiveProductBySlug(cleanSlug);

    if (!liveProd || (liveProd as any).deleted || (liveProd as any).purged) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const name = liveProd.name || (liveProd as any).title || "Atelier Dress";
    const title = (liveProd as any).title || liveProd.name || "Atelier Dress";
    const featuredImage = (liveProd as any).featured_image || liveProd.mainImage || "";

    const galleryUrls: string[] = (Array.isArray((liveProd as any).gallery) && (liveProd as any).gallery.length > 0)
      ? (liveProd as any).gallery
      : (Array.isArray(liveProd.images) && liveProd.images.length > 0
        ? liveProd.images
        : (liveProd.galleryImages || []).map((img) => img.url));

    if (featuredImage && !galleryUrls.includes(featuredImage)) {
      galleryUrls.unshift(featuredImage);
    }

    const responseData = {
      ...liveProd,
      id: liveProd.id,
      name,
      title,
      slug: liveProd.slug || cleanSlug,
      partNumber: liveProd.partNumber || (liveProd as any).sku || liveProd.id,
      sku: (liveProd as any).sku || liveProd.partNumber || liveProd.id,
      price: liveProd.price ?? 0,
      regularPrice: (liveProd as any).regularPrice ?? liveProd.price ?? 0,
      salePrice: (liveProd as any).salePrice ?? liveProd.price ?? 0,
      inStock: liveProd.inStock ?? true,
      stock: (liveProd as any).stock ?? liveProd.stockQty ?? 25,
      stockQty: liveProd.stockQty ?? 25,
      is_hidden: (liveProd as any).is_hidden ?? false,
      is_featured: (liveProd as any).is_featured ?? liveProd.isHomeSpecial ?? false,
      category: liveProd.category,
      category_id: (liveProd as any).category_id || (liveProd as any).category_slug || liveProd.category,
      category_name: (liveProd as any).category_name || liveProd.category,
      category_slug: (liveProd as any).category_slug || (liveProd as any).category_id || liveProd.category,
      mainImage: featuredImage || (galleryUrls[0] || ""),
      featured_image: featuredImage || (galleryUrls[0] || ""),
      gallery: galleryUrls,
      images: galleryUrls.map((url, index) => ({
        id: `img-${liveProd.id}-${index}`,
        url,
        alt_text: name,
        is_featured: url === featuredImage || (index === 0 && !featuredImage),
        sort_order: index,
      })),
      variants: (liveProd as any).colorVariants || [],
      downloads: (liveProd as any).downloads || [],
      faqs: (liveProd as any).faqs || [],
    };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin privileges required to update products." },
      { status: 401 }
    );
  }

  try {
    const resolvedParams = await Promise.resolve(params);
    const cleanSlug = decodeURIComponent(resolvedParams.slug).replace(/\.html$/, "").trim().toLowerCase();
    const body = await req.json();

    const overrides = await getProductOverrides();
    const existingOv = overrides[cleanSlug] || Object.values(overrides).find(
      (o) => o.slug?.toLowerCase() === cleanSlug || o.id?.toLowerCase() === cleanSlug
    );

    const baseProd = PRODUCTS.find(
      (p) =>
        p.slug.toLowerCase() === cleanSlug ||
        (p.partNumber || (p as any).sku || "").toLowerCase() === cleanSlug ||
        p.id.toLowerCase() === cleanSlug
    );

    const targetId = body.id || existingOv?.id || baseProd?.id || cleanSlug;
    const targetSlug = body.slug || existingOv?.slug || baseProd?.slug || cleanSlug;

    const finalShortDesc = body.short_desc !== undefined
      ? body.short_desc
      : (body.shortDescription || existingOv?.short_desc || existingOv?.shortDescription || baseProd?.shortDescription || baseProd?.description);

    const updated = await saveProductOverride(targetId, {
      ...existingOv,
      ...body,
      id: targetId,
      slug: targetSlug,
      short_desc: finalShortDesc,
      shortDescription: finalShortDesc,
    });

    bumpServerProductsCacheVersion();
    revalidateCatalogPaths(cleanSlug, (updated as any).category_id);

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator privileges required to delete products." },
      { status: 401 }
    );
  }

  try {
    const resolvedParams = await Promise.resolve(params);
    const cleanSlug = decodeURIComponent(resolvedParams.slug).replace(/\.html$/, "").trim().toLowerCase();
    const overrides = await getProductOverrides();

    const existingOv = overrides[cleanSlug] || Object.values(overrides).find(
      (o) => o.slug?.toLowerCase() === cleanSlug || o.id?.toLowerCase() === cleanSlug
    );
    const baseProd = PRODUCTS.find(
      (p) =>
        p.slug.toLowerCase() === cleanSlug ||
        (p.partNumber || (p as any).sku || "").toLowerCase() === cleanSlug ||
        p.id.toLowerCase() === cleanSlug
    );

    const targetId = existingOv?.id || baseProd?.id || cleanSlug;
    await deleteProductOverride(targetId);

    if (cleanSlug && cleanSlug !== targetId) {
      await deleteProductOverride(cleanSlug).catch(() => {});
    }
    if (existingOv?.slug && existingOv.slug !== targetId && existingOv.slug !== cleanSlug) {
      await deleteProductOverride(existingOv.slug).catch(() => {});
    }
    if (baseProd?.slug && baseProd.slug !== targetId && baseProd.slug !== cleanSlug) {
      await deleteProductOverride(baseProd.slug).catch(() => {});
    }

    bumpServerProductsCacheVersion();
    revalidateCatalogPaths(cleanSlug);

    return NextResponse.json({ success: true, message: "Product deleted permanently." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
