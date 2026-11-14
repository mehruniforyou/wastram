import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { saveProductOverride, getProductOverrides } from "@/lib/productsStore";

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
      const file = formData.get("file") as File | null;
      const productId = formData.get("product_id") as string | null;

      if (!file) {
        return NextResponse.json({ error: "No image file provided." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Compress using sharp to WebP (max 1200px, 82% quality)
      const compressedBuffer = await sharp(buffer)
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `wst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webp`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, compressedBuffer);

      const publicUrl = `/uploads/${filename}`;

      // If productId provided, append to product's images
      if (productId) {
        const overrides = await getProductOverrides();
        const existing: any = overrides[productId] || {};
        const currentImages = Array.isArray(existing.images) ? [...existing.images] : [];
        if (!currentImages.includes(publicUrl)) {
          currentImages.push(publicUrl);
        }
        await saveProductOverride(productId, {
          ...existing,
          images: currentImages,
        });
      }

      return NextResponse.json({
        success: true,
        url: publicUrl,
        sizeBytes: compressedBuffer.length,
        format: "webp",
      });
    }

    // Case 2: JSON payload (URL link or base64 data URL)
    const body = await req.json();
    const { product_id, url } = body;

    if (!product_id || !url) {
      return NextResponse.json({ error: "product_id and url required" }, { status: 400 });
    }

    const overrides = await getProductOverrides();
    const existing: any = overrides[product_id] || {};
    const currentImages = Array.isArray(existing.images) ? [...existing.images] : [];
    if (!currentImages.includes(url)) {
      currentImages.push(url);
    }

    const saved = await saveProductOverride(product_id, {
      ...existing,
      images: currentImages,
    });

    return NextResponse.json({ success: true, url, product: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
