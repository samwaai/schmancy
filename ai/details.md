# schmancy-details

> Expandable disclosure with spring-animated indicator, magnetic summary, and CSS grid collapse animation.

## Usage
```html
<schmancy-details summary="Show more">
  <p>Expandable content here</p>
</schmancy-details>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `summary` | `string` | `''` | Summary text (or use `summary` slot) |
| `open` | `boolean` | `false` | Expanded state |
| `type` | SurfaceMixin type | `'solid'` | Surface type for the container |
| `rounded` | SurfaceMixin rounded | `'all'` | Corner rounding |
| `locked` | `boolean` | `false` | Prevents open/close interaction |
| `overlay` | `boolean` | `false` | Content overlays below instead of pushing |
| `indicator-placement` | `'start' \| 'end'` | `'end'` | Chevron indicator position |
| `hide-indicator` | `boolean` | `false` | Hide the expand/collapse indicator |
| `indicator-rotate` | `number` | `90` | Indicator rotation degrees when open |
| `summary-padding` | `string` | `'p-3'` | Tailwind padding class for summary |
| `content-padding` | `string` | `'p-3'` | Tailwind padding class for content |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| `toggle` | `{ open: boolean }` | Fired when open state changes |

## Slots
| Slot | Description |
|------|-------------|
| (default) | Content revealed on expand |
| `summary` | Custom summary content (overrides `summary` prop) |
| `indicator` | Custom expand/collapse indicator |
| `actions` | Action buttons in the summary bar (click does not toggle) |
| `details` | Additional content slot |

## Physics
- **magnetic** directive on summary (strength: 2, radius: 50) when not locked
- Spring-animated chevron indicator using Web Animations API
- CSS grid transition for smooth height animation (400ms spring easing)
- Luminous elevation glow when open
- Lazy rendering: content is not rendered until first opened

## Examples
```html
<!-- Basic expandable -->
<schmancy-details summary="Advanced Settings" indicator-placement="start">
  <div>Settings content</div>
</schmancy-details>

<!-- Overlay mode (content floats over siblings) -->
<schmancy-details summary="Quick preview" overlay>
  <div>Preview content overlays below</div>
</schmancy-details>

<!-- With custom summary and actions -->
<schmancy-details>
  <span slot="summary">Custom title</span>
  <schmancy-icon-button slot="actions" icon="edit"></schmancy-icon-button>
  <div>Detail content</div>
</schmancy-details>
```
