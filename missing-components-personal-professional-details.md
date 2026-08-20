## StickyPriceFooter

- **Type:** VARIANT-GAP
- **Screen:** personal-professional-details (pasted screenshots — "Almost there! We just need a few more details", 2 folds)
- **What it is:** A viewport-pinned footer, present unchanged while the form content scrolls underneath, made of a full-bleed coupon-applied strip (icon + `'ACKO15LIFE' coupon applied`) stacked directly on top of a price breakdown (strikethrough price, discounted price, GST note, "Price details" link) and a primary CTA ("Review my plan").
- **Closest @acko component:** `CommerceCard` (cards.md §8, `coupon-applied` variant) for the coupon strip content, plus `Surface variant="brandLight"` for its tint.
- **Why it didn't fit:** `CommerceCard`'s shell is `Card variant="secondary"` — a boxed, rounded (`--radius4xl`), bordered card meant to sit inline in page content. This pattern needs the coupon strip full-bleed (edge-to-edge, no radius/border) and fused directly above a `position: fixed` price/CTA bar pinned to the bottom of the viewport — no documented card or surface shell combines "full-bleed" with "fixed to viewport" and a composed price+CTA row beneath it. Built as a local composition (`Surface variant="brandLight"` band + plain fixed-position container) instead of forcing `CommerceCard`'s boxed shell into a shape it isn't specified for.
- **Props sketch:** No new component was named/exported — implemented inline in `AlmostThereDetailsPage` as a `<div className="fixed inset-x-0 bottom-0 z-[var(--zSticky)]">` wrapping `<Surface variant="brandLight">` (icon + label) and a price row (`Typography` × 3 + `Button variant="inverted"`). If promoted, a reasonable prop surface: `{ couponLabel?: string; strikethroughPrice: string; price: string; gstNote: string; onPriceDetails: () => void; ctaLabel: string; onCta: () => void }`.
- **Reuse potential:** HIGH — this is the standard bottom-of-screen shell for any ACKO purchase/checkout flow (protocol doc itself lists "sticky price footer" as a canonical missing-component example); almost every quote/purchase screen in this workshop will need the same fixed coupon+price+CTA region.

