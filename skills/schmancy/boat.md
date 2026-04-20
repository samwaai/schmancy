# schmancy-boat

> Draggable floating FAB that expands into a panel. Great for persistent assistant/chat panels.

> **Note:** `schmancy-window` is the evolved successor with more capabilities (resize, maximize, multi-window registry). Prefer `schmancy-window` for new code unless you want the simpler FAB-to-panel model.

## Usage
```html
<schmancy-boat id="assistant" icon="smart_toy" label="Assistant">
  <div slot="header">Assistant</div>
  <div class="p-4">Panel body content</div>
</schmancy-boat>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | `'default'` | Unique identifier (persists drag position in localStorage) |
| `icon` | string | — | Material icon for the FAB state |
| `label` | string | — | Label text in FAB state |
| `open` | boolean | `false` | Panel open/closed (reflected) |
| `corner` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Anchor corner |
| `expandedWidth` | string | responsive | e.g. `'320px'` |
| `lowered` | boolean | `false` | Lower shadow in FAB state |

## Getter / Setter
```typescript
boat.state = 'expanded' | 'collapsed'   // equivalent to open = true/false
boat.state                              // current state
boat.expand() / boat.close()
```

## Behavior
- Drag to reposition. Releases snap to the nearest corner.
- Open/close uses clip-path + `SPRING_SMOOTH` for elegant reveal.
- Position persists in `localStorage` under `schmancy-boat-{id}`.
- Respects `prefers-reduced-motion`.

## Example
```html
<schmancy-boat id="chat" icon="chat" label="Chat" corner="bottom-right">
  <span slot="header">Messages</span>
  <schmancy-list class="p-2">
    <!-- messages -->
  </schmancy-list>
</schmancy-boat>
```
