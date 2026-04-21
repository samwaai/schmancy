import { CSSResult, LitElement, unsafeCSS } from 'lit'

import style from './tailwind.css?inline'
import { BaseElement, IBaseMixin } from './baseElement'
import { Constructor } from './constructor'

export declare class ITailwindElementMixin {
	styles: (typeof CSSResult)[]
}

export const tailwindStyles = unsafeCSS(style)

/**
 * Consumer-registered stylesheets adopted by every TailwindElement shadow
 * root, in addition to schmancy's own pre-baked utilities.
 *
 * Use this to inject the consumer app's Vite/Tailwind-processed stylesheet
 * so utility classes used in *consumer* $LitElement templates (classes that
 * schmancy itself didn't happen to use, and therefore aren't in the shipped
 * bundle) resolve inside the shadow DOM.
 */
const consumerSheets: CSSStyleSheet[] = []

/**
 * Register one or more stylesheets whose rules will be adopted by every
 * `$LitElement` (TailwindElement) instance created afterwards. Pass the
 * consumer app's compiled Tailwind stylesheet here, typically at app init:
 *
 * ```ts
 * import tw from './styles.css?inline'
 * import { registerTailwind } from '@mhmo91/schmancy/mixins'
 * registerTailwind(tw)
 * ```
 *
 * Accepts raw CSS strings, `CSSResult` values, or pre-built `CSSStyleSheet`
 * instances. Safe to call multiple times — sheets accumulate.
 */
export function registerTailwind(...sheets: Array<CSSStyleSheet | CSSResult | string>): void {
	for (const s of sheets) {
		if (s instanceof CSSStyleSheet) {
			if (!consumerSheets.includes(s)) consumerSheets.push(s)
			continue
		}
		const text = typeof s === 'string' ? s : (s as CSSResult).cssText
		const sheet = new CSSStyleSheet()
		sheet.replaceSync(text)
		consumerSheets.push(sheet)
	}
}

const TailwindElementBase = <T extends CSSResult>(componentStyle?: T) => {
	class TailwindMixinClass extends LitElement {
		static styles = [unsafeCSS(componentStyle), tailwindStyles]

		override createRenderRoot(): HTMLElement | DocumentFragment {
			const root = super.createRenderRoot()
			// Adopt consumer-registered sheets alongside Lit's own adopted
			// sheets from `static styles`. Only supported on ShadowRoot.
			if (consumerSheets.length > 0 && root instanceof ShadowRoot) {
				const current = root.adoptedStyleSheets
				const missing = consumerSheets.filter(s => !current.includes(s))
				if (missing.length > 0) {
					root.adoptedStyleSheets = [...current, ...missing]
				}
			}
			return root
		}
	}
	return TailwindMixinClass as Constructor<LitElement> /* see "typing the subclass" below */
}

export const TailwindElement = <T extends CSSResult>(componentStyle?: T) => {
	class TailwindMixinClass extends BaseElement(TailwindElementBase(componentStyle)) {
		disconnectedCallback = () => {
			super.disconnectedCallback()
		}
	}
	return TailwindMixinClass as Constructor<CustomElementConstructor> &
		Constructor<ITailwindElementMixin> &
		Constructor<LitElement> &
		Constructor<IBaseMixin>
}
