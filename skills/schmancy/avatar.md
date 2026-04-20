# schmancy-avatar

> Avatar component displaying initials, image, or icon with color themes, shapes, and status indicators.

## Usage
```html
<schmancy-avatar initials="JD" color="primary"></schmancy-avatar>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| initials | string | `''` | Text initials (max 2 characters) |
| src | string | `''` | Image URL |
| icon | string | `''` | Material icon name |
| size | `'xxs'\|'xs'\|'sm'\|'md'\|'lg'\|'xl'` | `'md'` | Avatar size (20-64px) |
| color | `'primary'\|'secondary'\|'tertiary'\|'success'\|'error'\|'neutral'` | `'primary'` | Color theme |
| shape | `'circle'\|'square'` | `'circle'` | Avatar shape |
| bordered | boolean | `false` | Show border ring |
| status | `'online'\|'offline'\|'busy'\|'away'\|'none'` | `'none'` | Status indicator dot |

## Size Reference
| Token | Size | Description |
|-------|------|-------------|
| xxs | 20px | Ultra-compact |
| xs | 24px | Compact |
| sm | 32px | Small |
| md | 40px | Default |
| lg | 48px | Large |
| xl | 64px | Extra large |

## Examples
```html
<!-- Image avatar with status -->
<schmancy-avatar src="/photos/alice.jpg" size="lg" status="online"></schmancy-avatar>

<!-- Icon avatar -->
<schmancy-avatar icon="group" color="secondary" shape="square"></schmancy-avatar>

<!-- Bordered initials -->
<schmancy-avatar initials="AB" color="tertiary" bordered></schmancy-avatar>

<!-- Default (person icon) -->
<schmancy-avatar size="sm" color="neutral"></schmancy-avatar>
```

Priority: `src` (image) > `initials` > `icon` > default person icon.
