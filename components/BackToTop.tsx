"use client";

import { Icon } from "./Icon";

// Small "Back to top ↑" affordance pinned to the bottom-right of the
// BrandSignoff slab. window.scrollTo with behavior:smooth defers to Lenis
// when it's active (Lenis intercepts the native scroll API) and falls back
// to the browser's CSS-driven smooth scroll otherwise.

export function BackToTop() {
  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
