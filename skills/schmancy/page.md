# schmancy-page

> Viewport-locked layout primitive. Provides a definite-height frame so any composition inside it has a parent to resolve against.

## Contract

Two rules and one slot.

1. **Outermost lock.** A `<schmancy-page>` with no `<schmancy-page>` ancestor anchors itself to the visual viewport (`position: fixed; inset: 0`) and tracks `visualViewport.height` for iOS soft-keyboard correctness. It does not rely on `html`/`body` height — the cascade above it is irrelevant.
2. **Single-child stretch.** The slotted child fills the page box (`height: 100%; width: 100%; min-height: 0; min-width: 0`). More than one direct child produces a visible layout collision — fail-loud, not silent.

Composition shape is plain CSS grid / flex inside the slotted child. The primitive does not prescribe header / footer / sidebar conventions; consumers arrange regions in standard CSS. The contract is the locked frame.

## Usage

### App root
```html
<schmancy-page>
  <schmancy-area name="root" .default=${landing}>
    <schmancy-route when="landing-view" .component=${landing}></schmancy-route>
    <schmancy-route when="app-home"     .component=${appHome}></schmancy-route>
  </schmancy-area>
</schmancy-page>
```

### Sidebar + sticky header + body
```html
<schmancy-page>
  <div class="grid grid-cols-[auto_1fr]">
    <app-rail></app-rail>
    <schmancy-page>
      <div class="grid grid-rows-[auto_1fr]">
        <app-top-bar></app-top-bar>
        <schmancy-area name="app">...</schmancy-area>
      </div>
    </schmancy-page>
  </div>
</schmancy-page>
```

The inner `<schmancy-page>` detects the outer ancestor, skips the viewport lock, and fills its grid cell via `height: 100%; width: 100%`.

### Tabs page
```html
<div class="grid grid-rows-[auto_1fr]">
  <schmancy-tabs></schmancy-tabs>
  <schmancy-area name="settings">...</schmancy-area>
</div>
```

No `<schmancy-page>` here — this view is the routed body of a higher `<schmancy-page>`. The grid resolves against the area's `1fr` cell, which the area inherits from the page.

### Admin shell (four regions)
```html
<schmancy-page>
  <div class="grid grid-rows-[auto_1fr]">
    <admin-top-bar></admin-top-bar>
    <div class="grid grid-cols-[240px_1fr_320px]">
      <admin-sidebar></admin-sidebar>
      <schmancy-area name="admin"></schmancy-area>
      <admin-inspector></admin-inspector>
    </div>
  </div>
</schmancy-page>
```

## Properties

`<schmancy-page>` has no public properties. Composition is expressed by what you nest inside its single slot.

The `outermost` attribute is set automatically on the page that owns the viewport lock. Consumers neither set nor read it.

## Edge cases

- **Print** — outermost page falls back to `position: static` so pagination works.
- **iOS soft keyboard** — outermost page reads `visualViewport.height` and applies it as inline `height`, so the locked box shrinks when the keyboard opens.
- **Long-form leaf (marketing, legal)** — opt out at the leaf, not at the page. The routed component declares its own `:host { height: auto; overflow: auto; min-height: 100% }`. The outer page stays locked; the leaf scrolls inside its `<schmancy-area>`.
- **Master-detail with two scroll regions** — render two `<schmancy-area>` slots inside a grid; each owns its scroll.

## Rules

- A `<schmancy-page>` has exactly one direct child. If you need multiple regions, wrap them in a grid / flex container.
- Do not put `class="h-full"`, `class="w-full"`, or `:host { height: 100% }` anywhere in your tree. The page and the area carry sizing; consumer code never does.
- Scroll lives in `<schmancy-area>`, not in `<schmancy-page>`. Pages provide the locked frame; areas provide the scrolling region for their mounted component.
