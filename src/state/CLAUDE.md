# Agent brief — `@mhmo91/schmancy/state`

When you're touching anything in this directory or anything that imports
from `@mhmo91/schmancy/state`, read this first.

## What this module is

A reactive state primitive for the schmancy library:

- `state(namespace).memory(initial)` / `.local()` / `.session()` / `.idb()`
  → returns a module-scoped singleton with a TC39 signal, an RxJS
  Observable, sync getter, microtask-debounced persistence, and a
  Disposable + (for `idb`) AsyncDisposable lifecycle.
- `computed(fn)` — re-export of `@lit-labs/signals/computed`.
- `effect(fn)` — runs `fn` whenever any signal it reads changes;
  returns a `Disposable` for cleanup.
- `observe(source)` — legacy property decorator. One-way binds a class
  field to a state for the host's lifetime. Use only when the value is
  needed AS a class field (event handlers, derived methods, DevTools).
- `bindState(host, source)` — `ReactiveController` helper. Same
  guarantees as `@observe`, no decorator. Use when the host isn't a
  `SchmancyElement` subclass.
- `stateFromObservable(observable, namespace, initial)` — bridges an
  RxJS source into a `state()`.

The module ships `Signal` (TC39 polyfill) and `StorageBackend` as named
type exports.

## Default subscription pattern

`SchmancyElement` already composes `SignalWatcher` over its mixin chain.
Every signal read inside `render()` auto-tracks. **The default consumer
needs zero binding code:**

```ts
@customElement('cart-view')
class CartView extends SchmancyElement {
  render() { return html`Items: ${cart.value.items.length}` }
}
```

The imported `cart` singleton IS the binding. Only reach for `@observe`
or `bindState` when you need the value as a class field.

## Scoping (`<schmancy-context provides>`)

The default state is a module-scoped singleton. `<schmancy-context>` is
the **only** way to scope a state per subtree. Reads and writes inside
the element auto-resolve to a per-element isolated copy via the
`@lit/context` request protocol; outside, they read the global.

```ts
<schmancy-context .provides=${[cart]}>
  <cart-view></cart-view>   <!-- isolated -->
</schmancy-context>
<cart-summary></cart-summary>   <!-- module-scoped global -->
```

Two infrastructure files own the mechanics:

- `state/active-host.ts` — `_activeHost` Variable + `Promise.then`
  patch + `_publishEventHost(node)` slot + `resolveActiveHost()`
  4-tier fallback (stack → event-host slot → `document.activeElement`
  → undefined). Hand-rolled TC39 AsyncContext.Variable polyfill
  (~30 lines for the Promise patch alone). The patch is idempotent and
  uses `_origThen.call(this, …)` so Promise subclassing /
  `Symbol.species` are untouched. Decommissions the day a real
  polyfill or native AsyncContext lands — drop the file, swap the
  `_activeHost` export.
- `state/schmancy-context.ts` — the `<schmancy-context>` element. One
  `ContextProvider` per state in `provides`; all destroyed on
  disconnect. Also installs capture-phase listeners on itself for
  ~18 common event types and calls `_publishEventHost(target)` from
  each — that's how inline arrow handlers attached to descendants
  resolve to the closest enclosing context.

`mixins/SchmancyElement.ts` carries the host-side integration points:
prototype-chain wrap of every concrete subclass at first construction
(caches in a `WeakSet`), and `addEventListener` / `removeEventListener`
overrides that wrap host listeners.

**Known limitation — native `await`.** V8's await optimization (since
7.x) skips the spec-prescribed `Promise.resolve(x).then(continuation)`
step, so the Promise.then patch does not see the resumption of an
`await` on a native Promise. Class methods that mutate state across an
`await` boundary fall back to the module-scoped global. To preserve
the host across awaits, keep the mutation in the synchronous prelude
before the first `await`, or chain explicitly with `.then(...)`.

## Rules for code in this directory

