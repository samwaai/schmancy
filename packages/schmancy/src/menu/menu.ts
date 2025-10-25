import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { fromEvent, takeUntil, tap } from 'rxjs'
import { $dialog } from '../dialog/dialog-service'

@customElement('schmancy-menu')
export default class SchmancyMenu extends $LitElement(css`
	:host {
		position: relative;
		display: inline-block;
	}
`) {
	@query('[slot="button"]')
	private buttonSlot!: HTMLSlotElement

	@query('.menu-content-hidden slot')
	private menuSlot!: HTMLSlotElement

	@state() private isOpen = false

	private get buttonElement(): HTMLElement | undefined {
		return this.buttonSlot?.assignedElements()[0] as HTMLElement
	}

	private async showMenu(event: MouseEvent) {
		if (this.isOpen) return
		this.isOpen = true

		// Create a container that will hold the menu items
		const menuContainer = document.createElement('ul')
		menuContainer.className =
			'border-outlineVariant rounded-md min-w-[160px] max-w-[320px] w-max bg-surface-default max-h-[90vh] shadow-1 overflow-y-auto'
		menuContainer.setAttribute('role', 'menu')
		menuContainer.setAttribute('aria-orientation', 'vertical')

		// Get the slotted menu items
		const menuItems = this.menuSlot?.assignedElements() || []

		// Store their original parent for restoration
		const originalParent = menuItems[0]?.parentElement

		// Temporarily append items to menu container
		menuItems.forEach(node => {
			menuContainer.appendChild(node)
		})

		// Show in dialog
		try {
			await $dialog.component(menuContainer, {
				position: event,
				hideActions: true,
				width: 'auto',
			})
		} finally {
			// Move items back to their original location
			if (originalParent) {
				menuItems.forEach(node => {
					originalParent.appendChild(node)
				})
			}
			this.isOpen = false
		}
	}

	private hideMenu() {
		if (this.isOpen) {
			$dialog.dismiss()
			this.isOpen = false
		}
	}

	firstUpdated(): void {
		// Listen for clicks on the button slot
		fromEvent<MouseEvent>(this, 'click')
			.pipe(
				tap(e => {
					// Only handle clicks on the button element
					const path = e.composedPath()
					if (path.includes(this.buttonElement as EventTarget)) {
						e.stopPropagation()
						this.showMenu(e)
					}
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()

		// Listen for menu item clicks to auto-close
		fromEvent(this, 'schmancy-menu-item-click')
			.pipe(
				tap(e => e.stopPropagation()),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => {
				this.hideMenu()
			})
	}

	render() {
		return html`
			<slot name="button">
				<schmancy-icon-button> more_vert </schmancy-icon-button>
			</slot>
			<!-- Hidden container for menu items - they'll be moved to dialog when opened -->
			<div class="menu-content-hidden" style="display: none;">
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
