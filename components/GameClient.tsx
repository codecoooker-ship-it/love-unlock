"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function isGameAllowed(plan: string) {
  return plan === "ROM99" || plan === "ULT199";
}

export default function GameClient({
  slug,
  plan,
  displayName,
}: {
  slug: string;
  plan: string;
  displayName: string;
}) {
  const allowed = useMemo(() => isGameAllowed(plan), [plan]);
  const [revealed, setRevealed] = useState(false);
  const [taps, setTaps] = useState(0);

  // “Hidden reveal” mechanic: 10 taps unlocks reveal
  const progress = Math.min(100, Math.floor((taps / 10) * 100));

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
        <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <h1 className="text-3xl font-semibold text-rose-900">Premium Feature 🔒</h1>
          <p className="mt-2 text-rose-700">
            Hidden Reveal Game play করতে <b>Romantic (99 BDT)</b> বা <b>Ultimate (199 BDT)</b> unlock লাগবে।
          </p>

          <div className="mt-6 p-4 rounded-xl bg-white border border-rose-200">
            <p className="text-rose-900 font-semibold">How to unlock</p>
            <ol className="mt-2 text-sm text-rose-800 list-decimal ml-5 space-y-1">
              <li>bKash/Nagad এ payment করো</li>
              <li>তোমার page code/slug পাঠাও: <b>{slug}</b></li>
              <li>আমি unlock করে দেব (ROM99/ULT199)</li>
            </ol>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              className="flex-1 text-center py-2.5 rounded-xl bg-rose-600 text-white font-semibold"
              href="/pricing"
            >
              View Packages
            </Link>
            <Link
              className="flex-1 text-center py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
              href={`/r/${slug}`}
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
        <h1 className="text-3xl font-semibold text-rose-900">Hidden Reveal Game 💝</h1>
        <p className="mt-2 text-rose-700">
          Tap করে secret message reveal করো, <b>{displayName}</b> 😄
        </p>

        <div
          onClick={() => setTaps((x) => x + 1)}
          className="mt-8 p-8 rounded-2xl bg-white shadow cursor-pointer select-none border border-rose-100"
        >
          {!revealed ? (
            <>
              <p className="text-rose-900 font-semibold text-lg">Tap to reveal…</p>
              <p className="mt-2 text-rose-700 text-sm">Progress: {progress}%</p>
              <div className="mt-3 h-3 w-full bg-rose-100 rounded-full overflow-hidden">
                <div className="h-3 bg-rose-500" style={{ width: `${progress}%` }} />
              </div>

              {taps >= 10 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRevealed(true);
                  }}
                  className="mt-5 w-full py-2.5 rounded-xl bg-rose-600 text-white font-semibold"
                >
                  Reveal Now 💌
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-rose-900 font-semibold text-xl">Secret Message 💖</p>
              <p className="mt-3 text-rose-700 whitespace-pre-wrap">
                "তোমাকে অনেকদিন ধরে বলতে চাই… তুমি আমার সবচেয়ে প্রিয় মানুষ। 💞"
              </p>
              <p className="mt-5 text-xs text-rose-500">Share this moment with Love Unlock</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            className="flex-1 text-center py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
            href={`/r/${slug}`}
          >
            Back
          </Link>
          <button
            className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
            onClick={() => {
              setTaps(0);
              setRevealed(false);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
