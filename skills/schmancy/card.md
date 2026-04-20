# schmancy-card

> Card container with luminous hover glow and spring press animation. Interactive cards get embedded `cursorGlow` directive.

## Usage
```html
<schmancy-card type="elevated" interactive>
  <div class="p-4">Card content</div>
</schmancy-card>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'elevated' \| 'filled' \| 'outlined'` | `'elevated'` | Visual style |
| `interactive` | `boolean` | `false` | Enables click, cursorGlow, keyboard nav, ripple |
| `disabled` | `boolean` | `false` | Disables interaction |
| `dragged` | `boolean` | `false` | Elevated drag state with extra glow |
| `href` | `string` | `undefined` | URL navigation on click |
| `target` | `string` | `undefined` | Link target (e.g. `_blank`) |
| `role` | `string` | `'article'` | ARIA role (auto-switches to `button`/`link` when interactive) |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| `schmancy-click` | `{ value: type }` | Fired on interactive card click |

## Physics
- **cursorGlow** directive on interactive cards (radius: 200, intensity: 0.1)
- Hover: luminous glow + lift (`translateY(-2px)` for elevated, `-1px` for others)
- Active: spring compress `scale(0.98)` with 100ms transition
- Dragged: enhanced glow + `translateY(-4px)`

## Examples
```html
<!-- Elevated clickable card -->
<schmancy-card type="elevated" interactive>
  <div class="p-4">
    <h3 class="text-surface-on font-medium">Title</h3>
    <p class="text-surface-on-variant">Description</p>
  </div>
</schmancy-card>

<!-- Outlined static card -->
<schmancy-card type="outlined">
  <div class="p-4">Static content</div>
</schmancy-card>

<!-- Link card -->
<schmancy-card type="filled" interactive href="/details" target="_blank">
  <div class="p-4">Opens in new tab</div>
</schmancy-card>
```
