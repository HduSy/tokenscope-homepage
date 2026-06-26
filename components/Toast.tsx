"use client";

import { useEffect, useState } from "react";

// Tiny global toast — any client component dispatches a custom event and the
// single <ToastHost /> in the layout shows it. Used by the install copy button
// and the hero/CTA "Install with Homebrew" buttons.

const EVT = "tokenscope:toast";

export function showToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(EVT, { detail: message }));
}

export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onToast = (e: Event) => {
      const ce = e as CustomEvent<string>;
      setMsg(ce.detail);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 1600);
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
        msg ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      <i className="ph ph-check text-base" aria-hidden />
      <span>{msg ?? "Copied"}</span>
    </div>
  );
}
