import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

// English Open Graph card. Next.js auto-wires <meta property="og:image"> from
// this file convention. twitter-image.tsx re-exports the same handlers so
// twitter:image is set too.

export const alt = "Tokenscope — Claude Code token cost, in your macOS menu bar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    headline1: "See what your Claude Code",
    headline2: "actually costs.",
    tagline: "Claude Code token cost, in your macOS menu bar.",
  });
}
