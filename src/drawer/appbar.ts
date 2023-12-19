import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import mc from './mc.svg?inline'
import mo from './mo.svg?inline'
import { consume } from '@lit/context'
import {
	TSchmancyDrawerSidebarMode,
	SchmancyDrawerSidebarState,
	SchmancyDrawerSidebarMode,
} from '@schmancy/drawer/context'

/**
 * @element schmancy-drawer-appbar
 * @slot toggler - The toggler slot
 * @slot - The default slot
 */
@customElement('schmancy-drawer-appbar')
export class SchmancyDrawerAppbar extends TailwindElement() {
	@consume({ context: SchmancyDrawerSidebarMode, subscribe: true })
	@state()
	sidebarMode: TSchmancyDrawerSidebarMode

	@consume({ context: SchmancyDrawerSidebarState, subscribe: true })
	@state()
	sidebarOpen

	render() {
		console.log(this.sidebarOpen)
		const appbarClasses = {
			'block z-50': true,
		}
		const sidebarToggler = {
			'block left-[16px] top-[16px] z-50': this.sidebarMode === 'overlay',
			hidden: this.sidebarMode === 'push',
		}
		return html`
			<schmancy-grid
				cols=${this.sidebarMode === 'push' ? '1fr' : 'auto 1fr'}
				flow="col"
				class=${this.classMap(appbarClasses)}
			>
				<slot name="toggler">
					<div class="${this.classMap(sidebarToggler)}">
						<schmancy-button
							@click=${() => {
								this.dispatchEvent(
									new CustomEvent('SchmancytoggleSidebar', {
										detail: { open: this.sidebarOpen === 'open' ? 'close' : 'open' },
										bubbles: true,
										composed: true,
									}),
								)
							}}
						>
							${cache(
								this.sidebarOpen === 'close'
									? html` <object data=${mo}></object> `
									: html` <object data=${mc}></object> `,
							)}
						</schmancy-button>
					</div>
				</slot>
				<slot> </slot>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-drawer-appbar': SchmancyDrawerAppbar
	}
}
