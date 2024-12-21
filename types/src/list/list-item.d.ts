import { TSurfaceColor } from '@schmancy/types/surface'
declare const SchmancyListItem_base: import('../../mixins').Constructor<CustomElementConstructor> &
	import('../../mixins').Constructor<import('@mixins/index').ITailwindElementMixin> &
	import('../../mixins').Constructor<import('lit').LitElement> &
	import('../../mixins').Constructor<import('../../mixins').IBaseMixin>
/**
 * @element schmancy-list-item
 * @slot leading - leading content
 * @slot trailing - trailing content
 * @slot - default content
 */
export declare class SchmancyListItem extends SchmancyListItem_base {
	variant: TSurfaceColor
	rounded: boolean
	readonly: boolean
	selected: boolean
	private leading
	private trailing
	protected get imgClasses(): string[]
	firstUpdated(): void
	render(): import('lit-html').TemplateResult<1>
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-list-item': SchmancyListItem
	}
}
export {}
