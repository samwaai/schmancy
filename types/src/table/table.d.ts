declare const SchmancyTable_base: import('../../mixins').Constructor<CustomElementConstructor> &
	import('../../mixins').Constructor<import('@mixins/index').ITailwindElementMixin> &
	import('../../mixins').Constructor<import('lit').LitElement> &
	import('../../mixins').Constructor<import('../../mixins').IBaseMixin>
export default class SchmancyTable extends SchmancyTable_base {
	protected render(): unknown
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-table': SchmancyTable
	}
}
export {}
