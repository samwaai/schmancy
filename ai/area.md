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
Define routes declaratively with segment matching and guards. Routes are detected via slot change detection and are evaluated in order.

```html
<!-- Simple route -->
<schmancy-route
  when="products"  <!-- Matches 'products' segment in URL -->
  component="product-list"
  exact>
</schmancy-route>

<!-- Component tag name matching -->
<schmancy-route
  when="product-detail"  <!-- Matches when component is 'product-detail' -->
  component="product-detail">
</schmancy-route>

<!-- Route with guard -->
<schmancy-route
  when="admin"  <!-- Matches 'admin' segment anywhere in URL -->
  component="admin-panel"
  .guard=${() => isAuthenticated()}>
</schmancy-route>
```

## Properties Reference

### `<schmancy-area>` Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | **Required**. Unique identifier for this router outlet. |
| `default` | `string \| Promise<NodeModule> \| CustomElementConstructor \| HTMLElement \| LazyComponent` | Default component to display when no route matches or area is empty. |

### `<schmancy-route>` Properties

| Property | Type | Description |
|----------|------|-------------|
| `when` | `string` | **Required**. URL segment to match OR component tag name for programmatic navigation. |
| `component` | `RouteComponent` | Component to render when route matches (string, constructor, element, lazy component). |
| `exact` | `boolean` | Whether route should match exactly (default: false). |
| `guard` | `() => GuardResult \| Promise<GuardResult>` | Navigation guard function. |

Note: `<schmancy-route>` does NOT have a `default` property - that's only available on `<schmancy-area>`.

## URL Matching Behavior

The routing system uses multiple strategies to match routes:

### 1. **URL Segment Matching**
The URL path is split by '/' and the `when` attribute is checked against each segment in the array:

```html
<!-- Segment name matching -->
<schmancy-route when="products" component="product-list"></schmancy-route>
<!-- URL: /store/products/123 → segments: ['store', 'products', '123'] → MATCHES (products is in array) -->
<!-- URL: /products → segments: ['products'] → MATCHES -->
<!-- URL: /home → segments: ['home'] → DOES NOT MATCH -->
```

### 2. **Component Tag Name Matching**
For programmatic navigation, the `when` attribute can match the component tag name:

```html
<schmancy-route when="user-profile" component="user-profile"></schmancy-route>
<!-- When navigating with: area.push({ component: 'user-profile', area: 'main' }) → MATCHES -->
```

### 3. **JSON-Encoded State in URL**
When pretty URLs are disabled (default), the router encodes state as JSON in the URL:

```javascript
// URL: /%7B%22main%22%3A%7B%22component%22%3A%22user-profile%22%7D%7D
// Decoded: {"main":{"component":"user-profile"}}
// The router extracts this and matches against routes
```

### Matching Priority

Routes are evaluated in the order they appear in the DOM. The first matching route wins:

```html
<schmancy-area name="main">
  <!-- Evaluated first -->
  <schmancy-route when="user" component="user-detail"></schmancy-route>
  <!-- Evaluated second -->
  <schmancy-route when="users" component="user-list"></schmancy-route>
  <!-- Catch-all (empty when) evaluated last -->
  <schmancy-route when="" component="not-found"></schmancy-route>
</schmancy-area>
```

## Navigation Guards

Guards protect routes and can redirect navigation. Guards are executed before component creation for better performance:

