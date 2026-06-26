"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "tokenscope-theme";

// Single source of truth for the page's dark/light state. Both the Nav's
// ThemeToggle and the embedded Panel's theme toggle call into this so they
// stay in sync. The actual store is the [data-theme] attribute on <html>,
// set pre-paint by ThemeInit's inline script.
//
// Default behaviour: with no stored preference the theme tracks the OS
// (prefers-color-scheme) LIVE — change your system appearance and the page
// follows without a reload. The moment the user clicks the toggle, their
// explicit choice is persisted and wins over the system setting thereafter.

// useLayoutEffect on the client: it syncs `dark` to the real data-theme
// before the browser paints, so the Panel — whose colours come from this
// state — never flashes the wrong theme. useEffect on the server avoids
// React's useLayoutEffect-during-SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function readStored(): "dark" | "light" | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === "dark" || s === "light" ? s : null;
  } catch {
    return null;
  }
}

export function useTheme(): { dark: boolean; toggle: () => void } {
  // Start `true` to match the SSR render (document is unavailable on the
  // server, so we can't read data-theme there without a hydration mismatch).
  // The layout effect below corrects this before first paint.
  const [dark, setDark] = useState(true);

  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.getAttribute("data-theme") !== "light");
    read();

    // React to the toggle (which mutates data-theme).
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    // Live-follow the OS theme, but only while the user hasn't made an
    // explicit choice. Once they toggle, their pick is in localStorage and
    // we stop overriding it.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      if (readStored() !== null) return;
      root.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onSystem);

    return () => {
      mo.disconnect();
      mq.removeEventListener("change", onSystem);
    };
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return { dark, toggle };
}
