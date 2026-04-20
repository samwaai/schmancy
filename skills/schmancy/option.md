# schmancy-option

> Selectable item for `schmancy-select`, `schmancy-autocomplete`, and `schmancy-menu`. Lightweight and a11y-ready.

## Usage
```html
<schmancy-select label="Country">
  <schmancy-option value="us">United States</schmancy-option>
  <schmancy-option value="de">Germany</schmancy-option>
  <schmancy-option value="jp" disabled>Japan</schmancy-option>
</schmancy-select>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | string | `''` | Value reported when this option is selected |
| `label` | string | auto | Display label (falls back to text content) |
| `selected` | boolean | `false` | Reflects selected state |
| `disabled` | boolean | `false` | Disables interaction |
| `group` | string | `''` | Grouping identifier for grouped lists |
| `icon` | string | `''` | Material icon name before the label |

## Events
| Event | Payload | When |
|-------|---------|------|
| `click` | — | Standard click event |
| `option-select` | `CustomEvent<{ value, label }>` | Dispatched on activation |

## Behavior
- Auto-generates `id` for ARIA wiring if not set.
- Infers `label` from text content when omitted.
- Keyboard focusable with a visible focus ring via `:focus-visible`.
- Parent select/autocomplete coordinates selection state via slot query.

## Example — grouped options
```html
<schmancy-select label="Framework">
  <schmancy-option value="lit" group="web" icon="bolt">Lit</schmancy-option>
  <schmancy-option value="react" group="web">React</schmancy-option>
  <schmancy-option value="swift" group="mobile">Swift</schmancy-option>
</schmancy-select>
```
