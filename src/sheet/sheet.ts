import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'
import { fromEvent, merge, takeUntil, tap } from 'rxjs'
import { on } from './hook'
import style from './sheet.scss?inline'
import {
	SchmancySheetPosition,
	SheetHereMorty,
	SheetWhereAreYouRicky,
	SheetWhereAreYouRickyEvent,
} from './sheet.service'

/**
 * `<schmancy-sheet>` component
 *
 * A modal sheet component that can be positioned at the bottom or side of the viewport.
 * Supports customizable animations, focus management, and accessibility features.
 *
 * @element schmancy-sheet
 * @fires before-close - Fired before the sheet begins closing (cancelable)
 * @fires close - Fired when the sheet has closed
 * @fires open - Fired when the sheet has opened
 */
@customElement('schmancy-sheet')
export default class SchmancySheet extends $LitElement(style) {
	/** Unique identifier for the sheet */
	@property({ type: String, reflect: true }) uid!: string

	/** Controls whether the sheet is open or closed */
	@property({ type: Boolean, reflect: true }) open = false

	/** Controls visibility of the header section */
	@property({ type: String, reflect: true }) header: 'hidden' | 'visible' = 'visible'

	/** Position of the sheet */
	@property({ type: String, reflect: true }) position: SchmancySheetPosition = SchmancySheetPosition.Side

	/** Whether the sheet persists after closing */
	@property({ type: Boolean, reflect: true }) persist = false

	/** Whether clicking the overlay dismisses the sheet */
	@property({ type: Boolean, reflect: true }) allowOverlayDismiss = true

	/** Prevents closing by backdrop click, even if allowOverlayDismiss is true */
	@property({ type: Boolean }) preventBackdropClick = false

	/** Title displayed in the header */
	@property({ type: String, reflect: true }) title = ''

	/** Accessible label for the sheet (for screen readers) */
	@property({ type: String }) ariaLabel: string

	/** ARIA describedby attribute value */
	@property({ type: String }) ariaDescribedBy?: string

	/** Custom selector to specify which element receives focus when opened */
	@property({ type: String }) initialFocusSelector?: string

	/** Animation duration in milliseconds */
	@property({ type: Number }) animationDuration = 200

	/** Animation easing function */
	@property({ type: String }) animationEasing = 'ease-in-out'

	/** Attribute to specify which element should receive focus when the sheet opens */
	@property() focusAttribute = 'autofocus'

	/** Ref to the sheet container */
	@query('.sheet') private sheet!: HTMLElement

	/** Ref to the sheet body */
	@query('#body') bodyElement!: HTMLElement

	/** Collection of assigned elements */
	@queryAssignedElements({ flatten: true }) private assignedElements!: HTMLElement[]

	/** Tracks the element that had focus before the sheet opened */
	private lastFocusedElement: HTMLElement | null = null

	/** For touch interactions */
	private startY = 0
	private currentY = 0

	/** ResizeObserver instance */
	private resizeObserver: ResizeObserver | null = null

	/**
	 * Lifecycle callback for when the 'open' property changes
	 */
	@on('open')
	onOpenChange(_oldValue: boolean, newValue: boolean) {
		if (newValue) {
			this.lastFocusedElement = document.activeElement as HTMLElement
			this.addFocusTrap()
			this.focus()
			this.fireEvent('open')
		} else {
			this.removeFocusTrap()
			this.lastFocusedElement?.focus()
			this.lastFocusedElement = null
		}

		// Update CSS variables when opening/closing
		this.updateCssVariables()
	}

	/**
	 * Component connected to DOM
	 */
	connectedCallback() {
		super.connectedCallback()
		this.setupEventListeners()

		// Create resize observer
		this.resizeObserver = new ResizeObserver(() => {
			if (this.open) {
				this.updateSheetDimensions()
			}
		})

		this.resizeObserver.observe(document.body)

		// Set initial CSS variables
		this.updateCssVariables()
	}

