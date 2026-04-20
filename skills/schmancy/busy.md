# schmancy-busy

> Full-overlay busy indicator with backdrop blur. Place inside a `position: relative` container.

## Usage
```html
<div class="relative">
  <p>Content underneath</p>
  ${when(loading, () => html`<schmancy-busy></schmancy-busy>`)}
</div>
```

## Properties
No configurable properties. Renders a centered spinner overlay.

## Slots
| Slot | Description |
|------|-------------|
| default | Custom loading content (defaults to `<schmancy-spinner>`) |

## Examples
```html
<!-- Default spinner -->
<div class="relative h-64">
  <schmancy-busy></schmancy-busy>
</div>

<!-- Custom loading content -->
<div class="relative">
  <schmancy-busy>
    <schmancy-typography type="body" token="lg">Loading data...</schmancy-typography>
  </schmancy-busy>
</div>
```

The component uses `position: absolute; inset: 0` with `z-index: 50` and a subtle backdrop blur.
