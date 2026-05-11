# Schmancy State — Complete Developer Reference

> Source of truth. `@mhmo91/schmancy/state` · `packages/schmancy/src/state/` · 2026-05-08  
> Covers: foundational libraries, design patterns with mental models, full technical system design.

---

## How to read this document

Read **Part 1** first — it explains the two external libraries schmancy state is built on. Without understanding TC39 Signals and `@lit/context`, the design patterns are mechanisms without motivation.

Read **Part 2** to understand *why* the code is shaped the way it is — each pattern is named, given a mental model, shown visually, and grounded in actual code.

Read **Part 3** as a reference — low-level technical detail for every file, every function, every invariant.

---

# Part 1 — Foundational Libraries

## A. TC39 Signals — `signal-polyfill` · `@lit-labs/signals`

### The problem

A spreadsheet: cell `C1 = A1 + B1`. When `A1` changes, `C1` recomputes automatically — without you calling "recompute C1" explicitly. JavaScript has no built-in version of this. Every reactive system that ever existed (MobX, Vue reactivity, SolidJS signals, Svelte stores) solves the same problem with the same idea: *track which computations read which values, then invalidate those computations when the values change.*

TC39 Signals standardises this mechanism. `signal-polyfill` ships it today. `@lit-labs/signals` wraps it for Lit components.

### Three primitives

**`Signal.State<T>` — the mutable leaf**

Holds a value. Notifies dependents when replaced. This is the bottom of the graph.

```ts
const n = new Signal.State(0)
n.get()    // → 0
n.set(1)   // notifies all dependents
n.get()    // → 1
```

**`Signal.Computed<T>` — the derived cell**

Lazy. Runs a callback to produce a value. Caches the result until any dependency changes. Re-runs only when `.get()` is called after a dependency was set.

```ts
const doubled = new Signal.Computed(() => n.get() * 2)
doubled.get()   // runs fn → 2
doubled.get()   // cached — fn NOT run → 2
n.set(5)
doubled.get()   // dependency changed — re-runs → 10
```

**`Signal.subtle.Watcher` — the push hook**

Low-level. Fires a callback the moment any watched signal or computed *becomes dirty* (i.e. its value may have changed). This is what bridges the pull model to external push systems — RxJS observables, Lit's `requestUpdate()`.

```ts
const w = new Signal.subtle.Watcher(() => {
  // fires synchronously when any watched signal is set
  w.watch()   // must re-arm — Watcher disarms itself after each notification
})
w.watch(n)    // start watching
```

### How auto-tracking works — the core mechanism

The polyfill maintains a single module-level variable: **`activeConsumer`**. When a `Computed`'s callback runs, `activeConsumer` is set to that computed. Every `signal.get()` call checks `activeConsumer` and registers itself as a dependency of the current consumer. No explicit subscribe call — **the read is the registration**.

```
// Trace: what happens inside Computed.get()

activeConsumer = doubled_computed     ← set before running the callback

  doubled_computed.fn():
    n.get()                           ← n checks activeConsumer
    n._subscribers.add(doubled)       ← n records doubled as a dependent
    return n._value  (0)

activeConsumer = null                 ← cleared after callback

// Later: n.set(5)
n._value = 5
doubled_computed.markDirty()          ← n notifies all subscribers
  doubled_computed._dirty = true
  Watcher callback fires              ← if a Watcher was watching doubled
```

### SignalWatcher — how Lit plugs in

`SignalWatcher` (from `@lit-labs/signals`) is a class mixin that intercepts Lit's `performUpdate()` and wraps it in a `Signal.Computed`. A `Signal.subtle.Watcher` watches that computed. When any signal read during the last render changes, the Watcher fires and calls `requestUpdate()`.

```ts
// Reconstructed from minified source (signal-watcher.js)
class SignalWatcher extends LitElement {
  _renderComputed = new Signal.Computed(() => {
    super.performUpdate()     // your render() runs inside here
  })

  _watcher = new Signal.subtle.Watcher(() => {
    this.requestUpdate()      // schedule Lit re-render
    this._watcher.watch()     // re-arm
  })

  performUpdate() {
    this._watcher.watch(this._renderComputed)
    this._renderComputed.get()  // runs render(), auto-tracking all signal reads
  }
}
```

`SchmancyElement` already includes `SignalWatcher`. Reading `cart.value` in `render()` IS the subscription. No decorator, no setup.

### Full cycle — trace by hand

```
1. const cart = new Signal.State({ items: [], total: 0 })

2. render() runs (inside SignalWatcher's Computed)
   activeConsumer = renderComputed
   cart.get()  →  cart._subscribers.add(renderComputed)
   renders "Total: 0"
   activeConsumer = null

3. cart.set({ items: ['x'], total: 12 }) — called anywhere in the app
   cart._value = { items: ['x'], total: 12 }
   renderComputed.markDirty()
   _watcher callback fires (synchronous)
   queueMicrotask(() => component.requestUpdate())

4. microtask: Lit re-renders
   renderComputed.get()  →  re-runs render(), re-tracks deps
   renders "Total: 12"  ✓
```

