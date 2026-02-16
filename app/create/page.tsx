"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function Create() {
  const [display_name, setDisplayName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [message, setMessage] = useState("");
  const [pin, setPin] = useState("");
  const [revealLocal, setRevealLocal] = useState(""); // datetime-local
  const [result, setResult] = useState<{ slug: string; edit_secret: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const inputCls =
    "w-full border border-rose-200 rounded-xl px-3 py-2 bg-white text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300";
  const taCls =
    "w-full border border-rose-200 rounded-xl px-3 py-2 bg-white text-rose-900 placeholder:text-rose-400 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-rose-300";

  const pinOk = useMemo(() => pin.trim().length >= 4, [pin]);
  const canSubmit = useMemo(() => {
    return display_name.trim() && message.trim() && pinOk && !busy;
  }, [display_name, message, pinOk, busy]);

  function toISOFromDatetimeLocal(v: string) {
    // datetime-local => "2026-02-14T00:00"
    // Convert to ISO string with local timezone offset via Date
    if (!v) return null;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  async function ensureLoggedIn() {
    const { data } = await supabaseBrowser.auth.getSession();
    return data.session?.access_token || null;
  }

  async function signInGoogle() {
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/create` },
    });
    if (error) alert(error.message);
  }

  async function submit() {
    setBusy(true);
    try {
      const token = await ensureLoggedIn();

      if (!token) {
        alert("Create করতে হলে আগে Google দিয়ে Sign in করতে হবে.");
        return;
      }

      const reveal_at = toISOFromDatetimeLocal(revealLocal);

      const res = await fetch("/api/page/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          display_name: display_name.trim(),
          subtitle: subtitle.trim(),
          message: message.trim(),
          pin: pin.trim(),
          reveal_at,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error ?? "Error");
        return;
      }

      setResult(data);
      localStorage.setItem(`love_unlock_secret_${data.slug}`, data.edit_secret);
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied ✅");
    } catch {
      alert("Copy failed");
    }
  }

  const fullLink = result ? `${typeof window !== "undefined" ? window.location.origin : ""}/r/${result.slug}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur shadow p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-rose-900">Create your Love Page</h1>
            <p className="mt-2 text-rose-700 text-sm">
              Stealth mode default ON — PIN ছাড়া message open হবে না।
            </p>
          </div>

          <Link href="/dashboard" className="shrink-0 px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold">
            Dashboard
          </Link>
        </div>

        {!result ? (
          <div className="mt-6 space-y-4">
            {/* Login hint + button */}
            <div className="rounded-2xl border border-rose-200 bg-white/70 p-4">
              <p className="text-sm text-rose-800">
                Create করতে হলে <b>Google Sign in</b> লাগবে (Dashboard features enable করার জন্য) ✅
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={signInGoogle}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
                >
                  Sign in with Google
                </button>
                <Link
                  className="flex-1 text-center py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
                  href="/dashboard"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>

            <input
              className={inputCls}
              placeholder="Display name (Nickname)"
              value={display_name}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <input
              className={inputCls}
              placeholder="Subtitle (optional)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />

            <textarea
              className={taCls}
              placeholder="Your proposal message (write from heart 💗)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                inputMode="numeric"
                className={inputCls}
                placeholder="PIN (min 4 digits)"
                value={pin}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d]/g, ""); // digits only
                  setPin(v);
                }}
              />

              <input
                type="datetime-local"
                className={inputCls}
                value={revealLocal}
                onChange={(e) => setRevealLocal(e.target.value)}
              />
            </div>

            <button
              disabled={!canSubmit}
              onClick={submit}
              className="w-full py-3 rounded-xl bg-rose-600 text-white font-semibold shadow hover:opacity-95 disabled:opacity-60"
            >
              {busy ? "Creating..." : "Create Now"}
            </button>

            <p className="text-xs text-rose-600">
              Tip: PIN মনে রাখবে। Reveal time optional—না দিলে সাথে সাথে খুলবে।
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="rounded-2xl bg-white border border-rose-200 p-4">
              <p className="text-rose-900 font-semibold">Done! Your link:</p>
              <p className="mt-1 text-blue-700 underline break-all">{fullLink}</p>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => copy(fullLink)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
                >
                  Copy Link
                </button>
                <a
                  className="flex-1 text-center py-2.5 rounded-xl bg-rose-600 text-white font-semibold"
                  href={`/r/${result.slug}`}
                >
                  Open Love Page
                </a>
              </div>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <a
                className="text-center py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
                href="/dashboard"
              >
                Go to Dashboard
              </a>

              <a
                className="text-center py-2.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
                href={`/r/${result.slug}/templates`}
              >
                Templates Editor
              </a>
            </div>

            <p className="mt-3 text-xs text-rose-600">
              (Secret saved in your browser. Don’t clear browser data.)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
