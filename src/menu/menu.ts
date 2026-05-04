import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { takeUntil } from 'rxjs'
import { show } from '../overlay/overlay.service'

/**
 * Menu Component
 *
 * The overlay renders ONLY the raw menu items passed via the default slot.
 * NO <ul> wrapper, NO classes, NO additional markup. The overlay system
 * handles positioning (anchored at the trigger click) and dismissal.
 *
 * @example Basic menu with auto-dismiss
 * ```typescript
 * <schmancy-menu>
 *   <schmancy-button slot="trigger">Actions</schmancy-button>
 *   <schmancy-menu-item @click=${() => editItem()}>Edit</schmancy-menu-item>
 *   <schmancy-menu-item @click=${() => deleteItem()}>Delete</schmancy-menu-item>
 * </schmancy-menu>
 * ```
 * Note: `<schmancy-menu-item>` dispatches a bubbling 'close' event on click;
 * the overlay `show()` observable completes and the menu tears down.
 *
 * @example Custom component (manual dismiss)
 * ```typescript
 * <schmancy-menu>
 *   <schmancy-icon-button slot="trigger">settings</schmancy-icon-button>
 *   <my-settings-form
 *     @submit=${(e) => e.target.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))}
 *   ></my-settings-form>
 * </schmancy-menu>
 * ```
 *
 * @slot trigger - Button to open menu (new naming)
 * @slot button - Button to open menu (backward compatible)
 * @slot default - Menu items or any custom component to display in the overlay
 */
@customElement('schmancy-menu')
export default class SchmancyMenu extends SchmancyElement {
	static styles = [css`
	:host {
		position: relative;
		display: flex;
	}
`]

	@query('slot:not([name])')
	private menuSlot!: HTMLSlotElement

	private showMenu = (event: MouseEvent): void => {
		const menuItems = this.menuSlot?.assignedElements() || []
		if (menuItems.length === 0) return

		// Move slot items into a fresh container so the overlay can adopt them
		// without leaving stale references in our shadow tree.
		const overlayContainer = document.createElement('div')
		menuItems.forEach(item => overlayContainer.appendChild(item))

		// Anchor at the click so the overlay system positions the menu
		// adjacent to the trigger; subscription completion (any dismissal —
		// item click → bubbling 'close', backdrop, Esc, disconnect) restores
		// the items as light DOM so the next open re-projects them.
		show(overlayContainer, { anchor: event })
			.pipe(takeUntil(this.disconnecting))
			.subscribe({
				complete: () => menuItems.forEach(item => this.appendChild(item)),
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