---

## B. `@lit/context` — tree-scoped value injection

### The problem

You have a value many nested components need — a theme, a cart, a user session. Passing it as a property through every intermediate element ("prop drilling") is brittle and coupling. **Context** is the alternative: a provider at any tree position announces a value; any descendant requests it without any intermediate element knowing.

React has `createContext / useContext`. `@lit/context` is the same idea implemented with the DOM's own event system — no framework runtime required.

### The mechanism — one event

The entire protocol is a single custom DOM event: `"context-request"`. It bubbles up the DOM. A provider listens for it and calls the requester's callback with the value.

```ts
// The event — from actual source (context-request-event.js)
class ContextRequestEvent extends Event {
  constructor(context, contextTarget, callback) {
    super('context-request', { bubbles: true, composed: true })
    this.context = context         // identity key (a Symbol)
    this.contextTarget = contextTarget
    this.callback = callback       // "call me with the value"
  }
}

// The provider — from context-provider.js
host.addEventListener('context-request', (e) => {
  if (e.context !== this.context) return   // wrong key — ignore
  if (e.contextTarget === host)   return   // don't serve yourself
  e.stopPropagation()                      // closest provider wins
  e.callback(this.value)                   // deliver the value
})
```

### Why `Symbol.for()` is critical

Provider and consumer must use the *exact same key object*. `Symbol('x') !== Symbol('x')` — each call creates a unique symbol. `Symbol.for('x') === Symbol.for('x')` — the runtime-global registry returns the same symbol for the same string, even across separate bundle copies. Schmancy uses `Symbol.for('schmancy.state:' + namespace)` so Bundle A's provider matches Bundle B's request.

### Full resolution — trace by hand

```
DOM tree:
  <app>
    <schmancy-context .provides=${[cart]}>   ← ContextProvider installed here
      <checkout-page>
        <cart-view>                          ← wants isolated copy

Step 1 — cart-view calls cart.value inside render()
  resolveContextual('hannah/cart', globalFallback)
    host = resolveActiveHost()  →  <cart-view> element

Step 2 — dispatch ContextRequestEvent from <cart-view>
  let resolved
  cartViewEl.dispatchEvent(new ContextRequestEvent(
    Symbol.for('schmancy.state:hannah/cart'),
    cartViewEl,
    value => { resolved = value }
  ))
  // bubbles: cart-view → checkout-page → schmancy-context

Step 3 — ContextProvider on <schmancy-context> intercepts
  e.context === our key?      yes
  e.contextTarget === host?   no (it's cart-view)
  e.stopPropagation()         ← outer providers never see this
  e.callback(isolatedCopy)    ← resolved = isolatedCopy ✓

Step 4 — resolveContextual caches and returns
  hostResolverCache[cartViewEl]['hannah/cart'] = isolatedCopy
  cart.value → isolatedCopy.value  ✓

Step 5 — same render() again
  cache hit → skip event entirely → O(1)  ✓
```

**`bubbles: true`** — event travels up the DOM so a nested consumer reaches a distant provider.  
**`composed: true`** — event crosses shadow DOM boundaries. Without it, shadow roots silently block the event.  
**`stopPropagation()`** — closest provider wins. Outer providers never see the event.

---

# Part 2 — Design Patterns

## Pattern 01 — Module-Scoped Singleton

**Named pattern:** Singleton · Module system

> *"One name, one value, everywhere the module is imported."*

**Mental model:** A plain JavaScript `const` at the top of a file. ES module semantics guarantee it is evaluated once and the same object is returned to every importer. That is the singleton. The state factory makes this the *default* by producing an object that lives on the module's scope, never inside a class or function.

```
// cart.state.ts
export const cart = state<CartState>('hannah/cart').session(initial)
                         │
    ┌────────────────────┼────────────────────┐
    ▼                    ▼                    ▼
CartView.ts         CartSummary.ts        CheckoutPage.ts
import {cart}       import {cart}         import {cart}
← same object ─────────────────────────────────────────
```

The singleton is not managed by a service locator or DI container. It is the JS module system itself. No registry to look up, no `getInstance()` to call — just an import.

**The one rule:** Never use `using cart = state(...)` at module scope. The `using` keyword disposes on scope exit — which for a module-level variable is never until the tab closes. Reserve `using` for test scope where you want explicit teardown.

---

## Pattern 02 — Transparent Proxy

**Named pattern:** Proxy · Structural

> *"The same `cart.value` call routes to a different object depending on where you are in the DOM tree — and you never know."*

**Mental model:** A receptionist who receives every call. Most of the time she routes it to the main office (module-scoped signal). But if a call comes in while the caller is sitting inside a special meeting room (`<schmancy-context>`), she routes it to the room's private whiteboard. The caller never dials a different number — they always call the receptionist — but who actually picks up changes based on physical location.

