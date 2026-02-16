"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type LovePageRow = {
  slug: string;
  display_name: string;
  subtitle: string | null;
  plan: string;
  watermark: boolean;
  created_at: string;
  partner_choice?: string | null;
  partner_responded_at?: string | null;
};

function normalizePlan(plan: string) {
  const p = String(plan || "FREE").toUpperCase();
  if (["FREE", "CRUSH49", "ROM99", "ULT199"].includes(p)) return p;
  return "FREE";
}

function planLabel(plan: string) {
  const p = normalizePlan(plan);
  if (p === "FREE") return "Free";
  if (p === "CRUSH49") return "Crush (49)";
  if (p === "ROM99") return "Romantic (99)";
  return "Ultimate (199)";
}

function canAccess(planRaw: string, feature:
  | "open"
  | "templates"
  | "quiz"
  | "calculator"
  | "compatibility"
  | "future"
  | "game"
  | "poems"
  | "memory"
) {
  const plan = normalizePlan(planRaw);
  if (feature === "open") return true;

  // FREE: only open + (you already have share/qr inside proposal)
  if (plan === "FREE" || plan === "CRUSH49") {
    return false;
  }

  // ROM99
  if (plan === "ROM99") {
    return ["templates", "quiz", "calculator", "game"].includes(feature);
  }

  // ULT199: all
  return true;
}

