import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // ✅ important (Buffer/Node APIs)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ server-only
);

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const slug = String(form.get("slug") ?? "").trim().toUpperCase();

  if (!file || !slug) {
    return NextResponse.json({ error: "Missing file or slug" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const data = new Uint8Array(bytes);

  const filename = `${slug}/${Date.now()}.png`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("templates")
    .upload(filename, data, {
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
    .insert({ slug, image_url });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, image_url });
}
