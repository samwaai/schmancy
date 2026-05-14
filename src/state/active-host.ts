// `_`-prefixed identifiers below are an intentional naming convention for
// module-private infrastructure. `_activeHost` is exported only so the
// $LitElement mixin can wrap render/lifecycle in `_activeHost.run`; the
// underscore signals "not part of the public state API."
/* oxlint-disable no-underscore-dangle */

// Active-host tracker for context-aware state resolution.
//
// Polyfills the TC39 `AsyncContext.Variable` propagation primitive using a
// stack + a one-time `Promise.prototype.then` patch. The stack value carries
// across `await`, `queueMicrotask`, RxJS subscription callbacks, and any
// other code path that ultimately routes through `Promise.then`. This is the
// same capture-and-restore technique zone.js, async-hooks, and the various
// AsyncContext userland polyfills use.
//
// Why we own this:
//   - The TC39 proposal is at stage 2; no official polyfill ships from TC39.
//   - The `async-context@1.0.0` package on npm is unrelated (a 2014 Node
//     callback helper), and the available userland polyfills either depend
//     on zone.js (~50 KB) or are Node-only / hobby quality.
//   - The patch surface is ~30 lines, idempotent, preserves Promise
//     semantics (delegates to the original `then`, so `Symbol.species` and
//     subclassing work unchanged), and decommissions cleanly the day a real
//     polyfill or native AsyncContext lands (drop the file, swap the
//     `_activeHost` export for the standard primitive).
//
// Known limitation — native await on a native Promise: V8's await
// optimization (since 7.x) skips the spec-prescribed
// `Promise.resolve(x).then(continuation)` step, so userland `then`
// patches don't intercept the resumption. Class methods that mutate
// state across an `await` boundary will fall back to the
// module-scoped global, not the active-host's isolated copy. To
// preserve the host across awaits, either keep the mutation in the
// synchronous prelude before the first `await`, or explicitly chain
// with `.then()` (which still routes through the patched method).
// A real fix requires either a build-time async-function transform
// or native AsyncContext.Variable in the runtime.
//
// resolveActiveHost() fallback chain:
//   1. Stack value set by `_activeHost.run(host, fn)` — covers render(),
//      Lit lifecycle methods, and class-method handlers (all wrapped by
//      SchmancyElement's prototype-chain wrap).
//   2. The closest `<schmancy-context>` whose subtree currently has an
//      in-flight DOM event. The element installs capture-phase listeners
//      that publish itself as the event-host while the synchronous
//      handler chain runs; the slot clears via microtask. Covers
//      template-bound inline arrow handlers attached to descendants.
//   3. document.activeElement — keyboard handlers in focus.
//   4. undefined → caller falls back to the module-scoped global instance.

// Singleton across any number of schmancy module copies (source + dist, ESM
// + CJS, hoisted vs. nested node_modules) via the runtime-global symbol
// registry. The first copy to load creates the slot; later copies reuse it.
// Without this, two stacks → mixins push to one, state reads from the other,
// and active-host context is lost across the boundary.
const STACK_KEY = Symbol.for('schmancy.state.activeHost.stack')
type StackSlot = { stack: Array<HTMLElement | undefined> }
const _g = globalThis as { [STACK_KEY]?: StackSlot }
_g[STACK_KEY] ??= { stack: [undefined] }
const _stack = _g[STACK_KEY].stack

// One-time Promise.prototype.then patch at module init. Each .then() call
// captures the stack head at chain time; firing the callback restores that
// captured value for the duration of the callback. The guard property
// prevents double-patching across HMR / duplicate module loads.
declare global {
	interface Promise<T> {
		// Marker symbol so we can detect (and skip) re-patching.
		readonly __schmancyActiveHostPatched?: true
	}
}

// Patching Promise.prototype is the entire mechanism this module exists to
// provide — the lint rules below intentionally do not apply.
/* oxlint-disable no-extend-native, unicorn/no-thenable */
if (typeof Promise !== 'undefined' && !('__schmancyActiveHostPatched' in Promise.prototype)) {
	Object.defineProperty(Promise.prototype, '__schmancyActiveHostPatched', {
		value: true,
		configurable: false,
		enumerable: false,
		writable: false,
	})
	const _origThen = Promise.prototype.then
	// Replace with our wrapper. We delegate to the original `then` via
	// `_origThen.call(this, …)` so Promise subclassing / Symbol.species behave
	// exactly as before — the only added work is the stack push/pop around
	// each user callback.
	Promise.prototype.then = function schmancyThen<T, R1, R2>(
		this: Promise<T>,
		onfulfilled?: ((value: T) => R1 | PromiseLike<R1>) | null,
		onrejected?: ((reason: unknown) => R2 | PromiseLike<R2>) | null,
	): Promise<R1 | R2> {
		const captured = _stack[_stack.length - 1]
		const wrapFulfilled = onfulfilled
			? (v: T): R1 | PromiseLike<R1> => {
					_stack.push(captured)
					try {
						return onfulfilled(v)
					} finally {
						_stack.pop()
					}
				}
			: onfulfilled
		const wrapRejected = onrejected
			? (r: unknown): R2 | PromiseLike<R2> => {
					_stack.push(captured)
					try {
						return onrejected(r)
					} finally {
						_stack.pop()
					}
				}
			: onrejected
		return _origThen.call(this, wrapFulfilled, wrapRejected) as Promise<R1 | R2>
	}
}
/* oxlint-enable no-extend-native, unicorn/no-thenable */

