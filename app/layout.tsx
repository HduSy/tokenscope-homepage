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
    "Claude Code",
    "Claude Code cost",
    "Claude Code token cost",
    "Claude Code token usage",
    "Claude CLI",
    "token cost",
    "token usage",
    "Claude usage tracker",
    "ccusage alternative",
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
      "See what your Claude Code actually costs. Daily token cost, per-model breakdown, MCP and Skill call counts in your macOS menu bar.",
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
  verification: {
    // Google Search Console ownership verification.
    google: "NWMthZQj6LXDk7_sNjHI6zOdf9-EzACV82MCdAi9Uk8",
    // Bing Webmaster Tools ownership verification.
    other: { "msvalidate.01": "AB6E5DE3821D6902F37F222AEDC91131" },
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
// pick it up from the same payload). featureList gives AI answer engines a
// parseable feature breakdown alongside the prose on the page.
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
  featureList: [
    "Daily, weekly, and monthly Claude Code token cost in the macOS menu bar",
    "Estimated cost priced per token type (input, cache write, cache read, output) from models.dev and LiteLLM rates",
    "Per-model token and cost breakdown",
    "MCP-server and Skill call counts",
    "GitHub-style daily activity heatmap",
    "Read-only: parses local JSONL logs, no API key, no telemetry",
  ],
  programmingLanguage: ["Rust", "TypeScript", "React"],
} as const;

// FAQPage structured data. The visible FAQ lives in components/Faq.tsx with
// rich markup (code spans, links); this is a clean plain-text mirror so AI
// answer engines (ChatGPT, Perplexity, Claude) can lift the Q&A directly.
// Keep the two in sync when an answer changes. Google no longer surfaces FAQ
// rich results for most sites, but the schema still helps non-Google engines.
const FAQS: { q: string; a: string }[] = [
  {
    q: "Does Tokenscope send any of my data over the network?",
    a: "No. Tokenscope reads the JSONL logs your Claude Code already writes to ~/.claude/projects/, prices them against a locally cached snapshot of models.dev and LiteLLM, and renders the result in your menu bar. There is no telemetry, no account, and no API key.",
  },
  {
    q: "Why does the .dmg warn about an unidentified developer?",
    a: "The cask is not notarized through the Apple Developer program yet. Homebrew clears the quarantine flag for you, so the brew install opens on first launch. For a direct .dmg download, right-click and choose Open the first time, or run xattr -cr /Applications/Tokenscope.app once.",
  },
  {
    q: "How accurate are the cost numbers?",
    a: "Each of the four token buckets (input, cache write, cache read, and output) is priced by its own rate, pulled from models.dev first, LiteLLM as a fallback, then a built-in snapshot when offline. Rates cache for 24 hours on disk. The numbers track Anthropic's billing to the cent for priced Claude models; models with no published pricing are flagged as unpriced.",
  },
  {
    q: "How does Tokenscope compare to ccusage?",
    a: "ccusage (github.com/ryoppippi/ccusage) is a terminal CLI over the same JSONL files: run `npx ccusage` and you get a one-shot summary in the shell. Tokenscope reads the same logs and uses the same models.dev and LiteLLM rate tables, but as a menu-bar GUI. Today's token cost is always visible, and the panel adds bar charts, a heatmap, and screenshot sharing. Reach for ccusage when you want a scriptable terminal command; reach for Tokenscope when you want ambient awareness without typing one.",
  },
  {
    q: "Will it slow down my Mac?",
    a: "No. The menu-bar process watches the projects directory for file changes and only re-parses files whose mtime moved. Idle CPU is essentially zero and memory hovers in the low tens of MB. Refreshing the panel is a single pass over the new JSONL bytes since the last read.",
  },
  {
    q: "What about Cursor, Codex CLI, or other terminals?",
    a: "Today only Claude Code's JSONL format is parsed. Other tools write different log shapes. Open an issue on the GitHub repo with a redacted log sample and it will get a parser.",
  },
  {
    q: "Is it really free?",
    a: "Yes. Tokenscope is MIT licensed with no paid tier and no telemetry to sell. The source is at github.com/HduSy/tokenscope.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
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
        {/* Tag <html> with .js before the body paints, so CSS can gate
            JS-only entrance animations (Reveal, chart anims) behind html.js.
            Without JS this never runs → those animations' hidden start state
            is skipped and the whole page renders visible (SSR / no-JS safe). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {/* UI icons are inlined as SVG paths via <Icon/> (components/Icon.tsx)
            — no external icon-font stylesheet, so nothing in <head> blocks
            first paint on icon account. */}
        <ThemeInit />
        {[jsonLd, faqLd].map((data, i) => (
          <script
            key={i}
            type="application/ld+json"
            // dangerouslySetInnerHTML so each JSON-LD payload sits inline
            // as-is; React wouldn't accept an object child on <script>.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </head>
      <body className="min-h-full antialiased">
        <SmoothScroll />
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
