# Claude Design brief: building with schmancy

You're designing or redesigning a web page. Use the `@mhmo91/schmancy` component library for every interactive tag, every surface, every color. This file is the operating manual — paste it in alongside the design ask.

## Pin URL

```
https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.21/dist/agent/schmancy.agent.js
```

One script tag installs 100+ `<schmancy-*>` custom elements plus the `window.schmancy.*` discovery API. No bundler, no npm install, no bare specifiers.

## App shell (always this shape)

```html
<!doctype html>
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.21/dist/agent/schmancy.agent.js';
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

## Discovery — ask the runtime what's available

```js
window.schmancy.help()
// → { elements: [{ tag, summary }...], services: [{ name, summary }...] }

window.schmancy.help('schmancy-button')
// → full declaration: attributes (with enum values[]), events, slots,
//   cssParts, cssProperties, examples (copy-pastable), platformPrimitive

window.schmancy.tokens()
// → every --schmancy-sys-color-* custom property name, for direct CSS use

window.schmancy.capabilities()
// → { popover, declarativeShadowDom, scopedRegistries, trustedTypes,
//     cssRegisteredProperties, elementInternalsAria, formAssociated,
//     adoptedStyleSheets }
```

`help(tag)` is authoritative. Its `examples[]` array is copy-pastable. Its `platformPrimitive` hint tells you what native element the tag semantically wraps, so you can degrade gracefully if a tag fails to register.

## Rules

1. **Every UI tag is `<schmancy-*>`.** Use `<schmancy-button>`, not `<button>`. `<schmancy-input>`, not `<input>`. `<schmancy-list-item>`, not `<li>`. Probe `help()` for the exact tag and its attributes.
2. **Colors: Tailwind utility classes against schmancy tokens.** Every `--schmancy-sys-color-*` token is exposed as a Tailwind color utility.
   - `bg-primary-default`, `bg-primary-container`, `text-primary-on`
   - `bg-surface-default`, `bg-surface-low`, `bg-surface-high`, `text-surface-on`
   - `border-outline`, `border-outline-variant`
   - `bg-secondary-container`, `bg-error-default`, `bg-success-default`, `bg-warning-default`
   - **Never hex (`#6200ee`), never arbitrary values (`bg-[#ff0000]`).** Both defeat theming.
3. **Forms:** wrap form controls in `<schmancy-form>`. Its `submit` event fires with a `FormData` payload — no manual walking of inputs. Every form control (`<schmancy-input>`, `<schmancy-select>`, `<schmancy-checkbox>`, etc.) is form-associated via `ElementInternals`, so `new FormData(form)` just works.
4. **Layout:**
   - `<schmancy-page rows="auto_1fr_auto">` for app shell — fills viewport, suppresses double-tap zoom and pull-to-refresh.
   - `<schmancy-nav-drawer>` for responsive sidebar + app-bar + content (persistent on desktop, modal on mobile).
   - `<schmancy-scroll>` when you need debounced scroll events or hidden scrollbars.
   - Use Tailwind's `grid` / `flex` utilities directly for layout math — no `<schmancy-grid>` (deprecated).
5. **Overlays use imperative services, not element APIs:**
   ```js
   import { $dialog, sheet, $notify, SchmancySheetPosition } from 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.21/dist/agent/schmancy.agent.js';
   $dialog.confirm({ title: 'Delete?', message: 'Cannot be undone.', confirmText: 'Delete', cancelText: 'Keep' });
   sheet.open({ component: new MyEditor(), position: SchmancySheetPosition.Side });
   $notify.success('Saved');
   ```
6. **Accessibility is built in.** Components handle ARIA roles, focus management, keyboard navigation, form validation messages. Don't re-implement. Do provide `aria-label` on icon-only buttons (`<schmancy-icon-button aria-label="Close">`).
7. **Typography:** use `<schmancy-typography type="..." token="...">` for text. Type = `display` / `headline` / `title` / `body` / `label`. Token = `lg` / `md` / `sm`.
8. **Icons:** `<schmancy-icon>close</schmancy-icon>` renders a Material Symbols glyph. Pass the icon name as text content.

## Minimum working page (copy, paste, it runs)

```html
<!doctype html>
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.21/dist/agent/schmancy.agent.js';
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

1. Call `window.schmancy.help()` and scan the `elements[]` summaries for a tag that fits.
2. Call `window.schmancy.help('schmancy-<tag>')` for exact attributes + copy-pastable examples.
3. If no tag fits, compose from primitives (`<schmancy-surface>` + `<schmancy-button>` + Tailwind layout) before reaching for a custom element.

## Report bugs

github.com/mhmo91/schmancy — include `window.schmancy.capabilities()`, the minimum failing HTML, and `window.schmancy.manifest.schemaVersion`.
