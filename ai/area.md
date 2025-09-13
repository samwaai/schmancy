# Schmancy Area - Advanced Routing System

Schmancy Area is a powerful, reactive routing and state management system for web components with RxJS integration. It supports nested routing, segment-based matching, navigation guards, and multiple independent router outlets.

## Core Components

### 1. `<schmancy-area>` - Router Outlet
The main container that displays routed components.

```html
<!-- Basic router outlet -->
<schmancy-area
  name="main"
  default="home-component">
</schmancy-area>

<!-- With default component as element -->
<schmancy-area
  name="sidebar"
  .default=${new MyDefaultComponent()}>
</schmancy-area>
```

### 2. `<schmancy-route>` - Declarative Routing
Define routes declaratively with segment matching and guards.

```html
<!-- Simple route -->
<schmancy-route
  when="/products"
  component="product-list"
  exact>
</schmancy-route>

<!-- Route with dynamic segments -->
<schmancy-route
  when="/products/:id"
  component="product-detail">
</schmancy-route>

<!-- Route with guard -->
<schmancy-route
  when="/admin/*"
  component="admin-panel"
  .guard=${() => isAuthenticated()}>
</schmancy-route>

<!-- Route with default component -->
<schmancy-route
  when="/dashboard"
  component="dashboard-main"
  default="dashboard-overview">
</schmancy-route>
```

## Properties Reference

### `<schmancy-area>` Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | **Required**. Unique identifier for this router outlet. |
| `default` | `string \| Promise<NodeModule> \| CustomElementConstructor \| TemplateResult` | Default component to display when no route matches or area is empty. |

### `<schmancy-route>` Properties

| Property | Type | Description |
|----------|------|-------------|
| `when` | `string` | **Required**. URL segment pattern to match (supports wildcards and parameters). |
| `component` | `any` | Component to render when route matches (string, constructor, element). |
| `exact` | `boolean` | Whether route should match exactly (default: false). |
| `guard` | `() => GuardResult \| Promise<GuardResult>` | Navigation guard function returning boolean, string, or redirect object. |

## URL Segment Matching

The `when` attribute supports powerful segment-based routing:

```html
<!-- Exact match -->
<schmancy-route when="/home" component="home-page"></schmancy-route>

<!-- Dynamic segments with :param syntax -->
<schmancy-route when="/user/:id" component="user-profile"></schmancy-route>

<!-- Wildcard for nested routing -->
<schmancy-route when="/admin/*" component="admin-layout"></schmancy-route>

<!-- Multiple segments -->
<schmancy-route when="/products/:category/:id" component="product-detail"></schmancy-route>

<!-- Optional trailing slash handled automatically -->
<schmancy-route when="/about" component="about-page"></schmancy-route>
<!-- Matches both /about and /about/ -->
```

### Segment Matching Rules

1. **Exact segments**: `/products` matches only `/products`
2. **Dynamic parameters**: `:id` captures any value in that position
3. **Wildcards**: `*` matches any remaining path segments
4. **Priority**: More specific routes take precedence over wildcards

## Navigation Guards

Guards protect routes and can redirect navigation:

```typescript
// Boolean guard - simple allow/deny
<schmancy-route
  when="/admin"
  component="admin-panel"
  .guard=${() => user.isAdmin}>
</schmancy-route>

// String guard - redirect to path
<schmancy-route
  when="/profile"
  component="user-profile"
  .guard=${() => isAuthenticated() || '/login'}>
</schmancy-route>

// Object guard - redirect with explicit syntax
<schmancy-route
  when="/settings"
  component="settings-page"
  .guard=${() => {
    if (!isAuthenticated()) {
      return { redirect: '/login' };
    }
    if (!hasPermission('settings')) {
      return { redirect: '/unauthorized' };
    }
    return true;
  }}>
</schmancy-route>

// Async guard - check with backend
<schmancy-route
  when="/premium"
  component="premium-content"
  .guard=${async () => {
    const subscription = await checkSubscription();
    return subscription.isActive || { redirect: '/upgrade' };
  }}>
</schmancy-route>
```

### Guard Return Types

| Return Value | Behavior |
|--------------|----------|
| `true` | Allow navigation to proceed |
| `false` | Block navigation silently |
| `"/path"` (string) | Redirect to the specified path |
| `{redirect: "/path"}` | Explicit redirect object |
| `Promise<...>` | Async guard, resolved before navigation |

## Nested Routing

Create complex nested routing structures:

