"use client";

import { useMemo, useState } from "react";


type Props = {
  url: string;          // full url (https://.../r/SLUG)
  title?: string;       // share title
  subtitle?: string;    // share description
  className?: string;
};

function enc(x: string) {
  return encodeURIComponent(x);
}

export default function ShareBar({
  url,
  title = "Love Unlock 💖",
  subtitle = "Open my love link 💘",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  const shareText = useMemo(() => `${title}\n${subtitle}\n${url}`, [title, subtitle, url]);

  const wa = useMemo(() => `https://wa.me/?text=${enc(shareText)}`, [shareText]);
  const fb = useMemo(() => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, [url]);

  // Messenger: works best on mobile via share link
  // fallback uses Facebook "send" dialog style, but without app-id it's inconsistent.
  // So we provide simple "Messenger" that copies link + hints.
  const messenger = useMemo(() => `fb-messenger://share?link=${enc(url)}`, [url]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <div className={`rounded-2xl bg-white/10 border border-white/20 p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-white font-semibold">Share ❤️</p>
          <p className="text-white/70 text-sm mt-1">
            WhatsApp / Facebook / Messenger / Copy link
          </p>
        </div>
        <button
          onClick={copy}
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold"
          type="button"
        >
          {copied ? "Copied ✅" : "Copy link"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="text-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
        >
          WhatsApp
        </a>

        <a
          href={fb}
          target="_blank"
          rel="noreferrer"
          className="text-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold"
        >
          Facebook
        </a>

        <a
          href={messenger}
          className="text-center px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 font-semibold"
          onClick={(e) => {
            // if protocol fails (desktop), we still copy
            // and show small hint
            setTimeout(copy, 50);
          }}
        >
          Messenger
        </a>
      </div>

      <p className="mt-3 text-xs text-white/60">
        Tip: Messenger (desktop) এ না খুললে link auto copy হবে — paste করে পাঠাও ✅
      </p>
    </div>
  );
}
