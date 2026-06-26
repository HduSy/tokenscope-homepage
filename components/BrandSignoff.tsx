import { BackToTop } from "./BackToTop";

// Bottom slab: giant "Token" outlined + "scope" filled in accent green —
// emphasises the unique half of the brand the same way the marketing copy
// does throughout the page. The wordmark SVG is full-bleed and fills the
// whole slab height, so the back-to-top link sits in its own row ABOVE the
// wordmark (right-aligned to the content column) instead of floating over
// the letters — otherwise it covers "scope", especially on mobile.

export function BrandSignoff() {
  return (
    <div className="bg-bg">
      <div className="mx-auto flex max-w-[1200px] justify-end px-6 pt-8 sm:pt-10">
        <BackToTop />
      </div>
      <div aria-hidden="true" className="select-none overflow-hidden">
        <svg
          viewBox="0 0 550 100"
          width="100%"
          preserveAspectRatio="xMidYMax meet"
          className="block"
        >
          <text
            x="0"
            y="82"
            textLength="550"
            lengthAdjust="spacingAndGlyphs"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 100,
              letterSpacing: "-0.03em",
            }}
          >
            <tspan
              style={{
                fill: "none",
                stroke: "var(--color-border-strong)",
                strokeWidth: 1.5,
              }}
            >
              Token
            </tspan>
            <tspan style={{ fill: "var(--color-accent)" }}>scope</tspan>
          </text>
        </svg>
      </div>
    </div>
  );
}
