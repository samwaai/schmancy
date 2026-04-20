# Schmancy Directives — AI Reference

## What Are Directives?

Lit directives that snap onto any element to add behavior. No components to wrap, no CSS to write — just `${directiveName()}` in your template.

```typescript
import { magnetic, cursorGlow, gravity, reveal } from '@mhmo91/schmancy/directives'
```

---

## Physics & Interaction (6 directives)

### `magnetic` — Elements lean toward the cursor
```html
<schmancy-button ${magnetic()}>Submit</schmancy-button>
<schmancy-icon-button ${magnetic({ strength: 6, radius: 120 })}>add</schmancy-icon-button>
```
| Option | Default | Description |
|--------|---------|-------------|
| `strength` | 4 | Max displacement in px |
| `radius` | 100 | Activation radius in px |

Embedded in: `schmancy-button`, `schmancy-icon-button`, `schmancy-filter-chip`, `schmancy-details` (summary)

### `cursorGlow` — Light follows cursor across a surface
```html
<schmancy-surface type="glass" ${cursorGlow()}>content</schmancy-surface>
<div ${cursorGlow({ radius: 300, intensity: 0.2, color: 'var(--schmancy-sys-color-secondary-default)' })}>
  hero panel
</div>
```
| Option | Default | Description |
|--------|---------|-------------|
| `radius` | 200 | Glow radius in px |
| `color` | primary | CSS color value |
| `intensity` | 0.12 | Opacity 0-1 |

Embedded in: `schmancy-card` (interactive), `schmancy-dialog`

### `livingBorder` — Animated gradient light traces element edges
```html
<schmancy-card ${livingBorder()}>content</schmancy-card>
<div ${livingBorder({ duration: 4000, onHover: true, color: 'var(--schmancy-sys-color-secondary-default)' })}>
  hero panel
</div>
```
| Option | Default | Description |
|--------|---------|-------------|
| `duration` | 3000 | Rotation speed in ms |
| `width` | 1 | Border width in px |
| `color` | primary | Glow color |
| `spread` | 6 | Glow spread in px |
| `onHover` | false | Only animate on hover |

### `gravity` — Elements fall into place with mass-based bounce
```html
<!-- Single element drops in -->
<schmancy-card ${gravity()}>content</schmancy-card>

<!-- Staggered list — each item falls 50ms after the previous -->
${repeat(items, item => item.id, (item, i) => html`
  <div ${gravity({ stagger: 50 * i, mass: 0.8 })}>...</div>
`)}
```
| Option | Default | Description |
|--------|---------|-------------|
| `mass` | 1.0 | 0.5 (bouncy) to 2.0 (heavy) |
| `distance` | 30 | Fall distance in px |
| `delay` | 0 | Delay before falling in ms |
| `stagger` | 0 | Per-item stagger in ms |

Only animates once. Re-triggers on reconnect (route change, cache toggle).

### `depthOfField` — Progressive blur on background content
```html
<main ${depthOfField({ active: this.dialogOpen, maxBlur: 8 })}>
  page content that blurs when dialog opens
</main>
```
| Option | Default | Description |
|--------|---------|-------------|
| `active` | required | Boolean — blur when true |
| `maxBlur` | 8 | Max blur radius in px |
| `duration` | 400 | Transition duration in ms |

### `longPress` — Press-and-hold gesture detection
```html
<div ${longPress(() => this.showContextMenu())}>Hold me</div>
<div ${longPress(() => this.showMenu(), { duration: 800, movementThreshold: 15 })}>
  Custom timing
</div>
```
| Option | Default | Description |
|--------|---------|-------------|
| `duration` | 500 | Time before trigger in ms |
| `movementThreshold` | 10 | Max movement in px before cancel |

---

## Visual Effects (3 directives)

### `nebula` — Surreal dimensional rift loading effect
```html
<div ${nebula()}>Content with cosmic loading effect</div>
<div ${nebula({ active: this.loading, temperature: -0.5, speed: 1.5 })}>
  Cool-toned, faster nebula
</div>
```
| Option | Default | Description |
|--------|---------|-------------|
| `active` | true | Show/hide the effect |
| `intensity` | 1 | Brightness 0-1 |
| `speed` | 1 | Animation speed multiplier |
| `temperature` | 0 | -1 (cool/blue) to 1 (warm/pink) |
| `particleCount` | 30 | Quantum particle count |
| `autoHideDuration` | 3000 | Auto-dim after ms (0 = never) |
| `background` | true | Render behind content |

### `liquid` — Apple Liquid Glass effect (pure CSS)
```html
<div ${liquid()}>Glass panel</div>
<div ${liquid({ intensity: 'strong', active: this.isActive })}>
  Thick glass
</div>
```
| Option | Default | Description |
|--------|---------|-------------|
| `active` | true | Toggle effect on/off |
| `intensity` | 'medium' | 'light', 'medium', or 'strong' |

Zero DOM mutation — applies only inline styles.

### `ripple` — Material-style ink ripple on click
```html
<div ${ripple()}>Click me</div>
```
No options. Ripple appears at click position, fades out in 600ms.

---

## Text Animation (3 directives)

