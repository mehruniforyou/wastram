import { NextResponse, NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ success: true });
}
