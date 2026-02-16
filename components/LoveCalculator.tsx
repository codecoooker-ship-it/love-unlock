"use client";

import { useMemo, useState } from "react";

function hashScore(a: string, b: string) {
  const s = (a + "|" + b).toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return (h % 51) + 50;
}

export default function LoveCalculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const score = useMemo(() => {
    if (!a || !b) return null;
    return hashScore(a, b);
  }, [a, b]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-xl mx-auto rounded-2xl bg-white/80 backdrop-blur shadow p-6">
        <h1 className="text-3xl font-semibold text-rose-900">
          Love Calculator 💘
        </h1>

        <div className="mt-6 grid gap-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Your name"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />

          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Partner name"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </div>

        {score !== null && (
          <div className="mt-6 p-5 rounded-2xl bg-white shadow">
            <p className="text-rose-900 font-semibold text-xl">
              Match: {score}%
            </p>

            <p className="mt-1 text-rose-700">
              {score > 90
                ? "Perfect match 💍"
                : score > 75
                ? "Strong love 💞"
                : "Cute connection 💗"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
