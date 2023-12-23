import { TSchmancyDrawerSidebarMode } from '@schmancy/drawer/context'
declare const SchmancyDrawerAppbar_base: import('..').Constructor<CustomElementConstructor> &
	import('..').Constructor<import('@schmancy/mixin/tailwind/tailwind.mixin').ITailwindElementMixin> &
	import('..').Constructor<import('lit').LitElement> &
	import('..').Constructor<import('..').IBaseMixin>
/**
 * @element schmancy-nav-drawer-appbar
 * @slot toggler - The toggler slot
 * @slot - The default slot
 */
export declare class SchmancyDrawerAppbar extends SchmancyDrawerAppbar_base {
	sidebarMode: TSchmancyDrawerSidebarMode
	sidebarOpen: any
	render(): import('lit-html').TemplateResult<1>
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-nav-drawer-appbar': SchmancyDrawerAppbar
	}
}
export {}
