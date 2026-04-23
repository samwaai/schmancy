# schmancy-navigation-bar

> Horizontal bottom navigation bar for mobile with 3-7 destinations, auto-hide on scroll, and fullscreen support.

## Usage
```html
<schmancy-navigation-bar activeIndex="0" class="fixed bottom-0 left-0 right-0">
  <schmancy-navigation-bar-item icon="home" label="Home"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="search" label="Search"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
</schmancy-navigation-bar>
```

## Properties (schmancy-navigation-bar)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| activeIndex | number | `-1` | Currently active item index |
| hideLabels | boolean | `false` | Hide labels, show only icons |
| elevation | number (0-5) | `2` | Shadow elevation |
| hideOnScroll | boolean | `false` | Auto-hide on scroll down |

## Properties (schmancy-navigation-bar-item)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| icon | string | `''` | Material Symbols icon name |
| label | string | `''` | Item label text |
| badge | string | `''` | Badge content (number or text) |
| active | boolean | `false` | Whether this item is active |
| disabled | boolean | `false` | Whether this item is disabled |
| hideLabels | boolean | `false` | Whether to hide the label |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| navigation-change | `{ oldIndex, newIndex, item }` | When active item changes |

## Examples
```html
<!-- With badges and scroll-hide -->
<schmancy-navigation-bar activeIndex="0" hideOnScroll>
  <schmancy-navigation-bar-item icon="inbox" label="Inbox" badge="5">
  </schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="favorite" label="Favorites">
  </schmancy-navigation-bar-item>
</schmancy-navigation-bar>
```

Automatically hides in fullscreen mode. Consumer must position the bar (e.g., `class="fixed bottom-0 left-0 right-0"`).
