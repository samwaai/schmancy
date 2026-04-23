# schmancy-splash-screen

> Full-viewport splash overlay that fades out once ready; consumer supplies the visuals.

## Usage
```html
<schmancy-splash-screen min-duration="1200">
  <my-logo slot="splash"></my-logo>
  <my-app></my-app>
</schmancy-splash-screen>
```

The `splash` slot holds the overlay content (logo, animation, whatever). The default slot is the real app, revealed after the splash dismisses. The overlay is empty by default — no built-in spinner, no hidden dependencies. Bring your own visuals.

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| minDuration | number | `1500` | Minimum ms the splash stays visible (prevents flash on fast loads). |
| auto | boolean | `false` | When true, dismiss on the `minDuration` timer alone. When false, also wait for a `ready` signal. |
| initiallyHidden | boolean | `false` | When true, the splash starts hidden. Use with `show()` for imperative control (e.g. between route transitions). |

## Methods
| Method | Description |
|--------|-------------|
| `ready()` | Signal that the app is ready — dismisses once `minDuration` has also elapsed. |
| `show()` | Force the splash back on (e.g. re-show between route transitions). |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| schmancy-splash-done | `void` | Fires when the splash finishes dismissing. |

## CSS custom properties
| Property | Default | Description |
|----------|---------|-------------|
| `--schmancy-splash-background` | `var(--schmancy-sys-color-surface-containerLowest, #000)` | Splash layer background. |
| `--schmancy-splash-transition` | `500ms` | Fade duration. |

## Examples
```html
<!-- Wait for explicit ready signal (default) -->
<schmancy-splash-screen min-duration="800">
  <img slot="splash" src="/logo.svg" />
  <main-app></main-app>
</schmancy-splash-screen>
```

```typescript
// Imperative: signal ready when data loads
const splash = document.querySelector('schmancy-splash-screen')!
dataStore.loaded$.subscribe(() => splash.ready())
```

```html
<!-- Auto mode: dismisses purely on the timer -->
<schmancy-splash-screen min-duration="1200" auto>
  <schmancy-typography type="display" token="lg" slot="splash">Welcome</schmancy-typography>
  <app-shell></app-shell>
</schmancy-splash-screen>
```
