"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function cleanSlug(x: string) {
  return String(x || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
}

export default function HomeClient() {
  const [slug, setSlug] = useState("");

  const slugOk = useMemo(() => cleanSlug(slug).length >= 3, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950 text-white">
      {/* Top bar */}
      <div className="px-4 sm:px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shadow">
              💘
            </div>
            <div>
              <p className="font-extrabold tracking-tight text-lg">Love Unlock</p>
              <p className="text-xs text-white/60 -mt-1">Create. Customize. Share.</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 font-semibold" href="/pricing">
              Pricing
            </Link>
            <Link className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 rounded-xl font-semibold" href="/create">
              Create Now
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 sm:px-6 pt-8 pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
           <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Love Letter Generator & <span className="text-rose-300">Proposal Page Maker</span> 💖
            </h1>

           <p className="mt-4 text-white/80 text-lg">
            Love Unlock helps you create romantic love letters, proposal letters, surprise proposal links, and beautiful love pages.
            You can customize templates with your photos, move and resize text, add soft love music, then share as a link or download as PNG.
           </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/create" className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-semibold">
                Create My Love Page 🚀
              </Link>
              <Link href="/pricing" className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 font-semibold">
                See Pricing
              </Link>
            </div>

            {/* Quick open */}
            <div className="mt-8 rounded-3xl bg-white/10 border border-white/20 p-5">
              <p className="font-semibold">Already have a code (SLUG)?</p>
              <p className="text-sm text-white/70 mt-1">
                SLUG বসিয়ে open করো অথবা unlock করতে যাও।
              </p>

              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <input
                  value={slug}
                  onChange={(e) => setSlug(cleanSlug(e.target.value))}
                  placeholder="Example: ROM99ABC"
                  className="flex-1 rounded-2xl bg-white text-black px-4 py-3 outline-none"
                />
                <Link
                  href={slugOk ? `/r/${cleanSlug(slug)}` : "#"}
                  className={`px-5 py-3 rounded-2xl font-semibold text-center ${
                    slugOk ? "bg-neutral-900 hover:bg-neutral-800" : "bg-white/10 border border-white/20 opacity-60"
                  }`}
                >
                  Open Page
                </Link>
                <Link
                  href={slugOk ? `/unlock?slug=${encodeURIComponent(cleanSlug(slug))}` : "/unlock"}
                  className="px-5 py-3 rounded-2xl font-semibold text-center bg-white/10 border border-white/20 hover:bg-white/15"
                >
                  Unlock
                </Link>
              </div>
            </div>

            <p className="mt-4 text-xs text-white/60">
              Surprise Your Partner: Create a romantic proposal page, customize templates with your photos, move & resize texts, add soft love music,
            </p>
          </div>

          {/* Preview card */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-rose-500/20 blur-3xl" />

            <div className="rounded-3xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
              <div className="p-6">
                <p className="text-white/70 text-sm font-semibold">Live Preview (Demo)</p>
                <h2 className="mt-2 text-2xl font-extrabold">You × Partner</h2>
                <p className="mt-2 text-white/80 font-semibold">“You + Me = Forever 💞”</p>

                <div className="mt-5 rounded-3xl bg-gradient-to-b from-slate-950 via-fuchsia-950 to-slate-950 border border-white/15 overflow-hidden">
                  <div className="relative w-full aspect-[16/10]">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 right-4 text-xl opacity-70">💘</div>
                    <div className="absolute bottom-3 left-4 text-xl opacity-70">🌹</div>

                    <div className="absolute inset-0 grid place-items-center">
                      <div className="w-40 h-40 rounded-full border border-white/25 bg-white/10 grid place-items-center shadow">
                        <span className="text-4xl">📸</span>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-80">
                      <span>💗</span><span>💞</span><span>💝</span><span>🌹</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <Link href="/create" className="text-center py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-semibold">
                    Create Page
                  </Link>
                  <Link href="/pricing" className="text-center py-3 rounded-2xl bg-white/10 border border-white/20 font-semibold">
                    Unlock Templates
                  </Link>
                </div>

                <p className="mt-3 text-xs text-white/60">
                  ✅ Drag/Resize photo + Move text + Change color + Music
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-14">
          <h3 className="text-2xl font-extrabold">What you get ✨</h3>
          <p className="text-white/70 mt-2">Premium-looking romantic features that people actually pay for.</p>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["💌 Proposal Page", "Write message, show love, share link instantly."],
              ["📸 Templates Editor", "10+ unique templates. Upload photo and customize."],
              ["🧲 Drag + Resize", "Move photo/text anywhere. Resize like pro editor."],
              ["🎨 Color Control", "Change name & quote color for perfect contrast."],
              ["🎵 Love Music", "Soft romantic music player inside templates."],
              ["☁️ Save + Download", "Save to cloud per SLUG and download PNG."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-3xl bg-white/10 border border-white/20 p-5">
                <p className="font-bold">{t}</p>
                <p className="mt-2 text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-white/10 border border-white/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xl font-extrabold">Ready to make your love link? 💘</p>
              <p className="text-white/70 mt-1">Create page → unlock templates → download & share.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/create" className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-semibold">
                Create Now
              </Link>
              <Link href="/pricing" className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 font-semibold">
                Pricing
              </Link>
            </div>
          </div>

<div className="mt-14 rounded-3xl bg-white/10 border border-white/20 p-6">
  <h2 className="text-2xl font-extrabold">Create romantic love letters and proposal links online</h2>
  <p className="mt-3 text-white/80">
    Love Unlock is made for people who want to create a romantic surprise online. You can use it as a love letter generator,
    proposal letter maker, romantic message creator, or proposal page builder. It is useful for creating a special love link
    to share with your girlfriend, boyfriend, crush, wife, or husband.
  </p>

  <h3 className="mt-6 text-xl font-bold">Popular searches people use</h3>
  <ul className="mt-3 space-y-2 text-white/75">
    <li>• love letter generator</li>
    <li>• propose letter making</li>
    <li>• proposal letter maker</li>
    <li>• love letter making online</li>
    <li>• romantic proposal ideas</li>
    <li>• how to propose girlfriend</li>
    <li>• different ways to propose</li>
    <li>• proposal link maker</li>
    <li>• romantic message generator</li>
    <li>• surprise love page</li>
  </ul>

  <h3 className="mt-6 text-xl font-bold">Frequently asked questions</h3>

  <div className="mt-4 space-y-4 text-white/80">
    <div>
      <p className="font-semibold">What is Love Unlock?</p>
      <p>
        Love Unlock is an online romantic page and love letter generator that helps you create personalized proposal pages,
        messages, and shareable love links.
      </p>
    </div>

    <div>
      <p className="font-semibold">Can I create a proposal letter online?</p>
      <p>
        Yes. You can use Love Unlock to create a proposal letter, romantic message, and a custom proposal page with your own style.
      </p>
    </div>

    <div>
      <p className="font-semibold">Can I make a love letter link to share?</p>
      <p>
        Yes. After creating your page, you can share it as a romantic surprise link with someone special.
      </p>
    </div>
  </div>
</div>
          {/* Footer */}
          <div className="mt-10 pb-8 text-center text-white/60 text-sm">
            <p>© {new Date().getFullYear()} Love Unlock — Made for Unique Propose💖</p>
          </div>
        </div>
      </div>
    </div>
  );
}
