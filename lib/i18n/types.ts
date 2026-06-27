// Locale identifiers used by the route layer, the cookie middleware (proxy.ts),
// and the <LocaleSwitch> client toggle. Keep this list in sync with the
// dictionary modules below and with proxy.ts' matcher.

export type Locale = "en" | "zh";

export const LOCALES: readonly Locale[] = ["en", "zh"] as const;

// Cookie set by <LocaleSwitch> before navigating, read by proxy.ts on every
// matched request. Single source of truth so the toggle and the middleware
// can't drift on the cookie name.
export const LOCALE_COOKIE = "locale";

// Map from a locale to the HTML lang attribute value it should produce. The
// root layout SSRs lang="en" by default; the inline <script> in <head> reads
// location.pathname and overrides this client-side post-hydration.
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
};

// The route prefix a locale lives at. English is the canonical "/" so its
// prefix is "" (e.g. `/${PREFIX[locale]}` becomes "/" not "//"). Used by
// LocaleSwitch to build hrefs and by middleware to detect path locale.
export const PREFIX: Record<Locale, string> = {
  en: "",
  zh: "zh",
};
