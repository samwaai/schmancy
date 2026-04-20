# schmancy-expand

> Expandable/accordion component. Inline mode uses grid-template-rows transitions; portal mode teleports content to a body-level `schmancy-expand-root` with backdrop.

## Usage
```html
<schmancy-expand summary="Details">
  <p>Content appears when expanded.</p>
</schmancy-expand>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `summary` | string | `''` | Summary text shown when collapsed |
| `open` | boolean | `false` | Expansion state (reflected) |
| `summary-padding` | string | — | CSS padding for the summary row |
| `content-padding` | string | — | CSS padding for the body |
| `hide-indicator` | boolean | `false` | Hide the chevron indicator |
| `indicator-rotate` | number | `90` | Rotation angle (deg) when open |
| `backdrop` | boolean | `true` | Show semi-transparent backdrop in portal mode |
| `inline` | boolean | `false` | Inline expansion instead of portal (no backdrop) |

## Slots
| Slot | Purpose |
|------|---------|
| (default) | Expanded content |
| `summary` | Custom summary markup (overrides `summary` property) |

## Behavior
- **Portal mode (default)**: on open, content is teleported into a body-anchored `schmancy-expand-root` with a backdrop. Click outside or press `Escape` to close.
- **Inline mode** (`inline`): uses `grid-template-rows: 0fr → 1fr` transition inside the host — no portal, no backdrop.
- `SPRING_SNAPPY` physics for indicator rotation.
- Respects `prefers-reduced-motion`.
- Broadcast event `SCHMANCY_EXPAND_REQUEST_CLOSE` on `window` closes whichever instance is currently open.

## Example — inline accordion
```html
${repeat(this.faqs, faq => faq.id, faq => html`
  <schmancy-expand inline .summary=${faq.question}>
    <p>${faq.answer}</p>
  </schmancy-expand>
`)}
```

## Example — portal with custom summary slot
```html
<schmancy-expand>
  <div slot="summary" class="flex items-center gap-2">
    <schmancy-icon>info</schmancy-icon>
    <schmancy-typography type="title">Advanced options</schmancy-typography>
  </div>
  <div class="p-4">
    <!-- settings form -->
  </div>
</schmancy-expand>
```

## Programmatic Close
```typescript
import { SCHMANCY_EXPAND_REQUEST_CLOSE } from '@mhmo91/schmancy'
window.dispatchEvent(new Event(SCHMANCY_EXPAND_REQUEST_CLOSE))
```
