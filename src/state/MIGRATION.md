# Migrating from `createContext` to `state()`

Cheatsheet for moving call sites off the v1 `createContext` /
`@select` / `createCompoundSelector` / `selectItem` family to
`@mhmo91/schmancy/state`.

The v1 surface has been deleted from `@mhmo91/schmancy`. There is no
parallel API; every consumer needs to switch.

## Imports

```ts
// Before
import { createContext, select, selectItem, createCompoundSelector } from '@mhmo91/schmancy'

// After
import { state, computed, observe, bindState, stateFromObservable } from '@mhmo91/schmancy/state'
```

## Defining a state

| v1 | v2 |
|---|---|
| `createContext<T>(initial, 'memory', 'foo')` | `state<T>('feature/foo').memory(initial)` |
| `createContext<T>(initial, 'session', 'foo')` | `state<T>('feature/foo').session(initial)` |
| `createContext<T>(initial, 'local', 'foo')` | `state<T>('feature/foo').local(initial)` |
| `createContext<T>(initial, 'indexeddb', 'foo')` | `state<T>('feature/foo').idb(initial)` |

The string namespace replaces the v1 third-argument storage key. It
must contain a `/` (compile-time enforced via the
`${string}/${string}` template literal). Storage is keyed off the
namespace string.

If your file already declares the initial value in a typed const, drop
the type arg:

```ts
const initial: CartState = { items: [], total: 0 }
const cart = state('hannah/cart').session(initial)   // T inferred from `initial`
```

## Reading

| v1 | v2 |
|---|---|
| `cart.value` | `cart.value` (unchanged) |
| `cart.$.subscribe(...)` | `cart.$.subscribe(...)` (unchanged) |
| `cart.ready` (boolean) | `cart.loaded` (boolean) + `await cart.ready` (Promise<void>) |

`cart.ready` is now a Promise that resolves when initial load completes
(success or fallback). `cart.loaded` is the boolean runtime flag. Use
whichever fits the call site.

## Writing

| v1 | v2 |
|---|---|
| `cart.set({ total: 12 })` | `cart.set({ total: 12 })` (unchanged) |
| `cart.set({ items: [] }, false)` | `cart.set({ items: [] }, false)` (unchanged) |
| `cart.replace(next)` | `cart.replace(next)` (unchanged) |
| `cart.delete('total')` | `cart.delete('total')` (unchanged) |
| Manual `replace({ ...current, ...patch })` cascade | `cart.update(d => { … })` — immer recipe, single notification |

For `Map<K, V>` shapes:

| v1 | v2 |
|---|---|
| `docs.set('id', doc)` | `docs.set('id', doc)` (unchanged — MapAPI dispatch) |

For `Set<U>`:

| v1 | v2 |
|---|---|
| Manual `replace(new Set([...current, item]))` | `sel.add('item')` |
| Manual replace-without-item | `sel.delete('item')` (returns boolean) |
|  | `sel.toggle('item')` (new) |

For arrays:

| v1 | v2 |
|---|---|
| `array.push(...items)` | `array.push(...items)` (unchanged) |
| Manual `replace(current.filter(...))` | `array.update(d => d.splice(...))` (immer) |

For nullable references and primitives:

| v1 | v2 |
|---|---|
| `editing.set({ id: 'x' })` then `editing.set(null)` | Same (ScalarAPI accepts the union directly) |

## Subscribing in a component

The v1 `@select` decorator is gone. Three options in v2, in order of
preference:

### (1) Default — direct read in render (zero ceremony)

`$LitElement()` composes `SignalWatcher`, so signal reads in `render()`
auto-track. Just import the state and use it inline:

```ts
@customElement('cart-view')
class CartView extends $LitElement() {
  render() { return html`Items: ${cart.value.items.length}` }
}
```

No decorator, no field, no binding code. The imported `cart` singleton
IS the binding.

### (2) `@observe(source)` — when you need a class field

```ts
class CartView extends $LitElement() {
  @observe(cart) cart!: CartState

  onClick() {
    console.log(this.cart)   // event handler needs `this.cart`
  }

  render() {
    return html`Items: ${this.cart.items.length}`
  }
}
```

