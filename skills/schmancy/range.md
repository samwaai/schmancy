# schmancy-range

> Numeric slider input with theme-driven track gradient and focus halo.

## Usage
```html
<schmancy-range
  label="Volume"
  min="0"
  max="100"
  step="1"
  .value=${50}
  @change=${e => this.volume = e.detail.value}
></schmancy-range>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `min` | number | `0` | Minimum value |
| `max` | number | `1` | Maximum value |
| `step` | number | `0.01` | Increment per tick |
| `value` | number | `0` | Current value (narrowed override of the mixin's wide union). |
| `label` | string | — | Optional label (current value displays on the right) |
| `disabled` | boolean | `false` | Disabled state (38% opacity) |
| `name` | string | `''` | Form submission name. From `SchmancyFormField`. |
| `required` | boolean | `false` | Field must have a value to validate. |
| `validateOn` | `'always'\|'touched'\|'dirty'\|'submitted'` | `'dirty'` | When errors display. |
| `validationMessage` | string | `''` | Error message. |
| `hint` | string | `undefined` | Helper text. |
| `touched / dirty / submitted` | boolean | — | Validation state from `SchmancyFormField`. |

## Events
| Event | Payload | When |
|-------|---------|------|
| `change` | `{ value: number }` | On input change |

## Visual
- Primary-colored track gradient (filled portion = primary, empty = 30% primary).
- Circular thumb with hover halo (8px primary glow at 12% opacity).
- Disabled state: 38% opacity, not-allowed cursor.

## Form-field contract

Extends `SchmancyFormField()`. FormData contributes `String(value)` under `name`. `markTouched()` fires on every input event (slider drag), so the field transitions to `touched` immediately on interaction — the `dirty` gate opens once value diverges from the captured default.

Auto-discovered by `<schmancy-form>` via `FIELD_CONNECT_EVENT`. Public API: `markTouched()`, `markSubmitted()`, `checkValidity()`, `setCustomValidity()`, `resetForm()`.

See `form.md` and `form-ux-rules.md` for the binding 4-phase validation contract.

## Example — precise float control
```html
<schmancy-range
  label="Mass"
  min="0.5"
  max="2.0"
  step="0.05"
  .value=${this.mass}
  @change=${(e: CustomEvent<{ value: number }>) => this.mass = e.detail.value}
></schmancy-range>
```
