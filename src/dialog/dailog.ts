import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { when } from 'lit/directives/when'

/**
 * A confirm dialog web component with custom content support
 *
 * @element confirm-dialog
 * @slot content - Optional slot for custom content
 */
@customElement('confirm-dialog')
export class ConfirmDialog extends $LitElement(css`
	:host {
		position: fixed;
		z-index: 10000;
		inset: 0;
		display: none;
		--dialog-width: 360px;
	}

	:host([active]) {
		display: block;
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		animation: fade-in 150ms ease;
	}

	.dialog {
		position: absolute;
		max-width: var(--dialog-width);
		width: max-content;
		animation: pop-in 150ms ease;
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`) {
	/**
	 * Dialog title
	 */
	@property({ type: String })
	title = 'Confirm Action'

	/**
	 * Dialog message
	 */
	@property({ type: String })
	message = 'Are you sure you want to proceed?'

	/**
	 * Text for confirm button
	 */
	@property({ type: String, attribute: 'confirm-text' })
	confirmText = 'Confirm'

	/**
	 * Text for cancel button
	 */
	@property({ type: String, attribute: 'cancel-text' })
	cancelText = 'Cancel'

	/**
	 * Dialog variant (affects button colors)
	 */
	@property({ type: String })
	variant: 'default' | 'danger' = 'default'

	/**
	 * Current position of the dialog
	 */
	private position = { x: 0, y: 0 }

	/**
	 * Current active promise resolver
	 */
	private resolvePromise?: (value: boolean) => void

	/**
	 * Simple API: Show the dialog at a specific position
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	async show(positionOrEvent: { x: number; y: number } | MouseEvent | TouchEvent): Promise<boolean> {
		// Extract position from event or use direct coordinates
		let x: number, y: number

		if ('clientX' in positionOrEvent) {
			// It's a mouse event
			x = positionOrEvent.clientX
			y = positionOrEvent.clientY
		} else if ('touches' in positionOrEvent && positionOrEvent.touches.length) {
			// It's a touch event
			x = positionOrEvent.touches[0].clientX
			y = positionOrEvent.touches[0].clientY
		} else {
			// It's a position object with x,y coordinates
			const pos = positionOrEvent as { x: number; y: number }
			x = pos.x
			y = pos.y
		}

		// Set position and make dialog visible
		this.position = this.calculatePosition(x, y)
		this.setAttribute('active', '')

		// Return a promise that resolves when the user makes a choice
		return new Promise<boolean>(resolve => {
			this.resolvePromise = resolve
		})
	}

	/**
	 * Simple API: Hide the dialog
	 */
	hide(confirmed = false) {
		this.removeAttribute('active')

		// Resolve any pending promise
		if (this.resolvePromise) {
			this.resolvePromise(confirmed)
			this.resolvePromise = undefined
		}
	}

	/**
	 * Calculate optimal position based on click coordinates
	 */
	private calculatePosition(x: number, y: number) {
		// Default to click position
		return { x, y }
	}

	/**
	 * Handle lifecycle callback when dialog is first rendered
	 */
	firstUpdated() {
		// Optimize position after first render when we know the size
		setTimeout(() => {
			const dialog = this.shadowRoot?.querySelector('.dialog') as HTMLElement
			if (!dialog) return

			// Get dialog dimensions
			const width = dialog.offsetWidth
			const height = dialog.offsetHeight

			// Get viewport dimensions
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight

			// Reposition if needed to keep dialog in viewport
			let { x, y } = this.position

			// Make sure dialog stays within viewport horizontally
			if (x + width > viewportWidth - 16) {
				x = Math.max(16, viewportWidth - width - 16)
			}

			// Make sure dialog stays within viewport vertically
			if (y + height > viewportHeight - 16) {
				// Position above if space available, otherwise at top
				if (y > height + 32) {
					y = y - height - 16
				} else {
					y = 16
				}
			}

			// Update dialog position
			dialog.style.left = `${x}px`
			dialog.style.top = `${y}px`
		}, 0)
	}

	/**
	 * Handle confirm action
	 */
	private handleConfirm() {
		this.hide(true)
		this.dispatchEvent(
			new CustomEvent('confirm', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Handle cancel action
	 */
	private handleCancel() {
		this.hide(false)
		this.dispatchEvent(
			new CustomEvent('cancel', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		const dialogStyles = {
			left: `${this.position.x}px`,
			top: `${this.position.y}px`,
		}

		const hasCustomContent = this.querySelectorAll('[slot="content"]').length > 0

		return html`
			<div class="overlay" @click=${this.handleCancel}></div>

			<div class="dialog" style=${styleMap(dialogStyles)} role="alertdialog" aria-modal="true">
				<schmancy-surface rounded="all" elevation="3" type="containerHigh">
					<schmancy-form @submit=${this.handleConfirm} class="p-4">
						${when(
							this.title,
							() =>
								html` <schmancy-typography type="title" token="md" class="mb-2"> ${this.title} </schmancy-typography>`,
						)}
						${hasCustomContent
							? html`<div class="mb-4"><slot name="content"></slot></div>`
							: html`<schmancy-typography type="body" class="mb-4"> ${this.message} </schmancy-typography>`}

						<div class="flex justify-end gap-3">
							<schmancy-button variant="outlined" @click=${this.handleCancel}> ${this.cancelText} </schmancy-button>

							<schmancy-button type="submit" variant="filled"> ${this.confirmText} </schmancy-button>
						</div>
					</schmancy-form>
				</schmancy-surface>
			</div>
		`
	}

	/**
	 * Static helper for even simpler API
	 */
	static async confirm(options: {
		title?: string
		message?: string
		confirmText?: string
		cancelText?: string
		variant?: 'default' | 'danger'
		position: { x: number; y: number } | MouseEvent | TouchEvent
		width?: string
	}): Promise<boolean> {
		// Create dialog if it doesn't exist
		let dialog = document.querySelector('confirm-dialog') as ConfirmDialog

		if (!dialog) {
			dialog = document.createElement('confirm-dialog') as ConfirmDialog
			document.body.appendChild(dialog)
		}

		// Set options
		if (options.title) dialog.title = options.title
		if (options.message) dialog.message = options.message
		if (options.confirmText) dialog.confirmText = options.confirmText
		if (options.cancelText) dialog.cancelText = options.cancelText
		if (options.variant) dialog.variant = options.variant
		if (options.width) dialog.style.setProperty('--dialog-width', options.width)

		// Show dialog and return promise
		return dialog.show(options.position)
	}

	/**
	 * Even simpler shorthand method - just pass the event and message
	 */
	static async ask(event: MouseEvent | TouchEvent, message: string): Promise<boolean> {
		return this.confirm({
			message,
			position: event,
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'confirm-dialog': ConfirmDialog
	}
}
