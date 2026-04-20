# Schmancy AI Index

> Single-file navigation for AI agents. Foundations first, then components sorted by **what job they do**.

Schmancy is not just a component library. It's four concentric layers:

```
┌─ FOUNDATIONS ──────────────────────────────────────┐
│   Routing · State · Base class · Theme · Directives │
│   (Not components. The framework your app runs on.) │
├─ ATOMS ────────────────────────────────────────────┤
│   Typography · Icons · Surfaces · Buttons · Scroll  │
│   (The vocabulary every screen repeats.)            │
├─ COMPOSITES ───────────────────────────────────────┤
│   Forms · Navigation · Overlays · Feedback · Data   │
│   (Job-specific components.)                        │
└─ UTILITIES ────────────────────────────────────────┘
    Discovery · RxJS helpers · Search · Numbers · etc.
```

**Most of a Schmancy app is foundations + atoms + services.** Composites are reached for when a real user-facing job needs them. Start in that order.

---

# Layer 1 — Foundations

These are the load-bearing pieces. Touch them wrong and everything above breaks.

## 1.1 Routing — `area` + `schmancy-area` + `schmancy-route`
**Job:** Control which component occupies a region of the screen, with browser history, guards, params, and lazy loading.

```typescript
import { area, lazy } from '@mhmo91/schmancy'
```

```html
<schmancy-area name="root" .default=${lazy(() => import('./home.page'))}>
  <schmancy-route when="home-page" .component=${lazy(() => import('./home.page'))} />
  <schmancy-route when="dashboard"
    .component=${lazy(() => import('./dashboard.page'))}
    .guard=${firebaseAuth$.pipe(map(u => !!u), takeUntil(this.disconnecting))}
    @redirect=${() => area.push({ area: 'root', component: 'home-page', historyStrategy: 'replace' })}
  />
</schmancy-area>
```

- **Named areas**: multiple independent regions, 2-level nesting common (`name="root"` + `name="aria"` inside the outer shell).
- **Guards are Observables**: subscribe, emit `boolean`; when `false` a `redirect` event fires.
- **Lazy is mandatory** for route components — `lazy(() => import('...'))` returns a preloadable reference.
- **`when="tag-name"` must exactly match** `@customElement('tag-name')`.
- **Programmatic navigation**: `area.push({ area, component, params?, historyStrategy? })`.
- **Subscribe to route state**: `area.on('root').pipe(takeUntil(this.disconnecting)).subscribe(...)`.

→ Full doc: [area.md](./area.md)

## 1.2 State — `createContext` + `@select`
**Job:** App-wide reactive state with storage, without Redux boilerplate.

```typescript
import { createContext, select } from '@mhmo91/schmancy'

// Declare once at module scope
export const userContext = createContext<User>(new User(), 'local', 'user')
export const sessionContext = createContext<Session>({}, 'session', 'session')
export const cacheContext = createContext<Map<string, Item>>(new Map(), 'memory', 'cache')

// Consume in a component — auto-subscribes and re-renders
@customElement('my-component')
class MyComponent extends $LitElement() {
  @select(userContext) user!: User

  firstUpdated() {
    // Gate on readiness; chain with RxJS; clean up on disconnect
    userContext.$.pipe(
      filter(() => userContext.ready),
      distinctUntilChanged((a, b) => a.id === b.id),
      switchMap(u => this.loadForUser(u)),
      takeUntil(this.disconnecting),
    ).subscribe()
  }
}
```

- **Storage modes**: `'memory'` · `'local'` · `'session'` · `'indexeddb'`.
- **Collection-aware**: `Map` and `Array` contexts get `.set(k,v)`, `.delete(k)`, `.push(v)`, `.replace(...)` helpers.
- **`.ready`** is a boolean — gate async work behind `filter(() => ctx.ready)`.
- **`.$`** is a BehaviorSubject — compose with RxJS.
- **`.value`** is the synchronous snapshot.
- **`@selectItem`** for picking one entry from a collection context.

**Real architectures use many small contexts** (aria runs 9: user, organization, app state, templates, contacts, agents, compose, draft, strict) — not one monolith.

→ Full doc: [store.md](./store.md)

## 1.3 Base class — `$LitElement`
**Job:** Every Schmancy component extends this. It wires RxJS cleanup, Tailwind, and cross-shadow discovery into every element.

