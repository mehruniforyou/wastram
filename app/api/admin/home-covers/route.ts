import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getHomeCovers, saveHomeCovers, HomeCoversStore } from '@/lib/homeCoversStore';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CATEGORIES_LIST = [
  { id: 'western-dresses', name: 'Western Dresses', folder: 'western-dresses' },
  { id: 'traditional-gowns', name: 'Traditional Gowns & Anarkalis', folder: 'traditional-gowns' },
  { id: 'cord-sets', name: 'Co-ord Sets', folder: 'cord-sets' },
  { id: 'tops-shirts', name: 'Tops & Shirts', folder: 'tops-shirts' },
  { id: 'ethnic-wear-sets', name: 'Kurta & Ethnic Sets', folder: 'ethnic-wear-sets' },
  { id: 'short-long-kaftan', name: 'Kaftans (Short & Long)', folder: 'short-long-kaftan' },
  { id: 'umbrella-dresses', name: 'Umbrella Dresses', folder: 'umbrella-dresses' },
  { id: 'denim-collection', name: 'Denim Collection', folder: 'denim-collection' },
  { id: 't-shirts', name: 'T-Shirts', folder: 't-shirts' },
  { id: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', folder: 'hoodies-sweatshirts' },
];

function getCategoryImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const result: Record<string, { url: string; filename: string }[]> = {};

  for (const cat of CATEGORIES_LIST) {
    const dir = path.join(publicDir, cat.folder);
    const list: { url: string; filename: string }[] = [];
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        files.forEach((f) => {
          if (/\.(jpg|jpeg|png|webp|avif)$/i.test(f)) {
            list.push({
              filename: f,
              url: `/${cat.folder}/${f}`,
            });
          }
        });
      } catch (_) {}
    }
    result[cat.id] = list;
  }

  // Also include custom uploads folder if exists
  const uploadsDir = path.join(publicDir, 'uploads');
  if (fs.existsSync(uploadsDir)) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const list: { url: string; filename: string }[] = [];
      files.forEach((f) => {
        if (/\.(jpg|jpeg|png|webp|avif)$/i.test(f)) {
          list.push({
            filename: f,
            url: `/uploads/${f}`,
          });
        }
      });
      result['uploads'] = list;
    } catch (_) {}
  }

  return result;
}

export async function GET(req: NextRequest) {
  try {
    const covers = await getHomeCovers(true);
    const categoryImages = getCategoryImages();

    return NextResponse.json({
      covers,
      categoryImages,
      categoriesMeta: CATEGORIES_LIST
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.hero || !body.categories) {
      return NextResponse.json({ error: 'Invalid home covers payload' }, { status: 400 });
    }

    const saved = await saveHomeCovers(body as HomeCoversStore);

    try {
      revalidatePath('/');
      revalidatePath('/collections');
      revalidatePath('/collections/[category]', 'page');
    } catch (_) {}

    return NextResponse.json({ success: true, covers: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