```typescript
// Boolean guard - simple allow/deny
<schmancy-route
  when="admin"
  component="admin-panel"
  .guard=${() => user.isAdmin}>
</schmancy-route>

// String guard - redirect to path
<schmancy-route
  when="profile"
  component="user-profile"
  .guard=${() => isAuthenticated() || '/login'}>
</schmancy-route>

// Object guard - redirect with explicit syntax
<schmancy-route
  when="settings"
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
  when="premium"
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
| `false` | Block navigation silently, falls back to default if specified |
| `"/path"` (string) | Redirect to the specified path segment |
| `{redirect: "/path"}` | Explicit redirect object |
| `Promise<...>` | Async guard, resolved before navigation |

**Note**: Guard failures (`false` return) will fall back to the area's `default` component if specified. Redirects trigger a new route lookup based on the redirect path segment.

## Nested Routing

Create complex nested routing structures:

```html
<!-- Parent component with nested routes -->
<schmancy-route
  when="app"  <!-- Matches 'app' segment in URL -->
  component="app-layout"
  default="app-dashboard">

  <!-- app-layout.ts -->
  <div class="app-container">
    <nav>...</nav>
    <schmancy-area name="app-content">
      <!-- Nested routes also use segment matching -->
      <schmancy-route when="dashboard" component="app-dashboard"></schmancy-route>
      <schmancy-route when="users" component="user-list"></schmancy-route>
      <schmancy-route when="user-detail" component="user-detail"></schmancy-route>
      <schmancy-route when="settings" component="settings-layout">
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
  <schmancy-route when="" component="app-shell" default="home-page">  <!-- Empty when = catch-all -->

    <!-- Inside app-shell -->
    <schmancy-area name="main">
      <schmancy-route when="products" component="product-layout">

        <!-- Inside product-layout -->
        <schmancy-area name="product-content">
          <schmancy-route when="product-list" component="product-list"></schmancy-route>
          <schmancy-route when="product-detail" component="product-detail"></schmancy-route>
          <schmancy-route when="reviews" component="product-reviews"></schmancy-route>
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
  component: 'user-profile',      // Component constructor, string tag name, element instance, or lazy component
  area: 'main',                   // Target area name (required)
  state?: { view: 'profile' },    // Optional state object (stored in history)
  params?: { id: '123' },         // Optional query parameters (NOT URL query params - these are component params)
  props?: { userId: '123' },      // Optional component properties (alias for params, applied to component)
  historyStrategy?: 'push',       // 'push' | 'replace' | 'pop' | 'silent' (default: 'push')
  clearQueryParams?: ['sort']     // Clear specific URL query params
});

// Remove/clear an area - sends clearing signal to area
area.pop('sidebar');              // Clears the area content and updates history

// Subscription methods (return RxJS Observables)
area.on(areaName, skipCurrent?)          // Subscribe to an area's route changes
area.all(skipCurrent?)                   // Subscribe to all areas
area.getState<T>(areaName)              // Get typed state from an area
area.params<T>(areaName)                // Get typed params from an area
area.param<T>(areaName, key)            // Get a specific param value
area.props<T>(areaName)                 // Get typed props from an area
area.prop<T>(areaName, key)             // Get a specific prop value

// Utility methods
area.hasArea(areaName)                  // Check if an area exists
area.getActiveAreas()                    // Get array of active area names
area.getRoute(areaName)                 // Get route synchronously (returns ActiveRoute | undefined)

// Configuration
area.prettyURL = false                  // Enable pretty URLs (default: false uses JSON encoding)
area.mode = 'HISTORY'                   // 'HISTORY' | 'SILENT' (default: 'HISTORY')
area.enableHistoryMode = true           // Enable browser history management (default: true)
```

### Important Distinctions:
- **`params`**: Component-level parameters that are passed as properties to the component instance
- **`props`**: Alias for params - both are applied directly to the component element
- **`state`**: Arbitrary data stored in browser history, accessible via subscriptions
- **URL Query Parameters**: Managed separately via `clearQueryParams` option

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
  <schmancy-route when="home" component="home-page"></schmancy-route>
  <schmancy-route when="about" component="about-page"></schmancy-route>

  <!-- Protected routes -->
  <schmancy-route
    when="dashboard"
    component="dashboard-layout"
    .guard=${() => isAuthenticated() || '/login'}>
  </schmancy-route>

  <!-- Admin only -->
  <schmancy-route
    when="admin"
    component="admin-panel"
    .guard=${() => hasRole('admin') || { redirect: '/unauthorized' }}>
  </schmancy-route>

  <!-- Catch-all route (should be last) -->
  <!-- Note: Empty 'when' will match any route not matched above -->
  <schmancy-route when="" component="not-found-page"></schmancy-route>
</schmancy-area>
```