```typescript
import { $LitElement } from '@mhmo91/schmancy/mixins'

@customElement('my-component')
class MyComponent extends $LitElement(css`:host { display: block }`) {
  connectedCallback() {
    super.connectedCallback()
    // The `disconnecting` Subject emits once on disconnect
    myObservable$.pipe(takeUntil(this.disconnecting)).subscribe()
  }
}
```

Provides: `disconnecting` (RxJS Subject) · `classMap()` (space-splitting) · `styleMap()` · `discover<T>(tag)` · Tailwind support · auto-response to discovery events.

**Rule of thumb:** if you're writing a Lit component inside a Schmancy app, extend `$LitElement`. No exceptions.

→ Full doc: [mixins.md](./mixins.md)

## 1.4 Theme — `schmancy-theme` + `theme` service
**Job:** Provide color scheme (dark/light), brand color, and CSS custom properties to everything below it.

```html
<schmancy-theme root scheme="dark" color="#6366F1">
  <!-- entire app -->
</schmancy-theme>
```

- One `root` theme per app, typically wrapping `schmancy-surface type="solid" fill="all"`.
- Nested `<schmancy-theme>` can re-scope color/scheme for a subtree.
- CSS vars auto-generated: `--schmancy-sys-color-{role}-{variant}`.
- `theme.fullscreen$` — observable of viewport fullscreen state.

→ Full doc: [theme.md](./theme.md)

## 1.5 Directives — behavior without components
**Job:** Attach physics, effects, visibility, and interactions to *any* element via Lit directive syntax. 19 directives, modular imports.

```typescript
import { magnetic, cursorGlow, gravity, reveal, animateText, tooltip, drag, drop } from '@mhmo91/schmancy/directives'
```

```html
<schmancy-card ${cursorGlow()} ${gravity({ stagger: 100 })}>...</schmancy-card>
<div ${reveal(this.expanded, { preset: 'smooth' })}>expandable content</div>
<span ${animateText({ animation: 'blur-reveal' })}>Hello</span>
<button ${tooltip('Save your changes')}>Save</button>
```

Categories:
- **Physics**: `magnetic`, `cursorGlow`, `livingBorder`, `gravity`, `depthOfField`, `longPress`
- **Effects**: `nebula`, `liquid`, `ripple`
- **Text**: `animateText`, `cycleText`, `typewriter`
- **Visibility**: `reveal`, `intersect`
- **Interaction**: `drag`, `drop`, `color`, `tooltip`

→ Full doc: [directives.md](./directives.md)

---

# Layer 2 — Atoms

The display vocabulary. You'll use these on nearly every screen.

| Job | Tag | Doc |
|-----|-----|-----|
| **Text** | `schmancy-typography` | [typography](./typography.md) |
| **Iconography** | `schmancy-icon`, `schmancy-icon-button` | [icons](./icons.md), [button](./button.md) |
| **Primary actions** | `schmancy-button` | [button](./button.md) |
| **Glass depth container** | `schmancy-surface` | [surface](./surface.md) |
| **Scroll region** | `schmancy-scroll` | [layout](./layout.md) |
| **Visual separation** | `schmancy-divider` | [divider](./divider.md) |
| **Profile image** | `schmancy-avatar` | [avatar](./avatar.md) |

---

# Layer 3 — Composites (sorted by job)

## Forms — collect input
| Job | Tag | Doc |
|-----|-----|-----|
| Validation container | `schmancy-form` | [form](./form.md) |
| Single-line text | `schmancy-input` | [input](./input.md) |
| Multi-line text | `schmancy-textarea` | [textarea](./textarea.md) |
| Single-choice dropdown | `schmancy-select` + `schmancy-option` | [select](./select.md), [option](./option.md) |
| Searchable dropdown | `schmancy-autocomplete` | [autocomplete](./autocomplete.md) |
| Boolean | `schmancy-checkbox` | [checkbox](./checkbox.md) |
| One-of-many | `schmancy-radio-group` | [radio-group](./radio-group.md) |
| Multi-select tags / filters | `schmancy-chips` | [chips](./chips.md) |
| Date / date range | `schmancy-date-range`, `schmancy-date-range-inline` | [date-range](./date-range.md), [date-range-inline](./date-range-inline.md) |
| Numeric slider | `schmancy-range` | [range](./range.md) |
| Country / timezone | `schmancy-select-countries`, `schmancy-select-timezones` | [extra](./extra.md) |

