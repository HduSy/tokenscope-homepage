// Site-wide locale-invariant constants. The taglines and descriptions used to
// live here too, but they moved into lib/i18n/{en,zh}.tsx once the page went
// bilingual. What stays:
//
//   - SITE_URL: canonical domain, used by metadataBase, sitemap, robots,
//     JSON-LD url field, and the ShareMenu fallback URL during SSR.
//   - SITE_NAME: the brand string, untranslated (it's a proper noun).

export const SITE_URL = "https://tokenscope.app";
export const SITE_NAME = "Tokenscope";
