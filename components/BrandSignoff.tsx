// Giant filled "Tokenscope" wordmark stamped along the absolute bottom of
// the page — companion slab to the footer above. Solid card-tone fill on a
// solid body-tone background so the lettering reads as a subtle inset
// against the same opaque footer surface (no grid pattern showing through).

export function BrandSignoff() {
  return (
    <div aria-hidden="true" className="select-none overflow-hidden bg-bg">
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
  );
}
