# Schmancy Layout

> Layout primitives: `schmancy-grid`, `schmancy-flex`, `schmancy-scroll`, plus `sch-grid` / `sch-flex` v2 variants.

> **Prefer Tailwind classes directly** for layout in new code. These components exist for quick composition and design-token consistency (`gap="sm|md|lg"` maps to theme spacing).

## schmancy-grid
```html
<schmancy-grid cols="1fr 2fr 1fr" gap="md" align="center">
  <div>Left</div><div>Center</div><div>Right</div>
</schmancy-grid>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `flow` | `'row' \| 'col' \| 'dense' \| 'row-dense' \| 'col-dense'` | `'row'` | Grid auto-flow |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'stretch'` | Item alignment |
| `justify` | `'start' \| 'center' \| 'end' \| 'stretch'` | `'stretch'` | Item justification |
| `content` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'around' \| 'evenly' \| 'between'` | — | Align-content |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'none'` | Grid gap |
| `cols` | string | — | grid-template-columns (e.g. `"1fr 2fr"`) |
| `rows` | string | — | grid-template-rows |
| `rcols` | object | — | Responsive cols: `{ sm: '1fr', md: '1fr 1fr', lg: '1fr 2fr 1fr' }` |
| `wrap` | boolean | `false` | Grid auto-wrap |

## schmancy-flex
```html
<schmancy-flex flow="row" justify="between" align="center" gap="md">
  <div>Logo</div><div>Nav</div>
</schmancy-flex>
```

| Property | Type | Default |
|----------|------|---------|
| `flow` | `'row' \| 'row-reverse' \| 'col' \| 'col-reverse'` | `'col'` |
| `wrap` | `'wrap' \| 'nowrap' \| 'wrap-reverse'` | `'wrap'` |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'start'` |
| `justify` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'between'` | `'start'` |
| `gap` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'none'` |

## schmancy-scroll
```html
<schmancy-scroll hide direction="vertical" name="main">
  <!-- long content -->
</schmancy-scroll>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hide` | boolean | `false` | Hide scrollbar in supported browsers |
| `direction` | `'vertical' \| 'horizontal' \| 'both'` | `'both'` | Scroll axes |
| `name` | string | — | Identifier for global scroll events |
| `debounce` | number | — | Debounce time in ms for scroll events |

Smooth scroll-behavior, overscroll containment, and support for flex-shrink sizing.

## sch-grid / sch-flex (v2)

Reflected-attribute variants optimized for styling via CSS selectors. Same prop model as the classic components with a `sch-` prefix. Use when you need to target the layout from parent CSS without Tailwind.

## Notes
- All layout components extend the base `Layout` class which exposes pass-through CSS properties (padding, margin, width, position, border, etc.).
- Prefer Tailwind (`class="flex items-center gap-2"`) for new code — these components remain for consistent theme-driven gaps and rapid prototyping.
