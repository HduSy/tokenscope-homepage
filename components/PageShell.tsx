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
import type { Locale } from "@/lib/i18n";

// Shared bilingual page composition. app/page.tsx and app/zh/page.tsx both
// render this with their own locale prop — same component tree, dict-driven
// content. Each page emits its own JSON-LD pair via dangerouslySetInnerHTML
// so AI answer engines crawling /zh get clean Chinese Q&A and /en (the root)
// gets English.

export function PageShell({ locale }: { locale: Locale }) {
  const { software, faq } = buildJsonLd(locale);
  return (
    <>
      {/* JSON-LD: SoftwareApplication + FAQPage, both in the page's locale. */}
      {[software, faq].map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <Nav locale={locale} />
      <Hero locale={locale} />
      <Breakdowns locale={locale} />
      <Pipeline locale={locale} />
      <TokenTypes locale={locale} />
      <InstallSection locale={locale} />
      <Faq locale={locale} />
      <Testimonials locale={locale} />
      <FinalCta locale={locale} />
      <Footer locale={locale} />
      <BrandSignoff locale={locale} />
    </>
  );
}
