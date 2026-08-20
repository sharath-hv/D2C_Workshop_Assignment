import { useEffect, useState, type ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  children: ReactNode;
}

/** acko-motion-system curves.md "Default fixed values" — surface close default. */
const CLOSE_DURATION_MS = 400;

/**
 * MISSING component — see missing-components-personal-professional-details.md.
 * No @acko/* package, props, or API for "BottomSheet" is documented anywhere in
 * the skill files; only the *concept* is (responsiveness.md: "Large dropdown →
 * Bottom sheet" on mobile) plus generic --drawerBg/--drawerOverlay tokens
 * (components.md). Built from those tokens + the acko-motion-system skill's
 * motion.surface.open/close spec (550ms ease-out enter, 400ms ease-in exit,
 * sheet y 100%→0%, overlay opacity 0→35-40%) and touch-accessibility.md's
 * modal focus rule (focus on open, return to trigger on close — handled by the
 * caller, which owns the trigger ref).
 */
export function BottomSheet({ open, onClose, titleId, children }: BottomSheetProps) {
  const [phase, setPhase] = useState<"closed" | "open" | "closing">(open ? "open" : "closed");

  useEffect(() => {
    if (open) {
      setPhase("open");
      return;
    }
    if (phase === "closed") return;
    // Without this, conditional unmount would skip the documented close motion
    // entirely — the sheet would just vanish instead of sliding/fading out.
    setPhase("closing");
    const timeout = setTimeout(() => setPhase("closed"), CLOSE_DURATION_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (phase === "closed") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [phase, onClose]);

  if (phase === "closed") return null;

  return (
    <div
      className={`acko-bottom-sheet-overlay${phase === "closing" ? " acko-bottom-sheet-overlay--closing" : ""}`}
      onClick={onClose}
    >
      <div
        className={`acko-bottom-sheet${phase === "closing" ? " acko-bottom-sheet--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="acko-bottom-sheet-handle" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
