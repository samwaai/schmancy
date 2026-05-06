# schmancy-switch

> Binary on/off control. Form-associated, ARIA `role="switch"`. Use for immediate state changes; use `<schmancy-checkbox>` for form selections.

## Usage
```html
<schmancy-switch name="notifications" label="Email notifications" @change=${(e) => handle(e.detail.value)}>
</schmancy-switch>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| checked | boolean | `false` | Current on/off state. Reflected as attribute. |
| name | string | `''` | Form submission name. |
| value | string | `'on'` | Value submitted when checked. |
| label | string | `''` | ARIA label on the inner button; also used by axe. |
| required | boolean | `false` | Must be on for form validity. |
| disabled | boolean | `false` | Disables interaction. |
| validateOn | `'always'\|'touched'\|'dirty'\|'submitted'` | `'dirty'` | When validation errors display. From `SchmancyFormField`. |
| validationMessage | string | `''` | Error text — default `'This switch is required.'` when required and off. |
| error | boolean | `false` | Error state (gated by `validateOn`). |
| hint | string | `undefined` | Helper text. |
| touched / dirty / submitted | boolean | — | Validation state from `SchmancyFormField`. |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: boolean }` | Fires when the state toggles (via click or Enter/Space). |

## Parts
| Part | Description |
|------|-------------|
| track | Background track element. |
| thumb | Moving thumb element. |

## States
| State | When |
|-------|------|
| `:state(checked)`   | switch is on |
| `:state(touched)`   | user has blurred the host at least once |
| `:state(dirty)`     | `checked` differs from initial |
| `:state(submitted)` | parent `<schmancy-form>` has submitted |
| `:state(invalid)`   | error flag is set (gated by `validateOn`) |
| `:state(required)`  | required and not disabled |
| `:state(disabled)`  | disabled |

## Form association
Extends `SchmancyFormField()` — participates in `<form>` submission natively. FormData contributes `name=value` when checked; omitted when unchecked.

`dirty` is overridden to mean "`checked` diverged from the snapshot taken at first render," not the mixin's value-vs-default. Under default `validateOn: 'dirty'`, an empty-required switch only shows an error after the user toggles it (or submit forces validation), but `internals.checkValidity()` already reports `false` so `<form>.checkValidity()` is correct.

`resetForm()` restores the snapshot taken in `firstUpdated` (the pre-render `checked` value). `formDisabledCallback` propagates `<fieldset disabled>`. ARIA `aria-invalid` / `aria-required` reflect through `ElementInternals`.

Public API: `markTouched()`, `markSubmitted()`, `checkValidity()`, `setCustomValidity()`, `resetForm()`. Auto-discovered by `<schmancy-form>` via `FIELD_CONNECT_EVENT`.

See `form.md` and `form-ux-rules.md` for the binding 4-phase validation contract.

## Examples
```html
<!-- Inside a form -->
<schmancy-form>
  <schmancy-switch name="marketing" label="Marketing emails"></schmancy-switch>
  <schmancy-switch name="product" label="Product updates" checked></schmancy-switch>
  <schmancy-button type="submit">Save</schmancy-button>
</schmancy-form>
```

```html
<!-- Required toggle (must be on to submit) -->
<schmancy-switch name="agree" label="I agree" required></schmancy-switch>
```

```html
<!-- Custom submitted value -->
<schmancy-switch name="mode" value="dark" label="Dark mode"></schmancy-switch>
```
