# schmancy-select

> Dropdown select with single and multi-select support, keyboard navigation, and form association.

## Usage
```html
<schmancy-select label="Country" placeholder="Choose..." required>
  <schmancy-option value="us" label="United States"></schmancy-option>
  <schmancy-option value="de" label="Germany"></schmancy-option>
</schmancy-select>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string \| string[] | `''` | Selected value(s) |
| values | string[] | `[]` | Selected values (multi-select) |
| label | string | `''` | Label text |
| placeholder | string | `''` | Placeholder when no selection |
| name | string | `undefined` | Form submission name |
| required | boolean | `false` | Whether selection is required |
| disabled | boolean | `false` | Whether the select is disabled |
| multi | boolean | `false` | Enable multi-select mode |
| hint | string | `''` | Hint text below the select |
| size | `'xxs'\|'xs'\|'sm'\|'md'\|'lg'` | `'md'` | Input height |
| validateOn | `'always'\|'touched'\|'dirty'\|'submitted'` | `'dirty'` | When validation errors display. From `SchmancyFormField`. |
| validationMessage | string | `''` | Error message — set by `setCustomValidity()` or `<schmancy-form>.setFieldError()`. |
| error | boolean (read-only) | — | True when invalid AND `_shouldShowError()` gate is open. |
| touched / dirty / submitted | boolean | — | Validation state from `SchmancyFormField`. |
| readonly | boolean | `false` | Read-only mode. |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: string \| string[] }` | When selection changes |

## Examples
```html
<!-- Multi-select -->
<schmancy-select label="Tags" multi placeholder="Select tags...">
  <schmancy-option value="urgent" label="Urgent"></schmancy-option>
  <schmancy-option value="review" label="Review"></schmancy-option>
  <schmancy-option value="done" label="Done"></schmancy-option>
</schmancy-select>

<!-- Compact size -->
<schmancy-select size="xs" placeholder="Status">
  <schmancy-option value="active" label="Active"></schmancy-option>
  <schmancy-option value="inactive" label="Inactive"></schmancy-option>
</schmancy-select>
```

Children must be `<schmancy-option>` elements with `value` and `label` attributes.

## Form-field contract

Extends `SchmancyFormField()` — auto-discovered by `<schmancy-form>` via `FIELD_CONNECT_EVENT`. Exposes `markTouched()`, `markSubmitted()`, `checkValidity()`, `reportValidity()`, `setCustomValidity()`, `resetForm()`. Multi-select serializes to a comma-joined string for native FormData; `toFormEntries()` emits one `[name, value]` per selection for `<schmancy-form>` consumers.

ARIA combobox attributes (`role="combobox"`, `aria-expanded`, `aria-controls`) plus `aria-invalid` / `aria-required` reflect through `ElementInternals` — target via `:state(invalid)` / `:state(required)` in CSS, not host `[aria-*]` selectors.

See `form.md` and `form-ux-rules.md` for the binding 4-phase validation contract.
