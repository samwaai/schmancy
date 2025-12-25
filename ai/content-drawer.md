# Content Drawer

Responsive master-detail layout that automatically switches between **push mode** (desktop side panel) and **overlay mode** (mobile bottom sheet).

## Quick Start

```typescript
import { schmancyContentDrawer } from '@schmancy/content-drawer'

// Push content to drawer - ALWAYS use props pattern
schmancyContentDrawer.push({
  component: ItemDetail,
  props: { itemId: '123' }
})
```

## Service API

```typescript
import { schmancyContentDrawer } from '@schmancy/content-drawer'
```

### `push(options)` - Recommended

Push a component to the drawer. Creates a fresh instance each time.

```typescript
interface DrawerPushOptions {
  component: ComponentType      // Component class, tag name, or lazy import
  props?: Record<string, unknown>    // Properties to set on component
  state?: Record<string, unknown>    // Router state (push mode only)
  params?: Record<string, unknown>   // Router params (push mode only)
}
```

**Usage:**

```typescript
// Component class with props (RECOMMENDED)
schmancyContentDrawer.push({
  component: UserDetails,
  props: { userId: '123' }
})

// String tag name
schmancyContentDrawer.push({
  component: 'user-details',
  props: { userId: '123' }
})

// Lazy import
import { lazy } from '@schmancy/area'
schmancyContentDrawer.push({
  component: lazy(() => import('./user-details')),
  props: { userId: '123' }
})
```

### `dimiss(ref)` - Close Drawer

Closes the drawer panel. Note: typo in actual API (`dimiss` not `dismiss`).

```typescript
schmancyContentDrawer.dimiss(window)
```

### `render(ref, component, title?)` - Low-level API

Lower-level API for manual control. Prefer `push()` for most cases.

```typescript
schmancyContentDrawer.render(window, new UserDetail(), 'User Details')
```

## Component Structure

```html
<schmancy-content-drawer>
  <!-- Main content (list/master view) -->
  <schmancy-content-drawer-main>
    <schmancy-list>
      ${items.map(item => html`
        <schmancy-list-item @click=${() => this.selectItem(item)}>
          ${item.name}
        </schmancy-list-item>
      `)}
    </schmancy-list>
  </schmancy-content-drawer-main>

  <!-- Detail panel (sheet view) -->
  <schmancy-content-drawer-sheet>
    <section slot="placeholder">
      <!-- Empty state when nothing selected -->
      <p>Select an item to view details</p>
    </section>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

## Properties

### `<schmancy-content-drawer>`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `minWidth` | `{main: number, sheet: number}` | `{main: 360, sheet: 576}` | Minimum widths for panels |
| `open` | `'open' \| 'close'` | Auto | Panel state (auto-managed) |
| `mode` | `'push' \| 'overlay'` | Auto | Display mode (auto-switches at breakpoint) |

### `<schmancy-content-drawer-sheet>`

| Property | Type | Description |
|----------|------|-------------|
| `minWidth` | `number` | Override sheet minimum width |

## How It Works

The drawer automatically switches modes based on available width:

| Mode | Breakpoint | Behavior |
|------|------------|----------|
| **Push** | >= 936px (main + sheet) | Side panel slides in, main content shrinks |
| **Overlay** | < 936px | Bottom sheet modal overlays content |

**Internal routing:**

- **Push mode**: Uses `area.push()` with `historyStrategy: 'silent'`
- **Overlay mode**: Uses `sheet.open()` as a modal

## Common Patterns

### Master-Detail List

```typescript
@customElement('my-list-page')
class MyListPage extends LitElement {
  @state() items: Item[] = []

  private selectItem(item: Item) {
    schmancyContentDrawer.push({
      component: ItemDetail,
      props: { itemId: item.id }
    })
  }

  render() {
    return html`
      <schmancy-content-drawer>
        <schmancy-content-drawer-main>
          <schmancy-list>
            ${repeat(this.items, i => i.id, item => html`
              <schmancy-list-item @click=${() => this.selectItem(item)}>
                ${item.name}
              </schmancy-list-item>
            `)}
          </schmancy-list>
        </schmancy-content-drawer-main>

        <schmancy-content-drawer-sheet>
          <section slot="placeholder" class="h-full flex items-center justify-center">
            <div class="text-center">
              <schmancy-icon class="text-6xl text-surface-300">list</schmancy-icon>
              <schmancy-typography>Select an item</schmancy-typography>
            </div>
          </section>
        </schmancy-content-drawer-sheet>
      </schmancy-content-drawer>
    `
  }
}
```

### With Custom Min Widths

```typescript
html`
  <schmancy-content-drawer .minWidth=${{ main: 400, sheet: 600 }}>
    <schmancy-content-drawer-main>...</schmancy-content-drawer-main>
    <schmancy-content-drawer-sheet .minWidth=${600}>...</schmancy-content-drawer-sheet>
  </schmancy-content-drawer>
`
```

## Important Notes

### Always Use `props` Pattern

**DO NOT** create component instances manually - use the `props` pattern:

```typescript
// WRONG - instance won't update on subsequent pushes
const viewer = new ItemDetail()
viewer.itemId = '123'
schmancyContentDrawer.push({ component: viewer })

// CORRECT - fresh instance created each time
schmancyContentDrawer.push({
  component: ItemDetail,
  props: { itemId: '123' }
})
```

### Subsequent Pushes

Each `push()` call replaces the current sheet content. The drawer creates a fresh component instance with the provided props.

### Placeholder Slot

The `placeholder` slot in `<schmancy-content-drawer-sheet>` shows when no content has been pushed. Use it for empty states.

### Layout Integration

The content drawer works best as a flex child:

```typescript
html`
  <section class="grid grid-rows-[auto_1fr]" ${fullHeight()}>
    <schmancy-nav-drawer-appbar>Header</schmancy-nav-drawer-appbar>
    <schmancy-content-drawer class="flex-1">
      ...
    </schmancy-content-drawer>
  </section>
`
```

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `schmancy-content-drawer-toggle` | `{ state: 'open' \| 'close' }` | Drawer open/close |
| `schmancy-content-drawer-render` | `{ component, props, state, params }` | Content render request |
| `schmancy-content-drawer-resize` | - | Triggers recalculation |
