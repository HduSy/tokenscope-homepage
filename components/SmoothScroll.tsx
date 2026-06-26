"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Page-wide smooth scroll. Lenis intercepts wheel + touch deltas and lerps
// the document scroll position toward them, so trackpad / mouse-wheel /
// keyboard scrolling all feel uniform regardless of platform. Lenis still
// fires the standard "scroll" event on window, so Nav's scroll listener
// keeps working unchanged. Respect prefers-reduced-motion: in that mode we
// skip Lenis entirely and let the browser scroll natively.

export function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      // easeOutExpo — strong initial momentum, very soft landing. Same curve
      // used elsewhere in the page for the panel count-up + reveal fade.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
