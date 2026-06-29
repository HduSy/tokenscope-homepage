import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getDict, type Locale } from "./index";

// Per-page metadata factory. Each page (app/page.tsx and app/zh/page.tsx)
// calls this once with its locale; the result becomes the page's exported
// `metadata` const so Next.js's static-render path picks up the right
// title/description/OG/hreflang per route.
//
// hreflang alternates declare the other locale to crawlers — that's the
// canonical SEO signal for bilingual sites. `x-default` points back to `/`
// for users with no clear language preference (Google's recommended default).

export function buildPageMetadata(locale: Locale): Metadata {
  const dict = getDict(locale);
  const isZh = locale === "zh";
  return {
    metadataBase: new URL(SITE_URL),
    title: `${SITE_NAME} — ${dict.site.tagline}`,
    description: dict.site.description,
    alternates: {
      canonical: isZh ? "/zh" : "/",
      languages: {
        en: "/",
        "zh-CN": "/zh",
        "x-default": "/",
      },
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
      "Windows system tray",
      "macOS",
      "Windows",
      "AI cost",
      "MCP",
      "Skills",
    ],
    openGraph: {
      type: "website",
      url: isZh ? `${SITE_URL}/zh` : SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: dict.site.ogDescription,
      locale: isZh ? "zh_CN" : "en_US",
      alternateLocale: isZh ? ["en_US"] : ["zh_CN"],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: dict.site.tagline,
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
}

// JSON-LD payloads for the SoftwareApplication card and the FAQ mirror. Each
// page emits its locale's pair inline in <head>. The FAQ array is derived
// from the same dict the visible Faq.tsx reads — single source of truth.

export function buildJsonLd(locale: Locale) {
  const dict = getDict(locale);
  // Organization node — Google reads `logo` (a ≥112×112 raster image) to
  // render the square brand mark in search results, the Knowledge Panel, and
  // Discover. public/logo.png is the 512×512 rasterized brand mark. `sameAs`
  // wires the canonical social profile. This is locale-independent so both
  // routes emit the same Organization identity.
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: ["https://github.com/HduSy/tokenscope"],
  };
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description: dict.jsonLd.description,
    url: locale === "zh" ? `${SITE_URL}/zh` : SITE_URL,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Developer Tools",
    operatingSystem: "macOS, Windows",
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
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    featureList: dict.jsonLd.features,
    programmingLanguage: ["Rust", "TypeScript", "React"],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    mainEntity: dict.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.aPlain },
    })),
  };
  return { organization, software, faq };
}
