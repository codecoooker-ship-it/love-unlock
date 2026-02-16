import PoemsClient from "@/components/PoemsClient";
import { notFound } from "next/navigation";

export default async function Page(props: any) {
  const params = await props.params;
  const slug = String(params?.slug ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!slug) return notFound();

  return <PoemsClient slug={slug} />;
}
