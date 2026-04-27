# Claude Design brief: building with schmancy

You're designing or redesigning a web page. Use the `@mhmo91/schmancy` component library for every interactive tag, every surface, every color.

## Rule 0 — before anything else, probe the runtime

```js
window.schmancy.help()
// → { elements: [{ tag, summary }...], services: [{ name, summary }...] }
```

**Every time you reach for a "missing" component, grep this list first.** A previous Claude Design session filed seven "missing primitive" complaints; four of the seven already existed (`<schmancy-badge>`, `<schmancy-avatar>`, `<schmancy-steps>`, `<schmancy-divider vertical>`). Hand-rolling a component that already ships wastes your effort and diverges from the theme system.

When in doubt, the order is:

1. `window.schmancy.help()` — scan the `elements[]` summaries for a tag that fits what you're about to build.
2. `window.schmancy.help('schmancy-<tag>')` — exact attributes, enum values, events, slots, copy-pasteable examples.
3. **Only then** compose from primitives or roll a custom element.

Every custom component you write that duplicates an existing `<schmancy-*>` tag is a regression.

## Pin URL

```
https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.22/dist/agent/schmancy.agent.js
```

One script tag installs 100+ `<schmancy-*>` custom elements plus the `window.schmancy.*` discovery API. No bundler, no npm install, no bare specifiers.

## App shell (always this shape)

```html
<!doctype html>
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.22/dist/agent/schmancy.agent.js';
</script>

<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <!-- your page content -->
    <schmancy-skill></schmancy-skill>
  </schmancy-surface>
</schmancy-theme>
```

- `<schmancy-theme>` generates a Material 3 palette from a seed color + scheme. Attribute `root` publishes tokens onto `document.body`.
- `<schmancy-surface>` picks up theme tokens for background / on-color / elevation. Nest surfaces for hierarchical color stacking.
- `<schmancy-skill>` (drop once on the page) installs `window.schmancy.help()`, `.tokens()`, `.capabilities()`, etc.

## Discovery API surface

```js
window.schmancy.help()
// → { elements: [...], services: [...] } — every tag and service with a one-line summary

window.schmancy.help('schmancy-button')
// → full declaration: attributes (with enum values[]), events, slots,
//   cssParts, cssProperties, examples (copy-pasteable), platformPrimitive

window.schmancy.tokens()
// → every --schmancy-sys-color-* custom property name

window.schmancy.capabilities()
// → { popover, declarativeShadowDom, scopedRegistries, trustedTypes,
//     cssRegisteredProperties, elementInternalsAria, formAssociated,
//     adoptedStyleSheets }
```

`help(tag)` is authoritative. Its `examples[]` array is copy-pasteable. Its `platformPrimitive` hint tells you what native element the tag semantically wraps, so you can degrade gracefully if a tag fails to register.

## Common "I need this" → use this existing tag

| Need | Existing tag | Notes |
|---|---|---|
| Status pill, count chip, warning label | `<schmancy-badge>` | `tone`, `size`, `shape`, icon slot |
| Initials circle, user chip | `<schmancy-avatar>` | `initials` / `src` / `icon`, 6 sizes, color, shape, status dot |
| Filter chips at the top of a list | `<schmancy-chips>` + `<schmancy-filter-chip>` | Multi-select, `change` event |
| Stepped workflow / stage rail | `<schmancy-steps>` + `<schmancy-step>` | `position`, `completed`, lock-back |
| Vertical or horizontal rule | `<schmancy-divider vertical>` | Single tag, boolean attribute |
| Side panel / drawer with body preview | `sheet.open({ component, position })` | Imperative service; handles backdrop + focus trap + router |
| Modal confirm | `$dialog.confirm({ title, message, confirmText, cancelText })` | Imperative — do not roll your own dialog element |
| Toast / snackbar | `$notify.success('…')` / `.error()` / `.info()` | Imperative |
| List of similarly-shaped rows | `<schmancy-list>` + `<schmancy-list-item>` | `leading` / `trailing` slots |
| Card with media + body + action row | `<schmancy-card>` + `-card-media` + `-card-content` + `-card-action` | Full stack pre-styled |
| Typography | `<schmancy-typography type="…" token="…">` | 5 types × 3 tokens |

If you're unsure a tag exists, call `help()`. Never ship a hand-rolled equivalent.

## Rules

