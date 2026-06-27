import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Single-page marketing site, now bilingual. The root is the canonical EN
// page, /zh is the canonical CN page — both are indexable. Fragment URLs
// (#breakdowns etc.) aren't separate indexable pages — Google folds them
// into the parent — so we don't list them. lastModified is evaluated at
// build time (next build).
//
// URL form must match the HTML canonical exactly or Google Search Console
// reports "URL not in canonical form / ignored". Because metadataBase is
// `new URL(SITE_URL)` and the per-page canonical is "/", the rendered
// canonical link is `https://tokenscope.app/` (with trailing slash). The
// sitemap <loc> entries need the same trailing slash on the root.

const EN_URL = `${SITE_URL}/`;
const ZH_URL = `${SITE_URL}/zh`;

// hreflang alternates emitted as <xhtml:link> inside each <url>. x-default
// points back to the English root (Google's recommended fallback for users
// with no clear language preference).
const LANGUAGES = {
  en: EN_URL,
  "zh-CN": ZH_URL,
  "x-default": EN_URL,
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Stamp lastmod to whole-second precision (W3C DateTime / RFC 3339);
  // sitemap validators sometimes complain about millisecond fractions.
  const now = new Date();
  now.setMilliseconds(0);
  return [
    {
      url: EN_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: LANGUAGES },
    },
    {
      url: ZH_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: LANGUAGES },
    },
  ];
}