export const _activeHost = {
	/** Run `fn` with `host` as the active host for the duration of `fn` and
	 *  any awaits / microtasks / Promise chains that descend from it. */
	run<R>(host: HTMLElement | undefined, fn: () => R): R {
		_stack.push(host)
		try {
			return fn()
		} finally {
			_stack.pop()
		}
	},
	/** The current active host, or undefined if no `run()` is on the stack. */
	get(): HTMLElement | undefined {
		return _stack[_stack.length - 1]
	},
}

// Tier 2 of the resolveActiveHost() fallback chain. A `<schmancy-context>`
// publishes itself here from a capture-phase event listener attached to
// itself; the slot clears in the next microtask, after the synchronous
// event-handler chain has run. `window.event` is unreliable across both
// engines and time (it can outlive its event — a stale `message` event
// from postMessage can leak BODY for arbitrary later resolution calls), so
// we own this slot rather than read the legacy global.
//
// Singleton across module copies for the same reason as `_stack` above.
const EVENT_HOST_KEY = Symbol.for('schmancy.state.activeHost.eventHost')
type EventHostSlot = { host: HTMLElement | undefined; scheduled: boolean }
const _eventHostSlot: EventHostSlot =
	((globalThis as { [EVENT_HOST_KEY]?: EventHostSlot })[EVENT_HOST_KEY] ??= {
		host: undefined,
		scheduled: false,
	})

/** Publish `host` as the active event-host. The slot self-clears at the
 *  end of the current microtask checkpoint — long enough for the entire
 *  synchronous event-handler chain to read it, short enough that no
 *  later, unrelated microtask sees a stale value. */
export function _publishEventHost(host: HTMLElement): void {
	_eventHostSlot.host = host
	if (_eventHostSlot.scheduled) return
	_eventHostSlot.scheduled = true
	queueMicrotask(() => {
		_eventHostSlot.scheduled = false
		_eventHostSlot.host = undefined
	})
}

export function resolveActiveHost(): HTMLElement | undefined {
	// 1. Stack (set by _activeHost.run).
	const fromStack = _activeHost.get()
	if (fromStack !== undefined) return fromStack

	// 2. Closest <schmancy-context> with an in-flight event in its subtree.
	if (_eventHostSlot.host !== undefined) return _eventHostSlot.host

	// 3. document.activeElement — keyboard / focus handlers.
	if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
		return document.activeElement
	}

	// 4. undefined — caller falls back to module-scoped (or ambient tier 5).
	return undefined
}

// ---------------------------------------------------------------------------
// Tier 5 — Ambient provider registry.
//
// When exactly one <schmancy-context> provides a namespace and no active host
// is on the stack, state writes from async callbacks (Firestore onSnapshot,
// setTimeout, WebSocket handlers, etc.) automatically route to that isolated
// copy. No consumer-side _activeHost.run() boilerplate required.
//
// Ambiguity rule: if two or more contexts simultaneously provide the same
// namespace the entry is marked AMBIGUOUS and getAmbientProvider returns
// undefined — we fall through to the global rather than guess. Safe
// degradation: never silently write to the wrong isolated copy.
//
// Singleton across module copies via Symbol.for so source + dist share one map.
// ---------------------------------------------------------------------------
const AMBIENT_KEY = Symbol.for('schmancy.state.activeHost.ambientProviders')
type AmbientEntry = { instance: unknown; count: number }
const _ambientMap: Map<string, AmbientEntry> =
	((globalThis as { [AMBIENT_KEY]?: Map<string, AmbientEntry> })[AMBIENT_KEY] ??= new Map())

const AMBIGUOUS: unique symbol = Symbol('ambiguous')

export function registerAmbientProvider(namespace: string, instance: unknown): void {
	const e = _ambientMap.get(namespace)
	if (e) {
		e.count++
		e.instance = AMBIGUOUS
	} else {
		_ambientMap.set(namespace, { instance, count: 1 })
	}
}

export function deregisterAmbientProvider(namespace: string): void {
	const e = _ambientMap.get(namespace)
	if (!e) return
	if (e.count <= 1) {
		_ambientMap.delete(namespace)
	} else {
		e.count--
		// Once ambiguous, stays ambiguous until fully deregistered — we've lost
		// the individual instance references so can't safely restore one.
	}
}

export function getAmbientProvider(namespace: string): unknown | undefined {
	const e = _ambientMap.get(namespace)
	return e && e.instance !== AMBIGUOUS ? e.instance : undefined
}

/** Stable context key for a state namespace. `Symbol.for(...)` so the same
 *  namespace string yields the same symbol across module boundaries — the
 *  ContextProvider on `<schmancy-context>` and the ContextRequestEvent
 *  dispatched by a state read must agree on identity. */
export function stateContextKey(namespace: string): symbol {
	return Symbol.for(`schmancy.state:${namespace}`)
}