1. **Every UI tag is `<schmancy-*>`.** `<button>` → `<schmancy-button>`. `<input>` → `<schmancy-input>`. `<li>` → `<schmancy-list-item>`.
2. **Colors: Tailwind utility classes against schmancy tokens.** Every `--schmancy-sys-color-*` token is exposed as a Tailwind color utility.
   - `bg-primary-default`, `bg-primary-container`, `text-primary-on`
   - `bg-surface-default`, `bg-surface-low`, `bg-surface-high`, `text-surface-on`, `text-surface-onVariant`
   - `border-outline`, `border-outline-variant`
   - `bg-secondary-container`, `bg-error-default`, `bg-success-default`, `bg-warning-default`
   - **Never hex (`#6200ee`), never arbitrary values (`bg-[#ff0000]`).** Both defeat theming.
3. **Forms:** wrap form controls in `<schmancy-form>`. Its `submit` event fires with a `FormData` payload — no manual walking of inputs. Every form control is form-associated via `ElementInternals`, so `new FormData(form)` just works.
4. **Layout:**
   - `<schmancy-page rows="auto_1fr_auto">` for app shell — fills viewport, suppresses double-tap zoom and pull-to-refresh.
   - `<schmancy-nav-drawer>` for responsive sidebar + app-bar + content (persistent on desktop, modal on mobile).
   - `<schmancy-scroll>` when you need debounced scroll events or hidden scrollbars.
   - Use Tailwind's `grid` / `flex` utilities directly for layout math. Do NOT build `<schmancy-stack>` / `<schmancy-inline>` / `<schmancy-grid>` — Tailwind covers these; `<schmancy-grid>` is explicitly deprecated.
5. **Overlays use imperative services, not element APIs:**
   ```js
   import { $dialog, sheet, $notify, SchmancySheetPosition } from 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.22/dist/agent/schmancy.agent.js';
   $dialog.confirm({ title: 'Delete?', message: 'Cannot be undone.', confirmText: 'Delete', cancelText: 'Keep' });
   sheet.open({ component: new MyEditor(), position: SchmancySheetPosition.Side });
   $notify.success('Saved');
   ```
6. **Accessibility is built in.** Components handle ARIA roles, focus management, keyboard navigation, form validation messages. Don't re-implement. Do provide `aria-label` on icon-only buttons (`<schmancy-icon-button aria-label="Close">`).
7. **Typography:** use `<schmancy-typography type="..." token="...">`. Type = `display` / `headline` / `title` / `body` / `label`. Token = `lg` / `md` / `sm`.
8. **Icons:** `<schmancy-icon>close</schmancy-icon>` renders a Material Symbols glyph. Pass the icon name as text content.

## Minimum working page

```html
<!doctype html>
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.22/dist/agent/schmancy.agent.js';
</script>

<schmancy-theme root scheme="auto" color="#6200ee">
  <schmancy-page rows="auto_1fr_auto" class="min-h-screen">
    <schmancy-nav-drawer-appbar class="bg-surface-low px-4 py-3 flex items-center gap-3">
      <schmancy-icon-button aria-label="Menu">
        <schmancy-icon>menu</schmancy-icon>
      </schmancy-icon-button>
      <schmancy-typography type="title" token="lg">Dashboard</schmancy-typography>
    </schmancy-nav-drawer-appbar>

    <schmancy-surface type="solid" fill="all" class="p-6">
      <schmancy-card type="elevated" class="max-w-md">
        <schmancy-card-content class="p-6">
          <schmancy-typography type="headline" token="sm" class="mb-2">Welcome</schmancy-typography>
          <schmancy-typography type="body" token="md" class="text-surface-onVariant">
            A themed page built with schmancy primitives.
          </schmancy-typography>
        </schmancy-card-content>
        <schmancy-card-action>
          <schmancy-button variant="text">Skip</schmancy-button>
          <schmancy-button variant="filled">Get started</schmancy-button>
        </schmancy-card-action>
      </schmancy-card>
    </schmancy-surface>

    <schmancy-navigation-bar activeIndex="0" class="bg-surface-low">
      <schmancy-navigation-bar-item icon="home" label="Home" active></schmancy-navigation-bar-item>
      <schmancy-navigation-bar-item icon="search" label="Search"></schmancy-navigation-bar-item>
      <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
    </schmancy-navigation-bar>

    <schmancy-skill></schmancy-skill>
  </schmancy-page>
</schmancy-theme>
```

## When the design asks for something you don't recognize

1. `window.schmancy.help()` — scan `elements[]` summaries.
2. `window.schmancy.help('schmancy-<tag>')` — exact attributes + copy-pasteable examples.
3. Only after both turn up nothing, compose from primitives. Custom elements are the last resort.

## Report bugs

github.com/mhmo91/schmancy — include `window.schmancy.capabilities()`, the minimum failing HTML, and `window.schmancy.manifest.schemaVersion`.
