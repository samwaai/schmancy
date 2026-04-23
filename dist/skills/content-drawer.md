# schmancy-content-drawer

> Responsive content drawer that switches between side panel (push) and bottom sheet (overlay) based on viewport.

## Usage
```html
<schmancy-content-drawer>
  <schmancy-content-drawer-main>
    <!-- Primary content -->
  </schmancy-content-drawer-main>
  <schmancy-content-drawer-sheet>
    <div slot="placeholder">Select an item</div>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

## Properties (schmancy-content-drawer)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| open | `'open'\|'close'` | auto | Sheet state |

## Properties (schmancy-content-drawer-main)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| minWidth | number | `360` | Minimum width in pixels |

## Properties (schmancy-content-drawer-sheet)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| minWidth | number | `576` | Minimum width in pixels |

## Rendering Content to Sheet
```typescript
// Dispatch event to render component in the sheet
window.dispatchEvent(new CustomEvent('schmancy-content-drawer-render', {
  detail: {
    component: myElement,
    state: {},
    params: {},
    props: {}
  }
}))
```

## Behavior
- When `main.minWidth + sheet.minWidth <= viewport`: push mode (side-by-side)
- When viewport is smaller: overlay mode (bottom sheet)
- Sheet content is routed via an internal `schmancy-area`

## Examples
```html
<schmancy-content-drawer>
  <schmancy-content-drawer-main minWidth="400">
    <div class="p-4">
      <h2>List View</h2>
      <!-- List items that open detail in sheet -->
    </div>
  </schmancy-content-drawer-main>
  <schmancy-content-drawer-sheet minWidth="500">
    <div slot="placeholder">
      <p>Select an item to view details</p>
    </div>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```
