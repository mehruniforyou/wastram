import { NextResponse, NextRequest } from "next/server";
import { CATEGORIES, Category } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { getProductOverrides } from "@/lib/productsStore";

export async function GET(req: NextRequest) {
  try {
    const overrides = await getProductOverrides();
    
    // Compute accurate live counts per category
    const countMap: Record<string, number> = {};
    for (const p of PRODUCTS) {
      const ovr = overrides[p.id];
      if (ovr?.deleted) continue;
      if (ovr?.is_hidden) continue;
      const cat = ovr?.category || p.category || "western-dresses";
      countMap[cat] = (countMap[cat] || 0) + 1;
    }

    const result = CATEGORIES.map((cat) => ({
      ...cat,
      product_count: countMap[cat.id] || cat.itemCount || 0,
      itemCount: countMap[cat.id] || cat.itemCount || 0,
      image_url: cat.image,
      is_hidden: false,
      sort_order: cat.order || 1,
    }));

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(CATEGORIES);
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ success: true });
}
