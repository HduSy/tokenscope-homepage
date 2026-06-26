"use client";

import { scrollToTop } from "@/lib/lenis";
import { BrandMark } from "./BrandMark";

// Clicking the logo scrolls back to the top via Lenis's own scrollTo — see
// lib/lenis.ts for why window.scrollTo isn't used (it races with Lenis and
// the first click can be eaten). Falls back to native instant scroll when
// Lenis is off (reduced-motion mode).

export function LogoLink() {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollToTop(!reduce);
  };

  return (
    <a
      href="#top"
      onClick={onClick}
      aria-label="Back to top"
      className="inline-flex cursor-pointer items-center gap-2.5 font-sans text-base font-semibold tracking-tight"
    >
      <BrandMark size={20} />
      Tokenscope
    </a>
  );
}
