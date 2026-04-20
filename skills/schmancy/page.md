# schmancy-page

> Native mobile-like page container. Fills remaining viewport height, prevents rubber-banding, pull-to-refresh, and double-tap zoom.

## Usage
```html
<schmancy-page rows="auto_1fr_auto">
  <header>App bar</header>
  <main>Scrollable content</main>
  <footer>Bottom nav</footer>
</schmancy-page>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rows` | string | `'auto_1fr_auto'` | Grid template rows — underscores become spaces (e.g. `'1fr_2fr_auto'`) |
| `show-scrollbar` | boolean | `false` | Display scrollbar on scrollable area |
| `no-select` | boolean | `false` | Disable text selection |

## Behavior
- Listens to `visualViewport` resize/scroll + `orientationchange` + keyboard focus events to recompute height.
- Accounts for theme bottom offset (iOS safe area, home indicator).
- Auto-assigns semantic elements (`header`, `main`, `footer`) to slots.
- Inner scroll area uses `schmancy-scroll` for momentum-preserving scroll.

## When to Use
- Root of a mobile view or panel that should feel like a native page.
- Any container where viewport-aware height + scroll containment matters.

## Example — 3-row app shell
```html
<schmancy-page rows="auto_1fr_auto">
  <schmancy-surface type="solid" rounded="none">
    <schmancy-typography type="title">My App</schmancy-typography>
  </schmancy-surface>

  <div class="p-4">…scrollable content…</div>

  <schmancy-navigation-bar></schmancy-navigation-bar>
</schmancy-page>
```