```
DOM tree:
  <app>
    ├── <schmancy-context .provides=${[cart]}>   ← installs isolated copy A
    │     ├── <cart-view>
    │     │     cart.value  →  isolated copy A
    │     │     cart.set()  →  isolated copy A
    │     └── <cart-summary>
    │           cart.value  →  isolated copy A
    │
    └── <sidebar>
          cart.value  →  module-scoped global
          cart.set()  →  module-scoped global

Same variable. Different target. No code change in consumers.
```

**How the proxy is built — without ES `Proxy`:**

```ts
// Every public accessor on the global instance is a live getter
Object.defineProperty(instance, 'value', {
  get: () => {
    const target = resolveContextual(namespace, isolatedTarget)
    return target.value    // reads from whichever target resolved
  }
})

// Every write method also routes through resolveContextual
instance['set'] = (...args) => {
  const target = resolveContextual(namespace, isolatedTarget)
  return target['set'](...args)
}
```

`Object.defineProperty` live getters are used instead of `ES Proxy` because the interception needs to know the *caller's DOM position*, which requires the active-host tracking system (Pattern 06) as an orthogonal concern.

---

## Pattern 03 — Adapter / Storage Port

**Named pattern:** Adapter · Ports & Adapters · Strategy

> *"The state logic never touches a storage API directly. It talks to a uniform interface, and the backend is swapped by configuration."*

**Mental model:** A document that needs to be filed. The document doesn't care whether the filing cabinet is in the same room (memory), the local office (sessionStorage), an office that survives overnight (localStorage), or a central warehouse that never forgets (IndexedDB). It hands the document to a filing clerk. The interface to the clerk is always the same: *file this, retrieve this, destroy this*.

```ts
interface StorageAdapter<T> {
  load():           Promise<T | null>
  save(value: T):   Promise<void>
  clear():          Promise<void>
  close?():         Promise<void>   // IDB only
}

// Four implementations, one interface:
MemoryAdapter      → .memory()    JS heap, no I/O
WebStorageAdapter  → .local()     localStorage
WebStorageAdapter  → .session()   sessionStorage
IndexedDBAdapter   → .idb()       IndexedDB 'SchmancyState'/'states'
```

**The Map/Set JSON tunnel** (a nested adapter inside `WebStorageAdapter`):  
`localStorage` only stores strings. `Map` and `Set` aren't JSON-serialisable by default. A custom replacer/reviver pair handles the translation:

```ts
// On save:
Map  →  { $kind: '__schmancy_state_Map', entries: [[k, v], …] }
Set  →  { $kind: '__schmancy_state_Set', values: [v, …] }
// On load: reviver reconstructs. IDB stores native objects — no tunnel needed.
```

Adding a new backend (e.g. OPFS) requires one new class implementing `StorageAdapter<T>` and one case in `createAdapter()`. Nothing else changes.

---

## Pattern 04 — Dual Observer (Signal + Observable)

**Named pattern:** Observer · Pull + Push · Bridge

> *"One value, two reactive surfaces — pull (signals) for the render loop, push (Observables) for pipelines."*

**Mental model:** Signals are a thermometer on the wall. You glance at it whenever you need the temperature — you *pull* the value. Observables are like weather alerts — the system *pushes* a notification at the moment something changes. Both surfaces sit over the same measurement.

```
                    Signal.State<T>
                    signal.set(next) ← writes
                         │
         ┌───────────────┼───────────────────────┐
         ▼                                       ▼
  PULL SURFACE                           PUSH SURFACE
  signal.get() / state.value             Observable<T> / state.$
  (TC39 signals)                         (RxJS)
         │                                       │
  SignalWatcher auto-tracks             Signal.subtle.Watcher
  reads inside render()                 + queueMicrotask bridge
         │                                       │
  component.requestUpdate()             subscriber.next(signal.get())
```

**The bridge — how Signal becomes Observable:**

```ts
function signalToObservable<T>(signal): Observable<T> {
  return new Observable(subscriber => {
    subscriber.next(signal.get())                 // ① immediate initial emission
    let scheduled = false
    const watcher = new Signal.subtle.Watcher(() => { // ② fires on signal.set()
      if (scheduled) return
      scheduled = true
      queueMicrotask(() => {
        scheduled = false
        if (subscriber.closed) return
        subscriber.next(signal.get())             // ③ push latest, coalesced
        watcher.watch(signal)                     // ④ re-arm
      })
    })
    watcher.watch(signal)
    return () => watcher.unwatch(signal)          // ⑤ cleanup on unsubscribe
  })
}
```

Use **signals / `.value`** when: reading inside `render()`, feeding `computed()`, running `effect()`, needing synchronous access.  
Use **Observable / `.$`** when: composing with other streams (`combineLatest`, `switchMap`), debouncing/throttling, piping with `takeUntil(this.disconnecting)`.

---

## Pattern 05 — Type-Driven Command Dispatch

**Named pattern:** Command · Strategy · Discriminated Union

