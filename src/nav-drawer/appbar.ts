import { consume } from '@lit/context'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import {
	SchmancyDrawerNavbarMode,
	SchmancyDrawerNavbarState,
	TSchmancyDrawerNavbarMode,
} from '@schmancy/nav-drawer/context'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { SchmancyEvents } from '..'

/**
 * @element schmancy-nav-drawer-appbar
 * @slot toggler - The toggler slot
 * @slot - The default slot
 */
@customElement('schmancy-nav-drawer-appbar')
export class SchmancyDrawerAppbar extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
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
			'block left-3  z-50': this.sidebarMode === 'overlay',
			hidden: this.sidebarMode === 'push',
		}
		return html`
			<schmancy-grid
				cols=${this.sidebarMode === 'push' ? '1fr' : 'auto 1fr'}
				flow="col"
				class=${this.classMap(appbarClasses)}
				gap="sm"
				align="center"
			>
				${when(
					this.sidebarMode === 'overlay',
					() =>
						html`<slot name="toggler">
							<div class="${this.classMap(sidebarToggler)}">
								<schmancy-icon-button
									@click=${() => {
										this.dispatchEvent(
											new CustomEvent(SchmancyEvents.NavDrawer_toggle, {
												detail: { state: this.sidebarOpen === 'open' ? 'close' : 'open' },
												bubbles: true,
												composed: true,
											}),
										)
									}}
								>
									${when(
										this.sidebarOpen === 'close',
										() => html`menu`,
										() => html`menu_open`,
									)}
								</schmancy-icon-button>
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
