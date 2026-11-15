import { NextResponse, NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import {
  getProductOverrides,
  saveProductOverride,
  getLiveProductBySlug,
  bumpServerProductsCacheVersion,
} from "@/lib/productsStore";
import { PRODUCTS, ColorVariant } from "@/data/products";

type RouteProps = {
  params: Promise<{ id: string }> | { id: string };
};

export async function PUT(req: NextRequest, { params }: RouteProps) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
    const resolvedParams = await Promise.resolve(params);
    const variantId = resolvedParams.id;
    const body = await req.json();

    const productId = body.product_id || body.productId;
    if (!productId) {
      return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
    }

    const cleanId = String(productId).trim().toLowerCase();
    const liveProd = await getLiveProductBySlug(cleanId);
    const baseProd = PRODUCTS.find(
      (p) =>
        p.id.toLowerCase() === cleanId ||
        p.slug.toLowerCase() === cleanId ||
        (p.partNumber || "").toLowerCase() === cleanId
    );

    const targetId = liveProd?.id || baseProd?.id || cleanId;
    const existingVariants: ColorVariant[] = Array.isArray(liveProd?.colorVariants)
      ? [...liveProd.colorVariants]
      : (Array.isArray(baseProd?.colorVariants) ? [...baseProd.colorVariants] : []);

    const updatedVariant: ColorVariant = {
      id: variantId,
      name: body.name || "Custom Colorway",
      colorCode: body.colorCode || body.color || "#1A1A1A",
      images: Array.isArray(body.images)
        ? body.images
        : (body.image ? [body.image] : []),
    };

    const idx = existingVariants.findIndex((v) => v.id === variantId);
    if (idx >= 0) {
      existingVariants[idx] = updatedVariant;
    } else {
      existingVariants.push(updatedVariant);
    }

    await saveProductOverride(targetId, {
      colorVariants: existingVariants,
    });

    bumpServerProductsCacheVersion();

    return NextResponse.json({
      success: true,
      variant: updatedVariant,
      colorVariants: existingVariants,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
    const resolvedParams = await Promise.resolve(params);
    const variantId = resolvedParams.id;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || searchParams.get("product_id");

    const overrides = await getProductOverrides();

    // If productId is provided, update that product directly
    if (productId) {
      const liveProd = await getLiveProductBySlug(productId);
      if (liveProd && Array.isArray(liveProd.colorVariants)) {
        const filtered = liveProd.colorVariants.filter((v) => v.id !== variantId);
        await saveProductOverride(liveProd.id, { colorVariants: filtered });
      }
    } else {
      // Find which product contains this variant across all overrides
      for (const [id, ov] of Object.entries(overrides)) {
        if (Array.isArray(ov.colorVariants) && ov.colorVariants.some((v) => v.id === variantId)) {
          const filtered = ov.colorVariants.filter((v) => v.id !== variantId);
          await saveProductOverride(id, { colorVariants: filtered });
        }
      }
    }

    bumpServerProductsCacheVersion();

    return NextResponse.json({ success: true, message: "Variant deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
