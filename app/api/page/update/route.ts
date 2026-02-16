import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();
  const slug = String(body.slug ?? "").toUpperCase();
  const edit_secret = String(body.edit_secret ?? "");

  const { data: page } = await supabase
    .from("love_pages")
    .select("id,edit_secret")
    .eq("slug", slug)
    .single();

  if (!page || page.edit_secret !== edit_secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patch: any = {};
  if (typeof body.stealth_enabled === "boolean") patch.stealth_enabled = body.stealth_enabled;
  if (body.reveal_at !== undefined) patch.reveal_at = body.reveal_at;

  const { error } = await supabase.from("love_pages").update(patch).eq("id", page.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
