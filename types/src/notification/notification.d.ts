declare const SchmancyNotification_base: import('../../mixins').Constructor<CustomElementConstructor> &
	import('../../mixins').Constructor<import('@mixins/index').ITailwindElementMixin> &
	import('../../mixins').Constructor<import('lit').LitElement> &
	import('../../mixins').Constructor<import('../../mixins').IBaseMixin>
export declare class SchmancyNotification extends SchmancyNotification_base {
	type: 'success' | 'error' | 'warning' | 'info'
	render(): import('lit-html').TemplateResult<1>
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-notification': SchmancyNotification
	}
}
export {}
