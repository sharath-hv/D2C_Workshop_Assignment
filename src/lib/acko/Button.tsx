import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverted" | "danger";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

/** Local stand-in for `@acko/button` — see .claude/skills/acko-design-system/components.md (button/) */
export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  iconOnly,
  fullWidth,
  className,
  children,
  type = "button",
  style,
  ...rest
}: ButtonProps) {
  const classes = [
    "acko-button",
    `acko-button--${variant}`,
    `acko-button--${size}`,
    iconOnly ? "acko-button--icon-only" : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      style={{ width: fullWidth ? "100%" : undefined, ...style }}
      {...rest}
    >
      {iconLeft ? <span className="acko-button-icon">{iconLeft}</span> : null}
      {!iconOnly && children}
      {iconRight ? <span className="acko-button-icon">{iconRight}</span> : null}
    </button>
  );
}
