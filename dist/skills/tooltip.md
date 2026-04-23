# tooltip (directive)

> Lit directive that adds a positioned tooltip to any element on hover/focus. The `<schmancy-tooltip>` component was removed — use this directive.

## Usage
```typescript
import { tooltip } from '@mhmo91/schmancy'

html`<button ${tooltip('Click to save')}>Save</button>`
```

## Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| text | string | required | Tooltip text content |
| options.position | `'top'\|'right'\|'bottom'\|'left'` | `'top'` | Tooltip placement |
| options.delay | number | `300` | Show delay in ms |
| options.showArrow | boolean | `true` | Show arrow indicator |

## Examples
```html
<!-- Bottom positioned -->
<schmancy-icon-button ${tooltip('Delete item', { position: 'bottom' })}>
  delete
</schmancy-icon-button>

<!-- No delay, no arrow -->
<span ${tooltip('Status: Active', { delay: 0, showArrow: false })}>
  Active
</span>

<!-- Right positioned -->
<div ${tooltip('More info here', { position: 'right' })}>
  Hover me
</div>
```

Uses Floating UI for smart positioning with automatic flipping when near viewport edges. Accessible via `aria-describedby`. Closes on Escape key.