### Clearing Areas with area.pop()

```typescript
// Open a modal or sidebar
area.push({
  component: 'user-settings',
  area: 'modal',
  props: { userId: '123' }
});

// Clear the modal - sends clearing signal to area component
area.pop('modal');  // Component receives null signal and clears content

// Clear multiple areas
['modal', 'sidebar', 'overlay'].forEach(name => area.pop(name));

// Note: area.pop() now properly sends a clearing signal through the RxJS pipeline
// The area component will receive a route with null component and remove its content
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
  <schmancy-route when="products" component="product-list"></schmancy-route>
  <!-- Shows welcome-page when no route matches -->
</schmancy-area>

<!-- Route-level default for nested routing -->
<schmancy-route
  when="app"
  component="app-layout"
  default="app-dashboard">
  <!-- Shows app-dashboard as default content inside app-layout -->
</schmancy-route>
```

## Best Practices

### 1. Route Organization

```html
<!-- Order routes from most specific to least specific -->
<schmancy-area name="main">
  <!-- More specific component names first -->
  <schmancy-route when="product-create" component="product-create"></schmancy-route>
  <schmancy-route when="product-edit" component="product-edit"></schmancy-route>
  <schmancy-route when="product-detail" component="product-detail"></schmancy-route>

  <!-- General segment names -->
  <schmancy-route when="products" component="product-list"></schmancy-route>

  <!-- Catch-all (empty when) last -->
  <schmancy-route when="" component="not-found"></schmancy-route>
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
  when="premium-admin"
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
          <schmancy-route when="dashboard" component="dashboard"></schmancy-route>
          <schmancy-route when="users" component="users-module"></schmancy-route>
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

### 4. Dynamic Route Loading & Lazy Components

#### Using the `lazy()` helper function

Schmancy Area provides a powerful `lazy()` function similar to React.lazy() for optimal code splitting. Lazy components are resolved to constructors before element creation for better performance:

```typescript
import { lazy } from '@schmancy/area';

// Create lazy-loaded components with default exports
const LazyDashboard = lazy(() => import('./components/dashboard'));
const LazyAnalytics = lazy(() => import('./components/analytics'));
const LazyReports = lazy(() => import('./components/reports'));

// Use with area.push()
area.push({
  component: LazyDashboard,
  area: 'main'
});

// Use with declarative routes
<schmancy-route
  when="analytics"
  .component=${LazyAnalytics}
  .guard=${() => hasFeature('analytics') || '/upgrade'}>
</schmancy-route>

// Set as default for an area
<schmancy-area name="main" .default=${LazyDashboard}></schmancy-area>
```

#### Preloading Components

Lazy components support preloading for better perceived performance. The lazy() function caches both the loading promise and the loaded module:

```typescript
const LazyProfile = lazy(() => import('./profile'));

// Preload on hover for instant navigation
button.addEventListener('mouseenter', () => {
  LazyProfile.preload();  // Starts loading and caches the promise
});

// The component will be instantly available when navigated to
area.push({ component: LazyProfile, area: 'main' });  // Uses cached module

// Preload critical routes after initial page load
window.addEventListener('load', () => {
  setTimeout(() => {
    LazyProfile.preload();    // Caches for future use
    LazySettings.preload();
  }, 2000);
});
```

#### Complete Example: Lazy-Loaded Navigation

```typescript
import { $LitElement } from '@mixins/index';
import { area, lazy } from '@schmancy/area';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Define lazy components with default exports
const routes = {
  dashboard: lazy(() => import('./lazy-components/dashboard')),
  users: lazy(() => import('./lazy-components/users')),
  products: lazy(() => import('./lazy-components/products')),
  reports: lazy(() => import('./lazy-components/reports')),
  settings: lazy(() => import('./lazy-components/settings'))
};

