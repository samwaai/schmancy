# Navigation Rail Component

**Material Design 3 Reference:** https://m3.material.io/components/navigation-rail/overview

A Material Design 3 compliant vertical navigation component that provides access to primary destinations in an application. The navigation rail is positioned on the left side of the screen with a fixed 80px width and offers a compact, ergonomic way to navigate between 3-7 primary sections.

## Installation

```typescript
import '@schmancy/navigation-rail'
import '@schmancy/navigation-rail/navigation-rail-item'

// Or import from main package
import { SchmancyNavigationRail, SchmancyNavigationRailItem } from '@schmancy'
```

## Basic Usage

```html
<schmancy-navigation-rail activeIndex="0">
  <schmancy-navigation-rail-item
    icon="home"
    label="Home"
    value="/home">
  </schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item
    icon="search"
    label="Search"
    value="/search">
  </schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item
    icon="favorites"
    label="Favorites"
    value="/favorites">
  </schmancy-navigation-rail-item>
</schmancy-navigation-rail>
```

## Navigation Rail Component

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `activeIndex` | `number` | `-1` | The currently active item index |
| `activeValue` | `string` | `''` | The currently active item value (for programmatic selection) |
| `labelVisibility` | `'all' \| 'selected' \| 'none'` | `'all'` | When to show labels for navigation items |
| `alignment` | `'top' \| 'center' \| 'bottom'` | `'top'` | Vertical alignment of navigation items |
| `showTooltips` | `boolean` | `true` | Show tooltips when labels are hidden |
| `keyboardNavigation` | `boolean` | `true` | Enable keyboard navigation with arrow keys |
| `expanded` | `boolean` | `false` | Whether the navigation rail is expanded |

### Slots

| Slot | Description |
|------|-------------|
| `fab` | Floating Action Button at the top of the rail |
| `menu` | Menu button below the FAB |
| `header` | Custom header content |
| `footer` | Custom footer content |
| (default) | Navigation rail items |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `navigate` | `string` | Fired when a navigation item is selected, detail contains the value |
| `fab-click` | `void` | Fired when the FAB is clicked |
| `menu-click` | `void` | Fired when the menu button is clicked |

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--rail-width` | `80px` (collapsed) / `240px` (expanded) | Fixed width of the rail |
| `--rail-width-mobile` | `56px` (collapsed) / `200px` (expanded) | Width on mobile devices |

### CSS Parts

| Part | Description |
|------|-------------|
| `rail` | The main rail container |
| `header` | The header section containing FAB and menu |
| `nav` | The navigation items container |
| `footer` | The footer section |

### Methods

| Method | Description |
|--------|-------------|
| `expand()` | Programmatically expand the navigation rail |
| `collapse()` | Programmatically collapse the navigation rail |
| `toggle()` | Toggle between expanded and collapsed states |

## Navigation Rail Item Component

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `icon` | `string` | `''` | Material Symbols icon name |
| `label` | `string` | `''` | Label text for the navigation item |
| `value` | `string` | `''` | Value associated with this item (useful for routing) |
| `active` | `boolean` | `false` | Whether this item is currently active/selected |
| `selected` | `boolean` | `false` | Alias for `active` property |
| `badge` | `string` | `''` | Badge text or number to display |
| `badgeVariant` | `'error' \| 'primary' \| 'secondary'` | `'error'` | Badge color variant |
| `showLabel` | `boolean` | `false` | Whether to show the label (controlled by parent rail) |
| `disabled` | `boolean` | `false` | Whether this item is disabled |
| `nested` | `boolean` | `false` | Whether this is a nested sub-navigation item |
| `group` | `boolean` | `false` | Whether this item represents a group separator |

### Slots

| Slot | Description |
|------|-------------|
| `icon` | Custom icon content (e.g., `<schmancy-icon>`) |
| `badge` | Custom badge content |
| (default) | Custom content that replaces the entire item |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `navigate` | `string` | Fired when the item is clicked, detail contains the value |

### CSS Custom Properties

Navigation rail items use the Schmancy design token system and do not expose custom properties for theming.

### CSS Parts

| Part | Description |
|------|-------------|
| `container` | The main item container |
| `indicator` | The active indicator behind the icon |
| `icon` | The icon container |
| `icon-text` | The icon text element |
| `label` | The label text |
| `badge` | The badge element |

## Examples

### With FAB and Menu Button

```html
<schmancy-navigation-rail
  activeIndex="0"
  labelVisibility="selected"
  @navigate=${this.handleNavigation}
  @fab-click=${this.handleFabClick}
  @menu-click=${this.handleMenuClick}
