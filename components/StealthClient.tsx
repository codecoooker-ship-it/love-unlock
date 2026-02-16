"use client";

import { useMemo, useState } from "react";

export default function StealthClient({ slug }: { slug: string }) {
  const [taps, setTaps] = useState(0);
  const unlockedByTap = useMemo(() => taps >= 5, [taps]);
  const [pin, setPin] = useState("");

  async function verify() {
    const res = await fetch(`/api/page/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) return alert("Wrong PIN ❌");

    window.location.href = `/r/${slug}?unlocked=1`;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow p-6">
        <h1 className="text-xl font-semibold text-neutral-900">Personal Archive</h1>
        <p className="text-neutral-500 text-sm mt-1">Private notes & memories</p>

        <div
          className="mt-6 rounded-xl border border-neutral-200 p-4 cursor-pointer select-none"
          onClick={() => setTaps((x) => x + 1)}
        >
          <p className="text-neutral-700">Tap here to open</p>
          <p className="text-neutral-400 text-xs mt-1">({taps}/5)</p>
        </div>

        {unlockedByTap && (
          <div className="mt-5">
            <label className="text-sm text-neutral-700">Enter PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-2 w-full border rounded-xl px-3 py-2"
              placeholder="****"
            />
            <button
              onClick={verify}
              className="mt-3 w-full py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
            >
              Unlock 💖
            </button>
          </div>
        )}

        <p className="mt-5 text-xs text-neutral-400">
          Stealth mode hides romantic content until unlocked.
        </p>
      </div>
    </div>
  );
}
