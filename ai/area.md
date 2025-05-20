# Schmancy Area

Schmancy Area is a lightweight, reactive routing and state management system for web components with RxJS integration.

## Component Usage

```html
<!-- Basic router outlet -->
<schmancy-area 
  name="main"
  default="home-component">
</schmancy-area>
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | **Required**. Unique identifier for this router outlet. |
| `default` | `string \| Promise<NodeModule> \| CustomElementConstructor \| TemplateResult` | Default component to display if none is specified. |

## Service API

```ts
// Import the area service
import { area } from '@schmancy/area';

// Navigation methods
area.push({
  component: 'user-profile',      // Component constructor, string tag name, or element instance
  area: 'main',                   // Target area name
  state?: { view: 'profile' },    // Optional state object
  params?: { id: '123' },         // Optional parameters
  historyStrategy: 'push',        // 'push', 'replace', 'pop', 'silent'
  clearQueryParams?: ['sort']     // Clear specific query params
});

area.pop('sidebar');              // Remove an area

// Subscription methods (return RxJS Observables)
area.on(areaName, skipCurrent?)   // Subscribe to an area
area.all(skipCurrent?)            // Subscribe to all areas 
area.getState<T>(areaName)        // Get typed state from an area
area.params<T>(areaName)          // Get typed params from an area
area.param<T>(areaName, key)      // Get a specific param value
```

## Examples

### Basic Navigation

```ts
// Navigate to a component
area.push({
  component: 'home-page',
  area: 'main'
});

// Navigate with parameters and state
area.push({
  component: ProductDetailComponent,
  area: 'main',
  params: { productId: '12345' },
  state: { showReviews: true },
  historyStrategy: 'push'
});
```

### Multiple Independent Areas

```ts
// Update multiple areas independently
area.push({ component: 'product-list', area: 'main' });
area.push({ component: 'filter-panel', area: 'sidebar' });

// Open a modal dialog
area.push({ 
  component: 'dialog-component', 
  area: 'modal',
  params: { id: '123' }
});

// Close a modal
area.pop('modal');
```

### Reactive Subscriptions

```ts
// Subscribe to area changes
area.on('main').subscribe(route => {
  console.log(`Component: ${route.component}`);
  console.log(`Params:`, route.params);
});

// Type-safe state and params
interface UserState { name: string; role: string; }
interface UserParams { id: string; tab?: string; }

area.getState<UserState>('user').subscribe(state => {
  updateUserInfo(state.name, state.role);
});

area.params<UserParams>('user').subscribe(params => {
  fetchUser(params.id);
  setActiveTab(params.tab || 'profile');
});

// Get a specific parameter
area.param<string>('product', 'productId').subscribe(id => {
  fetchProductDetails(id);
});
```

### DOM Events

Areas also dispatch DOM events for non-RxJS consumers:

```js
// Format: schmancy-area-${areaName}-changed
window.addEventListener('schmancy-area-main-changed', event => {
  const { component, params, state } = event.detail;
  updateUI(component, params, state);
});
```

## Advanced Usage

### Lazy Loading Components

```ts
area.push({
  component: import('./components/heavy-dashboard.js'),
  area: 'main'
});
```

### Navigation Guards

```ts
import { switchMap, EMPTY, of } from 'rxjs';

area.on('protected-area').pipe(
  switchMap(route => {
    if (!isAuthenticated()) {
      area.push({ component: 'login-page', area: 'main' });
      return EMPTY;
    }
    return of(route);
  })
).subscribe(handleProtectedRoute);
```

## Related Components

- **[Store](./store.md)** - For more complex state management
- **[Layout](./layout.md)** - For responsive layouts
- **[Teleport](./teleport.md)** - For advanced component transportation
- **[Sheet](./sheet.md)** - For modal overlays

## Type Definitions

```ts
// Route Action - used for navigation
interface RouteAction {
  component: CustomElementConstructor | string | HTMLElement | Promise<NodeModule>;
  area: string;
  state?: Record<string, unknown>;
  params?: Record<string, unknown>;
  historyStrategy?: 'push' | 'replace' | 'pop' | 'silent';
  clearQueryParams?: string[] | null;
}

// Active Route - current state of an area
interface ActiveRoute {
  component: string;
  area: string;
  state?: Record<string, unknown>;
  params?: Record<string, unknown>;
}
```