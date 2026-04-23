# schmancy-tree

> Collapsible tree node with animated expand/collapse and chevron rotation.

## Usage
```html
<schmancy-tree>
  <span slot="root">Parent Item</span>
  <div>Child content here</div>
</schmancy-tree>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| open | boolean | `false` | Whether children are visible |

## Slots
| Slot | Description |
|------|-------------|
| root | The clickable root element (toggles open/close) |
| default | Child content (shown when open) |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| toggle | - | When the tree node is toggled |

## Examples
```html
<!-- Nested trees -->
<schmancy-tree>
  <span slot="root">Documents</span>
  <schmancy-tree>
    <span slot="root">Reports</span>
    <div>Q1 Report</div>
    <div>Q2 Report</div>
  </schmancy-tree>
  <schmancy-tree>
    <span slot="root">Invoices</span>
    <div>Invoice #001</div>
  </schmancy-tree>
</schmancy-tree>

<!-- Initially open -->
<schmancy-tree open>
  <span slot="root">Settings</span>
  <div>General</div>
  <div>Security</div>
</schmancy-tree>
```

Clicking the root slot or the chevron button toggles visibility. Animations use the Web Animations API with 150ms duration.
