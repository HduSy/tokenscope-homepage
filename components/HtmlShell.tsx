import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { ThemeInit } from "@/components/ThemeInit";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ToastHost } from "@/components/Toast";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";

// Shared <html>/<body> chrome used by the two locale root layouts
// (app/(en)/layout.tsx and app/(zh)/layout.tsx). Lifting the chrome out of
// app/layout.tsx into a route-group pair is what lets each locale's HTML
// response declare the correct <html lang> server-side — JS-less crawlers on
// /zh now see lang="zh-CN" in the initial payload instead of the old
// patched-client-side lang="en".
//
// Font instances live at module scope so next/font can statically extract them
// once; both layouts share the same handles via this import.

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

export const FONT_CLASSNAMES = `${ibmSans.variable} ${ibmMono.variable} ${spaceGrotesk.variable}`;

export function HtmlShell({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      // suppressHydrationWarning: ThemeInit may set data-theme before React
      // hydrates, which would otherwise trip the mismatch check.
      suppressHydrationWarning
      className={FONT_CLASSNAMES}
    >
      <head>
        {/* Tag <html> with .js so JS-only entrance animations gate behind
            html.js (Reveal, chart anims). Without JS this never runs → those
            animations' hidden start state is skipped and the page renders
            visible (SSR / no-JS safe).
            UI icons are inlined as SVG paths via <Icon/> (components/Icon.tsx),
            so nothing else in <head> blocks first paint. The cookie-driven
            locale redirect lives in next.config.ts — Vercel's CDN routing
            layer handles it as a true 307 before any HTML is served. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <ThemeInit />
        {/* GA4 loads afterInteractive so it never blocks first paint. */}
        <GoogleAnalytics />
        {/* Vercel Web Analytics: mode defaults to 'auto', so it only reports
            on production deployments — no dev/local noise. */}
        <Analytics />
      </head>
      <body className="min-h-full antialiased">
        <SmoothScroll />
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
