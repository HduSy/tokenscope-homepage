"use client";

import { scrollToHash } from "@/lib/lenis";

// Same-page hash links (the header + footer section anchors). Routed through
// Lenis's scrollTo so the jump never races Lenis's rAF scroll loop — the bug
// lib/lenis.ts documents for back-to-top, which also affects plain hash links.
// The href stays a real "#anchor" so no-JS clients and crawlers still reach
// the section natively, and scroll-padding-top handles the nav offset on that
// path.

export function AnchorLink({
  href,
  className,
  children,
  ...rest
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "href"> & {
  href: string;
}) {
  return (
    <a
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        if (!href.startsWith("#") || href.length < 2) return;
        const el = document.getElementById(href.slice(1));
        if (!el) return; // unknown target → let the browser do its default
        e.preventDefault();
        const reduce =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        scrollToHash(href, !reduce);
        history.replaceState(null, "", href);
      }}
    >
      {children}
    </a>
  );
}
