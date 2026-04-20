# schmancy-window

> Floating draggable window with corner snapping, resize, and minimize/maximize states. Replaces deprecated `schmancy-float`.

## Usage
```html
<schmancy-window id="chat" corner="bottom-right">
  <span slot="header">Chat</span>
  <schmancy-icon slot="icon">chat</schmancy-icon>
  <div>Window body content…</div>
</schmancy-window>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | `'default'` | Unique window identifier (used by `windowManager` registry) |
| `open` | boolean | `false` | Body expanded state |
| `corner` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Anchor corner |
| `freePosition` | boolean | `false` | Keep dragged position instead of snapping to corner |
| `resizable` | boolean | `false` | Allow user resizing from edges |
| `visualState` | `'minimized' \| 'normal' \| 'maximized'` | `'normal'` | Reflected state attribute |
| `expandedWidth` | string | responsive | e.g. `'320px'`, `'24rem'` |
| `expandedHeight` | string | auto | e.g. `'400px'`, `'50vh'` |
| `minWidth` | number | `280` | Minimum width px during resize |
| `minHeight` | number | `200` | Minimum height px during resize |
| `lowered` | boolean | `false` | Lower elevation shadow in collapsed state |

## Slots
| Slot | Purpose |
|------|---------|
| `icon` | Leading icon in the head (minimized FAB state) |
| `header` | Header label (visible when expanded) |
| (default) | Window body content (lazy rendered — not in DOM until first open) |

## Behavior
- Drag from head to reposition. Release snaps to the nearest corner unless `freePosition`.
- `windowManager` tracks focused window and resolves overlap between multiple windows.
- `cursorGlow` applied to head while expanded.
- Collapsed state uses a clip-path reveal animation; expand uses `SPRING_SMOOTH` physics.
- Body content mounts lazily on first expand (`_hasOpened`).
- All animations respect `prefers-reduced-motion` via `reducedMotion$`.

## Examples
```html
<!-- Chat-style window docked bottom-right -->
<schmancy-window id="support" corner="bottom-right">
  <schmancy-icon slot="icon">support_agent</schmancy-icon>
  <span slot="header">Support</span>
  <div class="p-4">How can we help?</div>
</schmancy-window>

<!-- Resizable, free-position floating panel -->
<schmancy-window id="inspector" resizable free-position expanded-width="420px" expanded-height="60vh">
  <span slot="header">Inspector</span>
  <div>…</div>
</schmancy-window>
```

## windowManager
```typescript
import { windowManager } from '@mhmo91/schmancy/window'

windowManager.focus('support')       // Bring window to front
windowManager.getBounds('inspector') // Read tracked bounds
windowManager.all$ .subscribe(...)    // Observable of registered windows
```
