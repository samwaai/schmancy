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

import { type Context, ContextProvider, createContext } from '@lit/context';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  _publishEventHost,
  deregisterAmbientProvider,
  registerAmbientProvider,
  stateContextKey,
} from './active-host';

// Curated set of DOM event types that descendants are likely to bind state-
// mutating handlers to. The capture-phase listener publishes `this` as the
// active event-host before the event reaches the target; descendants whose
// inline handlers (or any code reached during the synchronous chain) call a
// state mutator can resolve back to the isolated copy this context provides.
const EVENT_TYPES = [
  'click',
  'dblclick',
  'submit',
  'change',
  'input',
  'keydown',
  'keyup',
  'keypress',
  'pointerdown',
  'pointerup',
  'mousedown',
  'mouseup',
  'focus',
  'blur',
  'paste',
  'drop',
] as const;

/** Duck-typed view of what the `state()` factory hands out, restricted to the
 *  bits `<schmancy-context>` needs. Kept internal — consumers see the full
 *  `State<>` type and never refer to this. */
export interface StateTemplate {
  readonly namespace: string;
  readonly value: unknown;
  /** Internal hook the factory adds to every state instance. Builds a fresh
   *  per-context copy seeded with the current value, sharing nothing with the
   *  global instance. The returned object exposes `destroy()` so the context
   *  element can flush + close on disconnect. */
  _isolatedInstance(): { destroy(): void } & Record<string | symbol, unknown>;
}

export class SchmancyContext extends LitElement {
  /** States to isolate under this subtree. Pass the same instances you import
   *  at module scope (e.g. `provides={[cart, menu]}`). Outside this element
   *  they continue to behave as module-scoped globals; descendants of this
   *  element see a per-element isolated copy. */
  @property({ attribute: false }) provides: readonly StateTemplate[] = [];

  // Per-mount records. Keep both the provider (so we can release it on
  // disconnect) and the isolated instance (so we can destroy it).
  private _scoped: Array<{
    namespace: string;
    isolated: { destroy(): void };
    provider: ContextProvider<Context<unknown, unknown>>;
  }> = [];

  private _publishEventTargetAsHost = (e: Event): void => {
    // Publish the deepest event target (across shadow boundaries) rather
    // than `this`. The downstream `ContextRequestEvent` will be dispatched
    // from this host and must bubble up through `<schmancy-context>` to
    // reach our `ContextProvider`. `@lit/context` skips self-registration
    // (`consumerHost === this.host` ⇒ no-op), so dispatching from
    // schmancy-context itself would silently fall back to the global.
    const path = e.composedPath();
    for (const node of path) {
      if (node instanceof HTMLElement) {
        _publishEventHost(node);
        return;
      }
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    for (const tmpl of this.provides) {
      const isolated = tmpl._isolatedInstance();
      const ctx = createContext<unknown>(stateContextKey(tmpl.namespace));
      // ContextProvider auto-wires via the host's ReactiveControllerHost
      // interface (LitElement satisfies it). It listens for
      // `context-request` events and responds with `isolated` for any
      // requester whose `event.context === ctx`.
      const provider = new ContextProvider(this, { context: ctx, initialValue: isolated });
      registerAmbientProvider(tmpl.namespace, isolated);
      this._scoped.push({ namespace: tmpl.namespace, isolated, provider });
    }
    for (const type of EVENT_TYPES) {
      this.addEventListener(type, this._publishEventTargetAsHost, { capture: true });
    }
  }

  override disconnectedCallback(): void {
    for (const type of EVENT_TYPES) {
      this.removeEventListener(type, this._publishEventTargetAsHost, { capture: true });
    }
    for (const entry of this._scoped) {
      deregisterAmbientProvider(entry.namespace);
      entry.isolated.destroy();
    }
    this._scoped = [];
    super.disconnectedCallback();
  }

  override render() {
    return html`<slot></slot>`;
  }
}

// Imperative define so a second load (source + dist) is a no-op rather than
// a throw — the registry is process-global; whichever class wins serves the
// element identity for the page.
if (!customElements.get('schmancy-context')) {
  customElements.define('schmancy-context', SchmancyContext);
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-context': SchmancyContext;
  }
}
