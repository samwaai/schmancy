# Schmancy Spinner - AI Reference

A modern circular loading spinner with contextual color inheritance and optional glass morphism effect.

```js
// Component Tag
<schmancy-spinner
  color="primary|on-primary|secondary|on-secondary|tertiary|on-tertiary|error|on-error|success|on-success|surface|on-surface|surface-variant|on-surface-variant"
  size="number"
  glass?>
</schmancy-spinner>

// Examples
// 1. Basic spinner (inherits parent color)
<schmancy-spinner></schmancy-spinner>

// 2. Different sizes (using Tailwind sizing system)
<schmancy-spinner size="4"></schmancy-spinner>  // 16px (1rem)
<schmancy-spinner size="6"></schmancy-spinner>  // 24px (1.5rem) - default
<schmancy-spinner size="8"></schmancy-spinner>  // 32px (2rem)
<schmancy-spinner size="12"></schmancy-spinner> // 48px (3rem)

// 3. Color variants
<schmancy-spinner color="primary"></schmancy-spinner>
<schmancy-spinner color="on-primary"></schmancy-spinner>
<schmancy-spinner color="error"></schmancy-spinner>
<schmancy-spinner color="success"></schmancy-spinner>

// 4. Glass morphism effect
<schmancy-spinner glass></schmancy-spinner>
<schmancy-spinner glass size="10" color="primary"></schmancy-spinner>

// 5. Inside buttons (inherits button text color)
<schmancy-button variant="filled">
  <schmancy-spinner size="5"></schmancy-spinner>
  Loading...
</schmancy-button>

// 6. Inside surfaces with contextual colors
<schmancy-surface type="filled" color="primary">
  <schmancy-spinner color="on-primary"></schmancy-spinner>
</schmancy-surface>

// 7. Loading states
<div class="flex items-center gap-2">
  <schmancy-spinner size="5"></schmancy-spinner>
  <schmancy-typography>Loading data...</schmancy-typography>
</div>

// 8. Overlay loading indicator with glass effect
<div class="relative">
  <div class="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-sm">
    <schmancy-spinner glass size="10"></schmancy-spinner>
  </div>
  <!-- Content being loaded -->
</div>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `inherit` | Theme color variant or 'inherit' for contextual color |
| `size` | `number` | `6` | Size in Tailwind units (4 = 16px, 6 = 24px, 8 = 32px, etc.) |
| `glass` | `boolean` | `false` | Apply glass morphism effect with backdrop blur |

## Color System

The spinner intelligently inherits colors from its context by default:
- Inside buttons: Inherits button text color
- Inside colored surfaces: Inherits appropriate contrast color
- Standalone: Uses current text color

Available explicit colors:
- **Primary colors**: `primary`, `on-primary`
- **Secondary colors**: `secondary`, `on-secondary`
- **Tertiary colors**: `tertiary`, `on-tertiary`
- **Status colors**: `error`, `on-error`, `success`, `on-success`
- **Surface colors**: `surface`, `on-surface`, `surface-variant`, `on-surface-variant`

## Glass Effect

The `glass` attribute adds a modern glass morphism effect:
- Semi-transparent background with backdrop blur
- Subtle border and inner shadow
- Perfect for overlay loading indicators
- Works well on image or complex backgrounds

## Size System

Uses Tailwind's sizing convention where each unit = 0.25rem:
- `size="4"` = 16px (1rem)
- `size="5"` = 20px (1.25rem)
- `size="6"` = 24px (1.5rem) - **default**
- `size="8"` = 32px (2rem)
- `size="10"` = 40px (2.5rem)
- `size="12"` = 48px (3rem)

## Common Use Cases

### 1. Button Loading State
```html
<schmancy-button variant="filled" disabled>
  <schmancy-spinner size="5"></schmancy-spinner>
  <span class="ml-2">Processing...</span>
</schmancy-button>
```

### 2. Page Loading Overlay
```html
<div class="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
  <schmancy-spinner glass size="12"></schmancy-spinner>
</div>
```

### 3. Inline Loading Indicator
```html
<schmancy-list-item>
  <span>Fetching user data</span>
  <schmancy-spinner slot="end" size="5"></schmancy-spinner>
</schmancy-list-item>
```

### 4. Card Loading State
```html
<schmancy-card>
  <div class="flex flex-col items-center justify-center py-8">
    <schmancy-spinner size="8" color="primary"></schmancy-spinner>
    <schmancy-typography type="body" token="sm" class="mt-2">
      Loading content...
    </schmancy-typography>
  </div>
</schmancy-card>
```

### 5. Status Indicators
```html
<div class="flex items-center gap-2">
  <schmancy-spinner size="4" color="success"></schmancy-spinner>
  <schmancy-typography>Syncing...</schmancy-typography>
</div>
```

## Accessibility

- The spinner is automatically marked with `aria-hidden="true"` since it's decorative
- Always provide textual context for screen readers:
  ```html
  <div role="status">
    <schmancy-spinner></schmancy-spinner>
    <span class="sr-only">Loading...</span>
  </div>
  ```

## Animation

- Continuous rotation at 1 second per revolution
- Smooth animation with reverse direction for visual appeal
- No performance impact with CSS animations
- Respects `prefers-reduced-motion` for accessibility

## Related Components
- **[Progress](./progress.md)**: For determinate linear progress
- **[Busy](./busy.md)**: For full-page loading states
- **[Button](./button.md)**: Often used with spinners for loading states