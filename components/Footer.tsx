import { AnchorLink } from "./AnchorLink";
import { BrandMark } from "./BrandMark";
import { getDict, type Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n";

// Footer column structure is locale-invariant — the column titles + link
// labels come from the dict, but href + external + which dict key map are
// static. Hoisting per `rendering-hoist-jsx`: array literal in the function
// body would be rebuilt on every render.
type LinkKey = keyof Dict["footer"]["links"];
type Col = {
  titleKey: keyof Dict["footer"]["columns"];
  links: { href: string; labelKey: LinkKey; external?: boolean }[];
};

const COLS: Col[] = [
  {
    titleKey: "product",
    links: [
      { href: "#breakdowns", labelKey: "breakdowns" },
      { href: "#how", labelKey: "how" },
      { href: "#pricing", labelKey: "pricing" },
      { href: "#faq", labelKey: "faq" },
    ],
  },
  {
    titleKey: "resources",
    links: [
      { href: "https://github.com/HduSy/tokenscope", labelKey: "github", external: true },
      { href: "https://github.com/HduSy/tokenscope/releases", labelKey: "releases", external: true },
      { href: "https://models.dev", labelKey: "modelsDev", external: true },
      {
        href: "https://github.com/HduSy/tokenscope/blob/main/docs/BUGFIXES.md",
        labelKey: "bugLog",
        external: true,
      },
    ],
  },
  {
    titleKey: "install",
    links: [
      { href: "#install", labelKey: "homebrew" },
      { href: "https://github.com/HduSy/tokenscope/releases", labelKey: "dmg", external: true },
    ],
  },
];

export function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale);

  return (
    <footer
      // Solid bg covers the page's ambient grid so the footer reads as a
      // dedicated bottom slab. Same colour as body's --color-bg, just
      // opaque (no background-image bleed-through). The top hairline
      // border-t and the bottom one above the copyright are both attached
      // to full-width elements so they actually span the viewport.
      className="border-t border-border bg-bg pt-14"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-9 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <AnchorLink
              href="#top"
              className="inline-flex items-center gap-2.5 font-sans text-base font-semibold tracking-tight"
            >
              <BrandMark size={20} />
              Tokenscope
            </AnchorLink>
            <p className="mt-2.5 max-w-[26ch] text-[13.5px] text-dim">
              {t.footer.caption}
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.titleKey}>
              <h4 className="mb-3 font-sans text-xs font-semibold tracking-[0.06em] text-faint uppercase">
                {t.footer.columns[col.titleKey]}
              </h4>
              {col.links.map((l) => {
                const label = t.footer.links[l.labelKey];
                return l.external ? (
                  <a
                    key={l.href + l.labelKey}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-1 text-sm text-dim transition-colors hover:text-text"
                  >
                    {label}
                  </a>
                ) : (
                  <AnchorLink
                    key={l.href + l.labelKey}
                    href={l.href}
                    className="block py-1 text-sm text-dim transition-colors hover:text-text"
                  >
                    {label}
                  </AnchorLink>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Full-width hairline above the copyright row — the divider belongs
          to the outer slab, not the centred container, so it spans edge to
          edge instead of stopping at max-w-1200. */}
      <div className="mt-11 border-t border-border pb-10">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2.5 px-6 pt-6 text-[13px] text-faint">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}