	/**
	 * First update lifecycle callback
	 */
	firstUpdated() {
		// Add passive scroll listeners for better performance
		this.bodyElement?.addEventListener('scroll', this.handleScroll, { passive: true })
	}

	/**
	 * Component updated lifecycle callback
	 */
	updated(changedProps: Map<string, unknown>) {
		if (changedProps.has('animationDuration') || changedProps.has('animationEasing')) {
			this.updateCssVariables()
		}
	}

	/**
	 * Component disconnected from DOM
	 */
	disconnectedCallback() {
		super.disconnectedCallback()
		this.disconnecting.next(true)
		this.bodyElement?.removeEventListener('scroll', this.handleScroll)
		this.resizeObserver?.disconnect()
	}

	/**
	 * Updates CSS custom properties
	 */
	private updateCssVariables() {
		this.style.setProperty('--transition-duration', `${this.animationDuration}ms`)
		this.style.setProperty('--transition-timing', this.animationEasing)
	}

	/**
	 * Sets up event listeners
	 */
	private setupEventListeners() {
		// Handle browser back button
		const popState$ = fromEvent<PopStateEvent>(window, 'popstate').pipe(
			tap(e => {
				e.preventDefault()
				this.closeSheet()
			}),
		)

		// Handle ESC key
		const keyUp$ = fromEvent<KeyboardEvent>(window, 'keyup').pipe(
			tap(event => {
				if (event.key === 'Escape' && !this.sheetContainsFocus()) {
					this.closeSheet()
				}
			}),
		)

		// Handle inter-component communication
		const rickyComm$ = fromEvent<SheetWhereAreYouRickyEvent>(window, SheetWhereAreYouRicky).pipe(
			tap(e => {
				if (e.detail.uid === this.uid) this.announcePresence()
			}),
		)

		merge(popState$, keyUp$, rickyComm$).pipe(takeUntil(this.disconnecting)).subscribe()
	}

	/**
	 * Check if focus is within the sheet
	 */
	private sheetContainsFocus(): boolean {
		return this.sheet?.contains(document.activeElement) ?? false
	}

