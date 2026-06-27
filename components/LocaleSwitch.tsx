"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/types";

// EN / 中 toggle, sits in the nav next to ThemeToggle. Two-segment pill,
// matches ThemeToggle's height (h-9) so the cluster doesn't jump.
//
// Behaviour:
//   1. Reads current locale from the URL (`/zh*` → zh, else en).
//   2. On click, writes a `locale` cookie (1y, Lax) BEFORE navigating, so the
//      proxy.ts middleware sees the new preference on the next request.
//   3. Uses next/link's prefetch so the target route is warm when the user
//      clicks (round-trip feels instant).
//
// Cookie is set client-side via document.cookie — safe here because we're in
// a 'use client' island and the navigation that follows lets the new value
// stick for the next visit.

const LANGS: { locale: Locale; href: string; label: string; aria: string }[] = [
  { locale: "en", href: "/", label: "EN", aria: "English" },
  { locale: "zh", href: "/zh", label: "中", aria: "中文" },
];

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function setLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

export function LocaleSwitch() {
  const pathname = usePathname() ?? "/";
  const current: Locale = pathname.startsWith("/zh") ? "zh" : "en";

  return (
    <div
      role="group"
      aria-label="Switch language"
      // Outer pill matches ThemeToggle's border / bg / hover treatment; padding
      // tighter (px-1 inside, h-9 outside) so the two segments fit inside the
      // same height as the round icon buttons in the nav cluster.
      className="inline-flex h-9 items-center rounded-full border border-border bg-card p-0.5"
    >
      {LANGS.map((l) => {
        const active = l.locale === current;
        return (
          <Link
            key={l.locale}
            href={l.href}
            aria-label={l.aria}
            aria-current={active ? "true" : undefined}
            onClick={() => setLocaleCookie(l.locale)}
            className={[
              "inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-full px-2 text-[12.5px] font-medium transition-colors",
              active
                ? "bg-accent text-accent-ink"
                : "text-dim hover:text-text",
            ].join(" ")}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
