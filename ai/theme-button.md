# schmancy-theme-button

> Minimal palette-icon button that spins 360° on click. Hook its `click` to toggle/regenerate your theme.

## Usage
```html
<schmancy-theme-button @click=${() => this.toggleTheme()}></schmancy-theme-button>
```

## Behavior
- Renders a `schmancy-button` (variant `text`) wrapping a palette `schmancy-icon`.
- On click: Web Animations API rotates the icon 360° over 300ms.
- No properties — it's a UI affordance; wire the theme logic via `@click`.

## Typical Wiring
```typescript
import { theme } from '@mhmo91/schmancy'

// Toggle dark/light
<schmancy-theme-button @click=${() => theme.toggleScheme()}></schmancy-theme-button>

// Randomize primary color
<schmancy-theme-button @click=${() => theme.randomize()}></schmancy-theme-button>
```

See [theme.md](./theme.md) for the full theme service API.
