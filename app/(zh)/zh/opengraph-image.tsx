import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE, loadGoogleFont } from "@/lib/og-image";

// Chinese Open Graph card. Same dark Tokenscope palette + accent green as
// the English card, with localized headline/tagline. Satori's default
// sans-serif has no CJK glyphs, so we fetch a Noto Sans SC subset at
// build/request time scoped to exactly the characters this card renders
// (~5KB instead of the full ~10MB font).

const HEADLINE_1 = "看清你的 Claude Code";
const HEADLINE_2 = "到底花了多少钱。";
const TAGLINE = "Claude Code Token 费用，全在你的 macOS 菜单栏。";

export const alt = "Tokenscope — Claude Code Token 费用，全在你的 macOS 菜单栏";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  // Two weights: 700 for the headline, 600 for the wordmark / tagline. Each
  // subsetted to only the glyphs it renders.
  const headlineChars = HEADLINE_1 + HEADLINE_2;
  const taglineChars = "Tokenscope" + TAGLINE;
  const [bold, semibold] = await Promise.all([
    loadGoogleFont("Noto+Sans+SC", 700, headlineChars),
    loadGoogleFont("Noto+Sans+SC", 600, taglineChars),
  ]);
  return renderOgImage({
    headline1: HEADLINE_1,
    headline2: HEADLINE_2,
    tagline: TAGLINE,
    fonts: [
      { name: "NotoSansSC", data: bold, style: "normal", weight: 700 },
      { name: "NotoSansSC", data: semibold, style: "normal", weight: 600 },
    ],
  });
}
