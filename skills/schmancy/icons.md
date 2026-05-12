# schmancy-icon

Renders a Material Symbol as an inline SVG. Path data is supplied at build
time by the `schmancy-icons` Vite plugin — no font file, no network request,
works offline from first byte.

## Usage

```html
<schmancy-icon>home</schmancy-icon>
<schmancy-icon>delete</schmancy-icon>
```

Slot text IS the icon name (Material Symbols ligature name). No properties needed.

## Sizing

Size is set with Tailwind `text-*` on the host. Default is `24px` (`text-2xl`).
`width` and `height` track `font-size` via `1em`.

```html
<schmancy-icon class="text-base">close</schmancy-icon>   <!-- 16px -->
<schmancy-icon class="text-xl">search</schmancy-icon>    <!-- 20px -->
<schmancy-icon class="text-2xl">home</schmancy-icon>     <!-- 24px (default) -->
<schmancy-icon class="text-4xl">check_circle</schmancy-icon> <!-- 36px -->
```

## Color

Inherits `currentColor`. Override with Tailwind color utilities:

```html
<schmancy-icon class="text-primary-default">star</schmancy-icon>
<schmancy-icon class="opacity-50">info</schmancy-icon>
```

## Fill variant (active states)

Append `-fill` to the icon name for the filled variant. No CSS animation —
a clean swap between outlined and filled symbols:

```html
<!-- Static filled -->
<schmancy-icon>favorite-fill</schmancy-icon>

<!-- Dynamic active state -->
<schmancy-icon>${active ? 'home-fill' : 'home'}</schmancy-icon>
```

The plugin auto-includes `-fill` variants for every detected base icon.

## Vite plugin setup (web workspace)

The plugin scans all `.ts` source files at build start and injects
`window.__siIcons = { name: 'svgPathData', ... }` inline in `<head>`.

```typescript
// web/vite.config.ts
import { schmancyIcons } from './plugins/schmancy-icons.ts'

export default defineConfig({
  plugins: [
    schmancyIcons({
      // Icon names used in runtime variables (not statically detectable).
      // Type them as SchmancyIconName in consuming code.
      additional: ['widgets', 'inventory_2', 'description'],
    }),
  ],
})
```

### Adding icons for dynamic usage

Any icon name carried in a variable at runtime must be declared in `additional`.
TypeScript enforcement: the plugin generates `src/types/icon-name.d.ts` with
a `SchmancyIconName` union of every icon in the bundle. Type dynamic icon props
as `SchmancyIconName` to get compile-time coverage.

```typescript
import type { SchmancyIconName } from './types/icon-name'

@property({ type: String }) icon: SchmancyIconName = 'home'
```

## What was removed

The following properties are **gone** — the component has no public API beyond
slot text content:

| Removed | Replacement |
|---------|-------------|
| `size="lg"` | `class="text-4xl"` (Tailwind) |
| `fill`, `weight`, `grade`, `variant` | n/a — use `-fill` suffix for filled, rest unsupported |
| `icon="name"` prop | slot text: `<schmancy-icon>name</schmancy-icon>` |
| Google Fonts auto-load | n/a — self-contained inline SVG |

## How it works

1. Vite plugin walks `web/src/**/*.ts`, extracts icon names from
   `<schmancy-icon>name</schmancy-icon>` and `icon="name"` patterns.
2. Reads `@material-symbols/svg-400/outlined/{name}.svg`, extracts the `d`
   attribute from each `<path>`.
3. Injects `<script>window.__siIcons={...}</script>` before `</head>`.
4. `schmancy-icon.connectedCallback` reads `this.textContent`, looks up
   `window.__siIcons[name]`, and renders `<svg><path d="..."/></svg>` inside
   its shadow DOM.

No `<use>` references — those can't cross shadow DOM boundaries.
