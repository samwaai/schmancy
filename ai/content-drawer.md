# Content Drawer

Sliding panel system for navigation, overlays, and responsive layouts.

## Components

```js
// Main container that manages drawer behavior
<schmancy-content-drawer
  ?open="${boolean}"           // Controls drawer visibility
  position="left|right|top|bottom"  // Drawer position (default: left)
  variant="standard|modal|persistent"  // Behavior type
  breakpoint="1024px"          // Responsive breakpoint
  ?backdrop="${boolean}"       // Show backdrop when open
>
  <schmancy-content-drawer-main>
    // Main content that shifts when drawer opens
  </schmancy-content-drawer-main>
  
  <schmancy-content-drawer-sheet
    width="256px"              // Width for left/right drawers
    height="auto"              // Height for top/bottom drawers
    offset="0"                 // Offset for nested drawers
  >
    // Drawer content
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

## Service API

```js
import { schmancyContentDrawer } from '@schmancy/content-drawer'

// NEW: Push API - Renders component with automatic re-rendering support
schmancyContentDrawer.push(component)
// component can be:
// - string: 'demo-button' (tag name)
// - HTMLElement: new DemoButton()
// - Factory: () => new DemoButton()
// - Async: () => import('./button').then(m => new m.default())

// Legacy render API (backward compatible)
schmancyContentDrawer.render(ref, component, title?)

// Dismiss drawer
schmancyContentDrawer.dimiss(ref)
```

### Push API Features

The `push` API solves the re-rendering issue when the same component instance is pushed with updated properties:

```js
// Create a component instance
const myComponent = new MyComponent()
myComponent.variant = 'filled'

// Push it to drawer
schmancyContentDrawer.push(myComponent)

// Later, update properties and push again
myComponent.variant = 'outlined'
schmancyContentDrawer.push(myComponent) // Automatically detects same instance and forces re-render
```

## Examples

### 1. Using Push API for Dynamic Content

```js
// Simple string component
schmancyContentDrawer.push('demo-typography')

// Component instance with properties
const button = new DemoButton()
button.variant = 'filled'
schmancyContentDrawer.push(button)

// Factory function for custom setup
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

### 2. Basic Navigation Drawer
```html
<schmancy-content-drawer ?open="${drawerOpen}">
  <schmancy-content-drawer-main>
    <button @click="${() => drawerOpen = !drawerOpen}">Menu</button>
    <main>App content</main>
  </schmancy-content-drawer-main>
  
  <schmancy-content-drawer-sheet width="280px">
    <nav>
      <a href="/home">Home</a>
      <a href="/about">About</a>
    </nav>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

### 2. Bottom Sheet
```html
<schmancy-content-drawer 
  ?open="${sheetOpen}"
  position="bottom"
  @drawer-closed="${() => sheetOpen = false}"
>
  <schmancy-content-drawer-main>
    <button @click="${() => sheetOpen = true}">Show Options</button>
  </schmancy-content-drawer-main>
  
  <schmancy-content-drawer-sheet height="auto" max-height="50vh">
    <div class="sheet-handle"></div>
    <h3>Select Option</h3>
    <schmancy-list>
      <schmancy-list-item>Option 1</schmancy-list-item>
      <schmancy-list-item>Option 2</schmancy-list-item>
    </schmancy-list>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

### 3. Persistent Sidebar
```js
// Responsive persistent drawer
const drawer = contentDrawerContext.create('sidebar')

// Auto-persist on large screens
const mediaQuery = window.matchMedia('(min-width: 1024px)')
drawer.setPersistent(mediaQuery.matches)
mediaQuery.addEventListener('change', e => drawer.setPersistent(e.matches))
```

```html
<schmancy-content-drawer
  .context="${drawer}"
  variant="persistent"
  breakpoint="1024px"
>
  <schmancy-content-drawer-main>
    <schmancy-app-bar>
      <schmancy-icon-button 
        icon="menu"
        @click="${() => drawer.toggle()}"
      ></schmancy-icon-button>
    </schmancy-app-bar>
    <main>Dashboard content</main>
  </schmancy-content-drawer-main>
  
  <schmancy-content-drawer-sheet width="240px">
    <aside>Sidebar content</aside>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

### 4. Nested Drawers
```js
const mainDrawer = contentDrawerContext.create('main')
const subDrawer = contentDrawerContext.create('sub')
```

```html
<schmancy-content-drawer .context="${mainDrawer}">
  <schmancy-content-drawer-main>
    <!-- Nested drawer container -->
    <schmancy-content-drawer .context="${subDrawer}">
      <schmancy-content-drawer-main>
        <button @click="${() => mainDrawer.open()}">Menu</button>
      </schmancy-content-drawer-main>
      
      <!-- Sub drawer -->
      <schmancy-content-drawer-sheet width="280px" offset="240px">
        <button @click="${() => subDrawer.close()}">Back</button>
        <div>Sub menu content</div>
      </schmancy-content-drawer-sheet>
    </schmancy-content-drawer>
  </schmancy-content-drawer-main>
  
  <!-- Main drawer -->
  <schmancy-content-drawer-sheet width="240px">
    <button @click="${() => subDrawer.open()}">Open Submenu</button>
    <div>Main menu content</div>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

## CSS Variables

```css
schmancy-content-drawer {
  --drawer-width: 256px;
  --drawer-background: var(--md-sys-color-surface);
  --drawer-shadow: 0 8px 10px -5px rgba(0,0,0,0.2);
  --drawer-transition-duration: 250ms;
  --drawer-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --backdrop-color: rgba(0, 0, 0, 0.5);
  --drawer-z-index: 200;
}
```

## Related Components

- [Sheet](./sheet.md) - Simpler sheet component for modals
- [Navigation Drawer](./nav-drawer.md) - Specialized navigation component
- [Dialog](./dialog.md) - Modal dialogs
- [Layout](./layout.md) - Layout utilities

## Common Patterns

**Command Palette**: Top drawer with search input
**Help Panel**: Right drawer with contextual help
**Mobile Menu**: Left drawer for navigation
**Action Sheet**: Bottom drawer for mobile actions
**Settings Panel**: Persistent right drawer