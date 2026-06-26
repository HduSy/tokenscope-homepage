import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// Shared button styling for the pill-shaped primary/ghost buttons used across
// the page. Renders as <button> by default; pass `as="a"` for a link.

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex items-center gap-2 rounded-full font-sans font-semibold whitespace-nowrap border border-transparent cursor-pointer transition-[transform,background,border-color,box-shadow] duration-200 active:translate-y-px active:scale-[0.99]";

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-[15px]",
  sm: "px-3.5 py-2 text-[13.5px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink shadow-[0_10px_24px_-12px_color-mix(in_srgb,var(--color-accent)_80%,transparent)] hover:-translate-y-px hover:shadow-[0_14px_30px_-10px_color-mix(in_srgb,var(--color-accent)_85%,transparent)]",
  ghost:
    "bg-transparent text-text border-border-strong hover:-translate-y-px hover:bg-card hover:border-dim",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps & { as?: "button" } & ComponentPropsWithoutRef<"button">;
type ButtonAsAnchor = BaseProps & { as: "a" } & ComponentPropsWithoutRef<"a">;
type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children, as, ...rest } = props as
    & BaseProps
    & { as?: ElementType }
    & Record<string, unknown>;
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const Tag = (as ?? "button") as ElementType;
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
