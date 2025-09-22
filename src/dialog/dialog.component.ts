import { autoUpdate, computePosition, flip, offset, Placement, shift, size, Strategy } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { fromEvent, tap } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { DialogHereMorty, DialogWhereAreYouRicky, DialogWhereAreYouRickyEvent } from './dialog-events'

/**
 * A basic dialog web component without title or actions
 *
 * @element schmancy-dialog
 * @slot default - Content slot for dialog body
 */
@customElement('schmancy-dialog')
export class SchmancyDialog extends $LitElement(css`
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
`) {
	/**
	 * Unique identifier for the dialog instance
	 */
	@property({ type: String, reflect: true }) uid: string

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
	 * Virtual element to use as reference for positioning
	 */
	private virtualReference?: {
		getBoundingClientRect: () => DOMRect
	}

	/**
	 * Simple API: Show the dialog at a specific position
	 * @returns Promise that resolves when dialog is closed
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
	hide(result = false) {
		this.removeAttribute('active')

		// Clean up any auto-update subscription
		if (this.cleanupAutoUpdate) {
			this.cleanupAutoUpdate()
			this.cleanupAutoUpdate = undefined
		}

		// Resolve any pending promise
		if (this.resolvePromise) {
			this.resolvePromise(result)
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
			// For centered dialogs, set up auto-update for content changes
			this.cleanupAutoUpdate = autoUpdate(
				document.body, // Use body as reference for centered dialogs
				dialog,
				() => {
					// Ensure dialog stays within viewport when content changes
					const availableHeight = window.innerHeight - 40
					if (dialog.offsetHeight > availableHeight) {
						dialog.style.maxHeight = `${availableHeight}px`
					}
				},
				{
					elementResize: true,
					ancestorScroll: true,
				},
			)

			return
		}

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

	// Store resize subscription
	private resizeSubscription?: { unsubscribe: () => void }

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
	 * Handle component connection to DOM
	 */
	connectedCallback() {
		super.connectedCallback()

		// Listen for "where are you ricky" events
		fromEvent<DialogWhereAreYouRickyEvent>(window, DialogWhereAreYouRicky)
			.pipe(
				tap(e => {
					if (e.detail.uid === this.uid) this.announcePresence()
				}),
			)
			.subscribe()
	}

	/**
	 * Announce this dialog's presence to the service
	 */
	private announcePresence() {
		this.dispatchEvent(
			new CustomEvent(DialogHereMorty, {
				detail: { dialog: this },
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Handle lifecycle callback when dialog is first rendered
	 */
	firstUpdated() {
		const dialog = this.shadowRoot?.querySelector('[role="dialog"]') as HTMLElement
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
	 * Handle close action
	 */
	private handleClose() {
		this.hide(false)
		this.dispatchEvent(
			new CustomEvent('close', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		// Determine if the dialog is centered
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight
		const isCentered =
			Math.abs(this.position.x - viewportWidth / 2) < 10 && Math.abs(this.position.y - viewportHeight / 2) < 10

		const dialogClasses = {
			absolute: true,
			'w-[var(--dialog-width)]': true, // Use the specified width
			'max-w-[calc(100vw-2rem)]': true, // Prevent overflow on small screens
			'max-h-[calc(100vh-40px)]': true,
			// Centered positioning
			'top-1/2': isCentered,
			'left-1/2': isCentered,
			'-translate-x-1/2': isCentered,
			'-translate-y-[50%]': isCentered, // Slight upward shift
			'overflow-auto':true
		}

		return html`
			<div class="fixed inset-0 bg-scrim/40" @click=${this.handleClose}></div>

			<section class=${this.classMap(dialogClasses)} role="dialog" aria-modal="true">
				<schmancy-surface rounded="all" elevation="3" type="containerHigh">
								<slot></slot>
				</schmancy-surface>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-dialog': SchmancyDialog
	}
}
