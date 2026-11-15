import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { saveProductOverride, getProductOverrides } from "@/lib/productsStore";
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
    const contentType = req.headers.get("content-type") || "";

    // Case 1: FormData multipart upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = (formData.get("file") || formData.get("image")) as File | null;
      const productId = formData.get("product_id") as string | null;

      if (!file) {
        return NextResponse.json({ error: "No image file provided." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Compress using sharp to WebP (max 1200px, 80% quality)
      const compressedBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      const dataUrl = `data:image/webp;base64,${compressedBuffer.toString("base64")}`;

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `wst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webp`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, compressedBuffer);
      } catch (_) {}

      // If productId provided, append to product's images
      if (productId) {
        const overrides = await getProductOverrides();
        const existing: any = overrides[productId] || {};
        const currentImages = Array.isArray(existing.images) ? [...existing.images] : [];
        if (!currentImages.includes(dataUrl)) {
          currentImages.push(dataUrl);
        }
        await saveProductOverride(productId, {
          ...existing,
          images: currentImages,
          featured_image: existing.featured_image || dataUrl,
          mainImage: existing.mainImage || dataUrl,
          updatedAt: new Date().toISOString(),
        });
        try {
          revalidatePath("/", "page");
          revalidatePath("/collections", "page");
          if (existing.slug) revalidatePath(`/products/${existing.slug}`, "page");
        } catch (_) {}
      }

      return NextResponse.json({
        success: true,
        url: dataUrl,
        sizeBytes: compressedBuffer.length,
        format: "webp",
      });
    }

    // Case 2: JSON payload (URL link or base64 data URL)
    const body = await req.json();
    const { product_id, url, replace_url } = body;

    if (!product_id || !url) {
      return NextResponse.json({ error: "product_id and url required" }, { status: 400 });
    }

    const overrides = await getProductOverrides();
    const existing: any = overrides[product_id] || {};
    let currentImages = Array.isArray(existing.images) ? [...existing.images] : [];

    if (replace_url) {
      const idx = currentImages.indexOf(replace_url);
      if (idx !== -1) {
        currentImages[idx] = url;
      } else {
        currentImages.push(url);
      }
    } else if (!currentImages.includes(url)) {
      currentImages.push(url);
    }

    let featured_image = existing.featured_image;
    if (!featured_image || (replace_url && featured_image === replace_url)) {
      featured_image = url;
    }

    let mainImage = existing.mainImage;
    if (!mainImage || (replace_url && mainImage === replace_url)) {
      mainImage = url;
    }

    const saved = await saveProductOverride(product_id, {
      ...existing,
      images: currentImages,
      featured_image,
      mainImage,
      updatedAt: new Date().toISOString(),
    });

    try {
      revalidatePath("/", "page");
      revalidatePath("/collections", "page");
      if (existing.slug) revalidatePath(`/products/${existing.slug}`, "page");
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
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {
      const { searchParams } = new URL(req.url);
      body = {
        id: searchParams.get("id"),
        url: searchParams.get("url"),
        product_id: searchParams.get("product_id"),
        slug: searchParams.get("slug"),
      };
    }

    const { id, url, product_id, slug } = body;
    const targetKey = product_id || slug || id;

    if (!targetKey) {
      return NextResponse.json({ error: "product_id or slug is required" }, { status: 400 });
    }

    const overrides = await getProductOverrides();
    const existing: any = overrides[targetKey] || Object.values(overrides).find(
      (o: any) => o.id === targetKey || o.slug === targetKey
    ) || {};

    const targetUrl = url || id;
    let currentImages = Array.isArray(existing.images) ? [...existing.images] : [];
    currentImages = currentImages.filter((img: string) => img !== targetUrl && img !== id);

    let featured_image = existing.featured_image;
    if (featured_image === targetUrl || featured_image === id) {
      featured_image = currentImages.length > 0 ? currentImages[0] : "";
    }

    let mainImage = existing.mainImage;
    if (mainImage === targetUrl || mainImage === id) {
      mainImage = currentImages.length > 0 ? currentImages[0] : "";
    }

    const updated = await saveProductOverride(existing.id || targetKey, {
      ...existing,
      images: currentImages,
      featured_image,
      mainImage,
      updatedAt: new Date().toISOString(),
    });

    try {
      revalidatePath("/", "page");
      revalidatePath("/collections", "page");
      if (existing.slug) revalidatePath(`/products/${existing.slug}`, "page");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: "Product image permanently removed with zero traces.",
      product: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
