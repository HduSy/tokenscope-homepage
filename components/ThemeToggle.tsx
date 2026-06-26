"use client";

import { useEffect, useState } from "react";

// Sun/moon toggle that flips data-theme on <html> and persists the choice.
// Reads the current theme out of the DOM on mount so it stays in sync with
// the no-flash <ThemeInit /> script.

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("tokenscope-theme", next);
    } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-dim transition-[color,border-color,background] hover:text-text hover:border-border-strong"
    >
      <i className={`ph ph-${theme === "dark" ? "sun" : "moon"} text-[17px]`} aria-hidden />
    </button>
  );
}
