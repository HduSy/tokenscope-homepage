"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

// Tiny global toast — any client component dispatches a custom event and the
// single <ToastHost /> in the layout shows it. Used by the install copy button
// and the hero/CTA "Install with Homebrew" buttons.

const EVT = "tokenscope:toast";

export function showToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(EVT, { detail: message }));
}

export function ToastHost() {
  // Split into two pieces of state: `visible` drives the slide+fade animation,
  // `label` holds the text. When visible flips back to false the label stays
  // put so the exit animation shows the same message it came in with — without
  // this the text would flash back to a fallback ("Copied") as the toast fades
  // out, looking like a second, ghostly toast.
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onToast = (e: Event) => {
      const ce = e as CustomEvent<string>;
      setLabel(ce.detail);
      setVisible(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 1600);
    };
    window.addEventListener(EVT, onToast);
    return () => {
      window.removeEventListener(EVT, onToast);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-7 left-1/2 z-[100] inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-accent px-4.5 py-2.5 text-sm font-semibold text-accent-ink shadow-[var(--shadow-card)] transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      <Icon name="check" size={16} />
      <span>{label}</span>
    </div>
  );
}
