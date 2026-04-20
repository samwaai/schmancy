# Schmancy Utils

> Non-component utilities exported from `@mhmo91/schmancy` (or `@mhmo91/schmancy/utils`). Animation presets, similarity search, number formatting, intersection observer wrapper, overlay z-index manager, and content hashing.

## Animation

See [animation.md](./animation.md) for the full Blackbird spring system. In brief:

```typescript
import {
  SPRING_SMOOTH, SPRING_SNAPPY, SPRING_BOUNCY, SPRING_GENTLE,
  createAnimation, createRevealAnimation, createDismissAnimation, createScaleAnimation,
  getEasing, prefersReducedMotion,
  ANIMATION_CSS_VARS, tailwindAnimations, GRID_ANIMATION_CSS,
} from '@mhmo91/schmancy'
```

## Number Formatting — `numbers` / `Numbers`
Locale-aware number formatting + currency + rounding.
```typescript
import numbers from '@mhmo91/schmancy'

numbers.roundNumber(3.14159, 2)              // 3.14
numbers.format(1234567.89)                   // "1,234,567.89" (system locale)
numbers.format(1234.5, 'de-DE')              // "1.234,5"
numbers.formatCurrency(99.95, 'EUR')         // "€99.95"
numbers.systemLocale                         // "en-US" / "de-DE" / etc.
```

## Fuzzy Search — `similarity(query, target, options?)`
Autocomplete-tuned similarity scoring. Prioritizes start-matches and word boundaries.
```typescript
import { similarity } from '@mhmo91/schmancy'

similarity('john', 'John Doe')   // ~0.975 (starts-with)
similarity('doe', 'John Doe')    // ~0.765 (word-boundary)
similarity('jhn', 'John Doe')    // ~0.3–0.5 (fuzzy)
```

Tiers:
- `1.00` exact
- `0.95–1.00` target starts with query
- `0.765–0.85` word-boundary match
- `0.56–0.70` substring
- `0.50` subsequence
- `0.00–0.50` fuzzy (Dice + Levenshtein + Jaccard + anagram)

Options:
| Key | Default | Effect |
|-----|---------|--------|
| `normalizeAccents` | `true` | Strip diacritics before compare |
| `includeWordJaccard` | `true` | Add word-set overlap to fuzzy score |
| `maxLevenshteinDistance` | `0` | Early-terminate above this distance (`0` = off) |

## Intersection Observer — `intersection$(element, options?)`
RxJS wrapper around `IntersectionObserver`.
```typescript
import { intersection$ } from '@mhmo91/schmancy'

intersection$(this.card, { threshold: 0.5 })
  .pipe(takeUntil(this.disconnecting))
  .subscribe(entries => {
    if (entries[0].isIntersecting) this.loadContent()
  })
```

## Overlay Stack — `overlayStack`
Singleton z-index coordinator used internally by dialogs, sheets, and windows. Ensures overlays stack in open order.

```typescript
import { overlayStack } from '@mhmo91/schmancy'

// Anonymous (fire-and-forget) — dialogs/sheets
const z = overlayStack.getNextZIndex()
// …on close:
overlayStack.release()

// ID-tracked — windows (supports bringToFront)
overlayStack.assignZIndex('my-window')
overlayStack.bringToFront('my-window')
overlayStack.releaseId('my-window')
```

Base z-index: `10000`. Counter resets when all overlays close.

## Content Hashing — `hashContent(string)`
Fast 32-bit FNV-1a style hash, returns a hex string. Used by [`schmancy-delay`](./delay.md) and [`schmancy-typewriter`](./typewriter.md) for session-scoped caching.
```typescript
import hashContent from '@mhmo91/schmancy/utils/hashContent'
const key = hashContent(element.outerHTML)   // stable across renders for identical content
```

## See Also
- [rxjs-utils](./rxjs-utils.md) — DOM observation helpers (`waitForElement`, `waitUntil`, etc.)
- [discovery](./discovery.md) — cross-shadow component discovery