>
  <!-- Floating Action Button -->
  <schmancy-button
    slot="fab"
    variant="filled"
    aria-label="Compose"
  >
    <schmancy-icon>edit</schmancy-icon>
  </schmancy-button>

  <!-- Menu Button -->
  <schmancy-button
    slot="menu"
    variant="text"
    aria-label="Menu"
  >
    <schmancy-icon>menu</schmancy-icon>
  </schmancy-button>

  <!-- Navigation Items -->
  <schmancy-navigation-rail-item
    icon="inbox"
    label="Inbox"
    value="/inbox"
    badge="12"
  ></schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item
    icon="send"
    label="Sent"
    value="/sent"
  ></schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item
    icon="drafts"
    label="Drafts"
    value="/drafts"
    badge="3"
    badgeVariant="secondary"
  ></schmancy-navigation-rail-item>
</schmancy-navigation-rail>
```

### With Groups and Dividers

```html
<schmancy-navigation-rail activeValue="dashboard">
  <!-- Primary Navigation -->
  <schmancy-navigation-rail-item
    icon="dashboard"
    label="Dashboard"
    value="dashboard"
  ></schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item
    icon="analytics"
    label="Analytics"
    value="analytics"
  ></schmancy-navigation-rail-item>

  <!-- Divider -->
  <schmancy-divider></schmancy-divider>

  <!-- Secondary Navigation -->
  <schmancy-navigation-rail-item
    icon="folder"
    label="Files"
    value="files"
  ></schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item
    icon="people"
    label="Team"
    value="team"
  ></schmancy-navigation-rail-item>

  <!-- Footer Items -->
  <div slot="footer">
    <schmancy-navigation-rail-item
      icon="settings"
      label="Settings"
      value="settings"
    ></schmancy-navigation-rail-item>

    <schmancy-navigation-rail-item
      icon="account_circle"
      label="Profile"
      value="profile"
    ></schmancy-navigation-rail-item>
  </div>
</schmancy-navigation-rail>
```

### Rail with Custom Icons

```html
<schmancy-navigation-rail
  labelVisibility="selected"
  showTooltips
>
  <schmancy-navigation-rail-item label="Home">
    <schmancy-icon slot="icon" fill="1">home</schmancy-icon>
  </schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item label="Explore">
    <schmancy-icon slot="icon" variant="rounded">explore</schmancy-icon>
  </schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item label="Notifications" badge="New">
    <schmancy-icon slot="icon" weight="600">notifications</schmancy-icon>
  </schmancy-navigation-rail-item>
</schmancy-navigation-rail>
```

### Fullscreen Mode Support

The navigation rail automatically hides in fullscreen mode when triggered via the theme service:

```typescript
import { schmancyTheme } from '@schmancy/theme';

// Enter fullscreen mode (hides navigation rail)
schmancyTheme.next({ fullscreen: true });

// Exit fullscreen mode (shows navigation rail)
schmancyTheme.next({ fullscreen: false });

// Toggle fullscreen mode
schmancyTheme.toggleFullscreen();
```

### Programmatic Control

```typescript
import { SchmancyNavigationRail } from '@schmancy/navigation-rail'

class MyApp extends LitElement {
  @query('schmancy-navigation-rail')
  navigationRail!: SchmancyNavigationRail

  // Select by index
  selectHome() {
    this.navigationRail.activeIndex = 0
  }

  // Select by value
  selectByRoute(route: string) {
    this.navigationRail.activeValue = route
  }

  // Handle navigation
  handleNavigate(event: CustomEvent<string>) {
    const value = event.detail
    console.log(`Navigated to: ${value}`)

    // Update route
    this.router.navigate(value)
  }

  // Expand/collapse rail
  expandRail() {
    this.navigationRail.expand()
  }

