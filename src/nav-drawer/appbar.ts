import { consume } from '@lit/context'
import { TailwindElement } from '@mixins/tailwind'
import {
	SchmancyDrawerNavbarMode,
	SchmancyDrawerNavbarState,
	TSchmancyDrawerNavbarMode,
} from '@schmancy/nav-drawer/context'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
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

	@property({ type: Boolean }) toggler = true

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
				cols=${this.sidebarMode === 'overlay' && this.toggler ? 'auto 1fr' : '1fr'}
				flow="col"
				class=${this.classMap(appbarClasses)}
				gap="sm"
				align="center"
			>
				${when(
					this.sidebarMode === 'overlay' && this.toggler,
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
