"use client";

import { useRef } from "react";
import { Icon } from "./Icon";
import { useTheme } from "./useTheme";
import { useThemeTransition } from "./useThemeTransition";
import { getDict, type Locale } from "@/lib/i18n";

// Sun/moon toggle in the page nav. On click, the theme flip is wrapped in a
// View Transition and the new layer's clip-path animates from a 0-radius circle
// at the button's centre out to a circle that covers the viewport — the new
// theme reveals as a growing disc instead of snapping in. The transition
// mechanics live in useThemeTransition so the embedded Panel's toggle shares
// the exact same interaction.

export function ThemeToggle({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const { dark } = useTheme();
  const transition = useThemeTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    transition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={dict.nav.themeToggle}
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-dim transition-[color,border-color,background] hover:text-text hover:border-border-strong"
    >
      <Icon name={dark ? "sun" : "moon"} size={17} />
    </button>
  );
}
