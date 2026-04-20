import { autoPlacement, autoUpdate, computePosition, offset, shift, size } from '@floating-ui/dom'
import { LitElement } from 'lit'
import { distinctUntilChanged, filter, fromEvent, map, merge, Subject, takeUntil, tap } from 'rxjs'
import type { Constructor } from '../../mixins/constructor'
import type { IBaseMixin } from '../../mixins/baseElement'
import {
	BLACKBIRD_EASING,
	DURATION_ENTER,
	DURATION_EXIT,
	DURATION_BACKDROP,
	EASE_OUT,
	EASE_IN,
} from '../utils/animation'
import { reducedMotion$ } from '../directives/reduced-motion'

// Mobile breakpoint - matches Tailwind's sm breakpoint
const MOBILE_BREAKPOINT = 640

// Tablet breakpoint
const TABLET_BREAKPOINT = 1024

/**
 * Fraction of viewport a dialog can occupy before converting to bottom sheet.
 * Tablet (640–1024px): 60% — tighter screens benefit from bottom sheet sooner.
 * Desktop (>1024px):   80% — plenty of room, keep floating longer.
 */
function largeContentThreshold(): number {
	return window.innerWidth < TABLET_BREAKPOINT ? 0.6 : 0.8
}

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
	isMobile: boolean
	dragOffset: number
	show(positionOrEvent?: DialogPosition | MouseEvent | TouchEvent): Promise<boolean>
	hide(result?: boolean): Promise<void>
	isCentered(): boolean
	isAnimating(): boolean
}

/**
 * Dialog mixin with smart positioning using Floating UI.
 *
 * On mobile (< 640px), automatically switches to bottom sheet mode
 * with swipe-to-dismiss gesture. On tablet/desktop, if content exceeds
 * a viewport-dependent threshold, also opens as bottom sheet.
 */
