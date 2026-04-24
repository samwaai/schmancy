---
name: schmancy
description: UI patterns, component APIs, and conventions for the @mhmo91/schmancy web-component library (Lit + RxJS + Tailwind) — the exclusive UI stack in this repo's `web/` workspace. Fire this skill on ANY web-UI work, even when the user doesn't name schmancy explicitly — including adding or editing a component, building a form, showing a dialog / toast / side drawer / bottom sheet, wiring routing, reading or writing a context, styling with theme tokens, adding a drop zone / file input / date picker / autocomplete, working with `$LitElement`, or touching any `<schmancy-*>` tag. Also fire on prompts like "build a page", "add a modal", "wire a route", "save user prefs in storage", "animate this", "style with our theme", "make a notification", "how do I do X in Lit", "my drag-and-drop", "dark mode toggle".
---

# Schmancy

Web-component UI library on Lit + RxJS + Tailwind CSS. This skill bundles the full library reference as supporting files alongside this SKILL.md.

## How to use this skill

All reference files live in this directory. Read by filename.

1. **Start with `INDEX.md`** for the full catalog organized by job (foundations / atoms / forms / navigation / overlays / interaction / feedback / display).
2. **Before writing any `<schmancy-X>` tag**, read `X.md`. Example: `<schmancy-button>` → `button.md`.
3. **Before editing foundations** (routing, state, base class, theme), read the matching foundation file below.
4. **Apply the conventions** at the end of this file.

## Foundations (the framework pieces — touch first)

| Piece | Read |
|-------|------|
| Routing (`<schmancy-area>`, `<schmancy-route>`, `area.push()`, `lazy()`) | `area.md` |
| State (`createContext`, `@select`, `@selectItem`) | `store.md` |
| Base class (`$LitElement`) | `mixins.md` |
| Theme (`<schmancy-theme>`, `theme` service) | `theme.md` |
| Directives (`magnetic`, `cursorGlow`, `gravity`, `reveal`, `animateText`, …) | `directives.md` |
| Spring physics presets | `animation.md` |

## Overlay services (prefer over tags)

For modals, toasts, sheets, side drawers — reach for the **imperative service API** first:

```typescript
import { $dialog, $notify, schmancyContentDrawer, sheet, SchmancySheetPosition } from '@mhmo91/schmancy'

$dialog.component(new EditForm())                       // modal
$dialog.component(new QuickPicker(), { position: e })    // anchored modal
$notify.success('Saved'); $notify.error('Failed')        // toast
schmancyContentDrawer.open({ component: new Detail() })  // side panel
sheet.open({ component: new Picker(), position: SchmancySheetPosition.BOTTOM })  // bottom sheet
```

References: `dialog.md`, `notification.md`, `content-drawer.md`, `sheet.md`.

Use component tags (`<schmancy-menu>`, `<schmancy-dropdown>`, `<schmancy-tooltip>`, `<schmancy-lightbox>`, `<schmancy-expand>`) only when the tag is the natural fit (anchored panels, tooltips, galleries).

## Non-negotiable conventions

**Component authoring**
- Every component extends `$LitElement(style?)`. Never raw `LitElement`.
- Every RxJS subscription ends with `.pipe(takeUntil(this.disconnecting))`.
- Register the tag in `HTMLElementTagNameMap` for TypeScript.

**State**
- Contexts live at module scope. Many small contexts beat one monolith.
- Gate subscriptions with `filter(() => ctx.ready)` when reading persisted contexts.
- Storage tiers: `'memory'` (regenerable) · `'session'` (per-tab) · `'local'` (user prefs) · `'indexeddb'` (>100-entry collections).

**Routing**
- Route guards are `Observable<boolean>`, never cached booleans.
- `when="tag-name"` must exactly match `@customElement('tag-name')`.
- Lazy-load route components: `lazy(() => import('./page'))`.
- After auth/permission guards, use `historyStrategy: 'replace'` or `'pop'` — never `'push'`.

**Templates**
- Lists: `repeat(items, i => i.id, tpl)`. Never `.map()`.
- View switching: `cache(...)`.
- Expensive work: `guard([deps], () => expensive())`.
- Conditionals: every `${...}` placeholder whose value is a `TemplateResult` or `nothing` uses a directive imported from `lit/directives/` — `when(condition, () => html\`...\`, () => html\`...\`?)` for a two-way branch, `choose(value, [['case', () => html\`...\`], …])` for a three-or-more-way dispatch, `ifDefined(maybeUndef)` for nullable attribute values. A chain of `?:` or `&&` expressions whose else-arm is `nothing` evaluates every branch on every render and defeats lit's directive-aware diffing; the pre-edit hook flags this as `NO_TERNARY_NOTHING_DISPATCH`.
- DOM access: `ref(createRef())`.
- `classMap(this.classMap({...}))` must be the sole expression in `class=` — never mix with string interpolation.

**Styling**
- Styling uses Tailwind and schmancy tokens. The `css` template passed to `$LitElement` contains only `:host` rules, `@keyframes`, and selectors targeting vendor pseudo-elements (`::-webkit-*`, `::-moz-*`). Other styling is set through Tailwind utility classes and schmancy theme tokens on the `class=` attribute. The `style=` attribute holds per-instance dynamic values only (e.g. `style="--tide: ${value}"`).
  Remediation: move declarations to Tailwind on the `class=` attribute (`backdrop-filter: blur(20px)` → `backdrop-blur-xl`; `color-mix(in oklch, Canvas 72%, transparent)` → `bg-surface/70`; `border-radius: 14px` → `rounded-2xl`; `transition: opacity 80ms linear` → `transition-opacity duration-75 ease-linear`). When a visual pattern seems to want its own class (like `.glass`), check `INDEX.md` — schmancy likely ships the component.
- Colors: **Tailwind theme classes** (`bg-primary-default`, `text-surface-on`, `border-outline-variant`, …) — every `--schmancy-sys-color-*` token is exposed as a Tailwind color utility, so prefer the Tailwind class. Fall back to the `--schmancy-sys-color-*` CSS var only when Tailwind lacks a utility for the specific property. Never hardcoded hex, never arbitrary values like `bg-[#ff0000]`.
- No `setTimeout` / `setInterval` / `addEventListener` — use RxJS (`timer`, `interval`, `fromEvent`).

**Accessibility (combobox forms)**
```typescript
role="combobox"
aria-haspopup="listbox"
aria-expanded=${this._open}
aria-controls="listbox-id"
```
Plus a live region: `<div id="live-status" role="status" aria-live="polite" class="sr-only"></div>`.

## Minimal app skeleton

```typescript
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-scroll>
      <schmancy-area
        name="root"
        .default=${lazy(() => import('./home.page'))}
      >
        <schmancy-route when="home-page"
          .component=${lazy(() => import('./home.page'))}></schmancy-route>

        <schmancy-route when="app-index"
          .component=${lazy(() => import('./app.page'))}
          .guard=${authState$.pipe(
            map(u => !!u),
            takeUntil(this.disconnecting),
          )}
          @redirect=${() => area.push({
            component: 'home-page', area: 'root', historyStrategy: 'replace',
          })}></schmancy-route>
      </schmancy-area>
    </schmancy-scroll>
  </schmancy-surface>
</schmancy-theme>
```

## Workflow

1. User describes a UI task.
2. Read `INDEX.md` to find the relevant components or foundations.
3. Read the specific `.md` files for the APIs involved.
4. Write code that follows the conventions above.
