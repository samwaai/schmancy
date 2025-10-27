# Teleport Component

An advanced component that enables smooth FLIP (First, Last, Invert, Play) animations for elements transitioning between different DOM positions.

## Quick Start

```html
<!-- Source element -->
<schmancy-teleport id="user-avatar">
  <schmancy-avatar src="/user.jpg" name="John Doe"></schmancy-avatar>
</schmancy-teleport>

<!-- Target location (different part of DOM) -->
<schmancy-teleport id="user-avatar">
  <schmancy-avatar src="/user.jpg" name="John Doe"></schmancy-avatar>
</schmancy-teleport>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | - | **Required** - Unique identifier for teleportation pair |
| `uuid` | `number` | `random` | Auto-generated unique instance ID |
| `delay` | `number` | `0` | Animation delay in milliseconds |

## How It Works

The teleport component uses a sophisticated event system to coordinate animations:

1. **Discovery Phase**: Components with same `id` find each other
2. **Position Tracking**: Monitors element positions using ResizeObserver
3. **FLIP Animation**: Smoothly animates between positions
4. **State Management**: Maintains teleportation state across the app

## Examples

### Page Transition Animation
```html
<!-- List view -->
<schmancy-list>
  ${items.map(item => html`
    <schmancy-list-item @click="${() => selectItem(item)}">
      <schmancy-teleport id="item-${item.id}">
        <schmancy-card>
          <img src="${item.thumbnail}" />
          <h3>${item.title}</h3>
        </schmancy-card>
      </schmancy-teleport>
    </schmancy-list-item>
  `)}
</schmancy-list>

<!-- Detail view -->
${selectedItem ? html`
  <div class="detail-view">
    <schmancy-teleport id="item-${selectedItem.id}">
      <schmancy-card>
        <img src="${selectedItem.thumbnail}" />
        <h3>${selectedItem.title}</h3>
        <p>${selectedItem.description}</p>
      </schmancy-card>
    </schmancy-teleport>
  </div>
` : ''}
```

### Navigation Avatar Animation
```html
<!-- Collapsed navbar -->
<nav class="navbar-collapsed">
  <schmancy-teleport id="nav-user">
    <schmancy-avatar size="sm" src="/user.jpg"></schmancy-avatar>
  </schmancy-teleport>
</nav>

<!-- Expanded sidebar -->
<aside class="sidebar-expanded">
  <schmancy-teleport id="nav-user">
    <div class="user-profile">
      <schmancy-avatar size="lg" src="/user.jpg"></schmancy-avatar>
      <h3>John Doe</h3>
      <p>john@example.com</p>
    </div>
  </schmancy-teleport>
</aside>
```

### Tab Content Transitions
```html
<!-- Tab headers -->
<schmancy-tabs>
  ${tabs.map(tab => html`
    <schmancy-tab>
      <schmancy-teleport id="tab-icon-${tab.id}">
        <schmancy-icon>${tab.icon}</schmancy-icon>
      </schmancy-teleport>
      ${tab.label}
    </schmancy-tab>
  `)}
</schmancy-tabs>

<!-- Tab content -->
<div class="tab-content">
  <schmancy-teleport id="tab-icon-${activeTab.id}">
    <schmancy-icon size="xl">${activeTab.icon}</schmancy-icon>
  </schmancy-teleport>
  <h2>${activeTab.title}</h2>
  <div>${activeTab.content}</div>
</div>
```

## Event System

The component uses custom events for coordination:

### Internal Events
- `WhereAreYouRicky`: Discovery broadcast
- `HereMorty`: Response to discovery
- `FINDING_MORTIES`: Global search event
- `HERE_RICKY`: Component announcement

## Service Integration

The teleport system uses a central service for state management:

```typescript
// Access active teleportations
import { teleportationService } from '@schmancy/index';
// Or specific import: import { teleportationService } from '@schmancy/teleport';

// Get current positions
const positions = teleportationService.activeTeleportations;

// Subscribe to animations
teleportationService.flipRequests.subscribe(({ from, to }) => {
  console.log('Animating from', from.rect, 'to', to.rect);
});
```

## Advanced Features

### Position Watching
Uses `watchElementRect` to monitor element position changes:
- Handles resize events
- Tracks DOM mutations
- Updates on scroll

### FLIP Animation
Implements the FLIP technique for performant animations:
- **F**irst: Record initial position
- **L**ast: Record final position
- **I**nvert: Calculate the difference
- **P**lay: Animate to final position

### Visibility Management
- Initially hidden until position calculated
- Prevents layout jumps
- Smooth appearance after teleportation

## Performance Considerations

1. **Unique IDs**: Ensure IDs are unique per teleportation pair
2. **Cleanup**: Components automatically cleanup on disconnect
3. **Debouncing**: Position updates are optimized
4. **Observer Management**: Efficient use of ResizeObserver

## Debugging

Enable debug mode in development:
```javascript
// The component has built-in debugging
debugging = import.meta.env.DEV ? true : false
```

## Best Practices

1. **Unique IDs**: Always use unique, stable IDs
2. **Matching Content**: Ensure teleported content is identical
3. **Performance**: Limit active teleportations
4. **Transitions**: Combine with route transitions
5. **Fallbacks**: Handle cases where pairs don't exist

## Related Components

- [Avatar](./avatar.md) - Common teleportation target
- [Card](./card.md) - Container animations
- [Icon](./icons.md) - Icon transitions
- [Area](./area.md) - Route-based animations

## Use Cases

1. **Shared Element Transitions**: Seamless page transitions
2. **Master-Detail Views**: List to detail animations
3. **Navigation Morphing**: Navbar state changes
4. **Tab Transitions**: Content switching animations
5. **Gallery Effects**: Image zoom transitions