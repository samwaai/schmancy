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
| `value` | number | `0` | Current value |
| `label` | string | — | Optional label (current value displays on the right) |
| `disabled` | boolean | `false` | Disabled state (38% opacity) |

## Events
| Event | Payload | When |
|-------|---------|------|
| `change` | `{ value: number }` | On input change |

## Visual
- Primary-colored track gradient (filled portion = primary, empty = 30% primary).
- Circular thumb with hover halo (8px primary glow at 12% opacity).
- Disabled state: 38% opacity, not-allowed cursor.

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
