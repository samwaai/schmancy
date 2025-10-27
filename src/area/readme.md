# Schmancy Area

A lightweight, reactive routing and state management system for web components.

## Overview

Schmancy Area simplifies client-side routing for web component applications by providing a seamless way to handle navigation, component loading, and state management with a minimal API.

```typescript
// Define router outlets in your template
<schmancy-area name="main" default="home-page"></schmancy-area>

// Navigate to a component
area.push({
  component: 'user-profile',
  area: 'main',
  params: { userId: '123' }
});

// Subscribe to changes
area.on('main').subscribe(route => {
  console.log(`Component: ${route.component}`);
});
```

## Installation

```bash
npm install @schmancy/area
```

## Basic Usage

### Define Router Areas

Place `<schmancy-area>` elements wherever you want dynamic components to render:

```html
<!-- Main content area -->
<schmancy-area name="main" default="home-page"></schmancy-area>

<!-- Optional additional areas -->
<schmancy-area name="sidebar"></schmancy-area>
<schmancy-area name="modal"></schmancy-area>
```

Each area is an independent router outlet that can display different components.

### Navigate Between Views

```typescript
import { area } from '@schmancy/area';

// Using a tag name
area.push({
  component: 'user-profile',
  area: 'main',
  params: { userId: '123' }
});

// Using a component constructor
area.push({
  component: UserProfileComponent,
  area: 'main',
  state: { view: 'details' }
});

// Using a component instance
const customElement = document.createElement('custom-element');
customElement.setAttribute('custom-attr', 'value');
area.push({
  component: customElement,
  area: 'main'
});

// Using a dynamic import (lazy-loading)
area.push({
  component: import('./components/heavy-dashboard.js'),
  area: 'main'
});
```

### Subscribe to Area Changes

The area service provides a reactive API for subscribing to navigation changes:

```typescript
// Subscribe to a specific area
area.on('main').subscribe(route => {
  console.log('Component:', route.component);
  console.log('Params:', route.params);
  console.log('State:', route.state);
});

// Monitor all active routes
area.all().subscribe(routes => {
  console.log('Active routes:', routes);
});
```

### Type-Safe State and Parameters

Use TypeScript generics for type safety:

```typescript
// Type-safe state
interface UserState {
  name: string;
  permissions: string[];
}

area.getState<UserState>('user').subscribe(state => {
  console.log(`User: ${state.name}`);
  console.log(`Permissions: ${state.permissions.join(', ')}`);
});

// Type-safe parameters
area.params<{ id: string }>('user').subscribe(params => {
  fetchUser(params.id);
});

// Get a specific parameter value
area.param<string>('user', 'id').subscribe(id => {
  console.log('User ID:', id);
});
```

## Advanced Features

### History Strategy Options

Control how the browser history is updated:

```typescript
area.push({
  component: 'user-profile',
  area: 'main',
  historyStrategy: 'push'    // Adds a new history entry (default)
});

area.push({
  component: 'settings',
  area: 'main',
  historyStrategy: 'replace' // Replaces the current history entry
});

area.push({
  component: 'sidebar-menu',
  area: 'sidebar',
  historyStrategy: 'silent'  // No history change
});

area.push({
  component: 'menu',
  area: 'popup',
  historyStrategy: 'pop'     // Similar to replace
});
```

### Managing Query Parameters

Clear specific query parameters during navigation:

```typescript
area.push({
  component: 'search-results',
  area: 'main',
  params: { query: 'new-search' },
  clearQueryParams: ['page', 'sort'] // Removes these query params
});
```

### Remove Areas

Remove an area from the current state:

```typescript
// Remove the 'modal' area
area.pop('modal');
```

### DOM Event Listening

For non-RxJS consumers, area changes also dispatch DOM events:

```javascript
// Format: schmancy-area-${areaName}-changed
window.addEventListener('schmancy-area-main-changed', event => {
  const { component, params, state } = event.detail;
  updateUI(component, params, state);
});
```

## API Reference

### SchmancyArea Component

```typescript
@customElement('schmancy-area')
export class SchmancyArea extends LitElement {
  /**
   * The name of the router outlet
   * @required
   */
  @property() name!: string;
  
  /**
   * Default component to display if none is specified
   * Can be a tag name, component constructor, or template
   */
  @property() default!: string | Promise<NodeModule> | CustomElementConstructor | TemplateResult<1>;
}
```

### Area Service

```typescript
// Navigation
area.push(routeAction: RouteAction): void
area.pop(areaName: string): void

// Subscriptions
area.on(areaName: string, skipCurrent?: boolean): Observable<ActiveRoute>
area.all(skipCurrent?: boolean): Observable<Map<string, ActiveRoute>>
area.getState<T>(areaName: string): Observable<T>
area.params<T>(areaName: string): Observable<T>
area.param<T>(areaName: string, key: string): Observable<T>

// URL State
area.state: Record<string, unknown> // Current URL state object
```

### Types

```typescript
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

## Integration with Other Schmancy Components

Schmancy Area works seamlessly with:
- **Schmancy Store** for more complex state management
- **Schmancy Layout** for responsive layouts
- **Schmancy Teleport** for advanced component transportation
- **Schmancy Sheet** for modal overlays

## Examples

### Basic Navigation

```typescript
// Define router outlets
<schmancy-area name="main" default="home-page"></schmancy-area>

// Navigate to a component
area.push({
  component: 'user-profile',
  area: 'main'
});
```

### Parameters and State

```typescript
// Navigate with params and state
area.push({
  component: 'product-detail',
  area: 'main',
  params: { productId: '12345' },
  state: { showReviews: true }
});

// Access params and state
area.param<string>('main', 'productId').subscribe(id => {
  fetchProduct(id);
});

area.getState<{ showReviews: boolean }>('main').subscribe(state => {
  if (state.showReviews) {
    loadReviews();
  }
});
```

### Multiple Independent Areas

```typescript
// Define multiple areas
<schmancy-area name="main"></schmancy-area>
<schmancy-area name="sidebar"></schmancy-area>
<schmancy-area name="modal"></schmancy-area>

// Update each area independently
area.push({ component: 'product-list', area: 'main' });
area.push({ component: 'filter-panel', area: 'sidebar' });
area.push({ component: 'quick-view', area: 'modal', params: { id: '123' } });

// Remove a modal
area.pop('modal');
```

### Navigation Guards

```typescript
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

## Best Practices

1. **Define clear area responsibilities** - Each area should have a well-defined purpose
2. **Use type-safe state and params** - Leverage TypeScript generics for type safety
3. **Unsubscribe from observables** - Always clean up subscriptions in disconnectedCallback()
4. **Be consistent with history strategies** - Use the same strategy for similar navigation patterns
5. **Consider using default components** - Provide fallback components for empty areas