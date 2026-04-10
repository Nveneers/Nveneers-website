import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";
import { verifyToken } from "@/lib/challengeToken";

const VALIDATE_RATE_LIMIT = 3; // requests per minute per IP

const PROMPT = `Dental clinic smile assessment. Reply with ONLY raw JSON, no markdown, no explanation.

valid = true if: human face visible, mouth open, teeth clearly shown.
valid = false for anything else.
reason = one short sentence. If valid, confirm it looks good. If invalid, say exactly what is wrong and how to fix it.

{"valid": true, "reason": "..."}`;

// ─── Provider: Google Gemini ─────────────────────────────────────────────────
// Free via Google AI Studio (15 req/min, 1500 req/day). Set GEMINI_API_KEY.
async function callGemini(
  base64Data: string,
  mediaType: string
): Promise<{ valid: boolean; reason: string }> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inlineData: { mimeType: mediaType, data: base64Data } },
              { text: PROMPT }
            ]
          }
        ],
        generationConfig: { maxOutputTokens: 300 }
      })
    }
  );
  const data = await res.json();
  const raw: string =
    data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";


  // No text — likely blocked by Gemini's safety filter, treat as invalid
  if (!raw) {
    return {
      valid: false,
      reason: "Please upload a clear photo of your smile and try again."
    };
  }

  // Strip ALL markdown fences anywhere in the string, extract first {...}
  const stripped = raw.replace(/```(?:json)?/gi, "").trim();
  const match = stripped.match(/\{[\s\S]*?\}/);
  if (!match) {
    console.error("No JSON found in Gemini response:", raw);
    return {
      valid: false,
      reason: "Please upload a clear photo of your smile and try again."
    };
  }
  return JSON.parse(match[0]) as { valid: boolean; reason: string };
}

// ─── Provider: Anthropic (Claude) ────────────────────────────────────────────
// Set ANTHROPIC_API_KEY in .env.local when ready to switch.
async function callClaude(
  base64Data: string,
  mediaType: string
): Promise<{ valid: boolean; reason: string }> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as
                | "image/jpeg"
                | "image/png"
                | "image/webp"
                | "image/gif",
              data: base64Data
            }
          },
          { type: "text", text: PROMPT }
        ]
      }
    ]
  });
  const raw =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";
  return JSON.parse(raw) as { valid: boolean; reason: string };
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── Guard 1: IP rate limiting ──────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const { allowed, retryAfterSeconds } = checkRateLimit(ip, VALIDATE_RATE_LIMIT);
    if (!allowed) {
      return NextResponse.json(
        { valid: false, reason: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Limit": String(VALIDATE_RATE_LIMIT),
            "X-RateLimit-Window": "60"
          }
        }
      );
    }

    // ── Guard 2: Challenge token ───────────────────────────────────────────
    const token = req.headers.get("x-challenge-token");
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { valid: false, reason: "Request validation failed. Please refresh and try again." },
        { status: 403 }
      );
    }

    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { valid: false, reason: "No image provided." },
        { status: 400 }
      );
    }

    const base64Match = image.match(/^data:(image\/[\w+]+);base64,(.+)$/);
    if (!base64Match) {
      return NextResponse.json(
        { valid: false, reason: "Invalid image format." },
        { status: 400 }
      );
    }

    const mediaType = base64Match[1];
    const base64Data = base64Match[2];

    // Switch between providers via environment variables.
    // Priority: ANTHROPIC_API_KEY (production) → GEMINI_API_KEY (free testing)
    let result: { valid: boolean; reason: string };
    if (process.env.ANTHROPIC_API_KEY) {
      result = await callClaude(base64Data, mediaType);
    } else if (process.env.GEMINI_API_KEY) {
      result = await callGemini(base64Data, mediaType);
    } else {
      return NextResponse.json(
        {
          valid: false,
          reason: "Vision API not configured. Please contact the clinic directly."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      valid: Boolean(result.valid),
      reason: String(result.reason)
    });
  } catch (err) {
    console.error("validate-smile error:", err);
    return NextResponse.json(
      {
        valid: false,
        reason:
          "Something went wrong while checking your photo. Please try again."
      },
      { status: 500 }
    );
  }
}
