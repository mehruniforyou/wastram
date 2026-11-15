import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllMergedProducts, saveProductOverride, getProductOverrides } from "@/lib/productsStore";
import { verifyAdminRequest } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const products = await getAllMergedProducts({ includeHidden: true });
    const overrides = await getProductOverrides();

    const items = products
      .filter((p) => {
        if ((p as any).deleted || (p as any).purged) return false;
        const ovr: any = overrides[p.id] || (p.slug ? overrides[p.slug] : undefined);
        if (ovr?.deleted || ovr?.purged) return false;
        return true;
      })
      .map((p) => {
        const ovr: any = overrides[p.id] || (p.slug ? overrides[p.slug] : undefined) || {};
        const stock = typeof ovr.stock === "number" ? ovr.stock : (typeof (p as any).stock === "number" ? (p as any).stock : 25);
        const low_stock_threshold = typeof ovr.low_stock_threshold === "number" ? ovr.low_stock_threshold : (typeof (p as any).low_stock_threshold === "number" ? (p as any).low_stock_threshold : 5);
        const status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" = stock <= 0 ? "OUT_OF_STOCK" : stock <= low_stock_threshold ? "LOW_STOCK" : "IN_STOCK";
        const primaryImage = ovr.featured_image || ovr.mainImage || (ovr.images && ovr.images[0]) || (p as any).featured_image || (p as any).mainImage || (p.images && p.images[0]) || "";

        const variants = (p.colorVariants || (p as any).variants || []).map((v: any, idx: number) => {
          const vStock = typeof v.stock === "number" ? v.stock : stock;
          return {
            id: v.id || `${p.id}-var-${idx}`,
            name: v.color || v.name || `Variant ${idx + 1}`,
            specs: { Color: v.color || "Standard", Fabric: p.fabric || "Cotton Modal" },
            stock: vStock,
            price: v.price || (p as any).price || p.salePrice || p.regularPrice || 0,
            is_active: true,
            status: vStock <= 0 ? "OUT_OF_STOCK" : vStock <= low_stock_threshold ? "LOW_STOCK" : "IN_STOCK",
          };
        });

        return {
          id: p.id,
          partNumber: (p as any).part_number || (p as any).partNumber || p.id,
          name: p.name || p.title || "Wastram Ensemble",
          slug: p.slug,
          category: p.category || "western-dresses",
          category_id: (p as any).category_id || p.category || "western-dresses",
          featured_image: primaryImage,
          stock,
          low_stock_threshold,
          status,
          inStock: stock > 0,
          price: (p as any).price || p.salePrice || p.regularPrice || 0,
          updated_at: (p as any).updated_at || (p as any).updatedAt || new Date().toISOString(),
          variants,
        };
      });

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    // 1. Bulk update
    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        if (!item.id) continue;
        await saveProductOverride(item.id, {
          stock: Number(item.stock),
          low_stock_threshold: item.low_stock_threshold !== undefined ? Number(item.low_stock_threshold) : undefined,
          updatedAt: new Date().toISOString(),
        });
      }

      try {
        revalidatePath("/", "page");
        revalidatePath("/collections", "page");
      } catch (_) {}

      return NextResponse.json({ success: true, count: body.items.length });
    }

    // 2. Single item update
    const { productId, stock, low_stock_threshold } = body;
    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const saved = await saveProductOverride(productId, {
      stock: Number(stock),
      low_stock_threshold: low_stock_threshold !== undefined ? Number(low_stock_threshold) : undefined,
      updatedAt: new Date().toISOString(),
    });

    try {
      revalidatePath("/", "page");
      revalidatePath("/collections", "page");
      if (saved.slug) revalidatePath(`/products/${saved.slug}`, "page");
    } catch (_) {}

    return NextResponse.json({ success: true, product: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
