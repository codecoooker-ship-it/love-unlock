// app/api/page/[slug]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePlan, verifyPin } from "@/lib/helpers";

function normSlug(slug: any) {
  return String(slug ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params; // ✅ Next.js 15
  const SLUG = normSlug(slug);

  if (!SLUG) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  // ✅ Public read via RPC (SAFE, doesn't open whole table)
  const { data, error } = await supabase.rpc("get_love_page_public", {
    p_slug: SLUG,
  });

  const row = Array.isArray(data) ? data[0] : null;

  if (error || !row) {
    return NextResponse.json(
      { error: error?.message ?? "Not found", slug: SLUG },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...row,
    plan: normalizePlan(row.plan),
  });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params; // ✅ Next.js 15
  const SLUG = normSlug(slug);

  if (!SLUG) return NextResponse.json({ ok: false }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const pin = String(body?.pin ?? "").trim();

  if (!pin) return NextResponse.json({ ok: false }, { status: 400 });

  // ✅ Pin hash should NOT be public: use service role to fetch it
  const { data, error } = await supabaseAdmin
    .from("love_pages")
    .select("pin_hash")
    .eq("slug", SLUG)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data?.pin_hash) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const ok = await verifyPin(pin, data.pin_hash);
  return NextResponse.json({ ok });
}
