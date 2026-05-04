# Schmancy Discovery

> Event-based component and element discovery across shadow DOM boundaries. No DOM traversal — just broadcast and race.

## Why
Web components hide inside shadow DOM. Traversing with `querySelector` + `shadowRoot` everywhere is fragile. Discovery broadcasts a "where are you?" event; components respond with themselves.

## API
```typescript
import {
  discover,
  discoverComponent,
  discoverAnyComponent,
  discoverElement,
  discoverAllElements,
} from '@mhmo91/schmancy'
```

### `discover(query, timeout?)`
Smart auto-detect. Routes to `discoverElement` for CSS selectors (`#`, `.`, `[`) and `discoverComponent` for tag names.
```typescript
discover<SchmancyNavigationRail>('schmancy-navigation-rail').subscribe(el => el?.select('home'))
discover('#hero-card').subscribe(el => el?.focus())
```

### `discoverComponent(tag, timeout = 100)`
Broadcasts `{tag}-where-are-you`; first responder wins.
```typescript
discoverComponent<SchmancyDialog>('schmancy-dialog')
  .subscribe(dialog => dialog?.open())
```

### `discoverAnyComponent(...tags)`
Race between multiple tags — first to respond wins.
```typescript
discoverAnyComponent('schmancy-navigation-rail', 'schmancy-navigation-bar')
  .subscribe(nav => nav?.select(route))
```

### `discoverElement(selector, timeout = 150)`
Finds any element by CSS selector across shadow DOM. Uses a request ID + universal `schmancy-discover` event. Every `SchmancyElement` responds if it finds a match in its shadow root.
```typescript
discoverElement('[data-section="pricing"]').subscribe(section => section?.scrollIntoView())
```

### `discoverAllElements(selector, timeout = 150)`
Collects **all** matching responses within the timeout window.
```typescript
discoverAllElements('.flagged').subscribe(all => console.log(all.length))
```

## How the Handshake Works
1. Caller creates a unique `requestId` and broadcasts `schmancy-discover` on `window` with `{ selector, requestId }`.
2. Every `SchmancyElement` listens for this event (wired up in the base class).
3. Any matching element dispatches `schmancy-discover-response` with `{ requestId, element }`.
4. Caller collects responses for the timeout window and emits via RxJS.

## Pattern in Base Class
Every `SchmancyElement` inherits auto-response: `discover<T>(tag)` (method on the component) and `{tagName}-where-are-you`/`{tagName}-here-i-am` events. See [mixins.md](./mixins.md).

## When to Use
- Cross-shadow coordination between unrelated components.
- Imperatively focusing or driving a far-away UI piece from a handler.

## When NOT to Use
- Same-tree data flow — use `@provide`/`@consume` (Lit context) or Schmancy [`store`](./store.md).
- Parent-to-child directly — just use `this.renderRoot.querySelector()`.
