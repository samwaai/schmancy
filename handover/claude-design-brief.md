# Claude Design brief: building with schmancy

You're designing or redesigning a web page. Use the `@mhmo91/schmancy`
component library for every interactive tag, every surface, every
color. This file is the operating manual — paste it in alongside the
design ask.

## Pin URL

```
https://esm.sh/@mhmo91/schmancy/agent
```

One module import installs every `<schmancy-*>` custom element. No
bundler, no npm install, no bare specifiers. The same URL also
re-exports the full library surface (`theme`, `area`, `state`, `show`,
`lazy`, every directive, every service, `SchmancyElement`) for in-page
script code.

For introspection — every tag's attributes, events, slots, CSS parts,
plus the `values` array on every typed attribute — read the static
manifest at `https://esm.sh/@mhmo91/schmancy/agent/manifest` (JSON,
shape follows Custom Elements Manifest v1).

## App shell (always this shape)

```html
<!doctype html>
<script type="module">
  import 'https://esm.sh/@mhmo91/schmancy/agent';
</script>

<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <!-- your page content -->
  </schmancy-surface>
</schmancy-theme>
```

- `<schmancy-theme>` generates a Material 3 palette from a seed color +
  scheme. Attribute `root` publishes tokens onto `document.body`.
- `<schmancy-surface>` picks up theme tokens for background / on-color
  / elevation. Nest surfaces for hierarchical color stacking.

## Discovery — read the static manifest

```js
const manifest = await fetch('https://esm.sh/@mhmo91/schmancy/agent/manifest')
  .then(r => r.json())

// Every tag, attribute, event, slot, CSS part, CSS property.
// Typed-attribute enums surface as `values: ['filled', 'tonal', ...]`
// so you don't parse `"'filled' | 'tonal' | ..."` strings.
manifest.modules
  .flatMap(m => m.declarations)
  .filter(d => d.kind === 'class' && d.tagName?.startsWith('schmancy-'))
```

The manifest is the authoritative source. Pull a tag's declaration
once at page-build time and use the `attributes`, `events`, `slots`,
and `cssProperties` arrays to drive the rest of the page.

## Rules

1. **Every UI tag is `<schmancy-*>`.** Use `<schmancy-button>`, not
   `<button>`. `<schmancy-input>`, not `<input>`. `<schmancy-list-item>`,
   not `<li>`. Look up the exact tag in the manifest.
2. **Colors: Tailwind utility classes against schmancy tokens.** Every
   `--schmancy-sys-color-*` token is exposed as a Tailwind color
   utility.
   - `bg-primary-default`, `bg-primary-container`, `text-primary-on`
   - `bg-surface-default`, `bg-surface-low`, `bg-surface-high`, `text-surface-on`
   - `border-outline`, `border-outline-variant`
   - `bg-secondary-container`, `bg-error-default`, `bg-success-default`, `bg-warning-default`
   - **Never hex (`#6200ee`), never arbitrary values (`bg-[#ff0000]`).**
     Both defeat theming.
3. **Forms:** wrap form controls in `<schmancy-form>`. Its `submit`
   event fires with a `FormData` payload — no manual walking of inputs.
   Every form control (`<schmancy-input>`, `<schmancy-select>`,
   `<schmancy-checkbox>`, etc.) is form-associated via
   `ElementInternals`, so `new FormData(form)` just works.
4. **Layout:**
   - `<schmancy-page rows="auto_1fr_auto">` for app shell — fills
     viewport, suppresses double-tap zoom and pull-to-refresh.
   - `<schmancy-nav-drawer>` for responsive sidebar + app-bar +
     content (persistent on desktop, modal on mobile).
   - `<schmancy-scroll>` when you need debounced scroll events or
     hidden scrollbars.
   - `<schmancy-grid>` and `<schmancy-flex>` for layout primitives
     with design intent; raw Tailwind `grid` / `flex` utilities for
     incidental layout math.
5. **Overlays use the imperative service, not element APIs:**
   ```js
   import { show, confirm, prompt } from 'https://esm.sh/@mhmo91/schmancy/agent';
   import { $notify } from 'https://esm.sh/@mhmo91/schmancy/agent';

   show(new MyEditor());                          // centered fallback
   show(new QuickPicker(), { anchor: ev });       // anchored at click
   show(new SheetForm());                         // narrow viewport → sheet (auto)
   await confirm({ title: 'Delete?', message: 'Cannot be undone.', confirmText: 'Delete' });
   $notify.success('Saved');
   ```
   `show()` is the single overlay primitive — layout (centered /
   anchored / sheet) is chosen automatically by viewport + anchor
   presence. There is no `$dialog` and no `sheet` service.
6. **Accessibility is built in.** Components handle ARIA roles, focus
   management, keyboard navigation, form validation messages. Don't
   re-implement. Do provide `aria-label` on icon-only buttons
   (`<schmancy-icon-button aria-label="Close">`).
7. **Typography:** use `<schmancy-typography type="..." token="...">`
   for text. Type = `display` / `headline` / `title` / `body` / `label`.
   Token = `lg` / `md` / `sm`.
8. **Icons:** `<schmancy-icon>close</schmancy-icon>` renders a Material
   Symbols glyph. Pass the icon name as text content.

## Minimum working page (copy, paste, it runs)

```html
<!doctype html>
<script type="module">
  import 'https://esm.sh/@mhmo91/schmancy/agent';
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
  </schmancy-page>
</schmancy-theme>
```

## When the design asks for something you don't recognize

1. Fetch the manifest and filter `declarations` by `tagName` to find a
   tag that fits the role.
2. Read the matching declaration's `attributes`, `slots`, `events`,
   and `cssProperties` arrays — they're the contract.
3. If no tag fits, compose from primitives (`<schmancy-surface>` +
   `<schmancy-button>` + `<schmancy-grid>` / `<schmancy-flex>` for
   layout) before reaching for a one-off custom element.

## Report bugs

`github.com/mhmo91/schmancy` — include the schmancy version
(`https://esm.sh/@mhmo91/schmancy/package.json`), the minimum failing
HTML, and the manifest's `schemaVersion`.
