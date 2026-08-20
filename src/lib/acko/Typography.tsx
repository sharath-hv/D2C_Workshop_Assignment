import type { CSSProperties, ElementType, ReactNode } from "react";

export type TypographyVariant =
  | "display-xl"
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "heading-xl"
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "label-lg"
  | "label-md"
  | "label-sm"
  | "caption"
  | "overline";

export type TypographyWeight = "regular" | "medium" | "semibold" | "bold";

export type TypographyColor =
  | "primary"
  | "secondary"
  | "invert"
  | "brand"
  | "error"
  | "success"
  | "static";

export type TypographyAlign = "left" | "center" | "right";

interface TypographyProps {
  variant: TypographyVariant;
  weight?: TypographyWeight;
  color?: TypographyColor;
  align?: TypographyAlign;
  as?: ElementType;
  truncate?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const DEFAULT_TAG: Record<TypographyVariant, ElementType> = {
  "display-xl": "h1",
  "display-lg": "h1",
  "display-md": "h1",
  "display-sm": "h2",
  "heading-xl": "h1",
  "heading-lg": "h2",
  "heading-md": "h3",
  "heading-sm": "h4",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  "label-lg": "span",
  "label-md": "span",
  "label-sm": "span",
  caption: "span",
  overline: "span",
};

const COLOR_VAR: Record<TypographyColor, string> = {
  primary: "var(--textPrimary)",
  secondary: "var(--textSecondary)",
  invert: "var(--textInvert)",
  brand: "var(--textBrand)",
  error: "var(--statusErrorText)",
  success: "var(--statusSuccessText)",
  static: "var(--textStaticLight)",
};

/** Local stand-in for `@acko/typography` — see .claude/skills/acko-design-system/typography.md */
export function Typography({
  variant,
  weight,
  color = "primary",
  align,
  as,
  truncate,
  id,
  className,
  style,
  children,
}: TypographyProps) {
  const Tag = as ?? DEFAULT_TAG[variant];
  const classes = [
    `acko-typography-${variant}`,
    weight ? `acko-typography-weight-${weight}` : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      id={id}
      className={classes}
      style={{
        color: COLOR_VAR[color],
        textAlign: align,
        ...(truncate
          ? {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }
          : undefined),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
