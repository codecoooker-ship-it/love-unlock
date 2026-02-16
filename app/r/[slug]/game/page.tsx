import GameClient from "../../../../components/GameClient";
import { notFound } from "next/navigation";

async function getPage(slug: string) {
  const res = await fetch(`http://localhost:3000/api/page/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page(props: any) {
  const params = await props.params; // Next.js 15
  const slug = String(params?.slug ?? "").toUpperCase();
  if (!slug) return notFound();

  const page = await getPage(slug);
  if (!page) return notFound();

  return <GameClient slug={slug} plan={page.plan} displayName={page.display_name} />;
}