const FEATURES = {
  FREE: ["Proposal page (basic)", "Stealth PIN lock", "Reveal time (optional)", "Share link + QR"],
  ROM99: ["Everything in FREE", "Templates Editor (Pro)", "Love Quiz", "Love Calculator", "Love Game"],
  ULT199: [
    "Everything in ROM99",
    "Compatibility Test + Future Prediction",
    "All premium templates",
    "Love Poems + Extras",
    "Note Memory",
    "Share Memory",
    "Full access (no upsell)",
  ],
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [pages, setPages] = useState<LovePageRow[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);

  async function loadUser() {
    setLoadingUser(true);
    setErr(null);
    try {
      const { data } = await supabaseBrowser.auth.getUser();
      setUser(data.user ?? null);
    } finally {
      setLoadingUser(false);
    }
  }

  async function signInGoogle() {
    setErr(null);
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setErr(error.message);
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    setUser(null);
    setPages([]);
  }

  async function loadPages() {
    if (!user) return;
    setLoadingPages(true);
    setErr(null);
    try {
      const { data, error } = await supabaseBrowser
        .from("love_pages")
        .select("slug,display_name,subtitle,plan,watermark,created_at,partner_choice,partner_responded_at")
        .order("created_at", { ascending: false });

      if (error) {
        setErr(error.message);
        setPages([]);
        return;
      }

      setPages((data ?? []) as any);
    } finally {
      setLoadingPages(false);
    }
  }

  async function deletePage(slug: string) {
    if (!user) return;

    const ok = confirm(`Delete page ${slug}? This is permanent.`);
    if (!ok) return;

    setBusySlug(slug);
    setErr(null);

    try {
      const { data: sess } = await supabaseBrowser.auth.getSession();
      const token = sess.session?.access_token;

      if (!token) {
        setErr("Not logged in.");
        return;
      }

      const res = await fetch("/api/page/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data?.error ?? "Delete failed");
        return;
      }

      setPages((prev) => prev.filter((p) => p.slug !== slug));
    } finally {
      setBusySlug(null);
    }
  }

  async function copySlug(slug: string) {
    try {
      await navigator.clipboard.writeText(slug);
      setErr(null);
    } catch {
      setErr("Copy failed (browser permission).");
    }
  }

  useEffect(() => {
    loadUser();
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(() => {
      loadUser();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const topPlan = useMemo(() => {
    const ranks: any = { FREE: 0, CRUSH49: 1, ROM99: 2, ULT199: 3 };
    let best = "FREE";
    for (const p of pages) {
      const plan = normalizePlan(p.plan);
      if (ranks[plan] > ranks[best]) best = plan;
    }
    return best;
  }, [pages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950 px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-white/10 backdrop-blur shadow p-5 sm:p-7 border border-white/15">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Love Unlock Dashboard</h1>
              <p className="mt-1 text-white/70 text-sm">Create pages • manage premium • open features</p>
            </div>

            <div className="flex gap-2">
              <Link href="/create" className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold">
                Create New
              </Link>

              {!loadingUser && user ? (
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={signInGoogle}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 font-extrabold"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </div>

          {err && (
            <div className="mt-4 rounded-xl bg-rose-500/15 border border-rose-400/30 p-3 text-rose-200 text-sm">
              {err}
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-white/10 border border-white/15 p-4">
            {loadingUser ? (
              <p className="text-white/70">Checking session...</p>
            ) : user ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-white">
                  <p className="font-semibold">
                    Logged in: <span className="text-white/80">{user.email}</span>
                  </p>
                  <p className="text-xs text-white/60">Best plan detected: {planLabel(topPlan)}</p>
                </div>
                <div className="text-white/70 text-sm">
                  Premium unlock করলে dashboard-এ extra features unlock হবে ✅
                </div>
              </div>
            ) : (
              <div className="text-white/80">
                <p className="font-semibold">Login required</p>
                <p className="text-sm text-white/70 mt-1">
                  Dashboard + premium feature access পেতে Google দিয়ে sign in করো।
                </p>
              </div>
            )}
          </div>

          {/* Plan cards */}
          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <PlanCard
              title="FREE"
              subtitle="Everyone can use"
              features={FEATURES.FREE}
              active={topPlan === "FREE" || topPlan === "CRUSH49" || topPlan === "ROM99" || topPlan === "ULT199"}
            />
            <PlanCard
              title="ROM99"
              subtitle="Limited premium features"
              features={FEATURES.ROM99}
              active={topPlan === "ROM99" || topPlan === "ULT199"}
              upsell={topPlan === "FREE" || topPlan === "CRUSH49"}
            />
            <PlanCard
              title="ULT199"
              subtitle="All features unlocked"
              features={FEATURES.ULT199}
              active={topPlan === "ULT199"}
              upsell={topPlan !== "ULT199"}
            />
          </div>

          {/* Pages list */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-extrabold text-lg">Your Pages</h2>
              {user && (
                <button
                  onClick={loadPages}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold"
                >
                  Refresh
                </button>
              )}
            </div>

            {!user ? (
              <p className="mt-3 text-white/60 text-sm">Login করলে এখানে তোমার pages দেখাবে।</p>
            ) : loadingPages ? (
              <p className="mt-3 text-white/70">Loading pages...</p>
            ) : pages.length === 0 ? (
              <div className="mt-3 rounded-2xl bg-white/10 border border-white/15 p-4 text-white/70">
                No pages yet. Click <b>Create New</b> to make your first page ✅
              </div>
            ) : (
              <div className="mt-3 grid gap-4">
                {pages.map((p) => {
                  const plan = normalizePlan(p.plan);
                  const partnerText =
                    p.partner_choice === "YES"
                      ? "✅ Congratulations! Your partner selected YES."
                      : p.partner_choice === "NO"
                      ? "💔 Sorry! Your partner selected NO."
                      : "No response yet";

                  return (
                    <div key={p.slug} className="relative w-full rounded-2xl bg-white/10 border border-white/15 p-5">
                      {/* header row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-white font-extrabold text-xl truncate">{p.display_name}</p>
                          <p className="text-white/70 text-sm truncate">{p.subtitle || "No subtitle"}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/60">
                            <span className="inline-flex items-center gap-2">
                              Code: <b className="text-white">{p.slug}</b>
                              <button
                                onClick={() => copySlug(p.slug)}
                                className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/15"
                                title="Copy code"
                              >
                                📋
                              </button>
                            </span>

                            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/80">
                              {planLabel(plan)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => deletePage(p.slug)}
                          disabled={busySlug === p.slug}
                          title="Delete this page"
                          className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 disabled:opacity-60"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Partner response box */}
                      <div className="mt-4 rounded-2xl bg-white/10 border border-white/15 p-3 text-white/80">
                        <p className="text-xs text-white/60">Partner response</p>
                        <p className="mt-1 font-semibold">{partnerText}</p>
                        {p.partner_responded_at && (
                          <p className="mt-1 text-xs text-white/50">
                            {new Date(p.partner_responded_at).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Buttons grid (all visible, plan-gated) */}
                      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <FeatureBtn href={`/r/${p.slug}?unlocked=1`} enabled={true} label="Open" variant="dark" />
                        <FeatureBtn href={`/r/${p.slug}/templates`} enabled={canAccess(plan, "templates")} label="Templates" />
                        <FeatureBtn href={`/r/${p.slug}/quiz`} enabled={canAccess(plan, "quiz")} label="Love Quiz" />
                        <FeatureBtn href={`/r/${p.slug}/calculator`} enabled={canAccess(plan, "calculator")} label="Calculator" />

                        <FeatureBtn href={`/r/${p.slug}/compatibility`} enabled={canAccess(plan, "compatibility")} label="Compatibility" />
                        <FeatureBtn href={`/r/${p.slug}/future`} enabled={canAccess(plan, "future")} label="Future" />
                        <FeatureBtn href={`/r/${p.slug}/game`} enabled={canAccess(plan, "game")} label="Love Game" />

                        {/* poems is global in your project right now */}
                        <FeatureBtn href={`/poems`} enabled={canAccess(plan, "poems")} label="Love Poems" />

                        {/* placeholder */}
                        <FeatureBtn href={`#`} enabled={canAccess(plan, "memory")} label="Memory Sharing" />
                      </div>

                      {busySlug === p.slug && <p className="mt-3 text-xs text-white/60">Deleting...</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="mt-10 text-center text-xs text-white/50">Love Unlock • Dashboard</p>
        </div>
      </div>
    </div>
  );
}

function FeatureBtn({
  href,
  enabled,
  label,
  variant,
}: {
  href: string;
  enabled: boolean;
  label: string;
  variant?: "dark" | "rose";
}) {
  const base =
    "block text-center py-2.5 rounded-xl font-semibold border transition select-none";
  const unlocked =
    variant === "dark"
      ? "bg-neutral-900 text-white border-neutral-900 hover:opacity-95"
      : variant === "rose"
      ? "bg-rose-600 text-white border-rose-600 hover:opacity-95"
      : "bg-white/10 text-white border-white/20 hover:bg-white/15";

  const locked =
    "bg-white/5 text-white/40 border-white/10 cursor-not-allowed";

  if (!enabled) {
    return (
      <div className={`${base} ${locked}`} title="Premium Feature 🔒">
        {label} <span className="ml-1">🔒</span>
      </div>
    );
  }

  // placeholder (Memory Sharing for now)
  if (href === "#") {
    return (
      <div className={`${base} ${unlocked}`} title="Coming soon">
        {label} <span className="ml-1 text-white/70">(soon)</span>
      </div>
    );
  }

  return (
    <a className={`${base} ${unlocked}`} href={href}>
      {label}
    </a>
  );
}

function PlanCard({
  title,
  subtitle,
  features,
  active,
  upsell,
}: {
  title: string;
  subtitle: string;
  features: string[];
  active?: boolean;
  upsell?: boolean;
}) {
  const isUlt = title === "ULT199";
  const isRom = title === "ROM99";

  return (
    <div className={`rounded-2xl p-5 border shadow-sm ${active ? "bg-white/12 border-white/25" : "bg-white/8 border-white/15"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-white font-extrabold text-xl">{title}</p>
          <p className="text-white/70 text-sm">{subtitle}</p>
        </div>

        {active ? (
          <span className="px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-200 text-xs font-bold border border-emerald-300/20">
            Active
          </span>
        ) : upsell ? (
          <span className="px-3 py-1 rounded-full bg-rose-400/15 text-rose-200 text-xs font-bold border border-rose-300/20">
            Unlock?
          </span>
        ) : null}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-white/80">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="opacity-80">•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {upsell && (isRom || isUlt) && (
        <div className="mt-4">
          <a href="/pricing" className="block text-center py-2.5 rounded-xl bg-rose-600 text-white font-extrabold">
            Unlock {title}
          </a>
        </div>
      )}
    </div>
  );
}
