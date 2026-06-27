import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Single-page marketing site, now bilingual. The root is the canonical EN
// page, /zh is the canonical CN page — both are indexable. Fragment URLs
// (#breakdowns etc.) aren't separate indexable pages — Google folds them
// into the parent — so we don't list them. lastModified is evaluated at
// build time (next build).

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: SITE_URL,
          "zh-CN": `${SITE_URL}/zh`,
        },
      },
    },
    {
      url: `${SITE_URL}/zh`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: SITE_URL,
          "zh-CN": `${SITE_URL}/zh`,
        },
      },
    },
  ];
}
