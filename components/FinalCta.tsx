import { InstallCtas } from "./InstallCtas";
import { Reveal } from "./Reveal";
import { getDict, type Locale } from "@/lib/i18n";

// Final card-shaped CTA. The accent-glow ::before is replicated via an
// absolutely positioned div with the same gradient + opacity.

export function FinalCta({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <section className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal
          as="div"
          className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 text-center"
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "var(--accent-glow)", opacity: 0.7 }}
          />
          <div className="relative">
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "clamp(28px,4vw,40px)" }}
            >
              {t.finalCta.h2}
            </h2>
            <p className="mt-3 text-base text-dim">
              {t.finalCta.sub}
            </p>
            <InstallCtas locale={locale} className="mt-6.5 justify-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