@customElement('app-shell')
export class AppShell extends $LitElement() {
  @state() private currentRoute = 'dashboard';

  private navigate(route: string, component: any) {
    this.currentRoute = route;
    area.push({
      area: 'main',
      component: component
    });
  }

  render() {
    return html`
      <div class="grid grid-cols-[auto_1fr]">
        <!-- Sidebar Navigation -->
        <schmancy-list>
          <schmancy-list-item
            ?selected=${this.currentRoute === 'dashboard'}
            @click=${() => this.navigate('dashboard', routes.dashboard)}
            @mouseenter=${() => routes.dashboard.preload()}>
            <schmancy-icon slot="start">dashboard</schmancy-icon>
            Dashboard
          </schmancy-list-item>

          <schmancy-list-item
            ?selected=${this.currentRoute === 'users'}
            @click=${() => this.navigate('users', routes.users)}
            @mouseenter=${() => routes.users.preload()}>
            <schmancy-icon slot="start">group</schmancy-icon>
            Users
          </schmancy-list-item>

          <schmancy-list-item
            ?selected=${this.currentRoute === 'products'}
            @click=${() => this.navigate('products', routes.products)}
            @mouseenter=${() => routes.products.preload()}>
            <schmancy-icon slot="start">inventory_2</schmancy-icon>
            Products
          </schmancy-list-item>
        </schmancy-list>

        <!-- Main Content Area -->
        <schmancy-area
          name="main"
          .default=${routes.dashboard}>
        </schmancy-area>
      </div>
    `;
  }
}
```

#### Lazy Component Structure

Each lazy-loaded component should use default export:

```typescript
// lazy-components/dashboard.ts
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';

@customElement('lazy-dashboard')
export default class LazyDashboard extends $LitElement(css`
  :host {
    display: block;
    padding: 24px;
  }
`) {
  render() {
    return html`
      <schmancy-surface type="container" rounded="all">
        <schmancy-typography type="headline">Dashboard</schmancy-typography>
        <!-- Dashboard content -->
      </schmancy-surface>
    `;
  }
}
```

#### Benefits of Lazy Loading

1. **Reduced Initial Bundle Size**: Components are loaded only when needed
2. **Faster Initial Page Load**: Critical path includes only essential code
3. **Automatic Code Splitting**: Each lazy import creates a separate chunk
4. **Memory Efficiency**: Components not in use aren't loaded in memory
5. **Better Perceived Performance**: Preloading on hover makes navigation feel instant

#### Performance Best Practices

```typescript
// 1. Group related components in the same chunk
const LazyAdminComponents = lazy(() => import('./admin/index'));

// 2. Preload critical routes after initial render
connectedCallback() {
  super.connectedCallback();

  // Preload common routes after a delay
  setTimeout(() => {
    routes.dashboard.preload();
    routes.users.preload();
  }, 3000);
}

// 3. Use intersection observer for preloading visible links
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const route = entry.target.dataset.route;
      routes[route]?.preload();
    }
  });
});

// 4. Handle loading errors gracefully
const LazyFeature = lazy(() =>
  import('./feature').catch(() =>
    // Fallback to simpler version on error
    import('./feature-lite')
  )
);
```

#### Legacy Method (Still Supported)

The traditional dynamic import method is still supported:

```typescript
// Direct dynamic import (without lazy helper)
<schmancy-route
  when="analytics"
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

## History Management

The router manages browser history automatically, storing state in `history.state.schmancyAreas`:

### Browser State Structure
```javascript
// Browser history.state structure:
{
  schmancyAreas: {
    main: {
      component: 'user-profile',
      state: { view: 'edit' },
      params: { userId: '123' },
      area: 'main'
    },
    sidebar: {
      component: 'nav-menu',
      area: 'sidebar'
    }
  }
}
```

### URL Encoding Modes

#### 1. **JSON Encoding (Default)**
When `area.prettyURL = false` (default), state is encoded as JSON in the URL:
```javascript
// URL: /%7B%22main%22%3A%7B%22component%22%3A%22user-profile%22%7D%7D
// Decoded: {"main":{"component":"user-profile"}}
```

