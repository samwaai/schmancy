# schmancy-timeline-tile

> One cell in a procurement-stage timeline rail. Renders an empty / filled / stacked paper-card tile with a 2-letter glyph label, optional tooltip + caption, and a built-in fan-on-hover orchestration for stacked variants.

## Usage

```html
<!-- Empty cell (placeholder for a missing stage doc) -->
<schmancy-timeline-tile state="empty" glyph="PO"></schmancy-timeline-tile>

<!-- Single filled cell with tooltip + caption -->
<schmancy-timeline-tile
  state="filled"
  glyph="IN"
  tooltip="INV-2025-0001"
  caption="EUR 12,400"
  @tile-click=${(e) => openInspect(e.detail)}
></schmancy-timeline-tile>

<!-- Stack of N revisions: wrapper carries `data-stack-id` + `--fan-count`,
     stack-top sits on top with the ×N badge, siblings reveal on hover.
     The wrapper toggles `data-fanned` automatically — no consumer
     pointer wiring required. -->
<div
  data-stack-id="po-123"
  style="position: relative; width: 32px; height: 40px; --fan-count: 3;"
>
  <schmancy-timeline-tile state="stack-sibling" glyph="PO" .index=${0}></schmancy-timeline-tile>
  <schmancy-timeline-tile state="stack-sibling" glyph="PO" .index=${1}></schmancy-timeline-tile>
  <schmancy-timeline-tile
    state="stack-top"
    glyph="PO"
    .index=${2}
    .stackCount=${3}
    tooltip="PO-2025-0007 · rev 3"
    caption="EUR 12,400"
  ></schmancy-timeline-tile>
</div>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `state` | `'empty' \| 'filled' \| 'stack-top' \| 'stack-sibling'` | `'empty'` | Render mode (reflected) |
| `glyph` | `string` | `''` | 2-letter stage label (e.g. `RQ`, `PO`, `OC`, `DN`, `IN`) |
| `stackCount` | `number?` | `undefined` | When `state="stack-top"` and > 1, renders the ×N badge |
| `index` | `number?` | `undefined` | Sibling position in the stack (drives `--i` for fan offset; reflected) |
| `tooltip` | `string?` | `undefined` | Tooltip text shown on hover / focus |
| `caption` | `string?` | `undefined` | Caption rendered below the tile (hidden on `stack-sibling`) |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `tile-click` | `{ glyph, state }` | Fires on click for any non-`empty` state. Bubbles + composed. |

## Stack fan orchestration

When `state="stack-top"`, the component subscribes a `pointerover` pipe to its parent element (the stack wrapper). The pipe is hover-intent: `pointerover` events with a target that closest-matches `[data-stack-id]` immediately set `data-fanned` on the wrapper; leaving the wrapper waits 800 ms before clearing the attribute, so the cursor can cross the gap between fanned siblings without collapsing the stack. The attribute lifetime IS the fanned state — sibling tiles read it via the `:host-context([data-fanned])` selector and translate edge-to-edge.

The consumer's wrapper element MUST carry:
- `data-stack-id="<unique>"` so the pointerover pipe can match the target
- `position: relative` so the absolutely-positioned tiles align to it
- `width` + `height` matching `--schmancy-tile-w` / `--schmancy-tile-h` (default `32px` / `40px`)
- `--fan-count: <N>` so each tile knows the total stack size

`stack-sibling` tiles set `pointer-events: none` until the wrapper is fanned, then re-enable so the user can click any revision.

## Slots

None. Glyph and caption are props, not slot content — keeps the tile self-contained and addressable from a `repeat()` template.

## Accessibility

- Filled / stack tiles render a native `<button type="button">` with `tabindex="0"` and `role="button"`.
- `aria-label` is composed from `glyph`, `caption`, and `tooltip`.
- Empty tiles set `tabindex="-1"` and `aria-label="<glyph> · empty"`.
- Focus shows a 2px ring in `--schmancy-sys-color-primary-default` with a 3px offset.

## Tokens consumed

| Custom property | Source |
|-----------------|--------|
| `--schmancy-sys-color-outline` | dashed border, paper-card lines, sibling outline |
| `--schmancy-sys-color-surface-containerLowest` | filled-card background, tooltip background |
| `--schmancy-sys-color-surface-on` | tooltip + caption text |
| `--schmancy-sys-color-surface-onVariant` | empty-state glyph |
| `--schmancy-sys-color-primary-default` | hover border, focus ring, top-edge tint, ×N badge background |
| `--schmancy-sys-color-primary-on` | ×N badge text |
| `--schmancy-sys-color-primary-onContainer` | filled-state glyph color |
| `--schmancy-tile-w`, `--schmancy-tile-h` | host width / height (defaults `32px` / `40px`) |
| `--fan-count`, `--i` | wrapper-driven fan layout (consumer or component-set) |

Theme overrides cascade from any ancestor `<schmancy-theme>` — wrap the timeline in a tinted theme block to recolor the rail without touching the component.