  collapseRail() {
    this.navigationRail.collapse()
  }

  toggleRail() {
    this.navigationRail.toggle()
  }

  // Change label visibility programmatically
  toggleLabels() {
    this.navigationRail.labelVisibility =
      this.navigationRail.labelVisibility === 'all' ? 'none' : 'all'
  }

  render() {
    return html`
      <schmancy-navigation-rail
        @navigate=${this.handleNavigationChange}
      >
        <!-- items -->
      </schmancy-navigation-rail>
    `
  }
}
```

### With Expanded State

```html
<schmancy-navigation-rail
  expanded
  activeIndex="0"
>
  <schmancy-button slot="menu" variant="text" @click=${this.toggleRail}>
    <schmancy-icon>menu</schmancy-icon>
  </schmancy-button>

  <schmancy-navigation-rail-item
    icon="home"
    label="Home"
    value="/home"
  ></schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item
    icon="dashboard"
    label="Dashboard"
    value="/dashboard"
  ></schmancy-navigation-rail-item>

  <schmancy-navigation-rail-item
    icon="analytics"
    label="Analytics"
    value="/analytics"
  ></schmancy-navigation-rail-item>
</schmancy-navigation-rail>

<script>
  function toggleRail() {
    const rail = document.querySelector('schmancy-navigation-rail')
    rail.toggle()
  }
</script>
```

### With Fullscreen Mode Support

```typescript
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('my-app')
class MyApp extends LitElement {
  @state() private fullScreen = false

  handleFullscreenToggle() {
    this.fullScreen = !this.fullScreen
  }

  handleVisibilityChange(e: CustomEvent) {
    console.log(`Navigation rail is ${e.detail.hidden ? 'hidden' : 'visible'}`)
  }

  render() {
    return html`
      <schmancy-nav-drawer .fullscreen=${this.fullScreen}>
        <!-- Navigation rail hides automatically in fullscreen mode -->
        <schmancy-navigation-rail
          .hidden=${this.fullScreen}
          activeIndex="0"
          @visibility-change=${this.handleVisibilityChange}
        >
          <schmancy-navigation-rail-item
            icon="home"
            label="Home"
          ></schmancy-navigation-rail-item>

          <schmancy-navigation-rail-item
            icon="search"
            label="Search"
          ></schmancy-navigation-rail-item>

          <schmancy-navigation-rail-item
            icon="settings"
            label="Settings"
          ></schmancy-navigation-rail-item>
        </schmancy-navigation-rail>

        <main>
          <button @click=${this.handleFullscreenToggle}>
            ${this.fullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </button>
          <!-- Main content here -->
        </main>
      </schmancy-nav-drawer>
    `
  }
}
```

### With Router Integration

```typescript
import { Router } from '@vaadin/router'

class AppShell extends LitElement {
  @state() currentRoute = '/'

  firstUpdated() {
    // Listen to router changes
    window.addEventListener('vaadin-router-location-changed', (e) => {
      this.currentRoute = e.detail.location.pathname
    })
  }

  handleNavigation(event: CustomEvent<string>) {
    Router.go(event.detail)
  }

