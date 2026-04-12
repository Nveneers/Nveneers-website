import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/adminAuth";

// Middleware runs on the Edge runtime which does not support Node.js crypto.
// We do a lightweight cookie-presence check here to redirect unauthenticated
// visitors to the login page. Full HMAC signature verification happens in the
// server components and API routes (Node runtime) before any data is served.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
