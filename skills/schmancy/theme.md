# schmancy-theme

> Root theme provider that generates color tokens from a source color and distributes them as CSS custom properties.

## Usage
```html
<schmancy-theme color="#6200ee" scheme="auto" root>
  <schmancy-surface type="solid" fill="all">
    <your-app></your-app>
  </schmancy-surface>
</schmancy-theme>
```

## Theme vs. Surface

`<schmancy-theme>` only defines the palette — it sets the values of the `--schmancy-sys-color-*` custom properties on its subtree. It does **not** paint a background and does **not** establish an inherited text color.

A `<schmancy-surface>` is what actually paints the background and sets the `color` that descendant typography inherits. Without a surface between theme and content, typography falls back to the browser default (white-on-white or black-on-black depending on scheme) and the app looks broken.

**Minimal correct skeleton:** `theme` → `surface` → content.

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | Random hex | Primary source color in hex format (e.g. `#6200ee`) |
| `scheme` | `'dark' \| 'light' \| 'auto'` | `'auto'` | Color scheme. `auto` follows system preference |
| `root` | `boolean` | `false` | Apply CSS variables to `document.body` instead of shadow host |
| `locale` | `string` | `navigator.language` | Locale for number/date formatting (e.g. `de-DE`, `ar-SA`) |
| `name` | `string` | Auto-generated | Unique name for session storage persistence |

## Theme Service (`theme`)
```typescript
import { theme } from '@mhmo91/schmancy'

theme.scheme          // 'dark' | 'light' | 'auto' (sync)
theme.color           // Current hex color (sync)
theme.scheme$         // Observable<string>
theme.resolvedScheme$ // Observable<'dark'|'light'> (resolves 'auto')

theme.setScheme('dark')
theme.setColor('#2196f3')
theme.toggleScheme()
theme.isDarkMode()    // Observable<boolean>
theme.setFullscreen(true)
```

## Examples
```html
<!-- App root with dark blue theme -->
<schmancy-theme color="#1565c0" scheme="dark" root>
  <schmancy-surface type="solid" fill="all">
    <my-app></my-app>
  </schmancy-surface>
</schmancy-theme>

<!-- Nested theme override for a section (surface optional — inherits
     on-color from ancestor surface unless you want a new background) -->
<schmancy-theme color="#e91e63" scheme="light">
  <div class="accent-section">...</div>
</schmancy-theme>

<!-- Arabic locale -->
<schmancy-theme color="#4caf50" locale="ar-SA" root>
  <schmancy-surface type="solid" fill="all">
    <my-app></my-app>
  </schmancy-surface>
</schmancy-theme>
```

## Tailwind utilities

Every `--schmancy-sys-color-*` token is aliased as `--color-*` in the theme stylesheet. Under Tailwind v4, a registered `--color-X` auto-generates the full utility namespace: `bg-X`, `text-X`, `border-X`, `ring-X`, `fill-X`, `stroke-X`, etc.

```
--schmancy-sys-color-{token}   →   --color-{token}   →   bg-{token} · text-{token} · border-{token}
```

**The shortcut utility is the readable form of a token that exists for genuine semantic reuse and is registered in the workspace being edited.** `border-outline-variant` reads better than `border-[var(--schmancy-sys-color-outlineVariant)]` because `outlineVariant` is a reused semantic color aliased into every consuming workspace. A trivial or one-off layout value (`grid-rows-[auto_1fr]`, `max-w-[720px]`) stays in its portable arbitrary form — aliasing it behind a workspace-local `@theme` token adds a name no second call site uses and a build dependency a sibling workspace's Tailwind does not resolve.

Multi-word tokens are registered in **both** camelCase and kebab-case — both forms work. Use whichever reads better:

```html
<div class="border-outlineVariant">...</div>
<div class="border-outline-variant">...</div>   <!-- same thing -->
```

### Token map

**Base**
```
outline · outline-variant (a.k.a. outlineVariant)
scrim · shadow
```

**Surface** (backgrounds + on-colors)
```
surface-default · surface-on · surface-on-variant (surface-onVariant)
surface-dim · surface-bright · surface-tint
surface-lowest · surface-low · surface-container · surface-high · surface-highest
surface-containerLowest · surface-containerLow · surface-containerHigh · surface-containerHighest
surface-inverse (inverse-surface) · surface-inverseOn (inverse-on-surface)
```
*(containerLow/High/Lowest/Highest exist only in camelCase — there's no kebab variant for those four.)*

**Primary / Secondary / Tertiary** (same shape for each)
```
{color}-default · {color}-on
{color}-container · {color}-on-container ({color}-onContainer)
{color}-fixed · {color}-fixed-dim ({color}-fixedDim)
{color}-on-fixed ({color}-onFixed) · {color}-on-fixed-variant ({color}-onFixedVariant)
{color}-inverse (inverse-{color})     # primary only
```

**Error / Success / Warning / Info**
```
{color}-default · {color}-on
{color}-container · {color}-on-container ({color}-onContainer)
```

### Usage

```html
<div class="bg-surface-default text-surface-on">Body copy</div>
<div class="bg-surface-containerLow border border-outline-variant">Card</div>
<button class="bg-primary-default text-primary-on">Primary action</button>
<div class="text-error-default">Validation message</div>
<div class="bg-success-container text-success-on-container">Saved.</div>
```

### When the arbitrary-value form is still correct

Only reach for `bg-[var(--schmancy-sys-color-X)]` when the token isn't aliased — e.g. a custom `--schmancy-*` property you've registered yourself.

## Typography override

`<schmancy-theme>` ships no font attribute. To swap the app's typeface, override `--schmancy-font-family` on `:root` in a consumer stylesheet. Schmancy's theme stylesheet reads it with a `sans-serif` fallback and fans it out to `--md-ref-typeface-brand`, `--md-ref-typeface-plain`, and `--default-font-family`, so every `<schmancy-*>` component picks it up via the cascade:

```css
:root {
  --schmancy-font-family: 'Space Grotesk', sans-serif;
  font-family: var(--schmancy-font-family);
}
```

The second line (`font-family: var(...)`) makes the typeface inherit by non-schmancy elements inside your app too — without it, plain `<div>`s use the browser default.

There is currently **no `--schmancy-font-mono` equivalent**. `--font-mono` in [theme.style.css](../../src/theme/theme.style.css) hardcodes Tailwind's default `ui-monospace, SFMono-Regular, …` stack. Consumers that want a custom monospace typeface either (a) use Tailwind's `font-mono` utility with the default stack and accept it, or (b) override `--font-mono` directly on `:root` with the same cascade pattern as the sans hook. Option (b) is a local escape hatch, not a schmancy-blessed API — expect future schmancy versions to add a proper `--schmancy-font-mono` hook instead.

## Notes
- Color and scheme persist to `sessionStorage` per instance
- Generates success/warning/info/error semantic color tokens automatically
