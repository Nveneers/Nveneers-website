import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { signCookie, cookieOptions } from "@/lib/adminAuth";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still run a comparison to avoid leaking length via timing
    timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME ?? "";
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

    const usernameOk = safeEqual(String(username ?? ""), expectedUsername);
    const passwordOk = safeEqual(String(password ?? ""), expectedPassword);

    if (!usernameOk || !passwordOk) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const cookieValue = signCookie(username);
    const response = NextResponse.json({ ok: true });
    response.cookies.set({ ...cookieOptions, value: cookieValue });
    return response;
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
