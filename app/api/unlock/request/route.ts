import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function cleanSlug(x: string) {
  return String(x || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function normalizeTrx(trx: string) {
  return String(trx || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// No-API validation: simple + strict
function isValidTrx(trx: string) {
  // Accept 9-12 alphanumeric (common trx patterns vary; keep reasonably strict)
  return /^[A-Z0-9]{9,12}$/.test(trx);
}

function isValidLast3(x: string) {
  return /^[0-9]{3}$/.test(String(x || "").trim());
}

function planAmount(plan: string) {
  if (plan === "ROM99") return 99;
  if (plan === "ULT199") return 199;
  return null;
}

// simple ip rate limiter (no API). 2 requests / 30 minutes per IP+slug
async function rateLimit(ip: string, slug: string) {
  const key = `ip:${ip || "unknown"}:slug:${slug}`;

  const now = new Date();
  const windowMinutes = 30;

  // read existing
  const { data: existing } = await supabaseAdmin
    .from("unlock_rate_limits")
    .select("key,created_at,count")
    .eq("key", key)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabaseAdmin
      .from("unlock_rate_limits")
      .insert({ key, count: 1 });

    if (error) return { ok: false, error: "Rate limit init failed" };
    return { ok: true };
  }

  const createdAt = new Date(existing.created_at);
  const diffMin = (now.getTime() - createdAt.getTime()) / 60000;

  if (diffMin > windowMinutes) {
    // reset window
    const { error } = await supabaseAdmin
      .from("unlock_rate_limits")
      .update({ created_at: now.toISOString(), count: 1 })
      .eq("key", key);

    if (error) return { ok: false, error: "Rate limit reset failed" };
    return { ok: true };
  }

  if ((existing.count ?? 0) >= 2) {
    return { ok: false, error: "Too many attempts. Try again later." };
  }

  const { error } = await supabaseAdmin
    .from("unlock_rate_limits")
    .update({ count: (existing.count ?? 0) + 1 })
    .eq("key", key);

  if (error) return { ok: false, error: "Rate limit update failed" };
  return { ok: true };
}

export async function POST(req: Request) {
  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "unknown";
    const ua = h.get("user-agent") || "";

    const body = await req.json();
    const slug = cleanSlug(body?.slug);
    const plan = String(body?.plan || "").trim().toUpperCase();
    const trx_id = normalizeTrx(body?.trx_id);
    const sender_last3 = String(body?.sender_last3 || "").trim();

    if (!slug || slug.length < 3) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const amount = planAmount(plan);
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!isValidTrx(trx_id)) {
      return NextResponse.json(
        { error: "Invalid TrxID (use 9-12 letters/numbers)" },
        { status: 400 }
      );
    }

    if (!isValidLast3(sender_last3)) {
      return NextResponse.json(
        { error: "Sender last 3 digits must be 3 numbers" },
        { status: 400 }
      );
    }

    // rate-limit per ip+slug
    const rl = await rateLimit(ip, slug);
    if (!rl.ok) {
      return NextResponse.json({ error: rl.error }, { status: 429 });
    }

    // check slug exists
    const { data: page } = await supabaseAdmin
      .from("love_pages")
      .select("slug, plan")
      .eq("slug", slug)
      .maybeSingle();

    if (!page) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }

    // already unlocked?
    if (page.plan === "ROM99" || page.plan === "ULT199") {
      return NextResponse.json({ ok: true, already: true, plan: page.plan });
    }

    // trx uniqueness enforced by DB, but we also pre-check
    const { data: used } = await supabaseAdmin
      .from("unlock_requests")
      .select("id, trx_id")
      .eq("trx_id", trx_id)
      .maybeSingle();

    if (used) {
      return NextResponse.json(
        { error: "This TrxID already used" },
        { status: 409 }
      );
    }

    // save request log
    const { error: insErr } = await supabaseAdmin
      .from("unlock_requests")
      .insert({
        slug,
        plan,
        amount,
        trx_id,
        sender_last3,
        user_ip: ip,
        user_agent: ua,
      });

    if (insErr) {
      // unique conflict fallback
      return NextResponse.json(
        { error: "TrxID already used" },
        { status: 409 }
      );
    }

    // unlock immediately (no api, no manual)
    const { error: upErr } = await supabaseAdmin
      .from("love_pages")
      .update({ plan })
      .eq("slug", slug);

    if (upErr) {
      return NextResponse.json(
        { error: "Unlock failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, plan });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
