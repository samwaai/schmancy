# Schmancy Area - Routing System

Reactive routing system for web components using RxJS. Supports multiple outlets, guards, lazy loading, and nested routing.

## Quick Start

```html
<!-- Define routes declaratively -->
<schmancy-area name="main" default="home-page">
  <schmancy-route when="products" component="product-list"></schmancy-route>
  <schmancy-route when="about" component="about-page"></schmancy-route>
  <schmancy-route
    when="admin"
    component="admin-panel"
    .guard=${authState$.asObservable()}
    @redirect=${() => area.push({ component: 'login', area: 'main' })}>
  </schmancy-route>
</schmancy-area>
```

```typescript
// Navigate programmatically
import { area } from '@schmancy/area';

area.push({
  component: 'product-detail',
  area: 'main',
  params: { productId: '123' },
  state: { fromCart: true }
});
```

## Core Components

### `<schmancy-area>` - Router Outlet
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✓ | Unique outlet identifier |
| `default` | `ComponentType` | | Fallback when no route matches |

### `<schmancy-route>` - Route Definition
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `when` | `string` | ✓ | URL segment or component tag to match |
| `component` | `RouteComponent` | ✓ | Component to render |
| `guard` | `Observable<boolean>` | | Navigation guard |
| `exact` | `boolean` | | Currently unused |

## URL Matching

Routes match in DOM order. First match wins.

```html
<!-- Matches URL segments -->
<schmancy-route when="products" component="product-list"></schmancy-route>
<!-- URL: /store/products → segments: ['store', 'products'] → MATCHES -->

<!-- Matches component tag for programmatic nav -->
<schmancy-route when="user-profile" component="user-profile"></schmancy-route>
<!-- area.push({ component: 'user-profile', area: 'main' }) → MATCHES -->
```

## Navigation Guards

Guards are `Observable<boolean>` that emit true to allow, false to block navigation.

```typescript
// Simple guard
const authState$ = new BehaviorSubject(false);

<schmancy-route
  when="protected"
  component="protected-page"
  .guard=${authState$.asObservable()}
  @redirect=${(e) => {
    // e.detail contains: blockedRoute, area, params, state
    $notify.error('Access denied');
    area.push({ component: 'login', area: 'main' });
  }}>
</schmancy-route>

// Complex guard with multiple conditions
const canAccess$ = combineLatest([authState$, roleState$]).pipe(
  map(([auth, role]) => auth && role === 'admin')
);
```

**Important**: Guards return `Observable<boolean>` only. No strings, objects, or redirect paths.
Handle redirects via `@redirect` event.

## Service API

```typescript
import { area } from '@schmancy/area';

// Navigation
area.push({
  component: string | Constructor | HTMLElement | LazyComponent,
  area: string,                          // Required
  state?: any,                          // Stored in history
  params?: any,                         // Applied to component
  props?: any,                          // Alias for params
  historyStrategy?: 'push' | 'replace' | 'silent',
  clearQueryParams?: string[] | boolean
});

// Clear area
area.pop('sidebar');

// Subscriptions (return Observables)
area.on(areaName)                      // Subscribe to route changes
area.getState<T>(areaName)            // Get typed state
area.params<T>(areaName)              // Get typed params

// Configuration
area.prettyURL = false                 // JSON-encoded URLs (default)
area.enableHistoryMode = true          // Browser history (default)
```

## Lazy Loading

```typescript
import { lazy } from '@schmancy/area';

// Define lazy components
const LazyDashboard = lazy(() => import('./dashboard'));

// Use in routes
<schmancy-route
  when="dashboard"
  .component=${LazyDashboard}>
</schmancy-route>

// Preload on hover
button.addEventListener('mouseenter', () => {
  LazyDashboard.preload();
});

// Navigate
area.push({ component: LazyDashboard, area: 'main' });
```

## Nested Routing

```html
<schmancy-area name="main">
  <schmancy-route when="app" component="app-layout">
    <!-- Inside app-layout component -->
    <schmancy-area name="app-content">
      <schmancy-route when="users" component="user-list"></schmancy-route>
      <schmancy-route when="settings" component="settings"></schmancy-route>
    </schmancy-area>
  </schmancy-route>
</schmancy-area>
```

## Common Patterns

### Protected Routes with Authentication

```typescript
@customElement('app-shell')
export class AppShell extends $LitElement() {
  private authState$ = new BehaviorSubject(false);

  render() {
    return html`
      <schmancy-area name="main">
        <schmancy-route when="home" component="home-page"></schmancy-route>

        <schmancy-route
          when="dashboard"
          component="dashboard"
          .guard=${this.authState$.asObservable()}
          @redirect=${() => {
            area.push({ component: 'login', area: 'main' });
          }}>
        </schmancy-route>
      </schmancy-area>
    `;
  }
}
```

### Multi-Area Application

```html
<!-- Multiple independent outlets -->
<div class="layout">
  <schmancy-area name="sidebar" default="nav-menu"></schmancy-area>
  <schmancy-area name="main" default="home"></schmancy-area>
  <schmancy-area name="modal"></schmancy-area>
</div>
```

```typescript
// Navigate different areas independently
area.push({ component: 'user-list', area: 'main' });
area.push({ component: 'quick-stats', area: 'sidebar' });
area.push({ component: 'edit-dialog', area: 'modal' });

// Clear modal
area.pop('modal');
```

## Type Definitions

```typescript
// Navigation request
interface RouteAction {
  component: ComponentType;
  area: string;
  state?: Record<string, any>;
  params?: Record<string, any>;
  props?: Record<string, any>;  // Alias for params
  historyStrategy?: 'push' | 'replace' | 'silent';
  clearQueryParams?: string[] | boolean;
}

// Guard type
type ObservableGuardResult = Observable<boolean>;

// Component types
type RouteComponent =
  | string                                           // Tag name
  | CustomElementConstructor                        // Class
  | HTMLElement                                     // Instance
  | (() => Promise<{ default: Constructor }>)      // Lazy

// Redirect event detail
interface RedirectEventDetail {
  blockedRoute: string;
  area: string;
  params: Record<string, any>;
  state: Record<string, any>;
}
```

## Internal Behavior

### Route Resolution Pipeline
1. Receives navigation request (programmatic, URL, or browser)
2. Resolves lazy components to constructors
3. Deduplicates identical routes
4. Evaluates guard Observable
5. Creates element and applies properties
6. Swaps components with 150ms fade animation

### Route Evaluation Order
- Routes evaluated in DOM order
- First matching route wins
- Empty `when=""` acts as catch-all

### History Management
- JSON-encoded URLs by default: `/%7B%22main%22%3A%7B%22component%22%3A%22home%22%7D%7D`
- Pretty URLs optional: `/products?id=123`
- State stored in `history.state.schmancyAreas`

## Troubleshooting

**Routes not matching**
- Check route order (specific before general)
- Verify `when` matches URL segment or component tag

**Guards not working**
- Must be `Observable<boolean>`, not functions
- Use `.asObservable()` on BehaviorSubjects
- Handle redirects in `@redirect` event

**Nested routes failing**
- Each area needs unique name
- Parent must render child `<schmancy-area>`

**area.pop() not clearing**
- Verify area name is correct
- Check no immediate re-navigation

## Related Components

- **[Store](./store.md)** - State management
- **[Sheet](./sheet.md)** - Modal overlays
- **[Layout](./layout.md)** - Responsive layouts