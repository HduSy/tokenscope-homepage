import { BackToTop } from "./BackToTop";

// Bottom slab: giant "Token" outlined + "scope" filled in accent green —
// emphasises the unique half of the brand the same way the marketing copy
// does throughout the page. Wordmark stays aria-hidden; the back-to-top
// button is in its own accessible layer.

export function BrandSignoff() {
  return (
    <div className="relative bg-bg">
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
      <div className="absolute bottom-5 right-6">
        <BackToTop />
      </div>
    </div>
  );
}
