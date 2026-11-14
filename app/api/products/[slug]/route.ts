import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { PRODUCTS, Product } from "@/data/products";
import {
  getProductOverrides,
  saveProductOverride,
  deleteProductOverride,
  getAllMergedProducts,
} from "@/lib/productsStore";
import { verifyAdminRequest } from "@/lib/adminAuth";

type RouteProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const slug = decodeURIComponent(resolvedParams.slug).toLowerCase().trim();

    const merged = await getAllMergedProducts({ includeHidden: true });
    const found = merged.find(
      (p) =>
        p.slug?.toLowerCase() === slug ||
        p.id?.toLowerCase() === slug ||
        p.partNumber?.toLowerCase() === slug
    );

    if (!found || found.deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(found);
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
    const slug = decodeURIComponent(resolvedParams.slug).toLowerCase().trim();
    const body = await req.json();

    const overrides = await getProductOverrides();
    const targetId = body.id || Object.keys(overrides).find(
      (id) =>
        id.toLowerCase() === slug ||
        overrides[id].slug?.toLowerCase() === slug
    ) || PRODUCTS.find(
      (p) =>
        p.slug?.toLowerCase() === slug ||
        p.id?.toLowerCase() === slug ||
        p.partNumber?.toLowerCase() === slug
    )?.id || slug;

    const saved = await saveProductOverride(targetId, {
      ...body,
      id: targetId,
      updatedAt: new Date().toISOString(),
    });

    // Revalidate paths for instant reflect on storefront
    try {
      revalidatePath("/", "page");
      revalidatePath("/collections", "page");
      if (body.category) {
        revalidatePath(`/collections/${body.category}`, "page");
      }
      if (body.slug || slug) {
        revalidatePath(`/products/${body.slug || slug}`, "page");
      }
    } catch (_) {}

    return NextResponse.json({
      success: true,
      product: saved,
      updated: saved,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin privileges required to delete products." },
      { status: 401 }
    );
  }

  try {
    const resolvedParams = await Promise.resolve(params);
    const slug = decodeURIComponent(resolvedParams.slug).toLowerCase().trim();

    const overrides = await getProductOverrides();
    const targetId = Object.keys(overrides).find(
      (id) =>
        id.toLowerCase() === slug ||
        overrides[id].slug?.toLowerCase() === slug
    ) || PRODUCTS.find(
      (p) =>
        p.slug?.toLowerCase() === slug ||
        p.id?.toLowerCase() === slug ||
        p.partNumber?.toLowerCase() === slug
    )?.id || slug;

    await deleteProductOverride(targetId);

    try {
      revalidatePath("/", "page");
      revalidatePath("/collections", "page");
      revalidatePath(`/products/${slug}`, "page");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: `Product ${targetId} deleted.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
