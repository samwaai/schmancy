# schmancy-badge

> Versatile badge for status indicators, labels, and counts with color variants and shapes.

## Usage
```html
<schmancy-badge color="success">Active</schmancy-badge>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| color | `'primary'\|'secondary'\|'tertiary'\|'success'\|'warning'\|'error'\|'neutral'\|'surface'` | `'primary'` | Color variant |
| size | `'xs'\|'sm'\|'md'\|'lg'` | `'md'` | Badge size |
| shape | `'rounded'\|'pill'\|'square'` | `'pill'` | Badge shape |
| outlined | boolean | `false` | Outlined style (transparent background) |
| icon | string | `''` | Material icon name |
| pulse | boolean | `false` | Pulse animation for attention |

## Slots
| Slot | Description |
|------|-------------|
| default | Badge text content |
| icon | Custom icon content |

## Examples
```html
<!-- Outlined badge -->
<schmancy-badge color="error" outlined>Overdue</schmancy-badge>

<!-- With icon -->
<schmancy-badge color="success" icon="check_circle">Verified</schmancy-badge>

<!-- Pulsing notification badge -->
<schmancy-badge color="error" size="sm" pulse>3</schmancy-badge>

<!-- Square shape -->
<schmancy-badge color="neutral" shape="square">Draft</schmancy-badge>
```

**Tag aliases:** `<sch-badge>` (backward compatible)
