# schmancy-connectivity-status

> App-wide online/offline banner. Mount once near the root and forget it.

## Usage
```html
<!-- In your app shell -->
<schmancy-connectivity-status></schmancy-connectivity-status>
```

## Properties
None — it's entirely self-driven from `window` online/offline events.

## Behavior
- Listens to `window` `online` / `offline` events via RxJS `merge`.
- `distinctUntilChanged` prevents duplicate banners.
- Animated slide-down banner with spring-style easing when state changes.
- Offline: error-colored banner with pulsing icon.
- Online (after offline): success-colored banner with bouncing icon, auto-dismisses after a short timer.
- Plays matching sounds from the `$sounds` audio service (skipped on initial load).
- Respects `prefers-reduced-motion` implicitly via CSS.

## Setup
Place it once at the root — typically just inside your main `schmancy-theme` or app shell:

```html
<schmancy-theme>
  <schmancy-connectivity-status></schmancy-connectivity-status>
  <schmancy-area ${fill()} name="root" .default=${...}>...</schmancy-area>
</schmancy-theme>
```

## See Also
- [audio.md](./audio.md) — the `$sounds` service used for feedback tones.
