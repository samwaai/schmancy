import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

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
	}

	.dialog {
		position: absolute;
		max-width: var(--dialog-width);
		width: max-content;
		max-height: calc(100vh - 40px); /* Prevent exceeding viewport height */
		/* Center initially */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -55%); /* Slight upward shift looks better */
		overflow: auto; /* Allow scrolling for oversized content */
	}
`) {
	/**
	 * Dialog title
	 */
	@property({ type: String })
	title = undefined

	/**
	 * Dialog message
	 */
	@property({ type: String })
	message = undefined

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
	async show(positionOrEvent?: { x: number; y: number } | MouseEvent | TouchEvent): Promise<boolean> {
		// Extract position from event or use direct coordinates
		let x: number, y: number

		if (!positionOrEvent) {
			// Default to center of viewport if no position provided
			x = window.innerWidth / 2
			y = window.innerHeight / 2
		} else if ('clientX' in positionOrEvent) {
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

		// Pre-calculate position before showing dialog
		this.position = this.calculatePosition(x, y)

		// Make dialog active but ensure position is calculated first
		// to prevent visual bouncing
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
	 * with viewport boundary checks to prevent dialogs from appearing off-screen
	 */
	private calculatePosition(x: number, y: number) {
		// We can't know the exact dimensions until the dialog is rendered
		// But we can make an initial adjustment to improve positioning
		// For more accurate positioning, we'll do a second adjustment in firstUpdated

		// Provide some margin from edges
		const margin = 20

		// Get viewport dimensions
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		// Ensure initial x is within viewport bounds
		x = Math.max(margin, Math.min(x, viewportWidth - margin))

		// Ensure initial y is within viewport bounds
		y = Math.max(margin, Math.min(y, viewportHeight - margin))

		return { x, y }
	}

	/**
	 * Handle lifecycle callback when dialog is first rendered
	 */
	firstUpdated() {
		// Immediate positioning without animations
		const dialog = this.shadowRoot?.querySelector('.dialog') as HTMLElement
		if (!dialog) return

		// Run synchronously to ensure immediate positioning
		// Get dialog dimensions
		const width = dialog.offsetWidth
		const height = dialog.offsetHeight

		// Get viewport dimensions
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		// Standard margin from edges
		const margin = 20

		// Get dialog initial position
		let { x, y } = this.position

		// Check if this is a centered dialog (default case or explicitly centered)
		const isCentered = Math.abs(x - viewportWidth / 2) < 10 && Math.abs(y - viewportHeight / 2) < 10

		if (isCentered) {
			// For centered dialogs, keep using the CSS transform-based centering
			return
		}

		// For non-centered dialogs, calculate the ideal position
		// HORIZONTAL POSITIONING
		// First check if dialog extends beyond right edge
		if (x + width > viewportWidth - margin) {
			// Try to align to right edge with margin
			x = viewportWidth - width - margin
		}

		// Make sure it's not off the left edge either
		if (x < margin) {
			x = margin
		}

		// If dialog is wider than viewport, center it
		if (width > viewportWidth - margin * 2) {
			x = (viewportWidth - width) / 2
		}

		// VERTICAL POSITIONING
		// Check if the dialog extends beyond bottom edge
		if (y + height > viewportHeight - margin) {
			// Try to position above the click point if there's space
			if (y > height + margin) {
				// Position above the click point
				y = y - height - margin
			} else {
				// Otherwise, try to center vertically
				y = Math.max(margin, (viewportHeight - height) / 2)
			}
		}

		// Make sure it's not off the top edge
		if (y < margin) {
			y = margin
		}

		// If dialog is taller than viewport, align to top with margin
		if (height > viewportHeight - margin * 2) {
			y = margin
		}

		// Apply position immediately without animations
		dialog.style.transform = 'none' // Remove transform-based centering
		dialog.style.left = `${Math.max(0, Math.round(x))}px`
		dialog.style.top = `${Math.max(0, Math.round(y))}px`
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
		// For initial rendering, use transform-based centering from CSS
		// firstUpdated will handle precise positioning after measuring
		const hasCustomContent = this.querySelectorAll('[slot="content"]').length > 0

		return html`
			<div class="overlay" @click=${this.handleCancel}></div>

			<div class="dialog" role="alertdialog" aria-modal="true">
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
		position?: { x: number; y: number } | MouseEvent | TouchEvent
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
	 * Even simpler shorthand method - just pass message and optionally an event
	 */
	static async ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean> {
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