Reads return the latest value. Caller writes are dropped with a dev
warning. Same decorator shape as `@property` — works under the existing
tsconfig.

### (3) `bindState(host, source)` — for hosts that aren't `$LitElement`

```ts
class CustomHost extends LitElement {
  cart = bindState(this, cart)
  render() { return html`Items: ${this.cart.value.items.length}` }
}
```

## Compound selectors → `computed`

```ts
// Before
const cartItemCount = createCompoundSelector(
  [cartContext],
  [cart => cart.items.length],
  count => count,
)

// After
import { computed } from '@mhmo91/schmancy/state'
const cartItemCount = computed(() => cart.value.items.length)
```

Cross-state composition just works:

```ts
const orderTotal = computed(() => cart.value.subtotal + tip.value.amount)
```

Reading any `state.value` inside `computed(fn)` auto-tracks. No
explicit dependency array.

## Side effects → `effect`

```ts
import { effect } from '@mhmo91/schmancy/state'

const stop = effect(() => {
  document.title = `${cart.value.items.length} items`
})

// later, when no longer needed:
stop[Symbol.dispose]()
```

Eager run + microtask-coalesced re-runs. Returns a `Disposable`.

## Observable bridges

```ts
// Before
const userPresence$ = new BehaviorSubject({ online: false, since: 0 })
// (read with .value, subscribe with .$, no persistence story)

// After
import { stateFromObservable } from '@mhmo91/schmancy/state'

const userPresence = stateFromObservable(
  presence$,                    // Observable<PresenceState>
  'app/presence',
  { online: false, since: 0 },
)
// userPresence has .value, .$, all variant API methods, lifecycle.
```

## Lifecycle / disposal

```ts
// Module scope — same as v1
export const cart = state('hannah/cart').session(initial)

// Test scope — using
it('cart updates total on add', () => {
  using cart = state('test/cart').memory(initial)
  cart.update(d => { d.items.push(item) })
  expect(cart.value.total).toBe(item.price)
})  // [Symbol.dispose] runs here, even on assertion failure

// IDB-backed in tests — await using flushes pending writes
it('persists across reloads', async () => {
  await using cart = state('test/cart').idb(initial)
  // ...
})

// Imperative cleanup (samwa back-compat alias)
cart.destroy()
```

## Things that went away

- **`createCompoundSelector`** — use `computed()`.
- **`@select` and `@selectItem` decorators** — use direct render reads
  via `$LitElement` (default), `@observe` (field-level), or `bindState`
  (non-Lit hosts).
- **`IStore` / `ICollectionStore` / `IArrayStore` interfaces** — no
  longer needed. The variant write API dispatch is type-level.
- **`error$` per-store Subject** — errors flow through console + the
  `StateStorageError` thrown from `save()` for IDB write failures.
- **Tree-scoped `<state-provider>`** — replaced by
  `<schmancy-context provides={[…]}>`. Same intent (per-subtree
  isolation of a state), different API: in v1 the provider was a
  primitive; in v2 the state surface stays unchanged and the
  `<schmancy-context>` element is what scopes a subtree. Consumer
  code (`cart.value`, `cart.set(...)`) is identical inside and
  outside the element. See `SCOPING.md` for the details.

## Footguns

- **Don't use `using` at module scope.** It disposes on module GC,
  which is roughly never until the tab closes. Plain `const` for
  module singletons, `using` for test/function scope only.
- **Namespaces always contain `/`.** `state('cart')` is a TypeError;
  use `state('feature/cart')`.
- **Don't `state.signal.set(...)` directly.** Go through the variant
  API so write-coalescing and persistence stay coherent.
- **Inline literals without a typed const narrow T.**
  `state('app/x').memory({ items: [], total: 0 })` infers
  `{ items: never[]; total: number }`. Either use a typed const first
  or pass the type arg: `state<CartState>('app/x').memory({...})`.

## Pointers

- Skill / API reference: `packages/schmancy/skills/schmancy/state.md`
- Agent brief: `packages/schmancy/src/state/CLAUDE.md`
- Tree-scoping reference: `packages/schmancy/src/state/SCOPING.md`
- Original plan: `~/.claude/plans/indexed-twirling-stroustrup.md`
- Scoping plan: `~/.claude/plans/federated-petting-penguin.md`
