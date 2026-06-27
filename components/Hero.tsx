import { HeroPanel } from "./HeroPanel";
import { InstallCtas } from "./InstallCtas";
import { getDict, type Locale } from "@/lib/i18n";

// Hero: copy on the left, live panel preview on the right. The accent glow
// is `position: fixed` so it stays anchored to the viewport as the page
// scrolls — feels like ambient lighting that the document slides past,
// rather than a decoration that falls off-screen with the hero.

export function Hero({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <header id="top" className="relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "var(--accent-glow)" }}
      />
      <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pt-18 pb-20 md:grid-cols-[1.3fr_0.7fr] md:gap-10 md:pt-21 md:pb-24 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-dim">
            <span className="h-[7px] w-[7px] rounded-[2px] bg-accent" />
            {t.hero.pill}
          </span>
          <h1
            className="mt-5.5 max-w-[26ch] font-display font-semibold"
            style={{ fontSize: "clamp(36px,6vw,64px)" }}
          >
            {t.hero.h1Lead}{" "}
            <em className="not-italic text-accent">{t.hero.h1Accent}</em>.
          </h1>
          <p className="mt-5 max-w-[50ch] text-[18px] leading-[1.55] text-dim">
            {t.hero.sub}
          </p>
          <InstallCtas locale={locale} className="mt-7" />
        </div>
        <HeroPanel locale={locale} />
      </div>
    </header>
  );
}
