import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const slug = String(form.get("slug") ?? "").trim().toUpperCase();

  if (!file || !slug) {
    return NextResponse.json({ error: "Missing file or slug" }, { status: 400 });
  }

  // Only basic image types
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const data = new Uint8Array(bytes);

  const ext = file.type.includes("png")
    ? "png"
    : file.type.includes("webp")
    ? "webp"
    : "jpg";

  const filename = `${slug}/photo-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("templates")
    .upload(filename, data, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: pub } = supabaseAdmin.storage.from("templates").getPublicUrl(filename);
  return NextResponse.json({ ok: true, photo_url: pub.publicUrl });
}
