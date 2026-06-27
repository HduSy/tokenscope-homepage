"use client";

import { useEffect, useRef, useState } from "react";
import { Panel } from "./tokenscope/Panel";
import { buildDemoDashboard } from "@/lib/dashboard-mock";
import { useTheme } from "./useTheme";
import { getDict, type Locale } from "@/lib/i18n";

// Embeds the real Tokenscope Panel inside the hero, fed by the static
// dashboard snapshot. `active`+`openGen` are wired so the count-up replays
// each time the panel re-enters the viewport, which makes scrolling back to
// the top feel alive.
//
// Note: dashboard mock data (weekday labels, "Day N" tooltip, "Local" vendor)
// is rebuilt per locale via buildDemoDashboard so labels match the surrounding
// UI's language.

export function HeroPanel({ locale }: { locale: Locale }) {
  const { dark } = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [openGen, setOpenGen] = useState(0);
  const dict = getDict(locale);
  const dash = buildDemoDashboard(locale);

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
        dash={dash}
        dark={dark}
        openGen={openGen}
        active={active}
        compact
        labels={dict.panel}
      />
    </div>
  );
}
