import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeInit } from "@/components/ThemeInit";
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

export const metadata: Metadata = {
  title: "Tokenscope — Claude CLI token usage, in your menu bar",
  description:
    "A macOS menu-bar app that shows your Claude CLI daily token count, estimated cost, and per-model, MCP, and Skill breakdown. Read-only, zero intrusion.",
  openGraph: {
    title: "Tokenscope",
    description:
      "See what your Claude CLI actually costs. Token usage, estimated cost, and per-model / MCP / Skill breakdown in your macOS menu bar.",
    type: "website",
  },
};

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
      // hydrates, which would otherwise trip the mismatch check.
      suppressHydrationWarning
      className={`${ibmSans.variable} ${ibmMono.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* Phosphor Icons (regular + bold) — UI glyphs only. The brand mark
            is the app's own SVG, not a Phosphor icon. */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css"
        />
        <ThemeInit />
      </head>
      <body className="min-h-full antialiased">
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
