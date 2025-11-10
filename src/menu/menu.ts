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
		display: flex;
	}
`) {
	@query('slot:not([name])')
	private menuSlot!: HTMLSlotElement

	private showMenu(event: MouseEvent) {
		const menuItems = this.menuSlot?.assignedElements() || []

		// Clone items to preserve slot content for subsequent opens
		const clones = menuItems.map(item => item.cloneNode(true) as HTMLElement)

		// Create container for event delegation
		const container = document.createElement('div')
		clones.forEach(clone => container.appendChild(clone))

		// Event delegation: when clone is clicked, trigger click on original
		// This preserves all Lit @click handlers attached to the original elements
		container.addEventListener('click', (e) => {
			const clickedClone = (e.target as Element).closest('schmancy-menu-item')
			if (clickedClone) {
				const index = clones.findIndex(c => c.contains(clickedClone))
				if (index >= 0) {
					// Trigger click on the original element to fire its @click handler
					;(menuItems[index] as HTMLElement).click()
				}
			}
		})

		// IMPORTANT: Pass ONLY the container with cloned items
		// The dialog handles all positioning, styling, and behavior
		$dialog.component(html`${container}`, {
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
