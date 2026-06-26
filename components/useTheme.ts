"use client";

import { useEffect, useState } from "react";

// Single source of truth for the page's dark/light state. Both the Nav's
// ThemeToggle and the embedded Panel's theme toggle call into this so they
// stay in sync. The actual store is the [data-theme] attribute on <html>,
// which is set pre-paint by ThemeInit's inline script.

export function useTheme(): { dark: boolean; toggle: () => void } {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.getAttribute("data-theme") !== "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("tokenscope-theme", next);
    } catch {}
  };

  return { dark, toggle };
}
