import TemplatesClient from "../../../../components/TemplatesClient";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { headers } from "next/headers";
import QrCard from "@/components/QrCard";


async function getPage(slug: string) {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  const res = await fetch(`${baseUrl}/api/page/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page(props: any) {
  const params = await props.params; // Next.js 15
  const slug = String(params?.slug ?? "").toUpperCase();
  if (!slug) return notFound();

  const page = await getPage(slug);
  if (!page) return notFound();

  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const fullUrl = `${proto}://${host}/r/${slug}`;

  return (
    <div className="min-h-screen">
      <TemplatesClient slug={slug} plan={page.plan} displayName={page.display_name} />

      {/* ✅ ShareBar visible wrapper */}
      <section className="bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <ShareBar
            url={fullUrl}
            title="My Love Template 💖"
            subtitle="See my love card ✨"
          />
          <QrCard url={fullUrl} />

        </div>
      </section>
    </div>
  );
}
