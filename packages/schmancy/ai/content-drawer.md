# Content Drawer

Responsive sliding panel that switches between push mode (desktop) and overlay mode (mobile).

## Service API

```typescript
import { schmancyContentDrawer } from '@schmancy/content-drawer'
```

### `push(options)`

Push a component to the drawer. Component types are passed directly to the area router - no resolution happens in the drawer service.

**Parameters:**

- `options: ComponentType | DrawerPushOptions`

**ComponentType formats (matches area router API):**

- `string` - HTML tag name (e.g., `'demo-button'`)
- `HTMLElement` - Component instance (e.g., `new MyComponent()`)
- `CustomElementConstructor` - Component class (e.g., `UserDetails`)
- `LazyComponent<any>` - Lazy import (e.g., `lazy(() => import('./my-component'))`)

**DrawerPushOptions object:**

```typescript
{
  component: ComponentType
  props?: Record<string, unknown>    // Properties to set on component
  state?: Record<string, unknown>    // Router state (push mode only)
  params?: Record<string, unknown>   // Router params (push mode only)
}
```

**Usage:**

```typescript
// String tag
schmancyContentDrawer.push('demo-button')

// HTMLElement instance
schmancyContentDrawer.push(new UserDetail())

// Component class (constructor)
schmancyContentDrawer.push(UserDetails)

// With options object (recommended)
schmancyContentDrawer.push({
  component: UserDetails,
  props: { userId: '123' }
})

// Lazy import
import { lazy } from '@schmancy/area'
schmancyContentDrawer.push(lazy(() => import('./my-component')))
```

### `render(ref, component, title?)`

Lower-level API for rendering. Use `push()` instead for most cases.

**Parameters:**

- `ref: Element | Window` - Element to dispatch events from
- `component: HTMLElement` - Component instance
- `title?: string` - Optional title

```typescript
schmancyContentDrawer.render(window, new UserDetail(), 'User Details')
```

### `dimiss(ref)`

Closes the drawer. *Note: typo in actual API*

```typescript
schmancyContentDrawer.dimiss(window)
```

## Component Structure

```html
<schmancy-content-drawer>
  <schmancy-content-drawer-main>
    <!-- Main content area -->
  </schmancy-content-drawer-main>

  <schmancy-content-drawer-sheet>
    <section slot="placeholder">
      <!-- Empty state content -->
    </section>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

## Properties

- `minWidth: {main: number, sheet: number}` - Minimum widths (default: `{main: 360, sheet: 576}`)
- `open: 'open' | 'close'` - Auto-managed based on mode
- `mode: 'push' | 'overlay'` - Auto-switches at 936px breakpoint

## How It Works

The drawer service is a simple passthrough to the area router:

1. **Push mode (desktop)**: Calls `area.push()` with your component
2. **Overlay mode (mobile)**: Calls `sheet.open()` with your component

Component resolution is handled entirely by the area router - the drawer service just dispatches events.

## Example

```typescript
html`
  <schmancy-content-drawer>
    <schmancy-content-drawer-main>
      <schmancy-list>
        ${items.map(item => html`
          <schmancy-list-item @click=${() => {
            // Pass component class directly - area router handles instantiation
            schmancyContentDrawer.push({
              component: ItemDetail,
              props: { item }
            })
          }}>
            ${item.name}
          </schmancy-list-item>
        `)}
      </schmancy-list>
    </schmancy-content-drawer-main>

    <schmancy-content-drawer-sheet>
      <section slot="placeholder">Select an item</section>
    </schmancy-content-drawer-sheet>
  </schmancy-content-drawer>
`
```
