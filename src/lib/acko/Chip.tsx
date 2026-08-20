interface ChipOption {
  label: string;
  value: string;
}

interface ChipGroupProps {
  legend: string;
  name: string;
  options: ChipOption[];
  defaultValue?: string;
}

/**
 * Local stand-in for a single-select `@acko/chip` group — see
 * .claude/skills/acko-design-system/components.md (chip/). Built on native
 * radio inputs (visually hidden, `fieldset`/`legend` for grouping) so keyboard
 * and screen-reader semantics come for free, matching the same principle
 * cards.md's PlanRadioCard uses for custom-styled radio selection.
 */
export function ChipGroup({ legend, name, options, defaultValue }: ChipGroupProps) {
  return (
    <fieldset className="acko-chip-group">
      <legend className="acko-chip-group-legend acko-typography-label-lg">{legend}</legend>
      <div className="acko-chip-row">
        {options.map((option) => (
          <label key={option.value} className="acko-chip acko-typography-body-md">
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              className="acko-chip-input"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
