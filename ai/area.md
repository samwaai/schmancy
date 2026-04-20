# schmancy-area / schmancy-route

> Client-side router with named areas, lazy loading, route guards, and browser history integration.

## Usage
```html
<schmancy-area name="main" default="home-page">
  <schmancy-route when="home-page" .component=${lazy(() => import('./home'))}></schmancy-route>
  <schmancy-route when="settings-page" .component=${lazy(() => import('./settings'))}></schmancy-route>
</schmancy-area>
```

## Properties (schmancy-area)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| name | string | required | Unique area name |
| default | RouteComponent | - | Default route component |

## Properties (schmancy-route)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| when | string | required | Route identifier (must match `@customElement` tag) |
| component | RouteComponent | required | Component to render (class, tag name, or lazy) |
| exact | boolean | `false` | Exact path matching |
| guard | Observable<boolean> | - | Route guard observable |

## Programmatic Navigation (area service)
```typescript
import { area } from '@mhmo91/schmancy'

// Navigate
area.push({ area: 'main', component: 'settings-page', params: { id: '123' } })

// Subscribe to area changes
area.on('main').pipe(takeUntil(this.disconnecting)).subscribe(route => { ... })

// Get params
area.params<{id: string}>('main').pipe(takeUntil(this.disconnecting)).subscribe(params => { ... })
```

## Lazy Loading
```typescript
import { lazy } from '@mhmo91/schmancy'
const LazyPage = lazy(() => import('./my-page'))

// Preload on hover
element.addEventListener('mouseenter', () => LazyPage.preload())
```

## Examples
```html
<!-- With route guard -->
<schmancy-area name="admin" default="admin-dashboard">
  <schmancy-route when="admin-dashboard"
    .component=${lazy(() => import('./dashboard'))}
    .guard=${isAdmin$}>
  </schmancy-route>
</schmancy-area>
```

**Critical:** `when="tag-name"` MUST exactly match `@customElement('tag-name')` on the component class.
