# schmancy-boat

> Material-3 extended FAB that opens its panel via the `show()` overlay service. Great for persistent assistant/telemetry panels.

> **Note:** `schmancy-window` is the evolved successor with more capabilities (resize, maximize, multi-window registry). Prefer `schmancy-window` for new code unless you want the simpler FAB-to-overlay model.

## Usage
```html
<schmancy-boat id="assistant" icon="smart_toy" label="Assistant" ?open=${isOpen}>
  <schmancy-icon slot="header">smart_toy</schmancy-icon>
  <span slot="summary">3</span>

  <!-- default slot: blooms into the show() overlay from the FAB on open -->
  <div class="p-4">Panel body content</div>
</schmancy-boat>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | `'default'` | Unique identifier (persists drag position in localStorage) |
| `icon` | string | — | Material icon for the FAB (overridden by the `header` slot) |
| `label` | string | — | FAB label text. **Omit → circular icon-only FAB** |
| `open` | boolean | `false` | Open state, reflected. Bind `?open=${…}` to drive it |
| `corner` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Initial anchor corner |
| `lowered` | boolean | `false` | Lower the FAB elevation |

## Methods & event
```typescript
boat.open = true          // open  (the primary, intuitive control)
boat.open = false         // close
boat.toggle()             // flip open ↔ closed
boat.addEventListener('toggle', e => e.detail) // 'open' | 'closed'
```

## Slots
| Slot | Renders | Behavior |
|------|---------|----------|
| _(default)_ | the expanded panel body | relocated into the `show()` overlay on open, restored on close |
| `summary` | trailing content on the FAB pill | live count / badge — stays on the FAB |
| `header` | leading icon on the FAB pill | overrides the `icon` property |

## Behavior
- Drag to reposition. Releases snap to the nearest corner (FLIP + `SPRING_SMOOTH`).
- Activation delegates to `show()`: blooms from the FAB, backdrop / Esc / back-button / focus, and sheet-on-narrow are handled by the overlay primitive.
- Position persists in `localStorage` under `schmancy-boat-{id}`.
- Respects `prefers-reduced-motion`.

## Example
```html
<schmancy-boat id="chat" icon="chat" label="Chat" corner="bottom-right">
  <schmancy-list class="p-2">
    <!-- messages -->
  </schmancy-list>
</schmancy-boat>
```
