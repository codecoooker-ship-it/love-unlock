"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as htmlToImage from "html-to-image";
import { Rnd } from "react-rnd";

function isAllowed(plan: string) {
  return plan === "ROM99" || plan === "ULT199";
}

type SavedTemplate = {
  id: string;
  slug: string;
  image_url: string;
  photo_url: string | null;
  meta: any;
  created_at: string;
};

type BoxState = {
  x: number;
  y: number;
  w: number;
  h: number;
  font: number; // zoom in/out
};

type Tpl = {
  id: string;
  name: string;
  isDark: boolean;
  pageBg: string; // whole page bg
  canvasBg: string; // inside editor bg
  defaults: {
    photo: BoxState;
    name: BoxState;
    quote: BoxState;
    brand: BoxState;
    photoClass: string; // photo frame style
  };
};

const DEFAULT_QUOTES = [
  "You + Me = Forever 💞",
  "My favorite place is next to you 💖",
  "In a sea of people, my eyes find you 🌹",
  "Every love story is beautiful, but ours is my favorite ✨",
  "I choose you. Again and again. 💍",
  "To the moon and back 🌙💖",
  "Love looks good on us 😄💗",
];

const MUSIC = [
  { id: "soft1", name: "Soft Love (Loop)", src: "/music/soft-love-1.mp3" },
  { id: "soft2", name: "Romantic Piano", src: "/music/soft-love-2.mp3" },
  { id: "soft3", name: "Calm Lofi Love", src: "/music/soft-love-3.mp3" },
];

