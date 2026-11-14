import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { PRODUCTS } from "@/data/products";
import {
  getProductOverrides,
  saveProductOverride,
  deleteProductOverride,
  applyOverrideToProduct,
  getAllMergedProducts,
} from "@/lib/productsStore";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const adminMode = searchParams.get("admin") === "true" || searchParams.get("admin") === "1";

    if (adminMode) {
      const overrides = await getProductOverrides();
      const all: any[] = [];
      const handled = new Set<string>();

      for (const p of PRODUCTS) {
        handled.add(p.id);
        const ovr: any = overrides[p.id] || overrides[p.slug] || {};
        const primaryImage = ovr.featured_image || ovr.mainImage || (ovr.images && ovr.images[0]) || p.mainImage || p.image || (p.images && p.images[0]) || "";
        all.push({
          ...applyOverrideToProduct(p, ovr),
          featured_image: primaryImage,
          mainImage: primaryImage,
          is_hidden: ovr.is_hidden || false,
          is_featured: ovr.is_featured || false,
          deleted: ovr.deleted || false,
          isCustomProduct: false,
        });
      }

      for (const [id, ovr] of Object.entries(overrides)) {
        if (!handled.has(id) && ovr.isCustomProduct) {
          const primaryImage = ovr.featured_image || ovr.mainImage || (ovr.images && ovr.images[0]) || "";
          all.push({
            id,
            title: ovr.title || "Custom Atelier Ensemble",
            name: ovr.title || ovr.name || "Custom Atelier Ensemble",
            slug: ovr.slug || id,
            category: ovr.category || "western-dresses",
            tab: ovr.tab || ovr.category || "western-dresses",
            badge: ovr.badge || "Signature Collection",
            regularPrice: ovr.regularPrice || 0,
            salePrice: ovr.salePrice || 0,
            price: ovr.salePrice || ovr.regularPrice || 0,
            featured_image: primaryImage,
            mainImage: primaryImage,
            images: ovr.images || (primaryImage ? [primaryImage] : []),
            colorVariants: ovr.colorVariants || [],
            sizes: ovr.sizes || ["XS", "S", "M", "L", "XL", "XXL"],
            fabric: ovr.fabric || "Pure Handloom Silk & Cotton",
            description: ovr.description || "",
            details: ovr.details || [],
            moq: ovr.moq || "20 pcs / Flexible Wholesale Pack",
            sku: ovr.sku || id,
            is_hidden: ovr.is_hidden || false,
            is_featured: ovr.is_featured || false,
            deleted: ovr.deleted || false,
            isCustomProduct: true,
          });
        }
      }

      return NextResponse.json(all);
    }

    // Public Storefront query
    const products = await getAllMergedProducts();
    const filtered = category && category !== "all" && category !== "shop-all"
      ? products.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase() || (p.tab || "").toLowerCase() === category.toLowerCase())
      : products;

    return NextResponse.json(filtered);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin privileges required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = body.id || `custom-${Date.now()}`;
    const slug = body.slug || `${(body.title || "custom").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`;

    const saved = await saveProductOverride(id, {
      ...body,
      id,
      slug,
      isCustomProduct: true,
      deleted: false,
    });

    // Revalidate paths for instant reflect on main site
    try {
      revalidatePath("/", "page");
      revalidatePath(`/collections/${body.category || "western-dresses"}`, "page");
      revalidatePath(`/products/${slug}`, "page");
    } catch (_) {}

    return NextResponse.json({ success: true, product: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin privileges required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    }

    const saved = await saveProductOverride(id, body);

    // Revalidate paths for instant reflect on main site
    try {
      revalidatePath("/", "page");
      if (body.category) revalidatePath(`/collections/${body.category}`, "page");
      if (body.slug) revalidatePath(`/products/${body.slug}`, "page");
    } catch (_) {}

    return NextResponse.json({ success: true, product: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin privileges required." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    }

    await deleteProductOverride(id);

    try {
      revalidatePath("/", "page");
      revalidatePath("/collections", "page");
    } catch (_) {}

    return NextResponse.json({ success: true, message: `Product ${id} deleted.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
