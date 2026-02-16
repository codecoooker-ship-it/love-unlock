import StealthClient from "../../../../components/StealthClient";
import { notFound } from "next/navigation";

export default async function Page(props: any) {
  const params = await props.params; // ✅ Next.js 15
  const slug = String(params?.slug ?? "").toUpperCase();
  if (!slug) return notFound();

  return <StealthClient slug={slug} />;
}
