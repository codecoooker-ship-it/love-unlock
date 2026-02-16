"use client";

import { useState } from "react";

export default function Admin() {
  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState("ROM99");
  const [key, setKey] = useState("");

  async function unlock() {
    const res = await fetch("/api/admin/unlock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key,
      },
      body: JSON.stringify({ slug: slug.toUpperCase(), plan }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error ?? "Error");

    alert(`Unlocked ${slug.toUpperCase()} → ${plan}`);
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Love Unlock Admin
        </h1>

        <div className="mt-6 space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />

          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Slug (e.g. B9YYGPV)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <select
            className="w-full border rounded-xl px-3 py-2"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="CRUSH49">CRUSH49</option>
            <option value="ROM99">ROM99</option>
            <option value="ULT199">ULT199</option>
            <option value="FREE">FREE</option>
          </select>

          <button
            onClick={unlock}
            className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}