  render() {
    return html`
      <schmancy-navigation-rail
        .activeValue=${this.currentRoute}
        @navigate=${this.handleNavigation}
        labelVisibility="selected"
      >
        <schmancy-navigation-rail-item
          icon="home"
          label="Home"
          value="/"
        ></schmancy-navigation-rail-item>

        <schmancy-navigation-rail-item
          icon="dashboard"
          label="Dashboard"
          value="/dashboard"
        ></schmancy-navigation-rail-item>

        <schmancy-navigation-rail-item
          icon="settings"
          label="Settings"
          value="/settings"
        ></schmancy-navigation-rail-item>
      </schmancy-navigation-rail>

      <main>
        <slot></slot> <!-- Router outlet -->
      </main>
    `
  }
}
```

## Accessibility

The navigation rail components are fully accessible:

- **ARIA Roles**: Navigation container has `role="navigation"`, items have `role="listitem"`
- **Keyboard Navigation**:
  - `ArrowUp/ArrowDown` - Navigate between items
  - `Home/End` - Jump to first/last item
  - `Enter/Space` - Select focused item
  - `Tab` - Move focus in/out of rail
- **Screen Readers**: Proper ARIA labels and live regions
- **Focus Management**: Clear focus indicators and proper tab order
- **High Contrast**: Supports Windows High Contrast Mode

## Responsive Behavior

The navigation rail adapts to different screen sizes:

- **Desktop** (>1024px): Full 80px width, shows all features
- **Tablet** (768-1024px): Reduced padding, optional label visibility
- **Mobile** (<768px): Collapses to 56px, icons only
- **Landscape Phone**: Reduced vertical spacing

## Theming

The navigation rail uses Schmancy design tokens:

```css
/* Custom theming */
schmancy-navigation-rail {
  /* Colors - Surface and backgrounds */
  --schmancy-sys-color-surface-default: #ffffff;
  --schmancy-sys-color-surface-on: #1c1b1f;
  --schmancy-sys-color-surface-containerHighest: #e6e0e9;

  /* Colors - Active state */
  --schmancy-sys-color-secondary-container: #e8def8;
  --schmancy-sys-color-secondary-onContainer: #1d192b;

  /* Colors - Inactive state */
  --schmancy-sys-color-surface-onVariant: #49454f;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  schmancy-navigation-rail {
    --schmancy-sys-color-surface-default: #1c1b1f;
    --schmancy-sys-color-surface-on: #e6e0e9;
    --schmancy-sys-color-surface-containerHighest: #36343b;
    --schmancy-sys-color-secondary-container: #4a4458;
    --schmancy-sys-color-secondary-onContainer: #e8def8;
    --schmancy-sys-color-surface-onVariant: #cac4d0;
  }
}
```

## Best Practices

1. **Item Count**: Use 3-7 primary destinations for optimal usability
2. **Icons**: Use clear, recognizable Material Symbols icons
3. **Labels**: Keep labels short and descriptive (1-2 words)
4. **Hierarchy**: Place most important items at the top
5. **Badges**: Use sparingly for important notifications
6. **FAB**: Only include if there's a clear primary action
7. **Label Visibility**:
   - Use `'selected'` for most cases to save space
   - Use `'all'` for better discoverability
   - Use `'none'` with tooltips for maximum space efficiency
   - In expanded state, labels are always shown regardless of setting
8. **Expanded State**: Use expanded rail for applications that need more descriptive labels or additional information
9. **Mobile**: Consider using bottom navigation bar on mobile instead

## Migration Guide

### From Navigation Drawer

```html
<!-- Before: Navigation Drawer -->
<schmancy-nav-drawer>
  <div slot="header">App Name</div>
  <schmancy-list>
    <schmancy-list-item>Home</schmancy-list-item>
  </schmancy-list>
</schmancy-nav-drawer>

<!-- After: Navigation Rail -->
<schmancy-navigation-rail>
  <div slot="header">
    <schmancy-icon>logo</schmancy-icon>
  </div>
  <schmancy-navigation-rail-item
    icon="home"
    label="Home"
  ></schmancy-navigation-rail-item>
</schmancy-navigation-rail>
```

### From Tab Bar

```html
<!-- Before: Tab Bar -->
<schmancy-tabs>
  <schmancy-tab>Home</schmancy-tab>
  <schmancy-tab>Search</schmancy-tab>
</schmancy-tabs>

<!-- After: Navigation Rail -->
<schmancy-navigation-rail labelVisibility="always">
  <schmancy-navigation-rail-item
    icon="home"
    label="Home"
  ></schmancy-navigation-rail-item>
  <schmancy-navigation-rail-item
    icon="search"
    label="Search"
  ></schmancy-navigation-rail-item>
</schmancy-navigation-rail>
```

## Performance Considerations

- **Lazy Loading**: Navigation rail supports lazy loading of route components
- **Virtual Scrolling**: Automatically enabled for rails with many items
- **CSS Containment**: Uses CSS containment for optimal rendering
- **Event Delegation**: Efficient event handling for all items

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Related Components

- `schmancy-navigation-bar` - Bottom navigation for mobile
- `schmancy-nav-drawer` - Full navigation drawer
- `schmancy-tabs` - Horizontal tab navigation
- `schmancy-button` - For FAB and menu buttons
- `schmancy-icon` - For navigation icons