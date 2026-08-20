import type { CSSProperties, ReactNode } from "react";

interface SurfaceProps {
  variant?: "primary" | "secondary" | "staticBlack" | "staticWhite" | "brand" | "brandLight" | "inverted";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const VARIANT_CLASS: Record<Required<SurfaceProps>["variant"], string> = {
  primary: "acko-surface--primary",
  secondary: "acko-surface--secondary",
  staticBlack: "acko-surface--static-black",
  staticWhite: "acko-surface--static-white",
  brand: "acko-surface--brand",
  brandLight: "acko-surface--brand-light",
  inverted: "acko-surface--inverted",
};

/** Local stand-in for `@acko/surface` — see .claude/skills/acko-design-system/cards.md Part 0. Always full-bleed; pass `w-full rounded-none`. */
export function Surface({ variant = "primary", className, style, children }: SurfaceProps) {
  return (
    <div className={[VARIANT_CLASS[variant], className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
