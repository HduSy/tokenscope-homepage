"use client";

import { BrandMark } from "./BrandMark";

// Clicking the logo scrolls the page back to the top. Lenis hooks into the
// standard scroll API, so window.scrollTo with smooth behaviour stays in
// sync with the page-wide smooth-scroll. Falls back to instant on reduced
// motion.

export function LogoLink() {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
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
