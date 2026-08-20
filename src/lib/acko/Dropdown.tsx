import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Tick } from "./icons";
import { BottomSheet } from "./BottomSheet";
import { Typography } from "./Typography";
import { useIsMobile } from "./useIsMobile";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  id: string;
  label: string;
  options: DropdownOption[];
  defaultValue?: string;
  name?: string;
}

/**
 * Local stand-in for `@acko/dropdown` — see .claude/skills/acko-design-system/components.md
 * (dropdown/). components.md documents a full panel/option token set
 * (--dropdownPanelFill, --dropdownOptionHover, --dropdownCheckIcon, etc.), so the real
 * component renders its own listbox rather than delegating to the browser's native
 * <select> picker. On mobile (responsiveness.md: "Large dropdown → Bottom sheet",
 * "one-thumb reach"), the options render inside a BottomSheet instead of an inline
 * panel — a structural swap, not just a visual one, per the same file's instruction
 * to "use the package's built-in mobile variant... rather than one-off swaps."
 */
export function Dropdown({ id, label, options, defaultValue, name }: DropdownProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  // No fallback to options[0] — an unset field must render genuinely empty
  // (a "Select" placeholder), not silently pre-select the first option.
  const [value, setValue] = useState(defaultValue);
  const [highlightIndex, setHighlightIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === defaultValue)),
  );
  const [openUpward, setOpenUpward] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = `${id}-listbox`;
  const sheetTitleId = `${id}-sheet-title`;
  const selected = options.find((option) => option.value === value);

  // Inline panel only: if there isn't room below the trigger to fit the panel
  // (and there's more room above), open upward instead — otherwise the panel
  // can render partly or fully below the viewport with no way to scroll to it,
  // since it's a sibling of the trigger, not something the page's own scroll
  // extends to reach on every layout.
  useLayoutEffect(() => {
    if (!open || isMobile) {
      setOpenUpward(false);
      return;
    }
    const trigger = triggerRef.current;
    const list = listRef.current;
    if (!trigger || !list) return;
    const triggerRect = trigger.getBoundingClientRect();
    const listHeight = list.getBoundingClientRect().height;
    // window.innerHeight alone isn't the real usable boundary — a fixed bottom
    // bar (e.g. this screen's sticky price footer) visually covers part of it
    // and sits at a higher z-index, so content "fitting" within innerHeight can
    // still render hidden underneath. Any such bar opts in via this attribute.
    const bottomBar = document.querySelector("[data-fixed-bottom-bar]");
    const viewportBottom = bottomBar ? bottomBar.getBoundingClientRect().top : window.innerHeight;
    const spaceBelow = viewportBottom - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    setOpenUpward(spaceBelow < listHeight + 8 && spaceAbove > spaceBelow);
  }, [open, isMobile]);

  // Inline panel only: outside-click + initial focus. The BottomSheet manages its
  // own overlay, focus, and scroll lock, so none of this applies on mobile.
  useEffect(() => {
    if (!open || isMobile) return;
    listRef.current?.focus();

    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, isMobile]);

  function closeAndRefocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commitSelection(index: number) {
    const option = options[index];
    if (!option) return;
    setValue(option.value);
    setHighlightIndex(index);
    closeAndRefocus();
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightIndex((index) => Math.min(options.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightIndex((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setHighlightIndex(0);
        break;
      case "End":
        event.preventDefault();
        setHighlightIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commitSelection(highlightIndex);
        break;
      case "Escape":
      case "Tab":
        event.preventDefault();
        closeAndRefocus();
        break;
    }
  }

  function renderOption(option: DropdownOption, index: number, highlighted: boolean): ReactNode {
    return (
      <li
        key={option.value}
        id={`${id}-option-${index}`}
        role="option"
        aria-selected={option.value === value}
        className={`acko-dropdown-option acko-typography-body-md${highlighted ? " acko-dropdown-option--highlighted" : ""}`}
        onMouseEnter={() => setHighlightIndex(index)}
        onClick={() => commitSelection(index)}
      >
        <span>{option.label}</span>
        {option.value === value ? (
          <span className="acko-dropdown-check" aria-hidden="true">
            <Tick />
          </span>
        ) : null}
      </li>
    );
  }

  const floated = focused || !!selected;

  return (
    <div className="acko-field" ref={rootRef}>
      <label
        htmlFor={id}
        className={`acko-field-label acko-typography-${floated ? "label-md" : "body-md"}${floated ? " acko-field-label--floated" : ""}`}
      >
        {label}
      </label>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="acko-dropdown-trigger acko-typography-body-md"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={isMobile ? undefined : listboxId}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={onTriggerKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span className="acko-dropdown-value">{selected?.label}</span>
      </button>
      <span className="acko-dropdown-icon" aria-hidden="true">
        <ChevronDown />
      </span>

      {isMobile ? (
        <BottomSheet open={open} onClose={closeAndRefocus} titleId={sheetTitleId}>
          <Typography variant="heading-sm" as="p" id={sheetTitleId} className="mb-8">
            {label}
          </Typography>
          <ul role="listbox" aria-label={label} className="acko-bottom-sheet-list">
            {options.map((option, index) => renderOption(option, index, false))}
          </ul>
        </BottomSheet>
      ) : open ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${id}-option-${highlightIndex}`}
          aria-labelledby={id}
          className={`acko-dropdown-panel${openUpward ? " acko-dropdown-panel--flip-up" : ""}`}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => renderOption(option, index, index === highlightIndex))}
        </ul>
      ) : null}
    </div>
  );
}
