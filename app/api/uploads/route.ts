import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { verifyAdminRequest } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".pdf",
  ".mp4",
  ".jfif",
  ".avif",
  ".bmp",
  ".heic",
  ".heif",
  ".tiff",
  ".tif",
]);

// Dynamically load sharp to avoid runtime crashes if native bindings differ on serverless
let sharpInstance: any = null;
let sharpChecked = false;

async function getSharp() {
  if (sharpChecked) return sharpInstance;
  sharpChecked = true;
  try {
    const mod = await import("sharp");
    sharpInstance = mod.default || mod;
    return sharpInstance;
  } catch (err) {
    console.warn("[Uploads] Notice: Sharp is not available in environment, using native buffer fallback:", err);
    sharpInstance = null;
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator privileges required to upload files." },
      { status: 401 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. JSON payload support (for URL passing or existing dataUrls)
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      const url = body.url || body.dataUrl || "";
      if (!url) {
        return NextResponse.json({ error: "Missing image url." }, { status: 400 });
      }
      return NextResponse.json({ success: true, url, filename: "remote_image" });
    }

    // 2. FormData file upload
    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("image") || formData.get("media")) as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size of 25MB" },
        { status: 400 }
      );
    }

    let ext = path.extname(file.name || "").toLowerCase();
    if (!ext && file.type) {
      if (file.type === "image/jpeg" || file.type === "image/jpg") ext = ".jpg";
      else if (file.type === "image/png" || file.type === "image/x-png") ext = ".png";
      else if (file.type === "image/webp") ext = ".webp";
      else if (file.type === "image/gif") ext = ".gif";
      else if (file.type === "image/svg+xml") ext = ".svg";
      else if (file.type === "image/avif") ext = ".avif";
      else if (file.type === "image/heic") ext = ".heic";
      else if (file.type === "image/bmp") ext = ".bmp";
      else if (file.type === "video/mp4") ext = ".mp4";
      else ext = ".jpg";
    }

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      if (file.type && file.type.startsWith("image/")) {
        ext = ".jpg";
      } else {
        return NextResponse.json(
          { error: "Unsupported file format. Allowed formats: jpg, jpeg, png, webp, gif, svg, avif, heic, pdf, mp4." },
          { status: 400 }
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const rawBaseName = path.basename(file.name || "media", ext).replace(/[^a-zA-Z0-9_-]/g, "-");
    const safeBaseName = rawBaseName.replace(/-+/g, "-").replace(/^-|-$/g, "") || "image";
    const filename = `${Date.now()}-${safeBaseName}${ext || ".webp"}`;

    // 1. Attempt to save to public/uploads if filesystem is writable (local dev / standalone server)
    let diskSaved = false;
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      diskSaved = true;
    } catch {
      // Vercel serverless / read-only filesystem (/var/task) -> diskSaved remains false
      diskSaved = false;
    }

    if (diskSaved) {
      return NextResponse.json({ url: `/uploads/${filename}`, filename });
    }

    // 2. Serverless / Vercel fallback: Optimize image into a compact WebP Data URL
    try {
      const isRasterImage =
        file.type?.startsWith("image/") ||
        [".jpg", ".jpeg", ".png", ".webp", ".jfif", ".avif", ".bmp"].includes(ext);

      const sharp = await getSharp();

      if (sharp && isRasterImage && ext !== ".svg") {
        try {
          const optimizedBuffer = await sharp(buffer)
            .rotate() // Auto-orient phone/camera photos
            .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80, effort: 4 })
            .toBuffer();

          const dataUrl = `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;
          return NextResponse.json({ url: dataUrl, filename });
        } catch (sharpProcessErr) {
          console.warn("[Uploads] Sharp processing warning, using raw base64:", sharpProcessErr);
        }
      }

      // Non-raster images, vector (SVG, PDF, video), or sharp fallback
      const mime = file.type || (ext === ".svg" ? "image/svg+xml" : "image/jpeg");
      const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ url: dataUrl, filename });
    } catch (fallbackErr: any) {
      const mime = file.type || "image/jpeg";
      const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ url: dataUrl, filename });
    }
  } catch (err: any) {
    console.error("[Uploads API Error]:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
    return NextResponse.json({ success: true, message: "Upload deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
