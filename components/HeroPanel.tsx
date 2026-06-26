"use client";

import { useEffect, useRef, useState } from "react";
import { Panel } from "./tokenscope/Panel";
import { DEMO_DASHBOARD } from "@/lib/tokenscope-data";
import { useTheme } from "./useTheme";

// Embeds the real Tokenscope Panel inside the hero, fed by the static
// dashboard snapshot. `active`+`openGen` are wired so the count-up replays
// each time the panel re-enters the viewport, which makes scrolling back to
// the top feel alive.

export function HeroPanel() {
  const { dark, toggle } = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [openGen, setOpenGen] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setActive(true);
            setOpenGen((g) => g + 1);
          } else {
            setActive(false);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Panel
        dash={DEMO_DASHBOARD}
        dark={dark}
        onToggleTheme={toggle}
        openGen={openGen}
        active={active}
      />
    </div>
  );
}
