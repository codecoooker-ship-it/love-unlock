import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import crypto from "crypto";
import bcrypt from "bcryptjs";

function makeSlug(len = 7) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function normSlug(s: string) {
  return String(s ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function safeText(v: any) {
  return String(v ?? "").trim();
}

export async function POST(req: Request) {
  try {
    // ✅ read bearer token (sent from client)
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    if (!token) {
      return NextResponse.json({ error: "Unauthorized (no token)" }, { status: 401 });
    }

    // ✅ verify user from token (service role can verify)
    const { data: userRes, error: userErr } = await supabaseAdmin.auth.getUser(token);
    const user = userRes?.user;

    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized (invalid token)" }, { status: 401 });
    }

    const body = await req.json();

    const display_name = safeText(body.display_name);
    const subtitle = safeText(body.subtitle);
    const message = safeText(body.message);
    const pin = safeText(body.pin);

    // reveal_at can be "" | null | ISO string
    const revealRaw = body.reveal_at ? String(body.reveal_at).trim() : "";
    const reveal_at =
      revealRaw && !Number.isNaN(Date.parse(revealRaw)) ? revealRaw : null;

    if (!display_name || !message) {
      return NextResponse.json({ error: "Missing display_name or message" }, { status: 400 });
    }

    if (!pin || pin.length < 4) {
      return NextResponse.json({ error: "PIN must be at least 4 digits" }, { status: 400 });
    }

    let slug = normSlug(makeSlug(7));
    const edit_secret = crypto.randomBytes(16).toString("hex");
    const pin_hash = await bcrypt.hash(pin, 10);

    // ✅ retry slug collision (case-insensitive safe)
    for (let i = 0; i < 12; i++) {
      const { data: exists, error: exErr } = await supabaseAdmin
        .from("love_pages")
        .select("id")
        .ilike("slug", slug)
        .limit(1)
        .maybeSingle();

      // if DB error, break with message
      if (exErr) {
        return NextResponse.json({ error: `Slug check failed: ${exErr.message}` }, { status: 500 });
      }

      if (!exists) break;
      slug = normSlug(makeSlug(7));
    }

    const { error } = await supabaseAdmin.from("love_pages").insert({
      slug,
      owner_id: user.id, // ✅ dashboard ownership
      display_name,
      subtitle: subtitle || null,
      message,
      stealth_enabled: true,
      pin_hash,
      reveal_at, // ✅ valid ISO or null
      plan: "FREE",
      watermark: true,
      edit_secret,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ slug, edit_secret });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