> *"The shape of your data determines which write commands exist. TypeScript's type system makes the wrong operation inexpressible."*

**Mental model:** A chef's knife block. The shape of the slot tells you exactly which knife fits. If you have a `Map`, you get `set(k,v)`, `delete(k)`, `clear()`. You cannot accidentally call `push()` on a Map — the type system prevents it.

```
T = Map<K,V>         →  Kind = 'map'    →  MapAPI<T>
T = Set<U>           →  Kind = 'set'    →  SetAPI<T>
T = U[]              →  Kind = 'array'  →  ArrayAPI<T>
T = string|number|…  →  Kind = 'prim'   →  ScalarAPI<T>
T = Foo | null       →  Kind = 'null'   →  ScalarAPI<T>
T = { … }            →  Kind = 'obj'    →  ObjectAPI<T>

const sel = state<Set<string>>('ui/sel').memory(new Set())
sel.add('id')      ✓
sel.toggle('id')   ✓
sel.push('id')     ✗  TypeScript error — push does not exist on SetAPI
```

**All writes funnel into one `commit()` function:**

```ts
const commit = (next: unknown): void => {
  internal.signal.set(next)   // synchronous — visible immediately
  scheduleWrite(internal)     // persist via adapter, microtask-debounced
}

// Every write method is syntactic sugar over commit():
// ObjectAPI:
set(patch, merge = true) { commit(merge ? {...current, ...patch} : patch) }
update(recipe)           { commit(produce(current, recipe)) }  // immer

// SetAPI:
toggle(value) {
  const next = new Set(current)
  next.has(value) ? next.delete(value) : next.add(value)
  commit(next)
}
```

**Immutability by construction:** every write produces a new value — spread for objects, `new Map(current)` for maps, `new Set(current)` for sets, spread for arrays, or immer's `produce()` for recipes. Nothing mutates in place. Reference inequality = change.

---

## Pattern 06 — Zone / Execution Context Propagation

**Named pattern:** Zone · AsyncContext polyfill · Ambient state

> *"Knowing which DOM element is 'currently running code' — even across async boundaries — without passing it as a parameter."*

**Mental model:** A call centre where every agent wears a badge saying which client file they are working on. The badge tells the system which client's records to look up. Zone.js is the classic implementation. Schmancy implements a minimal version — a per-call-stack "badge" identifying which DOM element is currently executing — using a global stack and a Promise patch.

**Four-tier fallback chain:**

```
Tier 1: Explicit stack
  _activeHost.run(host, fn): pushes host, calls fn, pops on exit
  SchmancyElement prototype-wrap calls .run(this, fn) around every
  concrete method: render(), connectedCallback(), firstUpdated(),
  class methods called from any of those.

Tier 2: Promise.prototype.then patch
  Captures stack head at .then() chain-time; restores when callback fires.
  fetch('/api').then(data => { cart.update(…) })   ← works ✓
  async method: const data = await fetch()
                cart.update(…)                     ← does NOT work (V8 opt) ✗

Tier 3: Event-host slot
  <schmancy-context> installs capture-phase listeners for 16 event types.
  When a DOM event fires, it publishes the deepest HTMLElement as host.
  Slot self-clears via queueMicrotask.
  <button @click=${() => cart.set(…)}>             ← works ✓

Tier 4: document.activeElement
  Keyboard / focus handlers.

Tier 5 (implicit): undefined → module-scoped global
```

**The Promise patch:**

```ts
const _origThen = Promise.prototype.then
Promise.prototype.then = function(onfulfilled, onrejected) {
  const captured = _stack[_stack.length - 1]    // capture NOW at chain time
  const wrapFulfilled = v => {
    _stack.push(captured)                        // restore at CALLBACK time
    try   { return onfulfilled(v) }
    finally { _stack.pop() }
  }
  return _origThen.call(this, wrapFulfilled, wrapRejected)
}
```

**Known limitation:** V8's native `await` optimization (since v7.x) bypasses `Promise.resolve(x).then(continuation)` — the patch never fires for `await`-resumed continuations. Mutations after the first `await` fall back to the module-scoped global. Fix: keep mutations before the `await`, or chain explicitly with `.then()`.

---

## Pattern 07 — Provider / Consumer (Context Protocol)

**Named pattern:** Context · @lit/context · Tree-scoped DI

> *"A provider in the DOM tree answers requests from consumers below it, without knowing who they are."*

**Mental model:** React Context. A `<Provider value={x}>` wraps a subtree; any `useContext()` inside it receives `x`. `<schmancy-context>` is the same idea for Web Components, implemented with DOM events instead of a VDOM tree walk.

```
Consumer dispatches:
  new ContextRequestEvent(
    Symbol.for('schmancy.state:hannah/cart'),
    consumerElement,
    value => { resolved = value }
  )
  // bubbles up the DOM

Provider (<schmancy-context>) intercepts:
  ContextProvider listens for 'context-request'
  checks: event.context === our key?
  yes → event.callback(isolated_copy)
        event.stopPropagation()     ← closest provider wins

Nested:
  <schmancy-context .provides=${[cart]}>   ← outer
    <schmancy-context .provides=${[cart]}> ← inner
      <cart-view>
        cart.value  →  inner's copy  ✓ closest wins
```

