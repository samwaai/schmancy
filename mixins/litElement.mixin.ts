import { CSSResult, LitElement } from 'lit'
import { TailwindElement } from './tailwind.mixin'
import { BaseElement, IBaseMixin } from './baseElement'
import { Constructor } from './constructor'

export const $LitElement = <T extends CSSResult>(componentStyle?: T) => {
	class TailwindMixinClass extends BaseElement(TailwindElement(componentStyle)) {
		disconnectedCallback = () => {
			super.disconnectedCallback()
		}
	}
	return TailwindMixinClass as CustomElementConstructor &
		Constructor<LitElement> &
		Constructor<IBaseMixin> /* see "typing the subclass" below */
}
