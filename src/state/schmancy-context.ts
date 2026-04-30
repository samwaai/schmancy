// `<schmancy-context provides={[cart, …]}>` — declarative state isolation.
//
// Mounts one isolated copy of each provided state under the element. Reads
// and writes from descendants resolve to the isolated copy via the
// `@lit/context` request protocol; descendants outside any `<schmancy-context>`
// continue to read/write the module-scoped global. The isolated copy is
// initialised with a snapshot of `tmpl.value` at mount time so the subtree
// starts from "current global state, then diverges."
//
// Lifetime: each isolated copy lives exactly as long as this element is
// connected. `disconnectedCallback` destroys all isolated copies; their
// pending writes flush, their adapters close.

import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import { ContextProvider, createContext, type Context } from '@lit/context'
import { stateContextKey } from './active-host'

/** Duck-typed view of what the `state()` factory hands out, restricted to the
 *  bits `<schmancy-context>` needs. Kept internal — consumers see the full
 *  `State<>` type and never refer to this. */
export interface StateTemplate {
	readonly namespace: string
	readonly value: unknown
	/** Internal hook the factory adds to every state instance. Builds a fresh
	 *  per-context copy seeded with the current value, sharing nothing with the
	 *  global instance. The returned object exposes `destroy()` so the context
	 *  element can flush + close on disconnect. */
	_isolatedInstance(): { destroy(): void } & Record<string | symbol, unknown>
}

export class SchmancyContext extends LitElement {
	/** States to isolate under this subtree. Pass the same instances you import
	 *  at module scope (e.g. `provides={[cart, menu]}`). Outside this element
	 *  they continue to behave as module-scoped globals; descendants of this
	 *  element see a per-element isolated copy. */
	@property({ attribute: false }) provides: readonly StateTemplate[] = []

	// Per-mount records. Keep both the provider (so we can release it on
	// disconnect) and the isolated instance (so we can destroy it).
	private _scoped: Array<{
		isolated: { destroy(): void }
		provider: ContextProvider<Context<unknown, unknown>>
	}> = []

	override connectedCallback(): void {
		super.connectedCallback()
		for (const tmpl of this.provides) {
			const isolated = tmpl._isolatedInstance()
			const ctx = createContext<unknown>(stateContextKey(tmpl.namespace))
			// ContextProvider auto-wires via the host's ReactiveControllerHost
			// interface (LitElement satisfies it). It listens for
			// `context-request` events and responds with `isolated` for any
			// requester whose `event.context === ctx`.
			const provider = new ContextProvider(this, { context: ctx, initialValue: isolated })
			this._scoped.push({ isolated, provider })
		}
	}

	override disconnectedCallback(): void {
		for (const entry of this._scoped) {
			entry.isolated.destroy()
		}
		this._scoped = []
		super.disconnectedCallback()
	}

	override render() {
		return html`<slot></slot>`
	}
}

// Imperative define so a second load (source + dist) is a no-op rather than
// a throw — the registry is process-global; whichever class wins serves the
// element identity for the page.
if (!customElements.get('schmancy-context')) {
	customElements.define('schmancy-context', SchmancyContext)
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-context': SchmancyContext
	}
}
