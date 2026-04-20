# schmancy-slider / schmancy-slide

> Horizontal snap-scrolling carousel with optional arrow controls.

## Usage
```html
<schmancy-slider show-arrows>
  <schmancy-slide>
    <img src="a.jpg" />
  </schmancy-slide>
  <schmancy-slide>
    <div class="p-8">Second slide</div>
  </schmancy-slide>
  <schmancy-slide>
    <div class="p-8">Third slide</div>
  </schmancy-slide>
</schmancy-slider>
```

## schmancy-slider Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showArrows` | boolean | `true` | Render prev/next navigation buttons |

## Events
| Event | Payload | When |
|-------|---------|------|
| `slide-changed` | `{ index: number }` | Centered slide changes after scroll settles |

## Behavior
- Each `schmancy-slide` is sized to `flex: 0 0 100%` of the slider.
- `scroll-snap-type: x mandatory` — scroll always lands on a slide.
- Scrollbars hidden across browsers.
- Scroll events throttled to 100ms for stable index tracking.
- Arrow buttons scroll to previous/next slide when `show-arrows` is true.

## Example — programmatic control
```typescript
const slider = this.renderRoot.querySelector('schmancy-slider')
slider?.addEventListener('slide-changed', (e: CustomEvent<{ index: number }>) => {
  this.activeIndex = e.detail.index
})
```
