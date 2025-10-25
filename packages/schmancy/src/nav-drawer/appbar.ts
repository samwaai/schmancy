import { consume } from '@lit/context'
import { TailwindElement } from '@mixins/index'
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
		const gridClasses = {
			...appbarClasses,
			'grid gap-2 items-center': true,
			'grid-cols-[auto_1fr]': this.sidebarMode === 'overlay' && this.toggler,
			'grid-cols-1': !(this.sidebarMode === 'overlay' && this.toggler),
		}

		return html`
			<div class=${this.classMap(gridClasses)}>
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
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-nav-drawer-appbar': SchmancyDrawerAppbar
	}
}