**`<schmancy-context>` on connect:**

```ts
for (const tmpl of this.provides) {
  const isolated = tmpl._isolatedInstance()
  // ^ createInstance({ storage: 'memory', initial: tmpl.value }, { isolated: true })
  // ^ seeded from global's current value; always memory-backed
  const ctx = createContext(Symbol.for('schmancy.state:' + tmpl.namespace))
  const provider = new ContextProvider(this, { context: ctx, initialValue: isolated })
  this._scoped.push({ isolated, provider })
}
// + capture-phase listeners for 16 event types → Tier 3 of active-host chain
```

**On disconnect:** `isolated.destroy()` for each — flushes pending writes, releases namespace claim.

Isolated copies are **always memory-backed** — they share the element's lifetime, never persist to localStorage/sessionStorage/IDB.

---

## Pattern 08 — Prototype Decoration (ReactiveController)

**Named pattern:** Decorator · ReactiveController · Template Method

> *"Attach subscription lifecycle to a component's class without modifying the class body."*

**Mental model:** A Decorator Pattern attaches new behaviour to an object without changing its source. Lit's `addInitializer` is the hook. The `@observe` decorator and `bindState` both use `ReactiveController` as the attachment — a standardised plugin interface: *tell me when the host connects and disconnects, and I'll wire subscriptions.*

**Three binding options — decreasing magic:**

```ts
// Option 1: Direct render() read — SignalWatcher auto-tracks (zero code)
class CartView extends SchmancyElement {
  render() { return html`${cart.value.items.length}` }
}

// Option 2: @observe — field updated on each emission
class CartView extends SchmancyElement {
  @observe(cart) cart!: CartState
  onClick() { console.log(this.cart) }  // safe in event handlers
}

// Option 3: bindState — same controller, no decorator
class CustomHost extends LitElement {  // not a SchmancyElement
  cart = bindState(this, cart)
  render() { return html`${this.cart.value.items.length}` }
}
```

**How `@observe` works — two hooks:**

```ts
export function observe<T>(source) {
  return function(proto, propertyKey) {
    const storageKey = Symbol(`__observe_${propertyKey}`)

    // Hook 1: per-PROTOTYPE accessor (runs on every instance via prototype chain)
    Object.defineProperty(proto, propertyKey, {
      get(this) { return this[storageKey] ?? source.value },  // latest or fallback
      set(_)    { console.warn('@observe: read-only') },
    })

    // Hook 2: per-INSTANCE subscription (runs at construction via addInitializer)
    proto.constructor.addInitializer(host => {
      let sub
      host.addController({
        hostConnected()    { sub = source.$.subscribe(v => { host[storageKey] = v; host.requestUpdate() }) },
        hostDisconnected() { sub?.unsubscribe() },
      })
    })
  }
}
```

`ReactiveController` is Lit's **Template Method** pattern: the framework defines *when* (`hostConnected`, `hostDisconnected`); the controller fills in the *what*.

---

## Pattern 09 — Microtask Debounce Gate

**Named pattern:** Debounce · Event coalescing

> *"Many writes in one synchronous task collapse to one storage flush — the gate only lets the last one through."*

**Mental model:** A postal worker who collects letters all day but makes one trip to the post office at day's end. Ten letters in the outbox → one trip carries all ten. The debounce works at JS-microtask granularity: many `set()`/`update()` calls in the same synchronous task collapse to one `adapter.save()`, which always carries the *latest* value.

```
cart.set({ total: 10 })    → signal updated immediately ✓
cart.set({ total: 20 })    → signal updated immediately ✓
cart.set({ total: 30 })    → signal updated immediately ✓

scheduleWrite():
  if (scheduledWrite) return   ← 2nd and 3rd calls exit here
  scheduledWrite = true
  queueMicrotask(() => {
    scheduledWrite = false
    adapter.save(signal.get())  ← reads 30, the latest value
  })

Result: one adapter.save(30) — not three.

Timeline:
  sync task  │ set(10) set(20) set(30) │microtask│ save(30) │
             │ signal always current    │boundary │ one I/O  │
```

**Two microtask drains on dispose** (to guarantee the latest value is flushed):

```ts
async flushAndClose() {
  if (internal.pendingWrite) await internal.pendingWrite    // ① in-flight save
  await new Promise(resolve => queueMicrotask(resolve))    // ② let scheduled task run
  if (internal.pendingWrite) await internal.pendingWrite    // ③ catch write from ②
  if (adapter.close) await adapter.close()                  // ④ IDB close
}
```

---

## Pattern 10 — RAII Lifecycle

**Named pattern:** RAII · Symbol.dispose · TC39 Explicit Resource Management

