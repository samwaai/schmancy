# Area — Routing Foundation

> **Not just a component. The routing framework your app runs on.**
> `area` is the imperative API. `schmancy-area` is the region where a component lives. `schmancy-route` declares the options.

Routing in Schmancy is four things working together:

| Piece | Role |
|-------|------|
| `<schmancy-area name="...">` | Declares a named region of the screen |
| `<schmancy-route when="tag">` | Declares which component can occupy it |
| `area.push(...)` | Imperative navigation (click handlers, guards, effects) |
| `lazy(() => import('...'))` | Code-split route components |

## The Shape of a Real App

Real apps nest areas. Outer `name="root"` handles public vs. authenticated. Inner `name="aria"` handles sub-views inside the authenticated shell.

```typescript
// app root — handles sign-in / public / authenticated
@customElement('my-app')
class MyApp extends $LitElement() {
  render() {
    return html`
      <schmancy-theme root scheme="dark">
        <schmancy-surface type="solid" fill="all">
          <schmancy-scroll>
            <schmancy-area
              name="root"
              .default=${lazy(() => import('./pages/landing.page'))}
            >
              <schmancy-route when="landing-page"
                .component=${lazy(() => import('./pages/landing.page'))}
              ></schmancy-route>

              <schmancy-route when="methodology-page"
                .component=${lazy(() => import('./pages/methodology.page'))}
              ></schmancy-route>

              <!-- Guarded route -->
              <schmancy-route when="app-index"
                .component=${lazy(() => import('./app/app.page'))}
                .guard=${firebaseAuthState$.pipe(
                  map(u => !!u && !u.isAnonymous),
                  takeUntil(this.disconnecting),
                )}
                @redirect=${() => area.push({
                  component: 'landing-page',
                  area: 'root',
                  historyStrategy: 'replace',
                })}
              ></schmancy-route>
            </schmancy-area>
          </schmancy-scroll>
        </schmancy-surface>
      </schmancy-theme>
    `
  }
}
```

```typescript
// nested area — inside the app shell
render() {
  return html`
    <schmancy-nav-drawer>
      <schmancy-nav-drawer-navbar width="180px">
        <schmancy-list-item @click=${() => area.push({ area: 'aria', component: 'aria-agents-page' })}>
          Agents
        </schmancy-list-item>
        <schmancy-list-item @click=${() => area.push({ area: 'aria', component: 'aria-knowledge-page' })}>
          Knowledge
        </schmancy-list-item>
      </schmancy-nav-drawer-navbar>

      <schmancy-nav-drawer-content>
        <schmancy-area name="aria" default="aria-knowledge-page">
          <schmancy-route when="aria-agents-page" .component=${lazy(() => import('./pages/agents'))}></schmancy-route>
          <schmancy-route when="aria-knowledge-page" .component=${lazy(() => import('./pages/knowledge'))}></schmancy-route>
          <schmancy-route when="aria-templates-page" .component=${lazy(() => import('./pages/templates'))}></schmancy-route>
        </schmancy-area>
      </schmancy-nav-drawer-content>
    </schmancy-nav-drawer>
  `
}
```

## `schmancy-area` Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | ✅ | Unique area identifier referenced in `area.push({ area: name })` |
| `default` | `RouteComponent \| string` | — | Fallback when no route matches — prefer `lazy()` |

## `schmancy-route` Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `when` | string | ✅ | **Must exactly match** a `@customElement('tag')` tag name |
| `component` | `RouteComponent` | ✅ | Class, tag name, or `lazy()` wrapper |
| `guard` | `Observable<boolean>` | — | When emits `false`, route blocks and fires `@redirect` |
| `exact` | boolean | — | Strict-equality matching |

## `area` service (imperative API)

```typescript
import { area } from '@mhmo91/schmancy'

area.push({
  area: 'root',               // target area name
  component: 'app-index',     // tag name (or class reference)
  params?: { id: '123' },     // pushed onto area.params()
  historyStrategy?: 'push' | 'replace' | 'silent',
})
```

`historyStrategy`:
- `'push'` (default) — browser back button returns to previous route
- `'replace'` — overwrites current history entry (use after guards / redirects)
- `'silent'` — changes the area without adding any history (transient state)

### Subscribe to route state
```typescript
connectedCallback() {
  super.connectedCallback()

  area.on('root').pipe(
    takeUntil(this.disconnecting),
  ).subscribe(route => {
    console.log('root area is now:', route.component)
  })

  area.params<{ id: string }>('detail').pipe(
    takeUntil(this.disconnecting),
  ).subscribe(params => this.loadItem(params.id))
}
```

## Lazy Loading

Code-split your routes. `lazy()` returns a preloadable reference.

```typescript
import { lazy } from '@mhmo91/schmancy'

const HomePage = lazy(() => import('./home.page'))

// Optional: preload on hover
<schmancy-button
  @mouseenter=${() => HomePage.preload()}
  @click=${() => area.push({ area: 'root', component: 'home-page' })}
>
  Home
</schmancy-button>
```

## Guards — the production pattern

Guards are **RxJS Observables**, not booleans. This lets auth state flow through naturally.

```typescript
import { firebaseAuthState$ } from './contexts/user.context'

<schmancy-route when="app-index"
  .component=${lazy(() => import('./app/app.page'))}
  .guard=${firebaseAuthState$.pipe(
    map(user => !!user && !user.isAnonymous),
    takeUntil(this.disconnecting),
  )}
  @redirect=${() => area.push({
    component: 'landing-page',
    area: 'root',
    historyStrategy: 'replace',
  })}
></schmancy-route>
```

- `guard` emits `true` → route renders.
- `guard` emits `false` → Schmancy fires a `redirect` event on the route; handle it with `area.push(...)` using `historyStrategy: 'replace'` so the blocked route doesn't stay in history.

## Rules

1. `when="tag-name"` **must exactly match** `@customElement('tag-name')` on the component's class.
2. Every route component should extend `$LitElement` and use `takeUntil(this.disconnecting)` in subscriptions.
3. Route components are responsible for their own scroll/focus handling on mount.
4. When calling `area.push` after auth guards or side-effectful redirects, use `historyStrategy: 'replace'`.
5. Nested areas are not just allowed — they're the default for any app with a shell + sub-views.

## Common recipes

### Redirect after sign-in
```typescript
await signIn(email, password)
area.push({ component: 'app-index', area: 'root', historyStrategy: 'replace' })
```

### Silent state swap (no history pollution)
```typescript
// e.g. swapping between auth screens without adding history
area.push({ component: 'signup-form', area: 'sign', historyStrategy: 'silent' })
```

### Click-driven sub-nav
```typescript
<schmancy-list-item @click=${() => area.push({ area: 'aria', component: 'aria-agents-page' })}>
  Agents
</schmancy-list-item>
```

### Preload routes on hover
```typescript
const DashboardPage = lazy(() => import('./dashboard.page'))

html`<a @mouseenter=${() => DashboardPage.preload()} @click=${() => area.push({ area: 'root', component: 'dashboard-page' })}>Dashboard</a>`
```
