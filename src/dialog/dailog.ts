import { autoUpdate, computePosition, flip, offset, Placement, shift, size, Strategy } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

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
		overflow: auto; /* Allow scrolling for oversized content */
	}

	/* Used when centered for initial positioning */
	.dialog.centered {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -55%); /* Slight upward shift looks better */
	}
`) {
	/**
	 * Dialog title
	 */
	@property({ type: String })
	title = undefined

	/**
	 * Dialog subtitle
	 */
	@property({ type: String })
	subtitle = undefined

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
	 * Store cleanup function for position auto-updates
	 */
	private cleanupAutoUpdate?: () => void

	/**
	 * Store resize subscription
	 */
	private resizeSubscription?: { unsubscribe: () => void }

	/**
	 * Virtual element to use as reference for positioning
	 */
	private virtualReference?: {
		getBoundingClientRect: () => DOMRect
	}

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

		// Store initial position
		this.position = { x, y }

		// Create virtual reference element at the provided coordinates
		this.virtualReference = {
			getBoundingClientRect() {
				return new DOMRect(x, y, 0, 0)
			},
		}

		// Make dialog active
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

		// Clean up any auto-update subscription
		if (this.cleanupAutoUpdate) {
			this.cleanupAutoUpdate()
			this.cleanupAutoUpdate = undefined
		}

		// Resolve any pending promise
		if (this.resolvePromise) {
			this.resolvePromise(confirmed)
			this.resolvePromise = undefined
		}
	}

	/**
	 * Set up position auto-updating when dialog content changes or window resizes
	 */
	private setupPositioning(dialog: HTMLElement) {
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		// Check if this is a centered dialog
		const isCentered =
			Math.abs(this.position.x - viewportWidth / 2) < 10 && Math.abs(this.position.y - viewportHeight / 2) < 10

		if (isCentered) {
			// For centered dialogs, use CSS-based centering
			dialog.classList.add('centered')

			// Always set up auto-update for content changes, even for centered dialogs
			this.cleanupAutoUpdate = autoUpdate(
				document.body, // Use body as reference for centered dialogs
				dialog,
				() => {
					// If dialog has the centered class, ensure it stays visible
					// even when content changes its dimensions
					if (dialog.classList.contains('centered')) {
						// Adjust max-height to ensure dialog stays within viewport
						const availableHeight = window.innerHeight - 40
						if (dialog.offsetHeight > availableHeight) {
							dialog.style.maxHeight = `${availableHeight}px`
						}
					}
				},
				{
					elementResize: true,
					ancestorScroll: true,
				},
			)

			return
		}

		// Remove centered class if it exists
		dialog.classList.remove('centered')

		// Use Floating UI's autoUpdate to continually update position
		if (this.virtualReference) {
			this.cleanupAutoUpdate = autoUpdate(this.virtualReference, dialog, () => this.updatePosition(dialog), {
				ancestorScroll: true,
				ancestorResize: true,
				elementResize: true,
				animationFrame: true, // Enable continuous updates for smoother repositioning
			})

			// Initial positioning
			this.updatePosition(dialog)
		}
	}

	/**
	 * Update dialog position using Floating UI
	 */
	private async updatePosition(dialog: HTMLElement) {
		if (!this.virtualReference) return

		// Force window bounds recalculation on resize
		if (this.position.x > 0 && this.position.y > 0) {
			// Update virtual reference to consider current window size
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight

			// Ensure position is constrained to current viewport
			const x = Math.min(this.position.x, viewportWidth - 20)
			const y = Math.min(this.position.y, viewportHeight - 20)

			// Update virtual reference with current viewport-constrained position
			this.virtualReference = {
				getBoundingClientRect() {
					return new DOMRect(x, y, 0, 0)
				},
			}
		}

		const placement: Placement = 'bottom-start'
		const strategy: Strategy = 'absolute'
		const margin = 20 // Standard margin from edges

		const { x, y } = await computePosition(this.virtualReference, dialog, {
			placement,
			strategy,
			middleware: [
				// Offset from the reference point
				offset(margin),

				// Flip to opposite side if no space
				flip({
					fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
					fallbackStrategy: 'bestFit',
				}),

				// Shift along the preferred axis to stay in view
				shift({
					padding: margin, // Keep margin from viewport edges
				}),

				// Resize dialog if needed
				size({
					apply({ availableWidth, availableHeight, elements }) {
						// If dialog is wider than available space
						if (elements.floating.offsetWidth > availableWidth) {
							Object.assign(elements.floating.style, {
								maxWidth: `${Math.max(availableWidth - margin * 2, 280)}px`, // Keep at least 280px if possible
							})
						}

						// If dialog is taller than available space
						if (elements.floating.offsetHeight > availableHeight) {
							Object.assign(elements.floating.style, {
								maxHeight: `${availableHeight - margin * 2}px`,
							})
						}
					},
					padding: margin, // Keep margin from viewport edges
				}),
			],
		})

		// Apply the computed position
		Object.assign(dialog.style, {
			left: `${Math.round(x)}px`,
			top: `${Math.round(y)}px`,
			transform: 'none', // Remove any transform that might interfere
		})
	}

	/**
	 * Handle component disconnection from DOM
	 */
	disconnectedCallback() {
		super.disconnectedCallback()

		// Clean up subscriptions
		if (this.resizeSubscription) {
			this.resizeSubscription.unsubscribe()
			this.resizeSubscription = undefined
		}

		if (this.cleanupAutoUpdate) {
			this.cleanupAutoUpdate()
			this.cleanupAutoUpdate = undefined
		}
	}

	/**
	 * Handle lifecycle callback when dialog is first rendered
	 */
	firstUpdated() {
		const dialog = this.shadowRoot?.querySelector('.dialog') as HTMLElement
		if (!dialog) return

		// Set up positioning with Floating UI
		this.setupPositioning(dialog)

		// Set up window resize subscription using RxJS with debounce
		this.resizeSubscription = fromEvent(window, 'resize')
			.pipe(debounceTime(50)) // Faster response time
			.subscribe(() => {
				// Get current viewport dimensions
				const viewportWidth = window.innerWidth
				const viewportHeight = window.innerHeight

				// If using CSS centered positioning, ensure it stays centered
				const isCentered =
					Math.abs(this.position.x - viewportWidth / 2) < 10 && Math.abs(this.position.y - viewportHeight / 2) < 10

				if (isCentered) {
					// Update position to new center
					this.position = {
						x: viewportWidth / 2,
						y: viewportHeight / 2,
					}
				}

				// Always update position on resize
				this.updatePosition(dialog)
			})
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
		// Only show buttons if both confirmText and cancelText are non-empty strings
		const showButtons =
			this.confirmText && this.confirmText.trim() !== '' && this.cancelText && this.cancelText.trim() !== ''

		return html`
			<div class="overlay" @click=${this.handleCancel}></div>

			<div class="dialog" role="alertdialog" aria-modal="true">
				<schmancy-surface rounded="all" elevation="3" type="containerHigh">
					<schmancy-form @submit=${this.handleConfirm} class="p-4">
						${when(
							this.title && this.title.trim() !== '',
							() => html`
								<schmancy-typography type="title" token="md" class="mb-1"> ${this.title} </schmancy-typography>
								${when(
									this.subtitle && this.subtitle.trim() !== '',
									() => html`
										<schmancy-typography type="subtitle" token="xs" class="mb-2">
											${this.subtitle}
										</schmancy-typography>
									`,
									() => html``
								)}
							`,
						)}
						${hasCustomContent
							? html`<div class="${showButtons ? 'mb-4' : ''}"><slot name="content"></slot></div>`
							: when(
									this.message && this.message.trim() !== '',
									() => html`<schmancy-typography type="body" class="mb-4"> ${this.message} </schmancy-typography>`,
								)}
						${when(
							showButtons,
							() => html`
								<div class="flex justify-end gap-3">
									<schmancy-button variant="outlined" @click=${this.handleCancel}> ${this.cancelText} </schmancy-button>
									<schmancy-button type="submit" variant="filled"> ${this.confirmText} </schmancy-button>
								</div>
							`,
						)}
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
		subtitle?: string
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
		if (options.subtitle) dialog.subtitle = options.subtitle
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