export const DialogBase = <T extends Constructor<LitElement & IBaseMixin>>(superClass: T) => {
	class DialogBaseClass extends superClass {
		position: DialogPosition = { x: 0, y: 0 }
		isMobile = false
		dragOffset = 0

		protected resolvePromise?: (value: boolean) => void
		protected cleanupAutoUpdate?: () => void
		protected virtualReference?: VirtualReference

		// Subject to signal when to stop swipe gesture stream
		private readonly stopSwipe$ = new Subject<void>()

		// Focus trap state
		private lastFocusedElement: Element | null = null
		private inertSiblings: HTMLElement[] = []

		// Animation guard
		private animating = false

		/**
		 * Check if the dialog is currently animating
		 */
		isAnimating(): boolean {
			return this.animating
		}

		/**
		 * Override in subclass to return the dialog element
		 */
		protected getDialogElement(): HTMLElement | null {
			return null
		}

		/**
		 * Override in subclass to return the backdrop element for animations
		 */
		protected getBackdropElement(): HTMLElement | null {
			return null
		}

		/**
		 * Override in subclass to return the drag handle element for swipe gestures
		 */
		protected getDragHandleElement(): HTMLElement | null {
			return null
		}

		connectedCallback(): void {
			super.connectedCallback()
			this.setupResizeListener()
		}

		/**
		 * Listen for resize to switch between mobile/desktop modes
		 */
		private setupResizeListener(): void {
			fromEvent(window, 'resize')
				.pipe(
					map(() => window.innerWidth < MOBILE_BREAKPOINT),
					distinctUntilChanged(),
					filter(() => this.hasAttribute('active')),
					tap(isMobile => {
						if (this.isMobile !== isMobile) {
							this.isMobile = isMobile
							this.requestUpdate()
							const dialog = this.getDialogElement()
							if (dialog) {
								if (isMobile) {
									this.applyBottomSheetStyles(dialog)
									this.setupSwipeGesture(dialog)
								} else {
									this.stopSwipe$.next()
									this.setupPositioning()
								}
							}
						}
					}),
					takeUntil(this.disconnecting),
				)
				.subscribe()
		}

		/**
		 * Setup RxJS-based swipe gesture for dialog
		 */
		private setupSwipeGesture(dialog: HTMLElement): void {
			// Stop any existing swipe gesture
			this.stopSwipe$.next()

			let dragStartY = 0
			let isDragging = false
			let currentY = 0

			const dragHandle = this.getDragHandleElement()
			const dragTarget = dragHandle || dialog

			const touchStart$ = fromEvent<TouchEvent>(dragTarget, 'touchstart', { passive: true }).pipe(
				tap(e => {
					const touch = e.touches[0]
					const rect = dialog.getBoundingClientRect()
					const touchY = touch.clientY - rect.top

					// Only allow drag from top 80px or drag handle
					if (touchY > 80 && !dragHandle) return

					isDragging = true
					dragStartY = touch.clientY
					currentY = 0
					this.dragOffset = 0

					// Disable transitions for immediate feedback
					dialog.style.transition = 'none'
					dialog.style.willChange = 'transform'
				}),
			)

			const touchMove$ = fromEvent<TouchEvent>(dialog, 'touchmove', { passive: false }).pipe(
				filter(() => isDragging),
				tap(e => {
					const touch = e.touches[0]
					const deltaY = touch.clientY - dragStartY

					// Rubber-band effect for upward drag
					if (deltaY < 0) {
						currentY = deltaY * 0.2
					} else {
						currentY = deltaY
					}

					this.dragOffset = Math.max(0, deltaY)

					// Direct DOM update - 1:1 tracking
					dialog.style.transform = `translateY(${currentY}px)`

					e.preventDefault()
				}),
			)

			const touchEnd$ = merge(
				fromEvent<TouchEvent>(dialog, 'touchend', { passive: true }),
				fromEvent<TouchEvent>(dialog, 'touchcancel', { passive: true }),
			).pipe(
				filter(() => isDragging),
				tap(() => {
					isDragging = false

					// Re-enable transitions for snap animation
					dialog.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
					dialog.style.willChange = ''

					const dialogHeight = dialog.getBoundingClientRect().height
					const threshold = Math.min(100, dialogHeight * 0.25)

					if (this.dragOffset > threshold) {
						// Dismiss - animate out
						dialog.style.transform = 'translateY(100%)'
						this.hide(false)
					} else {
						// Snap back
						dialog.style.transform = 'translateY(0)'
						this.dragOffset = 0
					}
				}),
			)

			// Merge all touch streams and subscribe
			merge(touchStart$, touchMove$, touchEnd$)
				.pipe(takeUntil(merge(this.stopSwipe$, this.disconnecting)))
				.subscribe()
		}

		/**
		 * Apply bottom sheet styles for mobile
		 */
		private applyBottomSheetStyles(dialog: HTMLElement): void {
			if (this.cleanupAutoUpdate) {
				this.cleanupAutoUpdate()
				this.cleanupAutoUpdate = undefined
			}

			Object.assign(dialog.style, {
				position: '',
				left: '',
				top: '',
				transform: '',
				maxWidth: '',
			})
		}

		/**
		 * Show the dialog at a specific position
		 */
		async show(positionOrEvent?: DialogPosition | MouseEvent | TouchEvent): Promise<boolean> {
			if (this.cleanupAutoUpdate) {
				this.cleanupAutoUpdate()
				this.cleanupAutoUpdate = undefined
			}

			this.isMobile = window.innerWidth < MOBILE_BREAKPOINT

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

			this.virtualReference = {
				getBoundingClientRect: () => new DOMRect(x, y, 0, 0),
			}

			this.requestUpdate()
			await this.updateComplete

			this.setAttribute('active', '')
			await this.updateComplete

			// Save focus and set siblings to inert for focus trap
			this.lastFocusedElement = document.activeElement
			const parent = this.parentElement
			if (parent) {
				this.inertSiblings = []
				for (let i = 0; i < parent.children.length; i++) {
					const sibling = parent.children[i] as HTMLElement
					if (sibling !== this && 'inert' in sibling) {
						sibling.inert = true
						this.inertSiblings.push(sibling)
					}
				}
			}

			// Escape key listener
			fromEvent<KeyboardEvent>(document, 'keydown')
				.pipe(
					filter(e => e.key === 'Escape'),
					tap(e => {
						e.preventDefault()
						this.hide(false)
					}),
					takeUntil(merge(this.stopSwipe$, this.disconnecting)),
				)
				.subscribe()

			const dialog = this.getDialogElement()

			// If content exceeds viewport threshold on desktop, treat as bottom sheet
			const threshold = largeContentThreshold()
			if (
				!this.isMobile &&
				dialog &&
				(dialog.scrollHeight > window.innerHeight * threshold ||
					dialog.scrollWidth > window.innerWidth * threshold)
			) {
				this.isMobile = true
				this.requestUpdate()
				await this.updateComplete
			}

			if (this.isMobile) {
				if (dialog) {
					this.applyBottomSheetStyles(dialog)
					this.setupSwipeGesture(dialog)
				}
			} else {
				this.setupPositioning()
			}

			this.animating = true
			await this.animateIn()
			this.animating = false

			return new Promise<boolean>(resolve => {
				this.resolvePromise = resolve
			})
		}

		/**
		 * Animate dialog entrance
		 */
		private async animateIn(): Promise<void> {
			const dialog = this.getDialogElement()
			const backdrop = this.getBackdropElement()

			if (reducedMotion$.value) {
				if (backdrop) backdrop.style.opacity = '1'
				if (dialog) dialog.style.opacity = '1'
				return
			}

			backdrop?.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: DURATION_BACKDROP,
				easing: EASE_OUT,
				fill: 'forwards',
			})

			if (dialog) {
				const animation = this.isMobile
					? [
							{ opacity: 0, transform: 'translateY(100%)' },
							{ opacity: 1, transform: 'translateY(0)' },
						]
					: [
							{ opacity: 0, transform: 'scale(0.92) translateY(16px)' },
							{ opacity: 1, transform: 'scale(1) translateY(0)' },
						]

				await dialog.animate(animation, {
					duration: DURATION_ENTER,
					easing: BLACKBIRD_EASING,
					fill: 'forwards',
				}).finished
			}
		}

		/**
		 * Animate dialog exit
		 */
		private async animateOut(): Promise<void> {
			const dialog = this.getDialogElement()
			const backdrop = this.getBackdropElement()

			if (reducedMotion$.value) {
				if (backdrop) backdrop.style.opacity = '0'
				if (dialog) dialog.style.opacity = '0'
				return
			}

			const animations: Promise<Animation>[] = []

			if (backdrop) {
				animations.push(
					backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
						duration: DURATION_EXIT,
						easing: EASE_OUT,
						fill: 'forwards',
					}).finished,
				)
			}

			if (dialog) {
				const animation = this.isMobile
					? [
							{ opacity: 1, transform: 'translateY(0)' },
							{ opacity: 0, transform: 'translateY(100%)' },
						]
					: [
							{ opacity: 1, transform: 'scale(1) translateY(0)' },
							{ opacity: 0, transform: 'scale(0.95) translateY(8px)' },
						]

				animations.push(
					dialog.animate(animation, {
						duration: DURATION_EXIT,
						easing: EASE_IN,
						fill: 'forwards',
					}).finished,
				)
			}

			await Promise.all(animations)
		}

		/**
		 * Hide the dialog
		 */
		async hide(result = false): Promise<void> {
			this.stopSwipe$.next()

			this.animating = true
			await this.animateOut()
			this.animating = false

			this.removeAttribute('active')

			// Restore inert siblings
			for (const el of this.inertSiblings) {
				el.inert = false
			}
			this.inertSiblings = []

			// Restore focus
			if (this.lastFocusedElement) {
				const el = this.lastFocusedElement as HTMLElement
				if (typeof el.focus === 'function') {
					el.focus()
				}
				this.lastFocusedElement = null
			}

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
		 * Check if position is near center (only skip Floating UI for truly centered dialogs)
		 */
		isCentered(): boolean {
			// Use tight tolerance (5%) - only skip Floating UI when position is very close to center
			const toleranceX = window.innerWidth * 0.05
			const toleranceY = window.innerHeight * 0.05

			return (
				Math.abs(this.position.x - window.innerWidth / 2) < toleranceX &&
				Math.abs(this.position.y - window.innerHeight / 2) < toleranceY
			)
		}

		/**
		 * Setup Floating UI positioning for desktop
		 */
		private setupPositioning(): void {
			const dialog = this.getDialogElement()
			if (!dialog) return

			if (this.isCentered()) return

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
		 * Update position using Floating UI
		 */
		private async updatePosition(dialog: HTMLElement): Promise<void> {
			if (!this.virtualReference) return

			const padding = 16

			const { x, y } = await computePosition(this.virtualReference, dialog, {
				strategy: 'fixed',
				middleware: [
					offset(8),
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
					shift({ padding }),
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

		disconnectedCallback(): void {
			this.stopSwipe$.next()
			if (this.cleanupAutoUpdate) {
				this.cleanupAutoUpdate()
				this.cleanupAutoUpdate = undefined
			}
			super.disconnectedCallback()
		}
	}

	return DialogBaseClass as Constructor<IDialogBaseMixin> & T
}
