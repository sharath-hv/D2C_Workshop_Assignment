import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "./icons";
import { BottomSheet } from "./BottomSheet";
import { Typography } from "./Typography";
import { useIsMobile } from "./useIsMobile";

interface DatePickerProps {
  id: string;
  label: string;
  defaultValue?: string; // "dd/mm/yyyy"
  value?: string; // "dd/mm/yyyy" — for controlled component
  onChange?: (date: string | null) => void;
  name?: string;
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const YEARS_PER_PAGE = 12;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parseDate(value: string | undefined): { day: number; month: number; year: number } | null {
  const match = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  return { day: Number(match[1]), month: Number(match[2]) - 1, year: Number(match[3]) };
}

function formatDate(date: { day: number; month: number; year: number }) {
  return `${pad2(date.day)}/${pad2(date.month + 1)}/${date.year}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Local stand-in for `@acko/calendar` — see .claude/skills/acko-design-system/components.md
 * (calendar/). The day-grid cell states (default/out-of-month/selected/today/hover) map
 * directly to that section's documented tokens. The month/year "drill-up" navigation
 * (clicking the header label to jump to a month grid, then a year grid) is this
 * implementation's own interaction design — components.md documents cell tokens only,
 * not a navigation pattern — added because a birth date can be decades back, where
 * paging one month at a time is impractical. See missing-components log.
 */
export function DatePicker({ id, label, defaultValue, value, onChange, name }: DatePickerProps) {
  const isMobile = useIsMobile();
  const initial = parseDate(value ?? defaultValue);
  const today = new Date();

  const [selected, setSelected] = useState(initial);

  useEffect(() => {
    setSelected(parseDate(value ?? defaultValue));
  }, [value, defaultValue]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState<"days" | "months" | "years">("days");
  const [viewYear, setViewYear] = useState(initial?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial?.month ?? today.getMonth());
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor((initial?.year ?? today.getFullYear()) / YEARS_PER_PAGE) * YEARS_PER_PAGE,
  );
  const [openUpward, setOpenUpward] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetTitleId = `${id}-sheet-title`;

  useLayoutEffect(() => {
    if (!open || isMobile) {
      setOpenUpward(false);
      return;
    }
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;
    const triggerRect = trigger.getBoundingClientRect();
    const panelHeight = panel.getBoundingClientRect().height;
    const bottomBar = document.querySelector("[data-fixed-bottom-bar]");
    const viewportBottom = bottomBar ? bottomBar.getBoundingClientRect().top : window.innerHeight;
    const spaceBelow = viewportBottom - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    setOpenUpward(spaceBelow < panelHeight + 8 && spaceAbove > spaceBelow);
  }, [open, isMobile, mode]);

  useEffect(() => {
    if (!open || isMobile) return;
    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, isMobile]);

  function openPicker() {
    if (selected) {
      setViewYear(selected.year);
      setViewMonth(selected.month);
      setYearPageStart(Math.floor(selected.year / YEARS_PER_PAGE) * YEARS_PER_PAGE);
    }
    setMode("days");
    setOpen(true);
  }

  function closePicker() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function selectDay(day: number, month: number, year: number) {
    const date = { day, month, year };
    setSelected(date);
    setViewMonth(month);
    setViewYear(year);
    onChange?.(formatDate(date));
    closePicker();
  }

  function renderDaysGrid() {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = daysInMonth(viewYear, viewMonth);
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const prevMonthDays = daysInMonth(prevYear, prevMonth);
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    const cells: { day: number; month: number; year: number; outOfMonth: boolean }[] = [];
    for (let i = firstWeekday - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, month: prevMonth, year: prevYear, outOfMonth: true });
    }
    for (let day = 1; day <= totalDays; day++) {
      cells.push({ day, month: viewMonth, year: viewYear, outOfMonth: false });
    }
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const next = cells.length - (firstWeekday + totalDays) + 1;
      cells.push({ day: next, month: nextMonth, year: nextYear, outOfMonth: true });
    }

    return (
      <>
        <div className="acko-calendar-weekdays">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="acko-calendar-weekday acko-typography-label-md">
              {label}
            </span>
          ))}
        </div>
        <div className="acko-calendar-grid">
          {cells.map((cell, index) => {
            const isSelected =
              !!selected && selected.day === cell.day && selected.month === cell.month && selected.year === cell.year;
            const isToday =
              cell.year === today.getFullYear() && cell.month === today.getMonth() && cell.day === today.getDate();
            const classes = [
              "acko-calendar-cell",
              "acko-typography-body-sm",
              cell.outOfMonth ? "acko-calendar-cell--out" : "",
              isToday && !isSelected ? "acko-calendar-cell--today" : "",
              isSelected ? "acko-calendar-cell--selected" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={index}
                type="button"
                className={classes}
                onClick={() => selectDay(cell.day, cell.month, cell.year)}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderMonthsGrid() {
    return (
      <div className="acko-calendar-grid-months">
        {MONTH_SHORT.map((label, month) => {
          const isSelected = !!selected && selected.month === month && selected.year === viewYear;
          return (
            <button
              key={label}
              type="button"
              className={`acko-calendar-cell-wide acko-typography-body-sm${isSelected ? " acko-calendar-cell-wide--selected" : ""}`}
              onClick={() => {
                setViewMonth(month);
                setMode("days");
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  function renderYearsGrid() {
    const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i);
    return (
      <div className="acko-calendar-grid-years">
        {years.map((year) => {
          const isSelected = !!selected && selected.year === year;
          return (
            <button
              key={year}
              type="button"
              className={`acko-calendar-cell-wide acko-typography-body-sm${isSelected ? " acko-calendar-cell-wide--selected" : ""}`}
              onClick={() => {
                setViewYear(year);
                setMode("months");
              }}
            >
              {year}
            </button>
          );
        })}
      </div>
    );
  }

  function goPrev() {
    if (mode === "days") {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    } else if (mode === "months") {
      setViewYear((y) => y - 1);
    } else {
      setYearPageStart((y) => y - YEARS_PER_PAGE);
    }
  }

  function goNext() {
    if (mode === "days") {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    } else if (mode === "months") {
      setViewYear((y) => y + 1);
    } else {
      setYearPageStart((y) => y + YEARS_PER_PAGE);
    }
  }

  function headerLabel() {
    if (mode === "days") return `${MONTH_FULL[viewMonth]} ${viewYear}`;
    if (mode === "months") return String(viewYear);
    return `${yearPageStart}–${yearPageStart + YEARS_PER_PAGE - 1}`;
  }

  function drillUp() {
    if (mode === "days") setMode("months");
    else if (mode === "months") setMode("years");
  }

  const calendarBody = (
    <div className="acko-calendar">
      <div className="acko-calendar-header">
        <button type="button" className="acko-calendar-nav-btn" aria-label="Previous" onClick={goPrev}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="acko-calendar-label-btn acko-typography-label-lg"
          onClick={drillUp}
          disabled={mode === "years"}
        >
          {headerLabel()}
        </button>
        <button type="button" className="acko-calendar-nav-btn" aria-label="Next" onClick={goNext}>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      {mode === "days" ? renderDaysGrid() : mode === "months" ? renderMonthsGrid() : renderYearsGrid()}
    </div>
  );

  const floated = focused || !!selected;

  return (
    <div className="acko-field" ref={rootRef}>
      <label
        htmlFor={id}
        className={`acko-field-label acko-typography-${floated ? "label-md" : "body-md"}${floated ? " acko-field-label--floated" : ""}`}
      >
        {label}
      </label>
      {name ? <input type="hidden" name={name} value={selected ? formatDate(selected) : ""} /> : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="acko-date-trigger acko-typography-body-md"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? closePicker() : openPicker())}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {selected ? formatDate(selected) : null}
      </button>

      {isMobile ? (
        <BottomSheet open={open} onClose={closePicker} titleId={sheetTitleId}>
          <Typography variant="heading-sm" as="p" id={sheetTitleId} className="mb-8">
            {label}
          </Typography>
          {calendarBody}
        </BottomSheet>
      ) : open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={label}
          className={`acko-calendar-panel${openUpward ? " acko-calendar-panel--flip-up" : ""}`}
        >
          {calendarBody}
        </div>
      ) : null}
    </div>
  );
}
