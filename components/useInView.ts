"use client";

import { useEffect, useRef, useState } from "react";

// Fires `inView=true` once when the element scrolls into view. Mirrors what
// <Reveal/> does, but exposed as a hook so individual chart components can
// drive their own entrance animations. Under prefers-reduced-motion it
// reports in-view immediately so animated charts snap to their final state
// instead of animating.

export function useInView<T extends HTMLElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const threshold = opts?.threshold ?? 0.25;
  const rootMargin = opts?.rootMargin ?? "0px 0px -40px 0px";
  const once = opts?.once ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView } as const;
}