// ✅ Mostly Neon/Ruby + only 2 light
const TEMPLATES: Tpl[] = [
  {
    id: "neon-love",
    name: "Neon Love (Cyber)",
    isDark: true,
    pageBg: "from-slate-950 via-fuchsia-950 to-slate-950",
    canvasBg: "bg-white/10",
    defaults: {
      photo: { x: 30, y: 55, w: 270, h: 270, font: 0 },
      name: { x: 20, y: 18, w: 520, h: 80, font: 34 },
      quote: { x: 60, y: 255, w: 440, h: 85, font: 20 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-3xl border border-white/30 shadow-[0_0_30px_rgba(217,70,239,0.20)]",
    },
  },
  {
    id: "ruby-night",
    name: "Ruby Night (Glow)",
    isDark: true,
    pageBg: "from-slate-950 via-rose-950 to-slate-950",
    canvasBg: "bg-white/10",
    defaults: {
      photo: { x: 40, y: 70, w: 250, h: 250, font: 0 },
      name: { x: 30, y: 20, w: 500, h: 80, font: 34 },
      quote: { x: 50, y: 260, w: 460, h: 85, font: 20 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-full border border-white/25 shadow-[0_0_30px_rgba(244,63,94,0.25)]",
    },
  },
  {
    id: "neon-ring",
    name: "Neon Ring Frame",
    isDark: true,
    pageBg: "from-slate-950 via-fuchsia-950 to-slate-950",
    canvasBg: "bg-white/10",
    defaults: {
      photo: { x: 150, y: 65, w: 260, h: 260, font: 0 },
      name: { x: 20, y: 20, w: 520, h: 70, font: 32 },
      quote: { x: 40, y: 295, w: 480, h: 60, font: 18 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-full border-2 border-fuchsia-300/70 shadow-[0_0_35px_rgba(217,70,239,0.25)]",
    },
  },
  {
    id: "ruby-spotlight",
    name: "Ruby Spotlight",
    isDark: true,
    pageBg: "from-slate-950 via-rose-950 to-slate-950",
    canvasBg: "bg-white/10",
    defaults: {
      photo: { x: 280, y: 75, w: 240, h: 240, font: 0 },
      name: { x: 20, y: 40, w: 330, h: 120, font: 34 },
      quote: { x: 20, y: 265, w: 360, h: 90, font: 20 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-3xl border border-white/25 shadow-[0_0_30px_rgba(244,63,94,0.20)]",
    },
  },
  {
    id: "glitch-love",
    name: "Glitch Love (Cyan)",
    isDark: true,
    pageBg: "from-slate-950 via-cyan-950 to-slate-950",
    canvasBg: "bg-white/10",
    defaults: {
      photo: { x: 35, y: 70, w: 260, h: 260, font: 0 },
      name: { x: 20, y: 20, w: 520, h: 80, font: 34 },
      quote: { x: 45, y: 275, w: 470, h: 75, font: 19 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-3xl border border-cyan-200/40 shadow-[0_0_35px_rgba(34,211,238,0.18)]",
    },
  },
  {
    id: "noir-romance",
    name: "Noir Romance",
    isDark: true,
    pageBg: "from-slate-950 via-slate-900 to-slate-950",
    canvasBg: "bg-white/10",
    defaults: {
      photo: { x: 36, y: 70, w: 260, h: 260, font: 0 },
      name: { x: 40, y: 22, w: 480, h: 80, font: 32 },
      quote: { x: 40, y: 270, w: 480, h: 80, font: 19 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-2xl border border-white/20 shadow-xl",
    },
  },
  {
    id: "polaroid-dark",
    name: "Dark Polaroid",
    isDark: true,
    pageBg: "from-slate-950 via-slate-900 to-slate-950",
    canvasBg: "bg-white/10",
    defaults: {
      photo: { x: 150, y: 55, w: 260, h: 260, font: 0 },
      name: { x: 20, y: 20, w: 520, h: 70, font: 30 },
      quote: { x: 120, y: 305, w: 320, h: 55, font: 18 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-2xl bg-white p-3 shadow-xl",
    },
  },
  // ✅ light only 2
  {
    id: "soft-rose",
    name: "Soft Rose (Light)",
    isDark: false,
    pageBg: "from-rose-100 via-pink-50 to-white",
    canvasBg: "bg-white/85",
    defaults: {
      photo: { x: 40, y: 70, w: 250, h: 250, font: 0 },
      name: { x: 20, y: 22, w: 520, h: 70, font: 32 },
      quote: { x: 40, y: 295, w: 480, h: 60, font: 18 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-3xl border border-rose-200 shadow-xl",
    },
  },
  {
    id: "ivory-blush",
    name: "Ivory Blush (Light)",
    isDark: false,
    pageBg: "from-white via-rose-50 to-pink-50",
    canvasBg: "bg-white/90",
    defaults: {
      photo: { x: 280, y: 75, w: 240, h: 240, font: 0 },
      name: { x: 20, y: 40, w: 330, h: 110, font: 34 },
      quote: { x: 20, y: 265, w: 360, h: 90, font: 20 },
      brand: { x: 16, y: 12, w: 160, h: 34, font: 13 },
      photoClass: "rounded-full border border-rose-200 shadow-xl",
    },
  },
];

function tplById(id: string) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

// ✅ bigger dot for mobile
function DotHandle() {
  return <div className="w-4 h-4 rounded-full bg-white shadow border border-black/10" />;
}

export default function TemplatesClient({
  slug,
  plan,
  displayName,
}: {
  slug: string;
  plan: string;
  displayName: string;
}) {
  const allowed = useMemo(() => isAllowed(plan), [plan]);

  const [you, setYou] = useState("");
  const [partner, setPartner] = useState("");

  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const tpl = tplById(templateId);

  const [quotePick, setQuotePick] = useState(DEFAULT_QUOTES[0]);
  const [customQuote, setCustomQuote] = useState("");
  const finalQuote = (customQuote.trim() ? customQuote : quotePick).trim();

  const [nameColor, setNameColor] = useState("#ffffff");
  const [quoteColor, setQuoteColor] = useState("#ffffff");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicId, setMusicId] = useState(MUSIC[0].id);
  const [musicOn, setMusicOn] = useState(false);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [mode, setMode] = useState<"photo" | "text">("photo");

  const [photoBox, setPhotoBox] = useState<BoxState>(tpl.defaults.photo);
  const [nameBox, setNameBox] = useState<BoxState>(tpl.defaults.name);
  const [quoteBox, setQuoteBox] = useState<BoxState>(tpl.defaults.quote);
  const [brandBox, setBrandBox] = useState<BoxState>(tpl.defaults.brand);

  const [saved, setSaved] = useState<SavedTemplate[]>([]);
  const [busy, setBusy] = useState(false);

  // ✅ EXPORT MODE: hide dots/handles while downloading/saving
  const [exporting, setExporting] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = tplById(templateId);
    setPhotoBox(t.defaults.photo);
    setNameBox(t.defaults.name);
    setQuoteBox(t.defaults.quote);
    setBrandBox(t.defaults.brand);

    if (t.isDark) {
      setNameColor("#ffffff");
      setQuoteColor("#ffffff");
    } else {
      setNameColor("#2b0a17");
      setQuoteColor("#4a0f25");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
    if (musicOn) a.play().catch(() => {});
    else a.pause();
  }, [musicOn, musicId]);

  async function loadTemplates() {
    const res = await fetch(`/api/templates/list?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return;
    setSaved(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if (allowed) loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, slug]);

  async function uploadPhoto(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", slug);

      const res = await fetch("/api/templates/photo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) return alert(data?.error ?? "Photo upload failed");

      setPhotoUrl(data.photo_url);
      setMode("photo");
    } finally {
      setBusy(false);
    }
  }

  function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
  }
  function zoom(which: "name" | "quote", delta: number) {
    if (which === "name") setNameBox((s) => ({ ...s, font: clamp(s.font + delta, 16, 72) }));
    if (which === "quote") setQuoteBox((s) => ({ ...s, font: clamp(s.font + delta, 12, 54) }));
  }

  // ✅ helper: run export with handles hidden
  async function withExporting<T>(fn: () => Promise<T>) {
    setExporting(true);
    // wait one frame so DOM updates (handles hidden)
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    try {
      return await fn();
    } finally {
      setExporting(false);
    }
  }

  async function downloadPNG() {
    if (!cardRef.current) return;

    await withExporting(async () => {
      const dataUrl = await htmlToImage.toPng(cardRef.current!, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: tpl.isDark ? "#0b1220" : "white",
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `love-unlock-template.png`;
      a.click();
    });
  }

  async function saveToCloud() {
    if (!cardRef.current) return;

    setBusy(true);
    try {
      await withExporting(async () => {
        const dataUrl = await htmlToImage.toPng(cardRef.current!, {
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: tpl.isDark ? "#0b1220" : "white",
        });

        const meta = {
          templateId,
          you,
          partner,
          quotePick,
          customQuote,
          mode,
          nameColor,
          quoteColor,
          musicId,
          musicOn,
          photo: photoUrl ? { url: photoUrl, ...photoBox } : null,
          boxes: { name: nameBox, quote: quoteBox, brand: brandBox },
        };

        const res = await fetch("/api/templates/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, imageDataUrl: dataUrl, photo_url: photoUrl, meta }),
        });

        const data = await res.json();
        if (!res.ok) return alert(data?.error ?? "Save failed");

        alert("Saved ✅");
        await loadTemplates();
      });
    } finally {
      setBusy(false);
    }
  }

  function applySaved(t: SavedTemplate) {
    const m = t.meta || {};
    setTemplateId(m.templateId ?? TEMPLATES[0].id);
    setYou(m.you ?? "");
    setPartner(m.partner ?? "");
    setQuotePick(m.quotePick ?? DEFAULT_QUOTES[0]);
    setCustomQuote(m.customQuote ?? "");
    setMode(m.mode ?? "photo");
    setNameColor(m.nameColor ?? "#ffffff");
    setQuoteColor(m.quoteColor ?? "#ffffff");
    setMusicId(m.musicId ?? MUSIC[0].id);
    setMusicOn(Boolean(m.musicOn));

    if (m.photo?.url) {
      setPhotoUrl(m.photo.url);
      setPhotoBox({
        x: Number(m.photo.x ?? tpl.defaults.photo.x),
        y: Number(m.photo.y ?? tpl.defaults.photo.y),
        w: Number(m.photo.w ?? tpl.defaults.photo.w),
        h: Number(m.photo.h ?? tpl.defaults.photo.h),
        font: 0,
      });
    } else {
      setPhotoUrl(null);
    }

    const b = m.boxes || {};
    if (b.name) setNameBox(b.name);
    if (b.quote) setQuoteBox(b.quote);
    if (b.brand) setBrandBox(b.brand);
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950 px-6 py-14">
        <div className="max-w-xl mx-auto rounded-2xl bg-white/10 backdrop-blur shadow p-6 text-white">
          <h1 className="text-3xl font-semibold">Premium Feature 🔒</h1>
          <p className="mt-2 text-white/80">
            Templates Editor ব্যবহার করতে <b>Romantic (99 BDT)</b> বা <b>Ultimate (199 BDT)</b> unlock লাগবে।
          </p>
          <div className="mt-6 flex gap-3">
            <Link className="flex-1 text-center py-2.5 rounded-xl bg-rose-600 text-white font-semibold" href="/pricing">
              Unlock Now
            </Link>
            <Link className="flex-1 text-center py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold" href={`/r/${slug}`}>
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canvasTextColor = tpl.isDark ? "text-white" : "text-rose-900";

  // ✅ show handles only when editing and not exporting
  const showHandles = !exporting && (mode === "photo" || mode === "text");

  return (
    <div className={`min-h-screen bg-gradient-to-b ${tpl.pageBg} px-4 sm:px-6 py-10 sm:py-14`}>
      <audio ref={audioRef} src={MUSIC.find((m) => m.id === musicId)?.src ?? MUSIC[0].src} />

      <div className="max-w-6xl mx-auto">
        <div className={`rounded-2xl ${tpl.canvasBg} backdrop-blur shadow p-4 sm:p-6`}>
          <h1 className={`text-2xl sm:text-3xl font-semibold ${canvasTextColor}`}>Love Templates ✨</h1>
          <p className={`mt-2 ${tpl.isDark ? "text-white/80" : "text-rose-800"}`}>
            For <b>{displayName}</b> — choose template → upload photo → move/resize text → save/download
          </p>

          {/* Template gallery */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`rounded-2xl overflow-hidden border transition ${templateId === t.id ? "border-white/70 shadow-lg" : "border-white/20"}`}
              >
                <div className={`h-14 bg-gradient-to-b ${t.pageBg}`} />
                <div className="p-2 text-left bg-white/10">
                  <p className="text-xs font-semibold text-white">{t.name}</p>
                  <p className="text-[11px] text-white/70">Tap to apply</p>
                </div>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-5 grid lg:grid-cols-3 gap-3">
            <input
              className="w-full border border-white/20 rounded-xl px-3 py-2 bg-white text-rose-900"
              placeholder="Your name"
              value={you}
              onChange={(e) => setYou(e.target.value)}
            />
            <input
              className="w-full border border-white/20 rounded-xl px-3 py-2 bg-white text-rose-900"
              placeholder="Partner name"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
            />

            <select
              className="w-full border border-white/20 rounded-xl px-3 py-2 bg-white text-rose-900"
              value={quotePick}
              onChange={(e) => setQuotePick(e.target.value)}
            >
              {DEFAULT_QUOTES.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>

            <input
              className="lg:col-span-2 w-full border border-white/20 rounded-xl px-3 py-2 bg-white text-rose-900"
              placeholder="Custom quote (optional)"
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
            />

            <div className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 px-3 py-2">
              <span className="text-white/80 text-sm font-semibold">Name Color</span>
              <input type="color" value={nameColor} onChange={(e) => setNameColor(e.target.value)} className="h-8 w-10" />
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 px-3 py-2">
              <span className="text-white/80 text-sm font-semibold">Quote Color</span>
              <input type="color" value={quoteColor} onChange={(e) => setQuoteColor(e.target.value)} className="h-8 w-10" />
            </div>

            <div className="lg:col-span-3 rounded-2xl bg-white/10 border border-white/20 p-3 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold">Soft Love Music</p>

                <select
                  className="border border-white/20 rounded-xl px-3 py-2 bg-white text-rose-900"
                  value={musicId}
                  onChange={(e) => setMusicId(e.target.value)}
                >
                  {MUSIC.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setMusicOn((v) => !v)}
                  className={`px-4 py-2 rounded-xl font-semibold border ${
                    musicOn ? "bg-rose-600 border-rose-600 text-white" : "bg-white/10 border-white/20 text-white"
                  }`}
                >
                  {musicOn ? "Pause" : "Play"}
                </button>

                <span className="text-white/70 text-sm">Note: user click দিলে play হবে (browser rule)</span>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-wrap items-center gap-3">
              <label className="px-4 py-2 rounded-xl bg-white border border-white/20 text-rose-900 font-semibold cursor-pointer">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadPhoto(f);
                  }}
                />
              </label>

              {photoUrl ? (
                <>
                  <span className="text-white/80 text-sm">Photo added ✅</span>
                  <button
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold"
                    onClick={() => setPhotoUrl(null)}
                  >
                    Remove Photo
                  </button>
                </>
              ) : (
                <span className="text-white/70 text-sm">No photo yet</span>
              )}

              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setMode("photo")}
                  className={`px-4 py-2 rounded-xl font-semibold border ${
                    mode === "photo" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white/10 text-white border-white/20"
                  }`}
                >
                  Edit Photo
                </button>
                <button
                  onClick={() => setMode("text")}
                  className={`px-4 py-2 rounded-xl font-semibold border ${
                    mode === "text" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white/10 text-white border-white/20"
                  }`}
                >
                  Edit Text
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 border border-white/20 p-3 text-white">
                <p className="text-sm font-semibold">Name Zoom</p>
                <div className="mt-2 flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 font-semibold" onClick={() => zoom("name", -2)}>
                    A-
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 font-semibold" onClick={() => zoom("name", +2)}>
                    A+
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/20 p-3 text-white">
                <p className="text-sm font-semibold">Quote Zoom</p>
                <div className="mt-2 flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 font-semibold" onClick={() => zoom("quote", -2)}>
                    A-
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 font-semibold" onClick={() => zoom("quote", +2)}>
                    A+
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Editor + Saved */}
          <div className="mt-8 grid lg:grid-cols-2 gap-6 items-start">
            {/* Editor */}
            <div>
              <p className="text-white/80 font-semibold">Editor Preview</p>

              <div className="mt-3">
                <div
                  ref={cardRef}
                  className={`relative rounded-3xl shadow-xl overflow-hidden border border-white/20 ${tpl.canvasBg}`}
                  style={{ width: "100%", maxWidth: 560 }}
                >
                  <div className="relative w-full aspect-[16/10]">
                    {/* background */}
                    <div className="absolute inset-0">
                      <div className={`absolute inset-0 bg-gradient-to-br ${tpl.pageBg} opacity-70`} />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
                      <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-rose-500/20 blur-3xl" />
                      <div className="absolute top-3 right-4 text-xl opacity-70">💘</div>
                      <div className="absolute bottom-3 left-4 text-xl opacity-70">🌹</div>
                    </div>

                    {/* PHOTO */}
                    {photoUrl && (
                      <Rnd
                        bounds="parent"
                        size={{ width: photoBox.w, height: photoBox.h }}
                        position={{ x: photoBox.x, y: photoBox.y }}
                        disableDragging={mode !== "photo"}
                        enableResizing={
                          mode === "photo"
                            ? { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true }
                            : false
                        }
                        resizeHandleComponent={
                          showHandles && mode === "photo"
                            ? {
                                topLeft: <DotHandle />,
                                topRight: <DotHandle />,
                                bottomLeft: <DotHandle />,
                                bottomRight: <DotHandle />,
                              }
                            : undefined
                        }
                        onDragStop={(_, d) => setPhotoBox((s) => ({ ...s, x: d.x, y: d.y }))}
                        onResizeStop={(_, __, ref, ___, position) => {
                          setPhotoBox((s) => ({
                            ...s,
                            w: ref.offsetWidth,
                            h: ref.offsetHeight,
                            x: position.x,
                            y: position.y,
                          }));
                        }}
                        lockAspectRatio={true}
                        style={{
                          zIndex: 2,
                          pointerEvents: mode === "photo" ? "auto" : "none",
                        }}
                      >
                        <div className={`w-full h-full overflow-hidden ${tpl.defaults.photoClass}`}>
                          <img src={photoUrl} alt="couple" className="w-full h-full object-cover" draggable={false} />
                        </div>
                      </Rnd>
                    )}

                    {/* TEXT LAYER */}
                    <div
                      className="absolute inset-0"
                      style={{
                        zIndex: 5,
                        pointerEvents: mode === "text" ? "auto" : "none",
                      }}
                    >
                      {/* Brand */}
                      <Rnd
                        bounds="parent"
                        size={{ width: brandBox.w, height: brandBox.h }}
                        position={{ x: brandBox.x, y: brandBox.y }}
                        disableDragging={mode !== "text"}
                        enableResizing={mode === "text"}
                        resizeHandleComponent={
                          showHandles && mode === "text"
                            ? {
                                topLeft: <DotHandle />,
                                topRight: <DotHandle />,
                                bottomLeft: <DotHandle />,
                                bottomRight: <DotHandle />,
                              }
                            : undefined
                        }
                        onDragStop={(_, d) => setBrandBox((s) => ({ ...s, x: d.x, y: d.y }))}
                        onResizeStop={(_, __, ref, ___, position) => {
                          setBrandBox((s) => ({
                            ...s,
                            w: ref.offsetWidth,
                            h: ref.offsetHeight,
                            x: position.x,
                            y: position.y,
                          }));
                        }}
                        style={{ pointerEvents: "auto" }}
                      >
                        <div
                          className="w-full h-full"
                          style={{
                            fontSize: brandBox.font,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.85)",
                            textShadow: "0 3px 18px rgba(0,0,0,0.65)",
                          }}
                        >
                          Love Unlock
                        </div>
                      </Rnd>

                      {/* Names */}
                      <Rnd
                        bounds="parent"
                        size={{ width: nameBox.w, height: nameBox.h }}
                        position={{ x: nameBox.x, y: nameBox.y }}
                        disableDragging={mode !== "text"}
                        enableResizing={mode === "text"}
                        resizeHandleComponent={
                          showHandles && mode === "text"
                            ? {
                                topLeft: <DotHandle />,
                                topRight: <DotHandle />,
                                bottomLeft: <DotHandle />,
                                bottomRight: <DotHandle />,
                              }
                            : undefined
                        }
                        onDragStop={(_, d) => setNameBox((s) => ({ ...s, x: d.x, y: d.y }))}
                        onResizeStop={(_, __, ref, ___, position) => {
                          setNameBox((s) => ({
                            ...s,
                            w: ref.offsetWidth,
                            h: ref.offsetHeight,
                            x: position.x,
                            y: position.y,
                          }));
                        }}
                        style={{ pointerEvents: "auto" }}
                      >
                        <div
                          className="w-full h-full flex items-center justify-center text-center"
                          style={{
                            fontSize: nameBox.font,
                            fontWeight: 900,
                            color: nameColor,
                            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
                          }}
                        >
                          {(you || "You")} <span style={{ opacity: 0.85, margin: "0 10px" }}>×</span> {(partner || "Partner")}
                        </div>
                      </Rnd>

                      {/* Quote */}
                      <Rnd
                        bounds="parent"
                        size={{ width: quoteBox.w, height: quoteBox.h }}
                        position={{ x: quoteBox.x, y: quoteBox.y }}
                        disableDragging={mode !== "text"}
                        enableResizing={mode === "text"}
                        resizeHandleComponent={
                          showHandles && mode === "text"
                            ? {
                                topLeft: <DotHandle />,
                                topRight: <DotHandle />,
                                bottomLeft: <DotHandle />,
                                bottomRight: <DotHandle />,
                              }
                            : undefined
                        }
                        onDragStop={(_, d) => setQuoteBox((s) => ({ ...s, x: d.x, y: d.y }))}
                        onResizeStop={(_, __, ref, ___, position) => {
                          setQuoteBox((s) => ({
                            ...s,
                            w: ref.offsetWidth,
                            h: ref.offsetHeight,
                            x: position.x,
                            y: position.y,
                          }));
                        }}
                        style={{ pointerEvents: "auto" }}
                      >
                        <div
                          className="w-full h-full flex items-center justify-center text-center"
                          style={{
                            fontSize: quoteBox.font,
                            fontWeight: 800,
                            color: quoteColor,
                            textShadow: "0 3px 18px rgba(0,0,0,0.7)",
                            lineHeight: 1.15,
                          }}
                        >
                          {finalQuote || "Write your quote ✨"}
                        </div>
                      </Rnd>
                    </div>

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-80 pointer-events-none" style={{ zIndex: 6 }}>
                      <span>💗</span><span>💞</span><span>💝</span><span>🌹</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  disabled={busy}
                  onClick={downloadPNG}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold disabled:opacity-60"
                >
                  Download PNG
                </button>

                <button
                  disabled={busy}
                  onClick={saveToCloud}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold disabled:opacity-60"
                >
                  {busy ? "Saving..." : "Save Template ☁️"}
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold"
                  onClick={loadTemplates}
                >
                  Refresh
                </button>

                <Link
                  className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-center"
                  href={`/r/${slug}`}
                >
                  Back
                </Link>
              </div>

              <p className="mt-3 text-xs text-white/80">
                ✅ Export/Download এ ডট handle আর থাকবে না ✅
              </p>
            </div>

            {/* Saved */}
            <div>
              <p className="text-white/80 font-semibold">Saved Templates (for this code)</p>

              {saved.length === 0 ? (
                <p className="mt-2 text-sm text-white/70">এখনও কিছু save করা হয়নি। Save Template ☁️ চাপো 🙂</p>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {saved.map((t) => (
                    <div key={t.id} className="rounded-2xl bg-white/10 border border-white/20 shadow overflow-hidden">
                      <button onClick={() => applySaved(t)} className="block w-full text-left">
                        <img src={t.image_url} alt="saved" className="w-full h-40 object-cover" />
                        <div className="p-3">
                          <p className="text-sm font-semibold text-white">{new Date(t.created_at).toLocaleString()}</p>
                          <p className="text-xs text-white/70">Tap to load into editor</p>
                        </div>
                      </button>

                      <div className="px-3 pb-3 flex gap-2">
                        <a
                          href={t.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center py-2 rounded-xl bg-neutral-900 text-white text-sm font-semibold"
                        >
                          Open
                        </a>
                        <button
                          className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold"
                          onClick={() => {
                            navigator.clipboard.writeText(t.image_url);
                            alert("Link copied ✅");
                          }}
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/20">
                <p className="text-white font-semibold">Notes</p>
                <ul className="mt-2 text-sm text-white/70 list-disc ml-5 space-y-1">
                  <li>Music feature</li>
                  <li>Browser autoplay block করে—তাই Play চাপলে চলবে ✅</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
