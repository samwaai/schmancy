# State — `@mhmo91/schmancy/state`

Reactive state primitive. Module-scoped singletons keyed by namespace.
Every state exposes a TC39 signal, an RxJS Observable, a sync getter,
and a hydration promise — pick the surface that fits the call site.

This module replaced the v1 `createContext` / `@select` /
`createCompoundSelector` system. There is no parallel API; use `state()`
for everything.

## Quick reference

```ts
import { state, computed, bindState, stateFromObservable } from '@mhmo91/schmancy/state'

// Define
const cart = state<CartState>('hannah/cart').session({ items: [], total: 0 })

// Read
cart.value          // CartState — sync getter
cart.signal.get()   // CartState — raw TC39 signal
cart.$              // Observable<CartState> — RxJS, microtask-coalesced
await cart.ready    // resolves when initial load completes
cart.loaded         // boolean — true after first load

// Write (ObjectAPI dispatch — see "Variant write APIs" below)
cart.set({ total: 12 })          // partial merge
cart.replace({ items: [], total: 0 })
cart.update(d => { d.items.push(item) })   // immer
cart.delete('total')

// Subscribe in a SchmancyElement — direct read auto-tracks via SignalWatcher
class CartView extends SchmancyElement {
  render() { return html`Items: ${cart.value.items.length}` }
}

// Derived
const lineCount = computed(() => cart.value.items.length)
```

## Three call shapes

The factory has three overloads. Pick the shape that fits the file.

### (1) Typed-const — recommended default

```ts
const initial: CartState = { items: [], total: 0 }
export const cart = state('hannah/cart').session(initial)
```

Type comes from the typed const. No type-arg, no registry augmentation.
Three lines, no casts. Use this for most modules.

**Note:** an inline literal without a typed const narrows T to the literal's
exact type (`{ items: never[]; total: number }`). For inline literals use
form (2) or (3).

### (2) Inline — explicit type-arg

```ts
export const cart = state<CartState>('hannah/cart').session({ items: [], total: 0 })
```

For inline declarations or one-off namespaces. The literal is contextually
typed against `CartState`; `[]` widens to `CartItem[]` correctly.

### (3) Registry-augmented — typo-safe, no type-arg

```ts
declare module '@mhmo91/schmancy/state' {
  interface SchmancyStateRegistry {
    'hannah/cart': CartState
  }
}

export const cart = state('hannah/cart').session({ items: [], total: 0 })
```

What the augmentation buys per namespace:

- **Typo prevention** at the type level for that exact namespace string
- **Autocomplete** — typing `state('` suggests every registered namespace
- **Catalog** — `SchmancyStateRegistry` is the index of registered states
- **Duplicate detection** — TS interface-merging fails on conflicting
  `'hannah/cart': X` / `'hannah/cart': Y` declarations across files

Per-namespace opt-in. Files that augment get the strict path; files that
don't keep using forms (1) or (2). No global on/off switch.

## Namespace convention

Every namespace MUST contain a `/`. The factory enforces this at compile
time via the `${string}/${string}` template.

```ts
state('cart')              // ❌ TypeError at runtime + compile error
state('hannah/cart')       // ✅
state('pam/payouts/docs')  // ✅ — multiple slashes are fine
```

Convention: `<feature>/<name>`. The feature prefix groups related states.

## Storage backends

| Method | Backing | Survives refresh | Survives close | Lifecycle |
|--------|---------|------------------|----------------|-----------|
| `.memory(initial)` | JS heap | ❌ | ❌ | `Disposable` |
| `.session(initial)` | `sessionStorage` | ✅ | ❌ (per-tab) | `Disposable` |
| `.local(initial)` | `localStorage` | ✅ | ✅ | `Disposable` |
| `.idb(initial)` | IndexedDB | ✅ | ✅ | `Disposable & AsyncDisposable` |

Web-storage backends round-trip `Map` and `Set` through a JSON tunnel
(serialized as `{ $kind: 'Map' | 'Set', … }`). IDB stores native objects
and skips the tunnel.

All persistent backends batch writes through a microtask-coalesced queue
per state — multiple `set` / `replace` / `update` calls in the same task
collapse to one `save()` invocation with the latest value.

## Variant write APIs (`Kind<T>` dispatch)

The write surface is determined by `T` automatically — no separate
`mapState()` / `setState()` factories.

### `ObjectAPI<T>` — plain objects

