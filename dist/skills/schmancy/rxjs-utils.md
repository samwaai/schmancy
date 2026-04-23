# Schmancy RxJS Utils

> RxJS-wrapped DOM observation helpers. Use when you need to react to elements appearing, disappearing, or changing across the document.

## Imports
```typescript
import {
  mutationObserver,
  waitForElement,
  waitForElementAll,
  waitForElements,
  waitForElementsAll,
  waitUntil,
} from '@mhmo91/schmancy'
```

## `mutationObserver(target, options?)`
RxJS wrapper around `MutationObserver`.
```typescript
mutationObserver(document.body, { childList: true, subtree: true })
  .pipe(takeUntil(this.disconnecting))
  .subscribe(mutations => { /* react */ })
```

## `waitForElement(selector, timeout = 5000)`
Emits the first matching element once it exists in the DOM. Throws on timeout. Pass `undefined` to wait forever.
```typescript
waitForElement('#auth-banner').subscribe(el => el.focus())
waitForElement('.lazy-panel', 10000).subscribe(el => el.click())
```

## `waitForElementAll(selector, timeout?)`
Emits whenever the matching set changes (all current matches).
```typescript
waitForElementAll('.live-tile').subscribe(tiles => {
  tiles.forEach(t => observe(t))
})
```

## `waitForElements([sel1, sel2, ...], timeout?)` / `waitForElementsAll`
Multi-selector variants — resolve once *any*/`every` selector is present.

## `waitUntil([selectors], timeout = 5000)`
Emits once when **all** selectors have matches. Throws on timeout.
```typescript
waitUntil(['header', 'main', 'footer'])
  .subscribe(() => console.log('Page shell ready'))
```

## How It Works
All helpers share `mutationObserver(document.body)` with `childList: true, subtree: true` and `.startWith(document.body)` so they check once immediately and re-check on every DOM mutation.

## When to Use
- Integrating third-party scripts that inject DOM late.
- Coordinating with slot-projected children that may mount asynchronously.
- Awaiting app-shell elements before attaching shortcuts.

## When NOT to Use
- Inside your own component — use `firstUpdated()` or `queryAssignedElements`.
- For cross-shadow discovery — use [discovery](./discovery.md) instead.
