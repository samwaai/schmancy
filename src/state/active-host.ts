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
// resolveActiveHost() fallback chain:
//   1. Stack value set by `_activeHost.run(host, fn)` — covers render(),
//      Lit lifecycle methods, class-method handlers (all wrapped by
//      $LitElement), and async-after-await via the Promise patch.
//   2. window.event.composedPath() — sync event-handler fallback for
//      template-bound inline arrow handlers when the EventPart patch is
//      unavailable (feature-gated upgrade).
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

export function resolveActiveHost(): HTMLElement | undefined {
	// 1. Stack (set by _activeHost.run, propagated across await via the
	//    Promise patch above).
	const fromStack = _activeHost.get()
	if (fromStack !== undefined) return fromStack

	// 2. window.event — sync event-handler fallback. Covers inline arrow
	//    template bindings whose handlers run before any _activeHost.run
	//    frame has been pushed.
	if (typeof window !== 'undefined') {
		const evt = (window as Window & { event?: Event }).event
		if (evt) {
			const path = evt.composedPath()
			for (const node of path) {
				if (node instanceof HTMLElement) return node
			}
		}
	}

	// 3. document.activeElement — keyboard / focus handlers.
	if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
		return document.activeElement
	}

	// 4. undefined — caller falls back to module-scoped.
	return undefined
}

/** Stable context key for a state namespace. `Symbol.for(...)` so the same
 *  namespace string yields the same symbol across module boundaries — the
 *  ContextProvider on `<schmancy-context>` and the ContextRequestEvent
 *  dispatched by a state read must agree on identity. */
export function stateContextKey(namespace: string): symbol {
	return Symbol.for(`schmancy.state:${namespace}`)
}
