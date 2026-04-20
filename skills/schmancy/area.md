# Area — Routing

Schmancy's client-side router. Three pieces:

| Piece | Role |
|-------|------|
| `<schmancy-area name="...">` | Named region that renders one route at a time |
| `<schmancy-route when="tag">` | Declares which component can render in an area |
| `area.push(...)` | Imperative navigation |

Areas can be nested to compose shell-plus-sub-view layouts.

## Example

```html
<schmancy-area name="root" .default=${lazy(() => import('./pages/home.page'))}>
  <schmancy-route when="home-page"
    .component=${lazy(() => import('./pages/home.page'))}></schmancy-route>

  <schmancy-route when="app-index"
    .component=${lazy(() => import('./app/app.page'))}
    .guard=${authState$.pipe(
      map(u => !!u && !u.isAnonymous),
      takeUntil(this.disconnecting),
    )}
    @redirect=${() => area.push({
      component: 'home-page',
      area: 'root',
      historyStrategy: 'replace',
    })}></schmancy-route>
</schmancy-area>
```

## `schmancy-area` properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string (required) | Area identifier used in `area.push({ area })` |
| `default` | `RouteComponent \| string` | Fallback when no route matches |

## `schmancy-route` properties

| Property | Type | Description |
|----------|------|-------------|
| `when` | string (required) | Must match a `@customElement('tag')` tag name |
| `component` | `RouteComponent` (required) | Class, tag name, or `lazy()` wrapper |
| `guard` | `Observable<boolean>` | When emits `false`, blocks and dispatches `redirect` event |
| `exact` | boolean | Strict-equality matching |

## `area` service

```typescript
import { area } from '@mhmo91/schmancy'

area.push({
  area: 'root',
  component: 'app-index',
  params?: { id: '123' },
  historyStrategy?: 'push' | 'replace' | 'silent',
})
```

`historyStrategy`:
- `'push'` (default) — adds a browser-history entry
- `'replace'` — overwrites the current entry (use after guards or redirects)
- `'silent'` — changes the area without touching history

### Subscribe to route state

```typescript
area.on('root').pipe(
  takeUntil(this.disconnecting),
).subscribe(route => { /* route.component, route.params */ })

area.params<{ id: string }>('detail').pipe(
  takeUntil(this.disconnecting),
).subscribe(params => this.loadItem(params.id))
```

## Lazy loading

```typescript
import { lazy } from '@mhmo91/schmancy'
const HomePage = lazy(() => import('./home.page'))

// Optional preload
html`<button @mouseenter=${() => HomePage.preload()}>Home</button>`
```

## Guards

`guard` is an Observable<boolean>.

- Emits `true` → route renders.
- Emits `false` → route dispatches a `redirect` event. Handle it with `area.push(...)`.

Auth guard:

```typescript
<schmancy-route when="app-index"
  .component=${lazy(() => import('./app'))}
  .guard=${authState$.pipe(
    map(u => !!u),
    takeUntil(this.disconnecting),
  )}
  @redirect=${() => area.push({
    component: 'home-page', area: 'root', historyStrategy: 'replace',
  })}></schmancy-route>
```

Compound guard (multiple streams):

```typescript
.guard=${combineLatest([permissions$, orgContext.$]).pipe(
  takeUntil(this.disconnecting),
  map(([perms, org]) => perms.includes('billing.view') && org?.billing?.configured),
)}
```

## Nested areas

Areas nest by rendering an inner `<schmancy-area>` inside a route component. A common shape is an outer area for "signed-in vs. not" and an inner area for sub-views of the signed-in shell.

```html
<!-- outer -->
<schmancy-area name="root">
  <schmancy-route when="app-index" .component=${AppShell}></schmancy-route>
</schmancy-area>

<!-- inner (inside AppShell.render()) -->
<schmancy-area name="app" default="home-page">
  <schmancy-route when="home-page" .component=${...}></schmancy-route>
  <schmancy-route when="settings-page" .component=${...}></schmancy-route>
</schmancy-area>
```

## Rules

- `when="tag-name"` must match `@customElement('tag-name')` exactly.
- Guards emit `false` → always use `historyStrategy: 'replace'` in the `@redirect` handler.
- Every subscription in guards / route state uses `takeUntil(this.disconnecting)`.
