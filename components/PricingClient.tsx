"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function cleanSlug(x: string) {
  return String(x || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
}

const BKASH_NUMBER = "01540501063"; // ✅ তোমার bKash number

const PLANS = [
  {
    id: "ROM99",
    name: "Romantic",
    price: 99,
    badge: "Best for most users",
    gradient: "from-fuchsia-600/30 via-rose-600/20 to-white/5",
    features: [
      "Templates Editor (10+ premium templates)",
      "Upload couple photo",
      "Drag/resize photo",
      "Move/resize text (names + quote)",
      "Text color change",
      "Soft love music player",
      "Save to cloud (per SLUG)",
      "Download PNG",
      "No watermark",
    ],
  },
  {
    id: "ULT199",
    name: "Ultimate",
    price: 199,
    badge: "Best value",
    gradient: "from-rose-600/30 via-purple-600/20 to-white/5",
    features: [
      "Everything in Romantic",
      "All Neon/Ruby templates",
      "Priority future features (quiz/game/compatibility)",
      "More export options later",
      "Best for selling/share viral",
    ],
  },
] as const;

export default function PricingClient() {
  const sp = useSearchParams();

  // optional: pricing page can receive slug like /pricing?slug=ABC123
  const initialSlug = cleanSlug(sp.get("slug") || "");
  const [slug, setSlug] = useState(initialSlug);

  const slugOk = useMemo(() => slug.length >= 3, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-white/10 border border-white/20 shadow-xl backdrop-blur p-6 sm:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Love Unlock Pricing 💘
              </h1>
              <p className="mt-2 text-white/80">
                Choose a plan → pay with bKash → enter TrxID → auto unlock ✅
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <p className="text-sm font-semibold">Your SLUG (Code)</p>
              <p className="text-xs text-white/70 mt-1">
                Unlock করার জন্য SLUG লাগবে। না থাকলে আগে Create Page করে SLUG নাও।
              </p>

              <input
                value={slug}
                onChange={(e) => setSlug(cleanSlug(e.target.value))}
                placeholder="Example: ROM99ABC"
                className="mt-2 w-full rounded-xl bg-white text-black px-3 py-2 outline-none"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/create"
                  className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 font-semibold"
                >
                  Create Page
                </Link>
                <Link
                  href={slugOk ? `/unlock?slug=${encodeURIComponent(slug)}` : "/unlock"}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    slugOk
                      ? "bg-rose-600 hover:bg-rose-500"
                      : "bg-white/10 border border-white/20 opacity-70"
                  }`}
                >
                  Go to Unlock
                </Link>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <p className="font-semibold">Step 1</p>
              <p className="text-white/80 text-sm mt-1">
                Plan select করো (99/199)
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <p className="font-semibold">Step 2</p>
              <p className="text-white/80 text-sm mt-1">
                bKash send money: <b>{BKASH_NUMBER}</b>
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <p className="font-semibold">Step 3</p>
              <p className="text-white/80 text-sm mt-1">
                Unlock page এ TrxID + sender last3 দিয়ে auto unlock ✅
              </p>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`rounded-3xl border border-white/20 bg-gradient-to-b ${p.gradient} p-6 shadow-xl`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/70 font-semibold">
                      {p.badge}
                    </p>
                    <h2 className="text-2xl font-extrabold mt-1">
                      {p.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-extrabold">
                      ৳{p.price}
                    </p>
                    <p className="text-xs text-white/70">One-time</p>
                  </div>
                </div>

                <ul className="mt-5 space-y-2 text-white/90">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 items-start">
                      <span className="mt-0.5">✅</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={
                      slugOk
                        ? `/unlock?slug=${encodeURIComponent(slug)}&plan=${p.id}`
                        : "/unlock"
                    }
                    className="flex-1 text-center px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-semibold"
                  >
                    Unlock {p.name}
                  </Link>
                  <Link
                    href="/create"
                    className="flex-1 text-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20 font-semibold"
                  >
                    Create New Page
                  </Link>
                </div>

                <p className="mt-3 text-xs text-white/70">
                  Tip: Unlock করার পর Templates Editor এ গিয়ে photo বসিয়ে Download PNG করো ✅
                </p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-10 rounded-3xl bg-white/10 border border-white/20 p-6">
            <h3 className="text-xl font-bold">FAQ</h3>

            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-white/80">
              <div>
                <p className="font-semibold text-white">SLUG কি?</p>
                <p className="mt-1">
                  SLUG হলো তোমার love page-এর unique code. Create Page করলে link/panel এ দেখাবে।
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">Unlock সাথে সাথে হবে?</p>
                <p className="mt-1">
                  হ্যাঁ, TrxID valid + unique হলে auto unlock হবে।
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">Payment না করলে?</p>
                <p className="mt-1">
                  তুমি তোমার পেমেন্ট করলেই unlock হবে। না করলেও page access হবে না।
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">Refund?</p>
                <p className="mt-1">
                  কোনো refund policy নেই। কিন্তু যদি তুমি পেমেন্ট করেছো কিন্তু unlock হয়নি, তাহলে contact করো।
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 text-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20 font-semibold"
            >
              Back to Home
            </Link>
            <Link
              href={slugOk ? `/unlock?slug=${encodeURIComponent(slug)}` : "/unlock"}
              className="flex-1 text-center px-5 py-3 rounded-2xl bg-neutral-900 text-white font-semibold"
            >
              Unlock Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
