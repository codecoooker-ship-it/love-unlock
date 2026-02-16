"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function isAllowed(plan: string) {
  return plan === "ROM99" || plan === "ULT199";
}

const CARDS = [
  {
    title: "Next 7 Days 💌",
    body: "A sweet message is coming. If you speak your heart—response will be positive ✨",
  },
  {
    title: "Next Date 🌹",
    body: "A simple walk + tea/coffee will turn into a memory. Keep it surprise-style 💕",
  },
  {
    title: "Your Strength 💪",
    body: "You love deeply. That’s rare. Be confident—your sincerity is your charm 💖",
  },
  {
    title: "Couple Vibe 💞",
    body: "You both match in calm energy. Small efforts will create big feelings ✨",
  },
  {
    title: "Lucky Sign 🍀",
    body: "Friday evening vibes. Choose a soft gift: chocolate/flower note—perfect 💝",
  },
  {
    title: "Secret Hint 🔮",
    body: "The person already notices you. Don’t overthink. Say it gently 🫶",
  },
];

function pick3(seed: string) {
  // deterministic selection based on slug (so it feels consistent per page)
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const idxs = new Set<number>();
  while (idxs.size < 3) {
    h = (h * 1103515245 + 12345) >>> 0;
    idxs.add(h % CARDS.length);
  }
  return [...idxs].map((i) => CARDS[i]);
}

export default function FutureClient({
  slug,
  plan,
  displayName,
}: {
  slug: string;
  plan: string;
  displayName: string;
}) {
  const allowed = useMemo(() => isAllowed(plan), [plan]);
  const [revealed, setRevealed] = useState(false);

  const cards = useMemo(() => pick3(slug), [slug]);

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
        <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <h1 className="text-3xl font-semibold text-rose-900">Premium Feature 🔒</h1>
          <p className="mt-2 text-rose-700">
            Future Prediction unlock করতে <b>Romantic (99 BDT)</b> বা <b>Ultimate (199 BDT)</b> লাগবে।
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <h1 className="text-3xl font-semibold text-rose-900">Future Prediction 🔮</h1>
          <p className="mt-2 text-rose-700">
            For <b>{displayName}</b> — romantic style only 😄
          </p>

          {!revealed ? (
            <div className="mt-8">
              <div className="p-6 rounded-2xl bg-white shadow border border-rose-100 text-center">
                <p className="text-rose-900 font-semibold text-lg">Ready for 3 romantic cards? 💝</p>
                <p className="mt-2 text-rose-700 text-sm">
                  Click reveal—then you can copy & share.
                </p>
                <button
                  onClick={() => setRevealed(true)}
                  className="mt-5 px-6 py-3 rounded-xl bg-rose-600 text-white font-semibold shadow hover:opacity-95"
                >
                  Reveal Cards ✨
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                {cards.map((c) => (
                  <div key={c.title} className="p-5 rounded-2xl bg-white shadow border border-rose-100">
                    <p className="text-rose-900 font-semibold">{c.title}</p>
                    <p className="mt-2 text-rose-700 text-sm whitespace-pre-wrap">{c.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
                  onClick={() => {
                    const txt = cards
                      .map((c) => `${c.title}\n${c.body}`)
                      .join("\n\n");

                    navigator.clipboard.writeText(
                      `Love Unlock • Future Prediction 🔮\n${window.location.origin}/r/${slug}/future\n\n${txt}`
                    );
                    alert("Copied ✅ এখন share করো!");
                  }}
                >
                  Copy to Share
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
                  onClick={() => setRevealed(false)}
                >
                  Hide Again
                </button>

                <Link
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-center"
                  href={`/r/${slug}`}
                >
                  Back to Page
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
