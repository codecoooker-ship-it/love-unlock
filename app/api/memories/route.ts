import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PLAN_LIMITS, normalizePlan } from "@/lib/helpers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = String(url.searchParams.get("slug") ?? "").toUpperCase();

  const { data: page } = await supabase.from("love_pages").select("id").eq("slug", slug).single();
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data } = await supabase
    .from("memories")
    .select("id,memory_date,title,note,photo_url,created_at")
    .eq("page_id", page.id)
    .order("memory_date", { ascending: true });

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  const slug = String(body.slug ?? "").toUpperCase();
  const edit_secret = String(body.edit_secret ?? "");

  const { data: page } = await supabase
    .from("love_pages")
    .select("id,plan,edit_secret")
    .eq("slug", slug)
    .single();

  if (!page || page.edit_secret !== edit_secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = normalizePlan(page.plan);
  const limit = PLAN_LIMITS[plan].memories;

  const { count } = await supabase
    .from("memories")
    .select("*", { count: "exact", head: true })
    .eq("page_id", page.id);

  if ((count ?? 0) >= limit) {
    return NextResponse.json({ error: `Memory limit reached for ${plan}` }, { status: 403 });
  }

  const { error } = await supabase.from("memories").insert({
    page_id: page.id,
    memory_date: body.memory_date,
    title: body.title,
    note: body.note ?? null,
    photo_url: body.photo_url ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
