"use client";

import { useTheme } from "./useTheme";

// Shared theme-toggle interaction: flip the theme inside a View Transition and
// animate the new layer in as a growing disc originating at the clicked
// control, instead of an instant swap. Used by both the Nav's <ThemeToggle/>
// and the embedded Panel's toggle so their behaviour stays identical.
//
// Falls back to a plain flip when startViewTransition is unavailable (Firefox
// today) or when prefers-reduced-motion is set.

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export type TransitionOrigin = { x: number; y: number };

export function useThemeTransition() {
  const { toggle } = useTheme();

  return (origin: TransitionOrigin | null) => {
    const doc = document as DocWithVT;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!origin || !doc.startViewTransition || reduce) {
      toggle();
      return;
    }

    const { x, y } = origin;
    // End radius = distance to the farthest viewport corner — guarantees the
    // circle covers the whole page no matter where the toggle sits.
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
          // Slow, deliberate reveal — 1300ms lets the eye actually track the
          // wavefront across the page instead of feeling like a fade.
          duration: 1300,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };
}
