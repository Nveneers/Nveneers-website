// HMAC-signed challenge tokens.
// Issued by GET /api/challenge-token, validated by POST /api/validate-smile.
// Prevents direct API calls that bypass the page (bots, scrapers, etc.).

import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SIG_LENGTH = 16; // hex chars from HMAC digest

function getSecret(): string {
  const s = process.env.CHALLENGE_SECRET;
  if (!s) {
    console.warn(
      "[challengeToken] CHALLENGE_SECRET is not set — using insecure dev default. Set it in .env.local and on your hosting provider."
    );
    return "dev-secret-change-me";
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex")
    .slice(0, SIG_LENGTH);
}

/** Issue a new short-lived token. */
export function issueToken(): string {
  const ts = String(Date.now());
  return `${ts}.${sign(ts)}`;
}

/** Verify a token — checks signature and expiry. */
export function verifyToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;

  const ts = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  // Reject malformed timestamps
  const timestamp = Number(ts);
  if (!Number.isFinite(timestamp)) return false;

  // Check expiry
  if (Date.now() - timestamp > TOKEN_TTL_MS) return false;

  // Constant-time signature comparison — both buffers must be the same length
  const expected = sign(ts);
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
