# Blackbird Animation System

> Spring physics animation presets for the Web Animations API and CSS transitions.

## Spring Presets

| Preset | Duration | Character | Best For |
|--------|----------|-----------|----------|
| `SPRING_SMOOTH` | 500ms | Apple-style, subtle overshoot | Accordions, content reveals |
| `SPRING_SNAPPY` | 300ms | Quick, minimal overshoot | Buttons, toggles |
| `SPRING_BOUNCY` | 600ms | Playful, noticeable overshoot | Notifications, celebrations |
| `SPRING_GENTLE` | 700ms | Slow, no overshoot | Page transitions, modals |

## Usage with Web Animations API
```typescript
import { createAnimation, SPRING_SMOOTH } from '@mhmo91/schmancy'

const anim = createAnimation(SPRING_SMOOTH, {
  from: { opacity: 0, transform: 'translateY(-16px)' },
  to: { opacity: 1, transform: 'translateY(0)' }
})

element.animate(anim.keyframes, anim.options)
```

## Helper Functions
```typescript
import {
  createRevealAnimation,   // Fade in + slide up
  createDismissAnimation,  // Fade out + slide up
  createScaleAnimation,    // Pop in/out
  getEasing,               // Auto-detect linear() support
  prefersReducedMotion     // Check reduced motion preference
} from '@mhmo91/schmancy'

// Reveal animation
const reveal = createRevealAnimation(SPRING_SMOOTH, 16) // 16px distance
element.animate(reveal.keyframes, reveal.options)

// Scale animation
const scale = createScaleAnimation(SPRING_SNAPPY, 0.9, 1)
element.animate(scale.keyframes, scale.options)
```

## CSS Custom Properties
```css
/* Available after injecting ANIMATION_CSS_VARS */
.element {
  transition: transform var(--blackbird-duration-smooth) var(--blackbird-easing-smooth);
}
```

## Tailwind Integration
```typescript
import { tailwindAnimations } from '@mhmo91/schmancy'
// Use in tailwind.config.js extend block

// Available classes:
// ease-spring-smooth, ease-spring-snappy, ease-spring-bouncy, ease-spring-gentle
// duration-spring-smooth, duration-spring-snappy, etc.
// animate-blackbird-reveal, animate-blackbird-dismiss, etc.
```

All animations respect `prefers-reduced-motion: reduce` (instant transitions, no animation).