```html
<!-- Parent component with nested routes -->
<schmancy-route
  when="/app/*"
  component="app-layout"
  default="app-dashboard">

  <!-- app-layout.ts -->
  <div class="app-container">
    <nav>...</nav>
    <schmancy-area name="app-content">
      <!-- Nested routes -->
      <schmancy-route when="/app/dashboard" component="app-dashboard"></schmancy-route>
      <schmancy-route when="/app/users" component="user-list"></schmancy-route>
      <schmancy-route when="/app/users/:id" component="user-detail"></schmancy-route>
      <schmancy-route when="/app/settings/*" component="settings-layout">
        <!-- Even deeper nesting in settings-layout -->
      </schmancy-route>
    </schmancy-area>
  </div>
</schmancy-route>
```

### Multi-level Nesting Example

```html
<!-- Root level -->
<schmancy-area name="root">
  <schmancy-route when="/*" component="app-shell" default="home-page">

    <!-- Inside app-shell -->
    <schmancy-area name="main">
      <schmancy-route when="/products/*" component="product-layout">

        <!-- Inside product-layout -->
        <schmancy-area name="product-content">
          <schmancy-route when="/products" component="product-list"></schmancy-route>
          <schmancy-route when="/products/:id" component="product-detail"></schmancy-route>
          <schmancy-route when="/products/:id/reviews" component="product-reviews"></schmancy-route>
        </schmancy-area>

      </schmancy-route>
    </schmancy-area>

  </schmancy-route>
</schmancy-area>
```

## Service API

```typescript
// Import the area service
import { area } from '@schmancy/index';
// Or specific import: import { area } from '@schmancy/area';

// Navigation methods
area.push({
  component: 'user-profile',      // Component constructor, string tag name, or element instance
  area: 'main',                   // Target area name
  state?: { view: 'profile' },    // Optional state object
  params?: { id: '123' },         // Optional query parameters
  props?: { userId: '123' },      // Optional component properties
  historyStrategy: 'push',        // 'push', 'replace', 'pop', 'silent'
  clearQueryParams?: ['sort']     // Clear specific query params
});

// Remove/clear an area (fixed in latest version)
area.pop('sidebar');              // Properly removes content from area

// Subscription methods (return RxJS Observables)
area.on(areaName, skipCurrent?)   // Subscribe to an area
area.all(skipCurrent?)            // Subscribe to all areas
area.getState<T>(areaName)        // Get typed state from an area
area.params<T>(areaName)          // Get typed query params from an area
area.param<T>(areaName, key)      // Get a specific query param value
area.props<T>(areaName)           // Get typed component props from an area
area.prop<T>(areaName, key)       // Get a specific component prop value
```

## Common Patterns

### Basic Navigation

```typescript
// Navigate to a component
area.push({
  component: 'home-page',
  area: 'main'
});

// Navigate with parameters and state
area.push({
  component: ProductDetailComponent,
  area: 'main',
  params: { productId: '12345' },  // Query parameters
  state: { showReviews: true },
  historyStrategy: 'push'
});

// Navigate with component properties
area.push({
  component: 'my-component',
  area: 'main',
  props: {
    title: 'Hello World',
    data: { id: 123, name: 'Test' },
    onClick: () => console.log('Clicked!')
  }
});
```

### Declarative Routing with Guards

```html
<schmancy-area name="main">
  <!-- Public routes -->
  <schmancy-route when="/home" component="home-page"></schmancy-route>
  <schmancy-route when="/about" component="about-page"></schmancy-route>

  <!-- Protected routes -->
  <schmancy-route
    when="/dashboard/*"
    component="dashboard-layout"
    .guard=${() => isAuthenticated() || '/login'}>
  </schmancy-route>

  <!-- Admin only -->
  <schmancy-route
    when="/admin/*"
    component="admin-panel"
    .guard=${() => hasRole('admin') || { redirect: '/unauthorized' }}>
  </schmancy-route>

  <!-- Catch-all route (should be last) -->
  <schmancy-route when="/*" component="not-found-page"></schmancy-route>
</schmancy-area>
```

### Programmatic Navigation with area.pop()

```typescript
// Open a modal or sidebar
area.push({
  component: 'user-settings',
  area: 'modal',
  props: { userId: '123' }
});

// Close/clear the modal (fixed in latest version)
area.pop('modal');  // This now properly clears the area

// Clear multiple areas
['modal', 'sidebar', 'overlay'].forEach(name => area.pop(name));
```

### Reactive Subscriptions

```typescript
// Subscribe to area changes
area.on('main').subscribe(route => {
  console.log(`Component: ${route.component}`);
  console.log(`Params:`, route.params);   // Query parameters
  console.log(`Props:`, route.props);     // Component properties
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
```

### Default Components

Default components provide fallback UI when no route matches:

