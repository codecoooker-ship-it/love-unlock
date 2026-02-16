"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function isAllowed(plan: string) {
  return plan === "ROM99" || plan === "ULT199";
}

function score(a: string, b: string) {
  const s = (a + "|" + b).toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return (h % 41) + 60; // 60-100
}

export default function CompatibilityClient({
  slug,
  plan,
  displayName,
}: {
  slug: string;
  plan: string;
  displayName: string;
}) {
  const allowed = useMemo(() => isAllowed(plan), [plan]);

  const [you, setYou] = useState("");
  const [crush, setCrush] = useState("");
  const [result, setResult] = useState<number | null>(null);

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
        <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <h1 className="text-3xl font-semibold text-rose-900">Premium Feature 🔒</h1>
          <p className="mt-2 text-rose-700">
            Compatibility test চালাতে <b>Romantic (99 BDT)</b> বা <b>Ultimate (199 BDT)</b> unlock লাগবে।
          </p>

          <div className="mt-6 flex gap-3">
            <Link className="flex-1 text-center py-2.5 rounded-xl bg-rose-600 text-white font-semibold" href="/pricing">
              Unlock Now
            </Link>
            <Link className="flex-1 text-center py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold" href={`/r/${slug}`}>
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function calc() {
    if (!you.trim() || !crush.trim()) return alert("দুইটা নাম দাও 🙂");
    setResult(score(you.trim(), crush.trim()));
  }

  const text =
    result === null
      ? ""
      : result >= 92
      ? "Destiny Match 💘 (খুব strong!)"
      : result >= 80
      ? "Strong Connection 💞"
      : "Cute Potential 💗";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
        <h1 className="text-3xl font-semibold text-rose-900">Compatibility Test 💑</h1>
        <p className="mt-2 text-rose-700">
          For <b>{displayName}</b> — fun & romantic only 😄
        </p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full border border-rose-200 rounded-xl px-3 py-2 bg-white text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="Your name"
            value={you}
            onChange={(e) => setYou(e.target.value)}
          />
          <input
            className="w-full border border-rose-200 rounded-xl px-3 py-2 bg-white text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="Your partner/crush name"
            value={crush}
            onChange={(e) => setCrush(e.target.value)}
          />

          <button
            onClick={calc}
            className="w-full py-3 rounded-xl bg-rose-600 text-white font-semibold shadow hover:opacity-95"
          >
            Calculate 💖
          </button>
        </div>

        {result !== null && (
          <div className="mt-6 p-6 rounded-2xl bg-white shadow border border-rose-100">
            <p className="text-rose-900 font-semibold text-lg">Score: {result}%</p>
            <p className="mt-1 text-rose-700">{text}</p>

            <div className="mt-4 flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Love Unlock Compatibility 💑\n${you} + ${crush} = ${result}%\n${window.location.origin}/r/${slug}/compatibility`
                  );
                  alert("Copied! এখন share করো ✅");
                }}
              >
                Copy to Share
              </button>

              <button
                className="flex-1 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
                onClick={() => setResult(null)}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link className="inline-block text-rose-700 underline" href={`/r/${slug}`}>
            ← Back to page
          </Link>
        </div>
      </div>
    </div>
  );
}
