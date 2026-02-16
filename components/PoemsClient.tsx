"use client";

import { useMemo } from "react";

export default function PoemsClient({ slug }: { slug: string }) {
  // চাইলে এখানে DB থেকে poems লোড করা যাবে
  const poems = useMemo(
    () => [
      {
        title: "For You 💗",
        body: "Every heartbeat writes your name,\nEvery silence calls you home.\nIf love is a prayer,\nYou are my forever Amen.",
      },
      {
        title: "Midnight Letter 🌙",
        body: "In the quiet of night,\nI find you in my thoughts.\nA thousand words remain,\nBut my heart says: stay.",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-2xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-rose-900">Love Poems</h1>
            <p className="mt-2 text-rose-700 text-sm">Cute & romantic poems 💌</p>
          </div>
          <div className="text-xs text-rose-700 bg-white/60 border border-rose-200 rounded-xl px-3 py-2">
            Code: <b className="text-rose-900">{slug}</b>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {poems.map((p) => (
            <div key={p.title} className="rounded-2xl bg-white border border-rose-100 shadow-sm p-5">
              <p className="text-rose-900 font-extrabold text-lg">{p.title}</p>
              <pre className="mt-2 whitespace-pre-wrap text-rose-700 leading-relaxed">
                {p.body}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
