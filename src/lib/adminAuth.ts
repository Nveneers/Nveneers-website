// Admin session cookie helpers.
// Signs and verifies a simple HMAC token stored in an HttpOnly cookie.

import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

function getSecret(): string {
  const s = process.env.ADMIN_COOKIE_SECRET;
  if (!s) {
    console.warn("[adminAuth] ADMIN_COOKIE_SECRET is not set — using insecure dev default.");
    return "dev-admin-secret-change-me";
  }
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Returns a signed cookie value for the given username. */
export function signCookie(username: string): string {
  const payload = `${username}:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns true if the cookie value has a valid signature (ignores expiry — cookie itself expires). */
export function verifyCookie(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const dot = value.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Read and verify the admin session cookie from a request. */
export function isAdminAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  return !!cookie && verifyCookie(cookie);
}

/** Cookie options for Set-Cookie header. */
export const cookieOptions = {
  name: COOKIE_NAME,
  maxAge: COOKIE_MAX_AGE,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/"
};
