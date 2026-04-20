# schmancy-navigation-rail

> Vertical navigation rail for desktop with 3-7 destinations, expand/collapse, and badge support.

## Usage
```html
<schmancy-navigation-rail activeIndex="0">
  <schmancy-navigation-rail-item icon="home" label="Home"></schmancy-navigation-rail-item>
  <schmancy-navigation-rail-item icon="search" label="Search"></schmancy-navigation-rail-item>
  <schmancy-navigation-rail-item icon="settings" label="Settings"></schmancy-navigation-rail-item>
</schmancy-navigation-rail>
```

## Properties (schmancy-navigation-rail)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| activeIndex | number | `-1` | Currently active item index |
| activeValue | string | `''` | Active item by value string |
| labelVisibility | `'all'\|'selected'\|'none'` | `'all'` | When to show labels |
| alignment | `'top'\|'center'\|'bottom'` | `'top'` | Item vertical alignment |
| expanded | boolean | `false` | Expanded width (240px vs 80px) |
| keyboardNavigation | boolean | `true` | Enable arrow key navigation |

## Slots
| Slot | Description |
|------|-------------|
| fab | Floating action button at top |
| menu | Menu button below FAB |
| header | Custom header content |
| footer | Custom footer content |
| default | Navigation rail items |

## Properties (schmancy-navigation-rail-item)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| icon | string | `''` | Material Symbols icon name |
| label | string | `''` | Item label text |
| value | string | `''` | Value for routing |
| active | boolean | `false` | Whether active |
| badge | string | `''` | Badge text |
| badgeVariant | `'error'\|'primary'\|'secondary'` | `'error'` | Badge color |
| disabled | boolean | `false` | Whether disabled |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| navigate | string | Item value when clicked |

## Examples
```html
<schmancy-navigation-rail activeIndex="0" alignment="top">
  <schmancy-button slot="fab" variant="filled">
    <schmancy-icon>add</schmancy-icon>
  </schmancy-button>
  <schmancy-navigation-rail-item icon="dashboard" label="Dashboard" value="dash">
  </schmancy-navigation-rail-item>
  <schmancy-navigation-rail-item icon="people" label="Users" value="users" badge="3">
  </schmancy-navigation-rail-item>
</schmancy-navigation-rail>
```

Automatically hides in fullscreen mode. Width is 80px collapsed, 240px expanded.