```ts
const cart = state<CartState>('hannah/cart').session(initial)
cart.set({ total: 12 })                    // partial merge (default)
cart.set({ items: [] }, false)             // replace (no merge)
cart.replace({ items: [], total: 0 })      // full replace
cart.update(d => { d.items.push(item) })   // immer recipe
cart.delete('total')                        // typed: K extends keyof T
```

### `MapAPI<T>` — `Map<K, V>`

```ts
const docs = state<Map<string, Doc>>('pam/payouts/docs').idb(new Map())
docs.set('doc-1', doc)         // (key, value) — not partial
docs.delete('doc-1')
docs.replace(new Map(entries))
docs.clear()
```

### `SetAPI<T>` — `Set<U>`

```ts
const sel = state<Set<string>>('pam/payouts/sel').memory(new Set())
sel.add('id')
sel.toggle('id')               // add if absent, remove if present
sel.delete('id')               // returns boolean (was-present)
sel.replace(new Set(initial))
sel.clear()
```

### `ArrayAPI<T>` — arrays

```ts
const items = state<Item[]>('feature/items').memory([])
items.push(a, b, c)
items.update(d => { d.push(x) })   // immer
items.replace(next)
items.clear()
```

### `ScalarAPI<T>` — primitives + nullable references

```ts
const editing = state<Doc | null>('pam/edit').memory(null)
editing.set(doc)               // single-arg setter (Partial<T|null> → T|null)
editing.set(null)
editing.replace(doc)

const flag = state<boolean>('pam/footer').memory(false)
flag.set(true)
```

The `Kind<T>` classifier routes:

- `Map<K, V>` → `MapAPI`
- `Set<U>` → `SetAPI`
- `T[]` / `readonly T[]` → `ArrayAPI`
- `string | number | boolean | bigint | symbol` → `ScalarAPI`
- Any union containing `null` or `undefined` → `ScalarAPI`
- All other objects → `ObjectAPI`

## Reading state

```ts
cart.value           // T — current value, sync getter
cart.signal.get()    // T — same value via the raw TC39 signal
cart.signal          // Signal.State<T> — for use inside computed()
cart.$               // Observable<T> — emits initial + on every change
cart.ready           // Promise<void> — resolves once load completes
cart.loaded          // boolean — true after first load attempt
cart.namespace       // 'hannah/cart' (literal type preserved)
cart.storage         // 'session' (literal type preserved)
cart.defaultValue    // the initial passed to the factory
```

## Subscribing in a component

Three options, in order of preference. The first covers the 80% case
with zero ceremony.

### (1) Default — direct read inside `render()`

`SchmancyElement` composes `SignalWatcher` from `@lit-labs/signals`.
Every signal read inside `render()` auto-tracks; the host re-renders
on change. No decorator, no field, no binding code.

```ts
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { SchmancyElement } from '@mhmo91/schmancy/mixins'
import { cart } from './cart.state'

@customElement('cart-view')
export class CartView extends SchmancyElement {
  render() {
    return html`<span>Items: ${cart.value.items.length}</span>`
  }
}
```

The imported `cart` singleton IS the binding. Reading `cart.value`
(or `cart.signal.get()` directly) inside render registers the
component as a subscriber for the host's lifetime. On `cart.set(...)`,
the host re-renders.

Use this for:
- Any component that just renders state into the template.
- Computed expressions over multiple states: `${cart.value.total + tip.value.amount}`.

### (2) `@observe(source) field!: T` — field-level binding

When the value needs to be a class field — for event handlers,
derived methods, DevTools inspection, or readability:

```ts
import { observe } from '@mhmo91/schmancy/state'

@customElement('cart-view')
export class CartView extends SchmancyElement {
  @observe(cart) cart!: CartState

  onClick() {
    console.log('current cart:', this.cart)   // field access in handlers
  }

  render() {
    return html`<span>Items: ${this.cart.items.length}</span>`
  }
}
```

Reads return the latest emitted value (falls back to `source.value`
before the first emission lands). Caller writes are dropped with a
dev-mode warning — the source is the single source of truth.

Wiring uses Lit's static `addInitializer` to install a
`ReactiveController` per instance. Multiple `@observe` decorators on
the same class register independent controllers; they compose without
ordering concerns. Same decorator shape as `@property`/`@state`/`@query` —
works under the existing tsconfig with no migration.

### (3) `bindState(host, source)` — imperative form

For hosts that aren't `SchmancyElement` subclasses (rare):

