import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Love Letter Generator, Proposal Letter Maker & Romantic Proposal Link",
  description:
    "Create romantic love letters, proposal letters, and unique proposal links with Love Unlock. A free online tool for love letter making and surprise proposal pages.",
};

export default function Page() {
  return <HomeClient />;
}