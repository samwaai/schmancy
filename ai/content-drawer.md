# Content Drawer

Responsive sliding panel that automatically switches between push and overlay modes based on screen size.

## Overview

The content drawer provides a responsive panel system that adapts to different screen sizes:
- **Large screens**: Panel pushes content aside (push mode)
- **Small screens**: Panel overlays content (overlay mode)
- **Automatic switching**: Responds to screen width changes

## Components

```js
// Main container that manages responsive behavior
<schmancy-content-drawer
  ?open="${boolean}"           // Controls drawer visibility (auto-managed)
  .minWidth="${{main: 360, sheet: 576}}"  // Min widths for main and sheet
>
  <schmancy-content-drawer-main
    minWidth="${number}"        // Minimum width for main content (default: 360px)
  >
    // Main content area
  </schmancy-content-drawer-main>

  <schmancy-content-drawer-sheet
    minWidth="${number}"        // Minimum width for sheet (default: 576px)
  >
    <section slot="placeholder">
      // Optional placeholder content when sheet is empty
    </section>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

## Responsive Behavior

The drawer automatically switches between modes based on viewport width:
- **Push mode**: When `viewport >= main.minWidth + sheet.minWidth`
  - Sheet panel appears inline beside main content
  - Content is pushed to make room for the sheet
  - Sheet remains visible
- **Overlay mode**: When `viewport < main.minWidth + sheet.minWidth`
  - Sheet overlays on top of main content
  - Opens/closes via the service API
  - Shows as a modal sheet

## Service API

```js
import { schmancyContentDrawer } from '@schmancy/content-drawer'

// Push API - Recommended for dynamic content rendering
schmancyContentDrawer.push(component)
// component can be:
// - string: 'demo-button' (HTML tag name)
// - HTMLElement: new DemoButton() (component instance)
// - Factory: () => new DemoButton() (factory function)
// - Async: async () => import('./button').then(m => new m.default())

// Legacy render API (for backward compatibility)
schmancyContentDrawer.render(ref, component, title?)

// Dismiss drawer (note: method has typo in implementation)
schmancyContentDrawer.dimiss(ref)
```

### Push API Features

The `push` API automatically handles re-rendering when the same component instance is pushed with updated properties:

```js
// Create a component instance
const myComponent = new MyComponent()
myComponent.variant = 'filled'

// Push it to drawer
schmancyContentDrawer.push(myComponent)

// Later, update properties and push again
myComponent.variant = 'outlined'
schmancyContentDrawer.push(myComponent) // Automatically re-renders with new properties
```

## Examples

### 1. Basic Responsive Drawer

```html
<schmancy-content-drawer>
  <schmancy-content-drawer-main>
    <schmancy-list class="p-0">
      <schmancy-list-item @click=${() => {
        schmancyContentDrawer.push('demo-button')
      }}>
        Show Button Demo
      </schmancy-list-item>
      <schmancy-list-item @click=${() => {
        schmancyContentDrawer.push(new TypographyDemo())
      }}>
        Show Typography Demo
      </schmancy-list-item>
    </schmancy-list>
  </schmancy-content-drawer-main>

  <schmancy-content-drawer-sheet class="px-4">
    <section slot="placeholder">
      <schmancy-typography>Select an item to view</schmancy-typography>
    </section>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

### 2. Using Different Push API Patterns

```js
// String tag name
schmancyContentDrawer.push('demo-button')

// Component instance
const button = new DemoButton()
button.variant = 'filled'
schmancyContentDrawer.push(button)

// Factory function with custom setup
schmancyContentDrawer.push(() => {
  const comp = new MyComponent()
  comp.setAttribute('theme', 'dark')
  return comp
})

// Async module loading
schmancyContentDrawer.push(async () => {
  const module = await import('./lazy-component')
  return new module.default()
})
```

### 3. Configuring Minimum Widths

```html
<schmancy-content-drawer>
  <!-- Main content requires at least 400px -->
  <schmancy-content-drawer-main minWidth="400">
    <div>Main application content</div>
  </schmancy-content-drawer-main>

  <!-- Sheet requires at least 600px -->
  <schmancy-content-drawer-sheet minWidth="600">
    <div>Detail panel content</div>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

## Integration with Schmancy Systems

The content drawer integrates with:
- **Area router**: In push mode, uses `schmancy-area` for content routing
- **Sheet system**: In overlay mode, uses the schmancy sheet for modal presentation
- **Grid system**: Uses `schmancy-grid` for responsive layout

## CSS Styling

The component uses standard Tailwind classes for styling:
- Main container uses `overflow-scroll` for scrollable content
- Sheet positioning handled automatically based on mode
- Animations use Web Animations API (500ms duration)

## Common Patterns

**Master-Detail View**: List of items in main, details in sheet
```js
// In main area - list of items
<schmancy-list-item @click=${() => {
  schmancyContentDrawer.push(new ItemDetail(item))
}}>
  ${item.name}
</schmancy-list-item>
```

**Settings Panel**: Configuration options in the sheet
```js
// Push settings component
schmancyContentDrawer.push(new SettingsPanel())
```

**Navigation Drawer**: Navigation links in main, content in sheet
```js
// Navigation item clicks update sheet content
schmancyContentDrawer.push(() => import(`./pages/${page}`))
```

## Related Components

- [Sheet](./sheet.md) - Modal sheet component used in overlay mode
- [Area](./area.md) - Routing system used in push mode
- [Grid](./grid.md) - Layout system for responsive design
- [List](./list.md) - List component for navigation items