## Navigation — structural layout
| Job | Tag | Doc |
|-----|-----|-----|
| App shell with side drawer | `schmancy-nav-drawer` (+ navbar, content) | [nav-drawer](./nav-drawer.md) |
| Tabbed sub-views | `schmancy-tabs` | [tabs](./tabs.md) |
| Mobile bottom nav | `schmancy-navigation-bar` | [navigation-bar](./navigation-bar.md) |
| Desktop side rail | `schmancy-navigation-rail` | [navigation-rail](./navigation-rail.md) |
| Multi-step flow | `schmancy-steps` | [steps](./steps.md) |
| Master-detail split | `schmancy-content-drawer` | [content-drawer](./content-drawer.md) |
| Viewport-aware page root | `schmancy-page` | [page](./page.md) |
| Floating draggable panel | `schmancy-window`, `schmancy-boat`, `schmancy-float` | [window](./window.md), [boat](./boat.md), [float](./float.md) |
| FLIP transition between views | `schmancy-teleport` | [teleport](./teleport.md) |

## Overlays — temporarily above everything (services preferred)
| Job | API | Fallback tag | Doc |
|-----|-----|--------------|-----|
| Modal / confirm | **`$dialog()` service** | `schmancy-dialog` | [dialog](./dialog.md) |
| Toast / banner | **`$notify()` service** | `schmancy-notification` | [notification](./notification.md) |
| Side/bottom panel | **`schmancyContentDrawer.open()`** | `schmancy-sheet` | [sheet](./sheet.md) |
| Context menu | `schmancy-menu` | — | [menu](./menu.md) |
| Floating panel | `schmancy-dropdown` | — | [dropdown](./dropdown.md) |
| Hover hint | `tooltip` directive | `schmancy-tooltip` | [tooltip](./tooltip.md), [directives](./directives.md) |
| Image gallery | `schmancy-lightbox` | — | [lightbox](./lightbox.md) |
| Accordion | `schmancy-expand` | `schmancy-details` | [expand](./expand.md), [details](./details.md) |

**Service > component for overlays.** Real apps call `$dialog()` / `$notify()` / `schmancyContentDrawer.open()` hundreds of times — managing overlay lifecycle imperatively keeps templates clean.

## Interaction — actionable content
| Job | Tag | Doc |
|-----|-----|-----|
| Clickable container | `schmancy-card` | [card](./card.md) |
| Selectable list | `schmancy-list` + `schmancy-list-item` | [list](./list.md) |
| Expandable row | `schmancy-details` | [details](./details.md) |
| Tabular data | `schmancy-table` | [table](./table.md) |
| Hierarchical data | `schmancy-tree` | [tree](./tree.md) |
| Carousel | `schmancy-slider` + `schmancy-slide` | [slider](./slider.md) |
| Camera QR scan | `schmancy-qr-scanner` | [qr-scanner](./qr-scanner.md) |

## Feedback — status / progress
| Job | Tag | Doc |
|-----|-----|-----|
| Linear progress | `schmancy-progress` | [progress](./progress.md) |
| Spinner / skeleton overlay | `schmancy-busy` | [busy](./busy.md) |
| Status indicator | `schmancy-badge` | [badge](./badge.md) |
| Online/offline banner | `schmancy-connectivity-status` | [connectivity](./connectivity.md) |
| Deferred render with stagger | `schmancy-delay` | [delay](./delay.md) |

## Rich display — specialized rendering
| Job | Tag | Doc |
|-----|-----|-----|
| Syntax-highlighted code | `schmancy-code-highlight` | [code-highlight](./code-highlight.md) |
| Typewriter reveal | `schmancy-typewriter` | [typewriter](./typewriter.md) |
| JSON viewer (debug) | `schmancy-json` | [json](./json.md) |
| Sandboxed iframe | `schmancy-iframe` | [iframe](./iframe.md) |
| Google Maps | `schmancy-map` | [map](./map.md) |
| Area chart | `schmancy-area-chart` | [charts](./charts.md) |
| Horizontal pills chart | `schmancy-pills` | [charts](./charts.md) |
| Theme toggle button | `schmancy-theme-button` | [theme-button](./theme-button.md) |

## Domain — specific to a workflow
| Job | Tag | Doc |
|-----|-----|-----|
| Email composition | `schmancy-mailbox` (+ 5 sub-tags) | [mailbox](./mailbox.md) |