- **One file by default.** `state/index.ts` holds the factory, types,
  variant write APIs, persistence-debouncing wrapper, RxJS interop,
  decorator, and helpers. `persist.ts`, `active-host.ts`, and
  `schmancy-context.ts` are the only siblings — they own storage
  adapters / the JSON tunnel, the host tracker / `Promise.then` patch,
  and the scoping element respectively. Do not split further until a
  second consumer of an internal helper emerges.
- **Every read and write on a global instance routes through
  `resolveContextual`.** Don't add a fast path that bypasses it — the
  whole point of the scoping primitive is that consumer code is
  unchanged whether or not a `<schmancy-context>` ancestor exists.
- **Isolated copies are direct-access.** They serve as resolution
  targets and must not themselves call `resolveContextual` (would
  recurse). The `{ isolated: true }` branch in `createInstance`
  preserves this invariant.
- **Don't extend the `Promise.prototype.then` patch.** It is the
  minimum surface needed for await propagation. New schedulers
  (custom queueMicrotask wrappers, etc.) should be solved by routing
  through Promise, not by adding more patches.
- **No tsconfig flip.** Schmancy stays on `experimentalDecorators: true`.
  Any new decorator in this module is a legacy property/method
  decorator, same shape as `@property`/`@state`/`@query`.
- **No `accessor` keyword.** Implied by the line above — but call it
  out so a reviewer doesn't miss it. The schmancy codebase doesn't use
  `accessor`; this module follows the same convention.
- **Brand symbols are plain `Symbol(...)` constants** (`stateBrand`,
  `namespaceBrand`). They are private to the module and not exported.
  Do not export them; consumers use the `State<>` type for nominal
  identity.
- **Microtask-coalesced writes.** Every persistent backend wraps writes
  in a per-instance microtask debouncer. Multiple `set`/`update`/
  `replace` calls in the same task collapse to one `save()`. Do not
  bypass — write through the variant API.
- **`signal-polyfill` is the runtime contract.** `@lit-labs/signals` is
  the canonical import; it re-exports the polyfill plus
  `SignalWatcher`. Do not import `signal-polyfill` directly.

## Rules for tests

- **Vitest browser mode (Chromium via Playwright).** Real DOM, real
  IndexedDB, real localStorage. Imported via the schmancy
  `vitest.config.ts`.
- **Static namespaces in tests.** The factory's `${string}/${string}`
  template literal rejects dynamic strings. Use literal namespaces like
  `'test/foo'` so type inference works without casts.
- **`using` for test-scoped state.** `using cart = state(...).memory(...)`
  disposes on scope exit, including failure cases. Use plain `const`
  for module-scope state in production.
- **Microtask draining.** Signal-to-Observable emission and write
  coalescing both use `queueMicrotask`. After `state.set(...)`, call
  `await settle()` (two microtask drains) before asserting derived
  state, then `await el.updateComplete` for any host re-render.

## Rules for behaviour changes

- **Public surface is committed.** `value`, `signal`, `$`, `ready`,
  `loaded`, `defaultValue`, `namespace`, `storage`, `destroy`,
  `[Symbol.dispose]`, `[Symbol.asyncDispose]` (idb only), variant
  write methods. Don't rename, don't shape-shift. Add new things;
  don't change existing ones.
- **Variant API dispatch is `Kind<T>`-driven.** Don't add separate
  `mapState()` / `setState()` factories. If a new shape comes up,
  extend the `Kind<T>` classifier and add a matching variant API
  interface.
- **Storage keys are namespace strings.** `state('hannah/cart').local(...)`
  uses `'hannah/cart'` as the storage key. Don't expose a separate
  key parameter; the namespace IS the key.

## Pointers

- **State plan and Phase 0 findings:** the original implementation plan
  lives in `~/.claude/plans/indexed-twirling-stroustrup.md`; spike
  artifacts and findings are at
  `packages/schmancy/_scratch/spikes/findings.md` (gitignored).
- **Skill doc for downstream consumers:**
  `packages/schmancy/skills/schmancy/state.md`.
