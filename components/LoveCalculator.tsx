"use client";

import { useMemo, useState } from "react";

function hashScore(a: string, b: string) {
  const s = (a + "|" + b).toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 51) + 50; // 50-100
}

export default function LoveCalculatorClient({ slug }: { slug: string }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const score = useMemo(() => (a && b ? hashScore(a, b) : null), [a, b]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-rose-900">Love Calculator</h1>
            <p className="mt-2 text-rose-700 text-sm">Fun only 😄 Share it!</p>
          </div>
          <div className="text-xs text-rose-700 bg-white/60 border border-rose-200 rounded-xl px-3 py-2">
            Code: <b className="text-rose-900">{slug}</b>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <input
            className="border border-rose-200 rounded-xl px-3 py-2 bg-white"
            placeholder="Your name"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
          <input
            className="border border-rose-200 rounded-xl px-3 py-2 bg-white"
            placeholder="Crush name"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </div>

        {score !== null && (
          <div className="mt-6 p-5 rounded-2xl bg-white shadow">
            <p className="text-rose-900 font-semibold">Match: {score}%</p>
            <p className="mt-1 text-rose-700">
              {score > 90 ? "Destiny vibes 💘" : score > 75 ? "Strong connection 💞" : "Cute potential 💗"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
