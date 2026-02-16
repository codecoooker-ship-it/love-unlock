import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || "").trim().toUpperCase();

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.rpc("bump_page_view", {
      p_slug: slug,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          hint: (error as any).hint ?? null,
          details: (error as any).details ?? null,
          code: (error as any).code ?? null,
        },
        { status: 500 }
      );
    }

    const row = data?.[0];

    return NextResponse.json({
      ok: true,
      views: row?.out_views ?? null,
      first_opened_at: row?.out_first_opened_at ?? null,
      last_opened_at: row?.out_last_opened_at ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
