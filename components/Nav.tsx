import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

// Sticky glass nav. Server-rendered shell; <ThemeToggle/> is the only client
// island inside it.

const links = [
  { href: "#breakdowns", label: "Breakdowns" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Token math" },
  { href: "#install", label: "Install" },
];

export function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-border backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--color-bg) 82%, transparent)",
        WebkitBackdropFilter: "saturate(160%) blur(12px)",
        backdropFilter: "saturate(160%) blur(12px)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link
          href="#top"
          aria-label="Tokenscope home"
          className="inline-flex items-center gap-2.5 font-sans text-base font-semibold tracking-tight"
        >
          <BrandMark size={20} />
          Tokenscope
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[14.5px] font-medium text-dim transition-colors hover:text-text"
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
            <i className="ph ph-github-logo text-[17px]" aria-hidden />
          </a>
          <ThemeToggle />
          <Button as="a" href="#install" size="sm">
            Install
          </Button>
        </div>
      </div>
    </nav>
  );
}
