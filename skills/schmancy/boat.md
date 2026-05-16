# schmancy-boat

> Corner-anchored launcher that opens its panel via the `show()` overlay service. Three slots, three non-overlapping intents — **no element-type sniffing**. The collapsed launcher's size, padding, radius and spacing are the consumer's; the boat owns drag, corner-snapping, position persistence and the glass surface.

> **Note:** `schmancy-window` is the evolved successor with more capabilities (resize, maximize, multi-window registry). Prefer `schmancy-window` for new code unless you want the simpler launcher-to-overlay model.

## Usage
```html
<schmancy-boat id="assistant" ?open=${isOpen}>
  <!-- optional: slot a handle to make the boat draggable -->
  <schmancy-icon slot="drag-handle">drag_indicator</schmancy-icon>

  <!-- trigger slot: the collapsed launcher — a plain click opens the panel -->
  <div slot="trigger" class="px-4 py-2 rounded-full">Assistant · 3</div>

  <!-- default slot: blooms into the show() overlay on open -->
  <div class="p-4">Panel body content</div>
</schmancy-boat>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | `'default'` | Unique identifier (persists drag position in localStorage) |
| `open` | boolean | `false` | Open state, reflected. Bind `?open=${…}` to drive it |
| `corner` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Initial anchor corner |

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
| `trigger` | the collapsed launcher — everything visible while closed | A native **click** (or Enter/Space) anywhere on it opens the panel. The boat does **not** `preventDefault` / `stopPropagation` / `setPointerCapture` here, so any interactive child (button, FAB, input) works natively. A child that should *not* also open the boat calls `stopPropagation()` on its own handler. |
| `drag-handle` | the drag affordance (a grip icon, a title bar — your choice) | **Opt-in.** Pointer-drag is wired only to this slot's boat-owned wrapper. Slot something here → draggable; omit it → the boat is static at its corner. A no-move tap on the handle also opens, so the grip doubles as a launcher. |
| _(default)_ | the expanded panel body | relocated into the `show()` overlay on open, restored on close |

## Behavior
- **Drag is opt-in and unambiguous.** No `<schmancy-boat>` is draggable unless the consumer slots `drag-handle`. Drag listens on a dedicated boat-owned region wrapping only that slot — every pointerdown there is a drag intent, so there is no interactive-element denylist and new interactive components never need registering.
- **The trigger is pure content.** Opening is a normal click that bubbles; nesting a `<schmancy-button>`, `<schmancy-fab>`, etc. in the trigger Just Works — the long-standing "interactive control swallowed by the drag/tap heuristic" bug class is gone (see ADR 0031).
- The collapsed shape is **not** imposed by the boat: no fixed height, padding, radius or gap. Style the `trigger` slot content for any shape.
- Drag to reposition (from the handle). Releases snap to the nearest corner (FLIP + `SPRING_SMOOTH`). Position persists in `localStorage` under `schmancy-boat-{id}`.
- Activation delegates to `show()`: blooms from the launcher, backdrop / Esc / back-button / sheet-on-narrow handled by the overlay primitive.
- Respects `prefers-reduced-motion`.

## Example
```html
<schmancy-boat id="chat" corner="bottom-right">
  <schmancy-icon slot="drag-handle" class="px-1 opacity-40">drag_indicator</schmancy-icon>
  <schmancy-fab slot="trigger" variant="tertiary" .label=${`Chat · ${count}`}>
    <schmancy-icon>chat</schmancy-icon>
  </schmancy-fab>
  <schmancy-list class="p-2">
    <!-- messages -->
  </schmancy-list>
</schmancy-boat>
```
