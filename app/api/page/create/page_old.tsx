"use client";

import { useState } from "react";

export default function Create() {
  const [display_name, setDisplayName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [message, setMessage] = useState("");
  const [pin, setPin] = useState("");
  const [reveal_at, setRevealAt] = useState("");
  const [result, setResult] = useState<{ slug: string; edit_secret: string } | null>(null);

  async function submit() {
    const res = await fetch("/api/page/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name,
        subtitle,
        message,
        pin,
        reveal_at: reveal_at || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error ?? "Error");

    setResult(data);
    localStorage.setItem(`love_unlock_secret_${data.slug}`, data.edit_secret);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-6">
        <h1 className="text-3xl font-semibold text-rose-900">Create your Love Page</h1>
        <p className="mt-2 text-rose-700 text-sm">
          Stealth mode default ON — PIN ছাড়া reveal হবে না।
        </p>

        {!result ? (
          <div className="mt-6 space-y-4">
            <input
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Display name (Nickname)"
              value={display_name}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Subtitle (optional)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <textarea
              className="w-full border rounded-xl px-3 py-2 min-h-[120px]"
              placeholder="Your proposal message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              className="w-full border rounded-xl px-3 py-2"
              placeholder="PIN (min 4 digits)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <input
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Reveal time (optional) e.g. 2026-02-14T00:00:00+06:00"
              value={reveal_at}
              onChange={(e) => setRevealAt(e.target.value)}
            />

            <button
              onClick={submit}
              className="w-full py-3 rounded-xl bg-rose-600 text-white font-semibold shadow"
            >
              Create Now
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-rose-900 font-semibold">Done! Your link:</p>
            <a className="text-blue-700 underline break-all" href={`/r/${result.slug}`}>
              {`${window.location.origin}/r/${result.slug}`}
            </a>

            <div className="mt-4 p-4 rounded-xl bg-white border border-rose-200">
              <p className="text-sm text-rose-800">Creator dashboard:</p>
              <a className="text-blue-700 underline" href={`/dashboard/${result.slug}`}>
                Open Dashboard
              </a>
              <p className="mt-2 text-xs text-rose-600">
                (Secret saved in your browser. Don’t clear browser data.)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
