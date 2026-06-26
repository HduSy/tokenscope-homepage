"use client";

import { useEffect, useState } from "react";

// Eases a number from 0 → `target` once `active` flips true (e.g. when the
// element scrolls into view via useInView). easeOutExpo matches the rest of
// the page's motion (panel count-up, reveal). Snaps instantly to target under
// prefers-reduced-motion.

export function useCountUp(target: number, active: boolean, duration = 1100) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVal(target);
      return;
    }
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
  }, [target, active, duration]);

  return val;
}
