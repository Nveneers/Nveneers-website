import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { checkRateLimit } from "@/lib/rateLimiter";
import { verifyToken } from "@/lib/challengeToken";
import { supabase } from "@/lib/supabase";

const SUBMIT_RATE_LIMIT = 3; // per minute per IP
const BUCKET = "smile-photos";

export async function POST(req: NextRequest) {
  try {
    // ── Guard 1: IP rate limiting ────────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const { allowed, retryAfterSeconds } = checkRateLimit(ip, SUBMIT_RATE_LIMIT);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    // ── Guard 2: Challenge token ─────────────────────────────────────────────
    const token = req.headers.get("x-challenge-token");
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { ok: false, error: "Request validation failed. Please refresh and try again." },
        { status: 403 }
      );
    }

    // ── Parse + validate body ────────────────────────────────────────────────
    const { image, name, phone } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }
    if (name.trim().length > 80) {
      return NextResponse.json({ ok: false, error: "Name is too long." }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      return NextResponse.json({ ok: false, error: "Phone number is required." }, { status: 400 });
    }
    if (phone.trim().length > 30) {
      return NextResponse.json({ ok: false, error: "Phone number is too long." }, { status: 400 });
    }
    if (!image || typeof image !== "string") {
      return NextResponse.json({ ok: false, error: "No image provided." }, { status: 400 });
    }

    const base64Match = image.match(/^data:(image\/[\w+]+);base64,(.+)$/);
    if (!base64Match) {
      return NextResponse.json({ ok: false, error: "Invalid image format." }, { status: 400 });
    }

    const mediaType = base64Match[1];
    const base64Data = base64Match[2];
    const extension = mediaType.split("/")[1].replace("jpeg", "jpg");
    const filename = `${randomUUID()}.${extension}`;

    // ── Upload image to Supabase Storage ─────────────────────────────────────
    const imageBuffer = Buffer.from(base64Data, "base64");
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, imageBuffer, { contentType: mediaType, upsert: false });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { ok: false, error: "Failed to save photo. Please try again." },
        { status: 500 }
      );
    }

    // ── Get public URL ────────────────────────────────────────────────────────
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    const photoUrl = urlData.publicUrl;

    // ── Insert submission row ─────────────────────────────────────────────────
    const { error: dbError } = await supabase.from("submissions").insert({
      name: name.trim(),
      phone: phone.trim(),
      photo_url: photoUrl,
      status: "new"
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      // Try to clean up the uploaded file
      await supabase.storage.from(BUCKET).remove([filename]);
      return NextResponse.json(
        { ok: false, error: "Failed to save submission. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit-smile error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
