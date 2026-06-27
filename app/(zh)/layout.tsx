import "../globals.css";
import { HtmlShell } from "@/components/HtmlShell";
import type { Viewport } from "next";

// Root layout for the Chinese route group at `/zh`. Pairs with
// app/(en)/layout.tsx. Declaring lang="zh-CN" here means crawlers reading
// the initial HTML (before any JS runs) see the correct language attribute
// on the <html> element — the old client-side patch was a JS-only signal.

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#16181b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function ZhRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <HtmlShell lang="zh-CN">{children}</HtmlShell>;
}
