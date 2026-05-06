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

## Submit-state mirroring (`type="submit"` only)

A `<schmancy-button type="submit">` inside a `<schmancy-form>` automatically reflects the form's submit state via a MutationObserver on the form's `aria-busy` attribute:

- While the form's `formSubmitState.status === 'submitting'` (form sets `aria-busy="true"`):
  - Button mirrors `aria-busy="true"` onto itself.
  - Broadcasts `:state(submitting)` for CSS targeting.
  - **Stays focusable** — never gets the `disabled` attribute. Disabled buttons drop from the tab order; AT users would lose their place. WCAG 2.2 AA.
- Cleared automatically when the form's submit promise settles (success or error).

```css
schmancy-button:state(submitting) {
  opacity: 0.6;
  /* show a spinner via ::before, swap label, etc. */
}
```

`schmancy-button` is form-associated (`static formAssociated = true` + `attachInternals()`) — clicking a `type="submit"` inside any `<form>` ancestor (native or schmancy) calls `form.requestSubmit()`. Inside `<schmancy-form>` the click is also intercepted at the form host and bridged across the shadow boundary to the inner shadow-DOM `<form>`.

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
