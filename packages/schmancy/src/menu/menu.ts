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
 * @example Basic menu with auto-dismiss
 * ```typescript
 * <schmancy-menu>
 *   <schmancy-button slot="trigger">Actions</schmancy-button>
 *   <schmancy-menu-item @click=${() => editItem()}>Edit</schmancy-menu-item>
 *   <schmancy-menu-item @click=${() => deleteItem()}>Delete</schmancy-menu-item>
 * </schmancy-menu>
 * ```
 * Note: Dialog auto-dismisses when schmancy-menu-item is clicked
 *
 * @example Custom component (manual dismiss)
 * ```typescript
 * <schmancy-menu>
 *   <schmancy-icon-button slot="trigger">settings</schmancy-icon-button>
 *   <my-settings-form @submit=${() => $dialog.dismiss()}></my-settings-form>
 * </schmancy-menu>
 * ```
 * Note: Custom components must call $dialog.dismiss() manually
 *
 * @slot trigger - Button to open menu (new naming)
 * @slot button - Button to open menu (backward compatible)
 * @slot default - Menu items or any custom component to display in dialog
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
