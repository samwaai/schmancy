import { consume } from '@lit/context'
import {
	SchmancyDrawerNavbarMode,
	SchmancyDrawerNavbarState,
	TSchmancyDrawerNavbarMode,
} from '@schmancy/drawer/context'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import mc from './mc.svg?inline'
import mo from './mo.svg?inline'
import { SchmancyEvents } from '..'

/**
 * @element schmancy-nav-drawer-appbar
 * @slot toggler - The toggler slot
 * @slot - The default slot
 */
@customElement('schmancy-nav-drawer-appbar')
export class SchmancyDrawerAppbar extends TailwindElement() {
	@consume({ context: SchmancyDrawerNavbarMode, subscribe: true })
	@state()
	sidebarMode: TSchmancyDrawerNavbarMode

	@consume({ context: SchmancyDrawerNavbarState, subscribe: true })
	@state()
	sidebarOpen

	render() {
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
				${when(
					this.sidebarMode === 'overlay',
					() =>
						html`<slot name="toggler">
							<div class="${this.classMap(sidebarToggler)}">
								<schmancy-button
									@click=${() => {
										this.dispatchEvent(
											new CustomEvent(SchmancyEvents.DRAWER_TOGGLE, {
												detail: { state: this.sidebarOpen === 'open' ? 'close' : 'open' },
												bubbles: true,
												composed: true,
											}),
										)
									}}
								>
									<object data=${this.sidebarOpen === 'close' ? mo : mc} width="24px" height="24px"></object>
								</schmancy-button>
							</div>
						</slot>`,
				)}

				<slot> </slot>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-nav-drawer-appbar': SchmancyDrawerAppbar
	}
}
