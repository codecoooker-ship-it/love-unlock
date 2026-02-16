// app/api/page/delete/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function normSlug(slug: any) {
  return String(slug ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) {
    return NextResponse.json({ error: "Unauthorized (no token)" }, { status: 401 });
  }

  // ✅ verify user from token
  const { data: userRes, error: userErr } = await supabaseAdmin.auth.getUser(token);
  const user = userRes?.user;

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized (invalid token)" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const SLUG = normSlug(body?.slug);

  if (!SLUG) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  // ✅ ensure it's their page
  const { data: row, error: findErr } = await supabaseAdmin
    .from("love_pages")
    .select("id, owner_id")
    .eq("slug", SLUG)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findErr || !row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden (not your page)" }, { status: 403 });
  }

  // ✅ permanent delete (memories will cascade because FK on delete cascade)
  const { error: delErr } = await supabaseAdmin
    .from("love_pages")
    .delete()
    .eq("id", row.id);

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug: SLUG });
}
