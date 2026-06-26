import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeInit } from "@/components/ThemeInit";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ToastHost } from "@/components/Toast";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

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
  // metadataBase makes every relative URL in the document (og:image, icons,
  // canonical, etc.) resolve against the production domain.
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  applicationName: SITE_NAME,
  authors: [{ name: "HduSy", url: "https://github.com/HduSy" }],
  creator: "HduSy",
  publisher: "HduSy",
  keywords: [
    "Tokenscope",
    "Claude CLI",
    "token usage",
    "macOS menu bar",
    "AI cost",
    "MCP",
    "Skills",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "See what your Claude CLI actually costs. Token usage, estimated cost, and per-model / MCP / Skill breakdown in your macOS menu bar.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#16181b",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD structured data — schema.org/SoftwareApplication for the brew
// install + GitHub release distribution. Inlined into <head> so it ships
// in the static HTML for crawlers (Googlebot reads JSON-LD; other crawlers
// pick it up from the same payload).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Developer Tools",
  operatingSystem: "macOS",
  license: "https://opensource.org/licenses/MIT",
  downloadUrl: "https://github.com/HduSy/tokenscope/releases",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "HduSy",
    url: "https://github.com/HduSy",
  },
  codeRepository: "https://github.com/HduSy/tokenscope",
  programmingLanguage: ["Rust", "TypeScript", "React"],
} as const;

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
        <script
          type="application/ld+json"
          // dangerouslySetInnerHTML so the JSON sits inline as-is; React
          // wouldn't accept an object child on <script>.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full antialiased">
        <SmoothScroll />
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
