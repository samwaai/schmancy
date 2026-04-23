# schmancy-list / schmancy-list-item

> List container with list items that have glass hover glow, spring press, and selected state with secondary glow.

## Usage
```html
<schmancy-list>
  <schmancy-list-item>Item 1</schmancy-list-item>
  <schmancy-list-item selected>Item 2</schmancy-list-item>
</schmancy-list>
```

## Properties (schmancy-list)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `surface` | `TSurfaceColor` | `undefined` | Surface color type, provided to children via context |
| `fill` | `SchmancySurfaceFill` | `'auto'` | Surface fill style |
| `elevation` | `0-5` | `0` | Surface elevation level |

## Properties (schmancy-list-item)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `selected` | `boolean` | `false` | Selected state with secondary glow |
| `readonly` | `boolean` | `false` | Disables interaction (no hover, no cursor) |
| `rounded` | `boolean` | `false` | Rounded corners |

## Slots (schmancy-list-item)
| Slot | Description |
|------|-------------|
| (default) | Item content |
| `leading` | Leading content (images auto-sized to 16-20px) |
| `trailing` | Trailing content (images auto-sized to 16-20px) |

## Physics
- Hover: glass background (`surface-on` at 8%) + subtle primary glow shadow
- Active: spring compress `scale(0.98)` with 100ms transition
- Selected: secondary container background at 30% + secondary glow shadow
- No resting background on unselected items (transparent)

## Examples
```html
<!-- Basic list with selection -->
<schmancy-list>
  ${repeat(items, item => item.id, item => html`
    <schmancy-list-item
      ?selected=${item.id === selectedId}
      @click=${() => this.select(item.id)}
    >
      ${item.name}
    </schmancy-list-item>
  `)}
</schmancy-list>

<!-- List with leading/trailing slots -->
<schmancy-list surface="surface">
  <schmancy-list-item>
    <schmancy-icon slot="leading">person</schmancy-icon>
    User Name
    <schmancy-icon slot="trailing">chevron_right</schmancy-icon>
  </schmancy-list-item>
</schmancy-list>

<!-- Readonly list -->
<schmancy-list>
  <schmancy-list-item readonly>Display only</schmancy-list-item>
</schmancy-list>
```
