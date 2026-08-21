import type { SVGProps } from "react";

/**
 * Local stand-ins for the exact icon names used from `@acko/icons` — see
 * .claude/skills/acko-design-system/iconography.md. `@acko/icons` itself can't be
 * installed in this environment (Nexus registry unreachable), so these are
 * hand-authored 1em SVGs matching each icon's documented name/semantics 1:1.
 * Swap `import { X } from "./icons"` for `import { X } from "@acko/icons"` once
 * the real package is installable — call sites don't change.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

/** Back navigation — iconography.md: "Back navigation (icon-only) → ArrowLeft" */
export function ArrowLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 12h12M6 12l6-6M6 12l6 6" />
    </svg>
  );
}

/** Back navigation (this screen's plain "<" chevron — see AlmostThereDetailsPage) */
export function ChevronLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

/** Dropdown / select trigger — iconography.md: "Dropdown menu trigger → ChevronDown" */
export function ChevronDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Calendar month/year navigation — iconography.md's documented `ChevronRight` */
export function ChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/** Help / support entry point */
export function Headphone(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 13a7 7 0 0 1 14 0" />
      <rect x="3" y="12" width="4" height="8" rx="2" />
      <rect x="17" y="12" width="4" height="8" rx="2" />
    </svg>
  );
}

/** Personal details section marker */
export function Profile(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

/** Professional details section marker */
export function ClipboardCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 13l2 2 4-4" />
    </svg>
  );
}

/** Informational note — iconography.md's documented `Info` icon */
export function Info(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

/** Selected-option marker inside an open dropdown panel */
export function Tick(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

/** Coupon / offer applied — simple, reliable "%"-in-circle rather than a
   hand-drawn scalloped rosette, which rendered as a lumpy, malformed shape. */
export function Discount(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 16L16 8" />
      <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}
