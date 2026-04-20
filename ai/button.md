# schmancy-button / schmancy-icon-button

> Buttons with embedded `magnetic` directive, glow hover shadow, and spring press animation.

## Usage
```html
<schmancy-button variant="filled" color="primary">Save</schmancy-button>
<schmancy-icon-button icon="add"></schmancy-icon-button>
```

## Properties (schmancy-button)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'elevated' \| 'filled' \| 'filled tonal' \| 'tonal' \| 'outlined' \| 'text'` | `'text'` | Visual style |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'neutral'` | Auto | Color. Defaults to `primary` (or `secondary` for tonal) |
| `size` | `'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Height: 24/32/40/48/56px |
| `width` | `'full' \| 'auto'` | `'auto'` | Full-width or auto |
| `type` | `'button' \| 'reset' \| 'submit'` | `'button'` | HTML button type |
| `href` | `string` | `undefined` | Renders as `<a>` when set |
| `disabled` | `boolean` | `false` | Disabled state (38% opacity) |

## Properties (schmancy-icon-button)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `icon` | `string` | `undefined` | Material icon name (preferred over slot content) |
| `size` | `'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Icon size: 12/16/20/24/24/40px |
| `variant` | Same as button | `'text'` | Visual style |
| `text` | `boolean` | `false` | Render slot as text label instead of icon |
| `disabled` | `boolean` | `false` | Disabled state |

## Slots
| Slot | Description |
|------|-------------|
| (default) | Button label text |
| `prefix` | Leading content (images auto-sized) |
| `suffix` | Trailing content (images auto-sized) |

## Physics
- **magnetic** directive embedded (strength: 3, radius: 60px for button, 50px for icon-button)
- Hover: luminous glow shadow using primary color
- Active: spring press `scale(0.97)` / `scale(0.92)` for icon-button

## Examples
```html
<!-- Filled primary -->
<schmancy-button variant="filled" color="primary">Submit</schmancy-button>

<!-- Outlined error with icon prefix -->
<schmancy-button variant="outlined" color="error" size="sm">
  <schmancy-icon slot="prefix">delete</schmancy-icon>
  Delete
</schmancy-button>

<!-- Icon button with explicit icon prop -->
<schmancy-icon-button icon="settings" variant="tonal" size="sm"></schmancy-icon-button>

<!-- Full-width submit -->
<schmancy-button variant="filled" width="full" type="submit">Save Changes</schmancy-button>
```
