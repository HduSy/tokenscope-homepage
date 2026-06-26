// Giant outlined "Tokenscope" wordmark at the absolute bottom of the page.
// Modelled after Qoder's footer signoff — fills the viewport edge-to-edge,
// stroke-only fill in --color-border-strong so it reads as a faint
// watermark on top of the page's ambient grid background, not a hard block.
//
// SVG with textLength + lengthAdjust=spacingAndGlyphs lets the text fill
// the viewBox width exactly; preserveAspectRatio=xMidYMax meet then scales
// the whole thing to whatever viewport width it's dropped into.

export function BrandSignoff() {
  return (
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
            fill: "none",
            stroke: "var(--color-border-strong)",
            strokeWidth: 1.1,
          }}
        >
          Tokenscope
        </text>
      </svg>
    </div>
  );
}
