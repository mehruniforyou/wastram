import { NextResponse, NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import {
  getProductOverrides,
  saveProductOverride,
  getLiveProductBySlug,
  bumpServerProductsCacheVersion,
} from "@/lib/productsStore";
import { PRODUCTS, ColorVariant } from "@/data/products";

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
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

    const newVariant: ColorVariant = {
      id: body.id || `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: body.name || "Custom Colorway",
      colorCode: body.colorCode || body.color || "#1A1A1A",
      images: Array.isArray(body.images)
        ? body.images
        : (body.image ? [body.image] : []),
    };

    // If an existing variant has this ID, update it; otherwise append
    const existingIndex = existingVariants.findIndex((v) => v.id === newVariant.id);
    if (existingIndex >= 0) {
      existingVariants[existingIndex] = { ...existingVariants[existingIndex], ...newVariant };
    } else {
      existingVariants.push(newVariant);
    }

    await saveProductOverride(targetId, {
      colorVariants: existingVariants,
    });

    bumpServerProductsCacheVersion();

    return NextResponse.json({
      success: true,
      variant: newVariant,
      colorVariants: existingVariants,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || searchParams.get("product_id");
    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const liveProd = await getLiveProductBySlug(productId);
    return NextResponse.json(liveProd?.colorVariants || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