### `animateText` — 5 text animation modes
```html
<span ${animateText({ animation: 'blur-reveal', stagger: 60 })}>Hello world</span>
<span ${animateText({ animation: 'cyber-glitch', preset: 'snappy' })}>GLITCH</span>
<span ${animateText({ animation: 'fade-up' })}>Fade up</span>
```
| Animation | Description |
|-----------|-------------|
| `typewriter` | Characters appear one by one |
| `fade-up` | Whole element fades up |
| `word-reveal` | Words appear one by one from below |
| `blur-reveal` | Words deblur + scale in |
| `cyber-glitch` | Characters pop in with overshoot |

| Option | Default | Description |
|--------|---------|-------------|
| `animation` | required | Animation type |
| `preset` | 'snappy' | Spring preset: smooth, snappy, bouncy, gentle |
| `stagger` | 50 | Ms between characters/words |
| `text` | element content | Explicit text (for Lit bindings) |
| `restart` | false | Re-animate on viewport re-entry |

Waits for element visibility before starting.

### `cycleText` — Cycle through child elements with transitions
```html
<span ${cycleText({ transition: 'slide', hold: 1500 })}>
  <span>First</span>
  <span>Second</span>
  <span>Third</span>
</span>

<!-- Add mode: accumulates items -->
<span ${cycleText({ mode: 'add', transition: 'typewriter' })}>
  <span>guests</span>
  <span>kitchen</span>
  <span>team</span>
</span>
<!-- Shows: "guests" → "guests, kitchen" → "guests, kitchen, team" → clears → repeat -->
```
| Option | Default | Description |
|--------|---------|-------------|
| `transition` | 'fade' | 'fade', 'slide', or 'typewriter' |
| `hold` | 2000 | Display time per item in ms |
| `mode` | 'replace' | 'replace' or 'add' (accumulate) |
| `separator` | ', ' | Separator in add mode |

### `typewriter` — Phrase cycling with typing/deleting + sound
```html
<div ${typewriter(['Trustless', 'Permissionless', 'Transparent'])}>
  <span class="typed"></span>
</div>
<div ${typewriter(['Fast', 'Typing'], { typeSpeed: 50, sound: true })}>
  <span class="typed"></span>
</div>
```
| Option | Default | Description |
|--------|---------|-------------|
| `typeSpeed` | 50 | Ms per character typed |
| `deleteSpeed` | 30 | Ms per character deleted |
| `pauseDuration` | 1500 | Pause after typing in ms |
| `loop` | true | Loop through phrases |
| `sound` | true | Web Audio typing sounds |
| `cursor` | false | Show blinking cursor |

---

## Show/Hide (2 directives)

### `reveal` — Spring-physics show/hide with zero layout shift
```html
<div ${reveal(this.isVisible)}>Content</div>
<div ${reveal(this.isOpen, { preset: 'bouncy', maxHeight: '200px' })}>
  Bouncy reveal
</div>
```
| Option | Default | Description |
|--------|---------|-------------|
| `preset` | 'smooth' | smooth, snappy, bouncy, gentle |
| `maxHeight` | '10rem' | Max height when revealed |

Element stays in DOM (no layout shift). Uses Blackbird spring physics.

### `intersect` — Simplified IntersectionObserver
```html
<!-- Fire once when visible (lazy load) -->
<img ${intersect(() => this.loadImage(), { once: true })} />

<!-- Enter/exit callbacks -->
<video ${intersect({ onEnter: () => this.play(), onExit: () => this.pause() })}>
```
| Option | Default | Description |
|--------|---------|-------------|
| `once` | false | Fire only once then disconnect |
| `threshold` | 0 | Visibility threshold |
| `rootMargin` | '0px' | Observer root margin |
| `delay` | 0 | Delay before callback in ms |

---

## Interaction (3 directives)

### `drag` & `drop` — HTML5 drag and drop with FLIP animations
```html
${repeat(items, item => item.id, item => html`
  <div ${drag(item.id)} ${drop(item.id)} @drop=${this.handleReorder}>
    ${item.name}
  </div>
`)}
```

### `color` — Dynamic background/text color
```html
<div ${color({ bgColor: '#ff0000', color: 'white' })}>Colored</div>
```

---

## Reactive Utilities

### `reducedMotion$` — Reactive reduced-motion preference
```typescript
import { reducedMotion$ } from '@mhmo91/schmancy/directives'

if (reducedMotion$.value) return // skip animation

// Or subscribe reactively
reducedMotion$.subscribe(reduced => {
  // User toggled reduced motion mid-session
})
```

### `fromResizeObserver` — RxJS wrapper for ResizeObserver
```typescript
import { fromResizeObserver } from '@mhmo91/schmancy/directives'

fromResizeObserver(element).pipe(
  takeUntil(this.disconnecting)
).subscribe(entries => {
  const { width, height } = entries[0].contentRect
})
```

---

## Performance Notes

- All physics directives respect `prefers-reduced-motion` reactively
- `magnetic` and `cursorGlow` cache `getBoundingClientRect` on mouseenter (not per-frame)
- `gravity` only animates once — parent re-renders don't re-trigger
- `livingBorder` shares a single `<style>` element across all instances
- `nebula` uses a singleton IntersectionObserver + pauses off-screen animations
- All directives use `Subject` + `takeUntil` for subscription cleanup
- All directives implement `reconnected()` for cache/conditional rendering survival