```ts
import { bindState } from '@mhmo91/schmancy/state'

class CustomHost extends LitElement {   // not a SchmancyElement subclass
  cart = bindState(this, cart)
  render() {
    return html`<span>Items: ${this.cart.value.items.length}</span>`
  }
}
```

Same lifecycle guarantees as `@observe`, no decorator. Returned
`BoundState<T>` exposes `.value` and `.$`.

## Derived state — `computed()`

`computed(fn)` is re-exported directly from `@lit-labs/signals`. Reading
any `state.value` or `signal.get()` inside the callback auto-tracks it
as a dependency.

```ts
import { computed } from '@mhmo91/schmancy/state'

const cartItemCount = computed(() => cart.value.items.length)
const orderTotal = computed(() => cart.value.total + tip.value.amount)

// Read with .get() — auto-tracks if called from within another computed
cartItemCount.get()
```

`computed()` defaults to reference-equality dedup. Pass a custom `equals`
through `Signal.Options<T>` if you need value-equality.

## Observable → state — `stateFromObservable`

Lift an RxJS source into a state.

```ts
import { stateFromObservable } from '@mhmo91/schmancy/state'

const userPresence = stateFromObservable(
  presence$,                    // Observable<PresenceState>
  'app/presence',                // namespace
  { online: false, since: 0 },   // initial
)
```

The returned state is `'memory'`-backed by default (override via
`{ storage: 'session' | 'local' | 'indexeddb' }`). Subscription is
created once; cleanup on dispose unsubscribes the source.

## Lifecycle

### Module-scope singleton (most common)

```ts
// frontend/src/cart/cart.context.ts
export const cart = state<CartState>('hannah/cart').session(initial)
```

Plain `const`. Lives for app lifetime.

**Footgun:** do **not** use `using` at module scope — it disposes when
the module record is GC'd, which is roughly never until the tab closes.
Reserve `using` / `await using` for test or function scope.

### Test-scoped — `using` / `await using`

```ts
import { it, expect } from 'vitest'

it('cart updates total on add', () => {
  using cart = state<CartState>('test/cart').memory(initial)
  cart.update(d => { d.items.push(item) })
  expect(cart.value.total).toBe(item.price)
}) // [Symbol.dispose] runs here automatically — even on assertion failure.

it('persists across reloads', async () => {
  await using cart = state<CartState>('test/cart').idb(initial)
  // ... awaits IDB flush + close before the next test.
})
```

### `destroy()` — imperative alias

`state.destroy()` is the imperative form (alias for `[Symbol.dispose]()`).
Use when working in a context where `using` isn't available. For IDB
states, `destroy()` fires `[Symbol.asyncDispose]` without awaiting —
fire-and-forget cleanup.

### What disposal does

- Drains pending writes (microtask-coalesced queue)
- Unsubscribes any `stateFromObservable` source
- Closes the IDB connection (for IDB-backed states)
- Releases the namespace claim — the same `'feature/name'` can be
  re-registered after disposal

## Scoping — `<schmancy-context provides>`

The default state is a module-scoped singleton: `cart` is the same
instance everywhere. To **isolate** the same `cart` for a subtree —
two side-by-side checkout flows, an `<iframe>`-like wizard, an
embedded preview — wrap the subtree in `<schmancy-context>`.

```ts
class App extends SchmancyElement {
  render() {
    return html`
      <schmancy-context .provides=${[cart]}>
        <cart-view></cart-view>      <!-- isolated copy -->
      </schmancy-context>
      <cart-summary></cart-summary>  <!-- module-scoped global -->
    `
  }
}
```

Inside the element, `cart.value`, `cart.set(...)`, `cart.update(...)`,
and every other read/write resolve to a per-element isolated copy.
Outside, they continue to read the global. Nested
`<schmancy-context>` resolves to the **closest** provider per
namespace.

### What you write is unchanged

Consumers don't change. The same `cart.value` inside `render()`, the
same `cart.set(...)` in a click handler, the same `cart.update(...)`
after an `await fetch(...)` — all of it auto-resolves to the right
instance based on tree position.

```ts
class CartView extends SchmancyElement {
  render() {
    return html`
      <button @click=${() => cart.set({ total: 0 })}>Clear</button>
      <button @click=${this.handleAdd}>Add</button>
      Items: ${cart.value.items.length}
    `
  }
  handleAdd() { cart.update(d => { d.items.push({}) }) }
  async handleSubmit() {
    const data = await fetch('/items').then(r => r.json())
    cart.update(d => { d.items = data })   // resolves correctly after await
  }
}
```

