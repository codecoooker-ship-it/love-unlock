import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const adminKey = req.headers.get("x-admin-key");
  const body = await req.json();

  const { slug, plan } = body;

  // ✅ এখন env থেকে key নিবে
  const SECRET = process.env.LOVE_UNLOCK_ADMIN_KEY;

  if (!SECRET || adminKey !== SECRET) {
    return NextResponse.json(
      { error: "Invalid admin key" },
      { status: 401 }
    );
  }

  if (!slug || !plan) {
    return NextResponse.json(
      { error: "Missing slug or plan" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("love_pages")
    .update({ plan })
    .eq("slug", slug.toUpperCase());

  if (error) {
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
