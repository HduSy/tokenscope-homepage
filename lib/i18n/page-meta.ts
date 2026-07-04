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

// JSON-LD graph emitted inline in <head> as a single <script> (PageShell).
// Four nodes connected by @id so search engines resolve them as one entity
// graph rather than four detached blobs:
//
//   Organization         brand identity (logo + sameAs → Knowledge Panel).
//   WebSite              the site entity, published by the Organization.
//   SoftwareApplication  the product; author = HduSy (Person, accurate),
//                        publisher = Organization (entity linkage), free Offer.
//   FAQPage              locale-specific Q&A, derived from the same dict the
//                        visible Faq.tsx reads (single source of truth).
//
// Each locale route emits its own graph with its own inLanguage / url, so
// /zh carries Chinese Q&A and / carries English; Organization is identical on
// both. public/logo.png (512×512) backs Organization.logo and
// SoftwareApplication.image — Google wants a ≥112×112 raster for the SERP
// mark, and a stable URL (the OG image route carries a per-build hash, so it
// is deliberately not used here).

export function buildJsonLd(locale: Locale) {
  const dict = getDict(locale);
  const isZh = locale === "zh";
  const inLanguage = isZh ? "zh-CN" : "en";
  // Canonical per-locale URL — matches the <link rel="canonical"> form (and
  // the sitemap <loc> entries) so @id fragments land on the URL Google
  // already treats as canonical.
  const pageUrl = isZh ? `${SITE_URL}/zh` : `${SITE_URL}/`;
  const orgId = `${SITE_URL}/#org`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: ["https://github.com/HduSy/tokenscope"],
      },
      {
        "@type": "WebSite",
        "@id": `${pageUrl}#website`,
        name: SITE_NAME,
        url: pageUrl,
        inLanguage,
        publisher: { "@id": orgId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#app`,
        name: SITE_NAME,
        description: dict.jsonLd.description,
        url: pageUrl,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Windows",
        license: "https://opensource.org/licenses/MIT",
        downloadUrl: "https://github.com/HduSy/tokenscope/releases",
        image: `${SITE_URL}/logo.png`,
        isAccessibleForFree: true,
        inLanguage,
        featureList: dict.jsonLd.features,
        author: {
          "@type": "Person",
          name: "HduSy",
          url: "https://github.com/HduSy",
        },
        publisher: { "@id": orgId },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage,
        mainEntity: dict.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.aPlain },
        })),
      },
    ],
  };
}
