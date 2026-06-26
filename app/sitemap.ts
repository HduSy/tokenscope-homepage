import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Single-page marketing site → just the homepage. Fragment URLs (#breakdowns
// etc.) aren't separate indexable pages — Google folds them into `/` — so we
// don't list them. lastModified is evaluated at build time (next build).

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
