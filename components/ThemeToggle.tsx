"use client";

import { useRef } from "react";
import { useTheme } from "./useTheme";

// Sun/moon toggle in the page nav. On click, wraps the theme flip in a
// View Transition + animates the new layer's clip-path from a 0-radius
// circle at the button's centre out to a circle that covers the viewport
// — the new theme reveals as a growing disc instead of snapping in.
//
// Falls back to a plain flip in browsers without startViewTransition
// (Firefox today) and when prefers-reduced-motion is set.

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    const button = buttonRef.current;
    const doc = document as DocWithVT;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!button || !doc.startViewTransition || reduce) {
      toggle();
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // End radius = distance to the farthest viewport corner — guarantees
    // the circle covers the whole page no matter where the toggle sits.
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      toggle();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 520,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-dim transition-[color,border-color,background] hover:text-text hover:border-border-strong"
    >
      <i className={`ph ph-${dark ? "sun" : "moon"} text-[17px]`} aria-hidden />
    </button>
  );
}
