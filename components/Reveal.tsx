"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

// Fade-and-rise into view once the element crosses 12% visibility. The CSS
// lives in globals.css under .reveal/.reveal.in. `delayIndex` staggers
// children inside the same parent via --reveal-i.

type Props = {
  children: ReactNode;
  delayIndex?: number;
  className?: string;
  as?: "div" | "section" | "article" | "p" | "ul";
};

export function Reveal({ children, delayIndex = 0, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            (en.target as HTMLElement).classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  const style = { "--reveal-i": delayIndex } as CSSProperties;
  return (
    // @ts-expect-error - ref type widens across the polymorphic Tag union.
    <Tag ref={ref} style={style} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
