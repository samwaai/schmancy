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
```