> *"Acquire the resource when you create the object; release it automatically when the object goes out of scope — even if an exception is thrown."*

**Mental model:** C++ RAII, now in JavaScript via TC39. `using x = acquireResource()` guarantees `x[Symbol.dispose]()` at block exit — even on thrown exceptions. No `try/finally`, no `afterEach(() => cleanup())`.

```ts
// WITHOUT RAII — easy to forget cleanup
it('test', () => {
  const cart = state('test/cart').memory({})   // plain const
  cart.set({ total: 10 })
  expect(cart.value.total).toBe(10)
  // forgot to call cart.destroy()
  // namespace 'test/cart' is permanently claimed
  // next test: state('test/cart') throws or returns stale instance
})

// WITH RAII — cleanup is structural
it('test', () => {
  using cart = state('test/cart').memory({})
  cart.set({ total: 10 })
  expect(cart.value.total).toBe(10)
  // [Symbol.dispose]() called automatically here — even if expect() threw
})   // namespace released, next test starts clean

// IDB — async variant
it('test', async () => {
  await using cart = state('test/cart').idb({})
  // [Symbol.asyncDispose]() awaited on exit — IDB fully closed before next test
})
```

**What dispose does:**

```ts
[Symbol.dispose]():
  if (disposed) return               // idempotent
  disposed = true
  void flushAndClose()               // fire-and-forget (sync backends)
  claimed.delete(namespace)          // releases namespace → re-registrable

[Symbol.asyncDispose]() (IDB only):
  if (disposed) return
  disposed = true
  await flushAndClose()              // fully awaited
  claimed.delete(namespace)
```

**Module-scope footgun:** `using` at module scope disposes when the module record is GC'd — effectively never. Module-scope state uses plain `const`.

---

## Pattern 11 — Flyweight / Global Registry

**Named pattern:** Flyweight · Global registry · Module Federation

> *"Share one instance across all importers — even across separate bundle copies — by parking it in a key-value store keyed off a process-global Symbol."*

**Mental model:** The Flyweight pattern avoids creating many copies of the same object by sharing one canonical instance. In a browser app with Module Federation, two separate bundles (host and remote) each import `schmancy/state`. Without coordination, each bundle creates its own `claimed` Set and `instances` Map. They produce different `cart` objects — writing through Bundle A doesn't update Bundle B's signal. Fix: park everything on `globalThis` under `Symbol.for()` keys so all bundles share the same store.

```
// WITHOUT globalThis registry (broken)
Bundle A: claimed: Set, instances: Map, cart₁ (signal A)
Bundle B: claimed: Set, instances: Map, cart₂ (signal B)  ← different!
cart₁.set({x:1}) → cart₂.value === {}  ← B never saw the write

// WITH globalThis registry (correct)
globalThis[Symbol.for('schmancy.state.claimed')]          = Set<string>
globalThis[Symbol.for('schmancy.state.instances')]        = Map<'ns@storage', instance>
globalThis[Symbol.for('schmancy.state.hostResolverCache')]= WeakMap
globalThis[Symbol.for('schmancy.state.activeHost.stack')] = Array
globalThis[Symbol.for('schmancy.state.activeHost.eventHost')] = slot

Bundle A loads first → creates all five structures
Bundle B loads later → finds existing structures, reuses them
  cart₁.set({x:1}) → cart₂.value === {x:1}  ✓
```

**The idempotent make pattern:**

```ts
// ??= operator: "assign only if not already set"
__claimedSlot[CLAIMED_KEY] ??= new Set<string>()

// makeHandle: create-or-return
const ensure = (storage) => (initial) => {
  const key = `${namespace}@${storage}`
  const cached = instances.get(key)
  if (cached !== undefined) return cached      // second caller gets same instance
  const instance = createInstance({ namespace, initial, storage })
  instances.set(key, instance)
  return instance
}
```

---

## Pattern 12 — How the Patterns Assemble

Each pattern solves a specific problem. They compose so each layer's output is the next layer's input.

```
┌──────────────────────────────────────────────────────────────────┐
│  Consumer layer (what you write)                                 │
│  cart.value / cart.set() / cart.$ / await cart.ready            │
│  @observe(cart) / bindState(this, cart) / computed(...)         │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 08  Prototype Decoration                                │
│  @observe and bindState attach ReactiveControllers to Lit hosts  │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 02  Transparent Proxy                                   │
│  Every read/write on the global routes through resolveContextual │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 06  Zone / Execution Context                            │
│  resolveActiveHost() answers "who is calling right now?"         │
│  stack / Promise.then patch / event-host slot / activeElement    │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 07  Provider / Consumer (Context Protocol)              │
│  ContextRequestEvent dispatched from host — nearest wins         │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 01  Module-Scoped Singleton  (the fallback)             │
│  If no context provider found — use the module-scoped global     │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 04  Dual Observer (Signal + Observable)                 │
│  Signal for pull (Lit render), Observable for push (RxJS)        │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 05  Type-Driven Command Dispatch                        │
│  Kind<T> routes to MapAPI / SetAPI / ArrayAPI / ObjectAPI        │
│  All commits go through one commit(next) function                │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 09  Microtask Debounce Gate                             │
│  Many writes collapse to one adapter.save() per microtask        │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 03  Adapter / Storage Port                              │
│  Memory / WebStorage / IndexedDB behind uniform load/save/clear  │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 10  RAII Lifecycle                                      │
│  Symbol.dispose / Symbol.asyncDispose — flush + release + close  │
├──────────────────────────────────────────────────────────────────┤
│  Pattern 11  Flyweight / Global Registry                         │
│  globalThis[Symbol.for(...)] shares instances across bundles     │
└──────────────────────────────────────────────────────────────────┘
```

