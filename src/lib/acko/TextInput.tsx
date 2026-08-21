import { useState, useEffect, type FocusEvent, type InputHTMLAttributes, type ReactNode } from "react";

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  prefix?: ReactNode;
}

/**
 * Local stand-in for `@acko/text-input` — see .claude/skills/acko-design-system/components.md
 * (inputField/) + forms-controls.md. The label is hint text at rest (body-md, centered
 * in the field, like a placeholder) and floats to a small label on the border on focus
 * or once filled — acko-motion-system's `motion.small.enter` (160–220ms, ease-out;
 * "icons, chips, inputs, helper text" explicitly includes inputs) governs the transition.
 */
export function TextInput({
  id,
  label,
  helperText,
  error,
  prefix,
  className,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!(defaultValue ?? value));
  const floated = focused || hasValue;
  const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  useEffect(() => {
    setHasValue(!!(value ?? defaultValue));
  }, [value, defaultValue]);

  return (
    <div className={["acko-field", className].filter(Boolean).join(" ")}>
      <label
        htmlFor={id}
        className={`acko-field-label acko-typography-${floated ? "label-md" : "body-md"}${floated ? " acko-field-label--floated" : ""}${prefix ? " acko-field-label--with-prefix" : ""}`}
      >
        {label}
      </label>
      {prefix ? <span className="acko-field-prefix">{prefix}</span> : null}
      <input
        id={id}
        className={`acko-input acko-typography-body-md${prefix ? " acko-input--with-prefix" : ""}`}
        style={{
          borderColor: error ? "var(--inputFieldBorderError)" : undefined,
        }}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        defaultValue={defaultValue}
        value={value}
        onFocus={(event: FocusEvent<HTMLInputElement>) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event: FocusEvent<HTMLInputElement>) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onChange={(event) => {
          setHasValue(event.target.value.length > 0);
          onChange?.(event);
        }}
        {...rest}
      />
      {error ? (
        <span
          id={`${id}-error`}
          role="alert"
          className="acko-typography-label-md"
          style={{ color: "var(--inputFieldHelperTextError)", marginTop: 4 }}
        >
          {error}
        </span>
      ) : helperText ? (
        <span
          id={`${id}-helper`}
          className="acko-typography-label-md"
          style={{ color: "var(--inputFieldHelperText)", marginTop: 4 }}
        >
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
