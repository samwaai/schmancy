declare const SchmancyTab_base: import('../../mixins').Constructor<CustomElementConstructor> &
	import('../../mixins').Constructor<import('@mixins/index').ITailwindElementMixin> &
	import('../../mixins').Constructor<import('lit').LitElement> &
	import('../../mixins').Constructor<import('../../mixins').IBaseMixin>
export default class SchmancyTab extends SchmancyTab_base {
	label: any
	value: any
	active: boolean
	mode: any
	protected render(): unknown
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab': SchmancyTab
	}
}
export {}
