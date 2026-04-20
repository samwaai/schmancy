# schmancy-teleport

> Move DOM between locations with a FLIP-animated transition. Two instances sharing an `id` handshake via broadcast events — when one mounts, it finds the other and flies the content between them.

## Usage
```html
<!-- Start position -->
<schmancy-teleport id="hero-image">
  <img src="portrait.jpg" alt="" />
</schmancy-teleport>

<!-- Later, in a different view -->
<schmancy-teleport id="hero-image"></schmancy-teleport>
```

When the second instance mounts, the image smoothly animates from its old bounding rect to the new one.

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | **required** | Shared identifier between source and target |
| `uuid` | number | auto | Instance UUID for disambiguation (read-only) |
| `delay` | number | `0` | Delay before teleporting (ms) |

## Discovery Events
The service broadcasts on `window`:
- `FINDING_MORTIES` — "is anyone mounted with id X?"
- `HERE_RICKY` — instances reply with self reference
- `WhereAreYouRicky` / `HereMorty` — instance-to-instance handshake

Uses RxJS with a race/throwIfEmpty pattern to handle missing counterparts gracefully.

## Typical Pattern — route transitions
```html
<!-- List view -->
${repeat(items, item => item.id, item => html`
  <schmancy-teleport id=${`card-${item.id}`}>
    <schmancy-card @click=${() => router.push(`/item/${item.id}`)}>
      <img src=${item.thumbnail} />
    </schmancy-card>
  </schmancy-teleport>
`)}

<!-- Detail view -->
<schmancy-teleport id=${`card-${this.params.id}`}></schmancy-teleport>
```

## Notes
- Uses `watchElementRect` (ResizeObserver + scroll tracking) to keep source/target in sync.
- Animation uses the FLIP technique: capture first rect, invert on mount, play to final.
- All subscriptions clean up via `takeUntil(this.disconnecting)`.
- Each teleport pair must share a unique `id` string.

## See Also
- For programmatic teleportation from JS: import `teleportationService` from `@mhmo91/schmancy/teleport`.
