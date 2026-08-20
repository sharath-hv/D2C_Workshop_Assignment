import { useEffect, useState } from "react";

/** responsiveness.md's canonical mobile breakpoint: 0–599px. */
const MOBILE_QUERY = "(max-width: 599px)";

/**
 * Tracks whether the viewport is currently in the mobile range, for
 * responsiveness.md's component-downshift rules (e.g. "Large dropdown →
 * Bottom sheet" on mobile) that require a structural, not just visual, swap.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mediaQueryList.matches);
    onChange();
    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
