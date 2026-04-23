# schmancy-dropdown

> Floating dropdown with trigger slot and auto-positioned content portal.

## Usage
```html
<schmancy-dropdown>
  <schmancy-button slot="trigger">Open</schmancy-button>
  <schmancy-dropdown-content>
    <p>Dropdown content here</p>
  </schmancy-dropdown-content>
</schmancy-dropdown>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| open | boolean | `false` | Whether the dropdown is open |
| placement | string | `'bottom-start'` | Floating UI placement |
| distance | number | `8` | Offset distance in pixels |

## Placement Values
`top`, `top-start`, `top-end`, `right`, `right-start`, `right-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`

## Methods
| Method | Description |
|--------|-------------|
| toggle() | Toggle open/close state |

## Slots
| Slot | Description |
|------|-------------|
| trigger | Element that opens the dropdown on click |
| default | Dropdown content |

## Examples
```html
<!-- Right-aligned dropdown -->
<schmancy-dropdown placement="bottom-end">
  <schmancy-icon-button slot="trigger">more_vert</schmancy-icon-button>
  <schmancy-dropdown-content>
    <div class="p-4">Custom content</div>
  </schmancy-dropdown-content>
</schmancy-dropdown>
```

Content is teleported to a portal for proper z-index stacking. Closes on outside click or Escape key.
