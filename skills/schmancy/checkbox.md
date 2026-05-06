# schmancy-checkbox

> Checkbox with label support and form association.

## Usage
```html
<schmancy-checkbox label="I agree to terms" @change=${(e) => handle(e.detail.value)}>
</schmancy-checkbox>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | boolean | `false` | Whether the checkbox is checked |
| checked | boolean | `false` | Alias for value |
| label | string | `undefined` | Label text (alternative to slot) |
| name | string | auto | Form submission name |
| disabled | boolean | `false` | Whether the checkbox is disabled |
| required | boolean | `false` | Whether the checkbox is required |
| size | `'xxs'\|'xs'\|'sm'\|'md'\|'lg'` | `'md'` | Checkbox size |
| validateOn | `'always'\|'touched'\|'dirty'\|'submitted'` | `'dirty'` | When validation errors display. From `SchmancyFormField`. |
| validationMessage | string | `''` | Error text — default `'Please check this box if you want to proceed.'` when required and unchecked. |
| error | boolean | `false` | Error state (gated by `validateOn`). |
| hint | string | `undefined` | Helper text. |
| touched / dirty / submitted | boolean | — | Validation state from `SchmancyFormField`. |

## Attributes
- `true-value` — string written to FormData when checked. Default `'on'` (matches native checkbox semantics).

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: boolean }` | When checked state changes |

## Examples
```html
<!-- With label property -->
<schmancy-checkbox label="Enable notifications" .value=${true}></schmancy-checkbox>

<!-- With slotted label -->
<schmancy-checkbox name="terms" required>
  Accept <a href="/terms">terms and conditions</a>
</schmancy-checkbox>

<!-- Custom FormData string -->
<schmancy-checkbox name="newsletter" true-value="opt-in"></schmancy-checkbox>
```

## Form-field contract

Extends `SchmancyFormField()`. `value` is the boolean state; FormData submission uses the `true-value` attribute (or `'on'`). Validity overrides the mixin's "non-empty value" semantics: required + unchecked → `internals.setValidity({ valueMissing: true })`. ARIA `aria-invalid` / `aria-required` reflect through `ElementInternals`.

Public API: `markTouched()`, `markSubmitted()`, `checkValidity()`, `setCustomValidity()`, `resetForm()`. Auto-discovered by `<schmancy-form>` via `FIELD_CONNECT_EVENT`.

See `form.md` and `form-ux-rules.md` for the binding 4-phase validation contract.
