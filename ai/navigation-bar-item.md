# Navigation Bar Item Component

## Overview
The `<schmancy-navigation-bar-item>` component represents an individual navigation destination within a navigation bar. It follows Material Design 3 specifications with proper touch targets, ripple effects, and state management using RxJS observables.

## Usage

### Basic Example
```html
<schmancy-navigation-bar-item
  icon="home"
  label="Home"
  active
></schmancy-navigation-bar-item>
```

### With Badge
```html
<schmancy-navigation-bar-item
  icon="notifications"
  label="Alerts"
  badge="5"
></schmancy-navigation-bar-item>
```

### Custom Icon Slot
```html
<schmancy-navigation-bar-item label="Custom">
  <span slot="icon">🏠</span>
</schmancy-navigation-bar-item>
```

### With Custom Content
```html
<schmancy-navigation-bar-item>
  <schmancy-icon slot="icon" size="24">favorite</schmancy-icon>
  Custom Content
</schmancy-navigation-bar-item>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `icon` | `string` | `''` | Material Symbols Outlined icon name |
| `label` | `string` | `''` | Label text for the navigation item |
| `badge` | `string` | `''` | Badge content (number or short text) |
| `active` | `boolean` | `false` | Whether this item is currently active/selected |
| `disabled` | `boolean` | `false` | Whether this item is disabled |
| `hideLabels` | `boolean` | `false` | Hide labels (controlled by parent navigation bar) |

## Events

### bar-item-click
Fired when the item is clicked.

```javascript
item.addEventListener('bar-item-click', (event) => {
  console.log('Icon:', event.detail.icon);
  console.log('Label:', event.detail.label);
  console.log('Active:', event.detail.active);
});
```

### focus / blur
Standard focus and blur events for accessibility.

## Features

### RxJS-Powered Interactions
- **Click handling**: Uses RxJS observables for instant navigation events
- **Ripple effects**: Immediate visual feedback on interaction
- **Keyboard support**: Enter and Space keys properly handled
- **State management**: BehaviorSubject for reactive active state updates

### Full Clickable Area
The entire navigation item is clickable, not just the icon area:
- Better touch targets on mobile devices
- Improved accessibility
- More intuitive user experience
- 48x48dp minimum touch target as per Material Design

### Badge System
Intelligent badge handling:
- Numbers > 99 display as "99+"
- Text badges limited to 3 characters
- Zero values hide the badge
- Proper ARIA labels for screen readers

### Ripple Animation
Material Design ripple effect:
- Originates from click position
- 600ms animation duration
- GPU-accelerated CSS animations
- Multiple concurrent ripples supported

## Slots

| Slot | Description |
|------|-------------|
| `icon` | Custom icon content to replace the default icon |
| default | Custom content for the item |

## Styling

### State-based Styling
The component automatically applies different styles based on state:

```css
/* Active state */
schmancy-navigation-bar-item[active] {
  /* Icon indicator background: secondary-container */
  /* Text color: secondary-onContainer */
}

/* Inactive state */
schmancy-navigation-bar-item:not([active]) {
  /* Text color: surface-onVariant */
  /* Hover background: surface-container-highest */
}

/* Disabled state */
schmancy-navigation-bar-item[disabled] {
  /* Opacity: 0.38 */
  /* Pointer events disabled */
}
```

### CSS Parts
```css
/* Style the button element */
schmancy-navigation-bar-item::part(button) {
  /* Custom button styles */
}
```

## Methods

### setActive(isActive: boolean)
Programmatically set the active state of the item.

```javascript
// In Lit component - use property binding
@state() isActive = true;

render() {
  return html`
    <schmancy-navigation-bar-item ?active=${this.isActive}>
    </schmancy-navigation-bar-item>
  `;
}
```

## Integration Example

### Complete Navigation Setup
```typescript
@customElement('app-navigation')
class AppNavigation extends LitElement {
  @state() activeIndex = 0;

  private navigationItems = [
    { icon: 'home', label: 'Home', route: 'home' },
    { icon: 'search', label: 'Search', route: 'search' },
    { icon: 'favorite', label: 'Favorites', route: 'favorites', badge: '3' },
    { icon: 'person', label: 'Profile', route: 'profile' }
  ];

  private handleItemClick = (e: CustomEvent, index: number) => {
    this.activeIndex = index;
    const route = this.navigationItems[index].route;

    // Navigate to route
    area.push({
      component: route,
      area: 'main'
    });
  }

  render() {
    return html`
      ${this.navigationItems.map((item, index) => html`
        <schmancy-navigation-bar-item
          icon=${item.icon}
          label=${item.label}
          ?active=${this.activeIndex === index}
          badge=${item.badge || ''}
          @bar-item-click=${(e: CustomEvent) => this.handleItemClick(e, index)}
        ></schmancy-navigation-bar-item>
      `)}
    `;
  }
}
```

## Accessibility

### Keyboard Support
- `Enter` / `Space` - Activate the item instantly
- Full focus management with visual indicators
- `aria-pressed` attribute reflects active state
- `aria-label` for badge notifications

### Screen Reader Support
- Proper ARIA attributes
- Semantic HTML structure
- Badge announcements ("3 notifications")

## Performance Optimization

### RxJS Observables
- Efficient event handling with proper cleanup
- Instant navigation events for responsive interaction
- Immediate ripple feedback for better UX
- Memory-safe with `takeUntil(this.disconnecting)`

### Rendering Optimization
- Conditional rendering based on props
- Efficient class mapping with TailwindElement
- Shadow DOM for style encapsulation

## Best Practices

1. **Icons**: Always use Material Symbols Outlined for consistency
2. **Labels**: Keep labels concise (1-2 words maximum)
3. **Badges**: Use for important notifications only
4. **Active State**: Let parent navigation bar manage active states
5. **Disabled State**: Use sparingly, consider hiding instead
6. **Custom Icons**: Use the icon slot for custom SVGs or emojis

## Common Patterns

### Dynamic Badges
```javascript
// In Lit component - use declarative binding
@state() notificationCount = 0;

render() {
  return html`
    <schmancy-navigation-bar-item
      badge=${this.notificationCount > 0 ? String(this.notificationCount) : ''}
    ></schmancy-navigation-bar-item>
  `;
}
```

### Conditional Rendering
```javascript
// Show/hide items based on user role
const items = user.isAdmin
  ? ['dashboard', 'users', 'settings']
  : ['dashboard', 'settings'];
```

### Icon Switching
```javascript
// Change icon based on state
const icon = isPlaying ? 'pause' : 'play_arrow';
```