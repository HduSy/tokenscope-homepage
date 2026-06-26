"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

// Sticky nav with two states:
// - Top of page  → full-width glass bar with bottom border.
// - Scrolled     → the bar background fades away and the inner container
//                  shrinks into a floating glass pill centred on the page.
// The whole thing is a single sticky <header>; only inline styles change
// between states so width / radius / shadow can all transition together.

const links = [
  { href: "#breakdowns", label: "Breakdowns" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Token math" },
  { href: "#faq", label: "FAQ" },
  { href: "#install", label: "Install" },
];

const GLASS = "color-mix(in srgb, var(--color-bg) 82%, transparent)";
const BLUR = "saturate(160%) blur(12px)";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      // Outer bar: glass at top, transparent once scrolled (the inner pill
      // takes over the glass). transition covers background + border colour
      // so the bar dissolves smoothly into the page.
      className="sticky top-0 z-50 transition-[background,border-color,padding] duration-300 ease-out"
      style={{
        background: scrolled ? "transparent" : GLASS,
        backdropFilter: scrolled ? undefined : BLUR,
        WebkitBackdropFilter: scrolled ? undefined : BLUR,
        borderBottom: scrolled
          ? "1px solid transparent"
          : "1px solid var(--color-border)",
        paddingTop: scrolled ? 12 : 0,
        paddingBottom: scrolled ? 4 : 0,
      }}
    >
      <div
        // Inner container: stays sized to the page max-width at the top,
        // shrinks into a pill with backdrop-blur + shadow once scrolled.
        className="mx-auto flex h-14 items-center justify-between gap-4 transition-all duration-300 ease-out"
        style={{
          maxWidth: scrolled ? 920 : 1200,
          paddingLeft: scrolled ? 16 : 24,
          paddingRight: scrolled ? 12 : 24,
          borderRadius: scrolled ? 9999 : 0,
          background: scrolled ? GLASS : "transparent",
          backdropFilter: scrolled ? BLUR : undefined,
          WebkitBackdropFilter: scrolled ? BLUR : undefined,
          border: scrolled
            ? "1px solid var(--color-border-strong)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 12px 30px -12px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <Link
          href="#top"
          aria-label="Tokenscope home"
          className="inline-flex items-center gap-2.5 font-sans text-base font-semibold tracking-tight"
        >
          <BrandMark size={20} />
          Tokenscope
        </Link>

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
            <i className="ph ph-github-logo text-[17px]" aria-hidden />
          </a>
          <ThemeToggle />
          <Button as="a" href="#install" size="sm">
            Install
          </Button>
        </div>
      </div>
    </header>
  );
}
