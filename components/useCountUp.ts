"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// useLayoutEffect on the client (so the reset below lands before paint),
// useEffect on the server — avoids React's useLayoutEffect-during-SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Eases a number from 0 → `target` once `active` flips true (e.g. when the
// element scrolls into view via useInView). easeOutExpo matches the rest of
// the page's motion. Snaps to target under prefers-reduced-motion.
//
// SSR / no-JS: the initial value is `target` (not 0) so the server-rendered
// HTML and any JS-disabled client show the real number. JS users never see
// that final value flash: when the element enters view a layout effect drops
// it to 0 before paint, then the sweep runs — so the perceived effect is a
// clean 0 → target count-up with no flicker.

export function useCountUp(target: number, active: boolean, duration = 1100) {
  const [val, setVal] = useState(target);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reset to 0 the instant the element enters view, synchronously before the
  // browser paints, so the count-up starts clean (no flash of `target`).
  useIsoLayoutEffect(() => {
    if (!active) return;
    if (reduce) {
      setVal(target);
      return;
    }
    setVal(0);
  }, [active, target, reduce]);

  // Sweep 0 → target via rAF once active (and motion is allowed).
  useEffect(() => {
    if (!active || reduce) return;
    let raf = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(2, -10 * t); // easeOutExpo
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setVal(target * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, reduce]);

  return val;
}
