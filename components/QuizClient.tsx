"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function isAllowed(plan: string) {
  return plan === "CRUSH49" || plan === "ROM99" || plan === "ULT199";
}

type Q = {
  q: string;
  a: { t: string; s: number }[];
};

const QUIZ: Q[] = [
  {
    q: "When you miss someone, what do you do? 😶‍🌫️",
    a: [
      { t: "Text them instantly 💬", s: 4 },
      { t: "Wait & overthink 🤯", s: 2 },
      { t: "Write a note/poem ✍️", s: 5 },
      { t: "Act cool 😎", s: 1 },
    ],
  },
  {
    q: "Your ideal date is… 🌹",
    a: [
      { t: "Coffee + long talk ☕", s: 5 },
      { t: "Movie + snacks 🎬", s: 3 },
      { t: "Walk + street food 🚶‍♂️", s: 4 },
      { t: "Fancy dinner 🍽️", s: 2 },
    ],
  },
  {
    q: "Love language? 💞",
    a: [
      { t: "Words of affirmation 🥹", s: 5 },
      { t: "Quality time ⏳", s: 4 },
      { t: "Gifts 🎁", s: 2 },
      { t: "Acts of service 🤝", s: 3 },
    ],
  },
  {
    q: "If they’re sad, you… 🫶",
    a: [
      { t: "Listen quietly & stay 🧸", s: 5 },
      { t: "Try to make them laugh 😄", s: 4 },
      { t: "Give advice immediately 🧠", s: 2 },
      { t: "Give them space 🕊️", s: 3 },
    ],
  },
  {
    q: "How fast do you fall in love? ⚡",
    a: [
      { t: "Slow & steady 🐢", s: 4 },
      { t: "Very fast 🏎️", s: 3 },
      { t: "It depends on vibes ✨", s: 5 },
      { t: "I don’t fall 😶", s: 1 },
    ],
  },
];

function grade(total: number) {
  // Max = 25, Min = 5
  if (total >= 22) return { title: "Soulmate Energy 💘", msg: "You love deeply & honestly. Perfect for a sincere proposal." };
  if (total >= 18) return { title: "Strong Match 💞", msg: "Great vibe! A small surprise can make it unforgettable." };
  if (total >= 14) return { title: "Cute Potential 💗", msg: "You have sweet feelings—take it slow, be clear." };
  return { title: "Shy Heart 🫣", msg: "You overthink. Start with a gentle message—Love Unlock style!" };
}

export default function QuizClient({
  slug,
  plan,
  displayName,
}: {
  slug: string;
  plan: string;
  displayName: string;
}) {
  const allowed = useMemo(() => isAllowed(plan), [plan]);

  const [i, setI] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const done = scores.length === QUIZ.length;

  const total = useMemo(() => scores.reduce((a, b) => a + b, 0), [scores]);
  const result = useMemo(() => (done ? grade(total) : null), [done, total]);

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
        <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <h1 className="text-3xl font-semibold text-rose-900">Premium Feature 🔒</h1>
          <p className="mt-2 text-rose-700">
            Love Quiz unlock করতে <b>Crush (49 BDT)</b> বা তার উপরের plan লাগবে।
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

  function answer(s: number) {
    const next = [...scores, s];
    setScores(next);
    if (i < QUIZ.length - 1) setI(i + 1);
  }

  function reset() {
    setI(0);
    setScores([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-2xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
        <h1 className="text-3xl font-semibold text-rose-900">Love Quiz 💘</h1>
        <p className="mt-2 text-rose-700">
          For <b>{displayName}</b> — answer 5 questions 😄
        </p>

        {!done ? (
          <>
            <div className="mt-6 p-5 rounded-2xl bg-white shadow border border-rose-100">
              <p className="text-rose-700 text-sm">
                Question {i + 1}/{QUIZ.length}
              </p>
              <p className="mt-2 text-rose-900 font-semibold text-lg">{QUIZ[i].q}</p>

              <div className="mt-4 grid gap-3">
                {QUIZ[i].a.map((x) => (
                  <button
                    key={x.t}
                    onClick={() => answer(x.s)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-semibold hover:bg-rose-100"
                  >
                    {x.t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Link className="text-rose-700 underline" href={`/r/${slug}`}>
                ← Back
              </Link>

              <button
                className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
                onClick={reset}
              >
                Reset
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6 p-6 rounded-2xl bg-white shadow border border-rose-100">
            <p className="text-rose-700 text-sm">Your total score: {total}/25</p>
            <p className="mt-2 text-rose-900 font-semibold text-2xl">{result!.title}</p>
            <p className="mt-2 text-rose-700">{result!.msg}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Love Unlock • Love Quiz 💘\n${window.location.origin}/r/${slug}/quiz\nResult: ${result!.title}\nScore: ${total}/25`
                  );
                  alert("Copied ✅ Share now!");
                }}
              >
                Copy Result
              </button>

              <button
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold"
                onClick={reset}
              >
                Play Again
              </button>

              <Link
                className="px-5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold text-center"
                href={`/r/${slug}`}
              >
                Back to Page
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
