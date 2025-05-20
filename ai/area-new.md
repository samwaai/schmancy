# Schmancy Area

> A beautifully simple, yet powerful routing and state management system for web components.

![Schmancy Area Router](https://via.placeholder.com/800x400?text=Schmancy+Area+Router)

## Overview

Schmancy Area is a lightweight, reactive routing and state management solution designed specifically for web components. It provides a seamless way to handle navigation, component loading, and state management without complex configuration or boilerplate code.

```typescript
// Place your router outlet anywhere in your application
<schmancy-area name="main" default="home-page"></schmancy-area>

// Navigate to a new view with a simple API
area.push({
  component: UserProfileComponent,
  area: 'main',
  params: { userId: '123' }
});
```

## Key Features

- **Zero-configuration routing** - Just add `<schmancy-area>` elements where you want routed content
- **Reactive API** with RxJS observables for clean state subscriptions
- **Multiple independent areas** for complex layouts
- **Type-safe** state and parameters with TypeScript generics
- **Seamless integration** with browser history and URL state
- **Lazy-loading** support via dynamic imports

---

## Getting Started

### Installation

```bash
npm install @schmancy/area
```

### Basic Setup

1. Add routing areas to your application:

```html
<!-- Main content area -->
<schmancy-area name="main" default="home-page"></schmancy-area>

<!-- Optional additional areas -->
<schmancy-area name="sidebar"></schmancy-area>
<schmancy-area name="modal"></schmancy-area>
```

2. Import the area service:

```typescript
import { area } from '@schmancy/area';
```

3. Navigate between views:

```typescript
// Navigate to a component
area.push({
  component: 'user-profile',  // Tag name
  area: 'main',               // Target area
  params: { userId: '123' },  // Optional parameters
  state: { view: 'details' }  // Optional state
});

// Or use a component constructor
area.push({
  component: UserProfileComponent,
  area: 'main'
});
```

---

## Reactive Power

Schmancy Area uses RxJS to create a fully reactive experience.

### Subscribe to Route Changes

```typescript
// Get notified when the 'main' area changes
area.on('main').subscribe(route => {
  console.log('Component:', route.component);
  console.log('Params:', route.params);
  console.log('State:', route.state);
});
```

### Type-Safe State and Parameters

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

// Get a specific parameter
area.param<string>('user', 'id').subscribe(id => {
  console.log('User ID:', id);
});
```

---

## Advanced Usage

### Multiple Independent Areas

Define multiple areas for different sections of your application:

```html
<schmancy-nav-drawer>
  <schmancy-nav-drawer-navbar>
    <!-- Navigation area -->
    <schmancy-area name="nav"></schmancy-area>
  </schmancy-nav-drawer-navbar>
  
  <schmancy-nav-drawer-content>
    <!-- Main content area -->
    <schmancy-area name="main"></schmancy-area>
    
    <!-- Modal area that appears on demand -->
    <div class="modal-container">
      <schmancy-area name="modal"></schmancy-area>
    </div>
  </schmancy-nav-drawer-content>
</schmancy-nav-drawer>
```

Each area can be navigated independently:

```typescript
// Update main content
area.push({
  component: 'product-list',
  area: 'main'
});

// Open a modal
area.push({
  component: 'login-form',
  area: 'modal'
});

// Remove a modal
area.pop('modal');
```

### Lazy Loading Components

Load components on demand:

```typescript
area.push({
  component: import('./components/heavy-dashboard.js'),
  area: 'main'
});
```

### Custom Navigation Guards

```typescript
area.on('protected').pipe(
  switchMap(route => {
    if (!isAuthenticated()) {
      area.push({ component: 'login-page', area: 'main' });
      return EMPTY;
    }
    return of(route);
  })
).subscribe(handleProtectedRoute);
```

---

## Browser Integration

Schmancy Area seamlessly integrates with the browser's history API, enabling browser navigation (back/forward) to work naturally with your application routing.

### History Strategy Options

```typescript
area.push({
  component: 'user-profile',
  area: 'main',
  historyStrategy: 'push' // Default - adds new history entry
});

area.push({
  component: 'settings',
  area: 'main',
  historyStrategy: 'replace' // Replaces current history entry
});

area.push({
  component: 'sidebar-menu',
  area: 'sidebar',
  historyStrategy: 'silent' // No history entry changes
});
```

---

## API Reference

### `<schmancy-area>` Element

```typescript
@customElement('schmancy-area')
export class SchmancyArea extends LitElement {
  // The name of this router outlet
  @property() name!: string;
  
  // Default component to display if none is specified
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

---

## Example Applications

Schmancy Area is perfect for a wide range of applications:

- **Single Page Applications** with multiple views
- **Dashboard Applications** with nested components
- **E-commerce Sites** with product navigation
- **Admin Panels** with complex layouts
- **Multi-step Forms** with state persistence

---

## Integration with Other Schmancy Components

Schmancy Area works beautifully with other Schmancy components:

- Use with **[Schmancy Store](./store.md)** for more complex state management
- Combine with **[Schmancy Layout](./layout.md)** for responsive designs
- Pair with **[Schmancy Teleport](./teleport.md)** for advanced component transportation
- Works seamlessly with **[Schmancy Sheet](./sheet.md)** for modal overlays

---

## Why Schmancy Area?

- **Minimalist API** - Simple yet powerful
- **No Dependencies** - Only relies on RxJS
- **Small Footprint** - Lightweight implementation
- **Web Component Native** - Built for the modern web
- **TypeScript First** - Full type safety