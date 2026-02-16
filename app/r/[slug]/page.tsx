import ProposalClient from "../../../components/ProposalClient";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import QrCard from "@/components/QrCard";
import { headers } from "next/headers";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

async function getPage(slug: string) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/page/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = String(params?.slug ?? "").toUpperCase();
  if (!slug) return notFound();

  const page = await getPage(slug);
  if (!page) return notFound();

  const unlocked = searchParams?.unlocked === "1";

  // stealth enabled → go stealth page until unlocked
  if (page.stealth_enabled && !unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow p-6">
          <h1 className="text-xl font-semibold text-neutral-900">Personal Archive</h1>
          <p className="text-sm text-neutral-500 mt-1">Private notes & memories</p>

          <a
            className="mt-5 block w-full text-center py-2.5 rounded-xl bg-neutral-900 text-white font-semibold"
            href={`/r/${slug}/stealth`}
          >
            Open
          </a>
        </div>
      </div>
    );
  }

  const baseUrl = await getBaseUrl();
  const fullUrl = `${baseUrl}/r/${slug}`;

  return (
    <div className="min-h-screen">
      {/* ✅ render only ONCE */}
      <ProposalClient page={page} />

      {/* ✅ Share + QR section */}
      <section className="bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <ShareBar url={fullUrl} title="Love Unlock 💖" subtitle="Open this link 💘" />
          <QrCard url={fullUrl} />
        </div>
      </section>
    </div>
  );
}
