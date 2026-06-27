import { AnchorLink } from "./AnchorLink";
import { Icon } from "./Icon";
import { LogoLink } from "./LogoLink";
import { ShareMenu } from "./ShareMenu";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";
import { getDict, type Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n";

// Sticky glass nav. Server-rendered shell; the client islands are
// <LogoLink/> (back-to-top click), <ThemeToggle/>, <LocaleSwitch/>, and
// <ShareMenu/>. Glass sits at 38% opacity so the page content reads through
// clearly as you scroll.

// Anchor-link structure is locale-invariant — href stays, only label flips
// per dict. Hoisted out of the function body so the array isn't rebuilt on
// every render (per `rendering-hoist-jsx`).
type NavLinkKey = Extract<keyof Dict["nav"], "breakdowns" | "how" | "pricing" | "faq">;
const NAV_LINKS: { href: string; labelKey: NavLinkKey }[] = [
  { href: "#breakdowns", labelKey: "breakdowns" },
  { href: "#how", labelKey: "how" },
  { href: "#pricing", labelKey: "pricing" },
  { href: "#faq", labelKey: "faq" },
];

export function Nav({ locale }: { locale: Locale }) {
  const t = getDict(locale);

  return (
    <nav
      className="sticky-nav sticky top-0 z-50 border-b border-border backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--color-bg) 38%, transparent)",
        WebkitBackdropFilter: "saturate(160%) blur(16px)",
        backdropFilter: "saturate(160%) blur(16px)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <LogoLink />

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <AnchorLink
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium text-dim transition-colors hover:text-text"
            >
              {t.nav[l.labelKey]}
            </AnchorLink>
          ))}
        </div>

        <div className="inline-flex items-center gap-2.5">
          <a
            href="https://github.com/HduSy/tokenscope"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.github}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-dim transition-[color,border-color,background] hover:text-text hover:border-border-strong"
          >
            <Icon name="github-logo" size={17} />
          </a>
          <ShareMenu locale={locale} />
          <LocaleSwitch />
          <ThemeToggle locale={locale} />
        </div>
      </div>
    </nav>
  );
}
