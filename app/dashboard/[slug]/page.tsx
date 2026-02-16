"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function DashboardSlugPage() {
  const params = useParams();
  const slug = params.slug as string; // ✅ /dashboard/[slug]
  const [secret, setSecret] = useState(""); // ✅ admin secret input

  async function setStealth(v: boolean) {
    const res = await fetch("/api/page/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, edit_secret: secret, stealth_enabled: v }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error ?? "Error");
    alert(v ? "Stealth enabled" : "Stealth disabled (public romantic view)");
  }

  async function setRevealMidnight() {
    const v = "2026-02-14T00:00:00+06:00";
    const res = await fetch("/api/page/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, edit_secret: secret, reveal_at: v }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error ?? "Error");
    alert("Reveal time set to 14 Feb 12:00 AM");
  }

  return (
    <div className="mt-4">
      {/* ✅ secret input */}
      <input
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        placeholder="Enter edit secret"
        className="w-full px-4 py-2 border rounded-xl mb-3"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStealth(false)}
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold"
        >
          Disable Stealth
        </button>

        <button
          onClick={() => setStealth(true)}
          className="px-4 py-2 rounded-xl bg-white border rounded-xl font-semibold"
        >
          Enable Stealth
        </button>

        <button
          onClick={setRevealMidnight}
          className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold"
        >
          Set Reveal: 14 Feb 12:00 AM
        </button>
      </div>
    </div>
  );
}
