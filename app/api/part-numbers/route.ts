import { NextResponse, NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      partNumber: {
        id: `pn-${Date.now()}`,
        variant_id: body.variant_id,
        code: body.code || "",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