**Follow-up revision:** the coupon strip's fill/text/icon were switched from `Surface variant="brandLight"`'s default (`--surfaceAccentLight`, a translucent brand-purple wash) to solid `--statusSuccessSubtle`/`--statusSuccessText` (semantics.md's success family), per explicit user feedback that this is a savings indicator, not a brand moment, and that the brand tint read as unwantedly transparent. Applied via an inline `style` override on the `Surface` instance rather than a new Surface variant, since cards.md's `Surface` variant enum (primary/secondary/staticBlack/staticWhite/brand/brandLight/inverted) is a fixed, documented set with no "success" option — adding one would be inventing new API, not using existing tokens differently. Height also fixed to `40px` (was `py-12`-derived, ~44px) per explicit request. Added the missing full `status/success` token family (`--statusSuccessBase/Subtle/Border`, `--solidSecondary200/300/400` primitives) to `src/index.css`, which previously only had `--statusSuccessText` defined.

**Follow-up revision:** "Price details" was using `Typography color="brand"` (`--textBrand`, purple) even though it's a hyperlink, not a brand-emphasis label. `semantics.md` documents a dedicated `text/link` token (`--textLink`, blue) specifically for "Hyperlinks," distinct from `--textBrand`'s "Brand-coloured text (links, active labels)" — the more general, brand-emphasis role. Switched to `--textLink` via an inline `style` override rather than adding `"link"` to `Typography`'s `color` prop, since `typography.md` documents exactly 7 color values (primary/secondary/invert/brand/error/success/static) and `"link"` isn't one of them — extending the union would be inventing component API the skill file doesn't specify, whereas `--textLink` itself is a real, already-documented semantic token.

## Back navigation icon — ChevronLeft used instead of documented ArrowLeft

- **Type:** VARIANT-GAP (rule override, not a true library gap)
- **Screen:** personal-professional-details (sticky header, icon-only back button)
- **What it is:** The icon-only back button in the header renders `ChevronLeft`, a plain "<" glyph.
- **Closest @acko component:** `ArrowLeft` — iconography.md's decision table explicitly maps "Back navigation (icon-only) → ArrowLeft" ("Arrows carry kinetic meaning... it's an action, not a reveal").
- **Why it didn't fit:** Not a component/library gap — `ArrowLeft` exists and is the documented-correct icon for this exact case. Overridden on explicit user instruction because the source screenshots show a plain chevron, not a shafted arrow. Additionally, `ChevronLeft` itself is not in iconography.md's enumerated icon list (only `ChevronRight`/`ChevronDown`/`ChevronUp` are listed there, and the doc says the list isn't exhaustive) — so the icon name used is assumed, not confirmed against the real `@acko/icons` package.
- **Props sketch:** n/a — icon swap only: `<ChevronLeft aria-hidden="true" />` passed as `iconLeft` into the existing `Button` component; no new component created. Added `ChevronLeft` to the local `src/lib/acko/icons.tsx` stand-in module.
- **Reuse potential:** MEDIUM — worth flagging to design/product whether ACKO's real back-navigation convention is chevron or arrow, since the documented rule (iconography.md) and the reference screenshots for this flow disagree.

## Warning Alert — approximated Orange primitive ramp

- **Type:** VARIANT-GAP (token-value gap, not a component gap)
- **Screen:** personal-professional-details (advisory banner: "Please make sure this information is as per your PAN card")
- **What it is:** A warning-severity `Alert` using `--alertWarningSurface` / `--statusWarningBorder` / `--statusWarningText`, which alias `--solidOrange100` / `--solidOrange300` / `--solidOrange700`.
- **Closest @acko component:** `Alert` (correctly used, per semantics.md's rule that warning uses Orange, not Amber/Yellow).
- **Why it didn't fit:** `primitives.md` only publishes one Orange step (`--solidOrange600: #eb740a`) — it explicitly says "Full hex values ship in `@acko/tokens/tokens.css`," which can't be installed here (internal Nexus registry unreachable from this environment). The 50/100/300/700/900 steps needed for the warning family were approximated (peach-toned, consistent with 600's hue) rather than sourced from the real package.
- **Props sketch:** n/a — token values only; see the Orange block in `src/index.css`'s `:root`. Once real `@acko/tokens` is installable, delete the approximated block and let the real import take over — the banner's exact tint will likely shift slightly.
- **Reuse potential:** N/A — not a promotable component gap; flag instead to whoever owns `@acko/tokens` that `primitives.md` should either publish full ramps for every hue or link straight to the source of truth.

## Navigation header → page title spacing — 8px instead of layout.md's 32px

- **Type:** VARIANT-GAP (rule override, not a component gap)
- **Screen:** personal-professional-details (gap between the sticky header and the "Almost there..." title)
- **What it is:** The screen title's top margin, directly below the sticky navigation header.
- **Closest @acko component:** n/a — this is a spacing-rhythm rule, not a component. `layout.md`'s Standard Flow Screen template specifies `[Header] ↓gap-32 [Screen title]`.
- **Why it didn't fit:** Explicit user instruction set this gap to `8px` (`mt-8`) instead of the documented `gap-32`. No design-system justification found for `8px` specifically at this position — the template's own tight gap-8 step is documented for Title→Subtitle, not Header→Title. Flagging in case this was meant for a different pair of elements, or if `layout.md`'s template should be revisited for this screen type.
- **Props sketch:** n/a — `className="mt-8"` on the `Typography` title, replacing `mt-32`.
- **Reuse potential:** LOW — unless this becomes a deliberate revision to the Standard Flow Screen template rather than a one-off for this screen.

## Page title → info container spacing — 24px instead of layout.md's tighter 8px

- **Type:** VARIANT-GAP (rule override, not a component gap)
- **Screen:** personal-professional-details (gap between the "Almost there..." title and the PAN-card advisory `Alert`)
- **What it is:** The advisory `Alert`'s top margin, directly below the screen title.
- **Closest @acko component:** n/a — spacing-rhythm rule, not a component. `layout.md`'s Standard Flow Screen template specifies `[Screen title] ↓gap-8 [Supporting subtitle]`, and the `Alert` here plays that subtitle role.
- **Why it didn't fit:** Explicit user instruction moved this from `16px` (an earlier compromise between the template's `8px` and this screen's original, too-loose `32px`) to `24px` (`mt-24`). Still not the template's literal `8px` — that value reads as too tight for a boxed `Alert` with its own padding/background rather than plain subtitle text, so this remains a judgment call rather than the documented number.
- **Props sketch:** n/a — `className="mt-24"` on the `Alert`'s wrapping `<div>`, replacing `mt-16` (itself a replacement for the original `mt-32`).
- **Reuse potential:** LOW — specific to how tightly a boxed advisory note should sit under a screen title; worth revisiting only if this pattern (title + boxed note) recurs across other screens.

## Between-form-fields spacing — 24px instead of layout.md/scales.md's documented 20px

- **Type:** VARIANT-GAP (rule override, not a component gap)
- **Screen:** personal-professional-details (row/column gap inside both field grids)
- **What it is:** The gap between adjacent form fields (Full Name/Date of birth/Email ID/Marital Status/Residential Status, and Educational Qualification/Occupation type/Monthly income).
- **Closest @acko component:** n/a — spacing-rhythm rule, not a component. Both `layout.md` ("Between form fields → gap-20") and `scales.md`'s Inter-Component Spacing table ("Form fields | gap-20") document `20px` here.
- **Why it didn't fit:** Explicit user instruction changed this to `24px` (`gap-24`, replacing `gap-20`) on both field grids. No design-system justification found for `24px` specifically between fields — `24px` is documented elsewhere for card padding (lg) and section gaps, not inter-field spacing.
- **Props sketch:** n/a — `className="... gap-24 ..."` on both grid wrappers, replacing `gap-20`.
- **Reuse potential:** LOW — unless this becomes a deliberate revision to the documented form-field spacing rule rather than a one-off for this screen.

## BottomSheet

- **Type:** MISSING
- **Screen:** personal-professional-details (mobile presentation of the `Dropdown`'s option list — Educational Qualification, Occupation type)
- **What it is:** A viewport-anchored sheet that slides up from the bottom, with a scrim overlay, a drag handle, a title, and the option list — replaces the inline dropdown panel specifically on mobile.
- **Closest @acko component:** None with a documented API. `responsiveness.md` names the *concept* explicitly ("Large dropdown → Bottom sheet" on mobile, "same thumb-reach reason" as "Centered modal → Bottom sheet") and even warns "a squeezed-down modal is not a bottom sheet — it must be the actual component" — but no `@acko/*` package for it appears anywhere: not in `CLAUDE.md`'s authoritative component table, not with props/API in `components.md`. The only concrete material is generic `--drawerBg`/`--drawerOverlay` tokens under "dialog / drawer / skeleton / pagination".
- **Why it didn't fit:** Nothing to reuse — built a new local `BottomSheet` component (`src/lib/acko/BottomSheet.tsx`) from the `--drawerBg`/`--drawerOverlay` tokens, `--radius4xl` (radii.md lists "drawers" under its surface-container use cases), `--shadowXl` ("Modals, dialogs" per shadows.md), and `--zModal` (scales.md: "Modal dialogs, sheets" — exact match). Motion sourced from the `acko-motion-system` skill's `motion.surface.open`/`motion.surface.close` spec (550ms default ease-out enter, sheet y 100%→0%, overlay opacity 0→35-40%; 400ms default ease-in exit) — `curves.md` explicitly says not to invent a `cubic-bezier` unless approximating and stating so, so the CSS uses the plain `ease-out`/`ease-in` keywords rather than a fabricated bezier curve; this is an approximation of the skill's After-Effects-described curve (50%/40% influence), not a literal translation of it.
- **Props sketch:** `{ open: boolean; onClose: () => void; titleId?: string; children: ReactNode }`. Handles Escape-to-close, body scroll lock while open, and a delayed unmount so the exit animation actually plays (plain conditional rendering would unmount instantly and skip the documented close motion entirely).
- **Reuse potential:** HIGH — any dropdown, and per `responsiveness.md` any centered modal too, needs this exact mobile downshift; this is a foundational primitive, not a one-off for this screen.


**Related bug found and fixed while making this change:** the local `Typography` stand-in (`src/lib/acko/Typography.tsx`) was setting `margin: 0` inline unconditionally, which silently defeated *every* `mt-*`/`mb-*` utility ever passed directly to a `Typography` component's `className` (inline styles always beat class-based CSS, layered or not). `mt-8` measured as `0px` actual gap until fixed. Root-caused, and while fixing it also discovered the underlying reason my other custom CSS could have the same problem in reverse: `@import "tailwindcss"` puts Tailwind's utilities in `@layer utilities`, and *unlayered* CSS always beats *layered* CSS regardless of specificity or source order — so any unlayered custom rule setting `margin` would always beat `mt-8` too. Fixed by (1) removing the inline `margin: 0` from `Typography.tsx`, and (2) wrapping all local component CSS in `src/index.css` in `@layer components { ... }` so Tailwind utilities correctly take precedence, matching Tailwind's own cascade model. This isn't itself a skill-file deviation (skill files don't govern CSS layer architecture) but is recorded here since it silently affected every previous spacing fix applied directly to a `Typography` `className` on this screen — verified after the fix that the two `<div>`-wrapped gaps (title→alert, alert→panel) were unaffected since they never went through `Typography`'s className.

## Dropdown — panel viewport-overflow and truncation bugs (found and fixed)

Two implementation bugs in the local `Dropdown` stand-in (`src/lib/acko/Dropdown.tsx`), reported directly by the user on desktop, not deviations from the skill files:

1. **Panel could open below the visible viewport with no way to reach the last option.** The inline dropdown panel (`.acko-dropdown-panel`) was always positioned `top: calc(100% + 4px)` below the trigger. When a trigger (e.g. "Educational Qualification") sat low enough in the viewport, the panel could render partly or fully off-screen, with its own `overflow-y: auto` unable to help since the problem was the panel's *position*, not its internal content height. **First fix attempt was incomplete:** added a `useLayoutEffect` flipping the panel upward when `window.innerHeight` didn't leave room below — but this still failed in the exact scenario the user reported and showed a screenshot of: the panel opened downward and rendered *underneath* this screen's fixed price/coupon footer (which sits at a higher z-index, `--zSticky` 1100 vs the panel's `--zDropdown` 1000), hiding the last option, because `window.innerHeight` doesn't know that a `position: fixed` bottom bar visually covers part of it. **Actual fix:** the flip calculation now also looks for any element carrying a `data-fixed-bottom-bar` attribute (added to this screen's sticky footer) and uses its top edge as the real usable viewport boundary instead of `window.innerHeight`. Verified against the user's exact repro (trigger positioned so the panel would collide with the footer): `spaceBelow` correctly computes negative, the panel flips upward, and it no longer overlaps the footer. This coupling of a generic `Dropdown` to a page-specific selector is a known limitation, not a generic solution for arbitrary fixed obstructions — noted here rather than silently left as a fragile assumption.
2. **Long selected values overflowed the trigger instead of truncating** (e.g. "Diploma/Graduate and above"). `text-overflow: ellipsis` was set on the trigger's flex container itself, but the label was a bare text child, not a shrinkable flex item — flex items default to `min-width: auto`, so long text overflowed instead of truncating. **Fix:** wrapped the selected label in a `.acko-dropdown-value` span with `flex: 1 1 auto; min-width: 0;` alongside the ellipsis properties, so it now genuinely shrinks and truncates within the available trigger width.

Both were caught via direct viewport/DOM measurement (not just visual screenshots), and confirmed fixed the same way.

## DatePicker (calendar month/year drill-up navigation)

- **Type:** VARIANT-GAP (interaction pattern not documented, cell tokens are)
- **Screen:** personal-professional-details ("Date of birth" field, Personal details)
- **What it is:** A custom calendar date picker replacing the plain text field — day grid with today/selected/out-of-month states, plus a "drill-up" header: clicking the month/year label switches to a month grid, then a year grid (paged 12 years at a time), so a birth date decades back doesn't require paging one month at a time. Desktop/tablet renders it as an inline panel (with the same viewport-flip logic as `Dropdown`); mobile renders it inside `BottomSheet`.
- **Closest @acko component:** `Calendar` (`components.md` documents a full `calendar/` token set: `--calendarSelectedBg`, `--calendarDateOutOfMonth`, `--calendarTodayText`, `--calendarHoverBg`, etc.) — the cell-level styling is genuinely documented and was used directly.
- **Why it didn't fit:** The token set only covers *cell appearance* — nothing in the skill files documents a navigation pattern for changing the visible month/year, let alone a month/year "drill-up" flow. Built the drill-up interaction (days → months → years, each level pageable, selecting a month/year drills back down) as original interaction design, since paging a real `@acko/calendar` month-by-month would be impractical for a birth-year field spanning decades.
- **Props sketch:** `{ id: string; label: string; defaultValue?: string /* dd/mm/yyyy */; name?: string }`, implemented in `src/lib/acko/DatePicker.tsx`. Internal state: `mode: "days" | "months" | "years"`, `viewYear`/`viewMonth`, `yearPageStart`.
- **Reuse potential:** HIGH — any date-of-birth, policy-start-date, or similar far-past/far-future date field in an insurance flow needs the same fast year navigation, not a native picker or a plain paged calendar.

## All fields reset to empty — overrides forms-controls.md's prefill rule

- **Type:** VARIANT-GAP (rule override, not a component gap)
- **Screen:** personal-professional-details (every field: Full Name, Date of birth, Email ID, Marital Status, Residential Status, Educational Qualification, Occupation type, Monthly income)
- **What it is:** All fields now start genuinely empty/unselected — no `defaultValue`, no chip pre-checked, dropdowns show a "Select" placeholder instead of silently defaulting to their first option.
- **Closest @acko component:** n/a — this is about initial state/data, not a component. `forms-controls.md` is explicit: "Always prefill with known user data — name, phone, email, vehicle number, address."
- **Why it didn't fit:** The prefilled values ("Ramnan", "15/08/1994", etc.) were placeholder demo data I'd added myself for earlier verification, not real user data from any session/API — this build has no backend. Explicit user instruction correctly flagged that shipping fake-looking prefilled data as the page's default view is worse than an honest empty state. `forms-controls.md`'s rule still stands for a real integration with actual known user data; it just doesn't apply here since no such data exists in this local build.
- **Props sketch:** Removed `defaultValue`/`defaultChecked` props at all call sites in `AlmostThereDetailsPage.tsx`. Required a small `Dropdown` code change (`src/lib/acko/Dropdown.tsx`): it previously fell back to `options[0]` when no `defaultValue` was given, which isn't a true empty state — changed to leave `value` unset and render a `--dropdownPlaceholderText`-styled "Select" instead. `ChipGroup` and `DatePicker` already supported an unset default correctly, no code change needed there.
- **Reuse potential:** LOW — specific to this build having no real user-data source; once/if real prefill data is wired up, `forms-controls.md`'s rule should be followed as documented.
