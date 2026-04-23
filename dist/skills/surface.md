# Surface

> Glass depth container. Every surface is translucent — depth comes from blur intensity.

## Usage

```html
<schmancy-surface type="subtle" rounded="all" fill="all">
  Content on frosted glass
</schmancy-surface>
```

## Theme vs. Surface

A `<schmancy-theme>` only defines the palette (the `--schmancy-sys-color-*` values). It does not paint a background and does not set the inherited text color. `<schmancy-surface>` is what paints the background **and** establishes the `color` that descendant typography inherits.

Without a surface under the theme, typography reads the browser's default color and the app looks broken (white-on-white or black-on-black). The minimal correct app skeleton is always:

```html
<schmancy-theme root scheme="auto">
  <schmancy-surface type="solid" fill="all">
    <!-- your app -->
  </schmancy-surface>
</schmancy-theme>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | string | `'subtle'` | Glass depth level (see below) |
| `fill` | string | `'auto'` | `'all'`, `'width'`, `'height'`, `'auto'` |
| `rounded` | string | `'none'` | `'none'`, `'top'`, `'bottom'`, `'left'`, `'right'`, `'all'` |
| `elevation` | number | `0` | Glow intensity 0-5 (primary-colored glow, not shadow) |
| `clickable` | boolean | `false` | Adds luminous hover + spring press |

## Surface Types

### Structural (glass depth model)

| Type | Opacity | Blur | Use for |
|------|---------|------|---------|
| `solid` | 92% | — | Dense glass ground layer, highest readability |
| `subtle` | 78% | 8px | Frosted panels, default containers |
| `glass` | 55% | 16px | Dialogs, dropdowns, overlays |
| `luminous` | 42% | 20px | Hero panels, featured content |

### Semantic (tinted glass)
`primary`, `secondary`, `tertiary`, `error`, `success`, `warning`, `info`
Each applies a translucent tint of its color + 4px blur.

### Utility
- `transparent` — no background
- `outlined` — border only

## Examples

```html
<!-- Page background -->
<schmancy-surface type="solid" fill="all" rounded="none">
  <slot></slot>
</schmancy-surface>

<!-- Card-like container -->
<schmancy-surface type="subtle" rounded="all" elevation="1">
  <div class="p-4">Frosted panel with glow</div>
</schmancy-surface>

<!-- Dialog surface (used internally by schmancy-dialog) -->
<schmancy-surface type="glass" rounded="all">
  <div class="p-6">Glass overlay content</div>
</schmancy-surface>

<!-- Hero panel with glow halo -->
<schmancy-surface type="luminous" rounded="all" elevation="3">
  <div class="p-8">Featured content</div>
</schmancy-surface>

<!-- Clickable surface with spring physics -->
<schmancy-surface type="subtle" rounded="all" clickable @click=${handler}>
  Hover: lift + glow. Press: spring compress.
</schmancy-surface>

<!-- Error state -->
<schmancy-surface type="error" rounded="all">
  <div class="p-3">Something went wrong</div>
</schmancy-surface>
```

## Elevation (Glow-based)

Elevation 1-5 applies a primary-colored glow underneath the surface:
```
Level 1: subtle glow (15% primary)
Level 5: strong glow (42% primary)
```

## Paint Containment

`glass` and `luminous` types automatically apply `contain: content` for GPU optimization.
