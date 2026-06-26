import Link from "next/link";
import { BrandMark } from "./BrandMark";

type Col = { title: string; links: { href: string; label: string; external?: boolean }[] };

const cols: Col[] = [
  {
    title: "Product",
    links: [
      { href: "#breakdowns", label: "Breakdowns" },
      { href: "#how", label: "How it works" },
      { href: "#pricing", label: "Token math" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "https://github.com/HduSy/tokenscope", label: "GitHub", external: true },
      {
        href: "https://github.com/HduSy/tokenscope/releases",
        label: "Releases",
        external: true,
      },
      { href: "https://models.dev", label: "models.dev", external: true },
      {
        href: "https://github.com/HduSy/tokenscope/blob/main/docs/BUGFIXES.md",
        label: "Bug log",
        external: true,
      },
    ],
  },
  {
    title: "Install",
    links: [
      { href: "#install", label: "Homebrew" },
      {
        href: "https://github.com/HduSy/tokenscope/releases",
        label: ".dmg download",
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer
      // Solid bg covers the page's ambient grid so the footer reads as a
      // dedicated bottom slab. Same colour as body's --color-bg, just
      // opaque (no background-image bleed-through).
      className="border-t border-border bg-bg px-0 pt-14 pb-10"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-9 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="#top"
              className="inline-flex items-center gap-2.5 font-sans text-base font-semibold tracking-tight"
            >
              <BrandMark size={20} />
              Tokenscope
            </Link>
            <p className="mt-2.5 max-w-[26ch] text-[13.5px] text-dim">
              Token usage for your Claude CLI, in the macOS menu bar.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 font-sans text-xs font-semibold tracking-[0.06em] text-faint uppercase">
                {col.title}
              </h4>
              {col.links.map((l) =>
                l.external ? (
                  <a
                    key={l.href + l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-1 text-sm text-dim transition-colors hover:text-text"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="block py-1 text-sm text-dim transition-colors hover:text-text"
                  >
                    {l.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
        <div className="mt-11 flex flex-wrap items-center justify-between gap-2.5 border-t border-border pt-6 text-[13px] text-faint">
          <span>© 2026 HduSy · MIT License</span>
          <span>Built with Tauri · Rust + React</span>
        </div>
      </div>
    </footer>
  );
}
