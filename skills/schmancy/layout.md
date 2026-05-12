# Layout Directives

```typescript
import { fill, overflowWithin } from '@mhmo91/schmancy/directives'
```

## `fill()` — viewport-anchor an element

Measures against `visualViewport` and writes exact `height`/`width` in px. Cascade-independent — works even when parent custom elements default to `display: inline`. Tracks iOS keyboard, orientation change, and `theme.bottomOffset$`.

Sets: `height: Npx`, `width: Npx`, `overflow: hidden`, `min-h/w: 0`, `box-sizing: border-box`, `padding-bottom` (safe area).  
Does **not** set `display` or `grid-template-*` — use Tailwind classes on the same element.

## `overflowWithin()` — contained scroll region

Sets: `overflow: auto`, `overscroll-behavior: contain`, `scroll-behavior: smooth`, `min-h/w: 0`, `box-sizing: border-box`.

## Canonical shell

```typescript
// app-shell.view.ts
html`<schmancy-area ${fill()} name="root" .default=${...}>...</schmancy-area>`

// app-home.view.ts
html`
  <my-shell class="grid grid-cols-[auto_1fr]" ${fill()}>
    <app-rail></app-rail>
    <div ${overflowWithin()} class="grid grid-rows-[auto_1fr] min-h-0">
      <tree-picker></tree-picker>
      <schmancy-area name="app" .default=${...}>...</schmancy-area>
    </div>
  </my-shell>
`
```

```css
/* styles.css */
html, body { margin: 0; padding: 0; overflow: hidden; }
```

## Rules

- One `fill()` per shell level. Inner levels get `min-h-0` grid cells.
- `overflowWithin()` goes on the element that should scroll, not on `:host`.
- Do not write `h-full`, `w-full`, or `:host { height: 100% }` anywhere. `schmancy-area`'s `::slotted` rule sizes mounted views.
- `<schmancy-page>` is removed — `fill()` replaces it.
