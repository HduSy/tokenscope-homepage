// Synchronous dictionary lookup. Both `en` and `zh` are eagerly loaded as
// static TS modules — that's cheap (the dicts are pure data + a few static
// JSX elements) and means every component, server OR client, can call
// `getDict(locale)` without `await` and without React Context.
//
// Trade-off: both dicts ship to the client (since some client components also
// import them). Combined size is a few KB gzipped — well under the cost of
// even a small font subset, so not worth code-splitting.

import { en, type Dict } from "./en";
import { zh } from "./zh";
import type { Locale } from "./types";

const DICTS: Record<Locale, Dict> = { en, zh };

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
}

export type { Dict, Locale };
export { LOCALES, LOCALE_COOKIE, HTML_LANG, PREFIX } from "./types";
