import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { $dialog } from '../dialog/dialog-service'

/**
 * Floating menu — a trigger button + a list of schmancy-menu-item children that open as a positioned dialog on click.
 *
 * @element schmancy-menu
 * @summary Use for dropdown menus attached to a button or icon — "More actions", "Account", row overflow menus in tables. Clicking a schmancy-menu-item inside auto-dismisses; custom components slotted inside must call `$dialog.dismiss()` themselves.
 * @example
 * <schmancy-menu>
 *   <schmancy-icon-button slot="trigger" aria-label="Actions">
 *     <schmancy-icon>more_vert</schmancy-icon>
 *   </schmancy-icon-button>
 *   <schmancy-menu-item @click=${() => edit()}>Edit</schmancy-menu-item>
 *   <schmancy-menu-item @click=${() => remove()}>Delete</schmancy-menu-item>
 * </schmancy-menu>
 * @platform menu close - Trigger + floating listbox dialog. Degrades to a native `<select>` or inline list if the tag never registers.
 * @slot trigger - Button to open menu (new naming)
 * @slot button - Button to open menu (backward compatible)
 * @slot default - Menu items or any custom component to display in dialog
 */
@customElement('schmancy-menu')
export default class SchmancyMenu extends $LitElement(css`
	:host {
		position: relative;
		display: flex;
	}
`) {
	@query('slot:not([name])')
	private menuSlot!: HTMLSlotElement

	private showMenu(event: MouseEvent) {
		const menuItems = this.menuSlot?.assignedElements() || []
		if (menuItems.length === 0) return

		// Create container and move actual elements to preserve full functionality
		const dialogContainer = document.createElement('div')
		menuItems.forEach(item => dialogContainer.appendChild(item))

		$dialog
			.component(dialogContainer, {
				position: event,
				hideActions: true,
		})
			.finally(() => {
				// Restore elements as light DOM children (will be projected via slot)
				menuItems.forEach(item => this.appendChild(item))
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
