"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const BKASH_NUMBER = "01540501063"; // ✅ তোমার bKash number

const PLANS = [
  { id: "ROM99", name: "Romantic", price: 99, perks: ["Templates Editor", "Save + Download", "Premium themes"] },
  { id: "ULT199", name: "Ultimate", price: 199, perks: ["Everything in Romantic", "All templates", "Future premium features"] },
];

function cleanSlug(x: string) {
  return String(x || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

export default function UnlockClient() {
  const sp = useSearchParams();
  const initialPlan = (sp.get("plan") || "ROM99").toUpperCase() as any;
  const [slug, setSlug] = useState(cleanSlug(sp.get("slug") || ""));
  const [plan, setPlan] = useState<"ROM99" | "ULT199">("ROM99");
  const [trx, setTrx] = useState("");
  const [last3, setLast3] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const planObj = useMemo(() => PLANS.find((p) => p.id === plan)!, [plan]);

  async function submit() {
    setMsg(null);
    setOk(false);

    const s = cleanSlug(slug);
    if (!s) return setMsg("Code/SLUG দাও");

    setBusy(true);
    try {
      const res = await fetch("/api/unlock/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: s,
          plan,
          trx_id: trx,
          sender_last3: last3,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.error || "Unlock failed");
        return;
      }

      setOk(true);
      setMsg(data?.already ? `Already unlocked ✅ (${data.plan})` : `Unlocked ✅ (${data.plan})`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950 px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-3xl bg-white/10 border border-white/20 shadow-xl backdrop-blur p-6 text-white">
        <h1 className="text-3xl font-semibold">Unlock Love Unlock 🔓</h1>
        <p className="mt-2 text-white/80">
          bKash payment করে নিচের info বসাও—তারপর auto unlock হবে। TrxID + sender last 3 digits দিয়ে verify করা হবে।
        </p>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
            <p className="font-semibold">Step-by-step</p>
            <ol className="mt-2 text-sm text-white/80 list-decimal ml-5 space-y-1">
              <li>bKash → Send Money</li>
              <li>To: <b>{BKASH_NUMBER}</b></li>
              <li>Amount: <b>{planObj.price} BDT</b></li>
              <li>TrxID copy করো</li>
              <li>এখানে TrxID + sender last 3 digits দাও → Unlock ✅</li>
            </ol>
            <p className="mt-3 text-xs text-white/60">
              Rule: TrxID একবারই ব্যবহার হবে + attempts limit আছে।
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
            <p className="font-semibold">Unlock Form</p>

            <label className="block mt-3 text-sm text-white/80">Your Code/SLUG</label>
            <input
              value={slug}
              onChange={(e) => setSlug(cleanSlug(e.target.value))}
              placeholder="e.g. ROM99ABC"
              className="mt-1 w-full rounded-xl bg-white text-black px-3 py-2 outline-none"
            />

            <label className="block mt-3 text-sm text-white/80">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as any)}
              className="mt-1 w-full rounded-xl bg-white text-black px-3 py-2 outline-none"
            >
              {PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price} BDT
                </option>
              ))}
            </select>

            <label className="block mt-3 text-sm text-white/80">Transaction ID (TrxID)</label>
            <input
              value={trx}
              onChange={(e) => setTrx(e.target.value.toUpperCase())}
              className="mt-1 w-full rounded-xl bg-white text-black px-3 py-2 outline-none"
            />

            <label className="block mt-3 text-sm text-white/80">Sender number last 3 digits</label>
            <input
              value={last3}
              onChange={(e) => setLast3(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="e.g. 123"
              className="mt-1 w-full rounded-xl bg-white text-black px-3 py-2 outline-none"
            />

            <button
              disabled={busy}
              onClick={submit}
              className="mt-4 w-full rounded-xl bg-rose-600 hover:bg-rose-500 transition py-2.5 font-semibold disabled:opacity-60"
            >
              {busy ? "Unlocking..." : "Unlock Now"}
            </button>

            {msg && (
              <div className={`mt-3 rounded-xl p-3 text-sm ${ok ? "bg-emerald-500/20 border border-emerald-400/30" : "bg-rose-500/20 border border-rose-400/30"}`}>
                {msg}
                {ok && slug && (
                  <div className="mt-2">
                    <Link className="underline font-semibold" href={`/r/${cleanSlug(slug)}`}>
                      Go to your page →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 font-semibold" href="/pricing">
            Pricing
          </Link>
          <Link className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 font-semibold" href="/">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
