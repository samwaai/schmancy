import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { $dialog } from '../dialog/dialog-service'

/**
 * Menu Component
 *
 * CRITICAL: The dialog ONLY renders the raw menu items passed via the default slot.
 * NO <ul> wrapper, NO classes, NO additional markup in the dialog call.
 * The dialog service handles positioning and display - we just pass the pure content.
 *
 * Usage:
 * <schmancy-menu>
 *   <schmancy-button slot="trigger">Open Menu</schmancy-button>
 *   <schmancy-menu-item>Item 1</schmancy-menu-item>
 *   <schmancy-menu-item>Item 2</schmancy-menu-item>
 * </schmancy-menu>
 */
@customElement('schmancy-menu')
export default class SchmancyMenu extends $LitElement(css`
	:host {
		position: relative;
		display: inline-block;
	}
`) {
	@query('slot:not([name])')
	private menuSlot!: HTMLSlotElement

	private showMenu(event: MouseEvent) {
		const menuItems = this.menuSlot?.assignedElements() || []

		// IMPORTANT: Pass ONLY the menu items, nothing else
		// The dialog handles all positioning, styling, and behavior
		$dialog.component(html`${menuItems}`, {
			position: event,
			hideActions: true,
			width: 'auto',
		})
	}

	render() {
		return html`
			<slot name="trigger" @click=${this.showMenu}>
				<slot name="button" @click=${this.showMenu}>
					<schmancy-icon-button>more_vert</schmancy-icon-button>
				</slot>
			</slot>
			<div hidden>
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-menu': SchmancyMenu
	}
}