## Layout primitives (prefer Tailwind for new code)
| Job | Tag | Doc |
|-----|-----|-----|
| Grid / flex / scroll | `schmancy-grid`, `schmancy-flex`, `schmancy-scroll`, `sch-grid`, `sch-flex` | [layout](./layout.md) |

---

# Layer 4 — Utilities (non-component)

| Module | Purpose | Doc |
|--------|---------|-----|
| Audio | Synthesized emotional sounds (`sound.play('joyful')`) | [audio](./audio.md) |
| Discovery | Cross-shadow-DOM component lookup | [discovery](./discovery.md) |
| RxJS utils | `waitForElement`, `waitUntil`, `mutationObserver` | [rxjs-utils](./rxjs-utils.md) |
| Utils | `similarity`, `numbers`, `overlayStack`, `intersection$`, `hashContent` | [utils](./utils.md) |
| Animation | Spring presets, `createAnimation`, Tailwind integration | [animation](./animation.md) |

---

# The 80/20 cheat sheet

If you're new to Schmancy and shipping a screen today, reach for these in this order:

1. **Wrap the app** in `<schmancy-theme root>` + `<schmancy-surface type="solid" fill="all">` + `<schmancy-scroll>`.
2. **Route** with `<schmancy-area name="root">` + `<schmancy-route>` + `lazy()`.
3. **Store** state in `createContext(..., 'local')` + `@select` in components.
4. **Extend** `$LitElement` in every component. Use `takeUntil(this.disconnecting)` for every subscription.
5. **Compose screens** from atoms: `schmancy-typography`, `schmancy-icon`, `schmancy-button`, `schmancy-surface`, `schmancy-divider`.
6. **Forms**: `schmancy-input` + `schmancy-chips` + `schmancy-checkbox` + `schmancy-form`. Reach for `schmancy-select` / `schmancy-autocomplete` only when needed.
7. **Overlays**: `$dialog()` + `$notify()` + `schmancyContentDrawer.open()` — service APIs, not template tags.
8. **Effects**: reach for `cursorGlow`, `magnetic`, `reveal`, `animateText` directives before writing CSS animations.

Everything else is demand-driven.

---

# Conventions (enforce these)

- **Lists use `repeat(items, item => item.id, tpl)`** — never `.map()` in templates.
- **View switching uses `cache(...)`** — preserves DOM and state.
- **Expensive work uses `guard([deps], fn)`** — memoizes against identity changes.
- **DOM access uses `ref(createRef())`** — never `querySelector` for own shadow tree if a ref will do.
- **Conditionals use `when(...)` / `choose(...)` / `ifDefined(...)`** — cleaner than ternaries.
- **All subscriptions use `.pipe(takeUntil(this.disconnecting))`** — no manual unsubscribe.
- **No `setTimeout` / `setInterval` / `addEventListener`** — use RxJS (`timer`, `interval`, `fromEvent`).
- **No hardcoded colors** — use `--schmancy-sys-color-*` CSS vars or Tailwind theme classes.
- **No mixing `classMap` with string interpolation** — it must be the sole expression in `class=`.
- **ARIA wiring on combobox forms**: `role="combobox"` + `aria-haspopup="listbox"` + `aria-expanded` + `aria-controls` + a `#live-status` live region.
- **Overlay z-index**: always go through `overlayStack` (dialogs/sheets/windows already do).

---

# Services reference (import these by name)

| Service | From | Purpose |
|---------|------|---------|
| `area` | `@mhmo91/schmancy` | Router imperative API |
| `$dialog` | `@mhmo91/schmancy` | Modal/confirm dialogs |
| `$notify` | `@mhmo91/schmancy` | Toast notifications |
| `schmancyContentDrawer` | `@mhmo91/schmancy` | Side panel |
| `theme` | `@mhmo91/schmancy` | Theme state + fullscreen$ |
| `sound` | `@mhmo91/schmancy` | Emotional sounds |
| `overlayStack` | `@mhmo91/schmancy` | Z-index coordinator |
| `windowManager` | `@mhmo91/schmancy/window` | Window registry |
| `teleportationService` | `@mhmo91/schmancy/teleport` | Teleport coordination |
| `reducedMotion$` | `@mhmo91/schmancy/directives` | Reactive reduced-motion preference |
| `fromResizeObserver` | `@mhmo91/schmancy/directives` | RxJS ResizeObserver |
