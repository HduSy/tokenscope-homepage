"use client";

import { useTheme } from "./useTheme";

// Sun/moon toggle in the page nav. Reads from and writes to the shared
// useTheme() hook so the panel-embedded theme toggle stays in sync.

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-dim transition-[color,border-color,background] hover:text-text hover:border-border-strong"
    >
      <i className={`ph ph-${dark ? "sun" : "moon"} text-[17px]`} aria-hidden />
    </button>
  );
}
