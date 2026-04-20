# schmancy-divider

> Horizontal or vertical divider line with grow animation.

## Usage
```html
<schmancy-divider></schmancy-divider>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| vertical | boolean | `false` | Vertical orientation (use inside flex/grid) |
| outline | `'default'\|'variant'` | `'variant'` | Line color intensity |
| grow | `'start'\|'end'\|'both'` | `'start'` | Animation origin direction |

## Examples
```html
<!-- Horizontal divider -->
<schmancy-divider></schmancy-divider>

<!-- Vertical divider in a flex container -->
<div class="flex items-stretch h-16">
  <span>Left</span>
  <schmancy-divider vertical></schmancy-divider>
  <span>Right</span>
</div>

<!-- Grow from center -->
<schmancy-divider grow="both"></schmancy-divider>
```
