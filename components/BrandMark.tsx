// The Tokenscope brand glyph — three ascending bars inside a rounded square.
// Used in nav, panel header, footer. Sized via width/height props.

type Props = { size?: number; className?: string };

export function BrandMark({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="0.6"
        y="0.6"
        width="12.8"
        height="12.8"
        rx="3.2"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.3"
      />
      <rect x="3" y="7.5" width="1.7" height="3.2" rx="0.6" fill="var(--color-accent)" />
      <rect x="6.15" y="5" width="1.7" height="5.7" rx="0.6" fill="var(--color-accent)" />
      <rect x="9.3" y="3" width="1.7" height="7.7" rx="0.6" fill="var(--color-accent)" />
    </svg>
  );
}
