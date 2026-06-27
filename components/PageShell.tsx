import { Breakdowns } from "@/components/Breakdowns";
import { BrandSignoff } from "@/components/BrandSignoff";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { InstallSection } from "@/components/InstallSection";
import { Nav } from "@/components/Nav";
import { Pipeline } from "@/components/Pipeline";
import { Testimonials } from "@/components/Testimonials";
import { TokenTypes } from "@/components/TokenTypes";
import { buildJsonLd } from "@/lib/i18n/page-meta";
import { getDict, type Locale } from "@/lib/i18n";

// Shared bilingual page composition. app/(en)/page.tsx and app/(zh)/zh/page.tsx
// both render this with their own locale prop — same component tree,
// dict-driven content. Each page emits its own JSON-LD pair via
// dangerouslySetInnerHTML so AI answer engines crawling /zh get clean Chinese
// Q&A and / (the root) gets English.
//
// The page's primary content is wrapped in a <main> landmark with a
// skip-to-content link as the first focusable element — keyboard users hit
// "Skip to content" before tabbing through the nav, and Google's main-content
// extractor has an explicit landmark to anchor on.

export function PageShell({ locale }: { locale: Locale }) {
  const { organization, software, faq } = buildJsonLd(locale);
  const t = getDict(locale);
  return (
    <>
      {/* JSON-LD: Organization (brand identity + SERP logo), SoftwareApplication,
          and FAQPage. SoftwareApplication + FAQ are locale-aware; Organization
          is identical on both routes. */}
      {[organization, software, faq].map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      {/* Skip link — first focusable element in the document. Hidden until
          a keyboard user tabs onto it, then absolutely positioned in the
          top-left as a clearly-styled chip. */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:text-text focus:shadow-md focus:outline-none"
      >
        {t.nav.skipToContent}
      </a>
      <Nav locale={locale} />
      <main id="content" tabIndex={-1} className="outline-none">
        <Hero locale={locale} />
        <Breakdowns locale={locale} />
        <Pipeline locale={locale} />
        <TokenTypes locale={locale} />
        <InstallSection locale={locale} />
        <Faq locale={locale} />
        <Testimonials locale={locale} />
        <FinalCta locale={locale} />
      </main>
      <Footer locale={locale} />
      <BrandSignoff locale={locale} />
    </>
  );
}
