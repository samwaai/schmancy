# Navigation Bar Component

## Overview
The `<schmancy-navigation-bar>` component is a Material Design 3 compliant horizontal navigation component that provides access to 3-7 primary destinations in your application. It's typically fixed at the bottom of the viewport and follows M3 specifications with proper elevation, touch targets, and responsive behavior.

## Usage

### Basic Example
```html
<schmancy-navigation-bar activeIndex="0">
  <schmancy-navigation-bar-item icon="home" label="Home"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="search" label="Search"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="favorite" label="Favorites"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
</schmancy-navigation-bar>
```

### With Hide on Scroll
```html
<schmancy-navigation-bar activeIndex="0" hideOnScroll>
  <schmancy-navigation-bar-item icon="dashboard" label="Dashboard"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="shopping_cart" label="Orders"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="inventory" label="Products"></schmancy-navigation-bar-item>
</schmancy-navigation-bar>
```

### With Badges
```html
<schmancy-navigation-bar>
  <schmancy-navigation-bar-item icon="home" label="Home"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="notifications" label="Alerts" badge="3"></schmancy-navigation-bar-item>
  <schmancy-navigation-bar-item icon="mail" label="Messages" badge="99+"></schmancy-navigation-bar-item>
</schmancy-navigation-bar>
```

### Fullscreen Mode Support
The navigation bar automatically hides in fullscreen mode when triggered via the theme service:

```javascript
import { schmancyTheme } from '@schmancy/theme';

// Enter fullscreen mode (hides navigation bar)
schmancyTheme.next({ fullscreen: true });

// Exit fullscreen mode (shows navigation bar)
schmancyTheme.next({ fullscreen: false });

// Toggle fullscreen mode
schmancyTheme.toggleFullscreen();
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `activeIndex` | `number` | `-1` | Currently active item index (zero-based) |
| `hideLabels` | `boolean` | `false` | Hide labels and show only icons |
| `elevation` | `number` | `2` | Elevation level for the navigation bar (0-5) |
| `hideOnScroll` | `boolean` | `false` | Automatically hide bar when scrolling down, show when scrolling up |


## Events

### navigation-change
Fired when an item is selected.

```javascript
navigationBar.addEventListener('navigation-change', (event) => {
  console.log('Old index:', event.detail.oldIndex);
  console.log('New index:', event.detail.newIndex);
  console.log('Selected item:', event.detail.item);
});
```


## Features

### Reactive State Management
The component uses RxJS BehaviorSubjects for reactive state management, ensuring smooth and predictable state updates across all navigation items.

### Hide on Scroll Behavior
When `hideOnScroll` is enabled:
- Navigation bar hides when scrolling down to maximize content space
- Shows automatically when scrolling up for quick access
- Uses smooth CSS transforms for GPU-accelerated animations
- Implements a 10px scroll threshold to prevent jittery behavior
- Always visible when near the top of the page

### Visibility Control
The navigation bar provides comprehensive visibility control:
- **Manual Control**: Use `hide()`, `show()`, or `toggleVisibility()` methods
- **Fullscreen Support**: Hide the navigation bar for immersive experiences
- **Event-driven**: Listen to `visibility-change` events to react to visibility changes
- **Smooth Transitions**: All visibility changes use smooth animations (300ms cubic-bezier)
- **ARIA Compliance**: Automatically updates `aria-hidden` attribute
- **Independent Controls**: `hidden` property works independently of scroll-based hiding

### Keyboard Navigation
Full keyboard support for accessibility:
- `ArrowLeft` / `ArrowRight` - Navigate between items
- `Home` / `End` - Jump to first/last item
- `Enter` / `Space` - Activate focused item
- Proper focus management with `tabindex`

### Material Design 3 Compliance
- Fixed 80px height as per M3 specifications
- 48x48dp minimum touch targets
- Proper elevation and shadow system
- Responsive item distribution (3-7 items)
- Surface container background color

## Styling

### CSS Variables
The component respects the Schmancy theme system:
- Background: `SchmancyTheme.sys.color.surface.container`
- Text: `SchmancyTheme.sys.color.surface.on`

### Custom Styling
```css
schmancy-navigation-bar {
  /* Custom z-index if needed */
  --navigation-bar-z-index: 20;
}
```

## Integration with schmancy-area

### Route-based Navigation
```typescript
@customElement('my-app')
class MyApp extends LitElement {
  private handleNavigation = (e: CustomEvent) => {
    const routes = ['dashboard', 'orders', 'products', 'settings'];
    const route = routes[e.detail.newIndex];

    // Navigate using schmancy-area
    area.push({
      component: route,
      area: 'main'
    });
  }

  render() {
    return html`
      <schmancy-navigation-bar
        @navigation-change=${this.handleNavigation}
        activeIndex="0"
      >
        <schmancy-navigation-bar-item icon="dashboard" label="Dashboard"></schmancy-navigation-bar-item>
        <schmancy-navigation-bar-item icon="shopping_cart" label="Orders"></schmancy-navigation-bar-item>
        <schmancy-navigation-bar-item icon="inventory" label="Products"></schmancy-navigation-bar-item>
        <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
      </schmancy-navigation-bar>

      <schmancy-area name="main" default="dashboard">
        <schmancy-route when="dashboard" component="app-dashboard"></schmancy-route>
        <schmancy-route when="orders" component="app-orders"></schmancy-route>
        <schmancy-route when="products" component="app-products"></schmancy-route>
        <schmancy-route when="settings" component="app-settings"></schmancy-route>
      </schmancy-area>
    `;
  }
}
```

## Best Practices

1. **Item Count**: Use between 3-7 items for optimal usability
2. **Labels**: Keep labels short (1-2 words) for better readability
3. **Icons**: Use Material Symbols Outlined icons for consistency
4. **Active State**: Always maintain an active state for user orientation
5. **Scroll Behavior**: Enable `hideOnScroll` for content-heavy pages
6. **Badges**: Use sparingly for important notifications only

## Accessibility

- ARIA roles and labels properly set
- Keyboard navigation fully supported
- Focus indicators for keyboard users
- `aria-pressed` attribute on active items
- `aria-hidden` when navigation is hidden on scroll

## Performance Notes

- Efficient event handling with automatic cleanup
- Scroll events are throttled at 100ms intervals to prevent performance issues
- CSS transforms for smooth GPU-accelerated animations
- Lazy subscription setup for scroll listeners only when needed