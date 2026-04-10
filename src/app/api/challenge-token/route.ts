import { NextRequest, NextResponse } from "next/server";
import { issueToken } from "@/lib/challengeToken";
import { checkRateLimit } from "@/lib/rateLimiter";

// Allow more requests here than on the main endpoint — the token fetch is
// a lightweight preflight, but we still want to slow down token farmers.
const TOKEN_RATE_LIMIT = 10; // per minute per IP

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfterSeconds } = checkRateLimit(ip, TOKEN_RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) }
      }
    );
  }

  return NextResponse.json(
    { token: issueToken() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
