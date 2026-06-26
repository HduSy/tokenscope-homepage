import { BackToTop } from "./BackToTop";

// Bottom slab: giant filled "Tokenscope" wordmark + a back-to-top button
// pinned to the lower-right. Outer container is the relative anchor; the
// wordmark is the only aria-hidden piece, the back-to-top stays in the
// accessibility tree.

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
              fill: "var(--color-card)",
            }}
          >
            Tokenscope
          </text>
        </svg>
      </div>
      <div className="absolute bottom-5 right-6">
        <BackToTop />
      </div>
    </div>
  );
}
