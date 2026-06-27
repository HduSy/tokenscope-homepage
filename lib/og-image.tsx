import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

// Shared Open Graph card renderer used by both locale variants:
// - app/(en)/opengraph-image.tsx (English copy)
// - app/(zh)/zh/opengraph-image.tsx (Chinese copy + Noto Sans SC subset)
//
// Same dark Tokenscope palette + accent green for both; only the headline /
// tagline strings (and the CJK font, for /zh) differ. Satori constraint:
// every <div> with children must declare display:"flex" — so the markup is
// nested flex boxes, no implicit block layout.

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

type OgImageProps = {
  headline1: string;
  headline2: string;
  tagline: string;
  /**
   * Optional custom font (e.g. Noto Sans SC for CJK glyphs). When omitted,
   * Satori's default sans-serif is used — fine for Latin scripts.
   */
  fonts?: ConstructorParameters<typeof ImageResponse>[1] extends infer O
    ? O extends { fonts?: infer F }
      ? F
      : never
    : never;
};

export function renderOgImage({ headline1, headline2, tagline, fonts }: OgImageProps) {
  const node: ReactElement = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#131619",
        backgroundImage:
          "radial-gradient(60% 50% at 78% 12%, rgba(39,176,110,0.28), transparent 70%)",
        color: "#ffffff",
        fontFamily: fonts && fonts.length > 0 ? fonts[0].name : "sans-serif",
      }}
    >
      {/* Brand row: three accent bars (the Tokenscope mark) + wordmark. */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <div
            style={{ display: "flex", width: 16, height: 44, backgroundColor: "#27b06e", borderRadius: 4 }}
          />
          <div
            style={{ display: "flex", width: 16, height: 32, backgroundColor: "#5fcf9c", borderRadius: 4 }}
          />
          <div
            style={{ display: "flex", width: 16, height: 22, backgroundColor: "#a7e3c5", borderRadius: 4 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: "-0.5px",
          }}
        >
          Token<span style={{ color: "#27b06e" }}>scope</span>
        </div>
      </div>

      {/* Headline (two flex lines) + tagline. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          <div style={{ display: "flex" }}>{headline1}</div>
          <div style={{ display: "flex", color: "#27b06e" }}>{headline2}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.6)" }}>
          {tagline}
        </div>
      </div>
    </div>
  );

  return new ImageResponse(node, { ...OG_SIZE, fonts });
}

// Fetches a single Google Font weight, subsetted to the characters in `text`,
// and returns the raw font bytes ready to pass into ImageResponse's `fonts`
// option. Used by the /zh OG card to embed only the CJK glyphs it actually
// renders (~5KB) instead of the full ~10MB Noto Sans SC. Satori (next/og's
// renderer) accepts woff/woff2/ttf/otf so we accept whichever format Google
// returns for the spoofed UA.
export async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
    },
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(/);
  if (!match) throw new Error(`Could not extract font URL from Google Fonts CSS for ${family}`);
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) throw new Error(`Google Fonts file fetch failed: ${fontRes.status}`);
  return fontRes.arrayBuffer();
}
