"use client";

import { scrollToTop } from "@/lib/lenis";
import { Icon } from "./Icon";

// Small "Back to top ↑" affordance pinned to the bottom-right of the
// BrandSignoff slab. Routes through Lenis's scrollTo (see lib/lenis.ts) so it
// never races the smooth-scroll loop — one click always lands.

export function BackToTop() {
  const onClick = () => {
    scrollToTop();
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-[13px] font-medium text-dim transition-colors hover:text-text"
    >
      Back to top
      <Icon name="arrow-circle-up" size={16} />
    </button>
  );
}
