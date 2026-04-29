import { CSSResult, LitElement } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { TailwindElement } from './tailwind.mixin'
import { BaseElement, IBaseMixin } from './baseElement'
import { Constructor } from './constructor'

/**
 * Schmancy's base class mixin. Composes:
 *
 *   1. `TailwindElement(style)` — Tailwind/SCSS injection
 *   2. `BaseElement(...)`        — `disconnecting` Subject, classMap/styleMap, discovery
 *   3. `SignalWatcher(...)`      — auto-tracks every signal read in `render()`
 *
 * The SignalWatcher layer makes `state.value` reads inside templates
 * subscribe automatically — no `@observe`, no `bindState`, no field
 * required for the common case:
 *
 *   class CartView extends $LitElement() {
 *     render() { return html`Items: ${cart.value.items.length}` }
 *   }
 *
 * Use `@observe(source) field!: T` only when you need the value as a
 * field on the instance (event handlers, derived methods, DevTools).
 */
export const $LitElement = <T extends CSSResult>(componentStyle?: T) => {
	class TailwindMixinClass extends SignalWatcher(BaseElement(TailwindElement(componentStyle))) {
		disconnectedCallback = () => {
			super.disconnectedCallback()
		}
	}
	return TailwindMixinClass as CustomElementConstructor &
		Constructor<LitElement> &
		Constructor<IBaseMixin> /* see "typing the subclass" below */
}
