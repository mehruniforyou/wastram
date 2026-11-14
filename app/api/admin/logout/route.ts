import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, LEGACY_ADMIN_COOKIE } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  response.cookies.delete(LEGACY_ADMIN_COOKIE);
  return response;
}
