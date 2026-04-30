# Scoping a state per subtree — `<schmancy-context provides>`

The `state()` factory returns a module-scoped singleton. `cart` is the
same instance everywhere it is imported. That is the right default —
"the cart" is a single thing.

When you need *more than one* of something at the same time — two
side-by-side checkout flows, a comparison view of two records, an
embedded preview that shouldn't trample the parent's draft —
`<schmancy-context>` scopes a state to a subtree.

```ts
import { state } from '@mhmo91/schmancy/state'

const cart = state<CartState>('hannah/cart').session({ items: [], total: 0 })

class App extends $LitElement() {
  render() {
    return html`
      <schmancy-context .provides=${[cart]}>
        <cart-view></cart-view>      <!-- isolated copy of cart -->
      </schmancy-context>
      <cart-summary></cart-summary>  <!-- module-scoped global cart -->
    `
  }
}
```

Inside `<schmancy-context>`, every read and write of `cart` resolves to
a per-element isolated copy. Outside, it stays the global. **Consumer
code does not change.** `cart.value`, `cart.set(...)`,
`cart.update(d => …)` — same calls, tree-aware result.

## Resolution rules

- Inside `<schmancy-context provides={[cart]}>` → reads/writes go to
  that element's isolated copy.
- Inside two nested `<schmancy-context provides={[cart]}>` → the
  **closest** provider wins.
- Inside a `<schmancy-context>` whose `provides` does **not** include
  `cart` → falls through to the module-scoped global.
- Outside any `<schmancy-context>` → module-scoped global.

## What's covered

The scoping primitive is supposed to "just work" for the call paths a
component naturally writes. It handles:

| Code path | Mechanism |
|---|---|
| `render()` | `SchmancyElement` prototype-wrap pushes the host onto the active-host stack for the duration of `render()`. |
| Lit lifecycle (`connectedCallback`, `update`, `updated`, `firstUpdated`, `willUpdate`) | Same prototype-wrap. |
| Class methods called from event handlers (sync) | Same prototype-wrap. |
| `await` continuations inside class methods | A `Promise.prototype.then` patch in `state/active-host.ts` propagates the host across each `.then` boundary. |
| `addEventListener(type, fn)` on the host | Wrapped at the `SchmancyElement` layer; `removeEventListener` re-finds the wrapped listener via a `WeakMap`. |
| Inline arrow handlers attached via Lit templates (`@click=${() => …}`) | Resolved through the `window.event.composedPath()` fallback in `resolveActiveHost()`. |

Pure async callbacks with no DOM origin — a websocket `onmessage`
unrelated to any user gesture, a `setInterval` body running on its own
schedule — fall through to the module-scoped global. That is the
correct semantic: those callbacks have no tree position to resolve to.

## Lifecycle

- The isolated copy is created when `<schmancy-context>` connects, and
  is **seeded with the current global value** at that moment. The
  subtree starts from "what the rest of the app sees right now," then
  diverges.
- It is destroyed when `<schmancy-context>` disconnects. Pending
  microtask-coalesced writes flush; the storage adapter's `close()`
  runs.
- The isolated copy uses **memory** storage regardless of the global's
  backend. It shares lifetime with the element, not with
  `localStorage` / `sessionStorage` / IndexedDB. The global continues
  to persist on whichever backend it was created with.

## Multiple states per element

```ts
<schmancy-context .provides=${[cart, menu, draft]}>
  <wizard></wizard>
</schmancy-context>
```

Each is isolated independently. States not listed in `provides`
fall through to the global from inside the element — useful when only
some namespaces need scoping in a particular subtree.

## Two pitfalls

### Don't cache `state.signal` or `state.$` across tree boundaries

Every read goes through context resolution. The signal (and Observable)
returned by the getter is the *currently resolved* instance. Stash a
reference to `cart.signal` and the host later moves into a different
`<schmancy-context>` subtree, and your reference lags.

```ts
// ✗ Don't
const sig = cart.signal
class Foo extends $LitElement() {
  render() { return html`${sig.get().n}` }   // never re-resolves
}

// ✓ Do
class Foo extends $LitElement() {
  render() { return html`${cart.value.n}` }   // resolves fresh each render
}
```

### Don't expect persistence per subtree

Isolated copies are memory-backed. If your scoping use case requires
persisting per-subtree state across reloads, that is a different design
— derive a fresh `state()` per logical scope (with a unique namespace)
and use the persistent backend on that.

## Implementation primer (for contributors)

- `state/active-host.ts` — `_activeHost` Variable (stack) +
  one-time `Promise.prototype.then` patch + 4-tier `resolveActiveHost`
  fallback. ~120 lines. Hand-rolled because no official, supported
  TC39 AsyncContext.Variable polyfill exists today; the patch
  decommissions cleanly when one ships.
- `state/schmancy-context.ts` — the element. One `ContextProvider`
  (`@lit/context`) per state in `provides`. Destroys on disconnect.
- `state/index.ts` — every read (`value` / `signal` / `$`) and every
  write on a global instance routes through `resolveContextual`,
  which dispatches a `context-request` event from the active host and
  caches the result per-host-per-namespace in a `WeakMap`. Isolated
  copies are direct-access (skip resolveContextual, no recursion).
- `mixins/SchmancyElement.ts` — prototype-chain wrap at first
  construction (cached in a `WeakSet` of prototypes); `addEventListener`
  / `removeEventListener` overrides; wrapped listener cache.