	/**
	 * Announce presence to the sheet service
	 */
	private announcePresence() {
		this.dispatchEvent(
			new CustomEvent(SheetHereMorty, {
				detail: { sheet: this },
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Add focus trap to keep focus within sheet when open
	 */
	private addFocusTrap() {
		document.addEventListener('focusin', this.handleFocusIn)
	}

	/**
	 * Remove focus trap
	 */
	private removeFocusTrap() {
		document.removeEventListener('focusin', this.handleFocusIn)
	}

	/**
	 * Handle focus events to trap focus
	 */
	private handleFocusIn = (e: Event) => {
		if (!this.sheet?.contains(e.target as Node)) {
			this.focus()
		}
	}

	/**
	 * Handle scroll events
	 */
	private handleScroll = () => {
		// Implement scroll handling if needed
	}

	/**
	 * Updates the aria-hidden and aria-modal attributes
	 */
	setIsSheetShown(isShown: boolean) {
		this.sheet?.setAttribute('aria-hidden', String(!isShown))
		this.sheet?.setAttribute('aria-modal', String(isShown))
	}

	/**
	 * Closes the sheet
	 */
	closeSheet() {
		// Fire before-close event, allow prevention
		const event = new CustomEvent('before-close', {
			bubbles: true,
			composed: true,
			cancelable: true,
		})

		const allowed = this.dispatchEvent(event)

		if (!allowed) return // User prevented close

		this.open = false
		this.fireEvent('close')
	}

	/**
	 * Update dimensions based on viewport
	 */
	private updateSheetDimensions() {
		if (this.position === SchmancySheetPosition.Bottom) {
			const content = this.shadowRoot?.querySelector('.content') as HTMLElement
			if (content) {
				content.style.maxHeight = `${window.innerHeight * 0.9}px`
			}
		}
	}

	/**
	 * Find the element that should receive focus
	 */
	private getFocusElement(): HTMLElement | null {
		// If initialFocusSelector is provided, use that first
		if (this.initialFocusSelector) {
			const element = this.shadowRoot?.querySelector(this.initialFocusSelector) as HTMLElement
			if (element) return element
		}

		// Otherwise, try to find element with focusAttribute
		const selector = `[${this.focusAttribute}]`
		return (this.assignedElements.find(el => el.matches(selector) || el.querySelector(selector)) as HTMLElement) ?? null
	}

	/**
	 * Set focus within the sheet
	 */
	override focus() {
		this.getFocusElement()?.focus()
	}

	/**
	 * Fire events with consistent format
	 */
	private fireEvent(name: string, detail = {}) {
		this.dispatchEvent(
			new CustomEvent(name, {
				bubbles: true,
				composed: true,
				detail,
			}),
		)
	}

	/**
	 * Handle touch start for swipe gesture
	 */
	private handleTouchStart = (e: TouchEvent) => {
		if (this.position === SchmancySheetPosition.Bottom) {
			this.startY = e.touches[0].clientY
			this.currentY = this.startY
		}
	}

	/**
	 * Handle touch move for swipe gesture
	 */
	private handleTouchMove = (e: TouchEvent) => {
		if (this.position === SchmancySheetPosition.Bottom) {
			this.currentY = e.touches[0].clientY
			const deltaY = this.currentY - this.startY

			// Only allow downward swipes to close
			if (deltaY > 0) {
				const content = e.currentTarget as HTMLElement
				content.style.transform = `translateY(${deltaY}px)`
				e.preventDefault()
			}
		}
	}

	/**
	 * Handle touch end for swipe gesture
	 */
	private handleTouchEnd = (e: TouchEvent) => {
		if (this.position === SchmancySheetPosition.Bottom) {
			const content = e.currentTarget as HTMLElement
			const deltaY = this.currentY - this.startY

			// Reset transform
			content.style.transform = ''

			// If dragged down more than 100px or 30% of height, close the sheet
			const threshold = Math.min(100, content.offsetHeight * 0.3)
			if (deltaY > threshold) {
				this.closeSheet()
			}
		}
	}

	/**
	 * Render the component
	 */
	render() {
		return html`
			<div
				class="sheet"
				role="dialog"
				aria-labelledby=${ifDefined(this.title ? 'sheet-title' : this.ariaLabel ? 'sheet-aria-label' : undefined)}
				aria-describedby=${ifDefined(this.ariaDescribedBy)}
				aria-hidden=${!this.open}
				aria-modal=${this.open}
			>
				${when(
					this.ariaLabel && !this.title,
					() => html`<span id="sheet-aria-label" class="sr-only">${this.ariaLabel}</span>`,
				)}

				<div
					class="overlay"
					@click=${(e: Event) => {
						e.stopPropagation()
						if (this.allowOverlayDismiss && !this.preventBackdropClick) {
							this.closeSheet()
						}
					}}
				></div>

				<schmancy-grid
					@touchstart=${this.handleTouchStart}
					@touchmove=${this.handleTouchMove}
					@touchend=${this.handleTouchEnd}
					rows=${this.header === 'hidden' ? '1fr' : 'auto 1fr'}
					class="content w-full"
					data-position=${this.position}
				>
					${when(
						this.header !== 'hidden',
						() =>
							html`<schmancy-sheet-header
								class="sticky top-0 z-50 w-full"
								@dismiss=${(e: CustomEvent) => {
									e.stopPropagation()
									this.closeSheet()
								}}
								id="sheet-title"
								title=${this.title}
							></schmancy-sheet-header>`,
					)}

					<schmancy-surface rounded="left" fill="all" id="body" class="overflow-hidden" type="surface">
						<schmancy-scroll>
							<slot></slot>
						</schmancy-scroll>
					</schmancy-surface>
				</schmancy-grid>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet': SchmancySheet
	}
}