| Pattern | Problem it solves | Alternative rejected |
|---|---|---|
| 01 Singleton | State survives component remounts | Class-instance state, Redux |
| 02 Transparent Proxy | Consumer code unchanged whether scoped or global | Props, different variable name per scope |
| 03 Adapter | Swap storage backend without touching state logic | Hardcoded localStorage calls |
| 04 Dual Observer | Both Lit (pull) and RxJS (push) need reactivity | RxJS-only, signals-only |
| 05 Command Dispatch | Ergonomic writes per shape, no type casting | One generic `setState()` |
| 06 Zone | Know which DOM element is executing, across async | Pass host as parameter, Zone.js (~50 KB) |
| 07 Provider/Consumer | Subtree-scoped state, no consumer code changes | React context, custom event protocol |
| 08 Prototype Decoration | State bound to field with lifecycle guarantees | Manual subscribe/unsubscribe per component |
| 09 Debounce Gate | Burst writes → one I/O call | Write on every set(), batch manually |
| 10 RAII | Guaranteed cleanup even on test failure | afterEach(), try/finally |
| 11 Flyweight | One instance across bundle copies | Module-level singleton (breaks MF) |

---

# Part 3 — Technical Reference

## File map

```
packages/schmancy/src/state/
  index.ts            — factory, types, write APIs, context resolution,
                        observe decorator, bindState, stateFromObservable, effect
  persist.ts          — StorageAdapter interface + four implementations
  active-host.ts      — AsyncContext polyfill (stack + Promise.then patch + event-host slot)
  schmancy-context.ts — <schmancy-context> element (scoping primitive)
```

## Factory — three TypeScript overloads

```ts
// Overload A — registry augmentation (typo-safe, autocomplete)
declare module '@mhmo91/schmancy/state' {
  interface SchmancyStateRegistry { 'hannah/cart': CartState }
}
const cart = state('hannah/cart').session({ items: [], total: 0 })

// Overload B — explicit T arg (inline literals)
const cart = state<CartState>('hannah/cart').session({ items: [], total: 0 })

// Overload C — typed const (T inferred, no cast needed)
const initial: CartState = { items: [], total: 0 }
const cart = state('hannah/cart').session(initial)
```

All return a `NamespaceHandle` with four backend methods. Each returns `State<NS, T, StorageBackend>` composed of `BaseAPI + WriteAPI<T>`.

**Namespace constraint:** `FeatureNamespace = \`${string}/${string}\`` — enforced at compile time and runtime.

## Instance construction (`createInstance`)

```
createInstance({ namespace, initial, storage }, { isolated? })
  │
  ├─ createAdapter(storage, namespace)           → StorageAdapter
  ├─ new Signal.State<T>(initial)                → TC39 signal
  ├─ adapter.load()                              → signal.set(stored) if not null
  │    .then(markLoaded)                         → loaded = true; ready resolves
  ├─ signalToObservable(signal)                  → Observable via Signal.subtle.Watcher
  └─ buildWriteApi(internal, detectKind(initial))→ variant write methods
```

Global instances route all reads/writes through `resolveContextual`. Isolated instances (`{ isolated: true }`) read/write their own signal directly — no context resolution, no recursion.

## Storage backends

| Method | Backing | Survives refresh | Survives close |
|---|---|---|---|
| `.memory(initial)` | JS heap | ❌ | ❌ |
| `.session(initial)` | `sessionStorage` | ✅ | ❌ (per-tab) |
| `.local(initial)` | `localStorage` | ✅ | ✅ |
| `.idb(initial)` | IndexedDB | ✅ | ✅ |

IDB additionally implements `AsyncDisposable` (`[Symbol.asyncDispose]`).

## Context resolution (`resolveContextual`)

```
resolveContextual(namespace, fallback):
  1. host = resolveActiveHost()         — may return undefined
  2. if undefined → return fallback     — module-scoped global
  3. check hostResolverCache[host][namespace]
     → cache hit → return immediately (O(1))
  4. dispatch ContextRequestEvent from host
     → provider responds → resolved = isolated copy
     → no response      → resolved = fallback
  5. cache result in hostResolverCache[host][namespace]
  6. return resolved
```

