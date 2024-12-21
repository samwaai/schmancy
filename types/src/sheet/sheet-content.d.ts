declare const SchmancySheetContent_base: import('../../mixins').Constructor<CustomElementConstructor> &
	import('../../mixins').Constructor<import('@mixins/index').ITailwindElementMixin> &
	import('../../mixins').Constructor<import('lit').LitElement> &
	import('../../mixins').Constructor<import('../../mixins').IBaseMixin>
export default class SchmancySheetContent extends SchmancySheetContent_base {
	render(): import('lit-html').TemplateResult<1>
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet-content': SchmancySheetContent
	}
}
export {}
