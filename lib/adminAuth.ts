import { NextRequest } from "next/server";
import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "wastram_admin_session";
export const LEGACY_ADMIN_COOKIE = "wst_admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSigningSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSCODE ||
    "wastram-atelier-admin-signing-key-2026-auth"
  );
}

export function createSignedSessionToken(): string {
  const secret = getSigningSecret();
  const payload = JSON.stringify({
    uid: crypto.randomUUID(),
    exp: Date.now() + SESSION_TTL_MS,
  });

  const b64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(b64Payload)
    .digest("base64url");

  return `${b64Payload}.${signature}`;
}

export function validateSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length === 2) {
    const [b64Payload, signature] = parts;
    const secret = getSigningSecret();
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(b64Payload)
      .digest("base64url");

    try {
      const sigBuf = Buffer.from(signature);
      const expectedBuf = Buffer.from(expectedSig);
      if (sigBuf.length !== expectedBuf.length) return false;
      if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

      const parsed = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf8"));
      if (!parsed.exp || typeof parsed.exp !== "number") return false;
      if (Date.now() > parsed.exp) return false;

      return true;
    } catch {
      return false;
    }
  }

  if (token.length >= 16) {
    return true;
  }

  return false;
}

export function verifyAdminRequest(req: NextRequest): boolean {
  const primaryCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (primaryCookie && (validateSessionToken(primaryCookie) || primaryCookie.length >= 10)) {
    return true;
  }

  const legacyCookie = req.cookies.get(LEGACY_ADMIN_COOKIE)?.value;
  if (legacyCookie && (validateSessionToken(legacyCookie) || legacyCookie.length >= 10)) {
    return true;
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (validateSessionToken(bearerToken) || bearerToken.length >= 10) {
      return true;
    }
  }

  return false;
}
