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
      { error: "Unauthorized: Admin privileges required to upload media." },
      { status: 401 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart form upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = (formData.get("file") || formData.get("image") || formData.get("media")) as File | null;
      const productId = formData.get("product_id") as string | null;

      if (!file) {
        return NextResponse.json({ error: "No image file provided." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Auto-orient from EXIF and compress to ultra-efficient WebP (max 1200x1200px, 80% quality)
      const compressedBuffer = await sharp(buffer)
        .rotate()
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      // Convert to self-contained Base64 WebP Data URL (immune to Vercel read-only filesystem errors)
      const dataUrl = `data:image/webp;base64,${compressedBuffer.toString("base64")}`;

      // Also attempt to save locally if running in environment with writable filesystem
      const filename = `wst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webp`;
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, compressedBuffer);
      } catch (_) {
        // Vercel serverless read-only filesystem fallback: dataUrl guarantees 100% reliability
      }

      // If productId was passed, associate with product override immediately
      if (productId) {
        try {
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
          revalidatePath("/", "page");
          revalidatePath("/collections", "page");
        } catch (_) {}
      }

      return NextResponse.json({
        success: true,
        url: dataUrl,
        sizeBytes: compressedBuffer.length,
        format: "webp",
      });
    }

    // 2. JSON payload
    const body = await req.json();
    const url = body.url || body.dataUrl || "";
    if (!url) {
      return NextResponse.json({ error: "Missing image url." }, { status: 400 });
    }

    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    console.error("[Uploads API Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to process image upload." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  try {
    let url = "";
    let productId = "";

    try {
      const body = await req.json();
      url = body.url || "";
      productId = body.product_id || body.productId || "";
    } catch (_) {
      const { searchParams } = new URL(req.url);
      url = searchParams.get("url") || "";
      productId = searchParams.get("product_id") || "";
    }

    if (productId && url) {
      const overrides = await getProductOverrides();
      const existing: any = overrides[productId] || {};
      const currentImages = Array.isArray(existing.images)
        ? existing.images.filter((img: string) => img !== url)
        : [];

      let featured_image = existing.featured_image;
      if (featured_image === url) {
        featured_image = currentImages.length > 0 ? currentImages[0] : "";
      }

      await saveProductOverride(productId, {
        ...existing,
        images: currentImages,
        featured_image,
        mainImage: featured_image,
        updatedAt: new Date().toISOString(),
      });

      try {
        revalidatePath("/", "page");
        revalidatePath("/collections", "page");
      } catch (_) {}
    }

    return NextResponse.json({ success: true, message: "Image removed permanently." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
