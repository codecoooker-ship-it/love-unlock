import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function parseCookieHeader(cookieHeader: string) {
  const out: { name: string; value: string }[] = [];
  if (!cookieHeader) return out;

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const p = part.trim();
    if (!p) continue;

    const eq = p.indexOf("=");
    if (eq === -1) continue;

    const name = p.slice(0, eq).trim();
    const value = p.slice(eq + 1).trim();
    if (!name) continue;

    out.push({ name, value: decodeURIComponent(value) });
  }
  return out;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;

  // ✅ Response আগে বানাই — cookie set এখানেই হবে
  const response = NextResponse.redirect(`${origin}/dashboard`);

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // ✅ request cookie header থেকে getAll বানালাম
          getAll: () => parseCookieHeader(request.headers.get("cookie") ?? ""),
          // ✅ cookie set হবে response.cookies এ
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
