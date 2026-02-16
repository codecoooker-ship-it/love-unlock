import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();

  const slug = String(body.slug ?? "").trim().toUpperCase();
  const imageDataUrl = String(body.imageDataUrl ?? "");
  const photo_url = body.photo_url ? String(body.photo_url) : null;
  const meta = body.meta ?? null;

  if (!slug || !imageDataUrl.startsWith("data:image/png;base64,")) {
    return NextResponse.json({ error: "Missing slug or imageDataUrl" }, { status: 400 });
  }

  const base64 = imageDataUrl.split(",")[1];
  const buffer = Buffer.from(base64, "base64");
  const filename = `${slug}/template-${Date.now()}.png`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("templates")
    .upload(filename, buffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: pub } = supabaseAdmin.storage.from("templates").getPublicUrl(filename);
  const image_url = pub.publicUrl;

  const { error: dbError } = await supabaseAdmin
    .from("love_templates")
    .insert({ slug, image_url, photo_url, meta });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, image_url });
}
