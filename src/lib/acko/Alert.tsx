import type { ReactNode } from "react";

interface AlertProps {
  severity?: "warning" | "info" | "success" | "error";
  icon?: ReactNode;
  children: ReactNode;
}

/** Local stand-in for `@acko/alert` — see .claude/skills/acko-design-system/components.md (alert/) */
export function Alert({ severity = "warning", icon, children }: AlertProps) {
  return (
    <div className={`acko-alert acko-alert--${severity}`} role="note">
      {icon ? (
        <span className="acko-alert-icon inline-flex size-24 shrink-0 [&_svg]:size-full" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <p className="acko-alert-body acko-typography-body-md">{children}</p>
    </div>
  );
}
