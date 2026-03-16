import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://love-unlock.netlify.app"),
  title: {
    default: "Love Unlock - Love Letter Generator & Proposal Page Maker",
    template: "%s | Love Unlock",
  },
  description:
    "Love Unlock is a romantic love letter generator and proposal page maker. Create proposal letters, love messages, and unique propose links online.",
  keywords: [
    "Love Unlock",
    "love letter generator",
    "propose letter",
    "propose letter making",
    "love letter making",
    "love letter maker",
    "proposal page maker",
    "proposal link",
    "proposal message generator",
    "romantic love message",
    "how to propose girlfriend",
    "different ways to propose",
    "propose way",
    "love letter online",
    "romantic proposal ideas",
  ],
  verification: {
  google: "zVue1Kuuu7XoHEC4SIF_wDYMYUwB42zteOddOAR3Ss8",
},
  authors: [{ name: "Love Unlock" }],
  creator: "Love Unlock",
  publisher: "Love Unlock",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Love Unlock - Love Letter Generator & Proposal Page Maker",
    description:
      "Create romantic love letters, proposal messages, and surprise proposal pages with your own link.",
    url: "https://love-unlock.netlify.app",
    siteName: "Love Unlock",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Unlock - Love Letter Generator & Proposal Page Maker",
    description:
      "Create romantic love letters, proposal messages, and surprise proposal pages with your own link.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
