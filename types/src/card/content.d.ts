declare const SchmancyCardContent_base: import('../../mixins').Constructor<CustomElementConstructor> &
	import('../../mixins').Constructor<import('@mixins/index').ITailwindElementMixin> &
	import('../../mixins').Constructor<import('lit').LitElement> &
	import('../../mixins').Constructor<import('../../mixins').IBaseMixin>
/**
 * @element schmancy-card-content
 * @slot headline
 * @slot subhead
 * @slot default - The content of the card
 */
export default class SchmancyCardContent extends SchmancyCardContent_base {
	protected render(): unknown
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-content': SchmancyCardContent
	}
}
export {}
