# Content Drawer

Responsive sliding panel that switches between push mode (desktop) and overlay mode (mobile).

## Service API

```typescript
import { schmancyContentDrawer } from '@schmancy/content-drawer'
```

### `push(options)`

Push a component to the drawer. Automatically resolves different component types.

**Parameters:**

- `options: ComponentType | DrawerPushOptions`

**ComponentType formats:**

- `string` - HTML tag name (e.g., `'demo-button'`)
- `HTMLElement` - Component instance (e.g., `new MyComponent()`)
- `() => HTMLElement` - Factory function
- `() => Promise<{default: any}>` - Async import

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

// With options object (recommended)
schmancyContentDrawer.push({
  component: new UserDetail(),
  props: { userId: '123' }
})

// Factory function
schmancyContentDrawer.push(() => new MyComponent())

// Async import
schmancyContentDrawer.push(() => import('./my-component'))
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

## Example

```typescript
html`
  <schmancy-content-drawer>
    <schmancy-content-drawer-main>
      <schmancy-list>
        ${items.map(item => html`
          <schmancy-list-item @click=${() => {
            schmancyContentDrawer.push({
              component: new ItemDetail(),
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
