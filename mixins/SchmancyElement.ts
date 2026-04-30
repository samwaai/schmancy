import { LitElement, type CSSResultGroup, type CSSResultOrNative } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { BaseElement, type IBaseMixin } from './baseElement'
import { tailwindStyles } from './tailwind.mixin'
import type { Constructor } from './constructor'
import { _activeHost } from '../src/state/active-host'

// Cast to instance-only Constructor + a narrow static surface for `finalizeStyles`.
// Avoids exposing LitElement's full static side (which has `protected static
// shadowRootOptions`); that would conflict with subclasses that declare their own
// `protected static shadowRootOptions = { ..., delegatesFocus: true }` to widen
// visibility — same shape TailwindElement uses.
type StaticFinalizeStyles = {
	finalizeStyles(styles?: CSSResultGroup): CSSResultOrNative[]
}
const SchmancyElementBase = SignalWatcher(BaseElement(LitElement)) as unknown as
	CustomElementConstructor & Constructor<LitElement> & Constructor<IBaseMixin> & StaticFinalizeStyles

// ---------------------------------------------------------------------------
// Active-host integration. Two layers:
//
//   (1) Prototype-chain wrap. The first instance of every concrete subclass
//       triggers a walk that wraps every function-typed descriptor on the
//       chain (up to but not including HTMLElement.prototype) with
//       `_activeHost.run(this, …)`. Catches `render()`, every Lit lifecycle
//       hook, and every user-defined class method (sync or async — the host
//       propagates across `await` via the Promise.then patch in
//       `active-host.ts`). Idempotent: each prototype object is wrapped at
//       most once, regardless of how many subclasses share it.
//
//   (2) `addEventListener` override. Listeners attached imperatively to
//       the host run inside `_activeHost.run(this, …)`. We keep an
//       `original→wrapped` map so `removeEventListener` finds the wrapped
//       listener.
//
// Inline arrow handlers attached via Lit templates (`@click=${() => …}`)
// are not wrapped at this layer — Lit attaches them to *child* elements,
// not the host. They resolve correctly via the
// `window.event.composedPath()` fallback in `resolveActiveHost()`: a
// `context-request` dispatched from the click target bubbles (composed)
// up to the enclosing `<schmancy-context>` provider.
// ---------------------------------------------------------------------------

// Lit's internal protocol methods (e.g. `_$attributeToProperty`) are
// framework plumbing; wrapping them risks breaking Lit's update scheduling
// for no semantic gain — the host is already on the stack from the wrap of
// the public lifecycle methods that call them.
function shouldSkipMethod(key: string): boolean {
	if (key === 'constructor') return true
	if (key.startsWith('_$')) return true
	return false
}

const wrappedProtos = new WeakSet<object>()

function wrapPrototypeChain(ctor: { prototype: object }): void {
	let proto: object | null = ctor.prototype
	while (proto && proto !== HTMLElement.prototype) {
		if (wrappedProtos.has(proto)) break
		wrappedProtos.add(proto)
		const descs = Object.getOwnPropertyDescriptors(proto)
		for (const [key, desc] of Object.entries(descs)) {
			if (shouldSkipMethod(key)) continue
			if (typeof desc.value !== 'function') continue
			if (!desc.configurable) continue
			const original = desc.value as (...args: unknown[]) => unknown
			Object.defineProperty(proto, key, {
				...desc,
				value: function wrappedForActiveHost(this: HTMLElement, ...args: unknown[]) {
					return _activeHost.run(this, () => original.apply(this, args))
				},
			})
		}
		proto = Object.getPrototypeOf(proto) as object | null
	}
}

type AnyListener = EventListener | EventListenerObject
const listenerWrapCache = new WeakMap<AnyListener, EventListener>()

function wrapHostListener(host: HTMLElement, listener: AnyListener): EventListener {
	const cached = listenerWrapCache.get(listener)
	if (cached) return cached
	const wrapped: EventListener = function wrappedHostListener(this: unknown, evt: Event) {
		_activeHost.run(host, () => {
			if (typeof listener === 'function') {
				;(listener as EventListener).call(this, evt)
			} else {
				listener.handleEvent(evt)
			}
		})
	}
	listenerWrapCache.set(listener, wrapped)
	return wrapped
}

/**
 * Base class for Schmancy components. A concrete named class — not a mixin
 * factory — so DevTools shows `SchmancyElement` in the prototype chain and
 * `extends SchmancyElement` reads like `extends LitElement` for new
 * contributors.
 *
 * Composes:
 *   1. `LitElement`            — Lit base
 *   2. `BaseElement`           — `disconnecting` Subject, classMap/styleMap,
 *                                 discovery, `stableId`, `uid`, `locale`
 *   3. `SignalWatcher`         — auto-tracks every signal read in `render()`
 *
 * Tailwind styles are injected automatically via `finalizeStyles` — subclasses
 * just declare their own component-local styles in `static styles`:
 *
 *   @customElement('my-card')
 *   class MyCard extends SchmancyElement {
 *     static styles = [css`:host { display: block }`]
 *     render() { return html`<slot></slot>` }
 *   }
 *
 * Cleanup primitives (both fire on disconnect):
 *   - `disconnecting: Subject<void>` — RxJS, used with `takeUntil`
 *   - `disconnectedSignal: AbortSignal` — native, used with `fetch`,
 *     `addEventListener`, or any AbortSignal-aware API
 *
 * Never wrap with `SignalWatcher` again — it is already part of the base.
 * `SignalWatcher(SchmancyElement)` creates two nested Computeds and panics
 * with "Detected cycle in computations" at runtime; the pre-edit lint
 * (`NO_SIGNAL_WATCHER_WRAP`) blocks it as belt-and-suspenders.
 */
export class SchmancyElement extends SchmancyElementBase {
	private _abortController = new AbortController()

	/** AbortSignal that fires when the element disconnects. */
	readonly disconnectedSignal: AbortSignal = this._abortController.signal

	constructor() {
		super()
		wrapPrototypeChain(this.constructor as { prototype: object })
	}

	static override finalizeStyles(
		styles?: CSSResultGroup,
	): CSSResultOrNative[] {
		return [...super.finalizeStyles(styles), tailwindStyles]
	}

	override addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject | null,
		options?: boolean | AddEventListenerOptions,
	): void {
		if (listener == null) {
			super.addEventListener(type, listener, options)
			return
		}
		super.addEventListener(type, wrapHostListener(this, listener), options)
	}

	override removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject | null,
		options?: boolean | EventListenerOptions,
	): void {
		if (listener == null) {
			super.removeEventListener(type, listener, options)
			return
		}
		const wrapped = listenerWrapCache.get(listener)
		super.removeEventListener(type, wrapped ?? (listener as EventListener), options)
	}

	override disconnectedCallback() {
		this._abortController.abort()
		super.disconnectedCallback()
	}
}
