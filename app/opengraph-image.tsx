import { ImageResponse } from "next/og";

// Static Open Graph card, generated at build time via next/og (Satori).
// Next.js auto-wires <meta property="og:image"> from this file — no manual
// metadata needed. twitter-image.tsx re-exports the same design so
// twitter:image is set too. Uses the page's dark brand palette + accent green
// so the card reads as a Tokenscope asset at a glance.
//
// Satori constraint: every <div> with children must declare display:"flex"
// (no <br>, no implicit block layout), so the markup is nested flex boxes.

export const alt = "Tokenscope — Claude Code token cost, in your macOS menu bar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
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
          fontFamily: "sans-serif",
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
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            <div style={{ display: "flex" }}>See what your Claude Code</div>
            <div style={{ display: "flex", color: "#27b06e" }}>actually costs.</div>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.6)" }}>
            Claude Code token cost, in your macOS menu bar.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
