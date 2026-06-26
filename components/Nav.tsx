import Link from "next/link";
import { Icon } from "./Icon";
import { LogoLink } from "./LogoLink";
import { ThemeToggle } from "./ThemeToggle";

// Sticky glass nav. Server-rendered shell; the client islands are
// <LogoLink/> (back-to-top click) and <ThemeToggle/>. Glass sits at 38%
// opacity so the page content reads through clearly as you scroll.

const links = [
  { href: "#breakdowns", label: "Breakdowns" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Token math" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-border backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--color-bg) 38%, transparent)",
        WebkitBackdropFilter: "saturate(160%) blur(16px)",
        backdropFilter: "saturate(160%) blur(16px)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <LogoLink />

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium text-dim transition-colors hover:text-text"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="inline-flex items-center gap-2.5">
          <a
            href="https://github.com/HduSy/tokenscope"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-dim transition-[color,border-color,background] hover:text-text hover:border-border-strong"
          >
            <Icon name="github-logo" size={17} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