Coverage of the call paths is provided by `SchmancyElement` and
`<schmancy-context>`:

- `render()` and every Lit lifecycle hook — wrapped at construction
  via the `_activeHost.run(host, fn)` stack.
- Class methods (`handleAdd`, `handleSubmit`) — wrapped at construction.
- `addEventListener(type, fn)` on the host — wrapped (and unwrapped on
  `removeEventListener`).
- Explicit `.then(...)` continuations off a class-method Promise —
  propagated via the `Promise.prototype.then` patch in
  `state/active-host.ts`, which captures the active host at chain time
  and restores it inside the callback.
- Inline arrow handlers in templates (`@click=${() => …}`) and any
  other DOM event handler attached inside a `<schmancy-context>`
  subtree — resolved via the capture-phase event listener that
  `<schmancy-context>` installs on itself for ~18 common event types.
  The listener publishes the event's target as the active host through
  the `_publishEventHost(node)` slot for the duration of the
  synchronous handler chain (slot self-clears in the next microtask).

**Known limitation — native `await` on a native Promise.** V8's await
optimization (since 7.x) skips the spec-prescribed
`Promise.resolve(x).then(continuation)` step, so the `Promise.then`
patch does not see the resumption. Class methods that mutate state
across an `await` boundary fall back to the module-scoped global, not
the active-host's isolated copy. To preserve the host across awaits,
either keep the mutation in the synchronous prelude before the first
`await`, or chain explicitly with `.then(...)` (which still routes
through the patched method). A real fix requires either a build-time
async-function transform or native `AsyncContext.Variable` in the
runtime.

Pure async callbacks with no DOM origin — a websocket `onmessage`,
`setInterval` with no triggering user event — also fall through to
the module-scoped global. That is the correct semantic: those
callbacks have no tree position to resolve to.

### Lifecycle

- The isolated copy is created at `<schmancy-context>` connect and
  seeded with the **current global value** at that moment.
- It is destroyed on `<schmancy-context>` disconnect (pending writes
  flush, adapters close).
- Storage backend is always **memory** for isolated copies — they
  share lifetime with the element, not with `localStorage` /
  `sessionStorage` / IndexedDB. The global continues to persist on
  whichever backend it was created with.

### `provides` shape

`provides` accepts the same state instances you import. Pass several:

```ts
<schmancy-context .provides=${[cart, menu, draft]}>...</schmancy-context>
```

States not listed in `provides` fall through to the global from inside
the element — useful when only one or two namespaces need scoping.

## Migration from v1 `createContext`

```ts
// v1
const cart = createContext<CartState>(initial, 'session', 'hannah_cart')
class CartView extends LitElement {
  @select(cart) accessor cart!: CartState
}
const total = createCompoundSelector([cart], [c => c.total], t => t)

// v2
const cart = state<CartState>('hannah/cart').session(initial)
class CartView extends LitElement {
  @observe(cart) cart!: CartState   // or: cart = bindState(this, cart)
}
const total = computed(() => cart.value.total)
```

Surface-equivalent: `.value`, `.set(partial)`, `.replace(next)`, `.$`,
`.delete(key)` all map directly. Storage keys move from arbitrary
strings (`'hannah_cart'`) to namespace strings (`'hannah/cart'`).

## Rules

- **One state per namespace.** The factory throws on a duplicate
  `state('hannah/cart')` until the first instance is disposed. Module-
  scoped singletons are the assumption.
- **Namespaces always contain `/`.** Compile-time enforced.
- **No `using` at module scope.** Disposes never; use plain `const`.
- **No regex-parsing of LLM output**, no hand-written "please return
  JSON" — same project rules as elsewhere. State surface only validates
  types it constructed itself.
- **Treat `state.signal` as read access.** Don't `state.signal.set(…)`
  directly — go through the variant API so write-through-persist and
  observable emission stay coherent.
- **Don't cache `state.signal` / `state.$` across tree boundaries.**
  Every read goes through context resolution; the underlying signal
  (and Observable) returned by the getter is the *currently resolved*
  instance. If you store `cart.signal` in a variable and the host
  later moves into a different `<schmancy-context>` subtree, the
  cached reference lags. Read inline (`cart.value`, `cart.$`) instead
  of caching.
