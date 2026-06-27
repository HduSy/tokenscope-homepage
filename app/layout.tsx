import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeInit } from "@/components/ThemeInit";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ToastHost } from "@/components/Toast";

const ibmSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// metadata moved to each page (app/page.tsx, app/zh/page.tsx) so it can pick
// the right title/description/OG/hreflang per locale. The shared shell here
// only owns the <html>/<body>, font variables, theme + smooth-scroll bootstrap
// scripts, and the toast host.

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#16181b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // suppressHydrationWarning: ThemeInit may set data-theme before React
      // hydrates, which would otherwise trip the mismatch check. The lang
      // attribute is also patched client-side by the inline script below
      // when the visitor is on /zh — that's the second source of mismatch.
      suppressHydrationWarning
      className={`${ibmSans.variable} ${ibmMono.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* Bootstrap script. Two things:
              1. Tag <html> with .js so JS-only entrance animations gate behind
                 html.js (Reveal, chart anims). Without JS this never runs →
                 those animations' hidden start state is skipped and the whole
                 page renders visible (SSR / no-JS safe).
              2. Override the static lang="en" attribute with "zh-CN" when on
                 /zh so screen readers and dev-tools see the right value once
                 hydration completes. Server crawlers reading raw HTML still
                 see lang="en" on /zh — acceptable trade-off, since the
                 canonical SEO signals (hreflang alternates, og:locale, body
                 content) are still set correctly server-side.
            Cookie-driven locale redirect lives in next.config.ts now —
            Vercel's CDN routing layer handles it as a true 307 before any
            HTML is served, so there's no flicker and no Edge Function tax.
            UI icons are inlined as SVG paths via <Icon/> (components/Icon.tsx) —
            no external icon-font stylesheet, so nothing else in <head> blocks
            first paint here. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "if(location.pathname.indexOf('/zh')===0)document.documentElement.lang='zh-CN';",
          }}
        />
        <ThemeInit />
      </head>
      <body className="min-h-full antialiased">
        <SmoothScroll />
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
