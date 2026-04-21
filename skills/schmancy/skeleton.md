# schmancy-skeleton

> Placeholder shimmer surface shown while content loads. Reduced-motion-aware.

## Usage
```html
<schmancy-skeleton width="12rem" height="1rem"></schmancy-skeleton>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| shape | `'rect'\|'circle'\|'text'` | `'rect'` | Visual shape. `circle` forces 50% border radius; `text` defaults height to `1em`. |
| width | string (CSS length) | `100%` | Any CSS length (e.g. `12rem`, `50%`). |
| height | string (CSS length) | `1rem` (or `1em` when `shape=text`) | Any CSS length. |
| radius | string (CSS length) | `0.25rem` | Corner radius; ignored when `shape=circle`. |

## Parts
| Part | Description |
|------|-------------|
| surface | The shimmering inner surface. |

## Accessibility
The host sets `role="status" aria-busy="true" aria-label="Loading"` on connection, so assistive tech announces the loading region. Under `prefers-reduced-motion: reduce`, the shimmer animation is removed and a flat surface color is used.

## Examples
```html
<!-- Single line of text -->
<schmancy-skeleton shape="text" width="60%"></schmancy-skeleton>

<!-- Avatar placeholder -->
<schmancy-skeleton shape="circle" width="48px" height="48px"></schmancy-skeleton>

<!-- Card placeholder -->
<schmancy-card>
  <schmancy-skeleton width="100%" height="160px" radius="0.5rem"></schmancy-skeleton>
  <schmancy-skeleton shape="text" width="80%"></schmancy-skeleton>
  <schmancy-skeleton shape="text" width="40%"></schmancy-skeleton>
</schmancy-card>
```