```html
<!-- Area-level default -->
<schmancy-area name="main" default="welcome-page">
  <schmancy-route when="/products" component="product-list"></schmancy-route>
  <!-- Shows welcome-page when path is not /products -->
</schmancy-area>

<!-- Route-level default for nested routing -->
<schmancy-route
  when="/app/*"
  component="app-layout"
  default="app-dashboard">
  <!-- Shows app-dashboard when path is /app or /app/ -->
</schmancy-route>
```

## Best Practices

### 1. Route Organization

```html
<!-- Order routes from most specific to least specific -->
<schmancy-area name="main">
  <!-- Specific routes first -->
  <schmancy-route when="/products/new" component="product-create"></schmancy-route>
  <schmancy-route when="/products/:id/edit" component="product-edit"></schmancy-route>
  <schmancy-route when="/products/:id" component="product-detail"></schmancy-route>

  <!-- General routes -->
  <schmancy-route when="/products" component="product-list"></schmancy-route>

  <!-- Wildcard routes last -->
  <schmancy-route when="/*" component="not-found"></schmancy-route>
</schmancy-area>
```

### 2. Guard Composition

```typescript
// Compose multiple guard conditions
const requireAuth = () => isAuthenticated() || '/login';
const requireAdmin = () => hasRole('admin') || '/unauthorized';
const requireSubscription = () => hasActiveSubscription() || '/upgrade';

// Combine guards
const premiumAdminGuard = () => {
  if (!isAuthenticated()) return '/login';
  if (!hasRole('admin')) return '/unauthorized';
  if (!hasActiveSubscription()) return '/upgrade';
  return true;
};

<schmancy-route
  when="/premium-admin"
  component="premium-admin-panel"
  .guard=${premiumAdminGuard}>
</schmancy-route>
```

### 3. Nested Area Management

```typescript
// Parent component manages child areas
class AppLayout extends LitElement {
  render() {
    return html`
      <div class="layout">
        <nav>
          <a @click=${() => this.navigate('/app/dashboard')}>Dashboard</a>
          <a @click=${() => this.navigate('/app/users')}>Users</a>
        </nav>

        <schmancy-area name="app-content">
          <schmancy-route when="/app/dashboard" component="dashboard"></schmancy-route>
          <schmancy-route when="/app/users/*" component="users-module"></schmancy-route>
        </schmancy-area>
      </div>
    `;
  }

  navigate(path: string) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
```

### 4. Dynamic Route Loading

```typescript
// Lazy load heavy components
<schmancy-route
  when="/analytics"
  .component=${() => import('./analytics-dashboard.js').then(m => m.AnalyticsDashboard)}
  .guard=${() => hasFeature('analytics') || '/upgrade'}>
</schmancy-route>
```

### 5. Error Boundaries

```typescript
// Wrap routes in error boundaries
class ErrorBoundary extends LitElement {
  @state() hasError = false;

  constructor() {
    super();
    window.addEventListener('error', () => {
      this.hasError = true;
    });
  }

  render() {
    if (this.hasError) {
      return html`<error-page></error-page>`;
    }
    return html`<slot></slot>`;
  }
}

// Use in template
html`
  <error-boundary>
    <schmancy-area name="main">
      <!-- routes -->
    </schmancy-area>
  </error-boundary>
`;
```

## Migration Guide

### From Direct area.push() to Declarative Routes

**Before:**
```typescript
// Old imperative approach
if (path === '/products') {
  area.push({ component: 'product-list', area: 'main' });
} else if (path.startsWith('/products/')) {
  const id = path.split('/')[2];
  area.push({
    component: 'product-detail',
    area: 'main',
    params: { id }
  });
}
```

**After:**
```html
<!-- New declarative approach -->
<schmancy-area name="main">
  <schmancy-route when="/products" component="product-list"></schmancy-route>
  <schmancy-route when="/products/:id" component="product-detail"></schmancy-route>
</schmancy-area>
```

### Updating Guard Logic

**Before:**
```typescript
// Manual guard checks
area.on('protected-area').pipe(
  switchMap(route => {
    if (!isAuthenticated()) {
      area.push({ component: 'login-page', area: 'main' });
      return EMPTY;
    }
    return of(route);
  })
).subscribe();
```

**After:**
```html
<!-- Built-in guard support -->
<schmancy-route
  when="/protected"
  component="protected-content"
  .guard=${() => isAuthenticated() || '/login'}>
</schmancy-route>
```

## Advanced Examples

### Multi-tenant Application

