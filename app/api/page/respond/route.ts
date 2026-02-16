import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function cleanSlug(slug: string) {
  return String(slug || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = cleanSlug(body?.slug);
    const choice = String(body?.choice || "").toUpperCase();

    if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    if (choice !== "YES" && choice !== "NO") {
      return NextResponse.json({ error: "Invalid choice" }, { status: 400 });
    }

    // update latest row by slug (just in case)
    const { data: row, error: findErr } = await supabaseAdmin
      .from("love_pages")
      .select("id")
      .eq("slug", slug)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findErr || !row?.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { error: upErr } = await supabaseAdmin
      .from("love_pages")
      .update({
        partner_choice: choice,
        partner_responded_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
