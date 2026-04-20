# schmancy-icon

> Material Symbols icon with configurable fill, weight, grade, variant, and size tokens.

## Usage
```html
<schmancy-icon>settings</schmancy-icon>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| icon | string | `undefined` | Icon name (alternative to slot content, translation-safe) |
| size | `'xxs'\|'xs'\|'sm'\|'md'\|'lg'\|string` | `'md'` | Icon size (12/16/20/24/32px or custom) |
| fill | number (0-1) | `0` | Fill level (0=outlined, 1=filled) |
| weight | number (100-700) | `400` | Stroke thickness |
| grade | number (-50 to 200) | `0` | Visual weight adjustment |
| variant | `'outlined'\|'rounded'\|'sharp'` | `'outlined'` | Icon style variant |

## Size Tokens
| Token | Size | Optical Size | Best For |
|-------|------|-------------|----------|
| xxs | 12px | 20 | Ultra-compact UIs |
| xs | 16px | 20 | 32px buttons |
| sm | 20px | 20 | 40px buttons |
| md | 24px | 24 | Default (48px buttons) |
| lg | 32px | 40 | 56px buttons |

## Examples
```html
<!-- Filled icon -->
<schmancy-icon .fill=${1}>favorite</schmancy-icon>

<!-- Large rounded icon -->
<schmancy-icon size="lg" variant="rounded">home</schmancy-icon>

<!-- Custom size -->
<schmancy-icon size="48px" .weight=${300}>search</schmancy-icon>

<!-- Translation-safe (use icon property instead of slot) -->
<schmancy-icon icon="delete"></schmancy-icon>
```

Auto-loads Google Fonts on first use. Translation-protected via `translate="no"` and `notranslate` class.
