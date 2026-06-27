import "../globals.css";
import { HtmlShell } from "@/components/HtmlShell";
import type { Viewport } from "next";

// Root layout for the English route group at `/`. Pairs with
// app/(zh)/layout.tsx — each declares its own <html lang> so the initial SSR
// payload carries the correct language attribute (Googlebot pre-JS, JS-less
// crawlers, and screen readers all see the right value).

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#16181b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function EnRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <HtmlShell lang="en">{children}</HtmlShell>;
}