`hostResolverCache` is a `WeakMap<HTMLElement, Map<string, unknown>>` on `globalThis`.

## Active-host resolution chain

```
resolveActiveHost():
  1. _activeHost.get()          ← explicit stack (SchmancyElement prototype-wrap)
  2. _eventHostSlot.host        ← capture-phase event on <schmancy-context>
  3. document.activeElement     ← keyboard / focus
  4. undefined                  ← caller uses module-scoped global
```

## Component binding options

| Option | When to use | Mechanism |
|---|---|---|
| `cart.value` in `render()` | Default — 80% of cases | SignalWatcher auto-tracking |
| `@observe(cart) field!: T` | Need value as class field (handlers, devtools) | addInitializer + ReactiveController |
| `bindState(this, cart)` | Non-SchmancyElement Lit host | ReactiveController directly |

## `computed()`, `effect()`, `stateFromObservable()`

**`computed(fn)`** — re-export of `@lit-labs/signals/computed`. Reading `state.value` inside the callback auto-tracks it. Reference-equality dedup by default.

**`effect(fn)`** — runs `fn` immediately (registers deps), then re-runs (microtask-coalesced) whenever any read signal changes. Returns `Disposable`.

**`stateFromObservable(obs$, namespace, initial)`** — creates a state, subscribes to the observable, calls `signal.set(value)` directly on each emission (bypasses `resolveContextual`). Wraps `[Symbol.dispose]` to also unsubscribe.

## Lifecycle — disposal sequence

```
using cart = state('test/x').memory(initial)
  │
  └── [Symbol.dispose]() at block exit
        if (disposed) return
        disposed = true
        void flushAndClose()
          await pendingWrite
          await queueMicrotask      ← drain scheduled write
          await pendingWrite        ← catch write from microtask
          await adapter.close()    ← IDB only
        claimed.delete(namespace)  ← namespace re-registrable
```

## Key invariants

| Invariant | Where enforced |
|---|---|
| Namespace must contain `/` | TypeScript template literal + runtime throw |
| One global per namespace | `claimed` Set + `instances` Map on `globalThis` |
| Context dispatch is O(1) after first | `hostResolverCache` WeakMap |
| Isolated copy never calls `resolveContextual` | `{ isolated: true }` branch |
| Write persists async, never blocks signal | `scheduleWrite` → `queueMicrotask` |
| `Signal.State.set()` is synchronous | TC39 signal polyfill contract |
| Multiple bundle copies share one registry | All global state under `Symbol.for(...)` |
| No in-place mutation | Spread / `new Map()` / `new Set()` / immer `produce()` |

## Full data-flow diagram

```
User calls cart.set({ total: 12 })
         │
         ▼
  resolveContextual(namespace, isolatedTarget)
         │
         ├─ resolveActiveHost()
         │    ├─ 1. _activeHost stack (SchmancyElement prototype-wrap)
         │    ├─ 2. _eventHostSlot   (capture-phase event)
         │    ├─ 3. document.activeElement
         │    └─ 4. undefined → use isolatedTarget (module global)
         │
         ├─ cache hit?  → return cached target
         │
         └─ dispatch ContextRequestEvent from host
              ├─ <schmancy-context> responds → isolated copy
              └─ no response → module-scoped global
                       │
                       ▼
             target.set({ total: 12 })
                       │
             ObjectAPI.set(patch, merge=true)
               commit({ ...current, ...patch })
                       │
         ┌─────────────┴──────────────────────┐
         ▼                                    ▼
  signal.set(next)                  scheduleWrite(internal)
  (synchronous)                            │
         │                          queueMicrotask
         │                                  │
         ▼                                  ▼
  Signal.subtle.Watcher fires      adapter.save(signal.get())
         │                         (localStorage / IDB / …)
         ▼
  signalToObservable: queueMicrotask → emit
         │
  ┌──────┴────────────────────────┐
  ▼                               ▼
  SignalWatcher (Lit)          RxJS subscribers
  → requestUpdate() → re-render   pipe(takeUntil(disconnecting))
```

## Quick-decision guide

| I need… | Use |
|---|---|
| State in a Lit component template | `cart.value` in `render()` |
| State as a class field (event handlers) | `@observe(cart) cart!: CartState` |
| State in a non-SchmancyElement Lit host | `bindState(this, cart)` |
| Derived / computed value | `computed(() => cart.value.items.length)` |
| Side effect that reruns on change | `effect(() => { … cart.value … })` |
| Lift an Observable into state | `stateFromObservable(obs$, 'ns/key', initial)` |
| Isolated subtree copy | `<schmancy-context .provides=${[cart]}>` |
| Per-test isolation | `using cart = state('test/x').memory(initial)` |
| Persist across page refresh (same tab) | `.session(initial)` |
| Persist across tab close | `.local(initial)` or `.idb(initial)` |
| Large collections (>100 entries) | `.idb(initial)` |
| Wait for async hydration | `await cart.ready` / `if (cart.loaded)` |