#### 2. **Pretty URLs**
When `area.prettyURL = true`, creates cleaner URLs:
```javascript
area.prettyURL = true;
// URL: /user-profile?userId=123
// Component and simple params are included in the URL
```

### History Strategies

```typescript
area.push({
  component: 'page',
  area: 'main',
  historyStrategy: 'push'  // Options: 'push' | 'replace' | 'pop' | 'silent'
});

// 'push': Adds new entry to history (default)
// 'replace': Replaces current history entry
// 'pop': Updates during back/forward navigation
// 'silent': No history update
```

## Internal Behaviors

### Component Lifecycle

1. **Route Resolution Pipeline**:
   - Route request received (programmatic, URL, or browser navigation)
   - Lazy components resolved to constructors (if applicable)
   - Component identifier extracted for deduplication
   - Route deduplicated using `distinctUntilChanged`
   - HTMLElement created and properties applied
   - Component swapped with animation

2. **Component Swapping Animation**:
   - Old component fades out (150ms)
   - Old component removed from DOM
   - New component added to shadow DOM
   - New component fades in (150ms)

3. **Deduplication Strategy**:
   Components are deduplicated based on:
   - Component identifier (tag name or constructor name)
   - JSON stringified params
   - JSON stringified state

   This prevents unnecessary re-renders when navigating to the same route.

### RxJS Pipeline Architecture

The area component uses a sophisticated RxJS pipeline:

```typescript
// Three navigation sources merged into one stream:
merge(
  area.request,           // Programmatic navigation
  of(location.pathname),  // Initial load
  fromEvent('popstate')    // Browser back/forward
)
.pipe(
  // Resolve lazy components
  switchMap(/* ... */),

  // Deduplicate identical routes
  distinctUntilChanged(/* ... */),

  // Share single subscription
  shareReplay(1),

  // Handle errors gracefully
  catchError(/* ... */),

  // Cleanup on disconnect
  takeUntil(this.disconnecting)
)
```

### Error Handling

- **Lazy Load Failures**: Logged to console, component set to null
- **Component Creation Failures**: Logged to console, gracefully skipped
- **Guard Errors**: Caught and fall back to default component
- **Navigation Errors**: Logged and return EMPTY observable

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
  <schmancy-route when="products" component="product-list"></schmancy-route>
  <schmancy-route when="product-detail" component="product-detail"></schmancy-route>
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
  when="protected"
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
    when="tenant-app"  <!-- Matches based on component tag name -->
    component="tenant-app"
    .guard=${async (params) => {
      const tenant = params.tenant;
      const isValid = await validateTenant(tenant);
      return isValid || { redirect: '/invalid-tenant' };
    }}>

    <!-- Inside tenant-app -->
    <schmancy-area name="tenant-content">
      <schmancy-route when="dashboard" component="tenant-dashboard"></schmancy-route>
      <schmancy-route when="users" component="tenant-users"></schmancy-route>
      <schmancy-route when="settings" component="tenant-settings"></schmancy-route>
    </schmancy-area>

  </schmancy-route>
</schmancy-area>
```

### Wizard/Step Navigation

```html
<schmancy-route when="onboarding" component="onboarding-wizard">
  <!-- Inside onboarding-wizard -->
  <schmancy-area name="wizard-step">
    <schmancy-route
      when="profile"
      component="step-profile"
      .guard=${() => hasCompletedStep(0) || '/onboarding/welcome'}>
    </schmancy-route>

    <schmancy-route
      when="preferences"
      component="step-preferences"
      .guard=${() => hasCompletedStep(1) || '/onboarding/profile'}>
    </schmancy-route>

    <schmancy-route
      when="complete"
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
  component: CustomElementConstructor | string | HTMLElement | (() => Promise<{ default: CustomElementConstructor }>);
  area: string;                                        // Required
  state?: Record<string, unknown>;                     // State stored in history
  params?: Record<string, unknown>;                    // Component properties
  props?: Record<string, unknown>;                     // Alias for params
  historyStrategy?: 'push' | 'replace' | 'pop' | 'silent';
  clearQueryParams?: string[] | boolean | null;        // Clear URL query params
  _source?: 'programmatic' | 'browser' | 'initial';    // Internal use only
}

