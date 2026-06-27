"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "./Icon";
import { SITE_URL } from "@/lib/site";
import { getDict, type Locale } from "@/lib/i18n";

// Share menu in the nav: a share icon opens a small popover with the five
// platforms. Each entry builds the platform's share-intent URL from the live
// page URL (so previews on *.vercel.app still share the right link) and the
// site tagline, then opens in a new tab. Closes on outside-click or Escape.

const enc = encodeURIComponent;

const PLATFORMS: {
  name: string;
  icon: IconName;
  href: (url: string, text: string) => string;
}[] = [
  {
    name: "X",
    icon: "x-logo",
    href: (u, t) => `https://twitter.com/intent/tweet?url=${enc(u)}&text=${enc(t)}`,
  },
  {
    name: "Reddit",
    icon: "reddit-logo",
    href: (u, t) => `https://www.reddit.com/submit?url=${enc(u)}&title=${enc(t)}`,
  },
  {
    name: "Facebook",
    icon: "facebook-logo",
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`,
  },
  {
    name: "Telegram",
    icon: "telegram-logo",
    href: (u, t) => `https://t.me/share/url?url=${enc(u)}&text=${enc(t)}`,
  },
  {
    name: "WhatsApp",
    icon: "whatsapp-logo",
    href: (u, t) => `https://wa.me/?text=${enc(`${t} ${u}`)}`,
  },
];

export function ShareMenu({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // window.location.href so the preview deploys share the correct URL; the
  // SITE_URL fallback only matters during SSR (the popover never renders
  // server-side — it's behind the `open` gate).
  const url = typeof window !== "undefined" ? window.location.href : SITE_URL;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.nav.share}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-dim transition-[color,border-color] hover:text-text hover:border-border-strong"
      >
        <Icon name="share-network" size={17} />
      </button>
      {open && (
        <div
          role="menu"
          // Anchor right by default (opens leftward — always fits, since the
          // share button sits in the nav's right cluster). On wide viewports
          // (≥1440px) where there's room to the right of the button, flip to
          // left-anchored so it opens rightward. Arbitrary breakpoint because
          // rightward only fits without overflow above ~1440px of width.
          className="absolute top-11 z-50 w-44 right-0 min-[1440px]:left-0 min-[1440px]:right-auto overflow-hidden rounded-[var(--radius-md)] border border-border bg-card p-1.5 shadow-[var(--shadow-card)]"
        >
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              role="menuitem"
              href={p.href(url, dict.site.tagline)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex cursor-pointer items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium text-dim transition-colors hover:bg-grid-line hover:text-text"
            >
              <Icon name={p.icon} size={17} />
              {p.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
