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
| `:state(checked)` | While the switch is on. Target via `schmancy-switch:state(checked) { … }`. |

## Form association
Uses `ElementInternals` — participates in `<form>` submission natively. Contributes `name=value` when checked; omitted when unchecked. `formResetCallback` restores the initial `checked` attribute. `formDisabledCallback` propagates `<fieldset disabled>`.

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
