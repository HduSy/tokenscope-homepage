import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/types";

// Cookie-driven locale redirect between `/` (English) and `/zh` (Chinese).
//
// The cookie is set by <LocaleSwitch> (components/LocaleSwitch.tsx) on click,
// so this only redirects users who have *explicitly* expressed a preference.
// First-time visitors (no cookie) are never redirected — that keeps `/`
// crawlable as English without any Accept-Language guesswork, and preserves
// the canonical SEO URL for the English page.
//
// The matcher is narrowed to the two locale roots so this never fires for
// _next assets, OG images, sitemap, robots, etc. — keeps the middleware path
// genuinely cheap (one cookie read + maybe a 307).

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value as
    | Locale
    | undefined;

  if (!cookie) return NextResponse.next();

  // On `/` and the user's saved locale is zh → push them to `/zh`.
  if (pathname === "/" && cookie === "zh") {
    return NextResponse.redirect(new URL("/zh", request.url));
  }

  // On `/zh` and the user's saved locale is en → push them back to `/`.
  if (pathname === "/zh" && cookie === "en") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Only the two locale roots — and explicitly nothing else. /_next/*, the
// sitemap, OG image route, robots.txt all stay untouched.
export const config = {
  matcher: ["/", "/zh"],
};
