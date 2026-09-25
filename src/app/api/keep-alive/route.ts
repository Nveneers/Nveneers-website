import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Called daily by Vercel Cron (see vercel.json) so the free-tier Supabase
// project never goes 7 days without activity and gets auto-paused.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { error } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Keep-alive query failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
