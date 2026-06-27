"use client";

import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/types";

// EN / 中 toggle. Sits in the nav next to ThemeToggle. Two-segment pill,
// matches ThemeToggle's height (h-9) so the cluster doesn't jump.
//
// Why plain <a> instead of next/link:
// The cookie-based locale redirect lives in next.config.ts at the routing
// layer. next/link prefetches its href on hover/viewport, and when the
// prefetched response is a 307 (it follows redirects per RFC), the router
// caches that redirect and replays it on click — so a stale cookie at
// prefetch time can send the user back to where they started. A plain <a>
// triggers a real browser navigation each click, the freshly-set cookie
// rides along with the request, and the CDN's redirect rule sees the
// correct value. ~200-300ms in prod vs cached soft nav, but rare action
// and reliable beats fast-but-broken.

const LANGS: { locale: Locale; href: string; label: string; aria: string }[] = [
  { locale: "en", href: "/", label: "EN", aria: "English" },
  { locale: "zh", href: "/zh", label: "中", aria: "中文" },
];

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function LocaleSwitch() {
  const pathname = usePathname() ?? "/";
  const current: Locale = pathname.startsWith("/zh") ? "zh" : "en";

  return (
    <div
      role="group"
      aria-label="Switch language"
      // Outer pill matches ThemeToggle's border / bg / hover treatment; padding
      // tighter (p-0.5 inside, h-9 outside) so the two segments fit inside the
      // same height as the round icon buttons in the nav cluster.
      className="inline-flex h-9 items-center rounded-full border border-border bg-card p-0.5"
    >
      {LANGS.map((l) => {
        const active = l.locale === current;
        return (
          <a
            key={l.locale}
            href={l.href}
            aria-label={l.aria}
            aria-current={active ? "true" : undefined}
            onClick={(e) => {
              // Already on this locale → no navigation, no cookie churn.
              if (active) {
                e.preventDefault();
                return;
              }
              // Set the persisted-preference cookie synchronously BEFORE the
              // browser follows the link. The next request includes it, so
              // Vercel's redirects() rule matches correctly on the server.
              document.cookie =
                `${LOCALE_COOKIE}=${l.locale}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
            }}
            className={[
              "inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-full px-2 text-[12.5px] font-medium transition-colors",
              active
                ? "bg-accent text-accent-ink"
                : "text-dim hover:text-text",
            ].join(" ")}
          >
            {l.label}
          </a>
        );
      })}
    </div>
  );
}
