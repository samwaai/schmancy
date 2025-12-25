import { autoPlacement, autoUpdate, computePosition, offset, shift, size } from '@floating-ui/dom'
import { LitElement } from 'lit'
import type { Constructor } from '../../mixins/constructor'
import type { IBaseMixin } from '../../mixins/baseElement'

export interface DialogPosition {
	x: number
	y: number
}

export interface VirtualReference {
	getBoundingClientRect: () => DOMRect
}

/**
 * Interface for the DialogBase mixin methods
 */
export interface IDialogBaseMixin {
	position: DialogPosition
	show(positionOrEvent?: DialogPosition | MouseEvent | TouchEvent): Promise<boolean>
	hide(result?: boolean): void
	isCentered(): boolean
}

/**
 * Dialog mixin with smart positioning using Floating UI.
 *
 * Uses autoPlacement to find the position with MOST available space,
 * minimizing the need for content scrolling.
 */
export const DialogBase = <T extends Constructor<LitElement & IBaseMixin>>(superClass: T) => {
	class DialogBaseClass extends superClass {
		position: DialogPosition = { x: 0, y: 0 }
		protected resolvePromise?: (value: boolean) => void
		protected cleanupAutoUpdate?: () => void
		protected virtualReference?: VirtualReference

		/**
		 * Override in subclass to return the dialog element
		 */
		protected getDialogElement(): HTMLElement | null {
			return null
		}

		/**
		 * Show the dialog at a specific position
		 */
		async show(positionOrEvent?: DialogPosition | MouseEvent | TouchEvent): Promise<boolean> {
			// Cleanup previous positioning
			if (this.cleanupAutoUpdate) {
				this.cleanupAutoUpdate()
				this.cleanupAutoUpdate = undefined
			}

			let x: number, y: number

			if (!positionOrEvent) {
				x = window.innerWidth / 2
				y = window.innerHeight / 2
			} else if ('clientX' in positionOrEvent) {
				x = positionOrEvent.clientX
				y = positionOrEvent.clientY
			} else if ('touches' in positionOrEvent && positionOrEvent.touches.length) {
				x = positionOrEvent.touches[0].clientX
				y = positionOrEvent.touches[0].clientY
			} else {
				const pos = positionOrEvent as DialogPosition
				x = pos.x
				y = pos.y
			}

			this.position = { x, y }

			// Virtual reference at click position
			this.virtualReference = {
				getBoundingClientRect: () => new DOMRect(x, y, 0, 0),
			}

			// Trigger re-render with new position (for correct isCentered() in render)
			this.requestUpdate()
			await this.updateComplete

			this.setAttribute('active', '')

			// Setup Floating UI positioning for non-centered dialogs
			this.setupPositioning()

			return new Promise<boolean>(resolve => {
				this.resolvePromise = resolve
			})
		}

		/**
		 * Hide the dialog
		 */
		hide(result = false): void {
			this.removeAttribute('active')

			if (this.cleanupAutoUpdate) {
				this.cleanupAutoUpdate()
				this.cleanupAutoUpdate = undefined
			}

			if (this.resolvePromise) {
				this.resolvePromise(result)
				this.resolvePromise = undefined
			}
		}

		/**
		 * Check if position is near center
		 */
		isCentered(): boolean {
			const toleranceX = window.innerWidth * 0.3
			const toleranceY = window.innerHeight * 0.3

			return (
				Math.abs(this.position.x - window.innerWidth / 2) < toleranceX &&
				Math.abs(this.position.y - window.innerHeight / 2) < toleranceY
			)
		}

		/**
		 * Setup positioning based on whether dialog is centered or positioned
		 */
		private setupPositioning(): void {
			const dialog = this.getDialogElement()
			if (!dialog) return

			// Centered dialogs: CSS handles everything, no JS positioning needed
			if (this.isCentered()) {
				return
			}

			// Positioned dialogs: use Floating UI with autoPlacement
			if (this.virtualReference) {
				this.cleanupAutoUpdate = autoUpdate(
					this.virtualReference,
					dialog,
					() => this.updatePosition(dialog),
					{
						ancestorScroll: true,
						ancestorResize: true,
						elementResize: true,
					},
				)
				this.updatePosition(dialog)
			}
		}

		/**
		 * Update position using Floating UI.
		 * autoPlacement finds the side with MOST space to minimize scrolling.
		 */
		private async updatePosition(dialog: HTMLElement): Promise<void> {
			if (!this.virtualReference) return

			const padding = 16

			const { x, y } = await computePosition(this.virtualReference, dialog, {
				strategy: 'fixed',
				middleware: [
					// Small offset from click point
					offset(8),

					// autoPlacement: picks placement with MOST available space
					autoPlacement({
						padding,
						allowedPlacements: [
							'top-start',
							'top-end',
							'bottom-start',
							'bottom-end',
							'left-start',
							'left-end',
							'right-start',
							'right-end',
						],
					}),

					// Keep on screen
					shift({ padding }),

					// Constrain width to available space (CSS handles height via dvh)
					size({
						padding,
						apply({ availableWidth, elements }) {
							elements.floating.style.maxWidth = `${availableWidth}px`
						},
					}),
				],
			})

			Object.assign(dialog.style, {
				position: 'fixed',
				left: `${Math.round(x)}px`,
				top: `${Math.round(y)}px`,
				transform: 'none',
			})
		}

		/**
		 * Cleanup on disconnect
		 */
		disconnectedCallback(): void {
			if (this.cleanupAutoUpdate) {
				this.cleanupAutoUpdate()
				this.cleanupAutoUpdate = undefined
			}
			super.disconnectedCallback()
		}
	}

	return DialogBaseClass as Constructor<IDialogBaseMixin> & T
}
