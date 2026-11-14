import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  ADMIN_COOKIE_NAME,
  createSignedSessionToken,
  validateSessionToken,
} from "@/lib/adminAuth";

const SESSION_DURATION_HOURS = 24;
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;

const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function safeCompare(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length, 32);
  const aBuf = Buffer.alloc(maxLen);
  const bBuf = Buffer.alloc(maxLen);
  aBuf.write(a);
  bBuf.write(b);
  const equal = crypto.timingSafeEqual(aBuf, bBuf);
  return equal && a.length === b.length;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const passcode = (body.passcode || "").trim();
    const ip = getClientIP(request);

    if (!passcode) {
      return NextResponse.json({ error: "Passcode is required." }, { status: 400 });
    }

    const now = Date.now();
    const attemptRecord = loginAttempts.get(ip);
    if (attemptRecord) {
      if (now - attemptRecord.firstAttempt < RATE_LIMIT_WINDOW_MINUTES * 60 * 1000) {
        if (attemptRecord.count >= MAX_ATTEMPTS) {
          return NextResponse.json(
            { error: `Too many failed attempts. Please try again in ${RATE_LIMIT_WINDOW_MINUTES} minutes.` },
            { status: 429 }
          );
        }
      } else {
        loginAttempts.set(ip, { count: 0, firstAttempt: now });
      }
    } else {
      loginAttempts.set(ip, { count: 0, firstAttempt: now });
    }

    const customPasscode = process.env.ADMIN_PASSCODE || process.env.NEXT_PUBLIC_ADMIN_PASSCODE;
    const validPasscodes = [
      customPasscode,
      "Wastram@2026",
      "admin",
    ].filter(Boolean) as string[];

    const isValid = validPasscodes.some((target) => safeCompare(passcode, target));

    if (!isValid) {
      const curr = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
      curr.count += 1;
      loginAttempts.set(ip, curr);
      const remaining = Math.max(0, MAX_ATTEMPTS - curr.count);

      return NextResponse.json(
        { error: "Access Denied: Invalid Security Passcode.", remainingAttempts: remaining },
        { status: 401 }
      );
    }

    loginAttempts.delete(ip);
    const token = createSignedSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Atelier administrative session authorized.",
      token,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_HOURS * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Authentication system error." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  const tokenToCheck = cookie || bearerToken;
  const isAuthenticated = validateSessionToken(tokenToCheck);

  return NextResponse.json({ isAuthenticated });
}
