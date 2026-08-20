import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  variant?: "primary" | "secondary" | "muted" | "ghost";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Local stand-in for `@acko/card` — see .claude/skills/acko-design-system/cards.md Part 1. No sub-components; all padding/layout goes on an inner wrapper div. */
export function Card({ variant = "primary", className, style, children }: CardProps) {
  return (
    <div className={["acko-card", `acko-card--${variant}`, className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
