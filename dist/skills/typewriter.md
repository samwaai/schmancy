# schmancy-typewriter

> Text-reveal component powered by [TypeIt](https://typeitjs.com). Characters pop in with entrance + wobble physics; custom cursor pulses with drop-shadow glow.

## Usage
```html
<schmancy-typewriter>
  Hello, world.
</schmancy-typewriter>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | number | `35` | Ms per character typed |
| `deleteSpeed` | number | `20` | Ms per character deleted |
| `delay` | number | `0` | Initial delay before typing (inherited via `delayContext`) |
| `autoStart` | boolean | `true` | Start typing on connect |
| `cursorChar` | string | `''` | Character for the cursor (empty = default block cursor) |
| `once` | boolean | `true` | Only animate once per session (`sessionStorage` hash) |
| `loop` | boolean | `false` | Loop infinitely (overrides `once`) |
| `cyclePause` | number | `1500` | Default pause for cycling (ms) |

## Behavior
- **Lazy start** via IntersectionObserver — won't type until visible.
- **Session caching** — when `once=true`, content hash is stored; subsequent visits skip the animation.
- **Delay coordination** — consumes `delayContext`, staggering with parent `schmancy-delay`.
- Character entrance animation: scale 0.3 → 1.1 → 1 with blur-to-focus.
- Alternating characters get a subtle `wobble` rotation.
- Cursor pulses with `drop-shadow(0 0 8px currentColor)` glow.

## Slot Content
Text (or nested HTML) goes in the default slot. TypeIt handles strings, tags, line breaks.

```html
<schmancy-typewriter speed="50">
  First line.<br>
  <strong>Bold second.</strong>
</schmancy-typewriter>
```

## Vs. `typewriter` directive
- **Component (`schmancy-typewriter`)**: slot-based, lazy-starts on visibility, one-shot content reveal with cached skipping.
- **Directive (`typewriter([...phrases])`)**: cycles through a phrase array with typing + deleting + optional Web Audio sound. See [directives.md](./directives.md).

Use the directive for looping taglines. Use the component for one-time paragraph reveals.