```html
<schmancy-area name="root">
  <!-- Tenant detection route -->
  <schmancy-route
    when="/:tenant/*"
    component="tenant-app"
    .guard=${async ({ tenant }) => {
      const isValid = await validateTenant(tenant);
      return isValid || { redirect: '/invalid-tenant' };
    }}>

    <!-- Inside tenant-app -->
    <schmancy-area name="tenant-content">
      <schmancy-route when="/:tenant/dashboard" component="tenant-dashboard"></schmancy-route>
      <schmancy-route when="/:tenant/users" component="tenant-users"></schmancy-route>
      <schmancy-route when="/:tenant/settings" component="tenant-settings"></schmancy-route>
    </schmancy-area>

  </schmancy-route>
</schmancy-area>
```

### Wizard/Step Navigation

```html
<schmancy-route when="/onboarding/*" component="onboarding-wizard">
  <!-- Inside onboarding-wizard -->
  <schmancy-area name="wizard-step">
    <schmancy-route
      when="/onboarding/profile"
      component="step-profile"
      .guard=${() => hasCompletedStep(0) || '/onboarding/welcome'}>
    </schmancy-route>

    <schmancy-route
      when="/onboarding/preferences"
      component="step-preferences"
      .guard=${() => hasCompletedStep(1) || '/onboarding/profile'}>
    </schmancy-route>

    <schmancy-route
      when="/onboarding/complete"
      component="step-complete"
      .guard=${() => hasCompletedStep(2) || '/onboarding/preferences'}>
    </schmancy-route>
  </schmancy-area>
</schmancy-route>
```

## Troubleshooting

### Common Issues and Solutions

1. **Routes not matching**
   - Check route order (specific before general)
   - Verify URL segments match exactly
   - Ensure wildcards are used correctly

2. **Guards not redirecting**
   - Return string path or `{redirect: path}` object
   - Check async guards are returning promises
   - Verify guard function is bound correctly with `.guard=${}`

3. **Nested routes not working**
   - Parent route must use wildcard `/*` to allow nested paths
   - Child area must have unique name
   - Check component hierarchy is rendering child areas

4. **area.pop() not clearing content**
   - Update to latest version (fixed in recent update)
   - Ensure area name is correct
   - Check no other navigation is immediately refilling area

5. **Default components not showing**
   - Verify default is set on correct element (area or route)
   - Check no matching routes are preventing default
   - Ensure component name/reference is valid

## Type Definitions

```typescript
// Route Action - used for navigation
interface RouteAction {
  component: CustomElementConstructor | string | HTMLElement | Promise<NodeModule>;
  area: string;
  state?: Record<string, unknown>;
  params?: Record<string, unknown>;  // Query parameters
  props?: Record<string, unknown>;   // Component properties
  historyStrategy?: 'push' | 'replace' | 'pop' | 'silent';
  clearQueryParams?: string[] | null;
}

// Active Route - current state of an area
interface ActiveRoute {
  component: string;
  area: string;
  state?: Record<string, unknown>;
  params?: Record<string, unknown>;  // Query parameters
  props?: Record<string, unknown>;   // Component properties
}

// Guard function signatures (from route.component.ts)
export type GuardResult = boolean | string | { redirect: string };
type GuardFunction = () => GuardResult | Promise<GuardResult>;

// Route component props
interface RouteProps {
  when: string;                    // URL segment pattern
  component?: string | CustomElementConstructor | HTMLElement;
  default?: string | CustomElementConstructor | HTMLElement;
  guard?: GuardFunction;
}
```

## Related Components

- **[Store](./store.md)** - For complex state management
- **[Layout](./layout.md)** - For responsive layouts
- **[Teleport](./teleport.md)** - For advanced component transportation
- **[Sheet](./sheet.md)** - For modal overlays

## Performance Tips

1. **Use lazy loading** for heavy components
2. **Implement route-level code splitting** with dynamic imports
3. **Cache guard results** when checking expensive operations
4. **Use `historyStrategy: 'silent'`** for non-navigational updates
5. **Debounce rapid navigation** in user-triggered events
6. **Preload critical routes** during idle time

## Summary

Schmancy Area provides a complete routing solution with:
- ✅ **Declarative routing** with `<schmancy-route>`
- ✅ **Segment-based matching** with parameters and wildcards
- ✅ **Navigation guards** with multiple return types
- ✅ **Nested routing** support for complex applications
- ✅ **Default components** for fallback UI
- ✅ **Reactive subscriptions** with RxJS
- ✅ **Type-safe** API with TypeScript
- ✅ **Multiple router outlets** for complex layouts
- ✅ **Fixed area.pop()** functionality for proper cleanup

The combination of declarative routes and programmatic navigation provides maximum flexibility for building modern web applications.