// Active Route - current state of an area
interface ActiveRoute {
  component: string;                    // Always resolved to tag name
  area: string;
  state?: Record<string, unknown>;
  params?: Record<string, unknown>;     // Component properties
  props?: Record<string, unknown>;      // Component properties
}

// Guard function signatures
export type GuardResult = boolean | string | { redirect: string };
type GuardFunction = () => GuardResult | Promise<GuardResult>;

// Route Component Types
export type RouteComponent =
  | string                                              // Tag name
  | CustomElementConstructor                           // Constructor function
  | HTMLElement                                        // Existing element
  | TemplateResult<1>                                  // Lit template
  | (() => Promise<{ default: CustomElementConstructor }>) // Lazy loader
  | Promise<{ default: CustomElementConstructor }>;    // Dynamic import

// Route configuration (from route.component.ts)
interface RouteConfig {
  when: string;                         // URL segment to match
  component: RouteComponent;
  exact?: boolean;                      // Not actively used in current implementation
  guard?: () => GuardResult | Promise<GuardResult>;
}

// LazyComponent interface with preload capability
interface LazyComponent<T extends CustomElementConstructor = CustomElementConstructor> {
  (): Promise<{ default: T }>;
  preload(): Promise<void>;
  _promise?: Promise<{ default: T }>;   // Cached loading promise
  _module?: { default: T };             // Cached loaded module
}

// Browser History State Structure
interface SchmancyHistoryState {
  schmancyAreas: Record<string, ActiveRoute>;
  [key: string]: any;                   // Allow other apps to store additional state
}

// History Strategy Enum
enum HISTORY_STRATEGY {
  push = 'push',
  replace = 'replace',
  pop = 'pop',
  silent = 'silent'
}
```

## Related Components

- **[Store](./store.md)** - For complex state management
- **[Layout](./layout.md)** - For responsive layouts
- **[Teleport](./teleport.md)** - For advanced component transportation
- **[Sheet](./sheet.md)** - For modal overlays

## Performance Tips

1. **Use the `lazy()` function** for automatic code splitting and optimal loading
2. **Implement preloading on hover** for instant perceived navigation
3. **Handle loading errors** with catch blocks in import statements
4. **Group related components** in the same lazy chunk when appropriate
5. **Cache guard results** when checking expensive operations
6. **Use `historyStrategy: 'silent'`** for non-navigational updates
7. **Debounce rapid navigation** in user-triggered events
8. **Preload critical routes** after initial render using `component.preload()`
9. **Leverage default exports** in lazy-loaded components for cleaner imports
10. **Monitor bundle sizes** to ensure effective code splitting

## Summary

Schmancy Area provides a complete routing solution with:
- ✅ **Declarative routing** with `<schmancy-route>` using slot detection
- ✅ **URL segment matching** - splits paths and checks for segment presence
- ✅ **Navigation guards** with boolean, string, and object return types
- ✅ **Nested routing** support for complex applications
- ✅ **Default components** for fallback UI (area-level only)
- ✅ **Reactive subscriptions** with RxJS observables
- ✅ **Type-safe** API with TypeScript support
- ✅ **Multiple router outlets** for complex layouts
- ✅ **Proper area.pop()** sends clearing signals through RxJS pipeline
- ✅ **Lazy loading** with caching and preload support
- ✅ **History management** with JSON encoding or pretty URLs
- ✅ **Animation transitions** during component swapping (150ms fade)
- ✅ **Deduplication** prevents unnecessary re-renders
- ✅ **Error handling** with graceful fallbacks

The combination of declarative routes and programmatic navigation provides maximum flexibility for building modern web applications.