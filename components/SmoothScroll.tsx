"use client";

import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

// Page-wide smooth scroll. Lenis intercepts wheel + touch deltas and lerps
// the document scroll position toward them, so trackpad / mouse-wheel /
// keyboard scrolling all feel uniform regardless of platform. Lenis still
// fires the standard "scroll" event on window, so Nav's scroll listener
// keeps working unchanged. Respect prefers-reduced-motion: in that mode we
// skip Lenis entirely and let the browser scroll natively.
//
// Lenis is loaded via dynamic import() rather than a static top-level import.
// The library is ~12KB gzipped and isn't needed before first paint — every
// chunk that isn't blocking initial render belongs off the critical path.
// Skipped entirely on no-JS / prefers-reduced-motion (the import never runs).

export function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let lenis: import("lenis").default | null = null;
    let rafId = 0;
    let cancelled = false;

    // Defer the import + init off the critical path. Using requestIdleCallback
    // when available (Safari falls back to setTimeout 0) so the boot doesn't
    // compete with first-paint work like hero panel hydration.
    const start = () => {
      if (cancelled) return;
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({
          duration: 1.1,
          // easeOutExpo — strong initial momentum, very soft landing. Same curve
          // used elsewhere in the page for the panel count-up + reveal fade.
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        // Expose the instance so LogoLink / BackToTop can drive it via
        // scrollToTop() instead of fighting it with window.scrollTo.
        setLenis(lenis);
        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      });
    };

    const ric: typeof requestIdleCallback | undefined =
      "requestIdleCallback" in window ? window.requestIdleCallback : undefined;
    const idleHandle: number | NodeJS.Timeout = ric
      ? ric(start, { timeout: 800 })
      : setTimeout(start, 0);

    return () => {
      cancelled = true;
      if (ric && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle as number);
      } else {
        clearTimeout(idleHandle as NodeJS.Timeout);
      }
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis?.destroy();
    };
  }, []);

  return null;
}
