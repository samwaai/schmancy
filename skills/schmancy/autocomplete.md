# schmancy-autocomplete

> Searchable input with fuzzy filtering, single/multi-select, and inline chip display.

## Usage
```html
<schmancy-autocomplete label="Assignee" placeholder="Search...">
  <schmancy-option value="alice" label="Alice"></schmancy-option>
  <schmancy-option value="bob" label="Bob"></schmancy-option>
</schmancy-autocomplete>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string | `''` | Selected value (single) or comma-separated (multi) |
| values | string[] | `[]` | Selected values (multi-select) |
| label | string | `''` | Label text |
| placeholder | string | `''` | Placeholder text |
| name | string | `''` | Form submission name |
| required | boolean | `false` | Whether selection is required |
| multi | boolean | `false` | Enable multi-select with inline chips |
| size | `'xxs'\|'xs'\|'sm'\|'md'\|'lg'` | `'md'` | Input height (M3 sizes 24–56dp). |
| maxHeight | string | `'300px'` | Max dropdown height |
| debounceMs | number | `200` | Search debounce in ms |
| similarityThreshold | number | `0.3` | Minimum fuzzy match score (0-1) |
| error | boolean | `false` | Error state (gated by `validateOn`). From `SchmancyFormField`. |
| validationMessage | string | `''` | Validation message. |
| description | string | `''` | Screen reader description |
| validateOn | `'always'\|'touched'\|'dirty'\|'submitted'` | `'dirty'` | When validation errors display. |
| disabled | boolean | `false` | Disabled state. |
| hint | string | `undefined` | Helper text below the field. |
| touched / dirty / submitted | boolean | — | Validation state from `SchmancyFormField`. |
| autocomplete | string | `'off'` | Native autocomplete attribute on inner input. |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: string \| string[], values?: string[] }` | When selection changes |

## Examples
```html
<!-- Multi-select with chips -->
<schmancy-autocomplete label="Skills" multi placeholder="Type to search...">
  <schmancy-option value="ts" label="TypeScript"></schmancy-option>
  <schmancy-option value="lit" label="Lit"></schmancy-option>
  <schmancy-option value="rxjs" label="RxJS"></schmancy-option>
</schmancy-autocomplete>

<!-- Single select, auto-selects best match on blur -->
<schmancy-autocomplete label="City" placeholder="Search city..."
  @change=${(e) => console.log(e.detail.value)}>
  <schmancy-option value="berlin" label="Berlin"></schmancy-option>
  <schmancy-option value="munich" label="Munich"></schmancy-option>
</schmancy-autocomplete>
```

Children must be `<schmancy-option>` elements. In multi mode, selected items appear as removable chips.

## Form-field contract

Extends `SchmancyFormField()`. Auto-discovered by `<schmancy-form>` via `FIELD_CONNECT_EVENT`. Public API: `markTouched()`, `markSubmitted()`, `checkValidity()`, `reportValidity()`, `setCustomValidity()`, `resetForm()` (resets the BehaviorSubjects + clears the input).

Default `validateOn: 'dirty'` — a required-empty autocomplete shows no error until the user types-then-clears or submits. Error UI rendered in a `role="alert"` div linked via `aria-describedby`.

See `form.md` and `form-ux-rules.md` for the binding 4-phase validation contract.
